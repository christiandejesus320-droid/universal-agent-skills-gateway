import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const readJson = async (path) => JSON.parse(await readFile(join(root, path), 'utf8'));

function hasBilingualValue(value) {
  return value && typeof value === 'object' && typeof value.en === 'string' && value.en.trim() && typeof value.es === 'string' && value.es.trim();
}

function frontmatter(raw) {
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end < 0) return null;
  const lines = raw.slice(3, end).split('\n');
  return Object.fromEntries(lines.filter((line) => line.includes(':')).map((line) => {
    const index = line.indexOf(':');
    return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  }));
}

const catalog = await readJson('library/design-catalog.json');
if (catalog.version !== '2026.1') fail('library/design-catalog.json must declare version 2026.1');
if (!catalog.tokens?.colors?.oled || !catalog.tokens?.colors?.highContrast) fail('Both OLED and highContrast color themes are required');
for (const group of ['spacing', 'radii', 'motion', 'typography']) if (!catalog.tokens[group]) fail(`Missing token group: ${group}`);
if (!Array.isArray(catalog.components) || catalog.components.length < 10) fail('The UI catalog must contain at least 10 components');
const ids = new Set();
for (const component of catalog.components) {
  if (!component.id || ids.has(component.id)) fail(`Duplicate or missing component id: ${component.id ?? '<missing>'}`);
  ids.add(component.id);
  for (const field of ['level', 'name', 'problem', 'purpose', 'tags', 'inputs', 'outputs']) if (!(field in component)) fail(`${component.id}: missing ${field}`);
  for (const field of ['name', 'problem', 'purpose']) if (!hasBilingualValue(component[field])) fail(`${component.id}: ${field} must contain en and es`);
  if (!Array.isArray(component.tags) || component.tags.length === 0) fail(`${component.id}: tags cannot be empty`);
}

const tools = await readJson('library/mcp-tools.schema.json');
for (const name of ['get_design_tokens', 'render_component', 'search_ui_catalog']) {
  const tool = tools.tools?.[name];
  if (!tool?.name || !tool.inputSchema || !tool.outputSchema) fail(`MCP schema incomplete: ${name}`);
}

const skillDirs = await readdir(join(root, 'skills'), { withFileTypes: true });
for (const dir of skillDirs.filter((entry) => entry.isDirectory())) {
  const path = join(root, 'skills', dir.name, 'SKILL.md');
  let raw;
  try { raw = await readFile(path, 'utf8'); } catch { fail(`${dir.name}: missing SKILL.md`); continue; }
  const meta = frontmatter(raw);
  if (!meta?.name || !meta?.description) fail(`${dir.name}: frontmatter requires name and description`);
  for (const marker of ['Problem / Problema', 'Purpose / Propósito', 'Inputs / Entradas', 'Outputs / Salidas', 'States / Estados', 'Accessibility / Accesibilidad']) if (!raw.includes(marker)) fail(`${dir.name}: missing bilingual marker ${marker}`);
}

const source = await readFile(join(root, 'src/server.ts'), 'utf8');
for (const endpoint of ['/v1/design/tokens', '/v1/design/catalog', '/v1/design/components/', '/events']) if (!source.includes(endpoint)) fail(`Missing library endpoint: ${endpoint}`);

if (failures.length) {
  console.error(JSON.stringify({ valid: false, errors: failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ valid: true, components: catalog.components.length, localSkills: skillDirs.filter((entry) => entry.isDirectory()).length, mcpTools: 3 }, null, 2));
