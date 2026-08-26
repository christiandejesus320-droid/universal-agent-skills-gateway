import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { completeChat, listProviders, streamChat } from './provider.js';
import { discoverSkills } from './registry.js';
import type { GatewayRequest } from './types.js';

const port = Number(process.env.PORT ?? 8787);
const token = process.env.GATEWAY_TOKEN;
const catalogPath = process.env.SKILLS_CATALOG ?? join(process.cwd(), 'catalog', 'skills.json');
const skillRoots = (process.env.SKILL_ROOTS ?? join(process.cwd(), 'skills')).split(',').map((value) => value.trim()).filter(Boolean);

function json(res: ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify(payload));
}

function authorized(req: IncomingMessage): boolean {
  if (!token) return true;
  const header = req.headers.authorization ?? '';
  return header === `Bearer ${token}` || req.headers['x-gateway-token'] === token;
}

async function body(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

async function catalog(): Promise<unknown> {
  return JSON.parse(await readFile(catalogPath, 'utf8'));
}

function skillSystemPrompt(skill: { name: string; description: string; body: string }): string {
  return [`You are executing the universal skill "${skill.name}".`, `Description: ${skill.description}`, '', skill.body].join('\n');
}

async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, authorization, x-gateway-token', 'access-control-allow-methods': 'GET,POST,OPTIONS' });
    res.end();
    return;
  }
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { ok: true, service: 'universal-agent-skills-gateway', time: new Date().toISOString() });
  if (!authorized(req)) return json(res, 401, { error: 'unauthorized' });
  if (req.method === 'GET' && url.pathname === '/v1/models') return json(res, 200, { object: 'list', data: listProviders().map((p) => ({ id: p.defaultModel, provider: p.id, enabled: p.enabled })) });
  if (req.method === 'GET' && url.pathname === '/v1/skills') {
    const [remoteCatalog, localSkills] = await Promise.all([catalog(), discoverSkills(skillRoots)]);
    return json(res, 200, { catalog: remoteCatalog, local: localSkills.map(({ name, description, compatibility, license }) => ({ name, description, compatibility, license })) });
  }

  if (req.method === 'POST' && url.pathname === '/v1/chat/completions') {
    const request = JSON.parse(await body(req)) as GatewayRequest;
    if (!Array.isArray(request.messages) || request.messages.length === 0) return json(res, 400, { error: 'messages must be a non-empty array' });
    if (request.skill) {
      const local = (await discoverSkills(skillRoots)).find((item) => item.name === request.skill);
      if (local) request.messages = [{ role: 'system', content: skillSystemPrompt(local) }, ...request.messages];
    }
    if (request.stream !== false) {
      res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'access-control-allow-origin': '*' });
      try {
        for await (const chunk of streamChat(request)) res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        res.write('data: [DONE]\n\n');
      } catch (error) {
        res.write(`event: error\ndata: ${JSON.stringify({ error: error instanceof Error ? error.message : String(error) })}\n\n`);
      } finally { res.end(); }
      return;
    }
    return json(res, 200, await completeChat(request));
  }

  if (req.method === 'POST' && url.pathname === '/mcp') {
    const rpc = JSON.parse(await body(req)) as { id?: string | number; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };
    if (rpc.method === 'initialize') return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'universal-agent-skills-gateway', version: '0.1.0' } } });
    if (rpc.method === 'tools/list') return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { tools: [
      { name: 'skills_list', description: 'List the universal skill catalog and local skills.', inputSchema: { type: 'object', properties: {} } },
      { name: 'models_list', description: 'List configured model providers.', inputSchema: { type: 'object', properties: {} } },
      { name: 'chat', description: 'Run a model through the gateway.', inputSchema: { type: 'object', properties: { messages: { type: 'array' }, model: { type: 'string' }, provider: { type: 'string' }, skill: { type: 'string' } }, required: ['messages'] } },
    ] } });
    if (rpc.method === 'tools/call') {
      const name = rpc.params?.name;
      if (name === 'skills_list') return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { content: [{ type: 'text', text: JSON.stringify({ catalog: await catalog(), local: await discoverSkills(skillRoots) }) }] } });
      if (name === 'models_list') return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { content: [{ type: 'text', text: JSON.stringify(listProviders()) }] } });
      if (name === 'chat') {
        const args = (rpc.params?.arguments ?? {}) as unknown as GatewayRequest;
        const result = await completeChat(args);
        return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { content: [{ type: 'text', text: result.content }], structuredContent: result } });
      }
    }
    return json(res, 400, { jsonrpc: '2.0', id: rpc.id, error: { code: -32601, message: 'Method or tool not found' } });
  }
  return json(res, 404, { error: 'not_found' });
}

const server = createServer((req, res) => { route(req, res).catch((error) => json(res, 500, { error: error instanceof Error ? error.message : String(error) })); });
server.listen(port, '0.0.0.0', () => console.log(`universal-agent-skills-gateway listening on http://0.0.0.0:${port}`));
