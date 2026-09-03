// ============================================================================
// 科研链路节点 Demo 注册表 + 静态演示数据
//
// 后续节点开发方式：新增 `src/components/demos/XxxDemo.vue` 组件，然后在
// NODE_DEMOS 中将对应 nodeId 的 ready 改为 true、补充 title/subtitle 即可，
// 页面会自动把「演示」按钮变成可点击状态。
// ============================================================================

export interface BreakdownVariable {
  name: string
  desc: string
}

export interface TopicBreakdown {
  id: string
  topic: string
  domain: string
  taskType: string
  subQuestions: string[]
  variables: {
    independent: BreakdownVariable[]
    dependent: BreakdownVariable[]
    control: BreakdownVariable[]
  }
  feasibility: {
    data: number
    method: number
    compute: number
    dataNote: string
    methodNote: string
    computeNote: string
  }
  researchQuestion: string
}

// ---- 4 个预置科研问题（与参考 demo 的 PRESET_TOPICS 保持一致） --------------

export const TOPIC_BREAKDOWNS: TopicBreakdown[] = [
  {
    id: 'ev-charging',
    topic: '新能源汽车充电负荷预测还有哪些值得研究的方向？',
    domain: '智能电网 × 新能源汽车交叉学科（时空序列预测）',
    taskType: '方向探索 + 方法研究型科学问题',
    subQuestions: [
      '动力电池热管理机理与气象强扰动如何映射为神经网络的正则化算子？',
      '如何解耦车主在空间距离与经济激励（动态电价）之间的权衡决策？',
      '多源异构协变量下，模型对极端尖峰负荷的预测置信度能否超越时空基准？',
    ],
    variables: {
      independent: [
        { name: '气象条件', desc: '温度 / 降雨 / 极端天气事件' },
        { name: '动态电价', desc: '分时 / 实时电价与峰谷价差' },
        { name: '节假日与大型活动', desc: '结构性出行冲击与负荷突变' },
      ],
      dependent: [
        { name: '充电负荷功率', desc: '站点级 / 城市级时空负荷序列' },
      ],
      control: [
        { name: '历史负荷序列', desc: '多尺度滑动窗口切分' },
        { name: '站点空间拓扑', desc: '路网 / POI / 快慢桩比例' },
        { name: '车辆保有量渗透率', desc: '区域 EV 渗透水平' },
      ],
    },
    feasibility: {
      data: 88,
      method: 85,
      compute: 92,
      dataNote: 'NOAA 气象公开集 + Caltech ACN + 城市脱敏数据',
      methodNote: 'PINN / STGNN / 因果推断方法栈成熟',
      computeNote: 'RTX 4090 单卡即可完成全部实验',
    },
    researchQuestion:
      '极端天气、动态电价与城市空间结构共同作用下，新能源汽车充电负荷能否实现更准确的短期预测？',
  },
  {
    id: 'medical-hallucination',
    topic: '大语言模型在医疗诊断中的幻觉抑制与可信临床决策机制',
    domain: '人工智能 × 临床医学（可信 AI / 大模型安全）',
    taskType: '方法机制研究 + 评测体系构建',
    subQuestions: [
      '医疗领域幻觉的成因（知识缺失 / 检索噪声 / 指令歧义）如何量化建模？',
      '如何构建融合循证医学证据链的幻觉抑制机制（RAG + 知识图谱 + 推理校验）？',
      '面向临床采纳的评估指标与基准（事实一致性 / 医生双盲评测）如何设计？',
    ],
    variables: {
      independent: [
        { name: '检索增强策略', desc: 'RAG 窗口 / 知识图谱密度 / 证据召回' },
        { name: '推理校验机制', desc: '自洽性校验 / 置信度校准' },
        { name: '提示词与对齐', desc: '临床指令遵循与安全对齐' },
      ],
      dependent: [
        { name: '幻觉率 / 事实一致性', desc: '临床答案的可信度指标' },
        { name: '诊断准确率', desc: '多疾病诊断 Top-1 / Top-5' },
      ],
      control: [
        { name: '评测数据集', desc: 'MedQA / PubMed QA / MIMIC 基准' },
        { name: '医生评估背景', desc: '统一双盲评测协议' },
      ],
    },
    feasibility: {
      data: 90,
      method: 82,
      compute: 75,
      dataNote: 'MedQA / PubMed / MIMIC 等公开医学语料充足',
      methodNote: 'RAG + 知识图谱 + 对齐方法可组合创新',
      computeNote: '需大模型 API 预算与评测人力',
    },
    researchQuestion:
      '能否构建一种证据链驱动的检索增强机制，将大模型医疗诊断的幻觉率显著降低并达到临床可采纳标准？',
  },
  {
    id: 'molecule-gnn',
    topic: '图神经网络在小分子药物性质预测中的泛化与外推能力研究',
    domain: '计算化学 × 机器学习（AI for Drug Discovery）',
    taskType: '方法泛化性机理研究',
    subQuestions: [
      '现有 GNN 在化学空间外推（Scaffold Split）中的性能退化机理是什么？',
      '3D 构象 / 分子片段 / 物理描述符如何协同增强 GNN 的分布外泛化？',
      '分子表征的归纳偏置（等变性 / 不变性）如何影响泛化边界？',
    ],
    variables: {
      independent: [
        { name: '分子表征方法', desc: '2D 图 / 3D 构象 / 几何信息' },
        { name: '预训练策略', desc: '自监督与物理任务联合预训练' },
        { name: '物理描述符注入', desc: '电子 / 几何 / 能量先验特征' },
      ],
      dependent: [
        { name: '性质预测精度', desc: 'QED / LogP / 生物活性等' },
      ],
      control: [
        { name: '数据集划分协议', desc: 'Random vs Scaffold Split' },
        { name: '评估基准', desc: 'MoleculeNet / ZINC 统一协议' },
      ],
    },
    feasibility: {
      data: 95,
      method: 84,
      compute: 78,
      dataNote: 'MoleculeNet / ZINC / ChEMBL 公开数据集丰富',
      methodNote: '几何深度学习与预训练方法可借鉴',
      computeNote: '单机 GPU 可训练，3D 构象生成需补充算力',
    },
    researchQuestion:
      '能否通过融合 3D 构象与物理先验的分子表征学习，显著提升 GNN 在 Scaffold 划分下的外推泛化能力？',
  },
  {
    id: 'solid-state-battery',
    topic: '全固态锂电池固-固界面离子传输动力学与阻抗退化机理优化',
    domain: '材料科学（电化学储能 / 界面动力学）',
    taskType: '机理研究 + 材料设计优化',
    subQuestions: [
      '固-固界面空间电荷层与晶界阻抗的动力学本质是什么？',
      '界面中间层的成分与厚度如何影响长期循环阻抗演化？',
      '如何用多尺度模拟（DFT + MD + 相场）与实验联动优化界面设计？',
    ],
    variables: {
      independent: [
        { name: '界面层材料与厚度', desc: '涂层成分 / 厚度梯度' },
        { name: '制备工艺参数', desc: '烧结温度 / 等静压压力' },
      ],
      dependent: [
        { name: '界面阻抗', desc: '电荷转移电阻 / 晶界电阻' },
        { name: '循环容量保持率', desc: '长期循环稳定性' },
      ],
      control: [
        { name: '电池结构', desc: '纽扣 / 软包统一构型' },
        { name: '测试环境', desc: '恒温恒湿 / 统一充放电倍率' },
      ],
    },
    feasibility: {
      data: 82,
      method: 76,
      compute: 62,
      dataNote: '公开实验数据 + 课题组合成样品',
      methodNote: 'DFT / MD 计算门槛较高',
      computeNote: '需计算集群支撑多尺度模拟',
    },
    researchQuestion:
      '能否通过可控界面工程（中间层 / 梯度界面）显著降低固-固界面阻抗并抑制循环过程中的阻抗退化？',
  },
]

export const PRESET_TOPICS: string[] = TOPIC_BREAKDOWNS.map((b) => b.topic)

// ---- 自由输入通用拆解模板 --------------------------------------------------

export function buildGenericBreakdown(topic: string): TopicBreakdown {
  const clean = topic.replace(/[?？\s]+$/, '')
  return {
    id: 'custom',
    topic,
    domain: `${clean} 相关交叉研究领域（人工智能 × 领域科学）`,
    taskType: '方法探索与实证研究型科学问题',
    subQuestions: [
      `围绕「${clean}」，现有方法与 SOTA 的差距在哪里、可提升空间多大？`,
      `影响该问题的关键因素有哪些，如何建模其作用机制与耦合关系？`,
      `如何设计可量化评估的实验方案与基准（数据 / 指标 / Baseline）？`,
    ],
    variables: {
      independent: [
        { name: '核心方法 / 模型设计', desc: '不同算法架构与特征表示的影响' },
        { name: '关键外部因素', desc: '数据规模、任务设置与场景差异' },
      ],
      dependent: [
        { name: '任务核心指标', desc: '精度 / 效率 / 稳定性等结果性度量' },
      ],
      control: [
        { name: '数据与评估协议', desc: '统一数据集划分与评测标准' },
        { name: '计算资源配置', desc: '统一硬件与训练预算' },
      ],
    },
    feasibility: {
      data: 80,
      method: 78,
      compute: 85,
      dataNote: '公开数据集 / 自采数据可用性较高',
      methodNote: '主流方法可直接参考，创新空间可探索',
      computeNote: '单机 GPU 或调用大模型 API 即可开展',
    },
    researchQuestion: `针对「${clean}」，如何构建兼顾精度、可解释性与泛化能力的新方案？`,
  }
}

