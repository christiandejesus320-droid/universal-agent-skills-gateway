import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { completeChat, listProviders, streamChat } from './provider.js';
import { discoverSkills } from './registry.js';
import type { GatewayRequest } from './types.js';

const port = Number(process.env.PORT ?? 8787);
const token = process.env.GATEWAY_TOKEN;
const catalogPath = process.env.SKILLS_CATALOG ?? join(process.cwd(), 'catalog', 'skills.json');
const designCatalogPath = process.env.DESIGN_CATALOG ?? join(process.cwd(), 'library', 'design-catalog.json');
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

async function designCatalog(): Promise<any> {
  return JSON.parse(await readFile(designCatalogPath, 'utf8'));
}

async function serveLibraryAsset(pathname: string, res: ServerResponse): Promise<boolean> {
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/library\/?/, '');
  const file = normalize(join(process.cwd(), 'library', relative));
  const root = normalize(join(process.cwd(), 'library'));
  if (!file.startsWith(`${root}/`)) return false;
  try {
    const content = await readFile(file);
    const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jfif': 'image/jpeg' };
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-cache', 'access-control-allow-origin': '*' });
    res.end(content);
    return true;
  } catch { return false; }
}

function searchDesignComponents(data: any, query: string, level?: string, tags: string[] = [], limit = 20): any[] {
  const needle = query.toLowerCase();
  return (data.components ?? []).filter((component: any) => {
    const haystack = JSON.stringify(component).toLowerCase();
    const levelMatch = !level || component.level === level;
    const tagsMatch = tags.length === 0 || tags.every((tag) => (component.tags ?? []).includes(tag));
    return levelMatch && tagsMatch && haystack.includes(needle);
  }).slice(0, Math.min(Math.max(limit, 1), 50));
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
  if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { ok: true, service: 'universal-design-ui-library', time: new Date().toISOString() });
  if (req.method === 'GET' && url.pathname === '/events') {
    res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'access-control-allow-origin': '*' });
    res.write(`data: ${JSON.stringify({ type: 'library.ready', version: '2026.1' })}\n\n`);
    const heartbeat = setInterval(() => res.write(`data: ${JSON.stringify({ type: 'library.heartbeat', at: new Date().toISOString() })}\n\n`), 15000);
    req.on('close', () => clearInterval(heartbeat));
    return;
  }
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname.startsWith('/library/'))) {
    if (await serveLibraryAsset(url.pathname, res)) return;
  }
  if (req.method === 'GET' && (url.pathname === '/v1/design/tokens' || url.pathname === '/v1/design/catalog' || url.pathname.startsWith('/v1/design/components/'))) {
    // Read-only design library queries are intentionally public; mutation and model execution remain protected.
  } else if (!authorized(req)) return json(res, 401, { error: 'unauthorized' });
  if (req.method === 'GET' && url.pathname === '/v1/models') return json(res, 200, { object: 'list', data: listProviders().map((p) => ({ id: p.defaultModel, provider: p.id, enabled: p.enabled })) });
  if (req.method === 'GET' && url.pathname === '/v1/design/tokens') {
    const data = await designCatalog();
    const theme = url.searchParams.get('theme');
    return json(res, 200, { version: data.version, tokens: theme && theme !== 'all' ? { colors: { [theme]: data.tokens.colors[theme] }, spacing: data.tokens.spacing, radii: data.tokens.radii, motion: data.tokens.motion, elevation: data.tokens.elevation, typography: data.tokens.typography } : data.tokens });
  }
  if (req.method === 'GET' && url.pathname === '/v1/design/catalog') return json(res, 200, await designCatalog());
  if (req.method === 'GET' && url.pathname.startsWith('/v1/design/components/')) {
    const id = decodeURIComponent(url.pathname.slice('/v1/design/components/'.length));
    const data = await designCatalog(); const component = (data.components ?? []).find((item: any) => item.id === id);
    return component ? json(res, 200, component) : json(res, 404, { error: 'component_not_found' });
  }
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
      { name: 'chat', description: 'Run a model through the optional gateway adapter.', inputSchema: { type: 'object', properties: { messages: { type: 'array' }, model: { type: 'string' }, provider: { type: 'string' }, skill: { type: 'string' } }, required: ['messages'] } },
      { name: 'get_design_tokens', description: 'Returns bilingual OLED/high-contrast design tokens.', inputSchema: { type: 'object', properties: { theme: { type: 'string', enum: ['oled', 'highContrast', 'all'] } }, additionalProperties: false } },
      { name: 'render_component', description: 'Returns a safe render specification for a catalog component.', inputSchema: { type: 'object', required: ['component_id', 'props'], properties: { component_id: { type: 'string' }, props: { type: 'object' }, language: { type: 'string', enum: ['en', 'es'] } }, additionalProperties: false } },
      { name: 'search_ui_catalog', description: 'Searches components by problem, purpose, tags, level, or bilingual text.', inputSchema: { type: 'object', required: ['query'], properties: { query: { type: 'string' }, level: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, limit: { type: 'integer', minimum: 1, maximum: 50 } }, additionalProperties: false } },
    ] } });
    if (rpc.method === 'tools/call') {
      const name = rpc.params?.name;
      if (name === 'skills_list') return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { content: [{ type: 'text', text: JSON.stringify({ catalog: await catalog(), local: await discoverSkills(skillRoots) }) }] } });
      if (name === 'models_list') return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { content: [{ type: 'text', text: JSON.stringify(listProviders()) }] } });
      if (name === 'get_design_tokens') {
        const args = (rpc.params?.arguments ?? {}) as { theme?: string }; const data = await designCatalog();
        return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { content: [{ type: 'text', text: JSON.stringify(args.theme && args.theme !== 'all' ? { [args.theme]: data.tokens.colors[args.theme], spacing: data.tokens.spacing, radii: data.tokens.radii, motion: data.tokens.motion } : data.tokens) }] } });
      }
      if (name === 'search_ui_catalog') {
        const args = (rpc.params?.arguments ?? {}) as { query?: string; level?: string; tags?: string[]; limit?: number }; const data = await designCatalog();
        const results = searchDesignComponents(data, args.query ?? '', args.level, args.tags ?? [], args.limit ?? 20);
        return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { content: [{ type: 'text', text: JSON.stringify(results) }] } });
      }
      if (name === 'render_component') {
        const args = (rpc.params?.arguments ?? {}) as { component_id?: string; props?: Record<string, unknown>; language?: 'en' | 'es' }; const data = await designCatalog();
        const component = (data.components ?? []).find((item: any) => item.id === args.component_id);
        if (!component) return json(res, 200, { jsonrpc: '2.0', id: rpc.id, error: { code: -32004, message: 'Component not found' } });
        return json(res, 200, { jsonrpc: '2.0', id: rpc.id, result: { content: [{ type: 'text', text: JSON.stringify({ component_id: component.id, level: component.level, name: component.name, props: args.props ?? {}, states: component.states ?? [], tailwind: component.tailwind ?? null, safe: true }) }] } });
      }
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
