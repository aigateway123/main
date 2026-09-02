// ============================================================================
// 传统外贸 · AI 贸易情报员工作台 Demo 数据层
// 忠实取自外贸原型：
//   docs/仓库/xx-ai-·-ai贸易情报员/src/types.ts + src/data/mockData.ts
// 客户线索数据体量大，单独存放于 ./tradeLeads.ts（本文件 re-export）。
// ============================================================================

// ---- 工作台视图 id（TradeIntelDemo 侧栏 + 各视图分发） ----
export type TradeView =
  | 'home'
  | 'progress'
  | 'customers'
  | 'suppliers'
  | 'market'
  | 'competitors'
  | 'radar'
  | 'tasks'
  | 'settings'

export type LeadTier = 'A' | 'B' | 'C'

export interface CompanyLead {
  id: string
  name: string
  legalName?: string
  country: string
  countryCode: string
  city: string
  region: string
  companyType: string
  industry: string
  establishedYear: number
  employeeScale: string
  annualRevenue: string
  website: string
  logoInitial: string
  productMatch: number
  purchasePotential: number
  overallScore: number
  tier: LeadTier
  recommendedAction: '立即开发' | '重点跟进' | '培育跟进' | '持续观察'
  actionColor: string
  summary: string
  isStarred?: boolean
  businessPortrait: {
    overview: string
    targetMarketSegment: string
    chinaCooperationPotential: string
    keyHighlights: string[]
  }
  productMatchDetails: {
    overall: number
    categories: { name: string; percentage: number }[]
    aiVerdict: string[]
  }
  scoreBreakdown: {
    productMatch: number
    companyScale: number
    marketMatch: number
    purchasePotential: number
    cooperationProbability: number
  }
  aiOpportunities: { id: string; title: string; description: string; level: '高' | '中高' | '中'; tag: string }[]
  nextSteps: { id: number; step: string; status: 'pending' | 'in_progress' | 'completed'; recommendedTime: string }[]
  contacts: {
    name: string
    title: string
    email: string
    phone: string
    linkedin: string
    isKeyDecisionMaker: boolean
  }[]
  informationSources: {
    sourceName: string
    sourceType: '企业官网' | '海关提单' | '行业目录' | '展会名录' | '商业数据库' | '企业财报'
    sourceDate: string
    reliability: number
    linkTitle: string
    verified: boolean
  }[]
  importData?: {
    hasImportHistory: boolean
    mainImportOrigin: string[]
    annualImportShipments: number
    recentCustomsRecord: string
  }
}

export interface SupplierItem {
  id: string
  name: string
  location: string
  province: string
  mainProducts: string[]
  establishedYear: number
  employeeScale: string
  annualCapacity: string
  productMatch: number
  supplierScore: number
  tier: '优质供应商' | '重点供应商' | '备选供应商'
  certifications: string[]
  priceAdvantage: '极高' | '高' | '中等'
  moq: string
  leadTime: string
  oemOdm: string
  portrait: string
  advantages: string[]
}

export interface MarketOpportunity {
  id: string
  region: string
  country: string
  opportunityIndex: number
  marketSize: string
  growthRate: string
  mainDemandRegions: string[]
  keyCustomerTypes: string[]
  topProductTrends: string[]
  policySummary: string
  entryBarrier: string
  aiRecommendation: string
}

export interface CompetitorItem {
  id: string
  name: string
  country: string
  marketShare: string
  priceRange: string
  productStructure: string[]
  targetChannels: string[]
  coreAdvantages: string[]
  weaknesses: string[]
  ourCompetitiveEdge: string[]
}

export interface CommercialOpportunity {
  id: string
  title: string
  companyName: string
  country: string
  countryFlag: string
  industry: string
  opportunityLevel: 5 | 4 | 3
  discoveredTime: string
  demandSummary: string
  targetProduct: string
  estimatedVolume: string
  aiSuggestedAction: string
  status: 'new' | 'contacted' | 'negotiating'
  /** 对应客户情报矩阵中的 lead（画像/开发信联动） */
  leadRef?: string
}

