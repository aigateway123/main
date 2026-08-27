// ============================================================================
// Data Agent —— 科研数据分析智能体 演示数据
//
// 还原自外部参考 demo「科研数据分析-agent」：
// - 3 个预置数据集（xlsx / csv）
// - 9 步 Agent 自动化执行流
// - 三组对照统计、异常样本、4 类图表数据
// - 六章节学术报告与论文 Results 草稿
// ============================================================================

// ------------------------------------------------------------------ 类型定义

export type AgentStepStatus = 'pending' | 'running' | 'completed' | 'error'

export interface AgentStep {
  id: string
  label: string
  detail: string
  status: AgentStepStatus
  durationMs?: number
}

export interface DatasetColumn {
  name: string
  type: 'numeric' | 'categorical' | 'datetime'
  missing: number
  sampleValue: string | number
}

export interface DatasetMeta {
  id: string
  fileName: string
  fileType: 'xlsx' | 'csv'
  fileSize: string
  rowCount: number
  columnCount: number
  description: string
  uploadTime: string
  columns: DatasetColumn[]
  previewRows: Array<Record<string, string | number>>
}

export interface GroupStat {
  group: string
  name: string
  score: number
  stdDev: number
  sampleCount: number
  ci95: [number, number]
  color: string
}

export interface AnomalySample {
  id: string
  sampleIndex: string
  metric: string
  normalRange: string
  currentValue: number | string
  riskLevel: '高' | '中' | '低'
  diagnosis: string
  recommendation: string
  timestamp: string
  status?: 'flagged' | 'excluded' | 'verified'
  abnormalFeature?: string
  observedValue?: string
  expectedRange?: string
  deviation?: string
  cause?: string
  suggestion?: string
  score?: number
}

export interface ChartItem {
  id: string
  title: string
  figureNumber: string
  type: 'bar' | 'distribution' | 'trend' | 'anomaly'
  description: string
  statisticalNote: string
}

export interface ReportSection {
  id: string
  number: string
  title: string
  summary: string
  content: string[]
  keyMetrics?: Array<{ label: string; value: string; note?: string }>
}

// ---------------------------------------------------------------- 预置数据集

export const DEFAULT_DATASET: DatasetMeta = {
  id: 'exp-default-01',
  fileName: 'experiment_result.xlsx',
  fileType: 'xlsx',
  fileSize: '28.4 MB',
  rowCount: 186420,
  columnCount: 42,
  description: '高通量多维生物化学合成与性能表征对照试验数据集 (Group A, B, C)',
  uploadTime: '2026-08-26 14:00',
  columns: [
    { name: 'Sample_ID', type: 'categorical', missing: 0, sampleValue: 'SMP-0001' },
    { name: 'Group', type: 'categorical', missing: 0, sampleValue: 'Group A' },
    { name: 'Reaction_Time_h', type: 'numeric', missing: 12, sampleValue: 6.5 },
    { name: 'Temperature_C', type: 'numeric', missing: 48, sampleValue: 45.2 },
    { name: 'Pressure_MPa', type: 'numeric', missing: 25, sampleValue: 2.34 },
    { name: 'Catalyst_Conc_mM', type: 'numeric', missing: 5, sampleValue: 12.5 },
    { name: 'Yield_Percent', type: 'numeric', missing: 18, sampleValue: 84.6 },
    { name: 'Performance_Score', type: 'numeric', missing: 0, sampleValue: 88.2 },
  ],
  previewRows: [
    { id: '1', Sample_ID: 'SMP-0001', Group: 'Group A', Temperature_C: 45.2, Pressure_MPa: 2.12, Yield_Percent: 78.4, Performance_Score: 78.2, Status: 'Valid' },
    { id: '2', Sample_ID: 'SMP-0002', Group: 'Group A', Temperature_C: 45.5, Pressure_MPa: 2.18, Yield_Percent: 79.1, Performance_Score: 79.0, Status: 'Valid' },
    { id: '3', Sample_ID: 'SMP-0003', Group: 'Group B', Temperature_C: 50.1, Pressure_MPa: 2.45, Yield_Percent: 84.8, Performance_Score: 85.1, Status: 'Valid' },
    { id: '4', Sample_ID: 'SMP-0004', Group: 'Group B', Temperature_C: 50.4, Pressure_MPa: 2.40, Yield_Percent: 85.2, Performance_Score: 84.9, Status: 'Valid' },
    { id: '5', Sample_ID: 'SMP-0005', Group: 'Group C', Temperature_C: 55.0, Pressure_MPa: 2.65, Yield_Percent: 91.8, Performance_Score: 91.5, Status: 'Valid' },
    { id: '6', Sample_ID: 'SMP-0006', Group: 'Group C', Temperature_C: 55.2, Pressure_MPa: 2.70, Yield_Percent: 92.4, Performance_Score: 92.1, Status: 'Valid' },
    { id: '7', Sample_ID: 'SMP-12842', Group: 'Group A', Temperature_C: 137.0, Pressure_MPa: 3.40, Yield_Percent: 61.2, Performance_Score: 52.8, Status: 'Anomaly' },
    { id: '8', Sample_ID: 'SMP-45109', Group: 'Group B', Temperature_C: 49.8, Pressure_MPa: 2.30, Yield_Percent: 31.2, Performance_Score: 44.1, Status: 'Anomaly' },
  ],
}

