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

export type SkillCategory =
  | '投标'
  | '外贸'
  | '合同'
  | '内容'
  | '数据'
  | '营销'
  | '财务'
  | '客服'
  | '电商'
  | '人力'
  | '法务'
  | '研发'
  | '企业服务'

export interface SkillPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  isPopular?: boolean
}

export interface SkillInputField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select'
  placeholder: string
  required?: boolean
  options?: string[]
}

export interface Skill {
  slug: string
  name: string
  category: SkillCategory
  tagline: string
  description: string
  icon: string
  badge: string
  price: string
  highlights: string[]
  scenarios: string[]
  inputFields: SkillInputField[]
  systemPrompt: string
  defaultModel: string
  sampleInput: Record<string, string>
  sampleOutput: string
  faq: FaqItem[]
  status: 'online' | 'coming-soon'
  plans: SkillPlan[]
  theme?: Record<string, string>
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
  /** 页面主题色 class 覆盖（key 见 SolutionDetailPage 的 theme computed 默认值） */
  theme?: Record<string, string>
  // ---- 文案覆盖（缺省时回退到高校科研默认文案） ----
  heroTitlePrefix?: string
  heroTitleGradient?: string
  valueTitlePrefix?: string
  valueTitleSuffix?: string
  valueSubtitle?: string
  capabilitiesTitlePrefix?: string
  capabilitiesTitleGradient?: string
  pipelineBadge?: string
  pipelineTitlePrefix?: string
  pipelineTitleGradient?: string
  pipelineDesc?: string
  ctaTag?: string
  ctaTitlePrefix?: string
  ctaTitleGradient?: string
  ctaSubtitle?: string
}

/** 专家团协作流程节点 */
export type TeamFlowMode = 'plan' | 'parallel' | 'sequential' | 'merge'

export interface TeamFlowNode {
  step: number
  role: string // 专家角色名，如「投标经理」
  skillSlug: string // 关联 Skill
  mode: TeamFlowMode // 总指挥 / 并行 / 串行 / 汇总
  title: string // 该步做什么
  description: string
  input: string // 输入来源描述
  output: string // 输出产物描述
  /** 过程快照：该节点完成后展示的简要成果（增强协作过程可信度） */
  snapshot?: string
  duration: string // 预估耗时（Mock）
}

/** 专家团队成员 */
export interface TeamMember {
  skillSlug: string
  role: string // 团队内角色名，如「总指挥」
  responsibility: string // 负责环节
}

/** 专家团（多专家协作流程） */
export interface ExpertTeam {
  slug: string
  name: string
  industry: string // 投标 / 外贸 / 内容增长
  tagline: string
  description: string
  icon: string
  badge: string // 并行 / 串行 / 混合
  price: string
  highlights: string[]
  scenarios: string[]
  members: TeamMember[]
  flow: TeamFlowNode[] // 协作流程（核心）
  inputFields: SkillInputField[]
  sampleTask: string // 示例任务
  sampleDeliverable: string // 最终交付物示例
  faq: FaqItem[]
  status: 'online' | 'coming-soon'
  plans: SkillPlan[]
}