export interface TaskHistoryItem {
  id: string
  title: string
  product: string
  market: string
  targetClients: string
  status: 'completed' | 'processing' | 'queued'
  date: string
  collectedCount: number
  identifiedCount: number
  qualifiedCount: number
  highPotentialCount: number
  keyLeadsCount: number
}

// ---- 演示行业预设（Header 下拉 / Home 快捷卡） ----
export const TRADE_PRESETS: {
  id: string
  name: string
  product: string
  market: string
  targetClients: string
}[] = [
  {
    id: 'aluminum_windows',
    name: '铝合金门窗 · 北美市场',
    product: '铝合金门窗、断桥铝系统窗、全景推拉门',
    market: '美国、加拿大',
    targetClients: '建材批发商、门窗经销商、工程承包商',
  },
  {
    id: 'solar_brackets',
    name: '智能光伏支架 · 西欧市场',
    product: '智能光伏支架与跟踪系统',
    market: '德国、西班牙、法国',
    targetClients: '光伏项目总包商、能源分销商',
  },
  {
    id: 'injection_molds',
    name: '精密注塑模具 · 东南亚市场',
    product: '精密注塑模具与机械零部件',
    market: '越南、泰国、印尼',
    targetClients: '注塑工厂、家电与汽配制造商',
  },
]

// ---- 客户情报矩阵顶部统计卡 ----
export const CUSTOMER_STATS = [
  { label: '全网采集企业', value: 1286 },
  { label: '有效识别目标', value: 823 },
  { label: '二次过滤合格', value: 237 },
  { label: '高潜商机客户', value: 38 },
  { label: 'A 级重点开发', value: 12 },
]

// ---- AI 采集流水线（10 步，ProgressView 使用） ----
export const CRAWL_STEPS: { title: string; detail: string; log: string }[] = [
  { title: '解析任务意图', detail: '提取产品关键词 / 目标市场 / 客户画像约束', log: '[TASK-PARSER] product=铝合金门窗 market=美国、加拿大' },
  { title: '生成检索策略', detail: '组合 32 组检索式覆盖 6 类数据源', log: '[STRATEGY] 32 queries × 6 sources compiled' },
  { title: '海关提单检索', detail: '按 HS 编码扫描 142 口岸进口提单', log: '[BILL-OF-LADING] 142 ports scanning…' },
  { title: '海外官网爬取', detail: '爬虫集群抓取候选企业官网并语义分析', log: '[CRAWLER] 214 corporate sites fetched' },
  { title: '黄页与地图挖掘', detail: 'Google 商业黄页 + 本地商户交叉验证', log: '[YELLOW-PAGE] +189 verified merchants' },
  { title: '展会名录匹配', detail: '对撞北美门窗/建材类展会买家名录', log: '[EXPO] IBS / Construct Canada matched' },
  { title: 'LLM 语义标注', detail: '逐企业标注产品结构 / 采购规模 / 合作意愿', log: '[LLM-TAG] 823 entities semantically tagged' },
  { title: '去重与实体消解', detail: '跨源合并同企业，保留置信度最高画像', log: '[DEDUP] 1,286 → 823 unique companies' },
  { title: '画像补全', detail: '补全官网 / 规模 / 认证 / 联系人信息', log: '[ENRICH] profile coverage 91.4%' },
  { title: '五维评分输出', detail: '输出情报矩阵并生成 A/B/C 分级', log: '[SCORE] 12 A-leads · 26 B-leads · 199 C-leads' },
]

// ---- 系统设置 · 数据接入通道状态 ----
export const DATA_CHANNELS: { name: string; status: string }[] = [
  { name: '全球海关提单实时接口 (142口岸)', status: 'CONNECTED' },
  { name: '海外企业官网爬虫与语义分析集群', status: 'RUNNING' },
  { name: '海外展会名录库与行业目录', status: 'READY' },
  { name: 'Google 地图与本地黄页商业认证', status: 'SYNCED' },
]

