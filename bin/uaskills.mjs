#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const gateway = process.env.UNIVERSAL_SKILLS_GATEWAY ?? 'http://127.0.0.1:8787';
const token = process.env.UNIVERSAL_SKILLS_TOKEN;
const catalogFile = join(root, 'catalog', 'skills.json');

function usage() {
  console.log(`uaskills — universal Agent Skills runtime\n\nCommands:\n  list [query]          List catalog skills\n  validate              Validate local SKILL.md files\n  models                List configured gateway providers\n  run <skill> <prompt>  Run a skill through the gateway\n  mcp-config            Print generic MCP configuration\n\nEnvironment:\n  UNIVERSAL_SKILLS_GATEWAY  Gateway URL (default http://127.0.0.1:8787)\n  UNIVERSAL_SKILLS_TOKEN    Optional gateway bearer token`);
}

async function request(path, init = {}) {
  const headers = { ...(init.headers ?? {}) };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`${gateway}${path}`, { ...init, headers });
  const text = await response.text();
  if (!response.ok) throw new Error(`${response.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

async function findSkillFiles(dir, depth = 0, result = []) {
  if (depth > 3) return result;
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return result; }
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const child = join(dir, entry.name);
    try { await stat(join(child, 'SKILL.md')); result.push(join(child, 'SKILL.md')); continue; } catch {}
    await findSkillFiles(child, depth + 1, result);
  }
  return result;
}

async function validate() {
  const files = await findSkillFiles(join(root, 'skills'));
  const errors = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const match = text.match(/^---\n([\s\S]*?)\n---/);
    const name = match?.[1]?.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = match?.[1]?.match(/^description:\s*(.+)$/m)?.[1]?.trim();
    const dir = file.split('/').at(-2);
    if (!name || !description || name !== dir || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) errors.push(`${file}: invalid name/description/frontmatter`);
  }
  console.log(JSON.stringify({ valid: errors.length === 0, files: files.length, errors }, null, 2));
  process.exitCode = errors.length ? 1 : 0;
}

const [command, ...args] = process.argv.slice(2);
try {
  if (!command || command === 'help' || command === '--help') usage();
  else if (command === 'list') {
    const data = JSON.parse(await readFile(catalogFile, 'utf8'));
    const query = args.join(' ').toLowerCase();
    const skills = data.skills.filter((item) => !query || `${item.slug} ${item.category} ${item.summary}`.toLowerCase().includes(query));
    console.table(skills.map(({ id, slug, category, source, status }) => ({ id, slug, category, source, status })));
  } else if (command === 'validate') await validate();
  else if (command === 'models') console.log(JSON.stringify(await request('/v1/models'), null, 2));
  else if (command === 'run') {
    const skill = args.shift();
    const prompt = args.join(' ');
    if (!skill || !prompt) throw new Error('Usage: uaskills run <skill> <prompt>');
    const headers = { 'content-type': 'application/json' };
    if (token) headers.authorization = `Bearer ${token}`;
    const response = await fetch(`${gateway}/v1/chat/completions`, { method: 'POST', headers, body: JSON.stringify({ skill, messages: [{ role: 'user', content: prompt }], stream: true }) });
    if (!response.ok || !response.body) throw new Error(`${response.status}: ${await response.text()}`);
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = '';
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      buffer += decoder.decode(value, { stream: true });
      for (const line of buffer.split('\n')) if (line.startsWith('data:') && line.slice(5).trim() !== '[DONE]') {
        try { const event = JSON.parse(line.slice(5)); if (event.delta) process.stdout.write(event.delta); } catch {}
      }
      buffer = buffer.split('\n').at(-1) ?? '';
    }
    process.stdout.write('\n');
  } else if (command === 'mcp-config') console.log(JSON.stringify({ mcpServers: { 'universal-agent-skills': { url: `${gateway}/mcp`, headers: token ? { Authorization: `Bearer ${token}` } : {} } } }, null, 2));
  else usage();
} catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
