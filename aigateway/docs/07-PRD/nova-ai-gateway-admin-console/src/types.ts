export type PageId =
  | 'login'
  | 'dashboard'
  | 'apikeys'
  | 'providers'
  | 'models'
  | 'pricing'
  | 'billing'
  | 'logs'
  | 'students'
  | 'roles';

export interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconName: string;
}

export interface RecentRequest {
  id: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  costYuan: number;
  status: 'success' | 'failed';
  timestamp: string;
}

export interface ApiKeyItem {
  id: string;
  prefix: string;
  name: string;
  scope: string;
  status: 'active' | 'revoked';
  createdAt: string;
  fullKey?: string;
}

export interface ProviderItem {
  id: string;
  name: string;
  baseUrl: string;
  apiPath: string;
  apiKeyRef: string;
  priority: number;
  weight: number;
  enabled: boolean;
}

export interface ModelItem {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  boundProviders: { providerName: string; weight: number }[];
}

export interface PricingItem {
  id: string;
  modelName: string;
  modelCode: string;
  pricingType: 'unified' | 'timebased';
  inputPrice: number; // ¥/1k
  outputPrice: number; // ¥/1k
  peakStartTime?: string;
  peakEndTime?: string;
  peakInputPrice?: number;
  peakOutputPrice?: number;
  offPeakInputPrice?: number;
  offPeakOutputPrice?: number;
}

export interface BillingRecord {
  id: string;
  email: string;
  modelCode: string;
  inputTokens: number;
  outputTokens: number;
  costYuan: number;
  status: 'success' | 'failed';
  timestamp: string;
}

export interface RequestLogItem {
  id: string;
  modelCode: string;
  providerName: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  costYuan: number;
  status: 'success' | 'failed';
  timestamp: string;
  clientIp?: string;
  errorMessage?: string;
}

export interface StudentItem {
  id: string;
  email: string;
  nickname: string;
  status: 'enabled' | 'disabled';
  quotaBalance: number;
  createdAt: string;
  allowedModels: string[]; // model codes
}

export interface Permission {
  code: string;
  name: string;
  category: string;
}

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissionCount: number;
  userCount: number;
  createdAt: string;
  permissions: string[]; // permission codes
}