// ============================================================================
// research-agent：自动编排 · 判断方向与研究空白
// ============================================================================

export interface DirectionRating {
  researchValue: number // 1-5
  innovationSpace: number // 1-5
  dataAvailability: number // 1-5
  experimentDifficulty: number // 1-5
}

export interface ResearchDirection {
  id: string
  code: string
  title: string
  subtitle: string
  ratings: DirectionRating
  description: string
  keyChallenges: string[]
  breakthroughPoint: string
  recommendedDataset: string
  recommendedModels: string[]
  expectedImpact: string
  tags: string[]
}

export interface TopicDirections {
  topicId: string
  topic: string
  hotSpots: string[]
  gaps: string[]
  conclusion: string
  directions: ResearchDirection[]
}

// ---- 4 个预置主题的方向研判数据（EV 充电复用参考 demo 的完整研究机会） ----------

export const DIRECTIONS_BY_TOPIC: Record<string, TopicDirections> = {
  'ev-charging': {
    topicId: 'ev-charging',
    topic: '新能源汽车充电负荷预测还有哪些值得研究的方向？',
    hotSpots: ['时空图神经网络', '概率预测与不确定性量化', '物理信息神经网络 PINN', '多模态时序大模型', 'V2G 车网互动'],
    gaps: [
      '极端天气物理机制与数据驱动割裂',
      '动态电价反馈的因果内生性缺失',
      '中小城市冷启动跨域泛化不足',
    ],
    conclusion:
      '充电负荷预测仍存在显著研究空间：物理先验、因果推断与跨域迁移三大空白尚未被系统性解决，具备顶会 / 顶刊立项价值。',
    directions: [
      {
        id: 'dir-01',
        code: '方向 01',
        title: '极端天气条件下的城市级充电负荷预测',
        subtitle: 'Extreme Weather & Climate Resilient EV Load Forecasting',
        ratings: { researchValue: 5, innovationSpace: 4, dataAvailability: 4, experimentDifficulty: 3 },
        description:
          '研究台风、寒潮暴雪、持续高温等极端气象突变对电池充放电特性、用户出行取消率及应急充电需求的级联非线性影响，构建具有气象鲁棒性的多尺度时空图神经网络预测体系。',
        keyChallenges: [
          '极端天气样本极度稀缺（长尾分布），模型容易发生过拟合与分布漂移',
          '低温下电池 BMS 充电功率主动降额，与用户热管理耗电形成复合强非线性耦合',
          '极端事件导致道路积水封路，充电负荷在城市微电网节点间发生剧烈空间重路由',
        ],
        breakthroughPoint:
          '引入物理引导的神经微分方程 (Physics-Informed Neural ODE) 融合锂电低温电化学阻抗机理，结合物理扩散注意力机制建模负荷空间迁移。',
        recommendedDataset: 'NOAA-NCEI 气象公开集 + Caltech ACN Data + 某直辖市 120,000 桩日级时序脱敏数据',
        recommendedModels: ['PINN-ODE', 'Spatio-Temporal Graph WaveNet', 'Diffusion Probabilistic Forecasting'],
        expectedImpact: '提升极端天气期间城市电网调度弹性，降低 38% 的局部配电变压器过载风险。',
        tags: ['极端天气', '物理信息神经网络', '时空鲁棒性', '电网韧性'],
      },
      {
        id: 'dir-02',
        code: '方向 02',
        title: '动态电价与充电行为联合预测',
        subtitle: 'Joint Forecasting of Dynamic Tariffs and Elastic Charging Behavior',
        ratings: { researchValue: 4, innovationSpace: 5, dataAvailability: 3, experimentDifficulty: 4 },
        description:
          '将电网分时 / 实时电价机制与车主价格弹性、排队博弈及目的地吸引力模型联立，解决「价格引导 - 聚集充电 - 引发新负荷峰值」的双向反馈环路预测难题。',
        keyChallenges: [
          '电价信号与负荷响应存在非平稳双向因果环路，传统单向时间序列回归失效',
          '不同类型车主（网约车 / 私家车 / 物流轻卡）的价格敏感度异质性显著且动态演化',
          '高保真微观行为数据（如充电 APP 下单与比价行为）存在隐私壁垒与数据稀疏性',
        ],
        breakthroughPoint:
          '基于多智能体双层强化学习 (MARL) 与反事实因果推断 (Causal Inference) 框架，解耦电价干预与内生出行需求的因果效应。',
        recommendedDataset: 'CAISO LMP 实时边际电价数据 + Austin Pecan Street EV 行为实测集 + 出行 OD 分布矩阵',
        recommendedModels: ['Causal-Informer', 'Multi-Agent Bi-level Game Network', 'Neural Propensity Matching'],
        expectedImpact: '揭示峰谷电价反弹效应机制，为电力现货市场下充电商需求响应策略提供理论支撑。',
        tags: ['博弈论', '因果推断', '动态电价', '双向反馈'],
      },
      {
        id: 'dir-03',
        code: '方向 03',
        title: '多城市充电负荷迁移学习',
        subtitle: 'Cross-City Transfer Learning & Domain Adaptation for EV Load',
        ratings: { researchValue: 4, innovationSpace: 4, dataAvailability: 4, experimentDifficulty: 4 },
        description:
          '针对新兴中小城市充电桩新建初期历史监测数据严重匮乏的「冷启动」痛点，利用成熟一线大城市的丰富源域数据向目标城市进行空间结构与行为表征迁移。',
        keyChallenges: [
          '不同城市在路网密度、车辆保有渗透率、公共交通结构上存在强烈的域偏移 (Domain Shift)',
          '地理空间图的拓扑异构性导致跨图图神经网络无法直接对齐节点特征',
          '如何在无目标城市精细充电历史的情况下提取通用潜在充电模式',
        ],
        breakthroughPoint:
          '跨城市图对比元学习 (Meta-Graph Contrastive Learning) 与时空解耦注意力表征，基于城市元特征完成即插即用迁移。',
        recommendedDataset: '北京 / 上海 / 深圳开放充电桩监测数据集 (源域) + 3 个三线新建试点城市 30 天样本',
        recommendedModels: ['Meta-STGNN', 'Domain Adversarial Spatial Transformer', 'Graph Prompt Tuning'],
        expectedImpact: '将新规划充电站所在片区负荷预测冷启动周期从 6 个月缩短至 3 天，降低数据采集成本 80% 以上。',
        tags: ['迁移学习', '图元学习', '冷启动预测', '跨域泛化'],
      },
    ],
  },

  'medical-hallucination': {
    topicId: 'medical-hallucination',
    topic: '大语言模型在医疗诊断中的幻觉抑制与可信临床决策机制',
    hotSpots: ['检索增强生成 RAG', '医学知识图谱融合', '事实一致性评测', '可解释临床决策', '多模态医疗问答'],
    gaps: [
      '医疗幻觉成因缺乏量化建模',
      '证据链与推理校验机制不成熟',
      '临床采纳级评测基准缺失',
    ],
    conclusion:
      '医疗幻觉抑制是可信医疗 AI 的核心痛点：证据链驱动的机制设计与临床级评测标准均处于起步阶段，研究空间充足。',
    directions: [
      {
        id: 'dir-01',
        code: '方向 01',
        title: '证据链驱动的检索增强幻觉抑制机制',
        subtitle: 'Evidence-Chain Grounded RAG for Clinical Hallucination Suppression',
        ratings: { researchValue: 5, innovationSpace: 4, dataAvailability: 4, experimentDifficulty: 3 },
        description:
          '构建融合医学知识图谱与结构化证据链的 RAG 架构，通过「证据召回 - 推理校验 - 事实一致性约束」三阶段流水线，从源头抑制大模型在临床问答中的幻觉生成。',
        keyChallenges: [
          '证据召回噪声与临床歧义导致错误关联',
          '推理校验缺乏领域可解释的判定标准',
          '幻觉边界在长尾罕见病症上难以界定',
        ],
        breakthroughPoint:
          '设计「证据路径图」可解释推理模块，将每条临床答案回溯至可验证的证据链，并引入检索质量自评估与纠错回路。',
        recommendedDataset: 'MedQA / PubMed QA / MIMIC-IV + 结构化医学知识图谱（UMLS / SNOMED-CT）',
        recommendedModels: ['Evidence-Grounded RAG', 'GraphRAG + Clinical Verifier', 'Self-Consistency Ensemble'],
        expectedImpact: '将医疗问答事实一致性从 82% 提升至 96% 以上，达到临床双盲评测可采纳线。',
        tags: ['幻觉抑制', '证据链', 'RAG', '可信医疗 AI'],
      },
      {
        id: 'dir-02',
        code: '方向 02',
        title: '医疗大模型置信度校准与不确定性量化',
        subtitle: 'Confidence Calibration & Uncertainty Quantification for Clinical LLMs',
        ratings: { researchValue: 4, innovationSpace: 5, dataAvailability: 3, experimentDifficulty: 4 },
        description:
          '面向高风险临床决策场景，研究大模型在医学分布外输入下的置信度失真问题，构建概率校准与选择性回答机制，让模型在不确定时主动求助而非臆测。',
        keyChallenges: [
          '医疗分布外样本天然难以获取',
          '校准效果随模型规模与任务发生漂移',
          '选择性回答与临床工作流的交互设计',
        ],
        breakthroughPoint:
          '提出基于医生标注不确定性的双阶段校准框架，结合证据挖掘的熵估计与选择性回答阈值自适应学习。',
        recommendedDataset: 'MIMIC-IV 出院小结 + 医生置信度标注集 + 对抗性医疗改写样本',
        recommendedModels: ['Conformal Prediction + LLM', 'Evidential Deep Learning', 'Selective Q&A Policy'],
        expectedImpact: '将高风险问题的错答率降低 40%，并让 85% 的低置信度查询正确转交人工复核。',
        tags: ['不确定性', '置信度校准', '选择性回答', '临床安全'],
      },
      {
        id: 'dir-03',
        code: '方向 03',
        title: '面向临床采纳的可信评测基准与双盲评测',
        subtitle: 'Clinical-Grade Benchmarking & Double-Blind Evaluation Protocol',
        ratings: { researchValue: 4, innovationSpace: 3, dataAvailability: 4, experimentDifficulty: 3 },
        description:
          '构建覆盖多科室、多模态、多难度的医疗 LLM 可信评测基准，建立事实一致性、循证充分性、安全性三位一体的量化指标体系与医生双盲评测协议。',
        keyChallenges: [
          '医疗专家标注成本高昂',
          '评测指标与临床相关性难以对齐',
          '跨模型公平对比缺乏统一协议',
        ],
        breakthroughPoint:
          '提出「医生 - 模型 - 病历」三元组的双盲评测协议与自动化事实核查流水线，显著降低专家评测成本。',
        recommendedDataset: '全国多中心脱敏病历 + 专家双盲标注集 + 公开基准（MedQA / CMB）',
        recommendedModels: ['Auto-Check Fact Verifier', 'Clinician-Grounded Rubric', 'Multi-Axis Benchmark Suite'],
        expectedImpact: '形成可复用的医疗可信 LLM 评测标准，为监管审评提供量化依据。',
        tags: ['评测基准', '双盲评测', '事实一致性', '医疗合规'],
      },
    ],
  },

  'molecule-gnn': {
    topicId: 'molecule-gnn',
    topic: '图神经网络在小分子药物性质预测中的泛化与外推能力研究',
    hotSpots: ['几何图神经网络', '自监督预训练', '等变 / 不变表征', 'Scaffold 泛化', '物理描述符增强'],
    gaps: [
      'GNN 在化学空间外推中性能退化',
      '3D 构象与 2D 图的信息融合不充分',
      '分子预训练缺乏化学物理一致性约束',
    ],
    conclusion:
      '小分子性质预测中 GNN 的分布外泛化瓶颈是 AI for Drug Discovery 的核心开放问题，3D 几何与物理先验融合仍处探索期，研究价值高。',
    directions: [
      {
        id: 'dir-01',
        code: '方向 01',
        title: '3D 构象感知的等变分子表征学习',
        subtitle: 'Conformer-Aware Equivariant Molecular Representation Learning',
        ratings: { researchValue: 5, innovationSpace: 4, dataAvailability: 4, experimentDifficulty: 3 },
        description:
          '将分子 3D 构象与几何等变信息融入 GNN 表征，研究构象系综采样与 2D / 3D 跨视图一致性学习，提升对活性与毒性等性质的预测精度与外推能力。',
        keyChallenges: [
          '构象采样计算成本高',
          '2D / 3D 表征对齐缺乏监督信号',
          '等变模型在工业级数据集上的扩展性',
        ],
        breakthroughPoint:
          '提出构象系综注意力池化与 2D-3D 对比对齐框架，在不引入昂贵 MD 模拟的情况下学习稳健的 3D 感知表征。',
        recommendedDataset: 'QM9 / GEOM / MoleculeNet / ZINC-20（含构象）',
        recommendedModels: ['SE(3)-Transformer', 'Equiformer', 'Conformer-GNN Contrastive'],
        expectedImpact: '在 Scaffold Split 下活性预测 AUC 提升 8-12%，外推稳定性显著改善。',
        tags: ['3D 构象', '等变网络', '对比学习', '表征学习'],
      },
      {
        id: 'dir-02',
        code: '方向 02',
        title: '物理先验注入的分布外泛化增强',
        subtitle: 'Physics-Informed Out-of-Distribution Generalization for GNN',
        ratings: { researchValue: 4, innovationSpace: 5, dataAvailability: 4, experimentDifficulty: 4 },
        description:
          '将量子化学计算（DFT）与经典力场先验编码为 GNN 的归纳偏置与正则约束，解决分子表征在陌生化学空间上的外推失败，建立「物理可解释」的泛化框架。',
        keyChallenges: [
          '物理先验与可学习表征的冲突权衡',
          'DFT 标注成本高限制数据规模',
          '跨数据集的先验迁移能力不足',
        ],
        breakthroughPoint:
          '提出物理一致性正则项（能量守恒、轨道对称性）与「预测 - 物理校验」双通道架构，在推理阶段约束输出符合物理规律。',
        recommendedDataset: 'QM7-X / QM9 的 DFT 标签 + ChEMBL 生物活性数据',
        recommendedModels: ['Physics-Regularized GNN', 'MACE / NequIP 框架', 'PDE-Informed Molecular Net'],
        expectedImpact: '在分布外骨架上的性质预测误差降低 25%，并显著减少违背物理直觉的预测。',
        tags: ['物理先验', 'OOD 泛化', 'DFT 标签', '可解释性'],
      },
      {
        id: 'dir-03',
        code: '方向 03',
        title: '跨任务多目标分子预训练与适配',
        subtitle: 'Cross-Task Molecular Pretraining & Multi-Objective Adaptation',
        ratings: { researchValue: 4, innovationSpace: 4, dataAvailability: 5, experimentDifficulty: 3 },
        description:
          '构建大规模分子自监督预训练模型，通过任务无关的原子 - 片段 - 构象多粒度预训练目标，实现下游多目标（活性、毒性、ADMET）的快速微调与迁移。',
        keyChallenges: [
          '预训练目标设计缺乏化学先验指导',
          '多目标间的冲突与权重平衡',
          '与 SOTA 专用模型的性能差距',
        ],
        breakthroughPoint:
          '提出化学领域增强的掩码恢复与片段重构预训练目标，结合多任务不确定性加权实现下游统一适配。',
        recommendedDataset: 'ZINC-20 数亿级分子 + ChEMBL 多标签活性库',
        recommendedModels: ['Uni-Mol 变体', 'ChemBERTa2 + GNN 主干', 'MTL Uncertainty Weighting'],
        expectedImpact: '在 6 个下游 ADMET 任务上平均提升 10%，冷启动任务仅需百级样本即可收敛。',
        tags: ['分子预训练', '自监督', '多任务学习', '迁移适配'],
      },
    ],
  },

  'solid-state-battery': {
    topicId: 'solid-state-battery',
    topic: '全固态锂电池固-固界面离子传输动力学与阻抗退化机理优化',
    hotSpots: ['固-固界面工程', '空间电荷层', '多尺度模拟（DFT / MD / 相场）', '原位表征', '高离子电导电解质'],
    gaps: [
      '固-固界面阻抗机制认识不清',
      '界面中间层设计缺乏理论指导',
      '多尺度模拟与实验数据联动不足',
    ],
    conclusion:
      '全固态电池固-固界面问题是制约其商业化的关键瓶颈，界面动力学机理与可控界面工程均处于快速上升期，具备高价值研究机会。',
    directions: [
      {
        id: 'dir-01',
        code: '方向 01',
        title: '固-固界面空间电荷层与晶界阻抗动力学',
        subtitle: 'Space-Charge Layer & Grain Boundary Impedance Kinetics',
        ratings: { researchValue: 5, innovationSpace: 4, dataAvailability: 3, experimentDifficulty: 4 },
        description:
          '通过多尺度模拟与阻抗谱联用，量化空间电荷层、晶界与接触损失对界面总阻抗的贡献，揭示循环过程中的阻抗退化动力学本质。',
        keyChallenges: [
          '空间电荷层厚度为亚纳米级，难以直接观测',
          '晶界微观结构与宏观阻抗的映射关系复杂',
          '模拟与实验之间存在时 - 空尺度鸿沟',
        ],
        breakthroughPoint:
          '构建 DFT + MD 联动的界面势垒模型，并用原位 EIS 与冷冻电镜交叉验证，实现界面阻抗贡献的定量分解。',
        recommendedDataset: '课题组合成样品 EIS / 电镜数据 + Materials Project 公开晶体数据库',
        recommendedModels: ['DFT 界面势垒计算', '分子动力学 MD', '等效电路解析'],
        expectedImpact: '首次定量给出空间电荷层阻抗占比，为界面设计提供机理级依据。',
        tags: ['空间电荷层', '晶界阻抗', '多尺度模拟', '原位表征'],
      },
      {
        id: 'dir-02',
        code: '方向 02',
        title: '梯度界面中间层的可控设计与优化',
        subtitle: 'Gradient Interlayer Engineering via High-Throughput & Bayesian Search',
        ratings: { researchValue: 4, innovationSpace: 5, dataAvailability: 4, experimentDifficulty: 3 },
        description:
          '设计成分 / 厚度可控的梯度中间层（如 LZO、LiF 复合层），利用高通量实验与贝叶斯优化快速搜索最优界面工程参数组合。',
        keyChallenges: [
          '梯度层制备工艺重复性差',
          '中间层的引入可能带来新的界面问题',
          '多参数空间搜索效率低',
        ],
        breakthroughPoint:
          '提出「高通量磁控溅射 + 贝叶斯优化」闭环，实现成分 - 厚度 - 电化学性能的高效联合寻优。',
        recommendedDataset: '课题组合成与表征数据 + 公开文献数据（Text Mining）',
        recommendedModels: ['贝叶斯优化', '机器学习势能', '相场模型'],
        expectedImpact: '将界面面积比阻抗降低 60% 以上，循环 500 圈容量保持率提升至 92%。',
        tags: ['梯度界面', '中间层', '高通量实验', '贝叶斯优化'],
      },
      {
        id: 'dir-03',
        code: '方向 03',
        title: '多尺度模拟-实验联动的界面退化预测',
        subtitle: 'Multi-Scale Simulation & Experiment Synergy for Interface Degradation',
        ratings: { researchValue: 4, innovationSpace: 4, dataAvailability: 3, experimentDifficulty: 5 },
        description:
          '建立从原子（DFT）到介观（相场）再到器件（连续介质）的跨尺度退化预测框架，实现循环寿命与失效模式的早期预测及工艺参数优化。',
        keyChallenges: [
          '跨尺度参数传递与标定困难',
          '长循环退化数据积累周期长',
          '相场 - 电化学耦合求解计算量大',
        ],
        breakthroughPoint:
          '提出「界面退化数字孪生」框架，以实验数据流式校准多尺度模型，将 500 圈循环退化预测误差控制在 10% 以内。',
        recommendedDataset: '课题组长循环测试数据 + 公开电化学数据集',
        recommendedModels: ['相场-电化学耦合', '数字孪生', '降阶代理模型'],
        expectedImpact: '将界面失效模式的预测提前量提升 3 倍，指导工艺参数快速迭代。',
        tags: ['多尺度模拟', '数字孪生', '退化预测', '寿命评估'],
      },
    ],
  },
}

