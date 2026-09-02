// ============================================================================
// 环保行业 AI 员工矩阵 Demo 数据层
// 数据忠实取自环保原型：
//   docs/仓库/xx-ai-环保行业-ai-员工产品原型/src/data/agentsMeta.ts + mockData.ts
// ============================================================================

export type EnvEmployeeId =
  | 'compliance'
  | 'permit'
  | 'reporter'
  | 'bid'
  | 'sales'
  | 'monitoring'
  | 'waste'
  | 'operations'

export type EnvRiskLevel = 'high' | 'medium' | 'low' | 'safe'

export interface EnvAgentMeta {
  id: EnvEmployeeId
  name: string
  code: string
  roleName: string
  title: string
  tagline: string
  avatarIcon: string
  badge: string
  traditionalCost: string
  aiCost: string
  efficiencyGain: string
  targetUsers: string[]
  coreTask: string
  primaryColor: string
  gradientBg: string
  inputSummary?: string
  outputSummary?: string
}

export interface EnvDemoCase {
  id: string
  title: string
  companyName: string
  industry: string
  location: string
  summary: string
  inputParams: Record<string, string | number | boolean>
  uploadedFiles: {
    name: string
    size: string
    type: string
    description: string
  }[]
}

export interface EnvExecutionStep {
  id: number
  title: string
  description: string
  status: 'pending' | 'running' | 'completed'
  detailLogs?: string[]
  rulesMatched?: string[]
}

export interface EnvActionItem {
  id: string
  title: string
  priority: 'P0 - 紧急' | 'P1 - 重要' | 'P2 - 建议'
  department: string
  deadline: string
  description: string
  status?: 'pending' | 'in_progress' | 'completed'
  suggestedAction: string
}

// ---- 8 位 AI 员工元数据（与原型 AGENTS_META 一致） --------------------------

export const ENV_AGENTS_META: EnvAgentMeta[] = [
  {
    id: 'compliance',
    name: 'AI环保合规官',
    code: 'AGENT-01',
    roleName: '合规总监级 AI 专家',
    title: '企业环保合规体检与风险雷达',
    tagline: '5分钟穿透核查环评、排污许可、自行监测与危废合规，扫除停产处罚隐患',
    avatarIcon: 'ShieldAlert',
    badge: '合规体检',
    traditionalCost: '咨询专家 3-5 人天',
    aiCost: 'AI 自动分析 3 分钟',
    efficiencyGain: '提效 95%',
    targetUsers: ['工业企业环保部', '环保咨询顾问', '生态园区管委会'],
    coreTask: '多源资料智能比对、法律法规条款穿透匹配、违规风险定级与整改清单生成',
    primaryColor: 'emerald',
    gradientBg: 'from-emerald-500/20 via-slate-900 to-slate-950',
    inputSummary: '环评批复、排污许可、检测报告、危废台账',
    outputSummary: '综合合规评分、风险隐患清单、整改任务工单',
  },
  {
    id: 'permit',
    name: 'AI排污许可助手',
    code: 'AGENT-02',
    roleName: '排污许可技术核算 AI 专家',
    title: '排污许可证办理/变更/执行辅助',
    tagline: '智能识别污染源与排污类别，梳理资料缺口，生成申请路线图与填报底稿',
    avatarIcon: 'FileCheck2',
    badge: '排污许可',
    traditionalCost: '技术员整理 5-7 天',
    aiCost: 'AI 智能核算 2 分钟',
    efficiencyGain: '提效 92%',
    targetUsers: ['环保咨询公司', '中小型排污企业', '环保管家服务商'],
    coreTask: '污染源治理拓扑映射、技术规范匹配、申报材料查漏补缺、待确认事项预警',
    primaryColor: 'teal',
    gradientBg: 'from-teal-500/20 via-slate-900 to-slate-950',
    inputSummary: '行业分类、生产工艺、治污设施、排口参数',
    outputSummary: '污染源拓扑图、申报路线图、技术核算底稿',
  },
  {
    id: 'reporter',
    name: 'AI环保报告员',
    code: 'AGENT-03',
    roleName: '报告编制高级 AI 工程师',
    title: '环保报告自动编制与数据核算',
    tagline: '一键汇总多源监测数据与工况日志，自动核算总量，生成标准排污执行与季度报告',
    avatarIcon: 'FileText',
    badge: '报告编制',
    traditionalCost: '人工撰写 2-3 天/份',
    aiCost: 'AI 自动成文 1 分钟',
    efficiencyGain: '提效 98%',
    targetUsers: ['第三方环评咨询', '环保工程运维部', '企业环保专员'],
    coreTask: '监测数据清洗分析、排放总量核算、标准规范模板套用、章节自动排版生成',
    primaryColor: 'cyan',
    gradientBg: 'from-cyan-500/20 via-slate-900 to-slate-950',
    inputSummary: '在线监测时序数据、原辅料台账、运行日志',
    outputSummary: '标准执行报告全章节、核算附表、Word/PDF导出',
  },
  {
    id: 'bid',
    name: 'AI环保投标经理',
    code: 'AGENT-04',
    roleName: '投标策略与技术方案 AI 专家',
    title: '环保项目智能投标与作战指挥',
    tagline: '穿透式解析200页招标文件，精准拆解评分点，扫描废标红线，快速生成技术方案框架',
    avatarIcon: 'Trophy',
    badge: '智能投标',
    traditionalCost: '投标团队 4-6 天',
    aiCost: 'AI 拆解输出 3 分钟',
    efficiencyGain: '提效 90%',
    targetUsers: ['环保工程公司', '装备制造企业', '市政水务投标部'],
    coreTask: '招标文件智能解析、评分标准逐项拆解、废标红线排查、技术路线与任务倒排',
    primaryColor: 'blue',
    gradientBg: 'from-blue-500/20 via-slate-900 to-slate-950',
    inputSummary: '200+页招标文件、企业资质业绩库、人员社保',
    outputSummary: '评分细则拆解、4大废标红线、技术方案框架',
  },
  {
    id: 'sales',
    name: 'AI环保销售员',
    code: 'AGENT-05',
    roleName: '环保技术销售顾问 AI 专家',
    title: '环保项目智能销售与商机挖掘',
    tagline: '输入客户碎片化工况诉求，秒级输出客户画像、商机BANT评分、对客方案与销售攻防话术',
    avatarIcon: 'Briefcase',
    badge: '智能销售',
    traditionalCost: '方案工程师 1-2 天',
    aiCost: 'AI 实时推演 45 秒',
    efficiencyGain: '提效 96%',
    targetUsers: ['环保设备销售', '环保工程商务经理', '环保合伙人'],
    coreTask: '工况需求智能解析、客户画像刻画、商机等级评分、工艺对比与破冰攻防话术',
    primaryColor: 'indigo',
    gradientBg: 'from-indigo-500/20 via-slate-900 to-slate-950',
    inputSummary: '客户一段话工况描述、水质指标、预算周期',
    outputSummary: '客户立体画像、BANT评分、破冰销售话术、7天跟进',
  },
  {
    id: 'monitoring',
    name: 'AI环境监测分析师',
    code: 'AGENT-06',
    roleName: '监测数据诊断算法 AI 专家',
    title: '环境监测数据智能分析与超标预警',
    tagline: '秒级解析万条时序数据，识别COD/氨氮/VOCs超标隐患，智能多因子归因并给出调控处方',
    avatarIcon: 'Activity',
    badge: '监测分析',
    traditionalCost: '分析员 4-8 小时',
    aiCost: 'AI 毫秒级计算 30 秒',
    efficiencyGain: '提效 94%',
    targetUsers: ['污水处理厂运营', '工业园区环保局', 'CEMS/在线监测运维'],
    coreTask: '时序数据离群点清洗、趋势环比分析、夜间突增工况溯源、工艺运行调控参数建议',
    primaryColor: 'emerald',
    gradientBg: 'from-emerald-600/20 via-slate-900 to-slate-950',
    inputSummary: '720小时连续时序监测表、电耗药耗运行台账',
    outputSummary: '多指标时序趋势图、偷排冲击归因、工艺调优处方',
  },
  {
    id: 'waste',
    name: 'AI危废管理助手',
    code: 'AGENT-07',
    roleName: '危废合规监管高级 AI 专家',
    title: '企业危废智能管理与台账穿透',
    tagline: '八位代码自动校核，穿透排查贮存超时、相容性混存与转移联单，输出规范化自查清单',
    avatarIcon: 'AlertTriangle',
    badge: '危废管理',
    traditionalCost: '安全环保专员 2 天',
    aiCost: 'AI 智能核查 2 分钟',
    efficiencyGain: '提效 93%',
    targetUsers: ['产废工业企业', '危废处置单位', '生态环境执法自查'],
    coreTask: '《国家危废名录》代码校验、产废产线衡算、暂存间规范化排查、转移联单闭环审查',
    primaryColor: 'amber',
    gradientBg: 'from-amber-500/20 via-slate-900 to-slate-950',
    inputSummary: '危废出入库台账、暂存库平面图、电子转移联单',
    outputSummary: '8位代码核定表、GB18597禁忌排查、365天超期倒计时',
  },
  {
    id: 'operations',
    name: 'AI环保企业经营助手',
    code: 'AGENT-08',
    roleName: '环保企业经营首席参谋 AI',
    title: '环保企业经营驾驶舱与诊断',
    tagline: '智能扫描合同、施工进度、应收账款与项目毛利率，生成《老板本周应该抓的5件事》',
    avatarIcon: 'BarChart3',
    badge: '经营驾驶舱',
    traditionalCost: '财务运营总监 3 天汇总',
    aiCost: 'AI 聚合诊断 2 分钟',
    efficiencyGain: '提效 95%',
    targetUsers: ['环保企业董事长/总经理', '运营副总', '财务负责人'],
    coreTask: '多维业务报表聚合、坏账与逾期延期穿透预警、项目毛利偏离诊断、老板周度行动令',
    primaryColor: 'violet',
    gradientBg: 'from-violet-500/20 via-slate-900 to-slate-950',
    inputSummary: '48个在建项目合同表、员工工时日志、银行资金流水',
    outputSummary: '老板经营驾驶舱、项目毛利红黑榜、应收账款催收表',
  },
]