// ---- 五维评分维度 ----
export const SCORE_DIMENSIONS = [
  { key: 'productMatch', label: '产品匹配', weight: 30 },
  { key: 'companyScale', label: '企业规模', weight: 20 },
  { key: 'marketMatch', label: '市场匹配', weight: 20 },
  { key: 'purchasePotential', label: '采购潜力', weight: 15 },
  { key: 'cooperationProbability', label: '合作概率', weight: 15 },
]

export type ScoreKey = 'productMatch' | 'companyScale' | 'marketMatch' | 'purchasePotential' | 'cooperationProbability'

export interface LeadScore extends Record<ScoreKey, number> {}

// ---- 供应商（原型 mockSuppliers 全量） ----
export const mockSuppliers: SupplierItem[] = [
  {
    id: 'sup-01',
    name: '佛山市中欧精工铝业门窗制造有限公司',
    location: '广东省佛山市南海区大沥镇',
    province: '广东',
    mainProducts: ['高端断桥铝系统门窗', '重型折叠推拉门', '极窄边框全景门', '商业幕墙'],
    establishedYear: 2008,
    employeeScale: '350 - 500人',
    annualCapacity: '年产 450,000 ㎡',
    productMatch: 98,
    supplierScore: 96,
    tier: '重点供应商',
    certifications: ['AAMA', 'NFRC', 'CE', 'ISO9001', 'AS2047', 'Florida Miami-Dade NOA'],
    priceAdvantage: '高',
    moq: '100 ㎡ / 1个20GP柜',
    leadTime: '25 - 30 天',
    oemOdm: '支持深度ODM定制与北美包装标准',
    portrait: '华南顶尖外贸门窗代工标杆，拥有全自动德国叶鲁（Elumatec）数控加工中心，出口北美、澳洲历史超12年，熟悉欧美海运防震免熏蒸木箱包装。',
    advantages: ['具备全套美标NFRC/AAMA及佛州飓风认证', '资深英文工程图纸深化团队（AutoCAD/Revit）', '出货准时率99.2%，零重大索赔记录'],
  },
  {
    id: 'sup-02',
    name: '山东临朐华美铝业集团股份有限公司',
    location: '山东省潍坊市临朐县东城街道铝谷大厦',
    province: '山东',
    mainProducts: ['超厚多腔体节能断桥铝门窗', '耐寒注胶式系统窗', '阳极氧化型材'],
    establishedYear: 2003,
    employeeScale: '800 - 1200人',
    annualCapacity: '年产 800,000 ㎡',
    productMatch: 95,
    supplierScore: 94,
    tier: '重点供应商',
    certifications: ['CE', 'ISO9001', 'ISO14001', 'Qualicoat Class 2', 'Passive House PHI'],
    priceAdvantage: '极高',
    moq: '200 ㎡',
    leadTime: '20 - 25 天',
    oemOdm: '支持大规模OEM代工与型材开模定制',
    portrait: '江北最大铝型材与门窗制造重镇骨干企业，具备从铝棒熔铸、挤压、表面处理到成品门窗的全产业链闭环，成本控制处于行业极致水平。',
    advantages: ['源头铝锭直供，价格较华南低8-12%', '严寒地区多腔体保温系统专利丰富', '自有大型深加工保税车间'],
  },
  {
    id: 'sup-03',
    name: '浙江湖州德诺节能幕墙科技股份有限公司',
    location: '浙江省湖州市德清县武康工业区',
    province: '浙江',
    mainProducts: ['单元式玻璃幕墙', '超大板落地推拉门', '智能电动开窗器系统'],
    establishedYear: 2011,
    employeeScale: '280 - 400人',
    annualCapacity: '年产 350,000 ㎡',
    productMatch: 92,
    supplierScore: 91,
    tier: '优质供应商',
    certifications: ['ISO9001', 'CE', 'AS/NZS 4284', 'EN 13830'],
    priceAdvantage: '中等',
    moq: '150 ㎡',
    leadTime: '30 - 35 天',
    oemOdm: '专注大中型商用工程定制与幕墙总包配合',
    portrait: '长三角高端建筑门窗幕墙高新技术企业，毗邻上海及宁波舟山港，在异形大玻璃幕墙与五金智能联动方面处于领先地位。',
    advantages: ['上海港/宁波港直发，船期密集', '大跨度超白玻璃加工能力极强'],
  },
  {
    id: 'sup-04',
    name: '江苏常州美克斯铝制品有限公司',
    location: '江苏省常州市武进区高新技术产业开发区',
    province: '江苏',
    mainProducts: ['美式外开推拉窗', '法式折叠门', '户外铝合金凉亭与百叶'],
    establishedYear: 2015,
    employeeScale: '180 - 300人',
    annualCapacity: '年产 260,000 ㎡',
    productMatch: 90,
    supplierScore: 89,
    tier: '优质供应商',
    certifications: ['AAMA', 'ISO9001', 'FSC木铝认证'],
    priceAdvantage: '高',
    moq: '50 ㎡ (支持拼箱)',
    leadTime: '25 天',
    oemOdm: '柔性小批量高定制',
    portrait: '专注北美DIY零售建材超市及中小型分销商供应链，产品安装极其模块化，支持亚马逊及跨境电商托盘发货。',
    advantages: ['MOQ极低，支持快速打样与小柜测试', '配齐美式全套预冲孔与快装配件'],
  },
]

