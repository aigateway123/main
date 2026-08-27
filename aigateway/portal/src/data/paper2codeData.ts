// ============================================================================
// Paper2Code Agent —— 科研实验代码复现智能体 演示数据
//
// 还原自外部参考 demo「paper2code-agent---科研实验代码复现智能体」：
// - 类型定义
// - 2 篇预置论文（PatchTST ICLR23 / NodeFormer NeurIPS22）的完整解析、
//   实验规划、代码工程、基准表、差异归因、LaTeX 表格
// - 训练 epoch 模拟、AI 科研助手对话模拟、自定义论文构建
// ============================================================================

// ------------------------------------------------------------------ 类型定义

export interface MathFormula {
  id: string
  name: string
  latex: string
  description: string
  /** 例如 "models/model.py:L45-L60" */
  codeMapping: string
  targetModule: string
}

export interface PaperExperimentPlan {
  /** 例如 "Table 2: Multivariate Long-term Forecasting" */
  targetTable: string
  datasets: Array<{
    name: string
    features: number
    split: string
    sampleRate: string
    description: string
  }>
  forecastHorizons: number[]
  baselines: string[]
  metrics: string[]
  hyperparameters: {
    seq_len: number
    pred_len: number
    patch_len: number
    stride: number
    d_model: number
    n_heads: number
    e_layers: number
    d_ff: number
    dropout: number
    learning_rate: number
    batch_size: number
    epochs: number
    patience: number
    optimizer: string
    scheduler: string
    random_seed: number
  }
}

export interface GeneratedCodeFile {
  path: string
  filename: string
  folder: string
  language: 'python' | 'yaml' | 'bash' | 'markdown'
  purpose: string
  content: string
  formulaReferences?: Array<{ formulaName: string; lines: [number, number] }>
}

export interface PaperBenchmarkRow {
  model: string
  isOurs?: boolean
  isReproduced?: boolean
  h96_mse: number
  h96_mae: number
  h192_mse: number
  h192_mae: number
  h336_mse: number
  h336_mae: number
  h720_mse: number
  h720_mae: number
  avg_mse: number
  avg_mae: number
}

export interface DiscrepancyReason {
  factor: string
  probability: 'High' | 'Medium' | 'Low'
  explanation: string
  recommendation: string
}

export interface DiscrepancyAnalysis {
  /** 0-100 */
  overallMatchScore: number
  summary: string
  metricsComparison: Array<{
    metric: string
    paperVal: number
    reproVal: number
    deltaPercent: number
    status: 'MATCH' | 'SLIGHT_VARIANCE' | 'GAP'
  }>
  reasons: DiscrepancyReason[]
  latexTableCode: string
}

export interface TrainingEpochLog {
  epoch: number
  train_loss: number
  val_loss: number
  test_mse: number
  test_mae: number
  learning_rate: number
  gpu_mem_mb: number
  time_seconds: number
}

export interface ConsoleLogMessage {
  id: string
  timestamp: string
  level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'METRIC'
  message: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  actionTag?: string
  suggestedAction?: {
    label: string
    type: 'apply_config' | 'run_experiment' | 'switch_tab'
    payload?: any
  }
}

export interface ResearchPaper {
  id: string
  title: string
  shortName: string
  authors: string
  venue: string
  year: number
  domain: string
  targetSection: string
  targetGoal: string
  abstract: string
  sectionExcerpt: string
  mathFormulas: MathFormula[]
  experimentPlan: PaperExperimentPlan
  paperTable2: PaperBenchmarkRow[]
  reproducedTable2: PaperBenchmarkRow[]
  files: GeneratedCodeFile[]
  discrepancyAnalysis: DiscrepancyAnalysis
}

export type PipelineStage =
  | 'extract' // 1. 论文解析
  | 'plan' //    2. 实验规划
  | 'code' //    3. 代码工程
  | 'execute' // 4. 实验运行
  | 'compare' // 5. 结果对比与归因
  | 'charts' //  6. 论文图表与 LaTeX

// ---------------------------------------------------------------- 预置论文数据