export const envAgentMetaOf = (id: EnvEmployeeId): EnvAgentMeta =>
  ENV_AGENTS_META.find((a) => a.id === id) ?? ENV_AGENTS_META[0]

// ============================================================================
// 1. AI 环保合规官 Demo 数据
// ============================================================================
export const COMPLIANCE_CASES: EnvDemoCase[] = [
  {
    id: 'comp_case_1',
    title: '典型案例一：苏州某精细化工制造有限公司',
    companyName: '苏州华聚精细新材料有限公司',
    industry: 'C2614 基础化学原料制造 / 精细化学品',
    location: '江苏省苏州市工业园区生物医药与精细化工产业园',
    summary: '年产 1.5 万吨聚醚多元醇与特种树脂助剂，重点排污单位，涉及有机废气 RTO 焚烧治理、高盐高 COD 综合生化废水处理及危险废物年产 420 吨。',
    inputParams: {
      enterpriseScale: '中型工业企业 (年产值 2.8 亿元)',
      permitType: '重点管理排污许可证',
      monitoringFrequency: '废气/废水在线实时联网监测 + 第三方季度手工比测',
      wasteAnnualTonnage: '428.5 吨/年 (HW06, HW12, HW49)',
      environmentalTaxPaid: '已按季度如实申报',
    },
    uploadedFiles: [
      { name: '排污许可证副本_91320500MA1WBXXX.pdf', size: '4.8 MB', type: 'PDF', description: '生态环境部全国排污许可登记系统下载件' },
      { name: '2025年下半年企业自行监测报告汇总.xlsx', size: '1.2 MB', type: 'Excel', description: '含总排口水质与RTO排气筒时序数据' },
      { name: '突发环境事件应急预案(2024修订备案版).pdf', size: '8.4 MB', type: 'PDF', description: '属地生态环境局备案回执齐全' },
      { name: '2025年度危废管理台账与转移联单.xlsx', size: '2.1 MB', type: 'Excel', description: '省危废动态管理平台台账导出' },
    ],
  },
  {
    id: 'comp_case_2',
    title: '典型案例二：常州某精密五金与表面涂装企业',
    companyName: '常州鼎盛精密机械表面科技有限公司',
    industry: 'C3381 金属表面处理及热处理加工',
    location: '江苏省常州市武进区高新技术产业园',
    summary: '年加工 80 万套新能源汽车铝合金零部件，涉及酸洗钝化、静电喷粉与溶剂型喷漆烘干线，简化管理排污单位。',
    inputParams: {
      enterpriseScale: '小型制造企业 (年产值 6,500 万元)',
      permitType: '简化管理排污许可证',
      monitoringFrequency: '废气半年一次、废水季度一次第三方检测',
      wasteAnnualTonnage: '85 吨/年 (HW17 表面处理废物、HW12 漆渣)',
      environmentalTaxPaid: '申报正常',
    },
    uploadedFiles: [
      { name: '环评审批批复_武环审[2022]88号.pdf', size: '2.3 MB', type: 'PDF', description: '年产80万套汽车零部件技术改造项目批复' },
      { name: '排污许可登记台账_2024年度.pdf', size: '3.1 MB', type: 'PDF', description: '简化管理排污许可证副本' },
      { name: 'VOCs活性炭吸附脱附设施运维日志.xlsx', size: '890 KB', type: 'Excel', description: '活性炭充填与更换记录表' },
    ],
  },
]