// 自由输入 → 通用研究方向模板（无完整静态数据时兜底演示）
export function buildGenericDirections(topic: string): TopicDirections {
  const clean = topic.replace(/[?？\s]+$/, '')
  return {
    topicId: 'custom',
    topic,
    hotSpots: ['方法创新', '数据与场景建模', '评测与应用落地', '多模态融合', '可解释性与安全'],
    gaps: [
      '现有方法在真实场景下泛化能力不足',
      '关键影响因素缺乏统一的建模范式',
      '缺少面向应用的标准化评测基准',
    ],
    conclusion: `围绕「${clean}」，现有研究尚未形成成熟方案，从方法创新、场景建模到应用落地均存在可探索的研究空白。`,
    directions: [
      {
        id: 'dir-01',
        code: '方向 01',
        title: '面向核心瓶颈的方法创新',
        subtitle: 'Method Innovation for Core Bottlenecks',
        ratings: { researchValue: 4, innovationSpace: 4, dataAvailability: 4, experimentDifficulty: 3 },
        description: `针对「${clean}」中的关键技术瓶颈，提出新的建模与求解方法，并在公开数据集上验证相对 SOTA 的增益。`,
        keyChallenges: ['关键瓶颈的数学形式化刻画', '新方法与既有 SOTA 的公平对比', '方法的可复现性'],
        breakthroughPoint: '引入领域先验约束与自适应机制，在保持通用性的同时突破现有方法的性能上限。',
        recommendedDataset: '领域公开数据集 + 自采补充数据',
        recommendedModels: ['领域 SOTA 基线', '融合先验的新架构', '消融对比实验'],
        expectedImpact: '在标准基准上取得显著指标提升，形成方法论文的完整叙事。',
        tags: ['方法创新', 'SOTA 对比', '基准评测'],
      },
      {
        id: 'dir-02',
        code: '方向 02',
        title: '真实场景驱动的数据与建模',
        subtitle: 'Real-Scenario Data & Modeling',
        ratings: { researchValue: 4, innovationSpace: 4, dataAvailability: 4, experimentDifficulty: 4 },
        description: `围绕「${clean}」的真实应用场景，构建贴合实际的数据集与评测流程，解决领域数据稀缺、噪声与分布偏移问题。`,
        keyChallenges: ['领域数据的获取与脱敏', '长尾与极端场景覆盖', '数据质量的可控性'],
        breakthroughPoint: '设计数据增强与领域自适应策略，使模型在分布外场景下保持稳健。',
        recommendedDataset: '领域公开集 + 合作方脱敏数据',
        recommendedModels: ['数据增强流水线', '领域自适应模型', '稳健性评测框架'],
        expectedImpact: '形成可复用的领域数据集与基准，支撑后续工程化落地。',
        tags: ['场景建模', '数据工程', '领域自适应'],
      },
      {
        id: 'dir-03',
        code: '方向 03',
        title: '可解释性与应用落地验证',
        subtitle: 'Interpretability & Application Validation',
        ratings: { researchValue: 3, innovationSpace: 3, dataAvailability: 4, experimentDifficulty: 3 },
        description: `针对「${clean}」的落地需求，研究模型决策的可解释性与可靠性，完成从实验到应用的验证闭环。`,
        keyChallenges: ['决策过程的可解释呈现', '系统可靠性与容错设计', '与实际工作流的集成'],
        breakthroughPoint: '构建端到端可解释分析链路，量化模型在关键决策上的依据与置信度。',
        recommendedDataset: '业务场景实际数据 + 专家标注',
        recommendedModels: ['可解释分析模块', '置信度与告警机制', '端到端集成原型'],
        expectedImpact: '产出可落地原型与评估报告，为产品化决策提供依据。',
        tags: ['可解释性', '落地验证', '产品化'],
      },
    ],
  }
}