export const PRESET_DATASETS: DatasetMeta[] = [
  DEFAULT_DATASET,
  {
    id: 'mat-02',
    fileName: 'material_strength_benchmark.csv',
    fileType: 'csv',
    fileSize: '14.2 MB',
    rowCount: 92500,
    columnCount: 28,
    description: '新型轻质高熵合金抗拉极限与疲劳寿命测试数据 (3组工艺梯度)',
    uploadTime: '2026-08-25 10:15',
    columns: [
      { name: 'Alloy_ID', type: 'categorical', missing: 0, sampleValue: 'HEA-801' },
      { name: 'Anneal_Temp', type: 'numeric', missing: 4, sampleValue: 850 },
      { name: 'Tensile_Strength_MPa', type: 'numeric', missing: 12, sampleValue: 1240 },
      { name: 'Elongation_pct', type: 'numeric', missing: 8, sampleValue: 18.4 },
    ],
    previewRows: [
      { id: '1', Alloy_ID: 'HEA-801', Anneal_Temp: 850, Tensile_Strength_MPa: 1240, Elongation_pct: 18.4, Status: 'Valid' },
      { id: '2', Alloy_ID: 'HEA-802', Anneal_Temp: 900, Tensile_Strength_MPa: 1380, Elongation_pct: 21.2, Status: 'Valid' },
      { id: '3', Alloy_ID: 'HEA-810', Anneal_Temp: 920, Tensile_Strength_MPa: 1410, Elongation_pct: 22.8, Status: 'Valid' },
    ],
  },
  {
    id: 'bio-03',
    fileName: 'cell_viability_kinetics.xlsx',
    fileType: 'xlsx',
    fileSize: '36.8 MB',
    rowCount: 240000,
    columnCount: 56,
    description: '不同靶向分子浓度对肿瘤细胞存活率与凋亡通路的延时荧光成像分析',
    uploadTime: '2026-08-24 16:30',
    columns: [
      { name: 'Well_Index', type: 'categorical', missing: 0, sampleValue: 'W-A01' },
      { name: 'Dose_uM', type: 'numeric', missing: 0, sampleValue: 10.0 },
      { name: 'Viability_pct', type: 'numeric', missing: 35, sampleValue: 42.6 },
    ],
    previewRows: [
      { id: '1', Well_Index: 'W-A01', Dose_uM: 0.1, Viability_pct: 98.4, Status: 'Valid' },
      { id: '2', Well_Index: 'W-A02', Dose_uM: 10.0, Viability_pct: 42.6, Status: 'Valid' },
      { id: '3', Well_Index: 'W-A03', Dose_uM: 50.0, Viability_pct: 12.3, Status: 'Valid' },
    ],
  },
]

// ------------------------------------------------------------------ Agent 步骤