export const PRESET_PAPERS: ResearchPaper[] = [
  {
    id: 'patchtst-iclr23',
    title:
      'A Time Series is Worth 64 Words: Long-term Forecasting with Patch Time Series Transformer',
    shortName: 'PatchTST (ICLR 2023)',
    authors: 'Yuqi Nie, Nam H. Nguyen, Phanwadee Sinthong, Jayant Kalagnanam',
    venue: 'ICLR',
    year: 2023,
    domain: '时间序列预测 (Time Series Forecasting)',
    targetSection: 'Section 4: Experimental Results & Benchmarks',
    targetGoal:
      '按照论文 Section 4 的实验设计，帮我复现 Table 2（Weather 与 ETT 多变量长期预测对比）。',
    abstract:
      'We propose an effective design of Transformer-based models for time series forecasting tasks by introducing two key components: patching and channel-independence. Time series are segmented into subseries-level patches which are served as input tokens to Transformer. Channel-independence means each channel contains a single univariate series that shares the same embedding and Transformer weights across all series. PatchTST achieves substantial state-of-the-art improvements over previous Transformer and Linear models on multi-dataset benchmarks.',
    sectionExcerpt: `Section 4.1 Datasets and Setups:
We evaluate PatchTST on extensively used real-world benchmark datasets: Weather (21 meteorological indicators), ETTh1, ETTh2, ETTm1, ETTm2, Electricity, and Traffic. The dataset is split into training, validation, and test sets with standard ratios (70%/10%/20%).
Lookback window L is set to 336 (or 512), and forecast horizon H in {96, 192, 336, 720}.
Evaluation metrics are Mean Squared Error (MSE) and Mean Absolute Error (MAE).
We compare against state-of-the-art baselines including DLinear, Autoformer, Informer, and FedFormer.

Table 2: Multivariate long-term forecasting results for H in {96, 192, 336, 720}. A lower MSE/MAE indicates better performance.`,
    mathFormulas: [
      {
        id: 'eq1',
        name: 'Eq (1): Patch Tokenization (时间切片分块)',
        latex: '\\mathbf{x}_p^{(i)} \\in \\mathbb{R}^{P \\times N}, \\quad N = \\left\\lfloor \\frac{L - P}{S} \\right\\rfloor + 2',
        description:
          '将长度为 L 的单变量时间序列划分为长度为 P、步长为 S 的 N 个子序列 Patch，保留局部语义并大幅降低注意力二次复杂度。',
        codeMapping: 'models/model.py:L48-L62',
        targetModule: 'PatchEmbedding',
      },
      {
        id: 'eq2',
        name: 'Eq (2): Linear Projection & Positional Embedding (投影与位置编码)',
        latex: '\\mathbf{Z}^{(i)} = \\mathbf{W}_p \\mathbf{x}_p^{(i)} + \\mathbf{W}_{pos}, \\quad \\mathbf{W}_p \\in \\mathbb{R}^{D \\times P}, \\mathbf{W}_{pos} \\in \\mathbb{R}^{D \\times N}',
        description: '将每个 Patch 线性投影至 D 维隐层空间，并叠加可学习的 1D 位置编码。',
        codeMapping: 'models/model.py:L64-L78',
        targetModule: 'PatchEmbedding',
      },
      {
        id: 'eq3',
        name: 'Eq (3): Channel-Independent Transformer Encoder (通道独立编码器)',
        latex: '\\mathbf{H}^{(i)} = \\text{TransformerEncoder}\\left(\\mathbf{Z}^{(i)}\\right), \\quad i \\in \\{1, 2, \\dots, M\\}',
        description: 'M 个变量共享同一套 Transformer 权重，独立计算自注意力，避免跨变量过拟合。',
        codeMapping: 'models/model.py:L85-L110',
        targetModule: 'TSTEncoder',
      },
      {
        id: 'eq4',
        name: 'Eq (4): Flattening & Forecasting Head (展平线性预测头)',
        latex: '\\hat{\\mathbf{y}}^{(i)} = \\mathbf{W}_{head} \\cdot \\text{Flatten}\\left(\\mathbf{H}^{(i)}\\right) \\in \\mathbb{R}^H',
        description: '展平所有 Patch Token 的隐层表征，通过单个全连接层直接映射到未来 H 步预测值。',
        codeMapping: 'models/model.py:L115-L130',
        targetModule: 'PredictionHead',
      },
    ],
    experimentPlan: {
      targetTable: 'Table 2: Multivariate Long-term Forecasting Benchmark',
      datasets: [
        {
          name: 'Weather',
          features: 21,
          split: '70% Train / 10% Val / 20% Test',
          sampleRate: '10 min',
          description:
            'Max-Planck-Institute for Biogeochemistry weather dataset (2020), containing 21 meteorological features including temperature, humidity, pressure, wind speed.',
        },
        {
          name: 'ETTh1',
          features: 7,
          split: '12 / 4 / 4 months',
          sampleRate: '1 hour',
          description: 'Electricity Transformer Temperature (Hourly) dataset.',
        },
      ],
      forecastHorizons: [96, 192, 336, 720],
      baselines: [
        'DLinear',
        'Autoformer',
        'Informer',
        'FedFormer',
        'PatchTST (Paper Reported)',
        'PatchTST (Reproduced Ours)',
      ],
      metrics: ['MSE', 'MAE'],
      hyperparameters: {
        seq_len: 336,
        pred_len: 96,
        patch_len: 16,
        stride: 8,
        d_model: 128,
        n_heads: 16,
        e_layers: 3,
        d_ff: 256,
        dropout: 0.2,
        learning_rate: 0.0005,
        batch_size: 128,
        epochs: 50,
        patience: 10,
        optimizer: 'AdamW',
        scheduler: 'CosineAnnealingLR',
        random_seed: 2023,
      },
    },
    paperTable2: [
      {
        model: 'Informer (AAAI 21)',
        h96_mse: 0.3,
        h96_mae: 0.384,
        h192_mse: 0.598,
        h192_mae: 0.544,
        h336_mse: 0.578,
        h336_mae: 0.523,
        h720_mse: 1.059,
        h720_mae: 0.741,
        avg_mse: 0.634,
        avg_mae: 0.548,
      },
      {
        model: 'Autoformer (NeurIPS 21)',
        h96_mse: 0.266,
        h96_mae: 0.336,
        h192_mse: 0.307,
        h192_mae: 0.367,
        h336_mse: 0.359,
        h336_mae: 0.395,
        h720_mse: 0.419,
        h720_mae: 0.428,
        avg_mse: 0.338,
        avg_mae: 0.382,
      },
      {
        model: 'FedFormer (ICML 22)',
        h96_mse: 0.217,
        h96_mae: 0.296,
        h192_mse: 0.276,
        h192_mae: 0.336,
        h336_mse: 0.339,
        h336_mae: 0.38,
        h720_mse: 0.403,
        h720_mae: 0.428,
        avg_mse: 0.309,
        avg_mae: 0.36,
      },
      {
        model: 'DLinear (AAAI 23)',
        h96_mse: 0.176,
        h96_mae: 0.237,
        h192_mse: 0.22,
        h192_mae: 0.282,
        h336_mse: 0.265,
        h336_mae: 0.319,
        h720_mse: 0.323,
        h720_mae: 0.362,
        avg_mse: 0.246,
        avg_mae: 0.3,
      },
      {
        model: 'PatchTST (Paper Reported)',
        isOurs: true,
        h96_mse: 0.149,
        h96_mae: 0.198,
        h192_mse: 0.194,
        h192_mae: 0.241,
        h336_mse: 0.245,
        h336_mae: 0.282,
        h720_mse: 0.314,
        h720_mae: 0.334,
        avg_mse: 0.225,
        avg_mae: 0.264,
      },
    ],
    reproducedTable2: [
      {
        model: 'PatchTST (Reproduced Ours)',
        isOurs: true,
        isReproduced: true,
        h96_mse: 0.151,
        h96_mae: 0.199,
        h192_mse: 0.196,
        h192_mae: 0.243,
        h336_mse: 0.247,
        h336_mae: 0.285,
        h720_mse: 0.318,
        h720_mae: 0.338,
        avg_mse: 0.228,
        avg_mae: 0.266,
      },
    ],
    discrepancyAnalysis: {
      overallMatchScore: 98.7,
      summary:
        '复现实验与原论文 Table 2 报告指标高度吻合（平均 MSE 误差仅为 +0.003，偏差率在 1.3% 以内）。各预测步长（96/192/336/720）趋势完全一致，且显著超越 DLinear 与 FedFormer 基准线。',
      metricsComparison: [
        { metric: 'Horizon 96 (MSE)', paperVal: 0.149, reproVal: 0.151, deltaPercent: 1.34, status: 'MATCH' },
        { metric: 'Horizon 96 (MAE)', paperVal: 0.198, reproVal: 0.199, deltaPercent: 0.51, status: 'MATCH' },
        { metric: 'Horizon 192 (MSE)', paperVal: 0.194, reproVal: 0.196, deltaPercent: 1.03, status: 'MATCH' },
        { metric: 'Horizon 192 (MAE)', paperVal: 0.241, reproVal: 0.243, deltaPercent: 0.83, status: 'MATCH' },
        { metric: 'Horizon 336 (MSE)', paperVal: 0.245, reproVal: 0.247, deltaPercent: 0.82, status: 'MATCH' },
        { metric: 'Horizon 336 (MAE)', paperVal: 0.282, reproVal: 0.285, deltaPercent: 1.06, status: 'MATCH' },
        { metric: 'Horizon 720 (MSE)', paperVal: 0.314, reproVal: 0.318, deltaPercent: 1.27, status: 'MATCH' },
        { metric: 'Horizon 720 (MAE)', paperVal: 0.334, reproVal: 0.338, deltaPercent: 1.2, status: 'MATCH' },
      ],
      reasons: [
        {
          factor: 'GPU 硬件精度与 cuDNN 随机种子 (Floating Point Precision)',
          probability: 'High',
          explanation:
            '原论文在 NVIDIA A100 (40GB) 上采用 FP32 训练，不同 GPU 架构（如 V100/3090/A100）的 cuDNN 卷积与矩阵运算非确定性算法存在微量浮点误差（通常在 ±0.002 内）。',
          recommendation:
            '可通过固定 torch.backends.cudnn.benchmark = False 和设置多种子 (Seeds: 2021-2025) 取均值缩小差异。',
        },
        {
          factor: '可逆实例归一化 (RevIN) 的可学习参数设定',
          probability: 'Medium',
          explanation:
            '论文中对 Weather 数据集启用了 RevIN 仿射参数 (affine=True)，若使用静态均值方差归一化会在长序列 (H=720) 产生轻微累计误差。',
          recommendation: '已在 config.yaml 与 models/model.py 中将 RevIN(affine=True) 默认开启。',
        },
        {
          factor: '学习率 Warmup 步数与 Early Stopping 容忍度',
          probability: 'Low',
          explanation:
            '原作者在训练时采用了 5 epochs 的 Linear Warmup，若直接以 5e-4 学习率起始，前几个 epoch 的注意力矩阵可能会产生微小振荡。',
          recommendation: '已在 train.py 中加入 get_cosine_schedule_with_warmup 调度器。',
        },
      ],
      latexTableCode: `% Publication-ready LaTeX Table (Overleaf Compatible)
\\begin{table*}[t]
\\centering
\\small
\\caption{Multivariate long-term forecasting results on \\textbf{Weather} dataset comparison (Reproducing Table 2).}
\\label{tab:reproduction_weather_table2}
\\setlength{\\tabcolsep}{4.5pt}
\\begin{tabular}{l|cc|cc|cc|cc|cc}
\\toprule
\\multirow{2}{*}{\\textbf{Methods}} & \\multicolumn{2}{c|}{\\textbf{96}} & \\multicolumn{2}{c|}{\\textbf{192}} & \\multicolumn{2}{c|}{\\textbf{336}} & \\multicolumn{2}{c|}{\\textbf{720}} & \\multicolumn{2}{c}{\\textbf{Average}} \\\\
& MSE & MAE & MSE & MAE & MSE & MAE & MSE & MAE & MSE & MAE \\\\
\\midrule
Informer (AAAI'21) & 0.300 & 0.384 & 0.598 & 0.544 & 0.578 & 0.523 & 1.059 & 0.741 & 0.634 & 0.548 \\\\
Autoformer (NeurIPS'21) & 0.266 & 0.336 & 0.307 & 0.367 & 0.359 & 0.395 & 0.419 & 0.428 & 0.338 & 0.382 \\\\
FedFormer (ICML'22) & 0.217 & 0.296 & 0.276 & 0.336 & 0.339 & 0.380 & 0.403 & 0.428 & 0.309 & 0.360 \\\\
DLinear (AAAI'23) & 0.176 & 0.237 & 0.220 & 0.282 & 0.265 & 0.319 & 0.323 & 0.362 & 0.246 & 0.300 \\\\
\\midrule
\\textbf{PatchTST (Reported)} & \\textbf{0.149} & \\textbf{0.198} & \\textbf{0.194} & \\textbf{0.241} & \\textbf{0.245} & \\textbf{0.282} & \\textbf{0.314} & \\textbf{0.334} & \\textbf{0.225} & \\textbf{0.264} \\\\
\\rowcolor{gray!15}
\\textbf{PatchTST (Reproduced Ours)} & 0.151 & 0.199 & 0.196 & 0.243 & 0.247 & 0.285 & 0.318 & 0.338 & 0.228 & 0.266 \\\\
\\bottomrule
\\end{tabular}
\\end{table*}`,
    },
    files: [
      {
        path: '/config.yaml',
        filename: 'config.yaml',
        folder: '/',
        language: 'yaml',
        purpose: '实验全局配置文件 (数据集路径、模型超参数、训练与评测设置)',
        content: `# ==============================================================================
# PatchTST: Time Series Forecasting Experiment Configuration
# Target: Reproducing Table 2 (Weather Benchmark) from ICLR 2023 Paper
# ==============================================================================

experiment:
  name: "patchtst_weather_table2"
  seed: 2023
  deterministic: true
  device: "cuda" # or "cpu"

data:
  dataset_name: "Weather"
  data_path: "./data/weather.csv"
  features: "M" # M: multivariate -> multivariate, S: univariate -> univariate
  target: "OT"
  freq: "10min"
  num_features: 21
  train_ratio: 0.70
  val_ratio: 0.10
  test_ratio: 0.20
  scale: true

model:
  name: "PatchTST"
  seq_len: 336       # Lookback window length L
  pred_len: 96       # Forecast horizon H in [96, 192, 336, 720]
  patch_len: 16      # Patch length P
  stride: 8          # Stride S
  d_model: 128       # Latent dimension D
  n_heads: 16        # Number of attention heads
  e_layers: 3        # Number of Transformer encoder layers
  d_ff: 256          # Feed-forward hidden dimension
  dropout: 0.2       # Dropout rate
  head_dropout: 0.0  # Linear head dropout
  individual: 0      # 0: shared head, 1: individual head per channel
  revin: true        # Use Reversible Instance Normalization
  affine: true       # Learnable affine parameters in RevIN
  subtract_last: 0

training:
  epochs: 50
  batch_size: 128
  learning_rate: 0.0005
  loss_fn: "MSE"
  optimizer: "AdamW"
  weight_decay: 0.0001
  patience: 10       # Early stopping patience
  clip_grad: 5.0
  warmup_epochs: 5
  scheduler: "CosineAnnealingLR"
  save_dir: "./results/checkpoints"
`,
      },
      {
        path: '/data/dataset.py',
        filename: 'dataset.py',
        folder: 'data',
        language: 'python',
        purpose: '时间序列数据读取、滑动窗口划分与可逆标准化 (RevIN)',
        content: `"""
Dataset and DataLoader Implementation for Time Series Benchmark.
Handles sliding window extraction, train/val/test splitting, and standardization.
"""
import os
import torch
import numpy as np
import pandas as pd
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import StandardScaler

class TimeSeriesDataset(Dataset):
    def __init__(self, data_path, flag='train', size=(336, 96), scale=True):
        """
        size: (seq_len, pred_len)
        flag: 'train' (70%), 'val' (10%), 'test' (20%)
        """
        self.seq_len, self.pred_len = size
        self.flag = flag
        self.scale = scale
        self.data_path = data_path
        self.__read_data__()

    def __read_data__(self):
        self.scaler = StandardScaler()
        if os.path.exists(self.data_path):
            df_raw = pd.read_csv(self.data_path)
        else:
            # Synthetic generation matching Weather dataset statistics (21 features)
            np.random.seed(2023)
            timesteps = 52696 # ~1 year at 10-minute intervals
            t = np.linspace(0, 100, timesteps)
            trend = 0.05 * t
            season_daily = 3.5 * np.sin(2 * np.pi * t / (24 * 6))
            season_annual = 12.0 * np.sin(2 * np.pi * t / (365 * 24 * 6))
            noise = np.random.normal(0, 0.5, (timesteps, 21))
            features = np.zeros((timesteps, 21))
            for col in range(21):
                features[:, col] = trend + season_daily * (0.8 + 0.1 * col) + season_annual + noise[:, col]
            df_raw = pd.DataFrame(features, columns=[f'feat_{i}' for i in range(21)])

        # Calculate train, val, test slice bounds
        num_train = int(len(df_raw) * 0.70)
        num_test = int(len(df_raw) * 0.20)
        num_val = len(df_raw) - num_train - num_test

        border1s = [0, num_train - self.seq_len, len(df_raw) - num_test - self.seq_len]
        border2s = [num_train, num_train + num_val, len(df_raw)]

        flag_idx = {'train': 0, 'val': 1, 'test': 2}[self.flag]
        border1, border2 = border1s[flag_idx], border2s[flag_idx]

        cols_data = df_raw.values
        if self.scale:
            train_data = cols_data[border1s[0]:border2s[0]]
            self.scaler.fit(train_data)
            data = self.scaler.transform(cols_data)
        else:
            data = cols_data

        self.data_x = data[border1:border2]
        self.data_y = data[border1:border2]

    def __getitem__(self, index):
        s_begin = index
        s_end = s_begin + self.seq_len
        r_begin = s_end
        r_end = r_begin + self.pred_len

        seq_x = self.data_x[s_begin:s_end]
        seq_y = self.data_y[r_begin:r_end]
        return torch.tensor(seq_x, dtype=torch.float32), torch.tensor(seq_y, dtype=torch.float32)

    def __len__(self):
        return len(self.data_x) - self.seq_len - self.pred_len + 1


def get_dataloader(data_path, flag='train', batch_size=128, seq_len=336, pred_len=96, shuffle=True):
    dataset = TimeSeriesDataset(data_path=data_path, flag=flag, size=(seq_len, pred_len))
    return DataLoader(dataset, batch_size=batch_size, shuffle=shuffle, num_workers=2, drop_last=False)
`,
      },
      {
        path: '/models/model.py',
        filename: 'model.py',
        folder: 'models',
        language: 'python',
        purpose:
          'PatchTST 核心模型架构 (RevIN 归一化 + Patch Tokenizer + 通道独立 Transformer + 线性预测头)',
        content: `"""
PatchTST: A Time Series is Worth 64 Words (ICLR 2023)
PyTorch Implementation with explicit mathematical formula mappings.
"""
import torch
import torch.nn as nn
import math

class RevIN(nn.Module):
    """
    Reversible Instance Normalization to eliminate distribution shift.
    """
    def __init__(self, num_features: int, eps=1e-5, affine=True):
        super(RevIN, self).__init__()
        self.num_features = num_features
        self.eps = eps
        self.affine = affine
        if self.affine:
            self.affine_weight = nn.Parameter(torch.ones(num_features))
            self.affine_bias = nn.Parameter(torch.zeros(num_features))

    def forward(self, x, mode: str):
        # x: [Batch, Length, Channels]
        if mode == 'norm':
            self.mean = torch.mean(x, dim=1, keepdim=True).detach()
            self.stdev = torch.sqrt(torch.var(x, dim=1, keepdim=True, unbiased=False) + self.eps).detach()
            x = (x - self.mean) / self.stdev
            if self.affine:
                x = x * self.affine_weight + self.affine_bias
            return x
        elif mode == 'denorm':
            if self.affine:
                x = (x - self.affine_bias) / (self.affine_weight + self.eps)
            x = x * self.stdev + self.mean
            return x
        else:
            raise NotImplementedError


class PatchEmbedding(nn.Module):
    """
    [Eq 1 & Eq 2]: Patch Tokenization and 1D Linear Projection + Position Encoding
    Formula: Z = W_p * x_p + W_pos
    """
    def __init__(self, patch_len=16, stride=8, d_model=128, dropout=0.1):
        super().__init__()
        self.patch_len = patch_len
        self.stride = stride
        self.projection = nn.Linear(patch_len, d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # x: [Batch * Channels, Seq_Len]
        # Unfold into patches: (B*C, Num_Patches, Patch_Len)
        num_patches = (x.shape[-1] - self.patch_len) // self.stride + 1
        patches = x.unfold(dimension=-1, size=self.patch_len, step=self.stride) # [B*C, N, P]

        # Eq (2): Linear Projection to d_model
        projected = self.projection(patches) # [B*C, N, d_model]
        return self.dropout(projected)


class PatchTST(nn.Module):
    """
    Main PatchTST Model Architecture
    Combines Channel-Independence + Patch Embedding + Transformer Encoder + Flatten Linear Head
    """
    def __init__(self, num_features=21, seq_len=336, pred_len=96,
                 patch_len=16, stride=8, d_model=128, n_heads=16,
                 e_layers=3, d_ff=256, dropout=0.2, revin=True):
        super().__init__()
        self.num_features = num_features
        self.seq_len = seq_len
        self.pred_len = pred_len
        self.patch_len = patch_len
        self.stride = stride
        self.use_revin = revin

        if self.use_revin:
            self.revin_layer = RevIN(num_features, affine=True)

        # Eq (1-2): Patching & Linear Embedding
        self.num_patches = (seq_len - patch_len) // stride + 1
        self.patch_embedding = PatchEmbedding(patch_len, stride, d_model, dropout)

        # Learnable Positional Encoding W_pos
        self.pos_embedding = nn.Parameter(torch.randn(1, self.num_patches, d_model) * 0.02)

        # Eq (3): Channel-Independent Transformer Encoder
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=n_heads,
            dim_feedforward=d_ff,
            dropout=dropout,
            activation='gelu',
            batch_first=True
        )
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=e_layers)

        # Eq (4): Flattening & Forecasting Head
        self.head = nn.Linear(self.num_patches * d_model, pred_len)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # x: [Batch, Seq_Len, Channels]
        B, L, C = x.shape

        # Step 1: RevIN Normalization
        if self.use_revin:
            x = self.revin_layer(x, mode='norm')

        # Step 2: Channel Independence (Permute to treat each channel as an independent sample)
        # [B, L, C] -> [B, C, L] -> [B * C, L]
        x = x.permute(0, 2, 1).reshape(B * C, L)

        # Step 3: Patch Tokenization & Positional Embedding (Eq 1 & Eq 2)
        enc_in = self.patch_embedding(x) + self.pos_embedding # [B*C, N, d_model]

        # Step 4: Multi-Head Transformer Encoder (Eq 3)
        enc_out = self.transformer_encoder(enc_in) # [B*C, N, d_model]

        # Step 5: Flatten & Linear Prediction Head (Eq 4)
        flattened = enc_out.reshape(B * C, -1) # [B*C, N * d_model]
        out = self.head(self.dropout(flattened)) # [B*C, pred_len]

        # Reshape back to [B, pred_len, C]
        out = out.reshape(B, C, self.pred_len).permute(0, 2, 1)

        # Step 6: RevIN Denormalization
        if self.use_revin:
            out = self.revin_layer(out, mode='denorm')

        return out
`,
      },
      {
        path: '/train.py',
        filename: 'train.py',
        folder: '/',
        language: 'python',
        purpose: '模型训练主循环 (包含 Early Stopping、Cosine 学习率衰减、验证集评估)',
        content: `"""
Training script for PatchTST reproducing Table 2.
"""
import os
import yaml
import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from data.dataset import get_dataloader
from models.model import PatchTST

def train_epoch(model, dataloader, optimizer, criterion, device):
    model.train()
    total_loss = 0.0
    for batch_x, batch_y in dataloader:
        batch_x, batch_y = batch_x.to(device), batch_y.to(device)
        optimizer.zero_grad()
        pred = model(batch_x)
        loss = criterion(pred, batch_y)
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), max_norm=5.0)
        optimizer.step()
        total_loss += loss.item()
    return total_loss / len(dataloader)

def eval_epoch(model, dataloader, criterion, device):
    model.eval()
    total_loss = 0.0
    total_mae = 0.0
    with torch.no_grad():
        for batch_x, batch_y in dataloader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            pred = model(batch_x)
            loss = criterion(pred, batch_y)
            mae = torch.mean(torch.abs(pred - batch_y))
            total_loss += loss.item()
            total_mae += mae.item()
    return total_loss / len(dataloader), total_mae / len(dataloader)

def main():
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)

    device = torch.device(config['experiment']['device'] if torch.cuda.is_available() else "cpu")
    print(f"[*] Initializing Training on {device} with seed={config['experiment']['seed']}...")

    # Load DataLoaders
    train_loader = get_dataloader(
        config['data']['data_path'], 'train',
        batch_size=config['training']['batch_size'],
        seq_len=config['model']['seq_len'],
        pred_len=config['model']['pred_len']
    )
    val_loader = get_dataloader(
        config['data']['data_path'], 'val',
        batch_size=config['training']['batch_size'],
        seq_len=config['model']['seq_len'],
        pred_len=config['model']['pred_len']
    )

    # Initialize Model
    model = PatchTST(
        num_features=config['data']['num_features'],
        seq_len=config['model']['seq_len'],
        pred_len=config['model']['pred_len'],
        patch_len=config['model']['patch_len'],
        stride=config['model']['stride'],
        d_model=config['model']['d_model'],
        n_heads=config['model']['n_heads'],
        e_layers=config['model']['e_layers'],
        d_ff=config['model']['d_ff'],
        dropout=config['model']['dropout'],
        revin=config['model']['revin']
    ).to(device)

    criterion = nn.MSELoss()
    optimizer = AdamW(model.parameters(), lr=config['training']['learning_rate'], weight_decay=config['training']['weight_decay'])
    scheduler = CosineAnnealingLR(optimizer, T_max=config['training']['epochs'], eta_min=1e-6)

    best_val_loss = float('inf')
    patience_cnt = 0
    os.makedirs(config['training']['save_dir'], exist_ok=True)

    print("[*] Starting Training Loop (50 Epochs)...")
    for epoch in range(1, config['training']['epochs'] + 1):
        train_loss = train_epoch(model, train_loader, optimizer, criterion, device)
        val_loss, val_mae = eval_epoch(model, val_loader, criterion, device)
        scheduler.step()

        print(f"Epoch [{epoch:02d}/50] | Train MSE: {train_loss:.4f} | Val MSE: {val_loss:.4f} | Val MAE: {val_mae:.4f} | LR: {scheduler.get_last_lr()[0]:.6f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_cnt = 0
            torch.save(model.state_dict(), os.path.join(config['training']['save_dir'], "best_checkpoint.pth"))
        else:
            patience_cnt += 1
            if patience_cnt >= config['training']['patience']:
                print(f"[!] Early stopping triggered at epoch {epoch}")
                break

    print("[✓] Training completed successfully. Best checkpoint saved.")

if __name__ == '__main__':
    main()
`,
      },
      {
        path: '/evaluate.py',
        filename: 'evaluate.py',
        folder: '/',
        language: 'python',
        purpose: '测试集全面评估 (计算 MSE, MAE, R2 并与原论文 Table 2 基准进行误差统计)',
        content: `"""
Evaluation script for computing Table 2 benchmark metrics across forecast horizons.
"""
import yaml
import torch
import numpy as np
from data.dataset import get_dataloader
from models.model import PatchTST

def evaluate_horizon(pred_len, seq_len=336):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    test_loader = get_dataloader("./data/weather.csv", 'test', batch_size=128, seq_len=seq_len, pred_len=pred_len, shuffle=False)

    model = PatchTST(num_features=21, seq_len=seq_len, pred_len=pred_len).to(device)
    # In production, load state_dict checkpoint

    preds, trues = [], []
    model.eval()
    with torch.no_grad():
        for batch_x, batch_y in test_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            out = model(batch_x)
            preds.append(out.cpu().numpy())
            trues.append(batch_y.cpu().numpy())

    preds = np.concatenate(preds, axis=0)
    trues = np.concatenate(trues, axis=0)

    mse = np.mean((preds - trues) ** 2)
    mae = np.mean(np.abs(preds - trues))
    return mse, mae

def main():
    horizons = [96, 192, 336, 720]
    print("=" * 60)
    print("PatchTST Table 2 Reproduction Benchmark (Weather Dataset)")
    print("=" * 60)
    print(f"{'Horizon':<10} | {'Test MSE':<12} | {'Test MAE':<12} | {'Paper MSE':<12} | {'Delta (%)'}")
    print("-" * 60)

    paper_targets = {
        96: (0.149, 0.198),
        192: (0.194, 0.241),
        336: (0.245, 0.282),
        720: (0.314, 0.334),
    }

    repro_results = {
        96: (0.151, 0.199),
        192: (0.196, 0.243),
        336: (0.247, 0.285),
        720: (0.318, 0.338),
    }

    for h in horizons:
        paper_mse, paper_mae = paper_targets[h]
        repro_mse, repro_mae = repro_results[h]
        delta = ((repro_mse - paper_mse) / paper_mse) * 100.0
        print(f"H={h:<8} | {repro_mse:<12.3f} | {repro_mae:<12.3f} | {paper_mse:<12.3f} | +{delta:.2f}%")

    print("=" * 60)
    print("[✓] All horizons successfully reproduced within 1.4% statistical margin.")

if __name__ == '__main__':
    main()
`,
      },
      {
        path: '/experiments/run_benchmark.sh',
        filename: 'run_benchmark.sh',
        folder: 'experiments',
        language: 'bash',
        purpose: '多步长 (96, 192, 336, 720) 与多随机种子自动化批处理评测脚本',
        content: `#!/usr/bin/env bash
# ==============================================================================
# Script to run all Table 2 experiments on Weather dataset across 4 horizons
# ==============================================================================

set -e

DATASET="Weather"
SEQ_LEN=336
HORIZONS=(96 192 336 720)
SEEDS=(2021 2022 2023)

echo "=== [Paper2Code Agent] Starting Batch Reproduction for Table 2 ==="

for PRED_LEN in "\${HORIZONS[@]}"; do
  for SEED in "\${SEEDS[@]}"; do
    echo ">>> Running PatchTST on \${DATASET} | Seq=\${SEQ_LEN} -> Pred=\${PRED_LEN} | Seed=\${SEED}"
    python train.py --data_name \${DATASET} --seq_len \${SEQ_LEN} --pred_len \${PRED_LEN} --seed \${SEED}
  done
done

echo ">>> Aggregating and Generating LaTeX Table..."
python results/generate_table.py --dataset \${DATASET}

echo "=== [✓] Reproduction Pipeline Completed Successfully ==="
`,
      },
      {
        path: '/results/generate_table.py',
        filename: 'generate_table.py',
        folder: 'results',
        language: 'python',
        purpose: '自动汇总多轮实验结果并导出出版级 LaTeX 表格与 CSV 报告',
        content: `"""
Export benchmark reproduction results to LaTeX table format for Overleaf.
"""
import pandas as pd

def export_latex():
    data = {
        "Method": [
            "Informer (AAAI'21)",
            "Autoformer (NeurIPS'21)",
            "FedFormer (ICML'22)",
            "DLinear (AAAI'23)",
            "PatchTST (Paper Reported)",
            "PatchTST (Reproduced Ours)"
        ],
        "H=96 MSE": [0.300, 0.266, 0.217, 0.176, 0.149, 0.151],
        "H=96 MAE": [0.384, 0.336, 0.296, 0.237, 0.198, 0.199],
        "H=192 MSE": [0.598, 0.307, 0.276, 0.220, 0.194, 0.196],
        "H=192 MAE": [0.544, 0.367, 0.336, 0.282, 0.241, 0.243],
        "H=336 MSE": [0.578, 0.359, 0.339, 0.265, 0.245, 0.247],
        "H=336 MAE": [0.523, 0.395, 0.380, 0.319, 0.282, 0.285],
        "H=720 MSE": [1.059, 0.419, 0.403, 0.323, 0.314, 0.318],
        "H=720 MAE": [0.741, 0.428, 0.428, 0.362, 0.334, 0.338],
    }

    df = pd.DataFrame(data)
    df.to_csv("results/table2_benchmark.csv", index=False)
    print("[✓] CSV saved to results/table2_benchmark.csv")
    print("\\nLaTeX Code:\\n")
    print(df.to_latex(index=False))

if __name__ == '__main__':
    export_latex()
`,
      },
      {
        path: '/README.md',
        filename: 'README.md',
        folder: '/',
        language: 'markdown',
        purpose: '实验复现指南、环境依赖说明与重现步骤',
        content: `# Reproduction Repository: PatchTST (ICLR 2023)

> Auto-generated by **Paper2Code Agent** for PhD Research Reproduction.
> Target: Reproducing **Section 4 / Table 2** (Multivariate Weather Benchmark).

---

## 🚀 Quick Start

### 1. Environment Setup
\`\`\`bash
conda create -n patchtst_repro python=3.10 -y
conda activate patchtst_repro
pip install torch torchvision torchaudio numpy pandas scikit-learn pyyaml
\`\`\`

### 2. Train on Weather Dataset (H=96)
\`\`\`bash
python train.py
\`\`\`

### 3. Evaluate & Reproduce Full Table 2
\`\`\`bash
bash experiments/run_benchmark.sh
\`\`\`

### 4. Output Summary
- Checkpoint directory: \`results/checkpoints/\`
- Benchmark table & LaTeX: \`results/table2_benchmark.csv\`
`,
      },
    ],
  },
  {
    id: 'nodeformer-neurips22',
    title: 'NodeFormer: A Scalable Graph Transformer for Large-scale Node Classification',
    shortName: 'NodeFormer (NeurIPS 2022)',
    authors: 'Qitian Wu, Wentao Zhao, Zenan Li, David P. Wipf, Junchi Yan',
    venue: 'NeurIPS',
    year: 2022,
    domain: '图机器学习 (Graph Neural Networks)',
    targetSection: 'Section 5: Large-scale Benchmark on OGB-Arxiv',
    targetGoal:
      '按照论文 Section 5 实验设计，复现 Table 2（OGB-Arxiv 与 Cora 节点分类准确率对比）。',
    abstract:
      'Graph Neural Networks (GNNs) relying on message passing suffer from over-smoothing and scalability bottlenecks. We propose NodeFormer, a scalable Graph Transformer that achieves all-pair node attention with linear time and memory complexity via kernelized Gumbel-Softmax random features.',
    sectionExcerpt:
      'Section 5 Benchmark on OGB-Arxiv: Node classification with 169,343 nodes and 1.1M edges. Evaluation metric: Accuracy (%) and Macro-F1 across 10 random runs.',
    mathFormulas: [
      {
        id: 'gf1',
        name: 'Eq (1): Kernelized All-Pair Softmax Attention',
        latex: '\\mathbf{A}_{i,j} = \\frac{\\phi(\\mathbf{Q}_i)^T \\phi(\\mathbf{K}_j)}{\\sum_{k} \\phi(\\mathbf{Q}_i)^T \\phi(\\mathbf{K}_k)}',
        description:
          '利用正交随机特征映射 phi(x) 将全图 O(N^2) 注意力矩阵核化为 O(N) 线性复杂度。',
        codeMapping: 'models/model.py:L52-L70',
        targetModule: 'KernelizedAttention',
      },
      {
        id: 'gf2',
        name: 'Eq (2): Gumbel-Softmax Edge Sampling Loss',
        latex: '\\mathcal{L}_{edge} = -\\sum_{(u, v) \\in \\mathcal{E}} \\log \\left( \\sigma(\\mathbf{z}_u^T \\mathbf{z}_v) \\right)',
        description: '在随机游走图结构与语义注意力之间建立对比保形正则化。',
        codeMapping: 'train.py:L60-L75',
        targetModule: 'GraphLoss',
      },
    ],
    experimentPlan: {
      targetTable: 'Table 2: OGB-Arxiv Node Classification Accuracy',
      datasets: [
        {
          name: 'ogbn-arxiv',
          features: 128,
          split: 'Train < 2018 / Val 2018 / Test 2019-2020',
          sampleRate: 'Graph Nodes (169,343)',
          description:
            'Open Graph Benchmark citation network with 169K computer science papers and 40 subject categories.',
        },
      ],
      forecastHorizons: [1],
      baselines: [
        'GCN',
        'GAT',
        'GraphSAGE',
        'NodeFormer (Reported)',
        'NodeFormer (Reproduced Ours)',
      ],
      metrics: ['Accuracy (%)', 'Macro-F1'],
      hyperparameters: {
        seq_len: 1,
        pred_len: 40,
        patch_len: 1,
        stride: 1,
        d_model: 64,
        n_heads: 4,
        e_layers: 2,
        d_ff: 128,
        dropout: 0.3,
        learning_rate: 0.01,
        batch_size: 10000,
        epochs: 100,
        patience: 20,
        optimizer: 'AdamW',
        scheduler: 'StepLR',
        random_seed: 42,
      },
    },
    paperTable2: [
      {
        model: 'GCN (ICLR 17)',
        h96_mse: 71.74,
        h96_mae: 0.68,
        h192_mse: 0,
        h192_mae: 0,
        h336_mse: 0,
        h336_mae: 0,
        h720_mse: 0,
        h720_mae: 0,
        avg_mse: 71.74,
        avg_mae: 0.68,
      },
      {
        model: 'GAT (ICLR 18)',
        h96_mse: 72.1,
        h96_mae: 0.69,
        h192_mse: 0,
        h192_mae: 0,
        h336_mse: 0,
        h336_mae: 0,
        h720_mse: 0,
        h720_mae: 0,
        avg_mse: 72.1,
        avg_mae: 0.69,
      },
      {
        model: 'GraphSAGE (NeurIPS 17)',
        h96_mse: 72.24,
        h96_mae: 0.69,
        h192_mse: 0,
        h192_mae: 0,
        h336_mse: 0,
        h336_mae: 0,
        h720_mse: 0,
        h720_mae: 0,
        avg_mse: 72.24,
        avg_mae: 0.69,
      },
      {
        model: 'NodeFormer (Reported)',
        isOurs: true,
        h96_mse: 73.85,
        h96_mae: 0.72,
        h192_mse: 0,
        h192_mae: 0,
        h336_mse: 0,
        h336_mae: 0,
        h720_mse: 0,
        h720_mae: 0,
        avg_mse: 73.85,
        avg_mae: 0.72,
      },
    ],
    reproducedTable2: [
      {
        model: 'NodeFormer (Reproduced Ours)',
        isOurs: true,
        isReproduced: true,
        h96_mse: 73.78,
        h96_mae: 0.72,
        h192_mse: 0,
        h192_mae: 0,
        h336_mse: 0,
        h336_mae: 0,
        h720_mse: 0,
        h720_mae: 0,
        avg_mse: 73.78,
        avg_mae: 0.72,
      },
    ],
    discrepancyAnalysis: {
      overallMatchScore: 99.1,
      summary:
        'OGB-Arxiv 节点分类准确率复现达到 73.78% ± 0.12%（原论文报告 73.85%），在统计置信区间 (p > 0.05) 内完全可重现。',
      metricsComparison: [
        { metric: 'ogbn-arxiv Accuracy (%)', paperVal: 73.85, reproVal: 73.78, deltaPercent: -0.09, status: 'MATCH' },
        { metric: 'Macro-F1 Score', paperVal: 0.72, reproVal: 0.719, deltaPercent: -0.14, status: 'MATCH' },
      ],
      reasons: [
        {
          factor: '随机特征映射采样种子 (Kernelized Random Features Seed)',
          probability: 'High',
          explanation: 'NodeFormer 中的随机特征投影矩阵每次初始化会有极微小的核逼近方差。',
          recommendation: '采用 10 次不同随机种子运行求平均值。',
        },
      ],
      latexTableCode: `\\begin{table}[h]
\\centering
\\caption{Node Classification Accuracy (\\%) on OGB-Arxiv}
\\begin{tabular}{lc}
\\toprule
\\textbf{Model} & \\textbf{ogbn-arxiv (Test Acc)} \\\\
\\midrule
GCN & 71.74 $\\pm$ 0.29 \\\\
GAT & 72.10 $\\pm$ 0.35 \\\\
GraphSAGE & 72.24 $\\pm$ 0.21 \\\\
\\textbf{NodeFormer (Reported)} & \\textbf{73.85 $\\pm$ 0.18} \\\\
\\textbf{NodeFormer (Reproduced)} & 73.78 $\\pm$ 0.14 \\\\
\\bottomrule
\\end{tabular}
\\end{table}`,
    },
    files: [
      {
        path: '/config.yaml',
        filename: 'config.yaml',
        folder: '/',
        language: 'yaml',
        purpose: 'NodeFormer 图神经网络超参数配置文件',
        content: `experiment:
  name: "nodeformer_ogbarxiv"
  seed: 42
  device: "cuda"

dataset:
  name: "ogbn-arxiv"
  num_nodes: 169343
  num_classes: 40
  in_features: 128

model:
  d_model: 64
  n_heads: 4
  layers: 2
  num_rff: 30 # Random Fourier Features
  tau: 0.25   # Temperature

training:
  epochs: 100
  lr: 0.01
  weight_decay: 1e-4
  dropout: 0.3
`,
      },
      {
        path: '/models/model.py',
        filename: 'model.py',
        folder: 'models',
        language: 'python',
        purpose: 'NodeFormer 线性核化自注意力与 Gumbel-Softmax 实现',
        content: `import torch
import torch.nn as nn
import math

class KernelizedAttention(nn.Module):
    """
    Eq (1): Linear Complexity Kernelized Graph Attention
    """
    def __init__(self, d_in, d_out, num_rff=30):
        super().__init__()
        self.d_in = d_in
        self.d_out = d_out
        self.num_rff = num_rff
        self.w_q = nn.Linear(d_in, d_out)
        self.w_k = nn.Linear(d_in, d_out)
        self.w_v = nn.Linear(d_in, d_out)
        self.omega = nn.Parameter(torch.randn(d_out, num_rff) / math.sqrt(d_out), requires_grad=False)

    def phi(self, x):
        # Positive Random Feature Map
        proj = torch.matmul(x, self.omega)
        return torch.cat([torch.exp(proj), torch.exp(-proj)], dim=-1) / math.sqrt(2 * self.num_rff)

    def forward(self, x):
        Q = self.w_q(x)
        K = self.w_k(x)
        V = self.w_v(x)

        phi_Q = self.phi(Q)
        phi_K = self.phi(K)

        # O(N) Linear Attention Matrix Multiplication
        # KV = phi(K)^T * V
        KV = torch.matmul(phi_K.transpose(-2, -1), V)
        Z = 1.0 / (torch.matmul(phi_Q, phi_K.sum(dim=-2, keepdim=True).transpose(-2, -1)) + 1e-6)
        out = torch.matmul(phi_Q, KV) * Z
        return out
`,
      },
      {
        path: '/train.py',
        filename: 'train.py',
        folder: '/',
        language: 'python',
        purpose: '图节点分类训练循环与早停机制',
        content: `import torch
import torch.nn as nn
from models.model import KernelizedAttention

def main():
    print("[*] Training NodeFormer on ogbn-arxiv benchmark...")
    print("Epoch [100/100] | Train Acc: 76.2% | Val Acc: 74.1% | Test Acc: 73.78%")
    print("[✓] Finished training. Test accuracy matches reported benchmark.")

if __name__ == '__main__':
    main()
`,
      },
      {
        path: '/README.md',
        filename: 'README.md',
        folder: '/',
        language: 'markdown',
        purpose: 'NodeFormer 复现说明',
        content: `# NodeFormer Reproduction Repo
Generated by Paper2Code Agent.
`,
      },
    ],
  },
]

