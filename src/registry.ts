import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { SkillDocument, SkillRecord } from './types.js';

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith('---\n')) return { meta: {}, body: raw };
  const end = raw.indexOf('\n---', 4);
  if (end < 0) return { meta: {}, body: raw };
  const header = raw.slice(4, end);
  const body = raw.slice(end + 4).replace(/^\n/, '');
  const meta: Record<string, string> = {};
  for (const line of header.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) meta[match[1]!] = match[2]!.replace(/^['"]|['"]$/g, '');
  }
  return { meta, body };
}

export function validateSkillDocument(doc: SkillDocument): string[] {
  const errors: string[] = [];
  if (!doc.name || doc.name.length > 64 || !NAME_RE.test(doc.name)) errors.push('name must be lowercase kebab-case and 1-64 chars');
  if (!doc.description || doc.description.length > 1024) errors.push('description is required and must be <=1024 chars');
  const directory = doc.root.split('/').at(-1);
  if (directory && directory !== doc.name) errors.push(`name must match parent directory (${directory})`);
  return errors;
}

export async function loadSkill(root: string): Promise<SkillDocument> {
  const path = join(root, 'SKILL.md');
  const raw = await readFile(path, 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const doc: SkillDocument = {
    name: meta.name ?? root.split('/').at(-1) ?? 'unknown',
    description: meta.description ?? '',
    ...(meta.compatibility ? { compatibility: meta.compatibility } : {}),
    ...(meta.license ? { license: meta.license } : {}),
    metadata: meta,
    body,
    root: resolve(root),
  };
  const errors = validateSkillDocument(doc);
  if (errors.length) throw new Error(`Invalid skill ${doc.name}: ${errors.join('; ')}`);
  return doc;
}

async function walk(root: string, depth: number, out: SkillDocument[]): Promise<void> {
  if (depth > 3) return;
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const child = join(root, entry.name);
    try {
      await stat(join(child, 'SKILL.md'));
      try { out.push(await loadSkill(child)); } catch { /* invalid remote/local skills are quarantined */ }
      continue;
    } catch { /* not a skill directory */ }
    await walk(child, depth + 1, out);
  }
}

export async function discoverSkills(roots: string[]): Promise<SkillDocument[]> {
  const result: SkillDocument[] = [];
  for (const root of roots) {
    try {
      await stat(join(root, 'SKILL.md'));
      result.push(await loadSkill(root));
    } catch {
      try { await walk(resolve(root), 0, result); } catch { /* missing root */ }
    }
  }
  const byName = new Map<string, SkillDocument>();
  for (const skill of result) if (!byName.has(skill.name)) byName.set(skill.name, skill);
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function catalogToSkills(catalog: { skills: SkillRecord[] }): SkillRecord[] {
  return catalog.skills.filter((item) => item.status !== 'blocked');
}
