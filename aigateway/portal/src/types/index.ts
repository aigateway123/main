export interface ModelInfo {
  id: string
  name: string
  provider: string
  description: string
  contextWindow: string
  avgLatency: string
  inputPrice: string
  outputPrice: string
  cachePrice?: string
  cacheWritePrice?: string
  dynamicPricing?: string
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

export interface PricingCard {
  id: string
  title: string
  subtitle: string
  description: string
  features: string[]
  cta: string
  isPopular?: boolean
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

export interface SolutionCapability {
  icon: string
  title: string
  description: string
}

export interface SolutionResult {
  label: string
  value: string
}

export interface PipelineStage {
  id: string
  role: string
  title: string
  icon: string
  description: string
  pain: string[]
  flow: string[]
  result: SolutionResult[]
  quote?: string
  branch?: PipelineStage[]
  endpoint?: boolean
}

export interface SolutionFunding {
  title: string
  description: string
  points: string[]
  flow: string[]
  result: SolutionResult[]
}

export interface Solution {
  slug: string
  name: string
  tag: string
  tagline: string
  description: string
  highlight: string[]
  audience: string[]
  capabilities: SolutionCapability[]
  pipeline: PipelineStage[]
  funding?: SolutionFunding
  status: 'online' | 'coming-soon'
}