export const COMPLIANCE_EXECUTION_STEPS: EnvExecutionStep[] = [
  {
    id: 1,
    title: '解析企业上传资料与资质台账',
    description: '解析排污许可证副本、环评批复、自行监测台账、危废转移联单及应急预案，提取排污口限值与工艺参数。',
    status: 'completed',
    detailLogs: ['成功识别排污许可证编号：91320500MA1WBXXX', '提取到 2 个废气有组织排放口 (DA001/DA002)、1 个废水综合总排口 (DW001)', '解析近 6 个月 1,840 条自行监测时序数据与 4 份季度比测报告'],
  },
  {
    id: 2,
    title: '检索并调取国家及地方环保法规库',
    description: '实时匹配《排污许可管理条例》《水污染防治法》《大气污染防治法》《固定污染源废气监测技术规范》等 14 部现行法规。',
    status: 'completed',
    rulesMatched: [
      '《排污许可管理条例》第十七条（按证排污、自行监测）',
      '《中华人民共和国水污染防治法》第三十九条（超标排放法律责任）',
      '《挥发性有机物无组织排放控制标准》(GB 37822-2019)',
      '《江苏省大气污染防治条例》第四十条（活性炭更换频次与台账要求）',
      '《危险废物贮存污染控制标准》(GB 18597-2023)',
    ],
  },
  {
    id: 3,
    title: '多维度穿透式合规核对与风险量化',
    description: '对环保手续、排放控制、监测规范、治理设施、危废管理 5 大维度执行 68 项自动化合规规则核验。',
    status: 'completed',
    detailLogs: ['比对环评批复总量 vs 实际监测排放总量，发现总氮排放余量偏紧', '核对 DA001 废气排气筒 VOCs 治理设施运行台账，发现活性炭更换记录缺失 1 周期', '核查危废暂存间 HW49 废活性炭贮存周期，计算当前存期为 320 天'],
  },
  {
    id: 4,
    title: '生成环保合规体检报告与整改工单',
    description: '综合评定合规分值，划分风险等级，输出带法律依据的整改优先级与闭环责任清单。',
    status: 'completed',
    detailLogs: ['综合合规体检得分：74 分 (中高风险等级)', '识别 Top 致命违规风险 2 项，一般管理缺陷 3 项，低风险建议 4 项', '自动生成《企业环保合规体检与整改诊断报告(AI版)》'],
  },
]

export const COMPLIANCE_RESULT_DATA = {
  overallScore: 74,
  riskLevel: 'medium-high',
  riskLevelText: '中高风险 (需重点整改)',
  dimensions: [
    { name: '环保手续与许可合规', score: 88, status: '良好', desc: '环评、三同时验收及排污许可证有效齐全，无重大变动未批先建' },
    { name: '水/气污染物达标排放', score: 65, status: '中危', desc: '总氮在2025年11月连续3天出现日均超标 0.18 倍，存在行政处罚风险' },
    { name: '自行监测与信息公开', score: 72, status: '关注', desc: '雨水排放口未按规范安装 COD/pH 快速监测包，季报公开略有滞后' },
    { name: '危废全过程管理', score: 68, status: '中危', desc: 'HW49 废活性炭暂存库已存放 320 天临近 1 年法定时限，未申报延期' },
    { name: '环保设施运行与台账', score: 78, status: '良好', desc: 'RTO炉温记录完整，但活性炭吸附脱附装置更换记录未按规范归档' },
  ],
  topRisks: [
    {
      id: 'R01',
      title: '废水总排口 (DW001) 出现总氮连续超标，面临生态环境局 20万-100万元 罚款风险',
      level: 'high',
      lawClause: '《中华人民共和国水污染防治法》第八十三条第二项、《排污许可管理条例》第三十四条',
      detail: '2025年11月14日-16日在线监测数据显示，总氮日均排放浓度达 17.7 mg/L（排污许可限值 15.0 mg/L，超标倍数 0.18 倍）。虽未收到正式处罚决定书，但数据已联网上传省监控平台，极易触发非现场执法立案。',
      rectification: '立即排查反硝化碳源投加控制系统，核算进水 C/N 比；委托有资质第三方进行复测留样，并向生态环境分局提交工况异常书面说明及整改报告。',
      penaltyExposure: '20万 ~ 100万元 罚款，情节严重面临限产停产',
      priority: 'P0 - 紧急',
    },
    {
      id: 'R02',
      title: 'DA001 废气治理设施未如实记录活性炭更换台账与碘值检测报告',
      level: 'high',
      lawClause: '《中华人民共和国大气污染防治法》第一百零八条、《江苏省大气污染防治条例》',
      detail: '现场运维日志中 2025 年 8 月仅有采购单据，未见废活性炭更换记录、装填量核算及新炭碘值（≥800mg/g）检测报告，涉嫌"未按规定正常运行污染防治设施"。',
      rectification: '立即补齐活性炭装填台账、更换废旧危废转移联单及供货商质检单，建立"一炉一档"全生命周期更换日志。',
      penaltyExposure: '2万 ~ 20万元 罚款，可处责任人行政拘留',
      priority: 'P0 - 紧急',
    },
    {
      id: 'R03',
      title: 'HW49 废活性炭在暂存库累计存放已达 320 天，临近 1 年法定最长贮存期',
      level: 'medium',
      lawClause: '《中华人民共和国固体废物污染环境防治法》第八十条、《危险废物贮存污染控制标准》',
      detail: '暂存库现有 HW49 废活性炭 18.5 吨，入库最早时间为 2025 年 1 月 8 日。距法定 1 年超期仅剩 45 天，若超期未转移且未向环保部门报批，属于违法超期贮存。',
      rectification: '立即启动危废跨市/市内转移申报，锁定有资质处置单位（如光大环保）在 20 天内完成拉运处置；如遇处置排期紧张，须在超期前 15 天向辖区生态环境局提交《危废延期贮存申请表》。',
      penaltyExposure: '10万 ~ 100万元 罚款',
      priority: 'P1 - 重要',
    },
  ],
  actions: [
    {
      id: 'ACT-01',
      title: '紧急排查污水站总氮超标原因并向环保局提交工况说明',
      priority: 'P0 - 紧急',
      department: '污水站运营部 / 环保专员',
      deadline: '3 日内 (本周五前)',
      description: '对生化系统碳源投加比率进行现场校准，确保总氮稳定控制在 12 mg/L 以下（低于限值20%安全余量），同步准备书面工况异常自查报告。',
      suggestedAction: '生成自查说明模板，指派污水站站长牵头',
    },
    {
      id: 'ACT-02',
      title: '启动 HW49 废活性炭转移拉运及暂存库台账补正',
      priority: 'P0 - 紧急',
      department: 'EHS 安全环保部',
      deadline: '7 日内',
      description: '登录省危废动态管理系统发起电子转移联单，联系签约危废处置单位调派防爆拉运车辆，确保在库龄满 340 天前清零。',
      suggestedAction: '一键导出危废拉运申请函与资质校验底稿',
    },
    {
      id: 'ACT-03',
      title: '建立 RTO 废气处理设施与活性炭吸附规范化运行台账',
      priority: 'P1 - 重要',
      department: '设备动力部 / 生产车间',
      deadline: '14 日内',
      description: '依据 GB 37822 规范，在 VOCs 治理设施现场张贴运行参数卡与活性炭更换公示板，落实专人双签机制。',
      suggestedAction: '下载标准台账模板并纳入车间月度考核',
    },
  ] as EnvActionItem[],
}

