// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 工作台 Demo 数据层（类型 + 常量）
// 忠实取自选品原型：
//   docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/types.ts + src/data/mockData.ts
// 产品/供应商大体积数据单独存放于 ./ecomProducts.ts（本文件 re-export）。
//
// 移植修复（相对原型）：
//   1. NavigationTab 13 值收敛为 EcomView（Sidebar/App 不再各自一套导致错位）
//   2. SupplierItem 统一 schema：establishedYear + aiMatchReason + mainProducts + advantages 必填
//   3. 三套默认任务参数收敛为单一 DEFAULT_TASK_INPUT（美国/Amazon/宠物用品/¥100,000/35%/贸易型卖家）
//   4. 12 步执行清单文案模板化：buildEcomAnalysisSteps 随 taskParams 实时生成，不再写死默认示例参数
// ============================================================================

// ---- 工作台视图 id（EcomSelectionDemo 侧栏 + 各视图分发，13 视图） ----
export type EcomView =
  | 'home'
  | 'agent-executing'
  | 'selection-report'
  | 'product-detail'
  | 'market-intel'
  | 'competitor-analysis'
  | 'consumer-insights'
  | 'profit-calc'
  | 'supplier-hub'
  | 'strategy-listing'
  | 'my-selection'
  | 'task-center'
  | 'settings'

export type TargetMarket = '美国' | '加拿大' | '英国' | '德国' | '澳大利亚' | '日本' | '新加坡'
export type PlatformType = 'Amazon' | 'TikTok Shop' | 'Walmart' | 'Shopee'
export type SellerType = '工厂型卖家' | '贸易型卖家' | '品牌型卖家' | '个人创业者'
export type Currency = 'USD' | 'CNY'

export interface TaskInput {
  targetMarket: TargetMarket
  platform: PlatformType
  category: string
  subCategory?: string
  /** 预算（人民币） */
  budget: number
  /** 目标毛利率（%） */
  targetMargin: number
  sellerType?: SellerType
  requirements?: string
  additionalRequirements?: string
  customKeyword?: string
}

export interface ScoreBreakdown {
  /** 市场需求 */
  marketDemand: number
  /** 增长趋势 */
  growthTrend: number
  /** 竞争程度（分越高越容易进入） */
  competitionEase: number
  /** 利润空间 */
  profitMargin: number
  /** 差异化空间 */
  differentiationSpace: number
  /** 用户痛点明显度 */
  userPainPoints: number
  /** 进入难度（分越高越容易） */
  entryDifficultyEase: number
}

export interface CompetitorItem {
  id: string
  name: string
  brand: string
  asin: string
  price: number
  rating: number
  reviews: number
  estimatedMonthlySales: string | number
  competitionLevel: string
  mainPros: string
  mainCons: string
  badge?: string
}

export interface PainPointItem {
  id: string
  title: string
  frequency: string
  percentage: number
  description: string
  sampleQuote: string
  impactLevel: '极高' | '高' | '中'
}

export interface SupplierItem {
  id: string
  name: string
  province: string
  location: string
  moq: number
  unitPrice: number
  /** 综合匹配度 95% */
  matchRate: number
  /** 平台评分 92 */
  rating: number
  certifications: string[]
  leadTime: string
  dailyCapacity: string
  oemOdm: boolean
  /** 建厂年份（统一字段，修复原型 establishedYears/establishedYear 错位） */
  establishedYear: number
  factorySize: string
  phone?: string
  /** 主营产品线（供供应商库搜索，修复原型空数组崩溃） */
  mainProducts: string[]
  /** 核心优势 */
  advantages: string[]
  /** AI 推荐理由（画像弹窗主文案） */
  aiMatchReason: string
}

export interface ProductFeatureDiff {
  id: string
  featureNumber: string
  name: string
  description: string
  userBenefit: string
  techDifficulty: '低' | '中' | '高'
}

export type ProductStatus = '待验证' | '验证中' | '供应商询价' | '竞品分析' | '打样' | '寄样' | '上架'

