import { ExperimentProject, PaperData, ReviewReport, AblationItem } from '../types';

export const PRESET_EXPERIMENT: ExperimentProject = {
  id: 'transformer-ev-charging-load',
  title: '基于 Transformer 的城市电动汽车快充负荷多步时空预测',
  domain: '智能电网与交通电气化 (Smart Grid & Transportation Electrification)',
  objective: '面向动态电价与气象波动影响下的城市电动汽车快充网络高精度多步时空负荷预测',
  datasetName: 'UrbanEV-ChargeBench (Caltrans PeMS 交通流 + 1,240 个直流快充桩)',
  datasetSize: '1,240 个充电站点 · 连续 18 个月数据 (15 分钟采样间隔，共 525,600 个时间步)',
  parameters: [
    { key: '网络模型架构', value: '时空多头注意力 Transformer (ST-Trans)' },
    { key: '多头注意力配置', value: '8 个注意力头, d_model = 256, 4 层 Encoder' },
    { key: '历史回溯窗口', value: '96 步 (过去 24 小时连续观测)' },
    { key: '未来预测步长', value: '48 步 (未来 12 小时多步滚动预测)' },
    { key: '外生特征输入', value: '分时电价 (TOU)、环境温度、降雨量、区域交通拥堵指数' },
    { key: '优化器与学习率', value: 'AdamW, 初始学习率 1e-4, 余弦退火预热 (Warmup 10 epochs)' },
    { key: '批大小与训练轮次', value: 'Batch Size = 64 · 120 轮 (配合早停机制 Early Stopping)' },
    { key: '损失函数', value: '多步 Huber 损失函数 (δ = 1.0)' },
  ],
  metrics: [
    {
      name: 'MAE (平均绝对误差)',
      value: '14.28',
      unit: 'kW',
      improvement: '比 LSTM 降低 21.4%',
      description: '全网各充电站预测充电负荷与实际真实值之间的平均绝对偏差。',
    },
    {
      name: 'RMSE (均方根误差)',
      value: '22.65',
      unit: 'kW',
      improvement: '比 STGCN 降低 26.8%',
      description: '对电网高峰时段的极端脉冲负荷误差施加更强惩罚，反映负荷峰值拟合鲁棒性。',
    },
    {
      name: 'MAPE (平均绝对百分比误差)',
      value: '5.82%',
      unit: '%',
      improvement: '达到 SOTA 水平',
      description: '在夜间低负荷时段与晚高峰快充峰值时段均保持高精度相对误差。',
    },
    {
      name: '推理延迟 (Inference Latency)',
      value: '8.4',
      unit: 'ms / 批次',
      improvement: '具备实时毫秒级调度能力',
      description: '单张 NVIDIA A100 GPU 上对全城 1,240 个充电站并发推理的单批次延迟。',
    },
  ],
  baselines: [
    {
      model: 'ARIMA (经典自回归积分滑动平均模型)',
      mae: 32.40,
      rmse: 48.15,
      mape: 14.85,
      inferenceTimeMs: 1.2,
      isOurs: false,
      pValVsOurs: 'p < 0.001',
    },
    {
      model: '随机森林回归 (Random Forest Regressor)',
      mae: 26.15,
      rmse: 38.90,
      mape: 11.20,
      inferenceTimeMs: 3.5,
      isOurs: false,
      pValVsOurs: 'p < 0.001',
    },
    {
      model: 'XGBoost (梯度提升决策树)',
      mae: 22.80,
      rmse: 34.60,
      mape: 9.75,
      inferenceTimeMs: 4.8,
      isOurs: false,
      pValVsOurs: 'p < 0.001',
    },
    {
      model: 'LSTM (长短期记忆递归神经网络)',
      mae: 18.16,
      rmse: 28.40,
      mape: 7.94,
      inferenceTimeMs: 6.2,
      isOurs: false,
      pValVsOurs: 'p < 0.001',
    },
    {
      model: 'STGCN (时空图卷积网络)',
      mae: 16.92,
      rmse: 25.80,
      mape: 7.15,
      inferenceTimeMs: 9.1,
      isOurs: false,
      pValVsOurs: 'p < 0.005',
    },
    {
      model: 'ST-Transformer (本文提出方法 - Ours)',
      mae: 14.28,
      rmse: 22.65,
      mape: 5.82,
      inferenceTimeMs: 8.4,
      isOurs: true,
      pValVsOurs: '-',
    },
  ],
  figures: [
    {
      id: 'fig-1',
      number: 1,
      title: '图 1: 24 小时多步电动汽车充电负荷预测曲线与真实值对比',
      caption: '图 1. 本文提出的 ST-Transformer、基准模型 LSTM 与全城充电站实际观测真实负荷（含 95% 置信区间）的 24 小时预测拟合对比。',
      type: 'line_chart',
      dataDescription: '展示 24 小时负荷动态轨迹，尤其在 18:00–21:00 晚高峰及电价波峰时段，ST-Transformer 展现出优异的拟合精度与极低相位滞后。',
    },
    {
      id: 'fig-2',
      number: 2,
      title: '图 2: 城市核心充电走廊跨区域空间交叉注意力相关性热力图',
      caption: '图 2. 8 个核心充电枢纽区域之间的空间注意力权重热力图，清晰揭示了动态电价波峰时段车辆从市中心向周边副中心跨区充电迁移的行为模式。',
      type: 'heatmap',
      dataDescription: '跨站点交叉注意力权重矩阵，展现市中心快充站与郊区枢纽站之间因分时电价差异驱动的动态负荷转移关联。',
    },
  ],
  tables: [
    {
      id: 'table-1',
      number: 1,
      title: '表 1: 数据集统计特征与网络超参数配置',
      caption: '表 1. UrbanEV-ChargeBench 数据集基本统计概况与 ST-Transformer 核心超参数配置。',
      headers: ['参数 / 属性指标', '配置规格 / 参数值', '说明与物理量纲'],
      rows: [
        ['监测快充桩数量', '1,240 个充电桩', '城市级直流快充网络 (单桩功率 50kW - 350kW)'],
        ['时间采样分辨率', '15 分钟', '连续 18 个月观测数据 (共计 525,600 个时间步)'],
        ['回溯与预测长度', '96 步 (24h) / 48 步 (12h)', '滑动窗口多步滚动预测机制'],
        ['Transformer 特征维度 (d_model)', '256 通道', '隐层空间特征向量映射维度'],
        ['注意力头数与网络深度', '8 个头 / 4 层', '空间跨站交叉注意力 + 时间膨胀因果自注意力'],
        ['损失函数配置', 'Huber 损失 (δ = 1.0)', '增强对电网偶发极端负荷冲击与离群值的鲁棒性'],
      ],
    },
    {
      id: 'table-2',
      number: 2,
      title: '表 2: 各模型在电动汽车充电负荷预测任务上的定量评测结果',
      caption: '表 2. 本文模型与统计模型、树模型、循环神经网络及图神经网络基准在 MAE、RMSE、MAPE 和推理延迟上的全面量化对比。',
      headers: ['对比模型', 'MAE (kW) ↓', 'RMSE (kW) ↓', 'MAPE (%) ↓', '推理延迟 (ms)'],
      rows: [
        ['ARIMA [12]', '32.40', '48.15', '14.85%', '1.2 ms'],
        ['随机森林 (Random Forest) [15]', '26.15', '38.90', '11.20%', '3.5 ms'],
        ['XGBoost [18]', '22.80', '34.60', '9.75%', '4.8 ms'],
        ['LSTM [21]', '18.16', '28.40', '7.94%', '6.2 ms'],
        ['STGCN [25]', '16.92', '25.80', '7.15%', '9.1 ms'],
        ['ST-Transformer (本文提出)', '14.28', '22.65', '5.82%', '8.4 ms'],
      ],
    },
  ],
  keyFindings: [
    '本文提出的 ST-Transformer 取得了 14.28 kW 的 MAE 和 5.82% 的 MAPE，相比深度循环网络基准 LSTM 误差降低 21.4%，相比时空图卷积网络 STGCN 误差降低 15.6%。',
    '动态空间交叉注意力机制成功捕获了晚高峰电价波峰时段（17:00–20:00）车主因价格敏感性向周边次级站点分流的负荷迁移规律。',
    '融合气象多模态外生特征（环境温度、强降水等）显著消除了极端天气下车内空调剧增所诱发的突发性预测误差漂移。',
    '多步 Huber 损失函数在节假日非平稳突发集中充电场景下，使极端偏差预测误差降低了 31.2%。',
  ],
};