// ============================================================================
// 后续节点通用演示数据构建器（literature → insight → coding → experiment →
// data-agent → archive → reviewer → final-paper）
// ============================================================================

export interface SelectPayload {
  topicId: string
  topic: string
  isGeneric: boolean
}

const cleanTopic = (p: SelectPayload) => p.topic.replace(/[?？\s]+$/, '')

// ---- literature-agent：文献调研 -------------------------------------------------

export interface LiteratureItem {
  id: string
  title: string
  venue: string
  year: number
  citations: number
  relevance: number
  contribution: string
  tags: string[]
}

export const LITERATURE_LIB: Record<string, LiteratureItem[]> = {
  'ev-charging': [
    {
      id: 'lit-1',
      title: 'Physics-Informed Neural ODE for Extreme Weather EV Charging Load Forecasting',
      venue: 'IEEE Trans. Smart Grid',
      year: 2023,
      citations: 148,
      relevance: 98,
      contribution: '将低温电化学阻抗机理融入神经 ODE，构建极端天气鲁棒的负荷预测体系。',
      tags: ['极端天气', 'PINN-ODE'],
    },
    {
      id: 'lit-2',
      title: 'Spatio-Temporal Graph WaveNet for City-Wide EV Charging Demand',
      venue: 'Applied Energy',
      year: 2022,
      citations: 320,
      relevance: 95,
      contribution: '时空图卷积建模充电站网络负荷传播，奠定 STGNN 基线范式。',
      tags: ['时空图', '负荷传播'],
    },
    {
      id: 'lit-3',
      title: 'Causal Inference for Dynamic Tariff Response of Charging Behavior',
      venue: 'Nature Energy',
      year: 2024,
      citations: 86,
      relevance: 92,
      contribution: '解耦电价干预与内生出行需求的因果效应，揭示价格引导的双向反馈。',
      tags: ['因果推断', '动态电价'],
    },
    {
      id: 'lit-4',
      title: 'Meta-STGNN: Cross-City Transfer Learning with Graph Prompt Tuning',
      venue: 'NeurIPS',
      year: 2023,
      citations: 115,
      relevance: 90,
      contribution: '元学习 + 图提示微调，实现充电负荷预测的跨城市冷启动迁移。',
      tags: ['迁移学习', '冷启动'],
    },
  ],
  'medical-hallucination': [
    {
      id: 'lit-1',
      title: 'Evidence-Chain Grounded RAG for Reliable Clinical Question Answering',
      venue: 'JAMIA',
      year: 2023,
      citations: 132,
      relevance: 96,
      contribution: '提出证据路径图可解释模块，将临床答案回溯至可验证证据链。',
      tags: ['RAG', '证据链'],
    },
    {
      id: 'lit-2',
      title: 'Confidence Calibration and Uncertainty Quantification in Medical LLMs',
      venue: 'npj Digital Medicine',
      year: 2024,
      citations: 88,
      relevance: 93,
      contribution: '系统评估医疗大模型置信度失真，提出选择性回答机制。',
      tags: ['置信度校准', '不确定性'],
    },
    {
      id: 'lit-3',
      title: 'Benchmarking Medical LLMs: Factuality, Safety and Clinical Adoption',
      venue: 'Nature Medicine',
      year: 2024,
      citations: 201,
      relevance: 95,
      contribution: '构建覆盖多科室的可信评测基准与医生双盲评测协议。',
      tags: ['评测基准', '双盲评测'],
    },
  ],
  'molecule-gnn': [
    {
      id: 'lit-1',
      title: 'Equiformer: Equivariant Graph Attention Transformer for Molecular Properties',
      venue: 'ICLR',
      year: 2023,
      citations: 240,
      relevance: 94,
      contribution: 'SE(3) 等变注意力机制，显著提升分子性质预测精度。',
      tags: ['等变网络', '3D 表征'],
    },
    {
      id: 'lit-2',
      title: 'MACE: Higher Order Equivariant Message Passing with Efficient Reuse',
      venue: 'NeurIPS',
      year: 2022,
      citations: 380,
      relevance: 92,
      contribution: '高阶等变消息传递，兼顾精度与计算效率。',
      tags: ['消息传递', '力场'],
    },
    {
      id: 'lit-3',
      title: 'Uni-Mol: A Universal 3D Molecular Representation Learning Framework',
      venue: 'ICLR',
      year: 2023,
      citations: 320,
      relevance: 96,
      contribution: '大规模 3D 构象预训练，下游任务通用适配。',
      tags: ['分子预训练', '3D 构象'],
    },
  ],
  'solid-state-battery': [
    {
      id: 'lit-1',
      title: 'Interphase Engineering in All-Solid-State Batteries: A Critical Review',
      venue: 'Advanced Materials',
      year: 2023,
      citations: 156,
      relevance: 95,
      contribution: '系统梳理固-固界面中间层设计与失效机制。',
      tags: ['界面工程', '中间层'],
    },
    {
      id: 'lit-2',
      title: 'Space-Charge Layer Effects at Solid-Solid Electrolyte Interfaces',
      venue: 'Nature Reviews Materials',
      year: 2024,
      citations: 118,
      relevance: 90,
      contribution: '从原子尺度阐明空间电荷层对界面阻抗的贡献。',
      tags: ['空间电荷层', '阻抗'],
    },
    {
      id: 'lit-3',
      title: 'Multi-Scale Simulation of Solid-State Battery Interface Degradation',
      venue: 'Energy & Environmental Science',
      year: 2023,
      citations: 96,
      relevance: 88,
      contribution: 'DFT-MD-相场跨尺度联动建模界面退化过程。',
      tags: ['多尺度模拟', '退化'],
    },
  ],
}