export interface ProductOpportunity {
  id: string
  nameEn: string
  nameCn: string
  category: string
  subCategory: string
  rank: number
  /** 综合机会分 92 / 100 */
  score: number
  tags: string[]
  aiConclusion: string
  badge: '重点推荐' | '高潜机会' | '潜力储备'

  // Economics
  sellingPrice: number
  sourcingCost: number
  shippingCost: number
  platformFee: number
  adCost: number
  otherCost: number
  unitProfit: number
  grossMargin: number

  scoreBreakdown: ScoreBreakdown

  // Demand
  searchTrend12M: { month: string; volume: number; index: number }[]
  searchGrowth: string
  seasonality: string
  aiDemandAnalysis: string

  // Competitors
  competitorsOverview: { total: number; head: number; mid: number; longTail: number }
  competitorsList: CompetitorItem[]
  competitorAiStrategy: string

  // Consumer insights
  reviewsAnalyzedCount: number
  topPainPoints: PainPointItem[]
  userWishlist: string[]
  aiSuggestedProductHeadline: string
  whyBuyReasons: string[]
  whyNotBuyReasons: string[]

  // Differentiation
  differentiationFeatures: ProductFeatureDiff[]
  differentiationSummary: string

  // Suppliers
  matchedSuppliers: SupplierItem[]

  // Strategy
  productStrategy: {
    positioning: string
    suggestedPriceRange: string
    coreUSPs: string[]
    targetAudience: string[]
    marketGaps: string[]
  }

  // Amazon Listing
  amazonListing: {
    title: string
    bulletPoints: string[]
    description: string
    searchKeywords: string[]
  }

  // Final Recommendation
  finalDecision: {
    verdict: string
    scoreText: string
    stars: number
    recommendationAction: string
    pros: string[]
    risks: string[]
    nextSteps: string[]
  }

  status?: ProductStatus
  isSaved?: boolean
}

export interface CategoryIntelligence {
  id: string
  country: TargetMarket
  platform: PlatformType
  category: string
  opportunityIndex: number
  demandGrowth: string
  avgPrice: number
  avgRating: number
  competitionIndex: number
  salesVolume: string
  marketShareTrend: 'rapidly_growing' | 'stable' | 'competitive'
  topSubcategories: string[]
  highlight: string
}

export interface AgentTaskLog {
  id: string
  taskName: string
  targetMarket: TargetMarket
  platform: PlatformType
  category: string
  budget: string
  timestamp: string
  duration: string
  status: 'completed' | 'running' | 'queued'
  productsFound: number
  opportunitiesFound: number
  topRecommendation: string
}

// ---- 站点 / 平台 / 卖家类型选项（Header/Home/Settings/NewTask 共用） ----
export const TARGET_MARKETS: TargetMarket[] = ['美国', '加拿大', '英国', '德国', '澳大利亚', '日本', '新加坡']
export const PLATFORMS: PlatformType[] = ['Amazon', 'TikTok Shop', 'Walmart', 'Shopee']
export const SELLER_TYPES: SellerType[] = ['工厂型卖家', '贸易型卖家', '品牌型卖家', '个人创业者']

// ---- 唯一默认任务参数源（修复原型 Home / App / NewTaskModal 三套不一致） ----
export const DEFAULT_TASK_INPUT: TaskInput = {
  targetMarket: '美国',
  platform: 'Amazon',
  category: '宠物用品 (Pet Supplies)',
  budget: 100000,
  targetMargin: 35,
  sellerType: '贸易型卖家',
  additionalRequirements: '希望寻找高需求、痛点明确、具备差异化空间且避开公模价格战的蓝海出行产品。',
}

export interface EcomAnalysisStep {
  id: number
  text: string
  time: string
}