// ------------------------------------------------------- 实验运行模拟（epoch 生成）

export function generateEpochLog(epoch: number, maxEpochs: number): TrainingEpochLog {
  const progress = epoch / maxEpochs
  // Decaying loss curve simulating real convergence
  const train_loss = 0.52 * Math.exp(-progress * 2.8) + 0.148 + (Math.random() * 0.004 - 0.002)
  const val_loss = 0.55 * Math.exp(-progress * 2.6) + 0.151 + (Math.random() * 0.005 - 0.0025)
  const test_mse = 0.48 * Math.exp(-progress * 2.5) + 0.151 + (Math.random() * 0.003 - 0.0015)
  const test_mae = 0.42 * Math.exp(-progress * 2.2) + 0.199 + (Math.random() * 0.003 - 0.0015)
  const lr = 0.0005 * (0.5 * (1 + Math.cos((Math.PI * epoch) / maxEpochs)))

  return {
    epoch,
    train_loss,
    val_loss,
    test_mse,
    test_mae,
    learning_rate: lr,
    gpu_mem_mb: 1840 + Math.floor(Math.random() * 60),
    time_seconds: epoch * 1.8,
  }
}

// ------------------------------------------------------- AI 科研助手对话模拟

export interface ChatSimResult {
  reply: string
  /** 是否需要触发「一键复现 Table 2」闭环 */
  reproduce?: boolean
  /** 需要跳转到的阶段（可空） */
  stage?: PipelineStage
}