// ============================================================================
// 2. AI 排污许可助手 Demo 数据
// ============================================================================
export const PERMIT_CASES: EnvDemoCase[] = [
  {
    id: 'permit_case_1',
    title: '典型案例一：新建年产 2 万吨锂电池高镍正极材料项目（首次申请）',
    companyName: '江苏卓创新能源材料科技有限公司',
    industry: 'C3985 电子专用材料制造 / 锂电池材料',
    location: '江苏省常州市金坛经济开发区',
    summary: '新建项目处于试生产前夕，需首次申报排污许可证（重点管理）。涉及煅烧废气（颗粒物、SO2、NOx、重金属镍钴锰）、水洗与前驱体母液高盐废水及多处粉尘收集排放口。',
    inputParams: {
      applyType: '首次申领（重点管理）',
      productionCapacity: '年产 20,000 吨高镍正极材料 NCM811',
      majorPollutants: '颗粒物、氮氧化物(NOx)、镍及其化合物、钴、锰、氨氮、总磷',
      emissionOutlets: '主要排放口 3 个，一般排放口 8 个，综合废水排放口 1 个',
      eiaApprovalNo: '常环审[2024]106号',
      totalQuotaAvailable: '具备常州市生态环境局核定的总量指标替代批复',
    },
    uploadedFiles: [
      { name: '环境影响报告书批复文件_常环审[2024]106号.pdf', size: '5.6 MB', type: 'PDF', description: '包含各工序产排污限值及总量控制指标' },
      { name: '工程设计方案_工艺流程及产污节点物料平衡图.pdf', size: '12.4 MB', type: 'PDF', description: '设计院出具的工艺平衡与治理工艺说明' },
      { name: '主要生产设备清单与环保治理设施参数表.xlsx', size: '1.8 MB', type: 'Excel', description: '含布袋除尘器、碱喷淋塔、SCR脱硝装置参数' },
      { name: '常州市区域主要污染物总量指标平衡来源审查意见.pdf', size: '2.1 MB', type: 'PDF', description: 'COD、氨氮、SO2、NOx排污权交易凭证' },
    ],
  },
  {
    id: 'permit_case_2',
    title: '典型案例二：印染纺织企业新增数码印花线（重大变更申请）',
    companyName: '绍兴盛泰数码纺织印染有限公司',
    industry: 'C1713 棉印染精加工',
    location: '浙江省绍兴市柯桥区滨海工业区',
    summary: '现有重点管理排污许可证。本期技术改造新增 12 台高速数码印花机与定型机废气净化系统，废气总排放量增加 15%，需进行排污许可证重大变更。',
    inputParams: {
      applyType: '重大变更申请',
      productionCapacity: '新增年印染加工 2,500 万米高档面料',
      majorPollutants: '颗粒物、非甲烷总烃、油烟、染料废气 VOCs',
      emissionOutlets: '新增 DA004/DA005 定型机废气排气筒',
      eiaApprovalNo: '绍柯环审[2024]72号',
      totalQuotaAvailable: '已完成区内排污权增量置换',
    },
    uploadedFiles: [
      { name: '现有排污许可证副本(正本及变更页).pdf', size: '6.2 MB', type: 'PDF', description: '原许可证编码 91330621MA28XXXX' },
      { name: '数码印花技改项目环评及变更说明.pdf', size: '4.1 MB', type: 'PDF', description: '新增生产线及废气治理工艺' },
    ],
  },
]

export const PERMIT_TOPOLOGY = [
  {
    node: '配料混合及前驱体烧结工段',
    rawMaterials: '硫酸镍、硫酸钴、氢氧化锂、氧气',
    pollutants: ['粉尘(颗粒物)', 'SO2', 'NOx', '镍/钴/锰重金属尘'],
    treatment: '旋风预收尘 + 耐高温覆膜布袋除尘器 + 碱液喷淋 + 中低温SCR脱硝',
    outlet: 'DA001 窑炉主排气筒 (高 35m, 内径 1.2m)',
    efficiency: '99.2% (颗粒物 ≤ 10mg/m³, NOx ≤ 50mg/m³)',
    standard: '《无机化学工业污染物排放标准》(GB 31573-2015) 特别排放限值',
  },
  {
    node: '水洗包覆与二次干燥工段',
    rawMaterials: '纯水、高纯包覆剂、氮气',
    pollutants: ['高盐重金属水洗母液', '水蒸气及微量粉尘'],
    treatment: '母液除杂沉淀 + MVR蒸发结晶回收 + 综合生化系统 (DW001)',
    outlet: 'DW001 厂区污水综合排放口 (流量 350 m³/d)',
    efficiency: '重金属零外排 (回用率 92%)，综合出水达园区接管标准',
    standard: 'GB 31573-2015 表1 间接排放限值 + 工业园区污水厂协议值',
  },
  {
    node: '气流粉碎、筛分与自动包装工段',
    rawMaterials: '烧结正极半成品',
    pollutants: ['微细粉尘(镍钴锰酸锂复合粉尘)'],
    treatment: '密闭负压集气 (收集率≥98%) + 二级高效滤筒除尘器',
    outlet: 'DA002/DA003 包装排气筒 (高 25m)',
    efficiency: '99.8% (颗粒物 ≤ 5mg/m³, 镍 ≤ 0.5mg/m³)',
    standard: '重点行业超低排放管控标准 (严格于国家标准)',
  },
]

// ============================================================================
// 3. AI 环保报告员 Demo 数据
// ============================================================================
export const REPORTER_CASES: EnvDemoCase[] = [
  {
    id: 'rep_case_1',
    title: '典型案例一：某光电新材料产业园 2025年Q4 排污许可证执行报告（季度报告）',
    companyName: '苏州光驰半导体新材料有限公司',
    industry: 'C3984 光电子器件及特殊电子材料',
    location: '苏州相城区高新技术产业开发区',
    summary: '针对重点管理排污许可证，自动编制 2025 年第四季度（10-12月）排污许可执行报告。整合 3 个废气排口与 1 个废水总排口连续 92 天 2,200 余组监测数据、原辅材料台账、设施运维消耗与总量比对。',
    inputParams: {
      reportType: '排污许可证执行报告 (季度报告 Q4)',
      permitCode: '91320507MA1N88888X',
      reportingPeriod: '2025年10月01日 - 2025年12月31日 (共92天)',
      dataSourcesConnected: '在线 CEMS 实时联网 + 水质在线 COD/氨氮 + 手工监测台账',
      totalEmissionCalculated: 'COD 12.4t (许可限额 18.0t), VOCs 3.8t (许可限额 6.5t)',
    },
    uploadedFiles: [
      { name: '2025Q4_废水在线监测小时均值与日均值总表.xlsx', size: '3.4 MB', type: 'Excel', description: '包含流量、COD、氨氮、总磷、pH每日数据' },
      { name: '2025Q4_DA001有组织VOCs连续监测时序数据.xlsx', size: '4.2 MB', type: 'Excel', description: 'FID在线非甲烷总烃及特征污染物数据' },
      { name: '2025Q4_主要原辅材料及化学品消耗台账.xlsx', size: '1.1 MB', type: 'Excel', description: '溶剂、酸碱、光刻胶配套助剂用量' },
      { name: '2025Q4_污染防治设施用电量及药剂投加日志.xlsx', size: '890 KB', type: 'Excel', description: 'RTO炉温、PAC/PAM投加量、污泥脱水记录' },
    ],
  },
  {
    id: 'rep_case_2',
    title: '典型案例二：某汽车零部件制造基地 2025 年度企业自行监测与环保合规年度报告',
    companyName: '武汉万达汽车零部件制造股份有限公司',
    industry: 'C3670 汽车零部件及配件制造',
    location: '湖北省武汉经济技术开发区',
    summary: '涵盖全年 365 天监测数据年度汇总，自动对比年许可排放总量，核算各项污染物减排绩效与设施合规率，满足生态环境局年度信息公开披露。',
    inputParams: {
      reportType: '企业自行监测与环保合规年度报告 (2025年度)',
      permitCode: '91420100MA4K99999Y',
      reportingPeriod: '2025年01月01日 - 2025年12月31日',
      dataSourcesConnected: '全年12个月监测报告汇总 + 环保设施年度大修记录',
    },
    uploadedFiles: [
      { name: '2025年度全厂排污监测数据年报汇总.xlsx', size: '8.7 MB', type: 'Excel', description: '含废水、废气、厂界噪声与地下水检测' },
    ],
  },
]