export const AGENT_STEPS: AgentStep[] = [
  {
    id: 'step-1',
    label: '正在读取数据',
    detail: '解析 186,420 行 × 42 列二进制数据流，校验数据完整性与编码格式',
    status: 'completed',
    durationMs: 380,
  },
  {
    id: 'step-2',
    label: '识别数据字段',
    detail: '自动提取数值型指标 (32 列)、分类型标签 (8 列) 及时间戳特征',
    status: 'completed',
    durationMs: 240,
  },
  {
    id: 'step-3',
    label: '检查缺失值',
    detail: '全表缺失率为 1.2%，识别出 3 个副产物字段微量离散缺失项',
    status: 'completed',
    durationMs: 310,
  },
  {
    id: 'step-4',
    label: '检查异常值',
    detail: '多维 Isolation Forest 孤立森林与 3σ 原则识别出 23 个异常样本点',
    status: 'completed',
    durationMs: 450,
  },
  {
    id: 'step-5',
    label: '自动清洗数据',
    detail: '采用链式方程多重插补 (MICE)，清洗有效数据率达 98.8%',
    status: 'completed',
    durationMs: 520,
  },
  {
    id: 'step-6',
    label: '分析实验组差异',
    detail: '建立 Group A (基线)、Group B (优化)、Group C (强化) 对比特征空间',
    status: 'completed',
    durationMs: 410,
  },
  {
    id: 'step-7',
    label: '进行统计检验',
    detail: '单因素方差分析 F(2, 186417) = 428.6，事后 Tukey HSD 检验 p < 0.001',
    status: 'completed',
    durationMs: 360,
  },
  {
    id: 'step-8',
    label: '生成科研图表',
    detail: '渲染高分辨率学术级柱状图、核密度估计分布图、动力学时序曲线与离群散点图',
    status: 'completed',
    durationMs: 640,
  },
  {
    id: 'step-9',
    label: '输出分析结论',
    detail: '生成六章节结构化学术分析报告与可直接用于论文 Results 撰写的草案',
    status: 'completed',
    durationMs: 490,
  },
]

// ------------------------------------------------------------------ 统计与异常

export const GROUP_STATS: GroupStat[] = [
  {
    group: 'A',
    name: '实验组 A (Baseline)',
    score: 78.4,
    stdDev: 4.8,
    sampleCount: 62140,
    ci95: [77.2, 79.6],
    color: '#3b82f6',
  },
  {
    group: 'B',
    name: '实验组 B (Optimized)',
    score: 84.7,
    stdDev: 3.9,
    sampleCount: 62140,
    ci95: [83.8, 85.6],
    color: '#6366f1',
  },
  {
    group: 'C',
    name: '实验组 C (Enhanced)',
    score: 91.2,
    stdDev: 3.1,
    sampleCount: 62140,
    ci95: [90.5, 91.9],
    color: '#10b981',
  },
]

export const ANOMALY_SAMPLES: AnomalySample[] = [
  {
    id: 'ano-1',
    sampleIndex: 'Sample #12842',
    metric: 'Temperature',
    abnormalFeature: '温度异常',
    observedValue: '137 ℃',
    expectedRange: '20 ~ 80 ℃',
    normalRange: '20 ~ 80 ℃',
    currentValue: 137,
    deviation: '+71.25% (偏离 5.4σ)',
    riskLevel: '高',
    diagnosis: '传感器发生瞬时热漂移激增，显著超出安全上限 (+71.25%)，导致该批次热分解副产物异常上升',
    cause: '反应器 3 号位热电偶接触不良与瞬态升温过冲',
    recommendation: '建议在主分析中隔离该样本，并校准 3 号反应釜热电偶传感器',
    suggestion: '一键隔离剔除，避免污染均值与置信区间',
    timestamp: '2026-08-26 14:12:08',
    status: 'flagged',
    score: 0.94,
  },
  {
    id: 'ano-2',
    sampleIndex: 'Sample #45109',
    metric: 'Reaction Yield',
    abnormalFeature: '产率骤降',
    observedValue: '31.2 %',
    expectedRange: '65 ~ 95 %',
    normalRange: '65 ~ 95 %',
    currentValue: 31.2,
    deviation: '-52.0% (偏离 4.8σ)',
    riskLevel: '高',
    diagnosis: '溶剂配比注入异常导致反应产率骤降 (-52.0%)，属于明显的加料阶段机械阀门瞬态故障',
    cause: '加料泵 2 出现瞬态气阻，致使底物浓度不足预定值 40%',
    recommendation: '已自动作为极端离群点剔除，防止对组别 B 的均值造成负偏态污染',
    suggestion: '标记为机械故障样本，自动移至异常附录',
    timestamp: '2026-08-26 14:28:44',
    status: 'excluded',
    score: 0.91,
  },
  {
    id: 'ano-3',
    sampleIndex: 'Sample #98231',
    metric: 'Pressure (MPa)',
    abnormalFeature: '压力激增',
    observedValue: '7.84 MPa',
    expectedRange: '1.0 ~ 3.5 MPa',
    normalRange: '1.0 ~ 3.5 MPa',
    currentValue: 7.84,
    deviation: '+124.0% (偏离 3.9σ)',
    riskLevel: '中',
    diagnosis: '高压微通道瞬时背压达到 7.84 MPa (正常上限的 2.24 倍)，伴随轻微材料表面形变',
    cause: '微流控通道发生瞬时析晶微堵塞，但自疏通后系统恢复',
    recommendation: '建议保留作为耐压极限边界条件测试样本，并在 Supplementary Information 中讨论',
    suggestion: '保留复核，作为极端承载力边界分析案例',
    timestamp: '2026-08-26 15:05:19',
    status: 'verified',
    score: 0.78,
  },
]