// ---- 市场机会（原型 mockMarketOpportunities 全量） ----
export const mockMarketOpportunities: MarketOpportunity[] = [
  {
    id: 'mkt-01',
    region: '美国西海岸市场 (California & Pacific Northwest)',
    country: 'United States',
    opportunityIndex: 91,
    marketSize: '$18.4 Billion / 年',
    growthRate: '+7.8% YoY',
    mainDemandRegions: ['加利福尼亚州 (CA)', '华盛顿州 (WA)', '俄勒冈州 (OR)', '内华达州 (NV)'],
    keyCustomerTypes: ['建材连锁批发商', '高端别墅门窗经销商', '绿色建筑总包商', '全景落地门系统零售商'],
    topProductTrends: ['Title 24高能效断桥铝窗', '超窄边框全景折叠/推拉门', '双银Low-E超白玻璃', '低碳再生环保铝门窗'],
    policySummary: '加州Title 24节能法规持续趋严，全美最高的电价驱动居民门窗节能置换，且对现代极简工业风铝门窗审美认可度极高。',
    entryBarrier: '需取得NFRC认证与AAMA测试报告，加州沿海需防盐雾测试。',
    aiRecommendation: '主推U值≤0.28（美标）的高隔热断桥铝系统，搭配现代极简黑/深灰氟碳喷涂，重点突破西海岸大型独立建材批发商。',
  },
  {
    id: 'mkt-02',
    region: '美国南部阳光地带 (Texas & Florida & Sunbelt)',
    country: 'United States',
    opportunityIndex: 87,
    marketSize: '$15.2 Billion / 年',
    growthRate: '+9.4% YoY',
    mainDemandRegions: ['德克萨斯州 (TX)', '佛罗里达州 (FL)', '佐治亚州 (GA)', '亚利桑那州 (AZ)'],
    keyCustomerTypes: ['抗飓风门窗专业商', '新房承建商 (Home Builders)', '区域大型仓储批发商'],
    topProductTrends: ['Miami-Dade抗飓风防爆门窗 (Impact Windows)', '超低SHGC隔热窗', '大跨度庭院推拉门'],
    policySummary: '全美人口迁入第一大区，新房开工量持续位居全美榜首；佛州法律强制沿海建筑安装抗飓风门窗。',
    entryBarrier: '佛州Miami-Dade NOA认证极度严苛，周期长但利润极高；德州更偏好高交付弹性和稳定交期。',
    aiRecommendation: '分两线出击：德州主攻大体量标准断桥铝窗，佛州与具备NOA测试能力的实验室合作主推抗冲击高端线。',
  },
  {
    id: 'mkt-03',
    region: '加拿大市场 (Ontario, BC & Alberta)',
    country: 'Canada',
    opportunityIndex: 82,
    marketSize: '$6.8 Billion / 年',
    growthRate: '+5.5% YoY',
    mainDemandRegions: ['安大略省多伦多 (ON)', '卑诗省温哥华 (BC)', '阿尔伯塔省卡尔加里 (AB)'],
    keyCustomerTypes: ['高寒节能门窗批发商', '公寓幕墙改造总包', '工程门窗安装公司'],
    topProductTrends: ['三玻两腔多腔体断桥铝窗', 'Energy Star Zone 3认证门窗', '内倒平开一体窗 (Tilt & Turn)'],
    policySummary: '联邦Greener Homes Grant节能换窗补贴政策持续刺激市场，冬季漫长极寒对气密性与保温性有刚性要求。',
    entryBarrier: '需满足加拿大Energy Star高标准及CSA A440规范。',
    aiRecommendation: '利用中国在三玻两腔中空玻璃与大腔体注胶断桥上的成本优势，精准替代昂贵的欧洲进口品牌。',
  },
  {
    id: 'mkt-04',
    region: '澳大利亚与新西兰 (Oceania)',
    country: 'Australia & New Zealand',
    opportunityIndex: 88,
    marketSize: '$5.6 Billion / 年',
    growthRate: '+6.2% YoY',
    mainDemandRegions: ['新南威尔士州悉尼', '维多利亚州墨尔本', '昆士兰州布里斯班', '奥克兰'],
    keyCustomerTypes: ['门窗组装厂 (Fabricators)', '建材连锁店', '工程总包商'],
    topProductTrends: ['AS2047合规推拉门', '重型双折门 (Bifold Doors)', '纱窗一体化防蚊窗'],
    policySummary: '中澳自贸协定（ChAFTA）零关税，海运直达仅需12-16天，澳洲NCC 7星节能规范生效带来强劲换窗需求。',
    entryBarrier: '必须通过AS2047及AS1288认证检测。',
    aiRecommendation: '以零关税与短交期为核心抓手，重点切入悉尼和墨尔本中大型组装厂的半成品与成品整柜采购。',
  },
]