// ============================================================================
// 4. AI 环保投标经理 Demo 数据
// ============================================================================
export const BID_CASES: EnvDemoCase[] = [
  {
    id: 'bid_case_1',
    title: '典型案例一：某经开区工业污水处理厂扩容提标改造工程 EPC 总承包项目',
    companyName: '南京中科环保工程科技有限公司 (投标方)',
    industry: '市政工业水处理工程 EPC',
    location: '安徽省合肥市循环经济示范园',
    summary: '标的额 6,800 万元，建设规模 40,000 m³/d。要求出水由一级A提标至地表水准IV类（COD≤30mg/L, NH3-N≤1.5mg/L, TP≤0.3mg/L）。招标文件长达 218 页，包含严苛的资格条件与复杂的综合评分细则。',
    inputParams: {
      projectBudget: '6,800 万元 (招标控制价)',
      projectScale: '40,000 m³/d 工业废水深度处理',
      tenderFilePages: '218 页 (PDF/Word)',
      myQualification: '环保工程专业承包一级 + 市政公用工程施工总承包二级 + 环境工程专项设计甲级',
      biddingStrategy: '技术分冲顶 (45分满分力争42+), 商务分高契合 (25分拿满), 价格分稳健 (30分)',
      estimatedWinRate: '82.5% (行业第一梯队)',
    },
    uploadedFiles: [
      { name: '合肥循环经济示范园污水厂EPC招标文件(发售最终版).pdf', size: '18.4 MB', type: 'PDF', description: '含投标人须知、合同条款、设计技术规格书' },
      { name: '本公司资质证书、安全生产许可证与专利证书库.pdf', size: '14.2 MB', type: 'PDF', description: '一级专包资质、12项水处理发明专利' },
      { name: '近三年类似4万吨以上工业污水EPC业绩合同及竣工验收证明.pdf', size: '22.8 MB', type: 'PDF', description: '包含 3 项同规模石化/园区污水已投运业绩' },
      { name: '拟派项目经理(一级建造师)执业证书与近半年社保证明.pdf', size: '3.1 MB', type: 'PDF', description: '高级工程师 + 一级建造师 + 2项同类项目业绩' },
    ],
  },
  {
    id: 'bid_case_2',
    title: '典型案例二：某钢铁集团烧结烟气脱硫脱硝及超低排放改造运维服务项目',
    companyName: '南京中科环保工程科技有限公司 (投标方)',
    industry: '烟气治理超低排放 EPC & O&M',
    location: '河北省唐山市',
    summary: '标的额 2,200 万元/年 (3年期运维总额 6,600 万元)，要求颗粒物≤5mg/m³、SO2≤20mg/m³、NOx≤35mg/m³，考核机制严密。',
    inputParams: {
      projectBudget: '6,600 万元 (3年运维服务)',
      tenderFilePages: '185 页',
      myQualification: '环境污染治理设施运营甲级 / 环保工程一级',
    },
    uploadedFiles: [
      { name: '唐山某特钢烧结烟气脱硫脱硝运维招标文件.pdf', size: '15.6 MB', type: 'PDF', description: '含运行电耗考核、脱硝剂单耗考核细则' },
    ],
  },
]

// ============================================================================
// 5. AI 环保销售员 Demo 数据
// ============================================================================
export const SALES_CASES: EnvDemoCase[] = [
  {
    id: 'sales_case_1',
    title: '典型商机一：江苏某精细化工厂 5000t/d 高盐高COD废水提标改造',
    companyName: '江苏恒丰医药生物化工原料股份有限公司',
    industry: '精细化工 / 原料药中间体',
    location: '江苏省泰州市滨江精细化工园区',
    summary: '客户日产 5,000 吨高盐（含盐量 4.5%）、难降解 COD（进水 COD 4,500-6,000 mg/L）工业废水。现有水解+普通生化系统常年超负荷，环保局多次约谈，面临停产整改。客户董事长急迫度极高，预算约 1,800 万元，要求 3 个月内完成改造。',
    inputParams: {
      clientQueryText: '某化工厂每天产生5000吨高盐高COD工业废水，现有生化池负荷过高常年超标，面临环保局挂牌督办，预算大约1800万，希望3个月内完成改造，要保证达标接管。',
      budgetEstimate: '1,800 万元人民币',
      waterVolume: '5,000 m³/天',
      waterCharacteristics: '进水 COD 5,500 mg/L, 盐度 NaCl/Na2SO4 45,000 mg/L, 氨氮 180 mg/L',
      urgencyLevel: '极高（面临环保督办与限产风险）',
      decisionMakers: '董事长（最终拍板）、分管生产副总（关注工期）、EHS总监（关注达标与稳定性）',
    },
    uploadedFiles: [
      { name: '客户水质化验检测报告单_202511.pdf', size: '1.4 MB', type: 'PDF', description: '客户水样B/C比只有0.18，含大量芳香族环状化合物' },
      { name: '现场污水处理站平面布置与构筑物图纸.dwg', size: '8.6 MB', type: 'DWG', description: '占地受限，只能在现有调节池旁扩建' },
    ],
  },
  {
    id: 'sales_case_2',
    title: '典型商机二：广东某电镀产业园重金属废水零排放与资源回用项目',
    companyName: '佛山南海精密表面处理生态产业园',
    industry: '电镀表面处理 / 产业园区集中治污',
    location: '广东省佛山市',
    summary: '含铜、含镍、含氰废水分类收集分质处理，设计处理规模 3,000 m³/d，回用率要求达到 75% 以上，预算 2,500 万元。',
    inputParams: {
      clientQueryText: '电镀园每天3000吨重金属混合废水，要求中水回用率75%，重金属镍铜回收，预算2500万，政府支持绿色园区示范。',
      budgetEstimate: '2,500 万元',
      waterVolume: '3,000 m³/天',
      urgencyLevel: '中高（争取园区下半年绿色补贴）',
    },
    uploadedFiles: [
      { name: '电镀废水水质分类规划与回用水质标准.pdf', size: '2.8 MB', type: 'PDF', description: '园区规划设计标准' },
    ],
  },
]

