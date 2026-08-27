// ============================================================================
// research-agent 节点 Demo 数据层
//
// 内容：
//  1. 类型定义（与参考 demo `ai-research-agent/src/types.ts` 保持一致）
//  2. EV 充电负荷预测全量演示数据（参考 demo `defaultResearchData.ts` 移植）
//  3. 5 个 Agent 初始状态 + Agent 间通讯消息
//  4. 其余预置主题（医疗 / 分子 / 固态电池）与自由输入的模板化生成器
// ============================================================================

// ----------------------------------------------------------------------------
// 类型定义
// ----------------------------------------------------------------------------

export type AgentRole = 'orchestrator' | 'literature' | 'analysis' | 'coding' | 'reviewer'

export type AgentStatusType = 'waiting' | 'running' | 'completed' | 'error'

export interface AgentLogEntry {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'process' | 'warning'
}

export interface AgentInfo {
  id: AgentRole
  name: string
  enName: string
  role: string
  iconName: string
  status: AgentStatusType
  currentTask: string
  progress: number
  completedTasks: string[]
  logs: AgentLogEntry[]
}

export interface InterAgentMessage {
  id: string
  from: AgentRole
  to: AgentRole
  content: string
  timestamp: string
  artifactType?: 'literature_packet' | 'gap_matrix' | 'baseline_code' | 'review_score'
}

export interface StarRating {
  researchValue: number // 1-5
  innovationSpace: number // 1-5
  dataAvailability: number // 1-5
  experimentDifficulty: number // 1-5
}

export interface ResearchOpportunity {
  id: string
  code: string
  title: string
  subtitle: string
  ratings: StarRating
  description: string
  keyChallenges: string[]
  breakthroughPoint: string
  recommendedDataset: string
  recommendedModels: string[]
  expectedImpact: string
  tags: string[]
}

export interface RecommendedScheme {
  researchQuestion: string
  hypothesis: string
  baselineModels: Array<{
    name: string
    category: string
    strength: string
    weakness: string
  }>
  addedVariables: Array<{
    name: string
    category: string
    importance: string
    source: string
  }>
  evaluations: Array<{
    metric: string
    fullName: string
    description: string
    targetValue: string
  }>
  technicalRoadmap: Array<{
    step: string
    title: string
    methods: string
  }>
}

export interface ReportSection {
  number: number
  title: string
  enTitle: string
  summary: string
  content: string
  highlights?: string[]
}

export interface ResearchReport {
  title: string
  subtitle: string
  generatedDate: string
  authors: string[]
  abstract: string
  sections: ReportSection[]
  references: Array<{
    id: number
    title: string
    authors: string
    venue: string
    year: number
    doi?: string
  }>
}

export interface LiteratureItem {
  id: string
  title: string
  authors: string
  venue: string
  year: number
  citations: number
  relevanceScore: number
  coreContribution: string
  limitations: string
  bibtex: string
  tags: string[]
}

export interface ExperimentSchemeDetail {
  title: string
  datasetPreprocessing: string[]
  ablationStudies: Array<{
    component: string
    baselineSetup: string
    proposedSetup: string
    expectedOutcome: string
  }>
  hyperparameters: Array<{
    param: string
    range: string
    defaultVal: string
  }>
  hardwareRequirement: string
}

export interface CodingExperimentDetail {
  framework: string
  pythonVersion: string
  files: Array<{
    filename: string
    language: string
    description: string
    code: string
  }>
}

export interface MilestoneItem {
  stage: string
  duration: string
  objective: string
  deliverables: string[]
  status: 'pending' | 'in_progress' | 'completed'
}

export interface ResearchAnalysisData {
  topic: string
  opportunities: ResearchOpportunity[]
  recommendedScheme: RecommendedScheme
  report: ResearchReport
  literatureList: LiteratureItem[]
  experimentDetail: ExperimentSchemeDetail
  codingDetail: CodingExperimentDetail
  milestones: MilestoneItem[]
}

// ----------------------------------------------------------------------------
// 5 个 Agent 初始状态（与参考 demo `App.tsx` INITIAL_AGENTS 保持一致）
// ----------------------------------------------------------------------------

export const INITIAL_AGENTS: Record<AgentRole, AgentInfo> = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Research Agent',
    enName: 'Lead Orchestrator',
    role: '顶层科学问题拆解、多智能体协同调度与报告综合定稿',
    iconName: 'Cpu',
    status: 'completed',
    currentTask: '全局任务协调已完成，生成 9 章节学术研究机会报告',
    progress: 100,
    completedTasks: [
      '科学问题降维与多模态变量抽取',
      '跨 Agent 任务分发与拓扑路由',
      '学术白皮书章节整合与最终定稿',
    ],
    logs: [
      { timestamp: '09:12:01', message: '收到课题输入，启动 Nova 认知推理内核', type: 'info' },
      { timestamp: '09:12:03', message: '拆解为 4 项子课题，向专业 Agent 分发调度指令', type: 'process' },
      { timestamp: '09:12:15', message: '汇总多智能体产出物，完成报告 9 大章节编排', type: 'success' },
    ],
  },
  literature: {
    id: 'literature',
    name: 'Literature Agent',
    enName: 'Literature Reviewer',
    role: 'ArXiv/IEEE/Nature 权威数据库检索、引用关联挖掘与文献树聚类',
    iconName: 'BookOpen',
    status: 'completed',
    currentTask: '已检索 142 篇高水平文献，提取三大技术演进阶段',
    progress: 100,
    completedTasks: [
      'ArXiv/IEEE 142 篇相关文献语义检索与过滤',
      '时空图神经网络 (ST-GNN) 演进路线图谱提取',
      '文献引用网络与 BibTeX 数据集构建',
    ],
    logs: [
      { timestamp: '09:12:04', message: '挂载 IEEE Xplore 与 ArXiv API 数据源', type: 'info' },
      { timestamp: '09:12:06', message: '检索关键词: EV Load Forecasting, Weather Resilience, Spatio-Temporal', type: 'process' },
      { timestamp: '09:12:09', message: '筛选出 4 篇顶级精读论文，打包传递给 Analysis Agent', type: 'success' },
    ],
  },
  analysis: {
    id: 'analysis',
    name: 'Analysis Agent',
    enName: 'Gap & Trend Analyst',
    role: '前沿研究热点聚类、传统模型局限性诊断与 3 大研究空白识别',
    iconName: 'LineChart',
    status: 'completed',
    currentTask: '完成 3 大关键科研空白 (Research Gaps) 形式化识别',
    progress: 100,
    completedTasks: [
      '传统时序模型三大局限性诊断',
      '极端天气与动态电价双向反馈热点图谱分析',
      '提炼 3 个高价值 Research Opportunity 矩阵',
    ],
    logs: [
      { timestamp: '09:12:08', message: '接收文献包，执行潜在狄利克雷分布 (LDA) 聚类', type: 'info' },
      { timestamp: '09:12:11', message: '定位核心空白：极端天气物理降额机制断裂、电价因果内生性缺失', type: 'process' },
      { timestamp: '09:12:13', message: '完成 3 大方向 5 星级价值与可行性打分', type: 'success' },
    ],
  },
  coding: {
    id: 'coding',
    name: 'Coding Agent',
    enName: 'Experimental Architect',
    role: '5 大基准模型构建、PyTorch 核心创新网络编写与消融实验设计',
    iconName: 'Code2',
    status: 'completed',
    currentTask: '完成 WeatherCausalSTGNN 模型编写与消融实验矩阵设计',
    progress: 100,
    completedTasks: [
      '5 大基线模型 (LSTM, GRU, Transformer, GNN, ST-GCN) 架构配置',
      'Arrhenius 动力电池物理机理损失函数实现',
      '端到端 PyTorch 数据流水线与学术评估脚本编写',
    ],
    logs: [
      { timestamp: '09:12:10', message: '构建 PyTorch 实验环境脚手架', type: 'info' },
      { timestamp: '09:12:12', message: '编写自适应图拓扑与物理信息损失算子', type: 'process' },
      { timestamp: '09:12:14', message: '完成 3 项消融对照实验 (Ablation Matrix) 规格定义', type: 'success' },
    ],
  },
  reviewer: {
    id: 'reviewer',
    name: 'Reviewer Agent',
    enName: 'Peer Review & Feasibility Auditor',
    role: '审稿人视角同行评议、数据可获得性审查与 12 周科研计划排期',
    iconName: 'ShieldCheck',
    status: 'completed',
    currentTask: '完成可行性风险审查与 12 周博士级科研排期规划',
    progress: 100,
    completedTasks: [
      '气象空间分辨率失配与长尾不平衡风险预警',
      '方案可行性审查评级: 96/100 (顶会立项推荐)',
      '12 周 4 阶段科研甘特图与可交付成果规划',
    ],
    logs: [
      { timestamp: '09:12:11', message: '以 IEEE Transactions 审稿标准审查技术路线', type: 'info' },
      { timestamp: '09:12:13', message: '提示长尾极端天气样本不平衡风险，提出 Focal Loss 解决方案', type: 'warning' },
      { timestamp: '09:12:15', message: '综合评分 96 分，通过可行性把关', type: 'success' },
    ],
  },
}

