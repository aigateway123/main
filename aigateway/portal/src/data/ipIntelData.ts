// ============================================================================
// 知识产权 · AI 知识产权顾问 工作台 Demo 数据层（类型 + 常量）
// 忠实取自知产原型：
//   docs/仓库/xx-ai-·-ai知识产权顾问/src/types.ts + src/data/mockData.ts
// 大体积专利/竞品/风险/机会数据单独存放于 ./ipMockData.ts（本文件不承载）。
//
// 移植修复（相对原型）：
//   1. NavigationTab 11 值收敛为 IpView（Sidebar/Header/App 共用一套，修复错位）
//   2. Sidebar「我的项目」id 误指 overview + 「历史分析/雷达」一名两义 → 重构为三组导航
//   3. 12 步执行清单文案模板化：buildIpWorkflowSteps 随 analysisInput 实时生成，
//      不再写死默认示例的「新能源储能/液冷储能系统」
// ============================================================================

// ---- 工作台视图 id（IpCounselDemo 侧栏 + 各视图分发，11 视图） ----
export type IpView =
  | 'home'
  | 'workflow'
  | 'overview'
  | 'search'
  | 'competitors'
  | 'risks'
  | 'layout'
  | 'report'
  | 'my-patents'
  | 'radar'
  | 'settings'

export type RiskLevel = 'high' | 'medium' | 'low'

// ---- 需求输入 ----
export interface AnalysisInput {
  industry: string
  product: string
  targetMarkets: string[]
  competitors: string[]
  requirement: string
}

/** 白盒权利要求比对：企业方案 vs 专利权利要求的单特征对比 */
export interface TechnicalFeatureComparison {
  featureName: string
  enterpriseSolution: string
  patentSolution: string
  similarity: number // 0 - 100
  keyDifference: string
  infringementRisk: RiskLevel
}

export interface RiskItem {
  id: string
  title: string
  technicalField: string
  riskLevel: RiskLevel
  riskScore: number // e.g. 86
  relatedPatentId: string
  relatedPatentTitle: string
  patentApplicant: string
  patentCountry: string
  recommendation: string
  detailedAction: string
  enterpriseScheme: string
  patentScheme: string
  techSimilarity: number // e.g. 91%
  claimOverlap: number // e.g. 82%
  featureComparisons: TechnicalFeatureComparison[]
  legalStatus: string
  validUntil: string
}

export type PatentLegalStatus = '有效' | '实质审查' | '已授权' | '公开' | '已转让'
export type PatentCountry = 'CN' | 'US' | 'EP' | 'JP' | 'WO'

export interface Patent {
  id: string
  patentNumber: string
  title: string
  applicant: string
  country: PatentCountry
  applicationDate: string
  publicationDate: string
  technicalField: string
  relevanceScore: number // e.g. 95%
  riskLevel: RiskLevel
  legalStatus: PatentLegalStatus
  abstract: string
  aiSummary: string
  technicalFeatures: string[]
  claimCount: number
  citedCount: number
  isCorePatent: boolean
}

export interface Competitor {
  id: string
  name: string
  englishName: string
  logoColor: string
  headquarters: string
  totalPatents: number
  corePatentsCount: number
  recentFiveYearsAdded: number
  overseasPatentRatio: number // e.g. 38%
  marketShare: string
  summary: string
  aiAdvice: string
  focusAreas: {
    field: string
    intensity: number // 0 - 100
    patentCount: number
  }[]
  matrixPosition: {
    field: string
    intensity: number // Y 轴：0 - 100
    bubbleSize: number // 气泡半径
  }[]
}

export interface LayoutOpportunity {
  id: string
  numberCode: string // e.g. '01'
  title: string
  opportunityScore: number // e.g. 91
  competitionIntensity: '高' | '中' | '中低' | '低'
  whiteSpaceDegree: '非常明显' | '较明显' | '适中' | '局部空白'
  recommendation: '优先布局' | '重点研究' | '持续布局' | '快速占位' | '适时跟进'
  technicalField: string
  description: string
  targetClaims: string[]
  suggestedFilingWindow: string
  potentialValue: '商业核心' | '防御壁垒' | '授权突破' | '出海护城河'
}

export interface PyramidTier {
  level: number
  title: string
  category: string
  color: string
  items: {
    name: string
    existingCount: number
    recommendedCount: number
    status: 'urgent' | 'planned' | 'stable'
    description: string
  }[]
}

export interface IPIntelligence {
  id: string
  priority: 'high' | 'medium' | 'low'
  title: string
  competitor: string
  time: string
  category: '新增竞品专利' | '专利状态变化' | '法律诉讼风险' | '核心专利到期' | '空白突破机会'
  relevanceScore: number
  recommendation: string
  patentNumber?: string
  details: string
}

// ---- 自有专利资产（my-patents 视图） ----
export interface EnterpriseSelfPatents {
  totalCount: number
  activeCount: number
  expiringCount: number
  coreCount: number
  overseasCount: number
  fieldDistribution: { field: string; count: number; percentage: number }[]
  countryDistribution: { country: string; count: number; flag: string }[]
  recentRenewals: { name: string; patentNumber: string; dueDate: string; fee: string; status: string }[]
}