// ============================================================================
// 6. AI 环境监测分析师 Demo 数据
// ============================================================================
export const MONITORING_CASES: EnvDemoCase[] = [
  {
    id: 'mon_case_1',
    title: '典型案例一：某工业园区集中污水处理厂 30 天水质在线监测多维数据',
    companyName: '苏南某化工集中区水处理有限公司 (处理规模 50,000 m³/d)',
    industry: '园区集中式工业污水处理厂',
    location: '江苏省无锡市宜兴环保科技工业园',
    summary: '汇集 2025 年 11 月整月共 30 天 720 个小时水质连续在线监测数据。包含进水与出水 COD、氨氮(NH3-N)、总磷(TP)、总氮(TN)、pH值、溶解氧(DO)、生化池ORP及瞬时流量。',
    inputParams: {
      monitoringSite: '进水在线监测井 (IN001) & 综合外排口 (DW001)',
      timeRange: '2025年11月01日 00:00 - 2025年11月30日 23:00 (720 小时)',
      parametersTracked: '进水COD, 出水COD, 进水NH3-N, 出水NH3-N, TP, TN, 曝气池DO, 流量Q',
      standardLimits: '出水限值：COD ≤ 50 mg/L, NH3-N ≤ 5.0 mg/L, TP ≤ 0.5 mg/L, TN ≤ 15.0 mg/L',
    },
    uploadedFiles: [
      { name: '2025年11月水质在线小时连续时序数据全量表.xlsx', size: '5.2 MB', type: 'Excel', description: '720行 x 16列 连续监测时序数据' },
      { name: '污水厂每日工艺运行台账(曝气量/回流比/加药量).xlsx', size: '1.8 MB', type: 'Excel', description: '内回流比、乙酸钠投加量、PAC消耗量' },
    ],
  },
  {
    id: 'mon_case_2',
    title: '典型案例二：某大型涂装工业基地 CEMS 连续 15 天 VOCs 废气小时数据',
    companyName: '重庆长安汽车涂装车间排气筒 DA001',
    industry: '汽车整车制造涂装废气',
    location: '重庆市两江新区汽车工业园',
    summary: '连续监测 RTO 焚烧装置烟气排放口非甲烷总烃(NMHC)、苯系物、颗粒物、烟气温度及含氧量数据，自动识别脱附峰值异常。',
    inputParams: {
      monitoringSite: 'DA001 涂装烘干废气排气筒 (CEMS连续在线监测)',
      timeRange: '连续 15 天小时均值',
      parametersTracked: '非甲烷总烃, 甲苯+二甲苯, 颗粒物, 炉膛温度, 烟气含氧量',
    },
    uploadedFiles: [
      { name: 'CEMS_VOCs在线小时均值数据_15天.xlsx', size: '2.4 MB', type: 'Excel', description: '含烘房与喷漆房连续监测数据' },
    ],
  },
]

// 模拟 30 天水质图表数据（供折线图绘制）
export const MONITORING_TIME_SERIES = [
  { day: '11-01', inCod: 480, outCod: 38, inNh3: 32, outNh3: 1.8, tp: 0.28, tn: 11.2, do: 2.8, limitCod: 50, limitNh3: 5.0 },
  { day: '11-03', inCod: 510, outCod: 41, inNh3: 34, outNh3: 2.1, tp: 0.31, tn: 12.0, do: 2.6, limitCod: 50, limitNh3: 5.0 },
  { day: '11-05', inCod: 530, outCod: 44, inNh3: 36, outNh3: 2.4, tp: 0.35, tn: 12.8, do: 2.5, limitCod: 50, limitNh3: 5.0 },
  { day: '11-07', inCod: 490, outCod: 39, inNh3: 30, outNh3: 1.9, tp: 0.29, tn: 11.5, do: 2.9, limitCod: 50, limitNh3: 5.0 },
  { day: '11-09', inCod: 780, outCod: 48, inNh3: 55, outNh3: 4.2, tp: 0.44, tn: 14.2, do: 1.6, limitCod: 50, limitNh3: 5.0 }, // 冲击预警
  { day: '11-11', inCod: 850, outCod: 53, inNh3: 62, outNh3: 5.8, tp: 0.58, tn: 16.5, do: 1.2, limitCod: 50, limitNh3: 5.0 }, // 超标点
  { day: '11-13', inCod: 620, outCod: 47, inNh3: 45, outNh3: 3.9, tp: 0.41, tn: 13.8, do: 2.2, limitCod: 50, limitNh3: 5.0 },
  { day: '11-15', inCod: 500, outCod: 36, inNh3: 33, outNh3: 1.7, tp: 0.26, tn: 10.9, do: 3.1, limitCod: 50, limitNh3: 5.0 },
  { day: '11-17', inCod: 470, outCod: 34, inNh3: 31, outNh3: 1.5, tp: 0.24, tn: 10.2, do: 3.2, limitCod: 50, limitNh3: 5.0 },
  { day: '11-19', inCod: 720, outCod: 46, inNh3: 50, outNh3: 3.8, tp: 0.39, tn: 13.5, do: 1.9, limitCod: 50, limitNh3: 5.0 },
  { day: '11-21', inCod: 510, outCod: 38, inNh3: 32, outNh3: 1.8, tp: 0.29, tn: 11.4, do: 2.8, limitCod: 50, limitNh3: 5.0 },
  { day: '11-23', inCod: 490, outCod: 35, inNh3: 29, outNh3: 1.4, tp: 0.25, tn: 10.6, do: 3.0, limitCod: 50, limitNh3: 5.0 },
  { day: '11-25', inCod: 520, outCod: 39, inNh3: 35, outNh3: 2.0, tp: 0.30, tn: 11.8, do: 2.7, limitCod: 50, limitNh3: 5.0 },
  { day: '11-27', inCod: 540, outCod: 42, inNh3: 38, outNh3: 2.3, tp: 0.32, tn: 12.2, do: 2.6, limitCod: 50, limitNh3: 5.0 },
  { day: '11-29', inCod: 480, outCod: 37, inNh3: 30, outNh3: 1.6, tp: 0.27, tn: 11.0, do: 3.0, limitCod: 50, limitNh3: 5.0 },
  { day: '11-30', inCod: 460, outCod: 35, inNh3: 28, outNh3: 1.3, tp: 0.23, tn: 10.4, do: 3.2, limitCod: 50, limitNh3: 5.0 },
]

