export type Role = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  role: Role;
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface SkillRecord {
  id: number;
  slug: string;
  category: string;
  source: string;
  repository: string;
  summary: string;
  selection_basis: string;
  status: 'candidate' | 'verified' | 'blocked';
}

export interface SkillDocument {
  name: string;
  description: string;
  compatibility?: string;
  license?: string;
  metadata: Record<string, string>;
  body: string;
  root: string;
}

export interface ProviderConfig {
  id: string;
  baseUrl: string;
  apiKeyEnv?: string;
  defaultModel: string;
  models: string[];
  enabled: boolean;
  priority: number;
}

export interface GatewayRequest {
  messages: ChatMessage[];
  model?: string;
  provider?: string;
  skill?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  metadata?: Record<string, string>;
}

export interface GatewayChunk {
  id: string;
  provider: string;
  model: string;
  delta: string;
  done: boolean;
}

export interface GatewayResponse {
  id: string;
  provider: string;
  model: string;
  content: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
}

export interface ToolPolicy {
  allowNetwork: boolean;
  allowShell: boolean;
  allowWrite: boolean;
  allowExternalSend: boolean;
  allowedHosts: string[];
}