// ----------------------------------------------------------------------------
// Agent 间通讯消息（与参考 demo `App.tsx` INITIAL_MESSAGES 保持一致）
// ----------------------------------------------------------------------------

export const INITIAL_MESSAGES: InterAgentMessage[] = [
  {
    id: 'm1',
    from: 'orchestrator',
    to: 'literature',
    content: '指令分发：启动全网 IEEE/ArXiv 文献挖掘，重点提取时空建模与气象敏感性文献。',
    timestamp: '09:12:03',
  },
  {
    id: 'm2',
    from: 'literature',
    to: 'analysis',
    content: '文献检索完成：共清洗对齐 142 篇核心成果，已打包传输文献演化树。',
    timestamp: '09:12:08',
    artifactType: 'literature_packet',
  },
  {
    id: 'm3',
    from: 'analysis',
    to: 'coding',
    content: '空白识别确认：确立“极端天气物理降额 + 动态电价因果解耦”为突破主攻方向。',
    timestamp: '09:12:11',
    artifactType: 'gap_matrix',
  },
  {
    id: 'm4',
    from: 'coding',
    to: 'reviewer',
    content: '实验平台就绪：已配置 5 类 Baseline 对照组，并完成 WeatherCausalSTGNN 架构定义。',
    timestamp: '09:12:14',
    artifactType: 'baseline_code',
  },
  {
    id: 'm5',
    from: 'reviewer',
    to: 'orchestrator',
    content: '可行性审查通过：评分 96/100，提出极端样本长尾损失加权建议，输出 12 周科研排期。',
    timestamp: '09:12:15',
    artifactType: 'review_score',
  },
]

// ----------------------------------------------------------------------------
// 预置科研课题（与参考 demo PRESET_TOPICS 保持一致）
// ----------------------------------------------------------------------------

export const PRESET_TOPICS = [
  '新能源汽车充电负荷预测还有哪些值得研究的方向？',
  '大语言模型在医疗诊断中的幻觉抑制与可信临床决策机制',
  '图神经网络在小分子药物性质预测中的泛化与外推能力研究',
  '全固态锂电池固-固界面离子传输动力学与阻抗退化机理优化',
]

// ----------------------------------------------------------------------------
// EV 充电负荷预测全量演示数据（参考 demo `defaultResearchData.ts` 原文移植）
// ----------------------------------------------------------------------------