// ============================================================================
// 7. AI 危废管理助手 Demo 数据
// ============================================================================
export const WASTE_CASES: EnvDemoCase[] = [
  {
    id: 'waste_case_1',
    title: '典型案例一：某汽车制造与整车喷涂生产基地危险废物规范化管理核查',
    companyName: '合肥江淮智能汽车制造股份有限公司',
    industry: 'C3611 汽柴油车整车制造 / 涂装车间',
    location: '安徽省合肥市包河经济开发区',
    summary: '年产 15 万辆乘用车，年产生危险废物 580 吨。涵盖喷漆漆渣(HW12)、涂装废溶剂(HW06)、废活性炭(HW49)、含油抹布及手套(HW49)、表面处理废槽渣(HW17)等 7 类危废。',
    inputParams: {
      annualGeneration: '584.2 吨/年 (7个危废类别)',
      storageCapacity: '甲类危废暂存库 450 m² + 乙类危废暂存库 300 m²',
      managementPlatform: '已对接安徽省固体废物环境信息化监控系统',
      currentStock: '库房现存危废共 42.6 吨 (含超期风险批次)',
      electronicTagRatio: '100% 电子标签扫码入库',
    },
    uploadedFiles: [
      { name: '2025年度危废产生与出入库全量台账.xlsx', size: '3.6 MB', type: 'Excel', description: '包含每日产生入库、称重计量、出库联单编号' },
      { name: '危废暂存间平面布置图与安全消防设施检查记录.pdf', size: '4.8 MB', type: 'PDF', description: '含防渗层构造、导流沟、集液池设计' },
      { name: '危废委托处置协议与第三方接收单位危险废物经营许可证.pdf', size: '6.2 MB', type: 'PDF', description: '光大绿色环保危废处置合同(核准经营范围)' },
      { name: '危险废物跨省/省内电子转移联单明细.xlsx', size: '2.1 MB', type: 'Excel', description: '2025年已完成 18 车次转移记录' },
    ],
  },
  {
    id: 'waste_case_2',
    title: '典型案例二：某医药中间体合成企业危险废物全流程核查',
    companyName: '台州海翔合成制药中间体有限公司',
    industry: 'C2710 化学药品原料药制造',
    location: '浙江省台州市椒江区医药化工园区',
    summary: '涉及蒸馏残渣(HW02)、废母液(HW11)、废过滤吸附介质(HW49)、废酸(HW34)，高毒性、易燃易爆特性显著。',
    inputParams: {
      annualGeneration: '320 吨/年',
      storageCapacity: '防爆危废库 280 m²',
      managementPlatform: '浙江省危险废物监管平台',
      electronicTagRatio: '92%',
    },
    uploadedFiles: [
      { name: '台州海翔危废出入库台账2025.xlsx', size: '2.9 MB', type: 'Excel', description: '批次出入库与反应釜产废溯源' },
    ],
  },
]

export const WASTE_INVENTORY_TABLE = [
  {
    code: '900-252-12',
    category: 'HW12 染料、涂料废物',
    name: '汽车涂装水帘漆渣 (脱水烘干物)',
    hazard: 'T, I (毒性、易燃性)',
    annualLimit: '180.0 吨',
    currentStock: '12.4 吨',
    storageDays: '65 天',
    status: 'safe' as EnvRiskLevel,
    disposalPartner: '安徽中环环保危废处置中心 (焚烧)',
    complianceNote: '标识标签齐全，盛装容器完好无泄漏',
  },
  {
    code: '900-041-49',
    category: 'HW49 其他废物',
    name: 'VOCs废气吸附饱和废活性炭',
    hazard: 'T (毒性)',
    annualLimit: '120.0 吨',
    currentStock: '18.5 吨',
    storageDays: '320 天',
    status: 'high' as EnvRiskLevel,
    disposalPartner: '合肥光大危废再生利用有限公司 (再生炭)',
    complianceNote: '库龄达 320 天，距离 1 年法定上限仅剩 45 天，极高违规风险！',
  },
  {
    code: '900-006-08',
    category: 'HW08 废矿物油与含矿物油废物',
    name: '设备液压系统废润滑油及清洗废油',
    hazard: 'T, I (毒性、易燃性)',
    annualLimit: '45.0 吨',
    currentStock: '4.8 吨',
    storageDays: '110 天',
    status: 'safe' as EnvRiskLevel,
    disposalPartner: '安徽浩悦环境科技股份有限公司 (精馏再生)',
    complianceNote: '贮存桶置于专用防泄漏托盘上，双人双锁管理规范',
  },
  {
    code: '900-044-49',
    category: 'HW49 其他废物',
    name: '废弃废化学品包装桶及沾染物抹布',
    hazard: 'T (毒性)',
    annualLimit: '35.0 吨',
    currentStock: '6.9 吨',
    storageDays: '195 天',
    status: 'medium' as EnvRiskLevel,
    disposalPartner: '合肥浩悦环境 (清洗破碎利用)',
    complianceNote: '部分铁桶露天暂存未入库，标识二维码磨损需补打',
  },
]

// ============================================================================
// 8. AI 环保企业经营助手 Demo 数据
// ============================================================================
export const OPERATIONS_CASES: EnvDemoCase[] = [
  {
    id: 'ops_case_1',
    title: '典型案例一：某环保工程与环保装备制造企业 2025年Q3 经营全景数据',
    companyName: '华东环保装备工程集团股份有限公司',
    industry: '环保工程 EPC / 装备制造 / 环保管家运营',
    location: '江苏省南京市江宁区紫金环保科技城',
    summary: '员工 260 人，年营收规模 2.4 亿元。在手执行 EPC 工程项目 18 个（在建合同额 1.28 亿元），在手运维运营项目 12 个。涉及销售商机漏斗、工程工期进度节点、财务应收账款与项目毛利率综合盘点。',
    inputParams: {
      annualRevenue: '2.4 亿元',
      headcount: '260 人 (技术与业务人员 52 人)',
      activeProjects: '18 个在建 EPC 工程 + 12 个长期运营合同',
      totalContractValue: '1.28 亿元在手合同额',
      q3RevenueCompleted: '6,450 万元 (年度目标完成率 68%)',
      accountsReceivable: '4,820 万元 (其中逾期 >180天 达 1,150 万元)',
      averageGrossMargin: '预算目标 31.5%，Q3 实际达成 24.2% (偏离 -7.3%)',
    },
    uploadedFiles: [
      { name: '2025Q3_在建EPC工程进度与产值确认明细表.xlsx', size: '4.2 MB', type: 'Excel', description: '包含18个项目里程碑节点、实际工期偏离天数' },
      { name: '2025Q3_销售商机漏斗与投标跟踪看板.xlsx', size: '2.1 MB', type: 'Excel', description: '按销售员、阶段、赢单概率汇总' },
      { name: '财务部_2025年9月应收账款账龄与回款进度表.xlsx', size: '3.8 MB', type: 'Excel', description: '客户信用评级、逾期金额与催收责任人' },
      { name: '项目成本核算表_预算成本vs实际支出对比.xlsx', size: '5.1 MB', type: 'Excel', description: '主材钢材/填料涨价与分包人工超支明细' },
    ],
  },
  {
    id: 'ops_case_2',
    title: '典型案例二：某环保咨询与环保管家服务公司年度经营盘点',
    companyName: '江苏中环汇智环保咨询有限公司',
    industry: '环评 / 排污许可 / 环保管家第三方咨询',
    location: '江苏省苏州市',
    summary: '在手 450 个咨询单子，85 人专业团队，人效与回款周期长是主要瓶颈。',
    inputParams: {
      annualRevenue: '3,200 万元',
      headcount: '85 人',
      activeProjects: '450 个小微咨询单',
      totalContractValue: '3,200 万元',
    },
    uploadedFiles: [
      { name: '咨询项目交付周期与人效工时统计2025.xlsx', size: '3.1 MB', type: 'Excel', description: '各咨询师在手合同与交付延期' },
    ],
  },
]