export const INITIAL_PAPER_DATA: PaperData = {
  title: '面向动态电价机制的城市电动汽车快充负荷时空 Transformer 预测方法研究',
  authors: [
    { name: 'Katherine Vance 博士', institution: '智能电网与智能交通研究所，工科大学', email: 'k.vance@tech.edu' },
    { name: '陈默 (Marcus Chen) 教授', institution: '国家能源实验室电气工程部', email: 'mchen@energy-lab.gov' },
    { name: 'Elena Rostova 博士', institution: '人工智能与复杂城市系统研究中心', email: 'elena.r@ai-urban.org' },
  ],
  abstract: '高精度的电动汽车（EV）快充负荷预测对于城市配电网安全稳定运行、动态经济调度以及可再生能源高效消纳具有关键意义。然而，城市电动汽车充电需求在空间维度上呈现多站点间的动态耦合，在时间维度上受到分时电价（TOU）调控和天气多模态扰动的强烈影响，具有显著的非平稳性和突发峰值特性。现有的循环神经网络和基于静态预定义邻接矩阵的时空图神经网络难以有效捕捉因实时电价变化导致的车流跨区域长程动态重构。为此，本文提出了一种新型时空 Transformer 深度学习预测框架（ST-Trans）。该框架通过引入空间跨站点动态交叉注意力与时间膨胀因果自注意力机制，实现了多源外生时空特征的自适应端到端建模。在涵盖 1,240 个直流快充桩、连续 18 个月的真实超大规模数据集 UrbanEV-ChargeBench 上的综合实验表明，ST-Trans 取得了优异的预测性能（MAE = 14.28 kW, MAPE = 5.82%），性能显著超越现有 SOTA 基准模型 15.6% 以上，同时单批次推理延迟控制在 8.4 ms 以内，完全满足智能电网实时调度与快速响应要求。',
  keywords: ['电动汽车充电负荷预测', 'Transformer 神经网络', '时空序列建模', '动态分时电价', '智能电网协同调度'],
  lastUpdated: '2026-08-26',
  version: 'v1.0.0 (审稿初稿 / Pre-Review Draft)',
  sections: [
    {
      id: 'sec-1',
      number: '1',
      title: '引言 (Introduction)',
      content: `电动汽车（EV）的快速规模化普及是实现交通能源脱碳的重要基石。然而，大功率直流快速充电（DCFC）设施的集中接入给城市配电网带来了前所未有的负荷冲击。高度并发的无序快充行为极易引发局部电网潮流过载、电压越限以及配电变压器过热等严峻运行隐患 [1, 2]。因此，开展高精度、多时间尺度的电动汽车快充负荷超前预测，是开展配电网柔性负荷控制、日前与日内动态调度以及需求响应策略制定的核心前提 [3]。

传统的负荷预测方法主要依赖于经典时间序列模型（如 ARIMA）[12] 或浅层机器学习模型（如随机森林、XGBoost）[18]。这类方法难以挖掘高维非线性的时空关联和用户复杂的动态行为转移。近年来，循环神经网络（LSTM）[21] 以及时空图卷积网络（STGCN）[25] 被广泛引入时空预测中。然而，标准 STGCN 依赖固定的空间地理拓扑或路网距离作为静态邻接矩阵，无法刻画因分时电价波峰、排队拥堵等诱发的车主跨区域转移动态迁移行为。

为了突破上述局限，本文提出了基于时空 Transformer 的负荷预测框架（ST-Trans）。本文的核心贡献包括：
• 提出了空间跨站点动态交叉注意力机制，无需预定义静态拓扑图即可自主学习随时间变化的站点间负荷转移模式；
• 构建了融合分时电价、环境温湿度、强降雨以及交通指数等多模态外生特征的时间膨胀因果注意力网络，避免未来信息泄露；
• 在包含 1,240 个快充桩、长达 18 个月的真实超大数据集上开展了充分的定量评测，验证了所提方法在不同预测步长与工况下的卓越性能。`,
    },
    {
      id: 'sec-2',
      number: '2',
      title: '相关工作 (Related Work)',
      content: `### 2.1 负荷预测中的统计学与深度学习方法
早期的电网负荷预测主要基于 Box-Jenkins ARIMA 架构和指数平滑技术 [12]。此类方法在区域级宏观平滑负荷预测中表现良好，但在局部充电桩高度随机离散的用户行为场景下预测性能显著衰减。

随着深度学习的发展，LSTM 和 GRU 等门控循环网络被广泛用于挖掘时间序列的长程依赖关系 [21]。然而，递归结构难以有效捕捉超长时序（如过去 24 小时至未来 12 小时）的时序模式，且由于时序依赖性无法实现高效的并行化训练。

### 2.2 城市计算中的时空图神经网络与注意力机制
为了融合空间网络拓扑，STGCN [25]、DCRNN 等结合了图卷积与时序卷积。然而其最大的局限在于图拓扑的静态先验假设。实际上，电动汽车快充负荷存在明显的时空远程瞬态转移效应：当市中心充电站在高峰期实施阶梯高电价时，部分车主会主动分流至数公里外的次级快速充电走廊。本文提出的注意力机制通过自适应权重计算克服了静态图的瓶颈。`,
    },
    {
      id: 'sec-3',
      number: '3',
      title: '方法设计 (Methodology)',
      content: `### 3.1 问题形式化定义
设城市快充网络中共监测 $N = 1,240$ 个充电桩节点。在离散时间步 $t$，全网负荷状态矩阵记为 $\\mathbf{X}_t \\in \\mathbb{R}^{N \\times F}$，其中 $F$ 包含历史充电负荷、当前分时电价、环境温度、降雨量及路段拥堵指数等多维外生特征。给定过去 $P = 96$ 个时间步（24 小时历史回溯）的观测序列，模型的目标是多步预测未来 $H = 48$ 个时间步（未来 12 小时）的负荷序列 $\\hat{\\mathbf{Y}} = \\{ \\mathbf{X}_{t+1}, \\dots, \\mathbf{X}_{t+H} \\} \\in \\mathbb{R}^{H \\times N}$。

### 3.2 时空 Transformer 总体架构
整体架构主要由以下三个核心模块构成：
1. **多模态特征联合嵌入层**：将连续型负荷与气象数据以及离散时间编码映射至高维潜在空间 $\\mathbf{Z} \\in \\mathbb{R}^{P \\times N \\times d_{model}}$，并叠加可学习正弦位置编码。
2. **空间动态交叉注意力模块**：在每一时序截面 $t$ 上自适应计算跨站点间的 Query, Key, Value 特征映射：
$$\\mathbf{Q}_s = \\mathbf{Z}_t \\mathbf{W}_Q, \\quad \\mathbf{K}_s = \\mathbf{Z}_t \\mathbf{W}_K, \\quad \\mathbf{V}_s = \\mathbf{Z}_t \\mathbf{W}_V$$
$$\\text{SpatialAttn}(\\mathbf{Q}_s, \\mathbf{K}_s, \\mathbf{V}_s) = \\text{softmax}\\left( \\frac{\\mathbf{Q}_s \\mathbf{K}_s^T}{\\sqrt{d_k}} \\right) \\mathbf{V}_s$$
3. **时间膨胀因果自注意力模块**：采用多头膨胀因果掩码注意力，既严格杜绝未来标签穿越，又能高效覆盖 15 分钟短期波动与 24 小时日周期规律。
4. **多步 Huber 损失优化**：采用抗离群扰动的 Huber 损失函数（设定阈值 $\\delta = 1.0$）：
$$\\mathcal{L}_\\delta(y, \\hat{y}) = \\begin{cases} \\frac{1}{2}(y - \\hat{y})^2 & \\text{若 } |y - \\hat{y}| \\le \\delta, \\\\ \\delta |y - \\hat{y}| - \\frac{1}{2}\\delta^2 & \\text{其他。} \\end{cases}$$`,
    },
    {
      id: 'sec-4',
      number: '4',
      title: '实验验证与分析 (Experiments)',
      content: `本节在真实的 UrbanEV-ChargeBench 超大规模基准数据集上对所提模型的精度、鲁棒性及计算效率展开系统评估。`,
      subsections: [
        {
          id: 'sec-4-1',
          number: '4.1',
          title: '数据集与实验环境设置 (Dataset & Setup)',
          content: `数据集涵盖大都会核心区域 1,240 个直流快充节点、跨度连续 18 个月的历史数据（525,600 个时间步）。按时间顺序划分为 70% 训练集、15% 验证集与 15% 独立测试集。模型超参数与数据集统计指标汇总于表 1。`,
          hasTable: 'table-1',
        },
        {
          id: 'sec-4-2',
          number: '4.2',
          title: '对比基准模型 (Baselines)',
          content: `选取了涵盖经典统计、树模型、循环神经网络与图神经网络在内的五类代表性基准算法进行对比：
1. **ARIMA** [12]：经典自回归积分滑动平均模型；
2. **随机森林 (Random Forest)** [15]：集成决策树回归模型；
3. **XGBoost** [18]：梯度提升决策树模型；
4. **LSTM** [21]：3 层深层长短期记忆循环神经网络（隐层维度 256）；
5. **STGCN** [25]：基于道路距离先验图拓扑的时空图卷积神经网络。`,
        },
        {
          id: 'sec-4-3',
          number: '4.3',
          title: '实验结果与对比分析 (Results & Comparative Analysis)',
          content: `实验定量评估结果表明，本文提出的时空 Transformer 在全部核心评测指标上均取得了最优表现。如表 2 所示，本文模型取得了 14.28 kW 的 MAE、22.65 kW 的 RMSE 以及 5.82% 的 MAPE。相较于最强循环网络基准（LSTM），本文模型 MAE 降低了 21.4%（从 18.16 kW 降至 14.28 kW），RMSE 降低了 20.2%；相较于时空图卷积网络（STGCN），MAE 进一步降低了 15.6%。

图 1 展示了代表性典型工作日 24 小时连续多步负荷预测曲线与真实值的对比。可以看到，LSTM 在早高峰（07:30–09:00）负荷快速爬升阶段存在明显的相位滞后，并在晚高峰（18:00–21:00）出现显著的欠估计；而本文提出的 ST-Transformer 能够高度紧密拟合负荷曲线的每一个波峰与波谷。

此外，图 2 可视化了学习到的站点间空间交叉注意力矩阵。在电价高峰切换时段，模型自动在市中心商业区站点与外围换乘站点之间分配了高注意力权重，证实了模型具备自适应捕捉负荷空间迁移规律的能力。`,
          hasFigure: 'fig-1',
          hasTable: 'table-2',
        },
      ],
    },
    {
      id: 'sec-5',
      number: '5',
      title: '讨论与电网应用 (Discussion)',
      content: `实验成果对现代智能配电网的安全运行具有重要的实际指导意义：
1. **动态空间解耦能力**：有别于传统固定拓扑的图卷积，注意力机制能够根据外部电价信号自适应重构关联拓扑。当市中心实施高峰高电价时，注意力自适应聚焦至周边副中心充电枢纽，图 2 证实了这一空间流动规律。
2. **毫秒级实时计算可行性**：单批次推理仅需 8.4 ms，完全满足配电自动化系统秒级与亚秒级动态调度控制的时延要求。
3. **电网调峰与备用容量优化**：峰值预测误差大幅降低 26.8%，可有效避免因负荷突增导致的馈线过载与备用机组冗余空转，提升电网经济运行效率。`,
    },
    {
      id: 'sec-6',
      number: '6',
      title: '结论 (Conclusion)',
      content: `本文提出了面向城市电动汽车快充负荷预测的时空 Transformer 深度学习模型（ST-Trans）。通过将空间跨站点注意力与时间膨胀因果自注意力有机融合，有效解决了动态分时电价与多模态气象扰动下的负荷精确多步预测难题。在 1,240 个充电桩组成的真实超大规模数据集上的评测表明，该模型以 MAE 14.28 kW、MAPE 5.82% 的优异表现全面超越现有基准。未来工作将进一步探索车联网实时行驶轨迹数据与跨运营商隐私保护下的联邦学习架构。`,
    },
  ],
  references: [
    { id: 1, text: 'Z. Wang, H. Sun, and Y. Liu, "Impact of extreme fast charging stations on urban power distribution networks," IEEE Transactions on Smart Grid, vol. 12, no. 4, pp. 3120-3131, 2021.' },
    { id: 2, text: 'S. Deb, K. Tammi, K. Kalita, and P. Mahanta, "Impact of electric vehicle charging station load on distribution network," Energies, vol. 11, no. 1, p. 178, 2018.' },
    { id: 3, text: 'X. Lu, K. L. Zhou, and S. L. Yang, "A review of electric vehicle load forecasting methods," Renewable and Sustainable Energy Reviews, vol. 97, pp. 458-473, 2018.' },
    { id: 12, text: 'G. E. Box, G. M. Jenkins, and G. C. Reinsel, Time Series Analysis: Forecasting and Control, 5th ed. John Wiley & Sons, 2015.' },
    { id: 15, text: 'L. Breiman, "Random forests," Machine Learning, vol. 45, no. 1, pp. 5-32, 2001.' },
    { id: 18, text: 'T. Chen and C. Guestrin, "XGBoost: A scalable tree boosting system," in Proc. ACM SIGKDD, 2016, pp. 785-794.' },
    { id: 21, text: 'S. Hochreiter and J. Schmidhuber, "Long short-term memory," Neural Computation, vol. 9, no. 8, pp. 1735-1780, 1997.' },
    { id: 25, text: 'B. Yu, H. Yin, and Z. Zhu, "Spatio-temporal graph convolutional networks: A deep learning framework for traffic forecasting," in Proc. IJCAI, 2018, pp. 3634-3640.' },
  ],
};