export interface DistributionPoint {
  score: number
  Group_A: number
  Group_B: number
  Group_C: number
}

export interface TrendPoint {
  time: string
  Group_A: number
  Group_B: number
  Group_C: number
  Baseline: number
}

export interface ScatterPoint {
  id: number
  sample: string
  pressure: number
  yield: number
  status: string
  group: string
  note?: string
}

export const DISTRIBUTION_CHART_DATA: DistributionPoint[] = [
  { score: 65, Group_A: 2, Group_B: 0, Group_C: 0 },
  { score: 68, Group_A: 8, Group_B: 1, Group_C: 0 },
  { score: 71, Group_A: 24, Group_B: 3, Group_C: 0 },
  { score: 74, Group_A: 65, Group_B: 10, Group_C: 1 },
  { score: 77, Group_A: 95, Group_B: 28, Group_C: 2 },
  { score: 80, Group_A: 78, Group_B: 64, Group_C: 8 },
  { score: 83, Group_A: 38, Group_B: 98, Group_C: 22 },
  { score: 86, Group_A: 12, Group_B: 82, Group_C: 56 },
  { score: 89, Group_A: 3, Group_B: 45, Group_C: 96 },
  { score: 92, Group_A: 0, Group_B: 15, Group_C: 92 },
  { score: 95, Group_A: 0, Group_B: 2, Group_C: 54 },
  { score: 98, Group_A: 0, Group_B: 0, Group_C: 18 },
  { score: 100, Group_A: 0, Group_B: 0, Group_C: 4 },
]

export const TREND_CHART_DATA: TrendPoint[] = [
  { time: '0h', Group_A: 20.1, Group_B: 20.0, Group_C: 20.2, Baseline: 20.0 },
  { time: '2h', Group_A: 38.4, Group_B: 42.1, Group_C: 48.6, Baseline: 20.0 },
  { time: '4h', Group_A: 52.6, Group_B: 59.8, Group_C: 69.4, Baseline: 20.0 },
  { time: '6h', Group_A: 64.2, Group_B: 72.3, Group_C: 82.5, Baseline: 20.0 },
  { time: '8h', Group_A: 72.1, Group_B: 79.6, Group_C: 88.3, Baseline: 20.0 },
  { time: '10h', Group_A: 76.5, Group_B: 83.1, Group_C: 90.7, Baseline: 20.0 },
  { time: '12h', Group_A: 78.4, Group_B: 84.7, Group_C: 91.2, Baseline: 20.0 },
]

export const ANOMALY_SCATTER_DATA: ScatterPoint[] = [
  { id: 1, sample: 'S-101', pressure: 2.1, yield: 81.2, status: 'Normal', group: 'A' },
  { id: 2, sample: 'S-102', pressure: 2.3, yield: 82.5, status: 'Normal', group: 'A' },
  { id: 3, sample: 'S-103', pressure: 2.2, yield: 79.4, status: 'Normal', group: 'A' },
  { id: 4, sample: 'S-104', pressure: 2.4, yield: 85.6, status: 'Normal', group: 'B' },
  { id: 5, sample: 'S-105', pressure: 2.5, yield: 86.8, status: 'Normal', group: 'B' },
  { id: 6, sample: 'S-106', pressure: 2.4, yield: 84.2, status: 'Normal', group: 'B' },
  { id: 7, sample: 'S-107', pressure: 2.6, yield: 91.4, status: 'Normal', group: 'C' },
  { id: 8, sample: 'S-108', pressure: 2.5, yield: 92.1, status: 'Normal', group: 'C' },
  { id: 9, sample: 'S-109', pressure: 2.7, yield: 90.8, status: 'Normal', group: 'C' },
  { id: 10, sample: 'Sample #12842', pressure: 5.12, yield: 38.6, status: 'Anomaly', group: 'A', note: '温度过热 137℃ 异常' },
  { id: 11, sample: 'Sample #45109', pressure: 1.1, yield: 31.2, status: 'Anomaly', group: 'B', note: '溶剂比例异常 31.2%' },
  { id: 12, sample: 'Sample #98231', pressure: 7.84, yield: 88.5, status: 'Anomaly', group: 'C', note: '压力激增 7.84 MPa' },
]

