import type { ChatMessage, GatewayChunk, GatewayRequest, GatewayResponse, ProviderConfig } from './types.js';

export const defaultProviders: ProviderConfig[] = [
  { id: 'openai', baseUrl: process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1', apiKeyEnv: 'OPENAI_API_KEY', defaultModel: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini', models: [], enabled: Boolean(process.env.OPENAI_API_KEY), priority: 10 },
  { id: 'anthropic-compatible', baseUrl: process.env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com/v1', apiKeyEnv: 'ANTHROPIC_API_KEY', defaultModel: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514', models: [], enabled: Boolean(process.env.ANTHROPIC_API_KEY), priority: 20 },
  { id: 'google-compatible', baseUrl: process.env.GOOGLE_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta/openai', apiKeyEnv: 'GOOGLE_API_KEY', defaultModel: process.env.GOOGLE_MODEL ?? 'gemini-2.5-flash', models: [], enabled: Boolean(process.env.GOOGLE_API_KEY), priority: 30 },
  { id: 'openrouter', baseUrl: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1', apiKeyEnv: 'OPENROUTER_API_KEY', defaultModel: process.env.OPENROUTER_MODEL ?? 'openai/gpt-4.1-mini', models: [], enabled: Boolean(process.env.OPENROUTER_API_KEY), priority: 40 },
  { id: 'local', baseUrl: process.env.LOCAL_LLM_BASE_URL ?? 'http://127.0.0.1:11434/v1', apiKeyEnv: 'LOCAL_LLM_API_KEY', defaultModel: process.env.LOCAL_LLM_MODEL ?? 'llama3.2', models: [], enabled: Boolean(process.env.LOCAL_LLM_BASE_URL), priority: 50 },
];

function endpoint(baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, '')}/chat/completions`;
}

function resolveProviders(requested?: string): ProviderConfig[] {
  const configured = defaultProviders.filter((p) => p.enabled);
  const matching = requested ? configured.filter((p) => p.id === requested) : configured;
  return matching.sort((a, b) => a.priority - b.priority);
}

function apiKey(provider: ProviderConfig): string | undefined {
  return provider.apiKeyEnv ? process.env[provider.apiKeyEnv] : undefined;
}

function buildMessages(request: GatewayRequest): ChatMessage[] {
  return request.skill ? [{ role: 'system', content: `Active skill: ${request.skill}` }, ...request.messages] : request.messages;
}

export async function* streamChat(request: GatewayRequest): AsyncGenerator<GatewayChunk> {
  const providers = resolveProviders(request.provider);
  if (!providers.length) throw new Error('No enabled provider. Configure at least one *_API_KEY or LOCAL_LLM_BASE_URL.');
  let lastError: unknown;
  for (const provider of providers) {
    const model = request.model ?? provider.defaultModel;
    try {
      const headers: Record<string, string> = { 'content-type': 'application/json' };
      const key = apiKey(provider);
      if (key) headers.authorization = `Bearer ${key}`;
      const response = await fetch(endpoint(provider.baseUrl), {
        method: 'POST',
        headers,
        body: JSON.stringify({ model, messages: buildMessages(request), temperature: request.temperature, max_tokens: request.max_tokens, stream: true }),
        signal: AbortSignal.timeout(120_000),
      });
      if (!response.ok || !response.body) throw new Error(`${provider.id} returned ${response.status}: ${(await response.text()).slice(0, 500)}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const read = await reader.read();
        if (read.done) break;
        buffer += decoder.decode(read.value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const json = JSON.parse(payload) as { id?: string; choices?: Array<{ delta?: { content?: string } }> };
            const delta = json.choices?.[0]?.delta?.content ?? '';
            if (delta) yield { id: json.id ?? crypto.randomUUID(), provider: provider.id, model, delta, done: false };
          } catch { /* ignore malformed partial SSE events */ }
        }
      }
      yield { id: crypto.randomUUID(), provider: provider.id, model, delta: '', done: true };
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export async function completeChat(request: GatewayRequest): Promise<GatewayResponse> {
  let content = '';
  let provider = request.provider ?? 'unknown';
  let model = request.model ?? 'unknown';
  for await (const chunk of streamChat({ ...request, stream: true })) {
    provider = chunk.provider;
    model = chunk.model;
    content += chunk.delta;
  }
  return { id: crypto.randomUUID(), provider, model, content };
}

export function listProviders(): Array<Pick<ProviderConfig, 'id' | 'baseUrl' | 'defaultModel' | 'enabled' | 'priority'>> {
  return defaultProviders.map(({ id, baseUrl, defaultModel, enabled, priority }) => ({ id, baseUrl, defaultModel, enabled, priority }));
}
