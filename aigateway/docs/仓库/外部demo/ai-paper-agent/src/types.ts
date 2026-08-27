export type WorkflowStep = 'experiment' | 'generating' | 'paper' | 'reviewing' | 'reviewer' | 'revision';

export interface MetricItem {
  name: string;
  value: string | number;
  unit?: string;
  improvement?: string;
  description: string;
}

export interface BaselineComparison {
  model: string;
  mae: number;
  rmse: number;
  mape: number;
  inferenceTimeMs: number;
  isOurs?: boolean;
  pValVsOurs?: string;
}

export interface AblationItem {
  variant: string;
  description: string;
  mae: number;
  rmse: number;
  mape: number;
  deltaMape: string;
}

export interface ExperimentFigure {
  id: string;
  number: number;
  title: string;
  caption: string;
  type: 'line_chart' | 'heatmap' | 'ablation_bar';
  dataDescription: string;
}

export interface ExperimentTable {
  id: string;
  number: number;
  title: string;
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface ExperimentProject {
  id: string;
  title: string;
  domain: string;
  objective: string;
  datasetName: string;
  datasetSize: string;
  metrics: MetricItem[];
  parameters: { key: string; value: string }[];
  baselines: BaselineComparison[];
  figures: ExperimentFigure[];
  tables: ExperimentTable[];
  keyFindings: string[];
}

export interface PaperSection {
  id: string;
  title: string;
  number: string;
  content: string;
  hasFigure?: string; // figure id
  hasTable?: string;  // table id
  subsections?: {
    id: string;
    title: string;
    number: string;
    content: string;
    hasFigure?: string;
    hasTable?: string;
  }[];
}

export interface PaperData {
  title: string;
  authors: { name: string; institution: string; email: string }[];
  abstract: string;
  keywords: string[];
  sections: PaperSection[];
  references: { id: number; text: string; doi?: string }[];
  lastUpdated: string;
  version: string;
}

export interface ReviewIssue {
  id: string;
  type: 'major' | 'minor';
  title: string;
  category: 'methodology' | 'experiments' | 'ablation' | 'formatting' | 'figures' | 'statistics';
  critique: string;
  aiSuggestion: string;
  actionTitle: string;
  isResolved: boolean;
  resolutionEffectDescription: string;
}

export interface ReviewReport {
  overallScore: number; // e.g. 5/10 before revision, 9/10 after
  decision: 'Strong Reject' | 'Major Revision' | 'Minor Revision' | 'Accept' | string;
  confidence: string;
  summary: string;
  strengths: string[];
  majorIssues: ReviewIssue[];
  minorIssues: ReviewIssue[];
  checkpoints: {
    name: string;
    status: 'pass' | 'warning' | 'fail';
    comment: string;
  }[];
}