export const EV_CHARGING_DATA: ResearchAnalysisData = {
  topic: '新能源汽车充电负荷预测还有哪些值得研究的方向？',
  opportunities: [
    {
      id: 'opp-01',
      code: '方向 01',
      title: '极端天气条件下的城市级充电负荷预测',
      subtitle: 'Extreme Weather & Climate Resilient EV Load Forecasting',
      ratings: {
        researchValue: 5,
        innovationSpace: 4,
        dataAvailability: 4,
        experimentDifficulty: 3,
      },
      description:
        '研究台风、寒潮暴雪、持续高温等极端气象突变对电池充放电特性、用户出行取消率及应急充电需求的级联非线性影响，构建具有气象鲁棒性的多尺度时空图神经网络预测体系。',
      keyChallenges: [
        '极端天气样本极度稀缺（长尾分布），模型容易发生过拟合与分布漂移',
        '低温下电池BMS充电功率主动降额，与用户热管理耗电形成复合强非线性耦合',
        '极端事件导致道路积水封路，充电负荷在城市微电网节点间发生剧烈空间重路由',
      ],
      breakthroughPoint:
        '引入物理引导的神经微分方程 (Physics-Informed Neural ODE) 融合锂电低温电化学阻抗机理，结合物理扩散注意力机制建模负荷空间迁移。',
      recommendedDataset: 'NOAA-NCEI 气象公开集 + Caltech ACN Data (Adaptive Charging Network) + 某直辖市 120,000 桩日级时序脱敏数据',
      recommendedModels: ['PINN-ODE', 'Spatio-Temporal Graph WaveNet', 'Diffusion Probabilistic Forecasting'],
      expectedImpact: '提升极端天气期间城市电网调度弹性，降低 38% 的局部配电变压器过载风险。',
      tags: ['极端天气', '物理信息神经网络', '时空鲁棒性', '电网韧性'],
    },
    {
      id: 'opp-02',
      code: '方向 02',
      title: '动态电价与充电行为联合预测',
      subtitle: 'Joint Forecasting of Dynamic Tariffs and Elastic Charging Behavior',
      ratings: {
        researchValue: 4,
        innovationSpace: 5,
        dataAvailability: 3,
        experimentDifficulty: 4,
      },
      description:
        '将电网分时/实时电价机制与车主价格弹性、排队博弈及目的地吸引力模型联立，解决“价格引导-聚集充电-引发新负荷峰值”的双向反馈环路预测难题。',
      keyChallenges: [
        '电价信号与负荷响应存在非平稳双向因果环路，传统单向时间序列回归失效',
        '不同类型车主（网约车/私家车/物流轻卡）的价格敏感度异质性显著且动态演化',
        '高保真微观行为数据（如充电APP下单与比价行为）存在隐私壁垒与数据稀疏性',
      ],
      breakthroughPoint:
        '基于多智能体双层强化学习 (MARL) 与反事实因果推断 (Causal Inference) 框架，解耦电价干预与内生出行需求的因果效应。',
      recommendedDataset: 'CAISO LMP 实时边际电价数据 + Austin Pecan Street EV 行为实测集 + 滴滴/高德出行OD出行分布矩阵',
      recommendedModels: ['Causal-Informer', 'Multi-Agent Bi-level Game Network', 'Neural Propensity Matching'],
      expectedImpact: '揭示峰谷电价反弹效应机制，为电力现货市场下充电商需求响应 (Demand Response) 策略提供理论支撑。',
      tags: ['博弈论', '因果推断', '动态电价', '双向反馈'],
    },
    {
      id: 'opp-03',
      code: '方向 03',
      title: '多城市充电负荷迁移学习',
      subtitle: 'Cross-City Transfer Learning & Domain Adaptation for EV Load',
      ratings: {
        researchValue: 4,
        innovationSpace: 4,
        dataAvailability: 4,
        experimentDifficulty: 4,
      },
      description:
        '针对新兴中小城市充电桩新建初期历史监测数据严重匮乏的“冷启动”痛点，利用成熟一线大城市的丰富源域数据向目标城市进行空间结构与行为表征迁移。',
      keyChallenges: [
        '不同城市在路网密度、车辆保有渗透率、公共交通结构上存在强烈的域偏移 (Domain Shift)',
        '地理空间图的拓扑异构性导致跨图图神经网络无法直接对齐节点特征',
        '如何在无目标城市精细充电历史的情况下提取通用潜在充电模式',
      ],
      breakthroughPoint:
        '跨城市图对比元学习 (Meta-Graph Contrastive Learning) 与时空解耦注意力表征，基于城市元特征（POI分布、人口热力）完成即插即用迁移。',
      recommendedDataset: '北京/上海/深圳开放充电桩监测数据集 (源域) + 3个三线新建试点城市 30 天样本 (目标域冷启动)',
      recommendedModels: ['Meta-STGNN', 'Domain Adversarial Spatial Transformer', 'Graph Prompt Tuning'],
      expectedImpact: '将新规划充电站所在片区的负荷预测误差冷启动周期从 6 个月缩短至 3 天，降低数据采集成本 80% 以上。',
      tags: ['迁移学习', '图元学习', '冷启动预测', '跨域泛化'],
    },
  ],
  recommendedScheme: {
    researchQuestion:
      '极端天气、动态电价与城市空间结构共同作用下，新能源汽车充电负荷能否实现更准确的短期预测？',
    hypothesis:
      '融合电化学物理降额方程、因果价格弹性以及空间拓扑扩散的时空解耦架构，相较于纯数据驱动基准模型，可在长尾极端日将预测 RMSE 降低 25% 以上，并具备跨区域泛化能力。',
    baselineModels: [
      {
        name: 'LSTM',
        category: '循环神经网络',
        strength: '擅长捕捉单节点充电负荷的长时序依赖关系，训练稳定',
        weakness: '完全忽略充电站之间的空间拓扑关联与路网车流交互',
      },
      {
        name: 'GRU',
        category: '门控循环单元',
        strength: '参数量少，推理延迟低，适合边缘计算桩端部署',
        weakness: '无法直接建模跨节点外部多模态协变量（天气/电价突变）',
      },
      {
        name: 'Transformer',
        category: '自注意力机制',
        strength: '具备全序列全局注意力建模能力，擅长捕捉周期性（日/周/节假日）',
        weakness: '二次方复杂度计算开销高，对突发极端长尾事件泛化稳定性欠缺',
      },
      {
        name: 'GNN',
        category: '图神经网络',
        strength: '通过路网邻接矩阵与空间距离显式传递邻域充电站负荷波动',
        weakness: '静态图结构难以捕捉车流实时动态重路由引起的动态空间关联',
      },
      {
        name: 'ST-GCN / Informer',
        category: '时空联合深度模型',
        strength: '时空双维度同步联合建模，当前时序预测领域代表性 SOTA 基准',
        weakness: '黑盒特征提取缺乏物理机理约束，在突发极端气象下存在违背物理规律的预测震荡',
      },
    ],
    addedVariables: [
      {
        name: '温度 (Temperature)',
        category: '气象物理量',
        importance: '直接影响动力电池可用容量、充电功率上限及空调热负荷耗电',
        source: '气象站逐小时地面温度 / ERA5 再分析数据集',
      },
      {
        name: '降雨 (Precipitation)',
        category: '气象物理量',
        importance: '引发道路通行速度下降、网约车里程激增及路边慢充需求转移',
        source: '降雨雷达多普勒反射率 / 气象监测 API',
      },
      {
        name: '节假日 (Holiday & Event)',
        category: '日历与政策',
        importance: '重塑出行 OD 分布，商业区与高速服务区充电负荷出现结构性翻倍',
        source: '国家法定节假日与区域大型文体活动公开日志',
      },
      {
        name: '动态电价 (Dynamic Tariffs)',
        category: '经济博弈信号',
        importance: '峰谷电价差驱动出租车与网约车集中在低谷时段涌入充电场站',
        source: '电力交易中心分时电价实时广播',
      },
      {
        name: '充电站空间结构 (Station Spatial Topology)',
        category: '地理路网与设施',
        importance: '周边 3km POI 密度、快慢桩比例、道路通达性决定基础负荷上限',
        source: 'OpenStreetMap 路网图 + 充电桩地理空间坐标',
      },
    ],
    evaluations: [
      {
        metric: 'MAE',
        fullName: 'Mean Absolute Error (平均绝对误差)',
        description: '反映预测值与真实功率负荷的绝对偏差偏离度，单位为 kW/MW',
        targetValue: '< 4.2 kW (单站) / < 2.1% (全网)',
      },
      {
        metric: 'RMSE',
        fullName: 'Root Mean Squared Error (均方根误差)',
        description: '对大误差赋予更高惩罚权重，重点监控极端突变峰值预测稳定性',
        targetValue: '< 6.8 kW (单站) / < 3.5% (全网)',
      },
      {
        metric: 'MAPE',
        fullName: 'Mean Absolute Percentage Error (平均绝对百分比误差)',
        description: '无量纲相对误差百分比，方便不同容量场站之间进行公平对比',
        targetValue: '< 5.4%',
      },
      {
        metric: 'R² Score',
        fullName: 'Coefficient of Determination (拟合优度系数)',
        description: '衡量模型对负荷序列真实方差变异的解释比例',
        targetValue: '> 0.945',
      },
      {
        metric: 'Peak-ER',
        fullName: 'Peak Error Ratio (尖峰时刻误差比率)',
        description: '针对每日最高负荷时段及极端天气骤增时段的专项可靠性指标',
        targetValue: '< 4.1%',
      },
    ],
    technicalRoadmap: [
      {
        step: 'Step 1: 多源数据对齐与物理特征工程',
        title: '气象-电价-时空负荷张量构建',
        methods: '构建 15 分钟粒度对齐张量，基于 Arrhenius 方程嵌入电池温度降额特征先验。',
      },
      {
        step: 'Step 2: 动态因果图构建',
        title: '时空动态依赖与因果解耦',
        methods: '使用基于注意力的可学习图邻接矩阵 (Adaptive Graph Structure)，配合因果干预模块解耦电价引导效应。',
      },
      {
        step: 'Step 3: 物理引导的时空神经网络训练',
        title: 'PINN-STGNN 架构优化',
        methods: '设计包含物理能量守恒损失的复合损失函数 (L_total = L_MSE + λ*L_physics + γ*L_causal)。',
      },
      {
        step: 'Step 4: 跨域迁移与对比消融验证',
        title: '极端样本压力测试与多基准评估',
        methods: '在 2021-2025 历史极端寒潮/台风事件中进行留出回测验证，并与 5 类 Baseline 严格对比。',
      },
    ],
  },
  report: {
    title: '《新能源汽车充电负荷预测研究机会分析》',
    subtitle: 'Comprehensive Research Opportunity and Methodology Analysis Report for EV Charging Load Forecasting',
    generatedDate: '2026-08-26',
    authors: ['Nova Research Agent Core', 'Literature Agent', 'Analysis Agent', 'Reviewer Agent'],
    abstract:
      '随着全球新能源汽车渗透率快速突破 40%，大规模随机无序充电对城市配电网造成了显著的负荷冲击。本报告由 Nova AI Research Agent 团队针对“新能源汽车充电负荷预测”前沿方向进行系统化拆解与多智能体协同评估。报告剖析了传统单节点时序模型在多维外部冲击下的局限性，识别出极端天气响应滞后、电价行为双向因果闭环以及新城冷启动跨域迁移三大关键研究空白，并提出了融合物理先验与时空动态图神经网络的旗舰研究方案与实验蓝图。',
    sections: [
      {
        number: 1,
        title: '研究背景',
        enTitle: 'Research Background & Motivation',
        summary: '新型电力系统转型与新能源汽车高渗透率背景下的负荷预测痛点。',
        content: `近年来，新能源汽车（EV）产业迎来爆发式增长。然而，由于动力电池充电功率高（超充桩单枪功率达 360kW-600kW）、用户充电时空随机性大，局部电网“峰上加峰”现象日益严重。
根据最新行业调研，城市级充电负荷不仅受历史充电习惯影响，更深度耦合了微观气象条件、实时电力市场价格信号以及城市交通路网拥堵态势。传统的宏观统计学方法（ARIMA、指数平滑）与通用深度学习时序模型（LSTM、GRU）在应对多源异构变量扰动与突发长尾事件时，预测误差往往飙升至 20% 以上，极易诱发配电网局部过载与越限安全事故。因此，探索新一代兼具物理机理可解释性与时空泛化能力的充电负荷预测模型，已成为电力系统与智能交通交叉学科的迫切需求。`,
        highlights: ['超充技术普及加剧电网瞬态冲击', '多维外部环境强耦合特征突出', '传统模型在极端长尾工况下精度严重衰减'],
      },
      {
        number: 2,
        title: '文献现状',
        enTitle: 'State of the Art Literature Review',
        summary: '梳理 2020-2026 年间主流顶会与高水平期刊的三大技术演化流派。',
        content: `通过 Literature Agent 对 IEEE Trans on Smart Grid, Applied Energy, Nature Energy, NeurIPS, KDD 等领域的 142 篇高水平文献检索与聚类分析，现有研究主要可划分为三个阶段：
1. **单站点纯时间序列预测阶段 (2018-2021)**：主要采用 LSTM、Bi-LSTM、Seq2Seq 配合注意力机制对单个充电场站或单台变压器负荷进行日前/超短期预测。代表性成果在平稳日常工况下取得了较好拟合，但缺乏对邻近场站负荷溢出效应的捕捉能力。
2. **时空图神经网络 (ST-GNN) 融合阶段 (2021-2024)**：研究者将城市道路网络或电网拓扑抽象为图结构，采用 ST-GCN、Graph WaveNet、ASTGCN 等架构，显式建模空间邻近与时序演变。该阶段显著提升了区域协同预测能力。
3. **大模型与多模态预训练探索阶段 (2024-至今)**：结合时序大模型 (Time Series Foundation Models, 如 Time-LLM, MOIRAI) 引入天气与文本语义特征。但现有工作多停留在通用特征堆叠，缺乏对电化学机理与经济学博弈规律的内在嵌入。`,
        highlights: ['经历了从单站点到时空图、再到多模态大模型的演变', '图结构建模已成为空间关联挖掘的标准范式', '当前研究普遍存在“重算法架构、轻物理因果”的瓶颈'],
      },
      {
        number: 3,
        title: '研究热点',
        enTitle: 'Emerging Research Hotspots',
        summary: '高频关键词聚类与前沿热点图谱分析。',
        content: `Analysis Agent 的热点演进图谱表明，当前学术界与工业界关注焦点高度聚焦在以下四个方向：
- **空间动态依赖性建模 (Dynamic Spatial Dependency)**：从静态距离矩阵转向由车流实时轨迹自适应生成的动态图结构 (Dynamic Graph Topology)。
- **微网与车网互动 (V2G & Microgrid Integration)**：从单向充电负荷预测扩展为兼具反向放电潜力的“充放电净负荷 (Net Load)”联合预测。
- **不确定性量化与概率预测 (Probabilistic Forecasting)**：从点预测 (Point Forecast) 升级为基于分位数回归、扩散模型 (Diffusion Model) 的预测置信区间估计，服务于电网备用容量决策。
- **边缘算力桩端协同 (Edge-Cloud Collaborative Inference)**：针对海量边缘充电桩算力受限问题，探索轻量化紧凑网络与模型压缩。`,
        highlights: ['动态拓扑替代静态图成为共识', '概率预测与置信区间需求显著上升', '端云协同与轻量化部署备受关注'],
      },
      {
        number: 4,
        title: '研究空白',
        enTitle: 'Identified Research Gaps',
        summary: '直击现有研究尚未充分解决的三大关键空白。',
        content: `通过对顶会审稿要点与实际应用痛点的交叉对比，Reviewer Agent 确认了以下亟待突破的研究空白（Research Gaps）：
- **Gap 1: 极端天气物理机制与数据驱动割裂**：绝大多数模型仅将温度降雨作为数值标量输入全连接层，忽略了低温下电池极化电压升高导致的 BMS 恒功率充电曲线畸变，缺乏将电化学机理嵌入损失函数的尝试。
- **Gap 2: 动态电价反馈的因果内生性缺失**：现行研究将分时电价视作外生独立变量，忽略了电价调整引发车主群体性从众充电所产生的“二次涌浪负荷 (Secondary Surge Peak)”，缺少因果反事实推断机制。
- **Gap 3: 跨区域/新拓站点的冷启动泛化能力不足**：现有 SOTA 模型高度依赖目标区域数月以上的完备历史数据，当面对新建开发区或异构城市时，跨域特征对齐与知识迁移效果急剧下滑。`,
        highlights: ['物理先验与深度学习处于两张皮状态', '电价诱导负荷的双向反馈环路尚未解耦', '中小城市冷启动跨域泛化是产业落地最大绊脚石'],
      },
      {
        number: 5,
        title: '潜在研究方向',
        enTitle: 'Potential Research Directions',
        summary: '系统化提炼出的三大高价值创新方向对比。',
        content: `基于上述研究空白，系统提炼并评分出三大最具冲击力的研究方向：
1. **方向一：极端气象多尺度物理信息时空神经网络 (PINN-STGNN)**。核心研究极端冷热波次下的非线性负荷畸变，创新度与学术价值双高，具备明确的实际工程价值。
2. **方向二：基于因果强化学习的动态电价-充电行为双向博弈联合预测**。聚焦电力现货市场与聚合商日前报价策略，理论深度强，创新空间处于行业制高点。
3. **方向三：跨城市图对比元学习与无监督域自适应迁移预测**。主打冷启动与弱监督场景，适合发表具有工业级复用价值的方法论论文。`,
        highlights: ['三大方向覆盖了机理、博弈与迁移三大前沿分支', '在研究价值与实验可行性之间达成优异平衡'],
      },
      {
        number: 6,
        title: '推荐研究问题',
        enTitle: 'Recommended Research Question',
        summary: '精炼定稿的博士/硕士级高质量开题科学问题。',
        content: `综合考虑创新空间、数据可获取性与当前科研团队的资源边界，推荐将核心科学问题确立为：
**“极端天气、动态电价与城市空间结构共同作用下，新能源汽车充电负荷能否实现更准确的短期预测？”**
该问题的学术内涵包括：
- 科学命题 1：动力电池热管理机理与气象强扰动的物理约束如何数学化映射为神经网络的正则化算子？
- 科学命题 2：如何利用图结构学习自适应解耦车主在空间距离与经济激励（电价）之间的权衡决策函数？
- 科学命题 3：多源异构协变量输入下，模型对极值尖峰（Peak Load）的召回率与置信区间精度能否显著超越经典时空基准？`,
        highlights: ['科学问题界定清晰，符合顶刊立项与基金申报标准', '兼具理论突破深度与国家双碳战略应用导向'],
      },
      {
        number: 7,
        title: '实验设计',
        enTitle: 'Experimental Design & Technical Setup',
        summary: '基准模型选型、消融实验矩阵与评估基准体系。',
        content: `Coding Agent 为该研究问题制定了严密完备的对比实验方案：
- **基线模型 (Baselines)**：涵盖经典循环结构 (LSTM, GRU)、经典注意力架构 (Informer, PatchTST) 及图神经网络 (ST-GCN, GWNet)。
- **消融实验 (Ablation Studies)**：
  - *w/o Physics*：移除低温电池电化学物理正则项，检验极端天气下的预测稳定性；
  - *w/o Dynamic Graph*：将自适应动态图退化为静态距离图，检验车流时空扩散捕捉能力；
  - *w/o Causal Tariff*：将因果价格嵌入替换为普通全连接特征，验证价格反弹抑制效果。
- **数据集划分与回测**：选取近 3 年涵盖 2 次历史寒潮、1 次特大暴雨周的脱敏实测数据，采用 7:1:2 的时序不重叠滑动窗口切分。
- **评估指标**：MAE, RMSE, MAPE, R², Peak-ER 全方位考核均值与尖峰性能。`,
        highlights: ['涵盖 5 类主流基线模型与严格消融对照组', '专门设立极端天气留出测试集 (Holdout Test Set)', '指标兼顾工业验收要求与学术规范'],
      },
      {
        number: 8,
        title: '风险与挑战',
        enTitle: 'Feasibility Risks & Mitigation Strategies',
        summary: '实验推进过程中可能面临的瓶颈与规避预案。',
        content: `Reviewer Agent 提示以下实施风险并给出了应对策略：
1. **气象网格数据分辨率与充电站微观环境空间失配风险**：宏观 ERA5 气象数据分辨率为 0.25°，难以反映城市热岛效应。*应对策略*：引入站点周边 500m 级 POI 绿化率与建筑密度作为局部微气候修正系数。
2. **极端事件样本不平衡导致的梯度主导问题**：常态平稳日占 95% 以上。*应对策略*：采用加权 Focal Loss 或极值理论 (Extreme Value Theory) 损失加权，提升模型对尖峰误差的惩罚灵敏度。
3. **因果推断混杂因子的不可观测性**：*应对策略*：引入工具变量法 (Instrumental Variables, 如上游发电侧偶发停机电价跳变) 隔离纯外生变异。`,
        highlights: ['空间分辨率下采样预案健全', '长尾不平衡损失函数设计明确', '因果混杂风险具备针对性理论解法'],
      },
      {
        number: 9,
        title: '下一步建议',
        enTitle: 'Actionable Next Steps & Timeline',
        summary: '从数据准备到论文投递的四阶段工程落地排期。',
        content: `建议按照以下四个里程碑稳步推进本课题：
- **第 1-2 周 (数据清洗与特征构建)**：完成 NOAA 气象数据与公开充电站负荷的时间戳纳秒级对齐，编写多源 DataLoader。
- **第 3-5 周 (模型编码与 Baseline 复现)**：搭建 PyTorch 实验平台，完成 5 个 Baseline 模型的标准超参网格搜索，记录基准性能曲线。
- **第 6-8 周 (创新模型实现与消融验证)**：编写物理引导损失模块与动态图自适应模块，在极端天气测试集上完成多轮对比试验。
- **第 9-12 周 (论文撰写与开源准备)**：整理高清晰度矢量可视化图表，撰写 IEEE Transactions 格式论文初稿，并将核心代码整理至 GitHub 开源仓库。`,
        highlights: ['明确了 12 周标准学术研究迭代节奏', '每个阶段均设立明确的可交付物 (Deliverables)'],
      },
    ],
    references: [
      {
        id: 1,
        title: 'Physics-Informed Deep Learning for Electric Vehicle Charging Demand Prediction Under Extreme Climate Conditions',
        authors: 'Chen, L., Wang, Y., & Zhang, H.',
        venue: 'IEEE Transactions on Smart Grid, 14(3), 2154-2167',
        year: 2023,
        doi: '10.1109/TSG.2023.3289011',
      },
      {
        id: 2,
        title: 'Spatio-Temporal Graph WaveNet for City-Wide EV Charging Load Forecasting',
        authors: 'Wu, Z., Pan, S., Long, G., et al.',
        venue: 'Applied Energy, 312, 118742',
        year: 2022,
        doi: '10.1016/j.apenergy.2022.118742',
      },
      {
        id: 3,
        title: 'Causal Inference for Dynamic Electricity Pricing Response in Urban Charging Networks',
        authors: 'Liu, M., Sun, Q., & Alizadeh, M.',
        venue: 'Nature Energy, 9(2), 189-201',
        year: 2024,
        doi: '10.1038/s41560-024-01452-x',
      },
      {
        id: 4,
        title: 'Meta-STGNN: Cross-City Transfer Learning for Urban Traffic and Load Prediction',
        authors: 'Huang, X., Zhao, D., & Tan, C.',
        venue: 'NeurIPS 2023 Spotlight',
        year: 2023,
      },
      {
        id: 5,
        title: 'A Review on Electric Vehicle Load Profile Modelling and Forecasting Techniques in Distribution Networks',
        authors: 'Nour, M., Chaves-Ávila, J. P., Magdy, G., et al.',
        venue: 'Renewable and Sustainable Energy Reviews, 130, 109987',
        year: 2020,
      },
    ],
  },
  literatureList: [
    {
      id: 'lit-1',
      title: 'Physics-Informed Deep Learning for Electric Vehicle Charging Demand Prediction Under Extreme Climate Conditions',
      authors: 'Chen, L., Wang, Y., & Zhang, H.',
      venue: 'IEEE Transactions on Smart Grid (Top Journal, IF 9.6)',
      year: 2023,
      citations: 148,
      relevanceScore: 98,
      coreContribution: '首次将 Arrhenius 电池化学方程嵌入深度时序网络，显著修正了 -15℃ 低温下的充电时长预测偏差。',
      limitations: '仅验证了单站工况，未扩展至大规模城市级路网拓扑。',
      bibtex: `@article{chen2023physics,\n  title={Physics-Informed Deep Learning for EV Charging Under Extreme Climate},\n  author={Chen, L. and Wang, Y. and Zhang, H.},\n  journal={IEEE Transactions on Smart Grid},\n  volume={14},\n  pages={2154--2167},\n  year={2023}\n}`,
      tags: ['物理先验', '极端气象', 'IEEE TSG', '高引文献'],
    },
    {
      id: 'lit-2',
      title: 'Spatio-Temporal Graph WaveNet for City-Wide EV Charging Load Forecasting',
      authors: 'Wu, Z., Pan, S., Long, G., et al.',
      venue: 'Applied Energy (Top Journal, IF 11.2)',
      year: 2022,
      citations: 320,
      relevanceScore: 95,
      coreContribution: '提出了结合扩散图卷积与空洞因果卷积的时空自适应网络，成为近两年充电负荷基准主流。',
      limitations: '电价与天气仅作为辅助拼接标量，在价格阶梯变动时存在滞后震荡。',
      bibtex: `@article{wu2022spatio,\n  title={Spatio-Temporal Graph WaveNet for City-Wide EV Charging Load},\n  author={Wu, Z. and Pan, S. and Long, G.},\n  journal={Applied Energy},\n  volume={312},\n  pages={118742},\n  year={2022}\n}`,
      tags: ['时空图', 'Graph WaveNet', 'SOTA基准'],
    },
    {
      id: 'lit-3',
      title: 'Causal Inference for Dynamic Electricity Pricing Response in Urban Charging Networks',
      authors: 'Liu, M., Sun, Q., & Alizadeh, M.',
      venue: 'Nature Energy (顶级期刊, IF 56.7)',
      year: 2024,
      citations: 86,
      relevanceScore: 92,
      coreContribution: '利用工具变量法解耦了价格调整引发的反弹充电需求，建立了因果电价弹性响应矩阵。',
      limitations: '模型对算力要求极高，难以在毫秒级调度中实现超短期在线更新。',
      bibtex: `@article{liu2024causal,\n  title={Causal Inference for Dynamic Electricity Pricing in Charging Networks},\n  author={Liu, M. and Sun, Q. and Alizadeh, M.},\n  journal={Nature Energy},\n  volume={9},\n  pages={189--201},\n  year={2024}\n}`,
      tags: ['因果推断', '动态电价', 'Nature Energy'],
    },
    {
      id: 'lit-4',
      title: 'Cross-City Transfer Learning for Urban Spatio-Temporal Prediction via Meta-Graph Alignment',
      authors: 'Huang, X., Zhao, D., & Tan, C.',
      venue: 'NeurIPS 2023 Spotlight',
      year: 2023,
      citations: 115,
      relevanceScore: 90,
      coreContribution: '提出了基于节点原型对比学习的跨图结构对齐技术，解决了少样本目标城市的冷启动难题。',
      limitations: '主要针对交通流量测试，未考虑电力负荷特有的日内电网峰谷电价周期特征。',
      bibtex: `@inproceedings{huang2023cross,\n  title={Cross-City Transfer Learning for Urban Spatio-Temporal Prediction},\n  author={Huang, X. and Zhao, D. and Tan, C.},\n  booktitle={NeurIPS},\n  year={2023}\n}`,
      tags: ['迁移学习', '元学习', 'NeurIPS', '冷启动'],
    },
  ],
  experimentDetail: {
    title: '极端气象与多源时空因果网络 (Weather-Causal ST-GNN) 实验方案',
    datasetPreprocessing: [
      '时间戳对齐：将原始 1-min 充电桩功率上报流统一聚合为 15-min 均值时序窗口。',
      '异常值清洗：采用 3-Sigma 准则结合孤立森林 (Isolation Forest) 滤除断网与传感器故障脉冲。',
      '特征工程标准化：对负荷采用 MinMax 归一化，对气温与电价进行 Z-Score 缩放，增加 Sine/Cosine 周期时序编码。',
      '空间图构建：基于充电站大地坐标计算高斯核距离矩阵 A_dist，结合高德路网 OD 通行耗时计算动态连通图 A_traffic。',
    ],
    ablationStudies: [
      {
        component: 'Physics Battery Loss (物理电化学损失项)',
        baselineSetup: '纯 MSE 均方误差损失函数',
        proposedSetup: 'L_total = L_MSE + 0.15 * L_Arrhenius_Thermal',
        expectedOutcome: '在 -10℃ 以下寒潮测试集上，MAPE 预计从 11.4% 降低至 6.2%',
      },
      {
        component: 'Causal Price Attention (因果价格注意力模块)',
        baselineSetup: '直接将电价向量与负荷向量进行全连接 Concat',
        proposedSetup: '双通道倾向评分加权交叉注意力 (Propensity Cross-Attention)',
        expectedOutcome: '在峰谷电价跳变切换点，尖峰过冲误差 (Peak Overshoot) 降低 42%',
      },
      {
        component: 'Adaptive Spatio-Temporal Graph (自适应时空图)',
        baselineSetup: '固定的静态欧氏空间地理距离邻接矩阵',
        proposedSetup: '可学习节点嵌入矩阵 E_src @ E_dst^T 动态推断拓扑',
        expectedOutcome: '在跨站负荷溢出发生时，空间相关系数 R² 提升 0.08',
      },
    ],
    hyperparameters: [
      { param: 'History Sequence Length (历史窗口长度)', range: '12 ~ 96 步 (3h ~ 24h)', defaultVal: '48 (12小时)' },
      { param: 'Prediction Horizon (预测视界步长)', range: '4 ~ 48 步 (1h ~ 12h)', defaultVal: '16 (4小时)' },
      { param: 'GCN Layer Num (图卷积层数)', range: '2 ~ 5 层', defaultVal: '3 层' },
      { param: 'Learning Rate (初始学习率)', range: '1e-4 ~ 1e-2 (Cosine Annealing)', defaultVal: '0.001' },
      { param: 'Batch Size', range: '32 ~ 128', defaultVal: '64' },
      { param: 'Weight Decay (正则化衰减)', range: '1e-5 ~ 1e-3', defaultVal: '1e-4' },
    ],
    hardwareRequirement: 'NVIDIA RTX 4090 (24GB) 单卡即可满足全部 5 个基线模型与主模型的训练（单次收敛耗时约 45 分钟）。',
  },
  codingDetail: {
    framework: 'PyTorch 2.3 + PyTorch Geometric',
    pythonVersion: 'Python 3.11',
    files: [
      {
        filename: 'model.py',
        language: 'python',
        description: '核心预测模型架构：融合物理先验与自适应时空图的 WeatherCausalSTGNN',
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class AdaptiveGraphLearner(nn.Module):
    """自适应可学习空间拓扑推断模块"""
    def __init__(self, num_nodes, node_dim=32):
        super().__init__()
        self.node_emb1 = nn.Parameter(torch.randn(num_nodes, node_dim))
        self.node_emb2 = nn.Parameter(torch.randn(num_nodes, node_dim))

    def forward(self):
        # 计算节点潜在嵌入相似度并做 Softmax
        adj = F.softmax(F.relu(torch.mm(self.node_emb1, self.node_emb2.T)), dim=-1)
        return adj

class PhysicsInformedLoss(nn.Module):
    """动力电池低温 Arrhenius 充电功率衰减物理约束损失"""
    def __init__(self, alpha=0.15):
        super().__init__()
        self.alpha = alpha
        self.mse = nn.MSELoss()

    def forward(self, pred_load, true_load, ambient_temp):
        # 基础数据拟合损失
        mse_loss = self.mse(pred_load, true_load)

        # 物理机理惩罚：当温度低于 0℃ 时，单桩理论允许最大功率受锂电低温极化约束
        # P_max(T) = P_rated * exp(-Ea / (R * (T + 273.15)))
        p_rated = 120.0 # kW
        t_kelvin = ambient_temp + 273.15
        p_physical_max = p_rated * torch.clamp(torch.exp(-1200.0 / t_kelvin) * 2.5, max=1.0)

        # 违背物理上限时的单向超限惩罚
        violation = F.relu(pred_load - p_physical_max)
        physics_loss = torch.mean(violation ** 2)

        return mse_loss + self.alpha * physics_loss

class WeatherCausalSTGNN(nn.Module):
    def __init__(self, num_nodes, in_features=6, hidden_dim=64, out_steps=16):
        super().__init__()
        self.num_nodes = num_nodes
        self.out_steps = out_steps

        # 自适应图学习器
        self.graph_learner = AdaptiveGraphLearner(num_nodes)

        # 多模态特征嵌入 (负荷 + 温度 + 降雨 + 电价 + 节假日)
        self.feat_encoder = nn.Linear(in_features, hidden_dim)

        # 时空图卷积与时间自注意力
        self.temporal_gru = nn.GRU(hidden_dim, hidden_dim, batch_first=True, bidirectional=True)
        self.spatial_gcn = nn.Linear(hidden_dim * 2, hidden_dim)

        # 因果电价门控单元
        self.causal_gate = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.Sigmoid()
        )

        # 输出回归投影
        self.regressor = nn.Sequential(
            nn.Linear(hidden_dim, 64),
            nn.GELU(),
            nn.Linear(64, out_steps)
        )

    def forward(self, x, temp_tensor, price_tensor):
        # x: [Batch, Time_in, Nodes, Features]
        B, T, N, F_dim = x.shape

        # 1. 特征升维
        h = self.feat_encoder(x) # [B, T, N, Hidden]

        # 2. 空间图卷积
        adj = self.graph_learner() # [N, N]
        h_spatial = torch.einsum('nm,btmh->btnh', adj, h)

        # 3. 时间维度 GRU 编码
        h_spatial = h_spatial.permute(0, 2, 1, 3).reshape(B * N, T, -1) # [B*N, T, Hidden]
        gru_out, _ = self.temporal_gru(h_spatial) # [B*N, T, Hidden*2]
        h_temporal = self.spatial_gcn(gru_out[:, -1, :]) # 取最后一个时间步 [B*N, Hidden]

        # 4. 因果电价门控调节
        gate = self.causal_gate(h_temporal)
        h_refined = h_temporal * gate + h_temporal

        # 5. 投影到未来步长
        out = self.regressor(h_refined) # [B*N, out_steps]
        out = out.reshape(B, N, self.out_steps).permute(0, 2, 1) # [B, out_steps, Nodes]

        return out
`,
      },
      {
        filename: 'train.py',
        language: 'python',
        description: '模型训练与基线对比评估主脚本 (Training Pipeline)',
        code: `import torch
from torch.utils.data import DataLoader
from model import WeatherCausalSTGNN, PhysicsInformedLoss

def train_one_epoch(model, loader, optimizer, criterion, device):
    model.train()
    total_loss = 0.0
    for batch_idx, (x, y, temp, price) in enumerate(loader):
        x, y = x.to(device), y.to(device)
        temp, price = temp.to(device), price.to(device)

        optimizer.zero_grad()
        pred = model(x, temp, price)
        loss = criterion(pred, y, temp)
        loss.backward()

        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=5.0)
        optimizer.step()
        total_loss += loss.item()

    return total_loss / len(loader)

print("Nova AI Research Agent - Experiment Engine Initialized.")
print("Training WeatherCausalSTGNN against 5 Baselines (LSTM, GRU, Transformer, GNN, ST-GCN)...")
`,
      },
      {
        filename: 'eval_metrics.py',
        language: 'python',
        description: '学术评估指标计算 (MAE, RMSE, MAPE, Peak Error Ratio)',
        code: `import numpy as np

def calculate_metrics(y_true, y_pred, peak_percentile=95):
    """
    计算全面学术指标
    y_true, y_pred: numpy array of shape [Samples, Horizon, Nodes]
    """
    mae = np.mean(np.abs(y_true - y_pred))
    rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))

    # 避免零除保护
    mask = y_true > 1.0
    mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100.0

    # 尖峰时段专项误差 (Peak Error)
    peak_thresh = np.percentile(y_true, peak_percentile)
    peak_mask = y_true >= peak_thresh
    peak_er = np.mean(np.abs((y_true[peak_mask] - y_pred[peak_mask]) / y_true[peak_mask])) * 100.0

    return {
        "MAE (kW)": round(float(mae), 3),
        "RMSE (kW)": round(float(rmse), 3),
        "MAPE (%)": round(float(mape), 2),
        "Peak-ER (%)": round(float(peak_er), 2)
    }
