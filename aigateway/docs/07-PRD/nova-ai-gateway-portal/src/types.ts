export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: string;
  avgLatency: string;
  inputPrice: string;
  outputPrice: string;
  capabilities: string[];
  badge?: string;
  isPopular?: boolean;
}