let chatSimCounter = 0

export function createUniqueId(prefix: string): string {
  chatSimCounter += 1
  return `${prefix}-${Date.now()}-${chatSimCounter}-${Math.random().toString(36).substring(2, 7)}`
}

export function nowTime(): string {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

export function simulateChatReply(message: string, paper: ResearchPaper): ChatSimResult {
  const q = (message || '').toLowerCase()

  if (q.includes('消融') || q.includes('ablation')) {
    return {
      stage: 'code',
      reply: `已为您制定消融实验（Ablation Study）方案：
1. **w/o Patching (去除分块)**: 直接使用点级嵌入，验证 Patch 的长程依赖建模能力；
2. **w/o Channel-Independence (共享通道)**: 验证多变量通道独立性对时间序列抗过拟合的作用；
3. **w/o RevIN (去除可逆归一化)**: 测试在存在显著分布漂移（Distribution Shift）时的退化情况。

已在 \`config.yaml\` 与 \`experiments/ablation.sh\` 中生成对应的消融实验脚本！`,
    }
  }

  if (q.includes('学习率') || q.includes('lr') || q.includes('调参')) {
    return {
      stage: 'code',
      reply: `已为您优化超参数策略：
- 建议将初始学习率从 \`1e-3\` 调整为 \`5e-4\`
- 引入 **CosineAnnealingLR (T_max=50, eta_min=1e-6)** 学习率衰减
- 增加 Warmup Epochs = 5，以防止早期 Transformer 梯度爆炸。
已自动更新 \`config.yaml\` 中的学习率与优化器配置！`,
    }
  }

  if (q.includes('latex') || q.includes('表格') || q.includes('overleaf') || q.includes('图表')) {
    return {
      stage: 'charts',
      reply: `已为您生成符合 IEEE/ACM/NeurIPS 格式的双栏 LaTeX 表格代码，支持一键复制直接粘贴至 Overleaf。请查看右侧「论文图表与 LaTeX」面板。`,
    }
  }

  if (q.includes('差异') || q.includes('对比')) {
    return {
      stage: 'compare',
      reply: `已完成复现结果与原论文 Table 2 的逐项对比分析：
1. **整体可复现性评分**: ${paper.discrepancyAnalysis.overallMatchScore}%；
2. 各预测步长（H=96/192/336/720）MSE/MAE 偏差均在 **±1.4%** 置信区间内；
3. 已定位主要差异成因：GPU 浮点精度、RevIN 仿射参数、Warmup 步数。

已自动切换至「结果对比与归因」面板，可查看详细归因建议。`,
    }
  }

  if (q.includes('复现 table 2') || q.includes('运行实验') || q.includes('复现table')) {
    return {
      reproduce: true,
      stage: 'compare',
      reply: `已为您自动完成 **Table 2 实验复现闭环**：
1. **数据与模型加载**：已在 \`models/model.py\` 与 \`data/dataset.py\` 完成 RevIN 归一化与 Patch Tokenization；
2. **多步长训练与评测**：完成 Weather 数据集在 4 个预测步长（H=96, 192, 336, 720）下的拟合；
3. **复现结果对齐**：
   - H=96 MSE: **0.151**（原论文报告: 0.149，偏差仅 +1.3%）
   - H=192 MSE: **0.196**（原论文报告: 0.194）
   - H=336 MSE: **0.247**（原论文报告: 0.245）
   - H=720 MSE: **0.318**（原论文报告: 0.314）

已自动跳转至「结果对比与归因」面板，您可以查看详细差异归因分析！`,
    }
  }

  return {
    stage: 'code',
    reply: `作为您的科研实验复现助理，我已经分析了您的要求：“${message}”。
1. 论文的 ${paper.targetSection} 实验核心在于验证多预测步长（H=96, 192, 336, 720）下的泛化误差；
2. 当前生成代码已完整实现公式映射，并在 \`models/model.py\` 中对 Patching、Linear Projection 和 Multi-head Attention 做了逐行公式批注；
3. 您可以点击右上角「一键复现 Table 2」模拟真实训练过程，或直接下载完整 Python 项目。`,
  }
}

// ------------------------------------------------------- 自定义论文构建（上传解析）

export interface CustomPaperInput {
  title: string
  authors: string
  venue: string
  targetGoal: string
  paperContent: string
}

export function buildCustomPaper(input: CustomPaperInput): ResearchPaper {
  const { title, authors, venue, targetGoal, paperContent } = input
  const newId = 'custom-' + Date.now()
  return {
    id: newId,
    title,
    shortName: title.slice(0, 24) + '...',
    authors: authors || 'Research Lab Team',
    venue: venue || 'Conference 2024',
    year: 2024,
    domain: '科研论文实验复现',
    targetSection: 'Section 4: Experimental Evaluation',
    targetGoal: targetGoal || '按照论文 Section 4 的实验设计，帮我复现 Table 2。',
    abstract: paperContent.slice(0, 300) || 'Paper methodology extracted for automated code reproduction.',
    sectionExcerpt: paperContent || 'Section 4 Benchmark Setup...',
    mathFormulas: [
      {
        id: 'eq1',
        name: 'Eq (1): Core Transformation & Loss',
        latex: '\\mathcal{L}_{total} = \\mathcal{L}_{task} + \\lambda \\Omega(\\theta)',
        description: 'Core optimization objective formulated from paper.',
        codeMapping: 'models/model.py:L40-L55',
        targetModule: 'CustomModel',
      },
    ],
    experimentPlan: {
      targetTable: 'Table 2: Benchmark Comparison',
      datasets: [
        {
          name: 'Target Benchmark Dataset',
          features: 10,
          split: '70% Train / 10% Val / 20% Test',
          sampleRate: 'Standard',
          description: 'Extracted benchmark dataset for evaluation.',
        },
      ],
      forecastHorizons: [96, 192, 336, 720],
      baselines: ['Baseline-A', 'Baseline-B', 'Ours (Reported)', 'Ours (Reproduced)'],
      metrics: ['MSE', 'MAE'],
      hyperparameters: {
        seq_len: 336,
        pred_len: 96,
        patch_len: 16,
        stride: 8,
        d_model: 128,
        n_heads: 8,
        e_layers: 3,
        d_ff: 256,
        dropout: 0.1,
        learning_rate: 0.0005,
        batch_size: 64,
        epochs: 50,
        patience: 10,
        optimizer: 'AdamW',
        scheduler: 'CosineAnnealingLR',
        random_seed: 2024,
      },
    },
    paperTable2: [
      {
        model: 'Baseline-A',
        h96_mse: 0.28,
        h96_mae: 0.35,
        h192_mse: 0.33,
        h192_mae: 0.38,
        h336_mse: 0.39,
        h336_mae: 0.42,
        h720_mse: 0.45,
        h720_mae: 0.47,
        avg_mse: 0.362,
        avg_mae: 0.405,
      },
      {
        model: 'Ours (Reported)',
        isOurs: true,
        h96_mse: 0.16,
        h96_mae: 0.21,
        h192_mse: 0.205,
        h192_mae: 0.25,
        h336_mse: 0.255,
        h336_mae: 0.29,
        h720_mse: 0.32,
        h720_mae: 0.34,
        avg_mse: 0.235,
        avg_mae: 0.272,
      },
    ],
    reproducedTable2: [
      {
        model: 'Ours (Reproduced)',
        isOurs: true,
        isReproduced: true,
        h96_mse: 0.162,
        h96_mae: 0.212,
        h192_mse: 0.207,
        h192_mae: 0.252,
        h336_mse: 0.258,
        h336_mae: 0.293,
        h720_mse: 0.324,
        h720_mae: 0.344,
        avg_mse: 0.238,
        avg_mae: 0.275,
      },
    ],
    discrepancyAnalysis: {
      overallMatchScore: 98.4,
      summary:
        '新论文实验代码已完成自动生成与基准对齐，复现指标与原论文报告数值在 ±1.5% 置信区间内高度吻合。',
      metricsComparison: [
        { metric: 'Benchmark MSE', paperVal: 0.235, reproVal: 0.238, deltaPercent: 1.28, status: 'MATCH' },
        { metric: 'Benchmark MAE', paperVal: 0.272, reproVal: 0.275, deltaPercent: 1.1, status: 'MATCH' },
      ],
      reasons: [
        {
          factor: '随机种子初始化与矩阵精度',
          probability: 'High',
          explanation: 'GPU 随机数发生器与浮点舍入差异导致微量波动。',
          recommendation: '固定随机种子并在多卡测试取均值。',
        },
      ],
      latexTableCode: `\\begin{table}[h]
\\centering
\\caption{Benchmark Results on ${title.slice(0, 20)}}
\\begin{tabular}{lcc}
\\toprule
\\textbf{Model} & \\textbf{MSE} & \\textbf{MAE} \\\\
\\midrule
Baseline-A & 0.362 & 0.405 \\\\
\\textbf{Ours (Reported)} & 0.235 & 0.272 \\\\
\\textbf{Ours (Reproduced)} & 0.238 & 0.275 \\\\
\\bottomrule
\\end{tabular}
\\end{table}`,
    },
    files: [
      {
        path: '/config.yaml',
        filename: 'config.yaml',
        folder: '/',
        language: 'yaml',
        purpose: '复现配置文件',
        content: `experiment:
  name: "custom_reproduction"
  seed: 2024
model:
  learning_rate: 0.0005
  batch_size: 64
`,
      },
      {
        path: '/models/model.py',
        filename: 'model.py',
        folder: 'models',
        language: 'python',
        purpose: '论文核心模型实现',
        content: `import torch
import torch.nn as nn

class CustomModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(128, 64)

    def forward(self, x):
        return self.fc(x)
`,
      },
      {
        path: '/train.py',
        filename: 'train.py',
        folder: '/',
        language: 'python',
        purpose: '训练主循环',
        content: `print("[*] Training custom reproduction pipeline...")`,
      },
      {
        path: '/README.md',
        filename: 'README.md',
        folder: '/',
        language: 'markdown',
        purpose: '复现指南',
        content: `# ${title}\n\nAuto-generated reproduction repo.`,
      },
    ],
  }
}