`,
      },
    ],
  },
  milestones: [
    {
      stage: '阶段一：文献综述与问题形式化',
      duration: '第 1 - 2 周',
      objective: '全面检索 ArXiv/IEEE 近 3 年 100+ 篇文献，确立数学形式化定义与边界条件。',
      deliverables: ['《文献综述与对比矩阵表》', '《形式化问题定义说明书》', '开题立项 PPT'],
      status: 'completed',
    },
    {
      stage: '阶段二：多源异构数据集构建与基准复现',
      duration: '第 3 - 5 周',
      objective: '完成气象-交通-电价-充电负荷数据清洗对齐，复现 LSTM/GRU/Transformer/GNN 五大基线。',
      deliverables: ['标准预处理数据张量仓库 (HDF5)', 'Baseline 性能基准测试日志', '数据质量分析报告'],
      status: 'in_progress',
    },
    {
      stage: '阶段三：核心算法研发与极端工况消融测试',
      duration: '第 6 - 8 周',
      objective: '实现物理损失引导与自适应因果图模块，完成极端寒潮留出集与多轮消融实验。',
      deliverables: ['完整模型 PyTorch 源码', 'Ablation Study 对比图表', '高分辨率注意力热力图可视化'],
      status: 'pending',
    },
    {
      stage: '阶段四：论文撰写、同行评审预审与开源发布',
      duration: '第 9 - 12 周',
      objective: '撰写 IEEE Transactions 格式学术论文，邀请 AI Reviewer 预审并开源代码库。',
      deliverables: ['论文初稿 (LaTeX 完整包)', 'GitHub 开源项目与文档', '期刊投稿与回复意见预案'],
      status: 'pending',
    },
  ],
}

// ----------------------------------------------------------------------------
// 其余主题 / 自由输入的模板化生成器
// ----------------------------------------------------------------------------

import {
  DIRECTIONS_BY_TOPIC,
  buildGenericDirections,
  LITERATURE_LIB,
  type TopicDirections,
  type LiteratureItem as NodeDemosLiteratureItem,
} from './nodeDemos'

interface BuildContext {
  topicId: string
  topic: string
  isGeneric: boolean
}

const GENERIC_LIT: NodeDemosLiteratureItem[] = [
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

const GENERIC_REFERENCE = [
  {
    id: 1,
    title: 'A Comprehensive Survey on Recent Advances',
    authors: 'Doe, J., Smith, A., & Lee, B.',
    venue: '领域顶级期刊',
    year: 2023,
    doi: '10.1000/example.001',
  },
  {
    id: 2,
    title: 'State-of-the-Art Benchmark Study',
    authors: 'Smith, A. & Lee, B.',
    venue: '领域顶级会议',
    year: 2024,
  },
  {
    id: 3,
    title: 'A Novel Approach for Key Bottlenecks',
    authors: 'Wang, C., Zhao, D., & Tan, E.',
    venue: '领域权威期刊',
    year: 2024,
  },
  {
    id: 4,
    title: 'Multi-Agent Research Workflow: Theory and Practice',
    authors: 'Chen, L. & Zhang, H.',
    venue: 'IEEE Transactions on Automation Science',
    year: 2025,
  },
]

const GENERIC_SCHEME = {
  baselineModels: [
    {
      name: 'LSTM',
      category: '循环神经网络',
      strength: '擅长捕捉长时序依赖关系，训练稳定，收敛快',
      weakness: '难以建模空间拓扑与多源外部协变量的联合影响',
    },
    {
      name: 'GRU',
      category: '门控循环单元',
      strength: '参数量少、推理延迟低，适合资源受限环境部署',
      weakness: '表达能力有限，复杂场景下精度弱于注意力架构',
    },
    {
      name: 'Transformer',
      category: '自注意力机制',
      strength: '具备全序列全局注意力建模能力，擅长捕捉周期性',
      weakness: '二次方复杂度开销高，对突发长尾事件泛化稳定性欠缺',
    },
    {
      name: 'GNN',
      category: '图神经网络',
      strength: '显式建模实体间关系与图结构信息传递',
      weakness: '构图质量依赖先验知识，静态图难以捕捉动态关联',
    },
    {
      name: '领域 SOTA 基线',
      category: '时空联合深度模型',
      strength: '代表当前领域最先进性能，作为对比基准',
      weakness: '黑盒特征提取缺乏领域机理约束，泛化边界不明',
    },
  ],
  evaluations: [
    { metric: 'MAE', fullName: 'Mean Absolute Error (平均绝对误差)', description: '衡量预测与真实值的平均绝对偏差', targetValue: '< 基线 15%' },
    { metric: 'RMSE', fullName: 'Root Mean Squared Error (均方根误差)', description: '对大误差赋予更高惩罚权重', targetValue: '< 基线 20%' },
    { metric: 'MAPE', fullName: 'Mean Absolute Percentage Error', description: '无量纲相对误差，便于跨场景对比', targetValue: '< 5.0%' },
    { metric: 'R² Score', fullName: 'Coefficient of Determination', description: '衡量模型对真实方差的解释比例', targetValue: '> 0.92' },
    { metric: 'Ablation Gain', fullName: '消融实验提升幅度', description: '逐模块移除验证各创新组件贡献', targetValue: '显著 (p<0.05)' },
  ],
  technicalRoadmap: [
    { step: 'Step 1: 数据构建', title: '多源数据对齐与特征工程', methods: '完成时序对齐、异常清洗与特征标准化，构建统一数据张量。' },
    { step: 'Step 2: 基线与 SOTA 复现', title: '基线模型复现与性能锚定', methods: '复现 5 类基线模型，通过超参网格搜索锁定可比基准。' },
    { step: 'Step 3: 核心方法实现', title: '创新模块设计与联合训练', methods: '实现领域先验约束与自适应模块，设计复合损失函数。' },
    { step: 'Step 4: 消融与验证', title: '留出集压力测试与论文撰写', methods: '在多场景留出集上完成消融与显著性检验，形成论文。' },
  ],
}

const GENERIC_EXPERIMENT: ExperimentSchemeDetail = {
  title: '通用科研实验方案 (Generic Experimental Design)',
  datasetPreprocessing: [
    '时间戳对齐：将原始数据流统一聚合为固定粒度时序窗口。',
    '异常值清洗：采用 3-Sigma 准则结合孤立森林滤除传感器噪声。',
    '特征标准化：对目标与连续特征做 Z-Score 缩放，增加周期编码。',
    '数据集划分：采用 7:1:2 时序不重叠滑动窗口切分。',
  ],
  ablationStudies: [
    { component: '领域先验正则项', baselineSetup: '纯 MSE 损失函数', proposedSetup: 'L_total = L_MSE + λ * L_domain_prior', expectedOutcome: '在长尾测试集上指标显著提升' },
    { component: '自适应结构模块', baselineSetup: '固定静态结构/特征拼接', proposedSetup: '可学习自适应模块动态推断', expectedOutcome: '关键场景误差降低 20%+ 且泛化更稳' },
    { component: '多源协变量融合', baselineSetup: '仅使用核心特征', proposedSetup: '多源异构特征分层融合', expectedOutcome: '在复杂扰动下保持预测稳定性' },
  ],
  hyperparameters: [
    { param: 'History Window (历史窗口)', range: '12 ~ 96 步', defaultVal: '48' },
    { param: 'Prediction Horizon', range: '4 ~ 48 步', defaultVal: '16' },
    { param: 'Hidden Dim', range: '32 ~ 256', defaultVal: '64' },
    { param: 'Learning Rate', range: '1e-4 ~ 1e-2', defaultVal: '0.001' },
    { param: 'Batch Size', range: '32 ~ 128', defaultVal: '64' },
    { param: 'Weight Decay', range: '1e-5 ~ 1e-3', defaultVal: '1e-4' },
  ],
  hardwareRequirement: 'NVIDIA RTX 4090 (24GB) 单卡即可完成全部基线模型与主模型的训练与消融实验。',
}

const GENERIC_MILESTONES: MilestoneItem[] = [
  {
    stage: '阶段一：文献综述与问题形式化',
    duration: '第 1 - 2 周',
    objective: '全面检索领域近 3 年文献，确立数学形式化定义与边界条件。',
    deliverables: ['《文献综述与对比矩阵表》', '《形式化问题定义说明书》', '开题立项 PPT'],
    status: 'completed',
  },
  {
    stage: '阶段二：数据集构建与基准复现',
    duration: '第 3 - 5 周',
    objective: '完成多源数据清洗对齐，复现 5 类领域基线模型。',
    deliverables: ['标准预处理数据张量仓库', 'Baseline 基准测试日志', '数据质量分析报告'],
    status: 'in_progress',
  },
  {
    stage: '阶段三：核心算法研发与消融测试',
    duration: '第 6 - 8 周',
    objective: '实现核心创新模块与领域先验约束，完成多轮消融实验。',
    deliverables: ['完整模型源码', 'Ablation Study 对比图表', '可视化分析报告'],
    status: 'pending',
  },
  {
    stage: '阶段四：论文撰写与开源发布',
    duration: '第 9 - 12 周',
    objective: '撰写学术论文初稿，邀请 AI Reviewer 预审并开源代码库。',
    deliverables: ['论文初稿 (LaTeX 完整包)', 'GitHub 开源项目与文档', '投稿与回复预案'],
    status: 'pending',
  },
]

function buildReportFor(topic: string, base: TopicDirections): ResearchReport {
  const clean = topic.replace(/[?？\s]+$/, '')
  const dirs = base.directions
  const d1 = dirs[0]
  const d2 = dirs[1]
  const d3 = dirs[2]
  const hotspotLine = base.hotSpots.map((h) => `- **${h}**：当前学术界与工业界的核心关注方向，相关研究持续升温。`).join('\n')
  const gapLines = base.gaps
    .map(
      (g, i) =>
        `- **Gap ${i + 1}: ${g}**：现有方法尚未充分解决该问题，缺乏系统性建模与评测，构成重要的研究空白。`,
    )
    .join('\n')
  const dirLines = dirs
    .map(
      (d, i) =>
        `${i + 1}. **${d.title}**。核心聚焦：${d.description.slice(0, 60)}… 具备明确的学术价值与工程落地潜力。`,
    )
    .join('\n')

  return {
    title: `《${clean}研究机会分析》`,
    subtitle: 'Comprehensive Research Opportunity and Methodology Analysis Report',
    generatedDate: '2026-08-27',
    authors: ['Nova Research Agent Core', 'Literature Agent', 'Analysis Agent', 'Reviewer Agent'],
    abstract: `本报告由 Nova AI Research Agent 团队针对“${clean}”前沿方向进行系统化拆解与多智能体协同评估。报告剖析了现有方法在真实场景下的局限性，识别出 ${base.gaps.length} 项关键研究空白，并提炼出 ${dirs.length} 个高价值研究方向。综合数据可得性、方法成熟度与算力条件，给出了推荐研究问题、实验设计蓝图与 12 周科研排期建议。`,
    sections: [
      {
        number: 1,
        title: '研究背景',
        enTitle: 'Research Background & Motivation',
        summary: '该研究方向的问题背景、学术价值与产业痛点。',
        content: `随着领域技术的快速发展，“${clean}”已成为学术界与工业界共同关注的交叉研究课题。现有方法虽然在标准场景下取得较好效果，但在多源异构协变量扰动、长尾极端事件与跨域泛化等真实挑战面前仍存在明显不足，亟待新一代兼具机理可解释性与泛化能力的方法体系。`,
        highlights: ['问题具备显著学术价值与产业落地需求', '真实场景复杂度远超标准基准', '现有方法在极端工况下性能衰减明显'],
      },
      {
        number: 2,
        title: '文献现状',
        enTitle: 'State of the Art Literature Review',
        summary: '梳理领域主流方法演进与技术路线。',
        content: `Literature Agent 对领域 140+ 篇高水平文献的检索与聚类表明，现有研究大致经历三个阶段：早期基于统计与浅层模型，中期引入深度学习与图结构建模，当前正在向多模态大模型与机理融合方向演进。主流方法在平稳场景下表现良好，但普遍存在“重算法架构、轻领域机理”的瓶颈。`,
        highlights: ['方法演进脉络清晰、SOTA 不断刷新', '图结构/注意力建模成为主流范式', '普遍缺乏领域机理与因果先验的嵌入'],
      },
      {
        number: 3,
        title: '研究热点',
        enTitle: 'Emerging Research Hotspots',
        summary: '高频关键词聚类与前沿热点图谱分析。',
        content: hotspotLine,
        highlights: base.hotSpots.slice(0, 3).map((h) => `${h}关注度持续上升`),
      },
      {
        number: 4,
        title: '研究空白',
        enTitle: 'Identified Research Gaps',
        summary: '直击现有研究尚未充分解决的若干关键空白。',
        content: gapLines,
        highlights: base.gaps.slice(0, 3).map((g) => `Gap: ${g}`),
      },
      {
        number: 5,
        title: '潜在研究方向',
        enTitle: 'Potential Research Directions',
        summary: '系统化提炼出的高价值创新方向对比。',
        content: `基于上述研究空白，系统提炼并评分出 ${dirs.length} 个最具冲击力的研究方向：\n${dirLines}`,
        highlights: dirs.map((d) => d.title),
      },
      {
        number: 6,
        title: '推荐研究问题',
        enTitle: 'Recommended Research Question',
        summary: '精炼定稿的高质量开题科学问题。',
        content: `综合考虑创新空间、数据可获取性与资源边界，推荐将核心科学问题确立为：\n**“${base.conclusion}”**\n围绕该问题可进一步拆解为若干可验证的科学命题，兼顾理论深度与应用导向。`,
        highlights: ['科学问题界定清晰，符合顶刊立项标准', '兼具理论突破与应用价值'],
      },
      {
        number: 7,
        title: '实验设计',
        enTitle: 'Experimental Design & Technical Setup',
        summary: '基准模型选型、消融实验矩阵与评估基准体系。',
        content: `Coding Agent 为该研究问题制定了严密完备的对比实验方案：\n- **基线模型 (Baselines)**：涵盖循环结构、注意力架构与图神经网络共 5 类代表模型。\n- **消融实验 (Ablation Studies)**：逐模块移除验证各创新组件的独立贡献。\n- **数据集划分与回测**：采用 7:1:2 时序不重叠滑动窗口切分，并设置长尾留出测试集。\n- **评估指标**：MAE, RMSE, MAPE, R² 与专项可靠性指标全方位考核。`,
        highlights: ['涵盖 5 类主流基线模型', '严格消融对照组设计', '兼顾学术规范与工程要求'],
      },
      {
        number: 8,
        title: '风险与挑战',
        enTitle: 'Feasibility Risks & Mitigation Strategies',
        summary: '实验推进过程中可能面临的瓶颈与规避预案。',
        content: `Reviewer Agent 提示以下实施风险并给出了应对策略：\n1. **数据稀缺与长尾不平衡风险**：*应对策略*：采用数据增强、加权损失与极端值理论损失加权。\n2. **基准公平性与可复现性风险**：*应对策略*：固定随机种子、统一评测协议并开源代码。\n3. **方法与机理的一致性风险**：*应对策略*：引入领域先验正则，在推理阶段约束输出符合物理规律，并配套专家核验。`,
        highlights: ['风险预案覆盖数据 / 复现 / 机理三个层面', '每条风险均具备可执行应对策略'],
      },
      {
        number: 9,
        title: '下一步建议',
        enTitle: 'Actionable Next Steps & Timeline',
        summary: '从数据准备到论文投递的四阶段工程落地排期。',
        content: `建议按照以下四个里程碑稳步推进本课题：\n- **第 1-2 周 (数据清洗与特征构建)**：完成多源数据对齐，编写标准 DataLoader。\n- **第 3-5 周 (模型编码与 Baseline 复现)**：搭建实验平台，完成 5 个 Baseline 的网格搜索与基准曲线。\n- **第 6-8 周 (创新模型实现与消融验证)**：实现核心模块与先验约束，在多轮消融中验证贡献。\n- **第 9-12 周 (论文撰写与开源准备)**：整理图表，撰写论文初稿并开源代码仓库。`,
        highlights: ['明确了 12 周标准学术研究迭代节奏', '每个阶段均设立明确的可交付物 (Deliverables)'],
      },
    ],
    references: GENERIC_REFERENCE,
  }
}

// ----------------------------------------------------------------------------
// 模板化 Coding 实验详情（非 EV 主题复用通用 PyTorch 模板，标题注入主题）
// ----------------------------------------------------------------------------

function buildCodingDetailFor(topic: string): CodingExperimentDetail {
  const clean = topic.replace(/[?？\s]+$/, '')
  return {
    framework: 'PyTorch 2.3 + NumPy / Pandas',
    pythonVersion: 'Python 3.11',
    files: [
      {
        filename: 'data_pipeline.py',
        language: 'python',
        description: '多源数据加载与预处理流水线',
        code: `# -*- coding: utf-8 -*-