// ---- 竞品（原型 mockCompetitors 全量） ----
export const mockCompetitors: CompetitorItem[] = [
  {
    id: 'comp-01',
    name: 'Andersen Windows & Doors (US Domestic Leader)',
    country: 'United States',
    marketShare: '18.5% (北美第一梯队)',
    priceRange: '$$$$$ (高昂, 单樘 $1,200 - $3,500)',
    productStructure: ['Fibrex复合门窗', '高端铝包木门窗', '建筑级铝合金幕墙'],
    targetChannels: ['The Home Depot独家专柜', '全美自建经销商专卖网', '高端建筑师推荐'],
    coreAdvantages: ['百年品牌号召力', '全美无死角售后服务网', '顶级AAMA/NFRC认证壁垒'],
    weaknesses: ['交期过长（普遍12-16周）', '价格极高，中端工程客户预算吃紧', '定制灵活性差，非标尺寸加价昂贵'],
    ourCompetitiveEdge: [
      '综合制造成本降低 40% - 55%',
      '交期缩短至 4 - 5 周（含海运约7-8周）',
      '超高非标自由度，支持完全按照建筑图纸100%定制',
      '同样达到NFRC美标隔热性能指标',
    ],
  },
  {
    id: 'comp-02',
    name: 'Pella Corporation',
    country: 'United States',
    marketShare: '14.2%',
    priceRange: '$$$$ (高, 单樘 $900 - $2,800)',
    productStructure: ['铝包木', '乙烯基塑钢', '现代窄边铝合金窗'],
    targetChannels: ['Lowe’s建材超市', 'Pella专业展厅网络'],
    coreAdvantages: ['专利百叶内置中空玻璃技术', '品牌渗透率极高'],
    weaknesses: ['极窄全景门产品线更新缓慢', '代理商利润空间被压榨（毛利仅15-20%）'],
    ourCompetitiveEdge: [
      '为当地经销商提供 40%+ 的丰厚分销毛利空间',
      '现代极窄边框（20mm视面）全景移门产品力领先一代',
      '支持贴牌OEM专属品牌定制，帮助经销商建立自有品牌资产',
    ],
  },
  {
    id: 'comp-03',
    name: 'Schüco International (German Premium Brand)',
    country: 'Germany / Global',
    marketShare: '6.8% (高端豪宅与公建垄断)',
    priceRange: '$$$$$$ (奢侈级, 单樘 $2,500 - $8,000+)',
    productStructure: ['顶级断桥铝合金系统门窗', '智能隐藏五金系统', '大型商业幕墙'],
    targetChannels: ['全球高端授权加工商', '地标建筑设计院指定'],
    coreAdvantages: ['全球公认最高技术标准与品牌溢价', '极致的五金阻尼与气密性'],
    weaknesses: ['价格昂贵到普通住宅难以承受', '配件垄断，维修替换成本极高', '欧洲供应链受地缘政治波动'],
    ourCompetitiveEdge: [
      '以 1/3 的价格实现 90% 以上的德系系统门窗工艺品质',
      '五金件兼容德国原厂（Siegenia/GU/Roto）与高性价比国产品牌',
      '响应敏捷，工程师24小时在线提供深化图纸',
    ],
  },
]