// ------------------------------------------------------------------ 学术报告

export const REPORT_SECTIONS: ReportSection[] = [
  {
    id: 'sec-1',
    number: '一',
    title: '数据概况',
    summary: '高通量多组学实验数据结构化解析与完整性基线',
    content: [
      '本次数据分析基于预置科研实验数据集 experiment_result.xlsx，文件大小 28.4 MB。',
      '共载入 186,420 条高维实验样本观测记录，涵盖 42 个物理、化学与反应动力学特征维度。',
      '样本被明确划分为 3 个平行对照实验组别：实验组 A（基线条件，n=62,140）、实验组 B（优化条件，n=62,140）以及实验组 C（强化协同体系，n=62,140）。',
    ],
    keyMetrics: [
      { label: '总样本量', value: '186,420', note: 'N = 1.86 × 10⁵' },
      { label: '特征维度', value: '42 维', note: '含连续型与离散型' },
      { label: '实验组数', value: '3 组', note: '平衡双盲设计' },
    ],
  },
  {
    id: 'sec-2',
    number: '二',
    title: '数据质量',
    summary: '全流程缺失值诊断、清洗修复与信噪比评估',
    content: [
      '数据完整性检测：全表检测到 1.2% 的离散缺失项（主要分布于微量副反应特征字段），未发现整行丢失情况。',
      '清洗策略：采用 MICE 链式多重插补算法对缺失值完成填补，保留了特征协方差结构与方差稳定性。',
      '信噪比与分布检验：经偏度与峰度评估，主要性能评价指标在清洗后符合准正态分布（Shapiro-Wilk 检验，p > 0.05）。有效清洗数据达 98.8%。',
    ],
    keyMetrics: [
      { label: '初始缺失率', value: '1.2%', note: '已无偏插补' },
      { label: '清洗有效率', value: '98.8%', note: '信噪比 SNR = 34.2 dB' },
      { label: '质量评级', value: 'Grade A (优秀)', note: '符合顶刊发表标准' },
    ],
  },
  {
    id: 'sec-3',
    number: '三',
    title: '实验组比较',
    summary: '各组核心性能指标对比分析与效应量量化',
    content: [
      '实验组 A（基线方案）的平均性能得分为 78.4（SD = 4.8，95% CI: [77.2, 79.6]）。',
      '实验组 B（优化方案）的平均性能得分提升至 84.7（SD = 3.9，95% CI: [83.8, 85.6]），相较 A 组提升 8.04%。',
      '实验组 C（强化协同体系）达到全组最高性能 91.2（SD = 3.1，95% CI: [90.5, 91.9]），相较基准 A 组显著提升 16.33%，离散系数最低（CV = 3.4%），表现出卓越的稳定性。',
    ],
    keyMetrics: [
      { label: 'Group A 均值', value: '78.4 ± 4.8', note: '基线' },
      { label: 'Group B 均值', value: '84.7 ± 3.9', note: '+8.0% 提升' },
      { label: 'Group C 均值', value: '91.2 ± 3.1', note: '+16.3% 最佳提升' },
    ],
  },
  {
    id: 'sec-4',
    number: '四',
    title: '异常样本',
    summary: '孤立森林与 3-Sigma 离群点多维定位与归因',
    content: [
      '经全局 Isolation Forest 算法扫描与 3-Sigma 边界阈值判定，在 18.6 万条样本中准确定位 23 个统计异常点。',
      'AI 重点标记 3 个高价值异常样本：Sample #12842（温度飙升至 137℃，判定为热电偶瞬间漂移）；Sample #45109（产率跌落至 31.2%，属加料阀门卡顿）；Sample #98231（瞬态背压 7.84 MPa）。',
      '敏感性分析表明：在剔除 23 个异常样本后，组间核心结论与方差分析结果依然保持完全稳健（F 统计量波动 < 0.3%）。',
    ],
    keyMetrics: [
      { label: '检出异常总数', value: '23 个', note: '占比 0.012%' },
      { label: '重点关注样本', value: '3 个', note: '#12842, #45109, #98231' },
      { label: '稳健性复核', value: '100% 通过', note: '无偏态干扰' },
    ],
  },
  {
    id: 'sec-5',
    number: '五',
    title: '统计结果',
    summary: '方差分析 (ANOVA) 与事后检验极显著性检验报告',
    content: [
      '单因素方差分析结果：F(2, 186417) = 428.6，p = 1.84 × 10⁻¹⁸² (p < 0.001)，表明三组间存在极其显著的统计学差异。',
      "Tukey HSD 事后两两比对：Group B vs Group A (diff = 6.3, p < 0.001, Cohen's d = 1.44)；Group C vs Group B (diff = 6.5, p < 0.001, Cohen's d = 1.84)；Group C vs Group A (diff = 12.8, p < 0.001, Cohen's d = 3.18)。",
      '所有双侧统计检验在 Bonferroni 严格校正后依然均满足 p < 0.001 水平。',
    ],
    keyMetrics: [
      { label: 'ANOVA 检验', value: 'F = 428.6', note: 'p < 0.001 ***' },
      { label: "效应量 (Cohen's d)", value: '3.18 (极大幅度)', note: 'Group C vs A' },
      { label: '统计功效 (Power)', value: '> 0.999', note: '1-β 极高' },
    ],
  },
  {
    id: 'sec-6',
    number: '六',
    title: '科研结论',
    summary: '学术机理推演与同行评议 Results 撰写建议',
    content: [
      '强化协同体系（实验组 C）通过降低活化能垒并抑制热应力波动，实现了显著优于基线方案的性能增益（+16.3%）。',
      '实验组 B 到 C 的性能跃升验证了第二代催化配比在抑制副产物生成上的决定性作用，且离散方差显著收窄，工艺容错区间更宽。',
      '该实验数据与分析流程已达到 SCI Q1 期刊对数据清洗、统计严密性及可视化复现性的最高标准，建议直接采纳生成的 Results 模块进入论文正式撰写阶段。',
    ],
    keyMetrics: [
      { label: '推荐方案', value: '实验组 C 体系', note: '全面领先' },
      { label: '核心突破', value: '16.3% 增益 + 方差减小 35%', note: '高稳态' },
      { label: '论文就绪度', value: 'Ready to Publish', note: '直接引用' },
    ],
  },
]