export const ABLATION_EXPERIMENT_DATA: AblationItem[] = [
  {
    variant: '1. ST-Trans 完整模型 (本文提出)',
    description: '包含空间跨站点注意力 + 分时动态电价 + 气象多模态特征 + 时间膨胀因果注意力',
    mae: 14.28,
    rmse: 22.65,
    mape: 5.82,
    deltaMape: '最佳基准 (Baseline)',
  },
  {
    variant: '2. 移除气象特征 (w/o Weather)',
    description: '移除环境温度、相对湿度与降雨量等外部气象多模态输入',
    mae: 16.12,
    rmse: 25.40,
    mape: 6.78,
    deltaMape: '+0.96% (误差上升 16.5%)',
  },
  {
    variant: '3. 移除动态电价特征 (w/o Dynamic Pricing)',
    description: '移除分时电价 (TOU) 阶梯费率与动态拥堵波峰费率特征',
    mae: 17.45,
    rmse: 27.18,
    mape: 7.42,
    deltaMape: '+1.60% (误差上升 27.5%)',
  },
  {
    variant: '4. 移除空间动态交叉注意力 (w/o Spatial Attention)',
    description: '将动态空间跨站自注意力退化为固定路网物理距离的静态欧氏图卷积',
    mae: 18.05,
    rmse: 28.32,
    mape: 7.89,
    deltaMape: '+2.07% (误差上升 35.6%)',
  },
];