export const OPERATIONS_FINANCE_METRICS = {
  healthScore: 86,
  kpis: [
    { title: '在手合同总额', value: '¥ 1.28 亿', change: '+18.5%', changeType: 'positive', subtext: '18个EPC + 12个运营' },
    { title: '本季度回款达成率', value: '74.2%', change: '-8.6%', changeType: 'negative', subtext: '实际回款 3,580万 / 目标 4,820万' },
    { title: '综合项目毛利率', value: '24.2%', change: '-7.3%', changeType: 'negative', subtext: '预算毛利 31.5% (主材及分包超支)' },
    { title: '在建项目交付按期率', value: '83.3%', change: '3项滞后', changeType: 'warning', subtext: '15项正常 / 3项严重滞后>15天' },
  ],
  topRisks: [
    {
      id: 'OP-R1',
      title: '华东某热电脱硫提标工程 (合同额 2,800万) 进度严重滞后 25 天，面临 50 万违约罚款',
      category: '工程交付风险',
      amount: '¥ 2,800 万项目',
      detail: '现场因原总包电气交接延迟及我方非标反应器供货迟延，导致土建安装节点延误。业主已下达两次违约警告函。',
      action: '老板需指派工程总监本周三前入驻现场实行"战时封闭管理"，调整非标件二供加急供货。',
    },
    {
      id: 'OP-R2',
      title: '某精细化工客户 380 万元设备款逾期达 210 天，客户现金流吃紧存在坏账风险',
      category: '应收回款风险',
      amount: '¥ 380 万元',
      detail: '该客户因产品价格下跌三季度开工率不足40%，应付账款排期延后。若本月未能达成确权分期，需启动法律保全。',
      action: '老板亲自约见该客户董事长，签署设备抵押或分期确权补充协议（建议首付 150 万，余款按月支付）。',
    },
    {
      id: 'OP-R3',
      title: '3 个在建污水生化除磷工程因 PAC 药剂与不锈钢填料价格上涨导致毛利率缩水 8.5%',
      category: '项目毛利风险',
      amount: '影响净利润约 ¥ 240 万元',
      detail: '采购部采用单次现货采购而非锁价框架协议，导致实际采购成本超过工程预算红线。',
      action: '对第四季度 4 个新开工项目立即实行"大宗物料战略锁价"，重构项目经理毛利考核机制。',
    },
  ],
  topOpportunities: [
    {
      id: 'OP-O1',
      title: '安徽某光伏切片废水综合治理 EPC 项目 (预算 4,500 万) 处于最后两家比选阶段',
      expectedRevenue: '¥ 4,500 万元',
      winProbability: '85%',
      action: '技术团队已完成针对性抗氟技术优化，建议本周五安排技术答辩并由总经理带队商务谈判。',
    },
    {
      id: 'OP-O2',
      title: '老客户泰州精细化工新增 5,000t/d 提标改造需求 (1,800万)，具备老厂改造排他性优势',
      expectedRevenue: '¥ 1,800 万元',
      winProbability: '92%',
      action: '销售部联合 AI 销售员已出具技术初步建议书，客户反响极佳，下周一签订技术协议备忘录。',
    },
  ],
  bossActionsThisWeek: [
    {
      id: 'BOSS-01',
      title: '亲自协调华东热电脱硫项目现场施工，化解 25 天工期滞后与 50 万罚款危机',
      priority: 'P0 - 极高',
      responsiblePerson: '董事长 / 工程副总',
      deadline: '本周三下午 17:00 前',
      impact: '保住 2,800 万标杆项目声誉与年底 800 万节点结算款',
    },
    {
      id: 'BOSS-02',
      title: '约见泰州精细化工董事长，闭环签下 1,800 万废水提标改造排他性协议',
      priority: 'P0 - 极高',
      responsiblePerson: '总经理 / 销售总监',
      deadline: '本周四全天',
      impact: '锁定 Q4 最核心利润大单，增加 450 万预期毛利',
    },
    {
      id: 'BOSS-03',
      title: '签发 380 万逾期款专项清收指令，必要时启动法务诉前保全',
      priority: 'P1 - 重要',
      responsiblePerson: '财务总监 / 法务顾问',
      deadline: '本周五前',
      impact: '压降应收坏账损失，保障年底员工奖金现金流安全',
    },
    {
      id: 'BOSS-04',
      title: '召开采购与工程成本管控专题会，锁定大宗钢材填料战略采购框架',
      priority: 'P1 - 重要',
      responsiblePerson: '运营副总 / 采购经理',
      deadline: '本周五下午',
      impact: '止住项目毛利率下滑态势，预期挽回 180 万成本敞口',
    },
    {
      id: 'BOSS-05',
      title: '审阅批准安徽光伏废水 4,500 万 EPC 项目最终投标报价与技术底稿',
      priority: 'P1 - 重要',
      responsiblePerson: '投标经理 / 总工程师',
      deadline: '周六上午',
      impact: '冲刺年度标王，赢单后将超额完成 2025 年营收目标',
    },
  ],
}

export const PROJECT_PL_DATA = [
  { name: '合肥经济技术开发区工业污水提标改造 EPC', type: 'EPC 工程', contract: '¥ 6,800 万', cost: '¥ 4,960 万', margin: '27.1%', paymentProgress: '65.0%', healthStatus: '健康' },
  { name: '泰州精细化工 5,000t/d 高盐废水处理技改', type: 'EPC 工程', contract: '¥ 1,680 万', cost: '¥ 1,180 万', margin: '29.8%', paymentProgress: '80.0%', healthStatus: '健康' },
  { name: '华东某热电厂脱硫脱硝超低排放技改项目', type: 'EPC 工程', contract: '¥ 2,800 万', cost: '¥ 2,490 万', margin: '11.1%', paymentProgress: '45.0%', healthStatus: '严重亏损预警' },
  { name: '苏州相城区 30 家机械制造企业环保管家咨询', type: '环保咨询', contract: '¥ 450 万', cost: '¥ 220 万', margin: '51.1%', paymentProgress: '90.0%', healthStatus: '健康' },
  { name: '南通某电镀工业园区污水站年度运营托管', type: '运维运营', contract: '¥ 800 万/年', cost: '¥ 540 万', margin: '32.5%', paymentProgress: '75.0%', healthStatus: '健康' },
  { name: '常州新材料挥发性有机物 (VOCs) RTO治理工程', type: 'EPC 工程', contract: '¥ 1,200 万', cost: '¥ 980 万', margin: '18.3%', paymentProgress: '50.0%', healthStatus: '预警' },
]

export const EMPLOYEE_EFFICIENCY_DATA = [
  { deptName: '环保咨询部', headcount: 14, revenuePerHead: '¥ 165 万 / 人·年', coreOutput: '年均出具环评/排污/自查报告 380 份', aiPotential: 'AI 合规官 + AI 报告员可替代 85% 基础排版核算，人效预计提升至 280 万/年' },
  { deptName: '工程技术与方案部', headcount: 18, revenuePerHead: '¥ 145 万 / 人·年', coreOutput: '年均编制投标文件与技术方案 95 套', aiPotential: 'AI 投标经理 + AI 销售员可将标书拆解从 3 天缩短至 3 分钟，投标响应量翻 3 倍' },
  { deptName: '市场销售与商务部', headcount: 12, revenuePerHead: '¥ 180 万 / 人·年', coreOutput: '年均开拓签约环保项目 48 个', aiPotential: 'AI 销售员赋能秒级生成工况方案与破冰话术，普通业务员成单周期缩短 40%' },
]
