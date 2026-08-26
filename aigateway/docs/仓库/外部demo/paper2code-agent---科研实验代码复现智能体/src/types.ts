export interface MathFormula {
  id: string;
  name: string;
  latex: string;
  description: string;
  codeMapping: string; // e.g. "models/model.py:L45-L60"
  targetModule: string;
}

export interface PaperExperimentPlan {
  targetTable: string; // e.g. "Table 2: Multivariate Long-term Forecasting"
  datasets: Array<{
    name: string;
    features: number;
    split: string;
    sampleRate: string;
    description: string;
  }>;
  forecastHorizons: number[]; // e.g. [96, 192, 336, 720]
  baselines: string[]; // e.g. ["DLinear", "Autoformer", "Informer", "FedFormer", "PatchTST (Ours)"]
  metrics: string[]; // e.g. ["MSE", "MAE"]
  hyperparameters: {
    seq_len: number;
    pred_len: number;
    patch_len: number;
    stride: number;
    d_model: number;
    n_heads: number;
    e_layers: number;
    d_ff: number;
    dropout: number;
    learning_rate: number;
    batch_size: number;
    epochs: number;
    patience: number;
    optimizer: string;
    scheduler: string;
    random_seed: number;
  };
}

export interface GeneratedCodeFile {
  path: string;
  filename: string;
  folder: string;
  language: 'python' | 'yaml' | 'bash' | 'markdown';
  purpose: string;
  content: string;
  formulaReferences?: Array<{ formulaName: string; lines: [number, number] }>;
}

export interface PaperBenchmarkRow {
  model: string;
  isOurs?: boolean;
  isReproduced?: boolean;
  h96_mse: number;
  h96_mae: number;
  h192_mse: number;
  h192_mae: number;
  h336_mse: number;
  h336_mae: number;
  h720_mse: number;
  h720_mae: number;
  avg_mse: number;
  avg_mae: number;
}

export interface DiscrepancyReason {
  factor: string;
  probability: 'High' | 'Medium' | 'Low';
  explanation: string;
  recommendation: string;
}

export interface DiscrepancyAnalysis {
  overallMatchScore: number; // 0 - 100%
  summary: string;
  metricsComparison: Array<{
    metric: string;
    paperVal: number;
    reproVal: number;
    deltaPercent: number;
    status: 'MATCH' | 'SLIGHT_VARIANCE' | 'GAP';
  }>;
  reasons: DiscrepancyReason[];
  latexTableCode: string;
}

export interface TrainingEpochLog {
  epoch: number;
  train_loss: number;
  val_loss: number;
  test_mse: number;
  test_mae: number;
  learning_rate: number;
  gpu_mem_mb: number;
  time_seconds: number;
}

export interface ConsoleLogMessage {
  id: string;
  timestamp: string;
  level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'METRIC';
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionTag?: string;
  suggestedAction?: {
    label: string;
    type: 'apply_config' | 'run_experiment' | 'switch_tab';
    payload?: any;
  };
}

export interface ResearchPaper {
  id: string;
  title: string;
  shortName: string;
  authors: string;
  venue: string;
  year: number;
  domain: string;
  targetSection: string;
  targetGoal: string;
  abstract: string;
  sectionExcerpt: string;
  mathFormulas: MathFormula[];
  experimentPlan: PaperExperimentPlan;
  paperTable2: PaperBenchmarkRow[];
  reproducedTable2: PaperBenchmarkRow[];
  files: GeneratedCodeFile[];
  discrepancyAnalysis: DiscrepancyAnalysis;
}

export type PipelineStage = 
  | 'extract'       // 1. 论文解析
  | 'plan'          // 2. 实验规划
  | 'code'          // 3. 代码工程
  | 'execute'       // 4. 实验运行
  | 'compare'       // 5. 结果对比与归因
  | 'charts';       // 6. 论文图表与 LaTeX