// ---------------------------------------------------------------- 论文草稿文本

export const PAPER_DRAFT_TEXT: Record<'zh' | 'en', string> = {
  zh: `# 3. Results (实验结果)

## 3.1 实验组性能对比与主效应显著性
本次研究基于大规模高通量实验数据集（N = 186,420，涵盖 42 个物理、化学与动力学特征维度），在完成数据缺失值无偏链式插补（MICE 算法）与全域噪声清洗后，对三个平行对照实验组展开了系统的统计推断与性能评估（Figure 1A）。

单因素方差分析（One-way ANOVA）结果表明，各实验组间存在极显著的统计学主效应差异（F(2, 186417) = 428.6, p < 0.001）。事后 Tukey's HSD 多重比对分析进一步证实，实验组 C 展现出最优的性能水平（均值：91.2 ± 3.1，95% CI: [90.5, 91.9]），相较基准实验组 A（均值：78.4 ± 4.8，95% CI: [77.2, 79.6]）实现了净增 +16.33% 的性能跃升（效应量 Cohen's d = 3.18）。此外，实验组 B（84.7 ± 3.9）相较组 A 提升 8.04%（p < 0.001），而组 C 相较组 B 仍有极其显著的梯次增强（p < 0.0001，Cohen's d = 1.84）。

## 3.2 概率密度分布与反应动力学历程
高斯核密度分布估计（Figure 1B）表明，实验组 C 的概率密度峰型显著右移，且方差离散度相较组 A 缩窄约 35.4%（离散系数 CV = 3.4%），证实协同催化体系在大幅提升响应强度的同时抑制了工况波动。12 小时反应动力学时序曲线（Figure 1C）显示，实验组 C 在前 4 小时内即展现出陡峭的活化速率，随后平稳收敛至高转化率稳态。

## 3.3 孤立森林异常检测与敏感性复核
通过全局 Isolation Forest 孤立森林与 3-Sigma 边界联合扫描，在全量样本中共定位 23 个异常样本点（Figure 1D），重点包括 Sample #12842（瞬态超温 137℃）、Sample #45109（产率骤降至 31.2%）以及 Sample #98231（瞬态背压 7.84 MPa）。在剔除该部分离群样本后的敏感性重估检验中，组间核心差异与 F 统计量波动小于 0.3%，证明了本研究结论的极高稳健性与学术复现力。`,

  en: `# 3. Results

## 3.1 Experimental Group Performance and Main Effect Significance
Based on the large-scale high-throughput experimental dataset ($N = 186,420$, spanning 42 physicochemical and kinetic feature dimensions), comprehensive statistical inference was conducted across three parallel experimental cohorts following MICE imputation and noise screening (Figure 1A).

One-way analysis of variance (ANOVA) revealed highly significant between-group variations ($F(2, 186417) = 428.6, p < 0.001$). Post-hoc Tukey HSD tests demonstrated that **Group C** delivered peak performance ($91.2 \\pm 3.1$, 95% CI: $[90.5, 91.9]$), exhibiting a $+16.33\\%$ relative gain over baseline **Group A** ($78.4 \\pm 4.8$, 95% CI: $[77.2, 79.6]$, Cohen's $d = 3.18$). Group B ($84.7 \\pm 3.9$) also showed significant enhancement ($+8.04\\%$, $p < 0.001$), while Group C maintained substantial superiority over Group B ($p < 0.0001$).

## 3.2 Distributional Kernel Density and Reaction Kinetics
Gaussian kernel density estimation (Figure 1B) confirmed a pronounced rightward peak shift and a $35.4\\%$ narrowing in variance for Group C ($\\mathrm{CV} = 3.4\\%$). 12-hour kinetic profiles (Figure 1C) verified that Group C achieved accelerated early activation before reaching a robust steady state.

## 3.3 Isolation Forest Anomaly Screening and Robustness
Multi-dimensional Isolation Forest identified 23 outliers (e.g. Sample #12842, #45109, #98231; Figure 1D). Sensitivity analysis confirmed that effect sizes varied by $< 0.3\\%$ upon outlier omission, validating high empirical reproducibility.`,
}

