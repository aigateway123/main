import { ResearchTopicData } from '../types';

export const DEFAULT_EV_RESEARCH_DATA: ResearchTopicData = {
  id: 'ev-charging-load',
  topic: '新能源汽车充电负荷预测',
  question: '请分析近5年新能源汽车充电负荷预测相关研究，重点关注Transformer、GNN、时序预测，并找出目前研究空白。',
  overview: {
    topic: '新能源汽车充电负荷预测',
    totalPapers: 1263,
    highRelevancePapers: 186,
    keyPapers: 42,
    mainDirectionsCount: 7,
    potentialOpportunitiesCount: 8,
    timeRange: '2020 - 2025 (近5年核心收录)',
    topJournals: [
      'IEEE Trans. on Power Systems',
      'Applied Energy',
      'IEEE Trans. on Smart Grid',
      'Energy',
      'IEEE Trans. on Intelligent Transportation Systems',
      'NeurIPS / ICML / KDD',
    ],
    yearDistribution: [
      { year: 2020, count: 142 },
      { year: 2021, count: 189 },
      { year: 2022, count: 236 },
      { year: 2023, count: 312 },
      { year: 2024, count: 384 },
    ],
  },
  hotspots: [
    {
      id: 'transformer',
      name: 'Transformer',
      stars: 5,
      ratingText: '★★★★★',
      heatScore: 98,
      citationCount: 4820,
      trend: 'hot',
      summary: '利用自注意力机制捕获超长周期时序依赖性，在多尺度充电负荷演变、突变高峰预测中展现出远超传统循环网络的泛化能力与并行计算效率。',
      commonMethods: [
        'Informer (ProbSparse 自注意力)',
        'Autoformer (自相关机制与时序分解)',
        'PatchTST (分块时序 Transformer)',
        'Crossformer (跨维度注意力建模)',
        'FEDformer (频域增强时序 Transformer)'
      ],
      representativeStudies: [
        {
          title: 'Informer: Beyond Efficient Transformer for Long Sequence Time-Series Forecasting',
          authors: 'Haoyi Zhou, Shanghang Zhang, Jieqi Peng, et al.',
          venue: 'AAAI Best Paper',
          year: 2021,
          citations: 3450,
          contribution: '提出 ProbSparse 注意力，显著降低显存开销，首次将 Transformer 大规模应用于长跨度能源负荷预测。'
        },
        {
          title: 'Spatiotemporal Multi-Scale Transformer for EV Charging Station Load Forecasting',
          authors: 'Z. Chen, L. Wang, Y. Liu, et al.',
          venue: 'IEEE Trans. Smart Grid',
          year: 2023,
          citations: 285,
          contribution: '结合充电站空间拓扑与多尺度时序注意机制，大幅提升了极端负荷峰值预测精度。'
        }
      ],
      currentTrends: [
        '轻量化时序分块（Patch-based）结构，减少计算冗余',
        '频域与时域混合注意力机制',
        '结合物理先验（电网容量、充电功率上限）的约束 Transformer'
      ],
      commonDatasets: [
        'Caltech ACN Data (Adaptive Charging Network)',
        'ElaadNL EV Charging Dataset',
        'Pecan Street Smart Grid Energy Dataset',
        'Boulder Colorado Public EV Charging Dataset'
      ]
    },
    {
      id: 'gnn',
      name: '图神经网络',
      stars: 4,
      ratingText: '★★★★☆',
      heatScore: 89,
      citationCount: 3150,
      trend: 'up',
      summary: '将城市充电站拓扑、路网交通流与配电网节点构造成图结构，利用图卷积（GCN）和图注意力（GAT）联合捕获多区域间的空间相关性与溢出效应。',
      commonMethods: [
        'ST-GCN (时空图卷积网络)',
        'DCRNN (扩散卷积循环神经网络)',
        'Graph WaveNet (自适应邻接矩阵时空图网络)',
        'ASTGCN (注意力时空图卷积网络)',
        'Dynamic Heterogeneous GNN (动态异构图网络)'
      ],
      representativeStudies: [
        {
          title: 'Spatial-Temporal Dynamic Graph Convolutional Networks for EV Charging Demand Prediction',
          authors: 'X. Zhang, Q. Huang, K. Sun, et al.',
          venue: 'Applied Energy',
          year: 2022,
          citations: 310,
          contribution: '通过可学习的动态邻接矩阵建模充电需求在不同城市商圈间的潮汐转移特征。'
        },
        {
          title: 'Heterogeneous Graph Neural Network for EV Fast Charging Station Load Scheduling',
          authors: 'H. Zhao, Y. Ding, J. Kang, et al.',
          venue: 'IEEE Trans. Power Systems',
          year: 2024,
          citations: 145,
          contribution: '构建包含车辆、充电桩、路网与配电变压器的异构图神经网络。'
        }
      ],
      currentTrends: [
        '动态时变图拓扑（应对路网拥堵和临时交通管制）',
        '路网-电网双层耦合异构图建模',
        '面向稀疏充电站点的小样本图生成模型'
      ],
      commonDatasets: [
        'Shenzhen EV GPS & Charging Session Dataset',
        'Beijing Urban Road Network & EV Flow Dataset',
        'METR-LA & PEMS-BAY (交通路网联动基准)'
      ]
    },
    {
      id: 'time-series',
      name: '时序预测',
      stars: 5,
      ratingText: '★★★★★',
      heatScore: 95,
      citationCount: 5600,
      trend: 'hot',
      summary: '探索日周期、周周期、季节性以及长程趋势的分解与重构，涵盖从经典统计学模型向深度状态空间模型、时序基础模型（Time Series Foundation Models）的飞跃。',
      commonMethods: [
        'STL 时序分解 + 深度学习集成',
        'N-BEATS / N-HiTS (深度神经基函数展开)',
        'Mamba / State Space Models (时序状态空间模型)',
        'Time-LLM & Chronos (时序大模型微调)',
        'DeepAR (概率时序预测)'
      ],
      representativeStudies: [
        {
          title: 'N-BEATS: Neural basis expansion analysis for interpretable time series forecasting',
          authors: 'B. N. Oreshkin, D. Carpov, N. Chapados, et al.',
          venue: 'ICLR',
          year: 2020,
          citations: 1850,
          contribution: '提出纯深度学习残差基函数展开架构，提供强解释性的趋势与季节性分解。'
        },
        {
          title: 'Probabilistic EV Fleet Charging Load Forecasting via Deep State Space Models',
          authors: 'M. Sun, T. Hong, et al.',
          venue: 'IEEE Trans. Smart Grid',
          year: 2023,
          citations: 220,
          contribution: '不仅预测负荷点估计，更给出极端分位数下的不确定性区间。'
        }
      ],
      currentTrends: [
        '从单点预测向概率分布与不确定性量化（UQ）演进',
        '零样本跨域时序大模型（Time-LLM）迁移应用',
        '针对节假日与大型赛事的突发突变异常点预测'
      ],
      commonDatasets: [
        'Electricity Load Diagrams (UCI Machine Learning)',
        'National Renewable Energy Laboratory (NREL) Fleet Data',
        'State Grid High-Resolution Smart Meter Records'
      ]
    },
    {
      id: 'multimodal',
      name: '多模态预测',
      stars: 3,
      ratingText: '★★★☆☆',
      heatScore: 76,
      citationCount: 1940,
      trend: 'up',
      summary: '融合气象卫星数据（温度/降水）、城市地理POI（商圈/居住区）、实时交通路况、用户行为画像及分时电价，打破单一历史负荷序列的信息孤岛。',
      commonMethods: [
        'Cross-Modal Fusion Transformer (跨模态融合注意力)',
        'CLIP-style Multimodal Contrastive Alignment',
        'Multimodal Graph Convolution (多模态图融合)',
        'Early & Late Feature Fusion Networks'
      ],
      representativeStudies: [
        {
          title: 'Multimodal Fusion of Traffic, Weather, and Spatial POI for EV Charging Demand',
          authors: 'W. Lin, C. Guan, Y. Ma, et al.',
          venue: 'Energy',
          year: 2023,
          citations: 195,
          contribution: '系统论证了降水突变与温度变化对电动汽车动力电池能耗与充电频次的非线性影响。'
        }
      ],
      currentTrends: [
        '视觉遥感/天气云图与时序数值的端到端联合编码',
        '基于地理大模型（Geo-LLM）的城市功能区语义嵌入',
        '多源异构数据缺失情况下的自适应模态补齐'
      ],
      commonDatasets: [
        'OpenWeatherMap Meteorological API History',
        'Baidu / Amap POI Distribution Dataset',
        'Urban Mobility & Trip Purpose Datasets'
      ]
    },
    {
      id: 'reinforcement-learning',
      name: '强化学习',
      stars: 3,
      ratingText: '★★★☆☆',
      heatScore: 72,
      citationCount: 1420,
      trend: 'stable',
      summary: '主要结合电网实时调度与动态定价策略，通过多智能体强化学习（MARL）模拟车主博弈行为，将预测模型与主动负荷调控紧密结合。',
      commonMethods: [
        'MADDPG (多智能体深度确定性策略梯度)',
        'PPO (近端策略优化)',
        'Soft Actor-Critic (SAC)',
        'Safe RL with Grid Operational Constraints'
      ],
      representativeStudies: [
        {
          title: 'Multi-Agent Deep Reinforcement Learning for Coordinated EV Fleet Charging and Grid Support',
          authors: 'J. Qiu, D. Xu, S. Dong, et al.',
          venue: 'IEEE Trans. Sustainable Energy',
          year: 2022,
          citations: 280,
          contribution: '构建车网互动（V2G）下的主动负荷重塑机制，实现负荷峰谷差平抑。'
        }
      ],
      currentTrends: [
        '从被动负荷预测转向“预测-决策-调控”闭环一体化',
        '基于大语言模型驱动的主体行为仿真（Agent-based Simulation）',
        '配电网电压安全约束下的安全强化学习'
      ],
      commonDatasets: [
        'CityFlow / SUMO Traffic & Charging Co-Simulation',
        'PJM Interconnection Real-time Electricity Market Data'
      ]
    }
  ],
  mapNodes: [
    {
      id: 'node-1',
      title: '传统机器学习',
      subtitle: 'ARIMA / SVR / Random Forest',
      stage: '第一阶段 (2015-2018)',
      era: '早期基线',
      color: '#64748b',
      description: '依赖人工特征工程与统计学自回归方法。对线性规律刻画良好，但无法处理高维非线性特征与大规模时空相关性。',
      keyAlgorithms: ['ARIMA/SARIMA', 'Support Vector Regression (SVR)', 'XGBoost / LightGBM', 'Random Forest'],
      strengths: ['模型轻量，训练计算开销极低', '具备良好的数学统计可解释性', '小样本数据下不易过拟合'],
      bottlenecks: ['对极端高峰和突发事件泛化能力弱', '无法端到端建模城市级大尺度站点网络'],
      classicPaper: {
        title: 'Forecasting of EV charging demand using statistical time series methods',
        venue: 'IEEE PES GM',
        year: 2017
      }
    },
    {
      id: 'node-2',
      title: 'LSTM / GRU',
      subtitle: '循环神经网络与序列建模',
      stage: '第二阶段 (2018-2020)',
      era: '深度学习兴起',
      color: '#3b82f6',
      description: '引入门控机制记忆长程历史状态，实现了端到端高维非线性时序建模，成为近5年最经典的基准模型（Baseline）。',
      keyAlgorithms: ['Standard LSTM', 'Bidirectional GRU', 'Seq2Seq with Attention', 'ConvLSTM'],
      strengths: ['捕捉连续充放电序列的时间连续性', '无需手工设计繁琐的时间滞后特征'],
      bottlenecks: ['循环递推导致无法高度并行化', '序列过长时（如>96步）梯度衰减与注意力弥散'],
      classicPaper: {
        title: 'Long short-term memory networks for electric vehicle charging load forecasting',
        venue: 'Applied Energy',
        year: 2019
      }
    },
    {
      id: 'node-3',
      title: 'Transformer',
      subtitle: '自注意力机制与长序列预测',
      stage: '第三阶段 (2021-2023)',
      era: '注意力架构主流',
      color: '#8b5cf6',
      description: '彻底摒弃循环结构，通过多头自注意力（Self-Attention）直接计算任意时间步间的依赖关系，极大增强了长程预测能力。',
      keyAlgorithms: ['Informer (ProbSparse)', 'PatchTST (Subseries Patching)', 'Autoformer (Auto-Correlation)', 'FEDformer'],
      strengths: ['完全并行化训练，效率极高', '在长预测窗口（168小时+）下精度显著占优'],
      bottlenecks: ['忽略了物理路网拓扑约束', '对输入数据噪声和局部剧烈扰动较为敏感'],
      classicPaper: {
        title: 'Informer: Beyond Efficient Transformer for Long Sequence Time-Series Forecasting',
        venue: 'AAAI (Best Paper)',
        year: 2021
      }
    },
    {
      id: 'node-4',
      title: 'GNN 图神经网络',
      subtitle: '空间拓扑与路网扩散建模',
      stage: '第四阶段 (2022-2024)',
      era: '空间图拓扑突破',
      color: '#06b6d4',
      description: '将充电站、车流路径及配电网节点抽象为图，利用图卷积/图注意力有效捕捉邻近站点需求溢出与路网连通效应。',
      keyAlgorithms: ['ST-GCN', 'Graph WaveNet', 'Dynamic GAT', 'Heterogeneous Graph Transformer'],
      strengths: ['显式建模空间邻接与非欧几里得拓扑相关性', '支持跨站点协同预测与需求流向追溯'],
      bottlenecks: ['对未知/新接入站点的归纳式（Inductive）迁移较难', '构图计算开销大'],
      classicPaper: {
        title: 'Spatial-Temporal Dynamic Graph Convolutional Networks for EV Charging Demand',
        venue: 'Applied Energy',
        year: 2022
      }
    },
    {
      id: 'node-5',
      title: '时空预测 (ST Fusion)',
      subtitle: '时空注意力与图卷积深度融合',
      stage: '第五阶段 (2023-2025)',
      era: '时空一体化前沿',
      color: '#10b981',
      description: '将 Transformer 的时间长程建模与 GNN 的空间拓扑传播进行深度交织（如 Spatio-Temporal Patch Transformer），成为当下的 SOTA 范式。',
      keyAlgorithms: ['STID (Spatial-Temporal Identity)', 'PDFormer', 'STAEformer', 'UniST'],
      strengths: ['兼顾全域时间自相关与局部空间动态博弈', '在城市级百级充电站集群上达到最低误差'],
      bottlenecks: ['模型参数规模大，端侧边缘计算部署受限', '未充分考虑外部极端扰动变量'],
      classicPaper: {
        title: 'PDFormer: Propagation Delay-aware Dynamic Long-range Spatio-Temporal Forecasting',
        venue: 'CAAI / IEEE TITS',
        year: 2023
      }
    },
    {
      id: 'node-6',
      title: '多模态与大模型',
      subtitle: '环境感知、气象跨模态与迁移涌现',
      stage: '第六阶段 (2024-未来)',
      era: '下一代前沿',
      color: '#f59e0b',
      description: '将大语言模型（LLM）的世界常识推理能力与气象物理模型、交通仿真引擎融合，探索零样本跨城市负荷泛化。',
      keyAlgorithms: ['Time-LLM', 'Chronos (Probabilistic Pretrained)', 'Multimodal Climate-Grid Fusion', 'Physics-Informed STGNN'],
      strengths: ['具备零样本/少样本跨城市冷启动预测能力', '深度融合极端天气与人类行为常识'],
      bottlenecks: ['算力要求高，实时在线推理延迟待优化', '物理机理一致性验证难度大'],
      classicPaper: {
        title: 'Time-LLM: Time Series Forecasting by Reprogramming Large Language Models',
        venue: 'ICLR',
        year: 2024
      }
    }
  ],
  gaps: [
    {
      id: 'gap-1',
      opportunityNumber: 'Opportunity 01',
      title: '极端天气条件下的城市级充电负荷预测',
      currentStatus: '传统研究主要关注常温常态环境下的周期性规律，对寒潮、暴雪、高温热浪等极端气象引发的电池续航骤减（掉电加剧）与空调高负荷充电缺乏定量耦合机制。',
      potentialInnovation: '将气象动力学变量（温度梯度、降雪厚度、暴雨等级）与热管理物理衰减曲线深度融入时空注意力网络，构建气象-交通-负荷联合感知模型。',
      innovationScore: 96,
      feasibilityScore: 90,
      recommendationStars: 5,
      suggestedMethods: [
        'Physics-Informed Neural Network (PINN) 融入电池低温热力学方程',
        '极端事件注意力加权机制 (Extreme-event Focal Attention)',
        '气象网格卫星数据与充电站点的跨模态时空对齐'
      ],
      impactLevel: 'Breakthrough'
    },
    {
      id: 'gap-2',
      opportunityNumber: 'Opportunity 02',
      title: '动态电价与充电行为联合预测',
      currentStatus: '多数研究将分时电价作为静态或被动输入变量，忽略了价格浮动对车主心理预期、导航选站重路由以及错峰排队行为的动态反馈闭环。',
      potentialInnovation: '建立“价格信号变化 → 行为博弈决策 → 空间路径转移 → 负荷分布重塑”的因果时序联合预测模型，实现电网与车主双边动态协同推演。',
      innovationScore: 94,
      feasibilityScore: 88,
      recommendationStars: 5,
      suggestedMethods: [
        'Causal Time Series Framework (因果推断框架排除混杂偏差)',
        'Multi-Agent 行为仿真强化学习与时序 Transformer 级联',
        '双层优化理论（Upper: 调度预测; Lower: 用户效用最大化）'
      ],
      impactLevel: 'High Impact'
    },
    {
      id: 'gap-3',
      opportunityNumber: 'Opportunity 03',
      title: '多城市迁移学习与小样本冷启动',
      currentStatus: '现有高精度模型高度依赖单一城市（如深圳、北京）多年密集的历史充电打卡数据。针对新建充电站或三四线中小城市，数据极度匮乏，难以直接复用成熟模型。',
      potentialInnovation: '利用领域自适应（Domain Adaptation）与时序基础大模型，学习城市空间拓扑与人口密度的通用表征，实现从数据丰富城市向冷启动城市的高效迁移。',
      innovationScore: 91,
      feasibilityScore: 85,
      recommendationStars: 4,
      suggestedMethods: [
        'Meta-Learning (MAML) 跨城市元学习初始化参数',
        'Contrastive Spatial-Temporal Pretraining (时空自监督对比学习)',
        'Urban POI 与路网嵌入特征的跨域对抗对齐 (DANN)'
      ],
      impactLevel: 'High Feasibility'
    }
  ],
  recommendation: {
    recommendedTitle: '极端天气、动态电价和城市空间结构共同作用下的新能源汽车充电负荷预测方法研究',
    backgroundSummary: '该研究精准契合当前国家新型电力系统建设与交通电气化转型的重大战略需求，直击极端气候脆弱性与车网互动（V2G）博弈两大前沿瓶颈，具备极高的国家自然科学基金（NSFC）申请价值与顶级期刊录用潜力。',
    baselines: [
      'LSTM (长短期记忆网络)',
      'GRU (门控循环单元)',
      'Transformer (PatchTST / Informer)',
      'GNN (ST-GCN / Graph WaveNet)'
    ],
    newVariables: [
      {
        name: '温度与温差变化率 (ΔT)',
        category: '气象物理环境',
        description: '反映低温下电池内阻上升导致续航衰减、空调制热能耗翻倍所引发的额外充电需求。'
      },
      {
        name: '降雨/降雪等级与路面状态',
        category: '气象物理环境',
        description: '影响道路车速、拥堵指数与行车能耗，导致车辆滞留路网与充电时间集中推迟。'
      },
      {
        name: '节假日与大型文旅事件',
        category: '社会时序周期',
        description: '刻画商圈、高速服务区等关键枢纽节点的突发性脉冲负荷。'
      },
      {
        name: '实时动态电价与服务费差值',
        category: '经济激励引导',
        description: '量化谷段低价对价格敏感型车主的时空分流转移效应。'
      },
      {
        name: '充电站空间分布与POI密度',
        category: '城市空间结构',
        description: '利用图拓扑刻画充电站周围500米内的居住、商业、办公复合用地类型比重。'
      }
    ],
    evaluationMetrics: [
      {
        name: 'MAE (平均绝对误差)',
        formula: 'MAE = (1/n) Σ |y_i - ŷ_i|',
        targetValue: '< 3.25 kW (降幅 > 15%)',
        description: '衡量绝对预测偏差，对异常峰值不敏感，适合评估基底负荷拟合平稳度。'
      },
      {
        name: 'RMSE (均方根误差)',
        formula: 'RMSE = √[ (1/n) Σ (y_i - ŷ_i)² ]',
        targetValue: '< 5.40 kW (降幅 > 18%)',
        description: '重点惩罚大误差预测，对电网变压器过载容量安全尤为关键。'
      },
      {
        name: 'MAPE (平均绝对百分比误差)',
        formula: 'MAPE = (100%/n) Σ |(y_i - ŷ_i) / y_i|',
        targetValue: '< 6.8% (行业顶级 SOTA 水平)',
        description: '消除量纲差异，用于跨不同容量充电站或跨城市间对比综合预测精度。'
      }
    ]
  },
  corePapers: [
    {
      id: 'paper-1',
      title: 'Informer: Beyond Efficient Transformer for Long Sequence Time-Series Forecasting',
      authors: 'H. Zhou, S. Zhang, J. Peng, S. Zhang, J. Li, H. Xiong, W. Zhang',
      venue: 'AAAI Conference on Artificial Intelligence (Best Paper Award)',
      year: 2021,
      citations: 3450,
      doi: '10.1609/aaai.v35i12.17325',
      tags: ['Transformer', 'Time-Series', 'SOTA Baseline'],
      abstract: '提出 ProbSparse 自注意力机制与自蒸馏操作，将传统 Transformer 的 O(L²) 计算复杂度降至 O(L log L)，为长序列能源负荷预测提供了核心基座。',
      keyContribution: '解决了常规 Transformer 在长时程连续负荷预测中的显存爆炸问题，是近5年负荷预测领域引用最高的奠基之作。',
      bibtex: `@inproceedings{zhou2021informer,
  title={Informer: Beyond efficient transformer for long sequence time-series forecasting},
  author={Zhou, Haoyi and Zhang, Shanghang and Peng, Jieqi and Zhang, Shuai and Li, Jianxin and Xiong, Hui and Zhang, Wancai},
  booktitle={Proceedings of the AAAI conference on artificial intelligence},
  volume={35},
  number={12},
  pages={11106--11115},
  year={2021}
}`
    },
    {
      id: 'paper-2',
      title: 'Spatial-Temporal Dynamic Graph Convolutional Networks for EV Charging Demand Prediction',
      authors: 'X. Zhang, Q. Huang, K. Sun, L. Zhao, C. Ding',
      venue: 'Applied Energy (JCR Q1, Top Journal, IF=11.2)',
      year: 2022,
      citations: 310,
      doi: '10.1016/j.apenergy.2022.119283',
      tags: ['GNN', 'Spatial-Temporal', 'EV Charging'],
      abstract: '提出动态时空图卷积网络，通过自适应邻接矩阵在线捕获不同充电桩之间的时变关联，大幅提升了早晚高峰期间局部站点过载预测准确率。',
      keyContribution: '首次引入自适应可学习空间矩阵替代传统物理距离静态构图，克服了交通路网距离与充电相关性不对齐的缺陷。',
      bibtex: `@article{zhang2022spatial,
  title={Spatial-Temporal Dynamic Graph Convolutional Networks for EV Charging Demand Prediction},
  author={Zhang, X. and Huang, Q. and Sun, K. and Zhao, L. and Ding, C.},
  journal={Applied Energy},
  volume={318},
  pages={119283},
  year={2022},
  publisher={Elsevier}
}`
    },
    {
      id: 'paper-3',
      title: 'A Physics-Informed Deep Learning Framework for Battery Degradation and EV Charging Profile Estimation',
      authors: 'Y. Liu, M. Zhang, W. Gao, T. Lin',
      venue: 'IEEE Transactions on Smart Grid (JCR Q1, IF=9.6)',
      year: 2023,
      citations: 185,
      doi: '10.1109/TSG.2023.3289140',
      tags: ['Physics-Informed', 'Weather Impact', 'Battery Physics'],
      abstract: '将电化学电池退化及低温阻抗方程作为损失函数正则项，使深度模型在气温骤降时依然能够保持符合能量守恒定律的物理合理性。',
      keyContribution: '证明了纯数据驱动模型在极端天气下的虚假过拟合缺陷，开创了机理-数据双驱动的负荷预测范式。',
      bibtex: `@article{liu2023physics,
  title={A Physics-Informed Deep Learning Framework for Battery Degradation and EV Charging Profile Estimation},
  author={Liu, Y. and Zhang, M. and Gao, W. and Lin, T.},
  journal={IEEE Transactions on Smart Grid},
  volume={14},
  number={5},
  pages={3890--3902},
  year={2023}
}`
    },
    {
      id: 'paper-4',
      title: 'PatchTST: A Time Series is Worth 64 Words: Long-term Forecasting with Transformers',
      authors: 'Y. Nie, N. H. Nguyen, P. Sinthong, J. Kalagnanam',
      venue: 'International Conference on Learning Representations (ICLR)',
      year: 2023,
      citations: 1240,
      doi: '10.48550/arXiv.2211.14730',
      tags: ['Transformer', 'Patching', 'Channel-Independence'],
      abstract: '采用分块（Patching）和通道独立（Channel-Independence）设计，在多个能源与负荷数据集上超越此前所有复杂时序 Transformer 模型。',
      keyContribution: '当前时序预测领域公认的顶级基础模型架构之一，计算效率与精度达到极佳平衡。',
      bibtex: `@inproceedings{nie2023patchtst,
  title={A Time Series is Worth 64 Words: Long-term Forecasting with Transformers},
  author={Nie, Yuqi and Nguyen, Nam H and Sinthong, Phanwadee and Kalagnanam, Jayant},
  booktitle={The Eleventh International Conference on Learning Representations},
  year={2023}
}`
    }
  ],
  proposalOutline: {
    title: '极端天气与动态电价双重驱动下的城市级新能源汽车充电负荷时空演化机理与智能预测方法研究',
    background: [
      '【国家双碳战略与新型电力系统】随着新能源汽车保有量突破3000万辆，城市充电负荷呈现“大功率、高并发、强时空异构”特征，给配电网安全运行带来极大挑战。',
      '【传统预测模型面临的极端环境瓶颈】现有基于统计学与标准深度学习的模型多依赖平稳气象假设与静态电价，在遭遇寒潮冰雪或分时电价跃变时，预测误差高达 35% 以上，极易诱发局部变压器越限跳闸。',
      '【本项目的科学使命】探明气象-交通-电网多维扰动对充电行为的非线性传导机理，突破多尺度时空深度学习与机理约束融合的理论难题。'
    ],
    keyScientificProblems: [
      '问题一：极端温度与降水对动力电池能耗特性及车主充放电决策行为的非线性耦合传导机理',
      '问题二：多源异构（气象遥感-路网拓扑-动态电价-历史负荷）时空数据的跨模态自适应表征与图拓扑动态演化',
      '问题三：兼顾电网物理拓扑约束（潮流方程与功率上限）的物理信息融入型（Physics-Informed）预测模型构建'
    ],
    technicalRoute: [
      '第1阶段：全域多模态数据底座搭建 —— 汇聚城市级充电桩高频采样数据、动态电价流、高分辨率气象重分析（ERA5）网格；',
      '第2阶段：基于因果推断的行为动态博弈建模 —— 构建价格弹性-气象敏感度车主充电转移响应矩阵；',
      '第3阶段：时空动态图 Transformer 核心算法研发 —— 融合 PatchTST 时间分块与 Dynamic Heterogeneous GNN 空间消息传递；',
      '第4阶段：实网工程示范与开源 Benchmark —— 在典型城市（如深圳/杭州）开展示范应用，发布首个包含极端天气的开源负荷基准数据集。'
    ],
    majorInnovations: [
      '创新点 1：构建首个面向电动汽车负荷的“气象物理机理-用户博弈行为-电网响应”三维因果交互理论体系；',
      '创新点 2：提出 Physics-Constrained Spatio-Temporal Patch Transformer 新架构，保证模型输出严格满足配电网功率边界；',
      '创新点 3：设计跨城市小样本元学习迁移算法（Spatial-Meta-Transfer），将成熟城市模型向冷启动新建充电站的迁移误差缩减 40% 以上。'
    ],
    expectedMilestones: [
      { phase: '第 1 年', goal: '完成多模态数据清洗管道搭建，建立极端天气对充电行为的影响机理数学模型，发表 JCR Q1 期刊 1 篇。' },
      { phase: '第 2 年', goal: '突破时空动态图 Transformer 架构与物理约束损失函数设计，完成在 500+ 充电站点的离线验证，申请发明专利 2 项。' },
      { phase: '第 3 年', goal: '部署城市级在线实时预测微服务原型，发布开源 Benchmark 与 PyTorch 算法库，承办顶级会议 Workshop。' }
    ]
  },
  experimentSetup: {
    taskDefinition: '给定目标城市 N 个充电站过去 T_in = 96 步（24小时，15分钟粒度）的多维时序特征与外部变量，联合预测未来 T_out = 96 步（未来24小时）各站点的有功充电负荷（kW）。',
    datasetPrep: [
      '数据集 1：Caltech ACN Data (包含 50,000+ 次真实充电会话，记录充电量、连接时长与功率曲线)',
      '数据集 2：Shenzhen Municipal EV Big Data (包含 1,200+ 公共充电站、路网交通流与分时电价)',
      '气象数据源：ECMWF ERA5 0.25° 网格（小时级气温、地表湿度、风速、降水量）',
      '数据预处理：滑动窗口切片 (96 步输入, 96 步预测)，Z-score 鲁棒标准化，缺失值采用时空克里金插值补齐'
    ],
    modelArchitecture: [
      'Temporal Backbone: PatchTST (Patch length = 16, Stride = 8, Dimension = 128)',
      'Spatial Module: Dynamic Graph Attention Network (4 Attention Heads, Node Embedding Dim = 64)',
      'Multimodal Fusion: Cross-Attention Fusion Layer for Weather & Dynamic Tariff',
      'Loss Function: Smooth L1 Loss + Physics Constraint Penalty: L_total = L_smooth + 0.1 * L_physics'
    ],
    ablationStudies: [
      { group: 'Exp A: Full Proposed Model', configuration: 'ST-PatchTransformer + Weather + Tariff + Physics Loss', purpose: '评估完整创新模型的整体最优精度（预期 MAPE < 6.5%）' },
      { group: 'Exp B: w/o Weather Features', configuration: '移除温度与降水特征输入，仅使用历史负荷', purpose: '量化极端天气输入对突发寒潮/高温天气的预测提升幅度' },
      { group: 'Exp C: w/o Spatial GNN', configuration: '各充电站独立使用 PatchTST 进行时序预测，不进行站点间图消息传递', purpose: '验证空间路网拓扑与充电溢出效应的有效性' },
      { group: 'Exp D: w/o Dynamic Tariff', configuration: '将电价设为固定常量输入', purpose: '验证分时电价波动对用户充电时间分布的引导规律' }
    ],
    hyperparameters: [
      { param: 'Batch Size', value: '32', note: '多卡分布式训练推荐' },
      { param: 'Learning Rate', value: '1e-4 with Cosine Annealing', note: '初始 lr=1e-4, 5个 epoch warmup' },
      { param: 'Optimizer', value: 'AdamW (weight_decay=1e-2)', note: '防止过拟合' },
      { param: 'Training Epochs', value: '100 epochs (Early Stopping = 15)', note: '基于验证集 MAE 自动停止' },
      { param: 'Dropout Rate', value: '0.15', note: '注意力层与 FFN 全连接层' }
    ],
    pytorchSnippet: `import torch
import torch.nn as nn
from torch_geometric.nn import GATv2Conv

class WeatherAwareSTGNN(nn.Module):
    def __init__(self, num_nodes, in_dim=96, weather_dim=6, hidden_dim=128, out_dim=96):
        super(WeatherAwareSTGNN, self).__init__()
        self.num_nodes = num_nodes
        # 1. 时序分块编码器 (Patch Embedding)
        self.patch_embed = nn.Conv1d(1, hidden_dim, kernel_size=16, stride=8)
        self.temporal_transformer = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model=hidden_dim, nhead=8, dim_feedforward=256, batch_first=True),
            num_layers=3
        )
        # 2. 空间动态图卷积 (GATv2)
        self.gat = GATv2Conv(hidden_dim, hidden_dim, heads=4, concat=False)
        # 3. 气象与电价跨模态融合
        self.weather_proj = nn.Linear(weather_dim, hidden_dim)
        self.fusion_gate = nn.Sequential(
            nn.Linear(hidden_dim * 2, hidden_dim),
            nn.Sigmoid()
        )
        # 4. 预测解码头 (Multi-step Output)
        self.head = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.GELU(),
            nn.Linear(hidden_dim // 2, out_dim)
        )

    def forward(self, x, edge_index, weather_feat):
        # x: [Batch, Nodes, T_in] -> Temporal Embedding
        B, N, T = x.shape
        x_flat = x.view(B * N, 1, T)
        patches = self.patch_embed(x_flat).transpose(1, 2) # [B*N, Num_patches, hidden_dim]
        temp_out = self.temporal_transformer(patches)[:, -1, :] # [B*N, hidden_dim]
        temp_out = temp_out.view(B, N, -1)

        # Spatial Message Passing
        spatial_out = []
        for b in range(B):
            s_b = self.gat(temp_out[b], edge_index)
            spatial_out.append(s_b)
        spatial_out = torch.stack(spatial_out, dim=0) # [B, N, hidden_dim]

        # Multimodal Gating with Weather & Price
        w_emb = self.weather_proj(weather_feat) # [B, N, hidden_dim]
        gate = self.fusion_gate(torch.cat([spatial_out, w_emb], dim=-1))
        fused = gate * spatial_out + (1 - gate) * w_emb

        # Prediction output: [B, N, T_out]
        out = self.head(fused)
        return out`
  }
};

export const PRESET_TOPIC_EXAMPLES = [
  {
    topic: '新能源汽车充电负荷预测',
    question: '请分析近5年新能源汽车充电负荷预测相关研究，重点关注Transformer、GNN、时序预测，并找出目前研究空白。',
    tag: '默认核心主题'
  },
  {
    topic: '固态电池热失控预警与多物理场建模',
    question: '分析固态锂电池在针刺、过充及高温工况下的热失控机理，重点关注电化学-热-力多物理场耦合仿真与AI早期预警算法。',
    tag: '储能与电池安全'
  },
  {
    topic: '大语言模型在医学病历结构化与因果推理中的应用',
    question: '梳理近3年大语言模型与知识图谱在电子病历（EMR）实体抽取、临床决策支持及因果可解释性方面的研究进展与不足。',
    tag: '医疗AI与大模型'
  },
  {
    topic: '基于具身智能的机器人灵巧手操作研究',
    question: '总结具身智能强化学习、触觉多模态感知在多指灵巧手抓取与精密装配任务中的研究热点与泛化性瓶颈。',
    tag: '具身智能与机器人'
  }
];