export const INITIAL_REVIEW_REPORT: ReviewReport = {
  overallScore: 5.2,
  decision: 'Major Revision (建议大修)',
  confidence: '4.5 / 5.0 (电力系统与时空机器学习领域资深审稿人)',
  summary: '本论文针对动态分时电价下城市电动汽车快充负荷多步时空预测这一兼具学术价值与工程意义的问题展开研究。所提出的 Transformer 架构构想清晰，初步定量结果令人满意。然而，当前版本在实验严密性与学术规范上存在若干重大缺陷：论文缺乏必不可少的消融实验（Ablation Study）来系统论证各多模态特征与核心机制的独立贡献度，缺乏多随机种子的统计显著性检验，且在图表置信区间与量纲单位上存在细节不足，因此暂不能直接录用，建议大修。',
  strengths: [
    '立论动机充分，将交通电气化、电网峰值冲击与智能调度紧密结合，应用背景明确。',
    '数据集规模真实宏大，涵盖 1,240 个快充站点长达 18 个月的真实连续数据。',
    '空间动态交叉注意力的设计打破了传统时空图网络依赖静态拓扑的限制，具备创新性。',
    '对比基准涵盖经典统计、树模型、循环神经网络与图神经网络，基准选型合理。',
  ],
  checkpoints: [
    { name: '方法完整性 (Methodology Completeness)', status: 'pass', comment: '数学形式化表述与注意力计算公式定义严谨清晰。' },
    { name: '实验充分性 (Experimental Rigor)', status: 'warning', comment: '缺少消融实验 (Ablation Study) 拆解验证核心模块贡献。' },
    { name: '数据合理性 (Data Validity)', status: 'pass', comment: '数据切分比例 (70/15/15) 与 15 分钟采样粒度符合学术规范。' },
    { name: 'Baseline 完整性 (Baseline Coverage)', status: 'pass', comment: '涵盖了统计模型、树模型、RNN 与图卷积 SOTA 基准。' },
    { name: '统计显著性 (Statistical Significance)', status: 'warning', comment: '缺少 5-Seed 随机种子重复实验与 p-value 统计检验。' },
    { name: '图表规范 (Figure & Table Standards)', status: 'warning', comment: 'Figure 1 缺少 95% 置信区间阴影带；Table 2 缺少完整物理量纲标注。' },
    { name: '学术表达 (Academic Tone & Reference)', status: 'warning', comment: '参考文献部分引文缺少标准 DOI 编号与出版期刊卷期。' },
  ],
  majorIssues: [
    {
      id: 'issue-ablation',
      type: 'major',
      category: 'ablation',
      title: '缺少消融实验 (Missing Ablation Study)',
      critique: '作者声称动态电价、气象特征与空间动态交叉注意力共同带来了精度的提升，但第 4 节中没有任何消融实验（Ablation Study）数据支撑！审稿人无法判断性能增益究竟来自深层 Transformer 本身，还是来自特定领域外生特征。',
      aiSuggestion: `建议增加以下消融实验 (Ablation Experiments)：
1. 移除气象特征 (w/o Weather: 移除温度、降雨等气象输入)
2. 移除动态电价特征 (w/o Dynamic Pricing: 移除时变电价与阶梯费率)
3. 移除空间动态交叉注意力 (w/o Spatial Attention: 退化为静态欧氏图卷积)
用于定量验证不同特征与核心机制对模型整体性能（MAE / RMSE / MAPE）的具体贡献度。`,
      actionTitle: '一键生成 Ablation 消融实验',
      isResolved: false,
      resolutionEffectDescription: '自动计算 4 组消融实验数据，并在论文中新增「Section 4.4 消融实验」与「Table 3: 消融实验对比表」及深入分析段落。',
    },
    {
      id: 'issue-statistics',
      type: 'major',
      category: 'statistics',
      title: '缺少多随机种子统计显著性验证 (Lack of Statistical Significance)',
      critique: '表 2 中的评估指标仅为单次运行的点估计值，未给出 5 折交叉验证或多次随机种子的标准差（Mean ± Std），且缺少配对 t-检验 (Student t-test) 的 p-value 检验结果。',
      aiSuggestion: `建议进行 5 次随机种子重复实验（5 Random Seeds），在表 2 中补充均值与标准差 (Mean ± Std)，同时对各基准模型执行双侧配对 t-检验 (p < 0.001)，从统计学上证实本文改进的显著性。`,
      actionTitle: '补充统计显著性与误差检验 (Add Significance Tests)',
      isResolved: false,
      resolutionEffectDescription: '在表 2 中增加 5-Seed 均值标准差标注与 p-value 显著性检验结果，并在正文中补充统计学描述。',
    },
  ],
  minorIssues: [
    {
      id: 'issue-fig-error',
      type: 'minor',
      category: 'figures',
      title: 'Figure 1 / 2 缺少误差范围与置信区间 (Missing Confidence Intervals)',
      critique: 'Figure 1 的负荷拟合折线图仅绘制了单条确定性曲线，缺少展示站点间波动与峰值不确定性的 95% 置信区间阴影带。',
      aiSuggestion: '在 Figure 1 折线图中加入半透明 95% 置信区间阴影带 (Shaded Confidence Bands)，展现预测区间的鲁棒性与峰值波动范围。',
      actionTitle: '优化图表置信区间 (Add 95% CI)',
      isResolved: false,
      resolutionEffectDescription: 'Figure 1 升级为带 95% 置信区间着色带的科研级图表，并更新图题 Caption。',
    },
    {
      id: 'issue-table-units',
      type: 'minor',
      category: 'formatting',
      title: 'Table 2 缺少完整物理量纲单位标注 (Missing Table Units)',
      critique: '表 2 的列标题仅包含 MAE、RMSE 等缩写，缺少清晰明确的物理量纲单位标注（kW, %, ms/batch）。',
      aiSuggestion: '规范学术三线表 (Booktabs) 表头，将 MAE 明确标注为 (kW)，RMSE 标注为 (kW)，MAPE 标注为 (%)，推理延迟标注为 (ms/batch)。',
      actionTitle: '规范三线表头与物理量纲 (Fix Units)',
      isResolved: false,
      resolutionEffectDescription: '规范表 2 表头并更新三线表标准学术排版。',
    },
    {
      id: 'issue-references',
      type: 'minor',
      category: 'formatting',
      title: '参考文献格式与 DOI 规范需统一 (Standardize References & DOIs)',
      critique: '参考文献中条目 [12] 和 [18] 缺失数字化对象唯一标识符 (DOI) 和标准的会议全称著录。',
      aiSuggestion: '统一参考文献为标准 IEEE / ACM 格式，补齐所有引用条目的出版会议全称、页码与标准 DOI 编号。',
      actionTitle: '规范参考文献与 DOI (Format References)',
      isResolved: false,
      resolutionEffectDescription: '补齐 IEEE 标准参考文献著录格式及 DOI 超链接。',
    },
  ],
};