// 12 步执行清单文案模板（{budgetK}/{margin}/{market}/{platform}/{category} 由当前任务实时注入，
// 避免新建任务后步骤文字仍停留在默认示例的 ¥100k/美国/Amazon/宠物用品）
const ECOM_STEP_TEMPLATES: { text: string; time: string }[] = [
  { text: '正在理解选品需求与约束条件 (预算¥{budgetK}k / 毛利≥{margin}%)', time: '0.4s' },
  { text: '正在抓取{market} {platform} {category}类目海量大盘数据', time: '0.9s' },
  { text: '正在分析过去 12 个月搜索热度与 Google Trends 趋势', time: '1.4s' },
  { text: '正在识别全网消费者高频使用场景与核心需求', time: '1.9s' },
  { text: '正在扫描 BSR 畅销榜 Top 500 热门产品与潜力新品', time: '2.5s' },
  { text: '正在统计竞品数量分布与头部品牌垄断度 (CR4/CR8)', time: '3.1s' },
  { text: '正在拟合价格区间分布与最佳定价甜蜜点 ($15-$30)', time: '3.7s' },
  { text: '正在深度挖掘 12,846 条真实买家差评与退货反馈', time: '4.3s' },
  { text: '正在提炼未被满足的用户核心痛点与改良机会', time: '4.9s' },
  { text: '正在寻找结构性蓝海机会与产品差异化方案', time: '5.5s' },
  { text: '正在结合头程海运/FBA测算单位模型与毛利空间', time: '6.1s' },
  { text: '正在执行多维度算法加权，输出产品机会评分排行榜', time: '6.8s' },
]

/** 依据当前任务参数实时生成 12 步执行清单（预算按千元紧凑展示；类目去除括号备注仅保留中文名） */
export const buildEcomAnalysisSteps = (input: TaskInput): EcomAnalysisStep[] => {
  const vars: Record<string, string> = {
    budgetK: String(Math.round(input.budget / 1000)),
    margin: String(input.targetMargin),
    market: input.targetMarket,
    platform: input.platform,
    category: input.category.split(' (')[0],
  }
  return ECOM_STEP_TEMPLATES.map((s, i) => ({
    id: i + 1,
    text: s.text.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? ''),
    time: s.time,
  }))
}