const GENERIC_LITERATURE: LiteratureItem[] = [
  {
    id: 'lit-1',
    title: 'A Comprehensive Survey on Recent Advances in the Research Area',
    venue: '领域顶级期刊',
    year: 2023,
    citations: 210,
    relevance: 94,
    contribution: '全景式梳理领域方法演进与主要技术路线。',
    tags: ['综述', '领域全景'],
  },
  {
    id: 'lit-2',
    title: 'State-of-the-Art Approach: A Benchmark Study',
    venue: '领域顶级会议',
    year: 2024,
    citations: 96,
    relevance: 92,
    contribution: '提出当前 SOTA 方法并建立公开基准评测。',
    tags: ['SOTA', '基准'],
  },
  {
    id: 'lit-3',
    title: 'Addressing Key Bottlenecks: A Novel Perspective',
    venue: '领域权威期刊',
    year: 2024,
    citations: 74,
    relevance: 90,
    contribution: '针对领域关键瓶颈提出创新解决思路，指出开放问题。',
    tags: ['创新方法', '开放问题'],
  },
]

export function buildLiteratureData(p: SelectPayload) {
  const items = p.isGeneric
    ? GENERIC_LITERATURE
    : (LITERATURE_LIB[p.topicId] ?? GENERIC_LITERATURE)
  return {
    topic: cleanTopic(p),
    totalScanned: p.isGeneric ? 186 : 1263,
    coreSelected: items.length,
    items,
  }
}

// ---- research-insight：研究洞察 -------------------------------------------------

export interface InsightData {
  hotSpots: string[]
  gaps: string[]
  conclusion: string
  suggestions: { title: string; desc: string; tags: string[] }[]
}

export function buildInsightData(p: SelectPayload): InsightData {
  const base = p.isGeneric
    ? buildGenericDirections(p.topic)
    : (DIRECTIONS_BY_TOPIC[p.topicId] ?? buildGenericDirections(p.topic))
  const d0 = base.directions[0]
  return {
    hotSpots: base.hotSpots,
    gaps: base.gaps,
    conclusion: base.conclusion,
    suggestions: [
      { title: '推荐数据集', desc: d0.recommendedDataset, tags: ['数据'] },
      { title: '推荐方法 / 模型', desc: d0.recommendedModels.join('  /  '), tags: ['方法'] },
      { title: 'Baseline 对照', desc: 'LSTM / GRU / Transformer / GNN / 领域 SOTA 基线', tags: ['对比'] },
      { title: '评估指标', desc: 'MAE / RMSE / MAPE / R² / 消融实验与显著性检验', tags: ['评测'] },
    ],
  }
}

// ---- coding-agent：代码生成 -----------------------------------------------------

export interface CodingFile {
  name: string
  desc: string
  lang: string
  code: string
}

export interface CodingData {
  files: CodingFile[]
  runLogs: string[]
}

export function buildCodingData(p: SelectPayload): CodingData {
  const t = cleanTopic(p)
  return {
    files: [
      {
        name: 'data_pipeline.py',
        desc: '数据加载与预处理',
        lang: 'python',
        code: `# -*- coding: utf-8 -*-
"""${t} — 数据流水线"""
import pandas as pd
import numpy as np

RAW_PATH = "data/raw.csv"
OUT_PATH = "data/processed.parquet"

def load_raw() -> pd.DataFrame:
    df = pd.read_csv(RAW_PATH)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    return df

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    df = df.sort_values("timestamp")
    df = df.dropna(subset=["feature", "target"])
    df["feature_scaled"] = (df["feature"] - df["feature"].mean()) / df["feature"].std()
    return df

if __name__ == "__main__":
    raw = load_raw()
    proc = preprocess(raw)
    proc.to_parquet(OUT_PATH)
    print(f"[pipeline] 原始 {len(raw)} 条 → 有效 {len(proc)} 条")`,
      },
      {
        name: 'model.py',
        desc: '模型定义（SOTA 基线 + 改进网络）',
        lang: 'python',
        code: `# -*- coding: utf-8 -*-
"""${t} — 模型定义"""
import torch
import torch.nn as nn

class ImprovedModel(nn.Module):
    def __init__(self, input_dim: int = 16, hidden_dim: int = 64):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.1),
        )
        self.head = nn.Linear(hidden_dim, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        h = self.encoder(x)
        return self.head(h)

def build_model(ckpt: str | None = None) -> nn.Module:
    model = ImprovedModel()
    if ckpt:
        model.load_state_dict(torch.load(ckpt, map_location="cpu"))
    return model`,
      },
      {
        name: 'train_eval.py',
        desc: '训练与评估脚本',
        lang: 'python',
        code: `# -*- coding: utf-8 -*-
"""${t} — 训练与评估"""
import torch
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from data_pipeline import load_raw, preprocess
from model import build_model

def train(epochs: int = 50, lr: float = 1e-3) -> dict:
    model = build_model()
    opt = torch.optim.Adam(model.parameters(), lr=lr)
    loss_fn = nn.MSELoss()  # noqa: F821
    for ep in range(epochs):
        # ... 训练循环（略）
        pass
    return {"epochs": epochs, "best_metric": 0.921}

def evaluate(y_true, y_pred) -> dict:
    return {
        "MAE": mean_absolute_error(y_true, y_pred),
        "RMSE": mean_squared_error(y_true, y_pred, squared=False),
        "R2": r2_score(y_true, y_pred),
    }

if __name__ == "__main__":
    report = train()
    print(f"[train] {report}")`,
      },
    ],
    runLogs: [
      '> conda activate nova-agent && pip install -r requirements.txt',
      'Collecting torch ... (done)',
      'Collecting pandas / numpy / sklearn ... (done)',
      '> python data_pipeline.py',
      '[pipeline] 原始 128,640 条 → 有效 125,673 条',
      '> python train_eval.py',
      'Epoch 50/50  loss=0.0082  val_MAE=0.042',
      '[eval] MAE=0.042 RMSE=0.071 R²=0.921',
      '✓ 代码已生成并通过运行验证',
    ],
  }
}

// ---- experiment-reproduction：实验复现 -------------------------------------------

export interface BaselineRow {
  model: string
  category: string
  strength: string
  weakness: string
}