// ---- 3 个预置需求场景（HomeView 预设 pill） ----
export const IP_PRESET_TASKS: AnalysisInput[] = [
  {
    industry: '新能源储能',
    product: '液冷储能系统',
    targetMarkets: ['中国', '美国', '欧洲'],
    competitors: ['CATL', 'BYD', 'Tesla'],
    requirement:
      '我们是一家新能源储能企业，正在开发液冷储能系统。希望分析中国、美国、欧洲市场的相关专利，重点关注CATL、BYD、Tesla的专利布局，并判断我们的产品可能存在哪些专利风险。',
  },
  {
    industry: '新能源电池',
    product: '全固态电池',
    targetMarkets: ['中国', '日本', '美国'],
    competitors: ['丰田', '宁德时代', '松下'],
    requirement:
      '我们正在研发全固态电池电芯与电解质材料。希望分析中国、日本、美国市场的专利现状，重点关注丰田、宁德时代、松下的专利布局与材料配方壁垒，识别侵权风险与空白机会。',
  },
  {
    industry: '半导体',
    product: '存算一体芯片',
    targetMarkets: ['美国', '中国', '韩国'],
    competitors: ['三星', 'SK海力士', '寒武纪'],
    requirement:
      '我们正在开发面向 AI 推理的存算一体芯片。希望分析美国、中国、韩国市场的相关专利，重点关注三星、SK海力士、寒武纪的专利布局，评估我们的电路与架构设计是否存在侵权风险。',
  },
]

export const DEFAULT_ANALYSIS_INPUT: AnalysisInput = IP_PRESET_TASKS[0]

// ---- 8 大技术分支（检索/竞品/风险通用） ----
export const IP_TECHNICAL_FIELDS: string[] = [
  '电芯',
  'Pack',
  'BMS',
  '热管理',
  '液冷',
  '消防',
  '储能系统',
  '控制算法',
]

export interface IpWorkflowStep {
  id: number
  text: string
  desc: string
}

// 12 步执行清单文案模板（{industry}/{product}/{markets}/{competitors} 由当前任务实时注入，
// 避免新建分析后步骤文字仍停留在默认示例的「新能源储能/液冷储能系统」）
const IP_STEP_TEMPLATES: { text: string; desc: string }[] = [
  { text: '正在理解企业产品', desc: '解析{product}及相关行业({industry})的完整产品规格与拓扑' },
  { text: '正在解析技术方案', desc: '提取核心功能模块、关键结构与工艺参数技术特征' },
  { text: '正在拆解技术特征', desc: '形成28个核心技术特征向量与权利要求对照树' },
  { text: '正在检索相关专利', desc: '遍历{markets}对应CNIPA、USPTO、EPO等专利数据库(共12,846件)' },
  { text: '正在识别核心专利', desc: '基于被引频次与诉讼相关度筛选出76件高权重基础专利' },
  { text: '正在分析专利权利要求', desc: '对比独立权利要求、从属权利要求保护范围重合度' },
  { text: '正在识别竞争对手', desc: '锁定{competitors}等23家主要竞争主体' },
  { text: '正在分析竞争对手专利布局', desc: '绘制8大技术分支专利申请地域与申请趋势矩阵' },
  { text: '正在进行技术路线对比', desc: '比对直冷、液冷分流、浸没式及主动循环多技术路线' },
  { text: '正在识别潜在风险', desc: '发现8项高风险侵权嫌疑点及21项需重点规避技术点' },
  { text: '正在寻找技术空白', desc: '识别动态流量微控与快拆接头等17个低密度专利蓝海' },
  { text: '正在生成专利布局建议', desc: '构建4层防御与进攻型专利布局路线图及战略报告' },
]

/** 依据当前任务参数实时生成 12 步执行清单 */
export const buildIpWorkflowSteps = (input: AnalysisInput): IpWorkflowStep[] => {
  const vars: Record<string, string> = {
    industry: input.industry,
    product: input.product,
    markets: input.targetMarkets.length ? input.targetMarkets.join('/') : '全球',
    competitors: input.competitors.length ? input.competitors.join('/') : '行业头部',
  }
  return IP_STEP_TEMPLATES.map((s, i) => ({
    id: i + 1,
    text: s.text,
    desc: s.desc.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? ''),
  }))
}

// ---- 视图 meta（Header 标题/副题，11 视图） ----
export interface IpViewMeta {
  title: string
  subtitle: string
}

export const IP_VIEW_META: Record<IpView, IpViewMeta> = {
  home: { title: 'AI知识产权顾问', subtitle: '企业知识产权智能分析平台' },
  workflow: { title: 'AI工作流执行', subtitle: '多源专利数据挖掘与深度技术特征分析' },
  overview: { title: '企业知识产权分析报告', subtitle: '全景健康度评估与战略决策矩阵' },
  search: { title: 'AI专利智能检索', subtitle: '全球专利文献深度语义检索与风险初筛' },
  competitors: { title: 'AI竞争对手专利情报', subtitle: '头部竞品专利地图与技术攻防态势' },
  risks: { title: 'AI知识产权风险地图', subtitle: '侵权隐患排查与技术特征白盒比对' },
  layout: { title: 'AI专利布局与空白挖掘', subtitle: '技术蓝海挖掘与四层阶梯式布局路线' },
  report: { title: '企业知识产权战略报告', subtitle: '高管决策摘要与优先级落地清单' },
  'my-patents': { title: '我的专利资产管家', subtitle: '企业自有专利组合与年费全生命周期管理' },
  radar: { title: 'AI知识产权雷达', subtitle: '24小时竞品动态与法律状态持续监测' },
  settings: { title: '系统设置与规则规范', subtitle: 'AI分析引擎参数与合规免责配置' },
}

/** Header「6 步演示闭环」stepper（静态高亮指示，非驱动跳转） */
export const IP_DEMO_STEPS: { view: IpView; label: string }[] = [
  { view: 'home', label: '1. 需求输入' },
  { view: 'overview', label: '2. 智能总览' },
  { view: 'risks', label: '3. 风险地图' },
  { view: 'competitors', label: '4. 竞品情报' },
  { view: 'layout', label: '5. 专利布局' },
  { view: 'report', label: '6. 战略报告' },
]
