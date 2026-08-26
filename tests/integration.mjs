import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

const mock = createServer((req, res) => {
  if (req.url !== '/v1/chat/completions') return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': 'text/event-stream' });
  res.write(`data: ${JSON.stringify({ id: 'mock-1', choices: [{ delta: { content: 'gateway-' } }] })}\n\n`);
  res.write(`data: ${JSON.stringify({ id: 'mock-1', choices: [{ delta: { content: 'ok' } }] })}\n\n`);
  res.write('data: [DONE]\n\n');
  res.end();
});
await new Promise((resolve) => mock.listen(0, '127.0.0.1', resolve));
const mockPort = mock.address().port;
const gateway = spawn(process.execPath, ['dist/server.js'], {
  cwd: new URL('..', import.meta.url).pathname,
  env: { ...process.env, PORT: '8899', GATEWAY_TOKEN: 'test', LOCAL_LLM_BASE_URL: `http://127.0.0.1:${mockPort}/v1`, LOCAL_LLM_MODEL: 'mock-model', OPENAI_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
await new Promise((resolve) => setTimeout(resolve, 400));
try {
  const health = await fetch('http://127.0.0.1:8899/health');
  assert.equal(health.status, 200);
  const skills = await fetch('http://127.0.0.1:8899/v1/skills', { headers: { authorization: 'Bearer test' } });
  const skillsJson = await skills.json();
  assert.equal(skillsJson.catalog.count, 100);
  assert.equal(skillsJson.local.length, 1);
  assert.ok(skillsJson.local.some((skill) => skill.name === 'universal-agent-workspace'));
  const mcp = await fetch('http://127.0.0.1:8899/mcp', { method: 'POST', headers: { authorization: 'Bearer test', 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) });
  const mcpJson = await mcp.json();
  assert.deepEqual(mcpJson.result.tools.map((tool) => tool.name), ['skills_list', 'models_list', 'chat', 'get_design_tokens', 'render_component', 'search_ui_catalog']);
  const completion = await fetch('http://127.0.0.1:8899/v1/chat/completions', { method: 'POST', headers: { authorization: 'Bearer test', 'content-type': 'application/json' }, body: JSON.stringify({ provider: 'local', skill: 'universal-agent-workspace', messages: [{ role: 'user', content: 'test' }], stream: false }) });
  const completionJson = await completion.json();
  assert.equal(completionJson.content, 'gateway-ok');
  console.log('integration: ok');
} finally {
  gateway.kill('SIGTERM');
  mock.close();
}
