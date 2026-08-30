export type AgentStepStatus = 'pending' | 'running' | 'completed' | 'error';

export interface AgentStep {
  id: string;
  label: string;
  detail: string;
  status: AgentStepStatus;
  durationMs?: number;
}

export interface DatasetMeta {
  id: string;
  fileName: string;
  fileType: 'xlsx' | 'csv';
  fileSize: string;
  rowCount: number;
  columnCount: number;
  description: string;
  uploadTime: string;
  columns: Array<{
    name: string;
    type: 'numeric' | 'categorical' | 'datetime';
    missing: number;
    sampleValue: string | number;
  }>;
  previewRows: Array<Record<string, string | number>>;
}

export interface GroupStat {
  group: string;
  name: string;
  score: number;
  stdDev: number;
  sampleCount: number;
  ci95: [number, number];
  color: string;
}

export interface AnomalySample {
  id: string;
  sampleIndex: string; // e.g. "Sample #12842"
  metric: string;
  normalRange: string;
  currentValue: number | string;
  riskLevel: '高' | '中' | '低';
  diagnosis: string;
  recommendation: string;
  timestamp: string;
  status?: 'flagged' | 'excluded' | 'verified';
  abnormalFeature?: string;
  observedValue?: string;
  expectedRange?: string;
  deviation?: string;
  cause?: string;
  suggestion?: string;
  score?: number;
}

export interface ChartItem {
  id: string;
  title: string;
  figureNumber: string;
  type: 'bar' | 'distribution' | 'trend' | 'anomaly';
  description: string;
  statisticalNote: string;
}

export interface ReportSection {
  id: string;
  number: string;
  title: string;
  summary: string;
  content: string[];
  keyMetrics?: Array<{ label: string; value: string; note?: string }>;
}
