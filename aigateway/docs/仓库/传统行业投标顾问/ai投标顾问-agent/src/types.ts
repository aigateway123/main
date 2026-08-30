export type TenderCategory = 'IT集成' | '建筑工程' | '设备制造' | '医疗器械' | '安防智能化' | '政府采购' | '其他';

export interface ProjectOverview {
  projectName: string;
  tenderer: string;
  projectCode: string;
  projectType: TenderCategory | string;
  budget: string;
  submissionDeadline: string;
  bidOpeningTime: string;
  deliveryPeriod: string;
  bidBond: string;
  evaluationMethod: string;
  coreSummary: string; // 这是一个什么项目、什么企业最适合参与、项目的核心竞争点是什么
  sourceFile?: string;
  fileIntegrityNote?: string;
}

export interface QualificationCheckItem {
  id: string;
  category: '企业资质' | '企业业绩' | '人员要求' | '财务要求' | '其他要求';
  requirement: string;
  status: '已满足' | '待确认' | '不满足';
  riskLevel: 'high' | 'medium' | 'low';
  supplementNeeded: string;
  sourceQuote: string;
}

export interface DisqualificationRiskItem {
  id: string;
  title: string;
  riskLevel: 'high' | 'medium' | 'low'; // 🔴 高风险 (直接废标) | 🟡 中风险 (扣分/资格风险) | 🟢 低风险 (优化建议)
  category: string;
  originalQuote: string; // 原文要求
  riskExplanation: string; // 风险解释
  suggestedAction: string; // 建议动作
}

export interface EvaluationScoreItem {
  id: string;
  name: string;
  category: '商务评分' | '技术评分' | '价格评分' | '服务评分' | '企业实力' | '项目业绩' | '人员配置' | '售后能力' | '其他加分项';
  maxScore: number;
  criteria: string;
  currentStatus: string;
  expectedScore: number;
  improvementPotential: number;
  improvementTips?: string;
}

export interface ScoreOptimizationStrategy {
  mustPassItems: string[];
  coreScoringItems: string[];
  competitiveGapItems: string[];
  bonusItems: string[];
  actionableTactics: Array<{
    title: string;
    detail: string;
    estimatedGain: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface CompanyCapabilityMatrixItem {
  id: string;
  requirement: string;
  companyCapability: string;
  matchScore: number; // 0 - 100
  gap: string;
  suggestion: string;
  status: 'fully_matched' | 'partially_matched' | 'gap_found';
}

export interface CombatTaskItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  note: string;
}

export interface TechnicalProposalChapter {
  id: string;
  chapterNumber: string;
  title: string;
  description: string;
  correspondsToScoreItem?: string; // 明确标记哪些章节对应评分项
  scoreWeight?: string;
  keyRequirements: string[];
  draftContent?: string;
}

export interface HealthCheckIssue {
  rank: number;
  category: '资格' | '商务' | '技术' | '评分' | '格式' | '一致性';
  issue: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
  fixAdvice: string;
  solved?: boolean;
}

export interface BidHealthCheckResult {
  healthScore: number; // 0 - 100
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  summary: string;
  dimensionChecks: {
    qualification: { title: string; status: 'pass' | 'warning' | 'fail'; detail: string };
    commercial: { title: string; status: 'pass' | 'warning' | 'fail'; detail: string };
    technical: { title: string; status: 'pass' | 'warning' | 'fail'; detail: string };
    scoreCoverage: { title: string; status: 'pass' | 'warning' | 'fail'; detail: string };
    formatting: { title: string; status: 'pass' | 'warning' | 'fail'; detail: string }; // 漏签、漏盖章、页码、字体排版
    consistency: { title: string; status: 'pass' | 'warning' | 'fail'; detail: string }; // 公司名称、项目名称、项目编号、金额、日期、人员
  };
  top10Issues: HealthCheckIssue[];
}

export interface FinalBidReport {
  projectName: string;
  recommendation: 'recommend' | 'caution' | 'not_recommend'; // 🟢 建议参与 / 🟡 谨慎参与 / 🔴 不建议参与
  coreReasons: {
    qualificationMatchRate: number; // %
    experienceMatchRate: number; // %
    expectedScore: number; // 分
    maxScore: number;
    primaryStrength: string;
    primaryWeakness: string;
    maxDisqualificationRisk: string;
    maxScoreOpportunity: string;
  };
  strategicVerdict: string;
  timestamp: string;
}

export type FinalCombatReport = FinalBidReport;
export type BidDocumentHealthCheck = BidHealthCheckResult;
export type Top10IssueItem = HealthCheckIssue;

export interface CompanyProfile {
  id?: string;
  companyName: string;
  industry: string;
  registeredCapital: string;
  certifications: string[]; // ISO, 资质证书
  personnel: Array<{ name: string; role: string; certs: string; experience: string }>;
  cases: Array<{ projectName: string; client: string; amount: string; date: string; description: string }>;
  financialHealth: string;
  afterSalesNetwork: string;
}

export interface TenderAnalysisResult {
  id: string;
  timestamp: string;
  rawTextPreview?: string;
  overview: ProjectOverview;
  qualifications: QualificationCheckItem[];
  risks: DisqualificationRiskItem[];
  evaluationScores: EvaluationScoreItem[];
  strategy: ScoreOptimizationStrategy;
  capabilityMatrix: CompanyCapabilityMatrixItem[];
  combatTasks: CombatTaskItem[];
  proposalOutline: TechnicalProposalChapter[];
  healthCheck: BidHealthCheckResult;
  finalReport: FinalBidReport;
}

export type StepKey =
  | 'overview'
  | 'qualification'
  | 'risks'
  | 'evaluation'
  | 'strategy'
  | 'matrix'
  | 'tasks'
  | 'proposal'
  | 'healthCheck'
  | 'report';