export function buildExperimentData(p: SelectPayload) {
  return {
    topic: cleanTopic(p),
    baselines: [
      { model: 'LSTM', category: '时序基线', strength: '实现简单，长序列时序建模稳健', weakness: '无法建模空间依赖与突发事件' },
      { model: 'GRU', category: '时序基线', strength: '参数量小、训练快', weakness: '表达能力弱于 Transformer' },
      { model: 'Transformer', category: '注意力基线', strength: '长程依赖捕捉能力强', weakness: '对噪声敏感、易过拟合' },
      { model: 'GNN', category: '图网络基线', strength: '显式建模实体间关系', weakness: '构图质量依赖先验知识' },
      { model: 'STGNN', category: 'SOTA 基线', strength: '时空联合建模，性能领先', weakness: '计算开销大、调参复杂' },
    ],
    results: [
      { model: 'LSTM', score: 0.086, verdict: '对齐' },
      { model: 'GRU', score: 0.081, verdict: '对齐' },
      { model: 'Transformer', score: 0.072, verdict: '对齐' },
      { model: 'GNN', score: 0.066, verdict: '对齐' },
      { model: 'STGNN', score: 0.058, verdict: '对齐' },
    ],
    report:
      '5 组基线全部复现成功，指标与论文报告对齐（误差 < 2%），实验环境与代码已完整归档，可重复执行。',
  }
}

// ---- data-agent：数据分析 ----------------------------------------------------------

export interface DataField {
  name: string
  type: string
  desc: string
}

export interface StatCard {
  label: string
  value: string
  sub: string
}

export interface BarItem {
  label: string
  value: number
  color: string
}

export function buildDataAnalysisData(p: SelectPayload) {
  return {
    topic: cleanTopic(p),
    fields: [
      { name: 'timestamp', type: 'datetime', desc: '采样时间戳（15min 粒度）' },
      { name: 'station_id', type: 'categorical', desc: '站点 / 单元标识' },
      { name: 'target', type: 'numeric', desc: '观测目标值（待预测）' },
      { name: 'feature_a', type: 'numeric', desc: '外部驱动特征（气象 / 价格 / 客流）' },
      { name: 'feature_b', type: 'numeric', desc: '环境特征（温度 / 湿度 / 电量）' },
    ],
    stats: [
      { label: '样本总量', value: '128,640', sub: '按 15min 粒度 × 120 天' },
      { label: '缺失率', value: '2.3%', sub: '已通过插值修复' },
      { label: '异常样本', value: '37', sub: '已标记并剔除' },
      { label: '均值 / 峰值', value: '0.52', sub: '标准化后目标分布' },
    ],
    bars: [
      { label: '工作日', value: 78, color: 'bg-blue-500' },
      { label: '周末', value: 92, color: 'bg-indigo-500' },
      { label: '极端天气', value: 65, color: 'bg-rose-500' },
    ],
    findings: [
      '目标值在工作日 / 周末存在显著组间差异（p < 0.01）',
      '极端天气条件下样本方差扩大 2.1 倍，长尾风险显著',
      '目标与 feature_a 呈强相关（r = 0.82），建议纳入模型',
      '原始数据分布右偏，经 Box-Cox 变换后近似正态',
    ],
  }
}

// ---- experiment-result：结果归档 ---------------------------------------------------

export interface ArchiveItem {
  title: string
  desc: string
  meta: string
  icon: 'database' | 'chart' | 'code' | 'flask' | 'gauge' | 'target'
}

export function buildArchiveData(p: SelectPayload): { topic: string; items: ArchiveItem[] } {
  return {
    topic: cleanTopic(p),
    items: [
      { title: '实验数据', desc: '清洗后的训练 / 测试集，含 5 组基线输出', meta: '12.6 MB · CSV', icon: 'database' },
      { title: '结果图表', desc: '训练曲线、误差分布与对比柱状图', meta: '8 张 · PNG', icon: 'chart' },
      { title: '实验代码', desc: '可复现脚本与运行环境配置（requirements）', meta: '3 文件 · Python', icon: 'code' },
      { title: '研究方法', desc: '完整方法描述与参数设置记录', meta: 'Markdown', icon: 'flask' },
      { title: '评估指标', desc: 'MAE / RMSE / R² 与显著性检验报告', meta: '1 份 · JSON', icon: 'gauge' },
      { title: '结论摘要', desc: '与论文报告的对比结论与复现声明', meta: 'Markdown', icon: 'target' },
    ],
  }
}

// ---- paper-reviewer：论文评审 ---------------------------------------------------------

export interface ReviewComment {
  id: string
  text: string
}

export interface ReviewScore {
  label: string
  value: number
  hint: string
}

export function buildReviewData(p: SelectPayload) {
  return {
    topic: cleanTopic(p),
    comments: [
      {
        id: 'R1',
        text: '创新点表述清晰，但与文献 [8] 的方法差异说明不足，建议补充技术对比表以凸显增量贡献。',
      },
      {
        id: 'R2',
        text: '实验部分建议补充极端 / 长尾场景的鲁棒性分析，并给出基线选择的理论依据。',
      },
      {
        id: 'R3',
        text: '数据与代码已提供可复现仓库，建议补充随机种子与超参数敏感性分析。',
      },
    ],
    scores: [
      { label: '创新性', value: 92, hint: '明确优于现有方法' },
      { label: '方法严谨性', value: 88, hint: '建议补充对比表' },
      { label: '实验充分性', value: 90, hint: '覆盖多场景评估' },
      { label: '写作规范', value: 85, hint: '少量语言润色' },
    ],
    verdict: '小修后录用 · 审稿周期 42 天 · 修改意见 3 条已闭环',
  }
}

// ---- final-paper：最终论文 -------------------------------------------------------------

export interface PaperData {
  title: string
  authors: string
  abstract: string
  outline: { no: string; title: string; desc: string }[]
  references: string[]
}

export function buildPaperData(p: SelectPayload): PaperData {
  const t = cleanTopic(p)
  return {
    title: `面向「${t}」的 Agent 协同研究与实验验证`,
    authors: 'Nova Research Agent 协同工作组（导师指导）',
    abstract:
      `本研究围绕「${t}」展开全链路自动化研究：由 Research Agent 完成方向研判，Literature Agent 完成文献调研，` +
      'Coding Agent 生成实验代码并完成复现，Data Agent 完成数据清洗与分析，最终在 Reviewer Agent 多轮评审后形成本文。' +
      '实验结果表明，所提方法在多个公开基准上优于现有 SOTA，为领域提供了可复现、可扩展的研究范式。',
    outline: [
      { no: '1', title: '引言', desc: '研究背景与问题定义' },
      { no: '2', title: '相关工作', desc: '文献调研与研究空白定位' },
      { no: '3', title: '方法论', desc: 'Agent 协同流水线与核心方法' },
      { no: '4', title: '实验设计', desc: '数据集、基线与评估指标' },
      { no: '5', title: '实验结果', desc: '定量对比与消融实验' },
      { no: '6', title: '讨论', desc: '局限性与未来方向' },
      { no: '7', title: '结论', desc: '研究贡献总结' },
    ],
    references: [
      'Doe et al. A Comprehensive Survey, 2023',
      'Smith & Lee. State-of-the-Art Benchmark, 2024',
      'Wang et al. Novel Approach for Bottlenecks, 2024',
      'Chen et al. Multi-Agent Research Workflow, 2025',
    ],
  }
}

// ---- 节点 → Demo 注册表 ----------------------------------------------------

export interface NodeDemoEntry {
  nodeId: string
  ready: boolean
  label: string
  title?: string
  subtitle?: string
}

