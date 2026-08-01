export interface ModelInfo {
  id: string
  name: string
  provider: string
  description: string
  contextWindow: string
  avgLatency: string
  inputPrice: string
  outputPrice: string
  capabilities: string[]
  badge?: string
  isPopular?: boolean
}

export interface Feature {
  id: string
  iconName: string
  title: string
  highlight: string
  description: string
  details: string[]
  metrics: string
}

export interface InfrastructureItem {
  id: string
  iconName: string
  title: string
  subtitle: string
  description: string
  stats: string
  statsLabel: string
  features: string[]
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  isPopular: boolean
  badge?: string
}

export interface CodeSample {
  lang: string
  label: string
  filename: string
  code: string
}

export interface SiteInfo {
  title: string
  description: string
  adminUrl: string
}

export interface ProviderInfo {
  name: string
  desc: string
}
