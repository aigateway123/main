export interface DataColumn {
  name: string;
  type: 'numeric' | 'categorical' | 'identifier' | 'datetime';
  role?: 'group' | 'treatment' | 'replicate' | 'batch' | 'metric' | 'covariate' | 'timepoint' | 'id';
  missingCount: number;
  uniqueCount: number;
  min?: number;
  max?: number;
  mean?: number;
  std?: number;
  median?: number;
}

export interface OutlierItem {
  id: string | number;
  rowIdx: number;
  column: string;
  value: number;
  group: string;
  expectedRange: [number, number];
  zScore: number;
  method: 'Z-Score' | 'IQR' | 'Dixon-Q' | 'Isolation Forest';
  suspectedCause: string;
  severity: 'high' | 'medium' | 'low';
}

export interface StatGroupResult {
  groupName: string;
  count: number;
  mean: number;
  std: number;
  sem: number;
  median: number;
  iqr: number;
  min: number;
  max: number;
  ci95: [number, number];
}

export interface HypothesisTestResult {
  metric: string;
  comparison: string;
  testMethod: string;
  testReasoning: string;
  statisticName: 't' | 'F' | 'U' | 'W' | 'z';
  statisticValue: number;
  pValue: number;
  degreesOfFreedom?: number;
  effectSizeName: "Cohen's d" | "Eta-squared" | "Rank-biserial" | "Fold Change";
  effectSizeValue: number;
  percentChange?: number;
  significanceLevel: '***' | '**' | '*' | 'ns';
  conclusion: string;
  normalityPass: boolean;
  varianceHomogeneityPass: boolean;
}

export interface AgentStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'warning';
  durationMs?: number;
  detailPayload?: any;
}

export interface GatewayCallLog {
  id: string;
  timestamp: string;
  stage: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  temperature: number;
  systemPromptSnippet: string;
  promptSnippet: string;
  responseSnippet: string;
  verificationPassed: boolean;
}

export interface AnalysisReport {
  executiveSummary: string;
  primaryFinding: {
    statement: string;
    groupA: string;
    groupB: string;
    metric: string;
    percentChange: number;
    pValueText: string;
    significanceText: string;
  };
  anomalySummary: {
    totalDetected: number;
    highSeverityCount: number;
    suspectedReasons: string[];
    actionableAdvice: string;
  };
  detailedFindings: Array<{
    title: string;
    content: string;
    evidence: string;
  }>;
  biologicalInterpretation: string;
  methodologyNotes: string;
  reproducibilityScore: number;
  generatedAt: string;
}

export interface CodeSnippets {
  python: string;
  r: string;
  jupyterNotebookJson?: string;
}

export interface BiomedicalDataset {
  id: string;
  name: string;
  category: 'Drug Screening' | 'RNA-Seq Transcriptomics' | 'Clinical Biomarkers' | 'Flow Cytometry / CRISPR';
  description: string;
  sourceInfo: string;
  primaryGroupCol: string;
  primaryMetricCol: string;
  idCol: string;
  batchCol?: string;
  data: Array<Record<string, any>>;
  suggestedPrompt: string;
}