export const NODE_DEMOS: Record<string, NodeDemoEntry> = {
  'research-question': {
    nodeId: 'research-question',
    ready: true,
    label: '演示此环节',
    title: '起点 · 一个科研问题',
    subtitle: '输入一个问题，看 Research Agent 如何将它拆解为可研究的方向',
  },
  'research-agent': {
    nodeId: 'research-agent',
    ready: true,
    label: '演示此环节',
    title: 'Research Agent · 自动编排',
    subtitle: '输入问题，看 Research Agent 如何编排多 Agent 判断方向与研究空白',
  },
  'literature-agent': {
    nodeId: 'literature-agent',
    ready: true,
    label: '演示此环节',
    title: 'Literature Agent · 文献调研',
    subtitle: '看 Agent 如何从 1,263 篇论文中检索、筛选、阅读并输出文献清单',
  },
  'research-insight': {
    nodeId: 'research-insight',
    ready: true,
    label: '演示此环节',
    title: 'Research Insight · 研究洞察',
    subtitle: '看 Agent 如何基于文献结论识别研究热点、定位空白并给出实验建议',
  },
  'coding-agent': {
    nodeId: 'coding-agent',
    ready: true,
    label: '演示此环节',
    title: 'Coding Agent · 代码生成',
    subtitle: '看 Agent 如何把实验方案自动写成可运行的 Python 代码工程',
  },
  'experiment-reproduction': {
    nodeId: 'experiment-reproduction',
    ready: true,
    label: '演示此环节',
    title: '实验复现 · 自动跑通',
    subtitle: '看 Agent 如何构建环境、执行实验脚本并与论文基线逐项比对',
  },
  'data-agent': {
    nodeId: 'data-agent',
    ready: true,
    label: '演示此环节',
    title: 'Data Agent · 数据分析',
    subtitle: '看 Agent 如何识别字段、清洗数据、统计分析并生成可视化报告',
  },
  'experiment-result': {
    nodeId: 'experiment-result',
    ready: true,
    label: '演示此环节',
    title: '实验结果 · 归档整理',
    subtitle: '看 Agent 如何汇总实验结果，把数据、图表与代码归档为素材库',
  },
  'paper-reviewer': {
    nodeId: 'paper-reviewer',
    ready: true,
    label: '演示此环节',
    title: 'Reviewer Agent · 论文评审',
    subtitle: '看 Agent 如何模拟同行评审，输出审稿意见、评分与修改闭环',
  },
  'final-paper': {
    nodeId: 'final-paper',
    ready: true,
    label: '演示此环节',
    title: '最终论文 · 成稿输出',
    subtitle: '看 Agent 如何整合全链路成果，输出结构化论文终稿',
  },
  // ---- 内容增长工作台 · 爆款工厂（content-creator） ----
  'cc-start': {
    nodeId: 'cc-start',
    ready: true,
    label: '打开工作台',
    title: '起点 · 一个内容增长需求',
    subtitle: '输入一个内容增长需求，打开爆款工厂工作台，从爆款雷达开始',
  },
  'viral-radar': {
    nodeId: 'viral-radar',
    ready: true,
    label: '演示此环节',
    title: '爆款雷达 · 全网热点监测',
    subtitle: '看热点探针 Agent 如何抓取全网爆款、24h 风口与赛道排行',
  },
  'content-dissect': {
    nodeId: 'content-dissect',
    ready: true,
    label: '演示此环节',
    title: '内容拆解 · 爆文一键拆解',
    subtitle: '粘贴爆款链接，看心智透视 Agent 如何六维拆解出可复制的创作配方',
  },
  'smart-topics': {
    nodeId: 'smart-topics',
    ready: true,
    label: '演示此环节',
    title: '智能选题 · 高带货选题生成',
    subtitle: '看选题创意 Agent 如何基于爆款因子批量生成带评估的选题方案',
  },
  'content-generation': {
    nodeId: 'content-generation',
    ready: true,
    label: '演示此环节',
    title: '内容生成 · AI 一键成稿',
    subtitle: '看神笔马良 Agent 如何批量产出标题、正文、标签与封面建议',
  },
  'reply-conversion': {
    nodeId: 'reply-conversion',
    ready: true,
    label: '演示此环节',
    title: '回复转化 · 评论私信成交闭环',
    subtitle: '看流量闭环 Agent 如何生成话术包并演练抗拒点应答',
  },
  'content-diagnostics': {
    nodeId: 'content-diagnostics',
    ready: true,
    label: '演示此环节',
    title: '内容诊断 · 数据体检与增长规划',
    subtitle: '录入核心数据，看体检诊断 Agent 如何定位短板并给出增长路径',
  },
  'asset-library': {
    nodeId: 'asset-library',
    ready: true,
    label: '演示此环节',
    title: '素材沉淀 · 内容资产库',
    subtitle: '看拆解、选题、成稿与话术如何统一沉淀为团队复用资产',
  },
  'cc-studio': {
    nodeId: 'cc-studio',
    ready: true,
    label: '演示此环节',
    title: '工作台 · Agent 协作与团队管理',
    subtitle: '看 6 大内容 Agent 实时协作、终端日志与团队管控',
  },
  'cc-end': {
    nodeId: 'cc-end',
    ready: true,
    label: '查看成果',
    title: '终点 · 持续爆款增长',
    subtitle: '从爆款监测到数据诊断的内容增长闭环已就绪',
  },
  // ---- AI 投标顾问 · 投标作战指挥台（bid-consultant） ----
  'bid-start': {
    nodeId: 'bid-start',
    ready: true,
    label: '打开工作台',
    title: '起点 · 一份招标文件',
    subtitle: '上传或选择一份招标文件，打开投标作战指挥台，从项目概览开始',
  },
  'tender-analysis': {
    nodeId: 'tender-analysis',
    ready: true,
    label: '演示此环节',
    title: '招标解析 Agent · 项目概览',
    subtitle: '看 Agent 如何自动提取预算、评标方式、时间节点与核心竞争点',
  },
  'qualification-check': {
    nodeId: 'qualification-check',
    ready: true,
    label: '演示此环节',
    title: '资格预审 Agent · 逐条核对',
    subtitle: '看 Agent 如何核对资质、业绩、人员与财务要求并标记风险',
  },
  'risk-scan': {
    nodeId: 'risk-scan',
    ready: true,
    label: '演示此环节',
    title: '废标风险 Agent · 红线识别',
    subtitle: '看 Agent 如何识别高/中/低三级废标红线并给出规避动作',
  },
  'score-breakdown': {
    nodeId: 'score-breakdown',
    ready: true,
    label: '演示此环节',
    title: '评分拆解 Agent · 得分测算',
    subtitle: '看 Agent 如何拆解评分项并测算预计得分与提分空间',
  },
  'score-strategy': {
    nodeId: 'score-strategy',
    ready: true,
    label: '演示此环节',
    title: '得分策略 Agent · 四档战术',
    subtitle: '看 Agent 如何输出必过项、核心得分项、差距项与加分项战术',
  },
  'capability-matrix': {
    nodeId: 'capability-matrix',
    ready: true,
    label: '演示此环节',
    title: '能力匹配 Agent · 实力矩阵',
    subtitle: '看 Agent 如何比对招标要求与企业实力并输出差距补强建议',
  },
  'combat-tasks': {
    nodeId: 'combat-tasks',
    ready: true,
    label: '演示此环节',
    title: '作战任务 Agent · 投标拆解',
    subtitle: '看 Agent 如何把投标拆解为责任人、截止时间明确的作战任务',
  },
  'proposal-writer': {
    nodeId: 'proposal-writer',
    ready: true,
    label: '演示此环节',
    title: '技术标撰写 Agent · 章节成稿',
    subtitle: '看 Agent 如何生成技术标章节大纲并逐章 AI 撰写示范正文',
  },
  'health-check': {
    nodeId: 'health-check',
    ready: true,
    label: '演示此环节',
    title: '标书体检 Agent · 封标终审',
    subtitle: '看 Agent 如何模拟评标专家做标书健康度评分与 Top10 问题闭环',
  },
  'bid-report': {
    nodeId: 'bid-report',
    ready: true,
    label: '查看成果',
    title: '终点 · AI 投标作战报告',
    subtitle: '一页纸投标作战决策报告：建议参与 / 谨慎参与 / 不建议参与',
  },
  // ---- 环保 AI 员工矩阵 · 8 大岗位工作台（env-agent） ----
  'env-start': {
    nodeId: 'env-start',
    ready: true,
    label: '打开工作台',
    title: '起点 · 一个环保业务需求',
    subtitle: '输入一个环保业务需求，打开 AI 员工全景驾驶舱，从 8 大岗位开始',
  },
  'env-sales': {
    nodeId: 'env-sales',
    ready: true,
    label: '演示此环节',
    title: 'AI环保销售员 · 商机捕获',
    subtitle: '客户一段话口语诉求 45 秒推演成客户画像、工艺方案与破冰话术',
  },
  'env-bid': {
    nodeId: 'env-bid',
    ready: true,
    label: '演示此环节',
    title: 'AI环保投标经理 · 投标作战',
    subtitle: '200 页环保标书 3 分钟拆解评分、扫描废标红线并生成技术方案大纲',
  },
  'env-compliance': {
    nodeId: 'env-compliance',
    ready: true,
    label: '演示此环节',
    title: 'AI环保合规官 · 合规风控',
    subtitle: '上传环评 / 排污许可 / 监测 / 危废台账，3 分钟穿透式合规体检',
  },
  'env-monitoring': {
    nodeId: 'env-monitoring',
    ready: true,
    label: '演示此环节',
    title: 'AI环境监测分析师 · 监测诊断',
    subtitle: '对 30 天时序监测数据多因子归因，提前 8 小时预警超标并输出调控处方',
  },
  'env-waste': {
    nodeId: 'env-waste',
    ready: true,
    label: '演示此环节',
    title: 'AI危废管理助手 · 危废管理',
    subtitle: '核验危废八位代码、计算库龄、排查混存，守住危废刑事合规底线',
  },
  'env-permit': {
    nodeId: 'env-permit',
    ready: true,
    label: '演示此环节',
    title: 'AI排污许可助手 · 排污申报',
    subtitle: '匹配行业技术规范、构建治理拓扑，2 分钟就绪申报路线与核算底稿',
  },
  'env-reporter': {
    nodeId: 'env-reporter',
    ready: true,
    label: '演示此环节',
    title: 'AI环保报告员 · 报告编制',
    subtitle: '多源 Excel 自动核算并按标准模板 1 分钟生成执行报告，一键导出',
  },
  'env-operations': {
    nodeId: 'env-operations',
    ready: true,
    label: '演示此环节',
    title: 'AI环保企业经营助手 · 经营驾驶',
    subtitle: '穿透销售 / 项目 / 财务数据，输出老板每周一页决策看板与必办 5 件事',
  },
  'env-end': {
    nodeId: 'env-end',
    ready: true,
    label: '查看成果',
    title: '终点 · AI 员工矩阵业务闭环',
    subtitle: '8 位 AI 员工接力完成从商机捕获到经营驾驶的环保业务闭环',
  },
  // ---- AI 贸易情报员 · 外贸客户与商机雷达（trade-intel） ----
  'trade-start': {
    nodeId: 'trade-start',
    ready: true,
    label: '打开工作台',
    title: '起点 · 一次外贸情报任务',
    subtitle: '输入产品与目标市场，打开 AI 贸易情报工作台，从需求输入页开始',
  },
  'trade-crawl': {
    nodeId: 'trade-crawl',
    ready: true,
    label: '演示此环节',
    title: '全网采集 Agent · 智能采集清洗',
    subtitle: '看 AI 如何一句话启动 142 口岸全网抓取、清洗去重并补全企业画像',
  },
  'trade-customers': {
    nodeId: 'trade-customers',
    ready: true,
    label: '演示此环节',
    title: '客户情报 Agent · 情报矩阵',
    subtitle: '看五维评分如何把全网企业拆成 A/B/C 级并输出画像与跟进动作',
  },
  'trade-suppliers': {
    nodeId: 'trade-suppliers',
    ready: true,
    label: '演示此环节',
    title: '供应商寻源 Agent · 多维比选',
    subtitle: '看 AI 如何按认证 / 交期 / 价格优势对供应商打标比选并输出档案',
  },
  'trade-market': {
    nodeId: 'trade-market',
    ready: true,
    label: '演示此环节',
    title: '市场情报 Agent · 区域研判',
    subtitle: '看区域机会指数、政策解读与进入壁垒如何生成市场优先级判断',
  },
  'trade-competitors': {
    nodeId: 'trade-competitors',
    ready: true,
    label: '演示此环节',
    title: '竞品情报 Agent · 突围洞察',
    subtitle: '看竞品多维对比矩阵如何产出成本 / 交期 / 定制错位打法弹药',
  },
  'trade-radar': {
    nodeId: 'trade-radar',
    ready: true,
    label: '演示此环节',
    title: '商机雷达 Agent · 实时商机',
    subtitle: '看 7x24 全网扫描如何把碎片情报整理成可直接跟进的商机卡',
  },
  'trade-end': {
    nodeId: 'trade-end',
    ready: true,
    label: '查看成果',
    title: '终点 · 情报到成单闭环',
    subtitle: '从需求输入到全网情报研判与商机跟进的获客闭环已就绪',
  },
  // ---- AI 跨境电商选品情报员 · 选品情报工作台（ecom-intel） ----
  'ecom-start': {
    nodeId: 'ecom-start',
    ready: true,
    label: '打开工作台',
    title: '起点 · 一句话选品需求',
    subtitle: '输入市场/品类/预算与目标毛利，打开 AI 选品情报工作台，从需求输入页开始',
  },
  'ecom-execution': {
    nodeId: 'ecom-execution',
    ready: true,
    label: '演示此环节',
    title: 'AI 检索与多源采集 Agent · 全网扫描',
    subtitle: '看 12 步检索流水线如何扫描 1,286 款在售品 × 382 竞品 × 12,846 条评论',
  },
  'ecom-market': {
    nodeId: 'ecom-market',
    ready: true,
    label: '演示此环节',
    title: '市场情报 Agent · 大盘透视',
    subtitle: '看站点类目热度、机会指数与高潜子类目如何自动研判',
  },
  'ecom-competitor': {
    nodeId: 'ecom-competitor',
    ready: true,
    label: '演示此环节',
    title: '竞品雷达 Agent · 竞品拆解',
    subtitle: '看竞品价格带/差评软肋对比如何产出错位打法弹药',
  },
  'ecom-consumer': {
    nodeId: 'ecom-consumer',
    ready: true,
    label: '演示此环节',
    title: '买家洞察 Agent · 需求提炼',
    subtitle: '看 12,846 条差评如何归因成可执行的改良需求清单',
  },
  'ecom-supplier': {
    nodeId: 'ecom-supplier',
    ready: true,
    label: '演示此环节',
    title: '供应链 Agent · 工厂匹配',
    subtitle: '看产业带供应商如何按认证/MOQ/交期/单价智能比对',
  },
  'ecom-profit': {
    nodeId: 'ecom-profit',
    ready: true,
    label: '演示此环节',
    title: '利润测算 Agent · 利润模型',
    subtitle: '看全成本单件 P&L 与月销四档敏感度、年化 ROI 如何联动测算',
  },
  'ecom-report': {
    nodeId: 'ecom-report',
    ready: true,
    label: '查看成果',
    title: '终点 · 爆款选品报告',
    subtitle: '从一句话需求到机会排行榜与立项行动清单的选品闭环已就绪',
  },
  // ---- AI 知识产权顾问 · 知识产权分析工作台（ip-counsel） ----
  'ip-start': {
    nodeId: 'ip-start',
    ready: true,
    label: '打开工作台',
    title: '起点 · 一句话知产体检需求',
    subtitle: '输入产品/目标市场与主要竞对，打开 AI 知识产权顾问工作台，从需求输入页开始',
  },
  'ip-execution': {
    nodeId: 'ip-execution',
    ready: true,
    label: '演示此环节',
    title: 'AI 多智能体协同 Agent · 全链路执行',
    subtitle: '看 12 步知产体检流水线如何检索 12,846 件专利、识别风险与机会',
  },
  'ip-search': {
    nodeId: 'ip-search',
    ready: true,
    label: '演示此环节',
    title: '专利检索 Agent · 全球专利语义检索',
    subtitle: '看全球专利库如何被语义检索并初筛 1,286 相关 / 328 高相关专利',
  },
  'ip-overview': {
    nodeId: 'ip-overview',
    ready: true,
    label: '演示此环节',
    title: '专利分析 Agent · 风险与机会总览',
    subtitle: '看 8 项高风险与 17 个布局机会如何在总览页一屏透视',
  },
  'ip-competitor': {
    nodeId: 'ip-competitor',
    ready: true,
    label: '演示此环节',
    title: '竞品情报 Agent · 2D 攻防地图',
    subtitle: '看 23 家竞品如何落位 8 大技术分支攻防矩阵并深潜 8 家重点企业',
  },
  'ip-risk': {
    nodeId: 'ip-risk',
    ready: true,
    label: '演示此环节',
    title: '侵权风险 Agent · 白盒权利要求比对',
    subtitle: '看白盒技术特征比对如何锁定 8 项高危侵权与 FTO 建议',
  },
  'ip-layout': {
    nodeId: 'ip-layout',
    ready: true,
    label: '演示此环节',
    title: '布局建议 Agent · 四层金字塔布局',
    subtitle: '看四层防御-进攻布局路线与 17 个专利空白机会的落地清单',
  },
  'ip-report': {
    nodeId: 'ip-report',
    ready: true,
    label: '查看成果',
    title: '终点 · 知识产权战略报告',
    subtitle: '从一句话需求到给高管的知产风险地图与行动清单闭环已就绪',
  },
}

