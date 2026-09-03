// ============================================================================
// AI 法务员工 · Demo 数据层（类型 + 常量）
// 忠实取自已「AI 法务员工」React 原型：
//   docs/仓库/xx-ai-·-ai法务员工/src/types.ts            （全部类型定义）
//   docs/仓库/xx-ai-·-ai法务员工/src/components/review/ContractReviewView.tsx
//     （config 阶段 4 个合同范本 REVIEW_PRESETS + 10 项审查重点 REVIEW_FOCUS_OPTIONS）
//   docs/仓库/xx-ai-·-ai法务员工/src/components/review/ReviewRunningAnimation.tsx
//     （13 步扫描清单 REVIEW_STEPS）
//   docs/仓库/xx-ai-·-ai法务员工/src/components/layout/Sidebar.tsx（12 导航视图名）
// 大体积演示数据（合同库/企业档案/合规维度/法规情报/任务/知识库/工作日志）
// 单独存放于 ./legalMockData.ts（本文件不承载）。
//
// 移植修复（相对原型）：
//   1. 新增 LegalView union（Sidebar NavViewKey 12 值收敛共用一套视图名）
//   2. 新增 LEGAL_VIEW_META 视图标题映射（Header/侧栏共用）
// 移植日期：2026-09-03
// ============================================================================

// ---- 通用枚举类型（与原型 types.ts 逐字一致） ----
export type RiskLevel = 'high' | 'medium' | 'low'
export type PriorityLevel = 'P0' | 'P1' | 'P2'
export type ContractStatus = 'normal' | 'pending' | 'expiring' | 'terminated' | 'breach' | 'archived'
export type ContractType =
  | '设备采购'
  | '产品销售'
  | '技术服务'
  | '软件采购'
  | '劳动人事'
  | '保密协议'
  | '战略合作'
  | '房屋租赁'

// ---- 合同风险事项 ----
export interface RiskItem {
  id: string
  contractId?: string
  title: string
  clauseIndex: string
  clauseTitle: string
  riskLevel: RiskLevel
  score: number
  suggestionType: '建议调整' | '建议修改' | '建议补充' | '建议明确' | '建议评估' | '建议删除'
  originalClause: string
  aiAnalysis: string
  impactPoints: string[]
  suggestion: string
  recommendedClause: string
  priority: PriorityLevel
  category: '付款结算' | '违约赔偿' | '质量验收' | '知识产权' | '保密安全' | '争议解决' | '交付履约' | '合同解除'
}

// ---- AI 条款对比（原合同 vs 建议版本） ----
export interface ClauseComparison {
  id: string
  category: string
  clauseNumber: string
  title: string
  originalClause: string
  proposedClause: string
  changeExplanation: string
  keyChanges: string[]
}

// ---- 单份合同完整 AI 审查数据 ----
export interface ContractReviewData {
  contractTitle: string
  partyA: string
  partyB: string
  contractType: string
  pageCount: number
  totalClauses: number
  keyClauses: number
  totalRisks: number
  highRiskCount: number
  mediumRiskCount: number
  lowRiskCount: number
  overallScore: number
  overallRiskLevel: '高风险' | '中高风险' | '中风险' | '低风险'
  contractAmount: string
  contractDuration: string
  paymentMethod: string
  deliveryPeriod: string
  breachPenalty: string
  disputeResolution: string
  riskBreakdown: {
    category: string
    score: number
    riskCount: number
    status: 'high' | 'medium' | 'low'
  }[]
  criticalConcerns: {
    priority: PriorityLevel
    title: string
    description: string
    clauseNumber: string
  }[]
  reviewConclusion: {
    overallVerdict: string
    actionAdvice: string
    prioritizedModifications: {
      priority: PriorityLevel
      item: string
      reason: string
    }[]
  }
  risks: RiskItem[]
  comparisons: ClauseComparison[]
}

// ---- 合同管理台账条目 ----
export interface ContractItem {
  id: string
  title: string
  code: string
  type: ContractType
  partyA: string
  partyB: string
  amount: string
  amountRaw: number
  signDate: string
  expireDate: string
  remainingDays: number
  riskLevel: RiskLevel
  riskScore: number
  status: ContractStatus
  statusText: string
  riskCount: number
  highRiskCount: number
  changeStatus?: string
  lastAnalyzed: string
  activeAlerts?: string[]
  isPinned?: boolean
}

// ---- 企业合规档案 ----
export interface EnterpriseProfile {
  id: string
  name: string
  industry: string
  scale: string
  employees: number
  targetMarkets: string[]
  mainBusiness: string
  riskScore: number
  riskLevel: '高' | '中等' | '低'
  summary: string
}

// ---- 合规分类维度 ----
export interface ComplianceCategory {
  id: string
  name: string
  score: number
  level: RiskLevel
  description: string
  keyRisks: string[]
  actionPlans: {
    priority: PriorityLevel
    action: string
    department: string
    cycle: string
  }[]
}

// ---- 法规检索情报条目 ----
export interface RegulationQueryItem {
  id: string
  query: string
  businessScenario: string
  targetMarkets: string[]
  relevantRegulations: {
    name: string
    category: string
    keyArticles: string
    compliancePoints: string
  }[]
  legalIssues: string[]
  aiPlainExplanation: string
  recommendedSteps: string[]
}