/** 论文写作弹窗中使用的 Results LaTeX 源码 */
export const PAPER_LATEX_TEXT = `% ===================================================
% SECTION: 3. RESULTS & STATISTICAL ANALYSIS
% Generated by AI Scientific Agent
% Dataset: experiment_result.xlsx (N = 186,420, 42 features)
% ===================================================

\\section{Results}
\\label{sec:results}

\\subsection{Experimental Group Comparison and Main Effects}
Based on the high-throughput experimental dataset ($N = 186{,}420$), we observed a statistically significant performance variation across the three independent experimental conditions ($F(2, 186417) = 428.6, p < 0.001$, one-way ANOVA). Post-hoc Tukey's honestly significant difference (HSD) tests revealed that \\textbf{Group C} achieved the highest mean score ($91.2 \\pm 3.1$, 95\\% CI: $[90.5, 91.9]$), representing a $+16.33\\%$ relative gain compared to baseline \\textbf{Group A} ($78.4 \\pm 4.8$, 95\\% CI: $[77.2, 79.6]$, Cohen's $d = 3.18$). Group B also showed significant enhancement ($84.7 \\pm 3.9$, $+8.04\\%$, $p < 0.001$).

\\subsection{Distributional Stability and Reaction Dynamics}
Gaussian kernel density estimation confirmed a marked rightward peak shift and a $35.4\\%$ reduction in dispersion for Group C (coefficient of variation $\\mathrm{CV} = 3.4\\%$, Figure~1B). Time-course kinetic analysis over 12 hours demonstrated that Group C accelerated initial reaction velocity ($k_{\\mathrm{rate}} = 1.64\\times$) before converging to high steady-state yield.

\\subsection{Anomaly Diagnosis and Robustness Check}
Isolation Forest identified 23 multi-dimensional outliers (Sample \\#12842, \\#45109, \\#98231). Sensitivity re-estimation following outlier exclusion induced negligible perturbation ($< 0.3\\%$ in effect size), verifying the robustness of the primary findings.`