export const GLOBAL_CATEGORY_INTEL: CategoryIntelligence[] = [
  {
    id: 'intel-pet-us',
    country: '美国',
    platform: 'Amazon',
    category: '宠物用品 (Pet Supplies)',
    opportunityIndex: 87,
    demandGrowth: '+23.4%',
    avgPrice: 18.6,
    avgRating: 4.4,
    competitionIndex: 62,
    salesVolume: '$4.2B / 年',
    marketShareTrend: 'rapidly_growing',
    topSubcategories: ['宠物出行与便携用品', '慢食与健康喂食器', '智能宠物电子', '宠物美容与清洁', '训练与益智玩具'],
    highlight: '户外出行与健康养护两大赛道复合增速超35%，中端差异化产品机会丰富。',
  },
  {
    id: 'intel-pet-uk',
    country: '英国',
    platform: 'Amazon',
    category: '宠物用品 (Pet Supplies)',
    opportunityIndex: 82,
    demandGrowth: '+18.9%',
    avgPrice: 16.8,
    avgRating: 4.3,
    competitionIndex: 58,
    salesVolume: '£850M / 年',
    marketShareTrend: 'stable',
    topSubcategories: ['雨季防水防泥出行', '保暖透气狗窝', '环保可降解拾便袋'],
    highlight: '英国天气多雨湿润，防水便携类用品搜索增速显著。',
  },
  {
    id: 'intel-pet-de',
    country: '德国',
    platform: 'Amazon',
    category: '宠物用品 (Haustier)',
    opportunityIndex: 84,
    demandGrowth: '+19.5%',
    avgPrice: 22.4,
    avgRating: 4.5,
    competitionIndex: 55,
    salesVolume: '€1.1B / 年',
    marketShareTrend: 'rapidly_growing',
    topSubcategories: ['高品质环保耐咬玩具', '汽车安全出行防护', '天然有机粮补充用具'],
    highlight: '德国消费者极度重视材质安全与耐用度，对高客单认证产品接受度极高。',
  },
  {
    id: 'intel-outdoor-us',
    country: '美国',
    platform: 'Amazon',
    category: '户外与运动 (Sports & Outdoors)',
    opportunityIndex: 79,
    demandGrowth: '+15.2%',
    avgPrice: 28.5,
    avgRating: 4.3,
    competitionIndex: 72,
    salesVolume: '$8.6B / 年',
    marketShareTrend: 'competitive',
    topSubcategories: ['轻量露营装备', '折叠便携椅', '水上充气桨板配件', '夜间运动照明'],
    highlight: '类目规模庞大但头部竞争激烈，需切入轻量化或特色细分场景。',
  },
  {
    id: 'intel-home-us',
    country: '美国',
    platform: 'Amazon',
    category: '家居与厨房 (Home & Kitchen)',
    opportunityIndex: 76,
    demandGrowth: '+12.8%',
    avgPrice: 24.2,
    avgRating: 4.2,
    competitionIndex: 80,
    salesVolume: '$12.4B / 年',
    marketShareTrend: 'competitive',
    topSubcategories: ['收纳整理系统', '咖啡与茶饮器具', '空气炸锅周边配件', '微纤维快干毛巾'],
    highlight: '高频红海类目，需结合多功能组合或专利微创新切入。',
  },
  {
    id: 'intel-pet-jp',
    country: '日本',
    platform: 'Amazon',
    category: '宠物用品 (ペット用品)',
    opportunityIndex: 81,
    demandGrowth: '+16.7%',
    avgPrice: 21.0,
    avgRating: 4.6,
    competitionIndex: 52,
    salesVolume: '¥180B / 年',
    marketShareTrend: 'stable',
    topSubcategories: ['超小户型猫咪用品', '静音低噪梳毛器', '超轻便推车与背包'],
    highlight: '日本居住空间紧凑且极注重邻里静音，精致小巧静音型产品溢价极高。',
  },
]

/** 任务中心展示用（原型 TaskCenterView 硬编码 3 条，移植为数据驱动） */
export const ECOM_TASK_LOGS: AgentTaskLog[] = [
  {
    id: 'task-001',
    taskName: '美国 Amazon 宠物用品选品洞察',
    targetMarket: '美国',
    platform: 'Amazon',
    category: '宠物用品',
    budget: '¥100,000',
    timestamp: '2026-09-02 08:30',
    duration: '6.8s',
    status: 'completed',
    productsFound: 1286,
    opportunitiesFound: 47,
    topRecommendation: '便携防漏大容量宠物随行水杯 (92分)',
  },
  {
    id: 'task-002',
    taskName: '德国 Amazon 户外露营配件机会挖掘',
    targetMarket: '德国',
    platform: 'Amazon',
    category: '户外与运动',
    budget: '¥150,000',
    timestamp: '2026-09-01 16:20',
    duration: '7.2s',
    status: 'completed',
    productsFound: 940,
    opportunitiesFound: 32,
    topRecommendation: '超轻折叠战术钛合金露营水壶 (89分)',
  },
  {
    id: 'task-003',
    taskName: '日本 Amazon 居家收纳与小家电周边',
    targetMarket: '日本',
    platform: 'Amazon',
    category: '家居生活',
    budget: '¥80,000',
    timestamp: '2026-08-30 11:15',
    duration: '5.9s',
    status: 'completed',
    productsFound: 780,
    opportunitiesFound: 24,
    topRecommendation: '抽屉式静音磁吸保鲜膜切割盒 (86分)',
  },
]

// re-export 大体积产品/供应商数据（见 ecomProducts.ts）
export {
  PRIMARY_PRODUCT,
  TOP_PRODUCTS,
  MOCK_OPPORTUNITIES,
  ECOM_SUPPLIER_DB,
} from './ecomProducts'