// ---- 法务知识库文档 ----
export interface KnowledgeDocument {
  id: string
  title: string
  category:
    | '合同模板'
    | '历史合同'
    | '法律制度'
    | '企业制度'
    | '知识产权'
    | '合规文件'
    | '历史审查报告'
    | '律师意见'
    | '历史案例'
  format: 'PDF' | 'DOCX' | 'XLSX'
  fileSize: string
  uploadDate: string
  extractedTerms: number
  usageCount: number
  tags: string[]
  summary: string
  version?: string
  downloads?: number
  description?: string
  content?: string
}

// ---- 法务任务 ----
export interface LegalTask {
  id: string
  title: string
  contractName?: string
  type: '合同初审' | '合规排查' | '条款复核' | '续约评估' | '法规研判'
  priority: PriorityLevel
  status: '待处理' | '进行中' | '已完成'
  assignee: string
  deadline: string
  createdAt: string
}

// ---- AI 法务工作日志 ----
export interface AiWorkLog {
  id: string
  time: string
  title: string
  type: 'review' | 'risk' | 'expire' | 'compliance' | 'regulation'
  description: string
}

// ---- 工作台视图 id（侧栏 + 各视图分发，12 视图，取值与原型 Sidebar NavViewKey 一致） ----
export type LegalView =
  | 'home'
  | 'contract-review'
  | 'contract-management'
  | 'regulation-search'
  | 'enterprise-compliance'
  | 'legal-risk'
  | 'knowledge-base'
  | 'legal-reports'
  | 'my-tasks'
  | 'pending-contracts'
  | 'history-records'
  | 'settings'

// ---- 合同审查三阶段 + 结果四页签（原型 ContractReviewView stage/activeTab） ----
export type ReviewStage = 'config' | 'running' | 'result'
export type ReviewTab = 'overview' | 'risks' | 'comparisons' | 'summary'

/** 深链参数：SolutionDetailPage 按 pipeline 节点注入，控制工作台打开后合同审查视图的初始行为 */
export interface ReviewDeepLink {
  /** 打开即自动进入 running 推理动画（跑完落到 result·overview） */
  autoRun?: boolean
  /** 直落到指定阶段（默认 config） */
  stage?: ReviewStage
  /** 结果阶段直开指定页签（overview/risks/comparisons/summary） */
  tab?: ReviewTab
  /** 结果阶段进入 risks 页签后自动打开首个高风险白盒弹窗 */
  openFirstHighRisk?: boolean
}

// ---- 视图标题（Header/侧栏共用，与原型 Sidebar 导航 label 一致） ----
export const LEGAL_VIEW_META: Record<LegalView, string> = {
  home: '首页',
  'contract-review': '合同审查',
  'contract-management': '合同管理',
  'regulation-search': '法规检索',
  'enterprise-compliance': '企业合规',
  'legal-risk': '法律风险',
  'knowledge-base': '法务知识库',
  'legal-reports': '法律报告',
  'my-tasks': '我的任务',
  'pending-contracts': '待处理合同',
  'history-records': '历史记录',
  settings: '系统设置',
}

// ---- 合同审查 · 4 个模拟合同范本（ContractReviewView config 阶段「或者选择模拟合同」） ----
export const REVIEW_PRESETS = [
  { name: '设备采购合同.pdf', label: '设备采购合同.pdf', badge: '核心演示' },
  { name: '销售合同.docx', label: '销售合同.docx', badge: '标准销售' },
  { name: '技术服务合同.pdf', label: '技术服务合同.pdf', badge: 'IT服务' },
  { name: '软件采购合同.docx', label: '软件采购合同.docx', badge: 'SaaS授权' },
]

// ---- 合同审查 · 10 个审查重点勾选项（ContractReviewView config 阶段，默认全选） ----
export const REVIEW_FOCUS_OPTIONS = [
  { id: 'payment', label: '付款风险', defaultChecked: true },
  { id: 'breach', label: '违约责任', defaultChecked: true },
  { id: 'delivery', label: '交付风险', defaultChecked: true },
  { id: 'acceptance', label: '验收条款', defaultChecked: true },
  { id: 'quality', label: '质量责任', defaultChecked: true },
  { id: 'ip', label: '知识产权', defaultChecked: true },
  { id: 'confidentiality', label: '保密义务', defaultChecked: true },
  { id: 'dispute', label: '争议解决', defaultChecked: true },
  { id: 'renewal', label: '自动续约', defaultChecked: true },
  { id: 'termination', label: '解除合同', defaultChecked: true },
]

// ---- AI 扫描执行清单（ReviewRunningAnimation 13 步，纯文案、无补充说明字段） ----
export const REVIEW_STEPS = [
  '正在读取合同文件与元数据...',
  '正在识别合同签约主体与权利义务...',
  '正在提取合同标的金额与支付条件...',
  '正在深度识别付款节点与资金占用风险...',
  '正在分析交付期限与在途货物风险转移条款...',
  '正在分析验收标准、异议期与试车考核指标...',
  '正在分析双方违约责任计算比例与不对等性...',
  '正在分析知识产权归属、源码授权与侵权抗辩...',
  '正在分析商业秘密保密义务与期限设定...',
  '正在分析合同解除条件与单方解约救济途径...',
  '正在分析适用法律与争议管辖地点合理性...',
  '正在跨维度交叉识别潜在法律与履约风险...',
  '正在依据企业法务标准生成条款修改示范版本...',
]