// ---- 竞品突围策略卡（原型 CompetitorIntelligenceView 本地数组） ----
export const BREAKTHROUGH_STRATEGIES: { title: string; desc: string; metric: string }[] = [
  { title: '成本错位', desc: '以 1/3 价格实现 90%+ 的德系系统门窗品质', metric: '成本 -40%~55%' },
  { title: '交期错位', desc: '大牌 12-16 周交付，中国直发含海运 7-8 周到港', metric: '交期 4-5 周' },
  { title: '定制错位', desc: '非标尺寸 100% 按建筑图纸定制，不做标准品加价', metric: '非标自由' },
  { title: '渠道错位', desc: '40%+ 分销毛利 + 自有品牌贴牌，帮经销商建品牌资产', metric: '毛利 +40%' },
  { title: '服务错位', desc: '工程师 24 小时在线深化图纸，替代大牌 2 周排期', metric: '响应 24h' },
]

// ---- 商机雷达（原型 mockOpportunities 全量 + leadRef 画像联动） ----
export const mockOpportunities: CommercialOpportunity[] = [
  {
    id: 'opp-rt-01',
    title: '加州尔湾（Irvine）高端联排别墅群门窗集中采购询价',
    companyName: 'Pacific West Builders & Fenestration Group',
    country: 'United States',
    countryFlag: '🇺🇸',
    industry: '住宅开发与门窗工程',
    opportunityLevel: 5,
    discoveredTime: '12分钟前',
    demandSummary: '正在公开招标采购180套联排别墅的极窄边框铝合金提升推拉门（4.2米宽x2.8米高）及断桥平开窗，需符合加州Title 24标准。',
    targetProduct: '重型提升推拉门 / 极窄外平开窗',
    estimatedVolume: '约 12,500 ㎡ / 预算 $1,800,000',
    aiSuggestedAction: '立即调取西海岸合规产品库，一键生成针对该项目的合规技术方案书与初步FOB/CIF报价单。',
    status: 'new',
    leadRef: 'lead-01',
  },
  {
    id: 'opp-rt-02',
    title: '多伦多大型建材经销商新增中国断桥铝产品线',
    companyName: 'Great North Building Supplies Ltd',
    country: 'Canada',
    countryFlag: '🇨🇦',
    industry: '建材与门窗批发',
    opportunityLevel: 5,
    discoveredTime: '45分钟前',
    demandSummary: '官网发布公告宣布终止与波兰供应商合作，正在全球范围内寻找3家高品质中国断桥铝门窗ODM代工厂，要求月供货量≥8个40HQ。',
    targetProduct: '三玻两腔节能断桥铝门窗',
    estimatedVolume: '年采购额约 $3,500,000',
    aiSuggestedAction: '直接联系其采购总监，发送加国严寒地区成功案例与工厂实景验厂VR链接。',
    status: 'new',
    leadRef: 'lead-02',
  },
  {
    id: 'opp-rt-03',
    title: '佛罗里达迈阿密沿海公寓抗飓风门窗紧急补单',
    companyName: 'Coastal Shield Impact Windows LLC',
    country: 'United States',
    countryFlag: '🇺🇸',
    industry: '抗冲击门窗分销',
    opportunityLevel: 4,
    discoveredTime: '2小时前',
    demandSummary: '现有本地工厂产能爆满无法交货，急需在30天内空运/快船补充200樘抗风压夹胶玻璃阳台推拉门。',
    targetProduct: 'Miami-Dade Impact-Rated Sliding Doors',
    estimatedVolume: '紧急订单 $320,000 (支持高溢价)',
    aiSuggestedAction: '发送抗飓风检测认证资质与绿色保供通道承诺函。',
    status: 'new',
    leadRef: 'lead-03',
  },
  {
    id: 'opp-rt-04',
    title: '悉尼商住综合体项目幕墙及大堂无框玻璃门标段',
    companyName: 'Apex Facade Australia Pty Ltd',
    country: 'Australia',
    countryFlag: '🇦🇺',
    industry: '商业幕墙工程',
    opportunityLevel: 4,
    discoveredTime: '4小时前',
    demandSummary: '寻找具备AS2047认证的商用铝合金重型平开门及单元式幕墙分包供应商。',
    targetProduct: '商用单元式幕墙 & 自动感应铝合金大门',
    estimatedVolume: '工程总额 A$2,400,000',
    aiSuggestedAction: '提供中澳自贸协定零关税原产地证（Form COO）申办承诺与工程报价单。',
    status: 'contacted',
    leadRef: 'lead-08',
  },
]