// Demo 完成后流转到的下一节点 id（终点无下一节点）
export const NEXT_NODE_BY_ID: Record<string, string> = {
  'research-question': 'research-agent',
  'research-agent': 'coding-agent',
  'literature-agent': 'research-insight',
  'research-insight': 'coding-agent',
  'coding-agent': 'experiment-reproduction',
  'experiment-reproduction': 'data-agent',
  'data-agent': 'experiment-result',
  'experiment-result': 'paper-reviewer',
  'paper-reviewer': 'final-paper',
  'final-paper': '',
  // 内容增长工作台
  'cc-start': 'viral-radar',
  'viral-radar': 'content-dissect',
  'content-dissect': 'smart-topics',
  'smart-topics': 'content-generation',
  'content-generation': 'reply-conversion',
  'reply-conversion': 'content-diagnostics',
  'content-diagnostics': 'asset-library',
  'asset-library': 'cc-studio',
  'cc-studio': 'cc-end',
  'cc-end': '',
  // AI 投标顾问
  'bid-start': 'tender-analysis',
  'tender-analysis': 'qualification-check',
  'qualification-check': 'risk-scan',
  'risk-scan': 'score-breakdown',
  'score-breakdown': 'score-strategy',
  'score-strategy': 'capability-matrix',
  'capability-matrix': 'combat-tasks',
  'combat-tasks': 'proposal-writer',
  'proposal-writer': 'health-check',
  'health-check': 'bid-report',
  'bid-report': '',
  // AI 跨境电商选品情报员
  'ecom-start': 'ecom-execution',
  'ecom-execution': 'ecom-market',
  'ecom-market': 'ecom-competitor',
  'ecom-competitor': 'ecom-consumer',
  'ecom-consumer': 'ecom-supplier',
  'ecom-supplier': 'ecom-profit',
  'ecom-profit': 'ecom-report',
  'ecom-report': '',
  // AI 知识产权顾问
  'ip-start': 'ip-execution',
  'ip-execution': 'ip-search',
  'ip-search': 'ip-overview',
  'ip-overview': 'ip-competitor',
  'ip-competitor': 'ip-risk',
  'ip-risk': 'ip-layout',
  'ip-layout': 'ip-report',
  'ip-report': '',
}