"""${clean} — 数据流水线"""
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
    print(f"[pipeline] 原始 {len(raw)} 条 → 有效 {len(proc)} 条")
`,
      },
      {
        filename: 'model.py',
        language: 'python',
        description: '核心模型架构（SOTA 基线 + 领域先验增强）',
        code: `# -*- coding: utf-8 -*-
"""${clean} — 模型定义"""
import torch
import torch.nn as nn

class ImprovedModel(nn.Module):
    """融合领域先验约束的增强网络"""
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
    return model
`,
      },
      {
        filename: 'train_eval.py',
        language: 'python',
        description: '训练与多指标评估脚本',
        code: `# -*- coding: utf-8 -*-
"""${clean} — 训练与评估"""
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
    print(f"[train] {report}")
`,
      },
    ],
  }
}

// ----------------------------------------------------------------------------
// 主生成器：按主题构建完整 ResearchAnalysisData
// ----------------------------------------------------------------------------

export function buildResearchAgentData(ctx: BuildContext): ResearchAnalysisData {
  // EV 充电主题直接返回参考 demo 的全量静态数据
  if (!ctx.isGeneric && ctx.topicId === 'ev-charging') {
    return EV_CHARGING_DATA
  }

  const base: TopicDirections = ctx.isGeneric
    ? buildGenericDirections(ctx.topic)
    : (DIRECTIONS_BY_TOPIC[ctx.topicId] ?? buildGenericDirections(ctx.topic))

  const litSource: NodeDemosLiteratureItem[] = ctx.isGeneric
    ? GENERIC_LIT
    : (LITERATURE_LIB[ctx.topicId] ?? GENERIC_LIT)

  const opportunities: ResearchOpportunity[] = base.directions.map((d, idx) => ({
    id: `opp-0${idx + 1}`,
    code: `方向 0${idx + 1}`,
    title: d.title,
    subtitle: d.subtitle,
    ratings: { ...d.ratings },
    description: d.description,
    keyChallenges: [...d.keyChallenges],
    breakthroughPoint: d.breakthroughPoint,
    recommendedDataset: d.recommendedDataset,
    recommendedModels: [...d.recommendedModels],
    expectedImpact: d.expectedImpact,
    tags: [...d.tags],
  }))

  const literatureList: LiteratureItem[] = litSource.map((lit) => ({
    id: lit.id,
    title: lit.title,
    authors: '领域代表性研究团队',
    venue: lit.venue,
    year: lit.year,
    citations: lit.citations,
    relevanceScore: lit.relevance,
    coreContribution: lit.contribution,
    limitations: '未覆盖本文关注的多源协变量与长尾极端场景，有待进一步验证。',
    bibtex: `@article{${lit.id},\n  title={${lit.title}},\n  venue={${lit.venue}},\n  year={${lit.year}}\n}`,
    tags: [...lit.tags],
  }))

  const d0 = base.directions[0]
  const d1 = base.directions[1]
  const d2 = base.directions[2]

  const recommendedScheme: RecommendedScheme = {
    researchQuestion: d0 ? d0.title : base.conclusion,
    hypothesis: `融合领域先验约束、自适应结构与多源协变量解耦的增强架构，相较于纯数据驱动基准模型，可在长尾/极端场景下将核心指标显著提升，并具备跨域泛化能力。`,
    baselineModels: [...GENERIC_SCHEME.baselineModels],
    addedVariables: [
      {
        name: d0 ? d0.title : '核心方向特征',
        category: '核心创新变量',
        importance: d0 ? d0.description.slice(0, 40) : '影响最终预测/判断的核心输入',
        source: d0 ? d0.recommendedDataset : '领域公开数据集',
      },
      {
        name: d1 ? d1.title : '辅助方向特征',
        category: '协同创新变量',
        importance: d1 ? d1.description.slice(0, 40) : '补充多维度信息，提升鲁棒性',
        source: d1 ? d1.recommendedDataset : '领域公开数据集',
      },
      {
        name: d2 ? d2.title : '泛化方向特征',
        category: '泛化与跨域变量',
        importance: d2 ? d2.description.slice(0, 40) : '支撑跨域迁移与冷启动场景',
        source: d2 ? d2.recommendedDataset : '领域公开数据集',
      },
      {
        name: '外部环境特征',
        category: '多源协变量',
        importance: '刻画真实场景中的外部扰动，提升模型稳健性',
        source: '领域公开监测数据 / 第三方开放 API',
      },
      {
        name: '时空结构特征',
        category: '地理路网与设施',
        importance: '建模实体间时空关联，提升空间泛化能力',
        source: 'OpenStreetMap / 领域地理空间数据',
      },
    ],
    evaluations: [...GENERIC_SCHEME.evaluations],
    technicalRoadmap: [...GENERIC_SCHEME.technicalRoadmap],
  }

  return {
    topic: ctx.topic,
    opportunities,
    recommendedScheme,
    report: buildReportFor(ctx.topic, base),
    literatureList,
    experimentDetail: GENERIC_EXPERIMENT,
    codingDetail: buildCodingDetailFor(ctx.topic),
    milestones: GENERIC_MILESTONES,
  }
}

// 便捷入口：仅给定主题字符串（自由输入场景）
export function buildResearchDataForTopic(topic: string): ResearchAnalysisData {
  return buildResearchAgentData({ topicId: 'custom', topic, isGeneric: true })
}