// ---- 历史任务（原型 mockTaskHistory 全量） ----
export const mockTaskHistory: TaskHistoryItem[] = [
  {
    id: 'task-001',
    title: '美国与加拿大门窗批发商及经销商',
    product: '铝合金门窗、断桥铝系统窗、全景推拉门',
    market: '美国、加拿大',
    targetClients: '建材批发商、门窗经销商、工程承包商',
    status: 'completed',
    date: '2026-09-02 14:20',
    collectedCount: 1286,
    identifiedCount: 823,
    qualifiedCount: 237,
    highPotentialCount: 38,
    keyLeadsCount: 12,
  },
  {
    id: 'task-002',
    title: '德国及西欧工业设备与精密五金采购商',
    product: '工业铝型材、门窗五金配件、冲压件',
    market: '德国、奥地利、瑞士、荷兰',
    targetClients: '工业设备集成商、精密五金分销商',
    status: 'completed',
    date: '2026-08-29 09:15',
    collectedCount: 940,
    identifiedCount: 610,
    qualifiedCount: 128,
    highPotentialCount: 24,
    keyLeadsCount: 8,
  },
  {
    id: 'task-003',
    title: '东南亚绿色建材与热带铝合金门窗市场分析',
    product: '热带防水防风门窗、外置遮阳百叶',
    market: '新加坡、马来西亚、泰国、印尼',
    targetClients: '绿色建筑总包商、五星级酒店装饰工程',
    status: 'completed',
    date: '2026-08-25 16:40',
    collectedCount: 750,
    identifiedCount: 480,
    qualifiedCount: 96,
    highPotentialCount: 18,
    keyLeadsCount: 6,
  },
]

// ---- 客户线索（独立文件，体积大） ----
export { mockCustomerLeads, mockLeads } from './tradeLeads'
