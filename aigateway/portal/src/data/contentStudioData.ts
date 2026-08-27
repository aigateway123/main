// ============================================================
// 内容增长工作台（Content Studio）预置数据
// 还原自外部 demo：爆款工厂-v1（面向内容创作者/带货团队/电商商家）
// ============================================================

// ------------------------------------------------------------ 类型定义
export type StudioView =
  | 'dashboard'
  | 'radar'
  | 'dissect'
  | 'topics'
  | 'generation'
  | 'replies'
  | 'diagnostics'
  | 'assets'
  | 'agent_hub'
  | 'settings'

export interface StudioStat {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: string
}

export interface RadarPost {
  id: string
  title: string
  cover: string
  likes: number
  collects: number
  comments: number
  date: string
  category: string
  url: string
}

export interface DissectAnalysis {
  titleStructure: string
  hookStructure: string
  bodyStructure: string
  emotionTriggers: string
  commentTactics: string
  conversionDrivers: string
}

export interface DissectReport {
  title: string
  content: string
  analysis: DissectAnalysis
}

export interface TopicIdea {
  title: string
  angle: string
  explosiveIndex: number
  competitionRate: number
  conversionPotential: number
  hook: string
}

export interface GeneratedContent {
  titleOptions: string[]
  bodyText: string
  tags: string[]
  coverText: string
  suggestedImages: string[]
}

export interface ReplyItem {
  scenario: string
  reply: string
}

export interface DmItem {
  trigger: string
  reply: string
}

export interface SalesClosingItem {
  step: string
  lines: string
}

export interface ConversionsPack {
  commentsReplies: ReplyItem[]
  dmReplies: DmItem[]
  salesClosing: SalesClosingItem[]
}

export interface DiagnosticsResult {
  metrics: { ctr: number; engagementRate: number; conversionRate: number }
  evaluation: string
  issues: string[]
  suggestions: string[]
  growthPlan: { phase: string; action: string }[]
}

export type StudioAssetType = 'copy' | 'topic' | 'script' | 'image' | 'preset'

export interface StudioAsset {
  id: string
  title: string
  type: StudioAssetType
  category: string
  tags: string[]
  content: string
  createdAt: string
}

export interface StudioAgent {
  id: string
  name: string
  role: string
  status: 'active' | 'idle'
  tasksExecuted: number
  successRate: string
  logs: string[]
}

// ------------------------------------------------------------ Dashboard
export const DASHBOARD_STATS: StudioStat[] = [
  { title: '今日全网热点数', value: '3,842', change: '+14.8%', isPositive: true, icon: 'flame' },
  { title: '今日新增起号爆文', value: '1,248', change: '+8.3%', isPositive: true, icon: 'award' },
  { title: '已生成AI增长内容', value: '852 篇', change: '+24.5%', isPositive: true, icon: 'file' },
  { title: '矩阵账号粉丝预估增长', value: '24.5 K', change: '+18.2%', isPositive: true, icon: 'trend' },
]

export const HOT_INDUSTRIES = [
  { rank: 1, name: '时尚穿搭', heat: 98, keyword: '新中式 / 废土风 / 复古辣妹', trend: 'up' },
  { rank: 2, name: '美妆护肤', heat: 92, keyword: '精简护肤 / 早C晚A / 以油养肤', trend: 'up' },
  { rank: 3, name: '减肥健身', heat: 87, keyword: '暴汗低卡 / 空腹有氧 / 代餐测评', trend: 'up' },
  { rank: 4, name: '母婴育儿', heat: 79, keyword: '沉浸式带娃 / 辅食教程 / 科学育儿', trend: 'flat' },
  { rank: 5, name: 'AI科技体验', heat: 74, keyword: 'AI绘图 / 提效神器 / 智能家居', trend: 'up' },
]

export const HOT_KEYWORDS = [
  { name: '新中式穿搭', tag: '穿搭', volume: '125W+', level: '极高' },
  { name: '减脂代餐', tag: '减肥', volume: '95W+', level: '极高' },
  { name: '抗老精华测评', tag: '护肤', volume: '84W+', level: '高' },
  { name: '自媒体涨粉公式', tag: 'AI/干货', volume: '72W+', level: '高' },
  { name: '科学高效带娃', tag: '母婴', volume: '61W+', level: '中' },
]

// 7 天流量趋势（爆文数量 / 大盘指数）
export const TREND_DAYS = ['06-01', '06-02', '06-03', '06-04 (爆点)', '06-05', '06-06', '今日 (06-07)']
export const TREND_VIRAL = [120, 168, 145, 320, 260, 300, 352]
export const TREND_INDEX = [60, 74, 68, 96, 84, 92, 100]

// 产出效率进度条
export const OUTPUT_EFFICIENCY = [
  { label: '小红书图文文案', value: '412 篇 (48.3%)', width: 48.3, color: 'bg-orange-500' },
  { label: '短视频脚本分镜', value: '224 篇 (26.2%)', width: 26.2, color: 'bg-violet-500' },
  { label: '评论区引流成交话术', value: '134 套 (15.7%)', width: 15.7, color: 'bg-emerald-500' },
  { label: '爆款大纲/爆文拆解报告', value: '82 份 (9.8%)', width: 9.8, color: 'bg-amber-500' },
]

// ------------------------------------------------------------ 爆款雷达
export const RADAR_POSTS: RadarPost[] = [
  {
    id: 'p1',
    title: '🔥 救命！这大码女装穿搭绝了！130斤穿出90斤既视感',
    cover: '👚 高饱和新中式显瘦长裙穿搭',
    likes: 18400,
    collects: 14500,
    comments: 680,
    date: '2026-06-06',
    category: '穿搭',
    url: 'https://xiaohongshu.com/discovery/item/p1',
  },
  {
    id: 'p2',
    title: '😱 别乱刷脂了！一个日本医生私藏的懒人空腹暴汗公式',
    cover: '🥑 极简低热卡燃脂配餐图示',
    likes: 24500,
    collects: 19800,
    comments: 1100,
    date: '2026-06-05',
    category: '减肥',
    url: 'https://xiaohongshu.com/discovery/item/p2',
  },
  {
    id: 'p3',
    title: '🧪 深度评测：20个热门抗初老面霜，到底谁在收智商税？',
    cover: '🧴 20款热门面霜酸碱及吸收度评测',
    likes: 9800,
    collects: 8400,
    comments: 420,
    date: '2026-06-06',
    category: '护肤',
    url: 'https://xiaohongshu.com/discovery/item/p3',
  },
  {
    id: 'p4',
    title: '👶 带娃神推！每天5分钟宝宝自主训练进食全步骤',
    cover: '🥣 辅食不锈钢餐盘精美摆盘',
    likes: 12500,
    collects: 11300,
    comments: 390,
    date: '2026-06-04',
    category: '母婴',
    url: 'https://xiaohongshu.com/discovery/item/p4',
  },
  {
    id: 'p5',
    title: '🤖 听劝！用上这3个免费AI网站，打工人准点摸鱼跑路',
    cover: '💻 效率软件与全屏自动化脚本截图',
    likes: 31200,
    collects: 28400,
    comments: 1840,
    date: '2026-06-06',
    category: 'AI',
    url: 'https://xiaohongshu.com/discovery/item/p5',
  },
  {
    id: 'p6',
    title: '💄 新手3分钟出门妆！消肿眼影画法保姆级教学',
    cover: '👁️ 放大双眼细节眼影晕染图',
    likes: 8500,
    collects: 6900,
    comments: 290,
    date: '2026-06-07',
    category: '护肤',
    url: 'https://xiaohongshu.com/discovery/item/p6',
  },
  {
    id: 'p7',
    title: '🥗 空气炸锅10分钟搞定低卡照烧鸡腿，嫩到爆汁',
    cover: '🍗 淋满酱料热气腾腾的空气炸锅鸡腿',
    likes: 15400,
    collects: 12900,
    comments: 512,
    date: '2026-06-06',
    category: '美食',
    url: 'https://xiaohongshu.com/discovery/item/p7',
  },
  {
    id: 'p8',
    title: '💔 关系破冰：高情商沟通术，几句话让对方主动低头',
    cover: '💌 两性温情沟通与书纸速写信封',
    likes: 21900,
    collects: 17200,
    comments: 930,
    date: '2026-06-05',
    category: '情感',
    url: 'https://xiaohongshu.com/discovery/item/p8',
  },
]

// 拆解样例（2 个）
export const DISSECT_SAMPLES = [
  { label: '#新中式女装起号爆款', url: 'https://xiaohongshu.com/discovery/item/p1_china_style' },
  { label: '#高效减脂代餐风口', url: 'https://xiaohongshu.com/discovery/item/p2_lazy_diet' },
]

// 预置拆解报告（模拟 AI 拆解结果）
export const PRESET_DISSECT_REPORT: DissectReport = {
  title: '救命！这大码女装穿搭绝了！130斤穿出90斤既视感',
  content:
    '姐妹们真的别划走！大码女孩的痛我都懂——宽松显胖、紧身勒肉，穿什么都像套麻袋。今天这套新中式显瘦长裙穿搭，高腰+垂坠剪裁+露脚踝，肉肉全藏住，视觉直接瘦 20 斤！搭配珍珠盘扣小开衫，清冷又高级。链接在评论区置顶，粉丝专享券已放好~',
  analysis: {
    titleStructure:
      '「救命！」情绪词前置制造紧迫感 → 点明人群「大码」精准圈层 → 「130斤穿出90斤」数字反差对比，先立结果再给路径，命中大码群体身材焦虑与改造成瘾。',
    hookStructure:
      '黄金前3秒直接喊话目标人群「姐妹们别划走」，用「大码女孩的痛我都懂」共情开场，紧接着抛出「宽松显胖、紧身勒肉」痛点双杀，再以「视觉瘦20斤」制造即时获得感，留住划走的手指。',
    bodyStructure:
      '三段式结构：痛点共鸣（大码穿衣难）→ 方案拆解（高腰+垂坠+露脚踝三招）→ 价值升华（清冷高级感+粉丝福利）。逻辑链完整：问题-方法-好处-行动召唤，全文 0 废话，每句都在推进购买冲动。',
    emotionTriggers:
      '双重情绪钩子：身材焦虑（怕胖怕丑）+ 捡漏心理（粉丝专享券）。用「肉肉全藏住」「直接瘦20斤」提供确定性的情绪解药，让读者在 3 秒内完成「我也要变这样」的自我代入。',
    commentTactics:
      '置顶评论自导自演「这条裙子我冲了，姐妹穿上真的显瘦吗？」引发真实讨论；福利引导「链接在评论区置顶」+「粉丝专享券已放好」双钩子，配合「求链接」「蹲一个」的评论区习惯，让算法判定为高互动爆文。',
    conversionDrivers:
      '三步转化漏斗：先给穿搭方案建立专业信任 → 再亮「显瘦20斤」结果承诺 → 最后用「粉丝专享券」价格锚点刺激下单。评论区+置顶+私信全链路承接，把流量一次性沉淀为店铺收藏与成交。',
  },
}

// ------------------------------------------------------------ AI 选题工厂（预置结果 5 组）
export const PRESET_TOPICS: TopicIdea[] = [
  {
    title: '25岁以后抗初老，别再被「密集修护」收割智商税了',
    angle: '从成分党视角拆解「密集修护」的真实性价比，帮熬夜打工人省下冤枉钱，只买真正有效的修护单品。',
    explosiveIndex: 96,
    competitionRate: 28,
    conversionPotential: 93,
    hook: '熬夜3年才知道，密集修护根本不用堆满，真正起效的其实只有这3步…',
  },
  {
    title: '抗衰精华怎么选？成分党熬夜打工人的极简清单',
    angle: '针对 25+ 熬夜党预算有限、看不懂成分表的痛点，给出一张「按预算选精华」的极简决策清单。',
    explosiveIndex: 92,
    competitionRate: 35,
    conversionPotential: 90,
    hook: '别再盲目跟风贵妇精华了！成分党熬夜 5 年，帮你把抗老精华分成了这 3 档…',
  },
  {
    title: '夜间修护黄金时间表：25+熬夜党请收好',
    angle: '把「密集修护」落地为可执行的夜间流程，用时间表降低执行门槛，主打 25+ 上班族睡前 10 分钟。',
    explosiveIndex: 88,
    competitionRate: 42,
    conversionPotential: 86,
    hook: '同样是熬夜，为什么别人第二天脸在发光？秘密全在这张夜间修护时间表里…',
  },
  {
    title: '加班脸自救：一支修护精华的「密集用法」',
    angle: '用「一支精华，四种用法」的省钱包包思路，覆盖熬夜急救、妆前打底、局部厚敷、换季维稳四大场景。',
    explosiveIndex: 84,
    competitionRate: 47,
    conversionPotential: 82,
    hook: '连续加班 21 天，脸垮到不敢照镜子？一支精华的 4 种用法，帮你把状态拉回来…',
  },
  {
    title: '为什么你的抗老精华越用越没效果？关键在这一点',
    angle: '从「无效抗老」的反面切入，指出护肤流程顺序错误是最大元凶，引导建立正确的修护优先级。',
    explosiveIndex: 90,
    competitionRate: 31,
    conversionPotential: 88,
    hook: '你买的抗老精华不便宜，为什么越用越没效果？90% 的人顺序都错了…',
  },
]

// ------------------------------------------------------------ 内容生成中心（预置生成结果）
export const PRESET_CONTENT: GeneratedContent = {
  titleOptions: [
    '涂上这支爆汁玻尿酸口红，黄皮直接白一个度！',
    '被问了 800 次的显白口红！玻尿酸质地真的会爆汁',
    '黄皮救星！这支会「爆汁」的玻尿酸口红也太绝了',
  ],
  bodyText:
    '姐妹们！今天必须把这只「爆汁玻尿酸口红」按头安利给所有黄皮！！💄\n\n说实话，口红我也买过不下五十支，但像这支一样「涂上就显白」的，真的一只手数得过来。\n\n✨ 质地：挤出来是丝滑的果冻质地，上嘴瞬间化开，像涂了一层玻尿酸精华，嘴唇立刻嘭起来！完全不拔干，8 小时不脱色。\n\n✨ 显白：黄皮素颜上嘴，直接白一个度！薄涂是元气蜜桃，厚涂是高级复古红，通勤约会全都拿捏。\n\n✨ 成分：添加三重玻尿酸+角鲨烷，边涂边养唇，卸妆后嘴唇还是润润的。\n\n⚠️ 温馨提示：第一次用建议先薄涂试色，避免用量过多「爆汁」溢出哦～\n\n👇 点击左下角链接，今天下单立减 20，还送同款唇釉小样！',
  tags: ['#显白口红', '#玻尿酸口红', '#黄皮亲妈', '#通勤百搭', '#口红测评'],
  coverText: '左右对比：素唇 vs 爆汁玻尿酸口红，厚涂/薄涂双色试色，黄皮显白实测',
  suggestedImages: [
    '图1：口红膏体「爆汁」特写，水光感滴落，背景暖光',
    '图2：薄涂试色，自然光下黄皮手臂对比',
    '图3：厚涂全脸试色，白衬衫背景，突出显白效果',
    '图4：质地流动性展示，口红斜放流动成水珠状',
  ],
}

// 爆文对标参考馆（2 条静态参考）
export const REFERENCE_POSTS = [
  {
    badge: '行业爆文对标1',
    title: '纯干货讲解：新号3天破零的秘诀',
    summary:
      "'别在第一天就塞满广告，先通过连续两组的专业揭秘测评博取眼球，置顶评论留下福利免费包引流...'",
  },
  {
    badge: '行业爆文对标2',
    title: '25+女孩拯救暗沉、黄皮自救指南',
    summary:
      "'每天面对电脑熬夜码字，早C晚A用了一堆脸还是蜡黄？那是因为你没有吃透精简修护的真正精髓...'",
  },
]

// ------------------------------------------------------------ 评论成交 Agent（预置转化话术包）
export const PRESET_CONVERSIONS: ConversionsPack = {
  commentsReplies: [
    {
      scenario: '求链接',
      reply: '宝子看置顶评论哦～已经帮你把同款链接和粉丝专享券都放在置顶啦，今天下单还有赠品，冲鸭！',
    },
    {
      scenario: '质疑效果',
      reply: '姐妹的担心我懂！我自己就是黄皮，用了半个月真的白了一个度，涂上完全不假白～可以看我最新的素颜对比视频。',
    },
    {
      scenario: '比价观望',
      reply: '这个价格在玻尿酸质地里真的很能打了，同成分的专柜要 300+，咱家 199 还包邮，七天无理由随便退，放心试～',
    },
  ],
  dmReplies: [
    {
      trigger: '感兴趣',
      reply:
        '谢谢宝子私信我～课程是 199 元，包含 3 套傻瓜填空表 + 大咖 1 对 1 诊断 + 7 天无理由退款保障。你之前有做过账号吗？我先帮你看看适不适合～',
    },
    {
      trigger: '犹豫不决',
      reply:
        '别急，我先给你发一份试听课链接，你可以先感受下老师的讲课风格。零基础完全没问题，训练营里 80% 都是刚起步的新手～',
    },
    {
      trigger: '要求优惠',
      reply:
        '亲，今天报名的话我这边可以帮你申请一张 30 元新人券，到手只要 169，还额外送一份起号选题库，优惠券就剩最后 3 张啦～',
    },
  ],
  salesClosing: [
    {
      step: '小白真的能学会吗？',
      lines:
        '放心，训练营就是为零基础设计的：① 3 套傻瓜填空表，照着填就能出稿；② 助教 1 对 1 批改 3 篇笔记；③ 结营前保证完成 2 个可发布账号。学不会无条件退款，你没有任何风险～',
    },
    {
      step: '购买链接发来！',
      lines:
        '来了来了！点击左下角卡片即可下单，下单后记得截图私信我，我马上拉你进学员群并安排助教对接。今天下单还有限时福利，抓紧哦～',
    },
    {
      step: '有点超出预算了...',
      lines:
        '理解理解，199 相当于每天不到 1 块钱。换个角度想：一次成功的起号带来的收益远超这点学费，而且我们支持 7 天无理由退款，你试 7 天觉得没价值，随时退全款，稳赚不赔～',
    },
  ],
}

// ------------------------------------------------------------ 数据诊断中心（预置诊断结果）
export const PRESET_DIAGNOSTICS: DiagnosticsResult = {
  metrics: { ctr: 4.03, engagementRate: 8.4, conversionRate: 0.71 },
  evaluation:
    '该账号处于冷启动阶段，曝光量达 62,000 属于及格水平，但点击率 4.03% 显著低于行业均值 8%，说明封面与标题的吸引力不足，导致大量曝光被浪费。互动率 8.4% 尚可，说明内容本身有一定共鸣，私信转化率 0.71% 偏低，缺少明确的引导动作与福利钩子。整体判断：账号权重健康，核心瓶颈在「曝光→点击」环节，建议优先优化封面设计与标题钩子，并在正文中强化行动召唤。',
  issues: [
    '封面视觉冲击力不足：低饱和度封面在双列流信息流中缺乏辨识度，点击率被压缩至 4.03%。',
    '标题缺乏数字与情绪钩子：当前标题信息密度低，未命中「显瘦/美白/省钱」等高转化关键词。',
    '正文缺少置顶评论与福利引导：评论区没有动作引导，私信转化仅 0.71%，流量未能沉淀为成交。',
  ],
  suggestions: [
    '重制封面：使用高饱和撞色 + 大字报卖点文案，添加真人前后对比图，目标点击率提升至 8%+。',
    '标题公式化：套用「数字+人群+痛点+结果」模板，如「130斤穿出90斤既视感」，每篇 A/B 测试两个标题。',
    '配置评论区钩子：置顶评论放「求链接」引导 + 限时福利券，私信设置自动回复，将转化率拉升至 1.5%+。',
    '发布时间对齐：结合行业大盘，将发布时段调整至 12:00-13:00 / 20:00-22:00 两个高流量窗口。',
  ],
  growthPlan: [
    { phase: '阶段1 (第1-3天)', action: '重制 3 篇现有笔记的封面与标题，按新公式发布，观察 CTR 变化' },
    { phase: '阶段2 (第4-7天)', action: '建立置顶评论引导 + 私信自动回复话术库，跟踪私信转化率' },
    { phase: '阶段3 (第8-11天)', action: '根据数据反馈筛选 2 个高转化选题方向，加大产出频次至日更' },
    { phase: '阶段4 (第12-15天)', action: '批量发布 4 篇高潜选题，配合福利活动，冲刺单篇 500+ 互动' },
    { phase: '阶段5 (第15天)', action: '复盘全链路数据，输出账号成长报告并制定下月内容排期' },
  ],
}

// ------------------------------------------------------------ 内容资产库（初始 2 条资产）
export const INITIAL_ASSETS: StudioAsset[] = [
  {
    id: 'ast-1',
    title: '【爆款图文】如何用一根眼线画出高冷清冷中式妆？',
    content:
      '【核心观点】打破西方浓妆框架，利用新中式大白、柔焦、以及下垂猫挂画，快速突出清冷叛逆的高级质感！\n\n【黄金前3秒开头】：“别画大粗双眼皮长眼线了！今年爆款的清冷清浅小媚眼，其实只需三笔，连手残党5秒钟就能一学即会...”\n\n【爆赞参考大纲】\n1. 中式眼线底层折角规律\n2. 面部五官留白，打造骨相呼吸感\n3. 早八打卡极速成妆指南。\n\n#爆款眼线 #新中式清冷妆容 #早八快速成妆化法',
    type: 'copy',
    category: '美妆护肤',
    tags: ['#美妆教程', '#新中式妆面', '#起号大赞粉'],
    createdAt: '2026-06-07',
  },
  {
    id: 'ast-2',
    title: '【黄金选题大纲】为什么我劝你立即停止无脑日更图文？',
    content:
      '【核心痛点切入点】: 很多新手陷入每天熬夜作图、胡乱产出、结果粉丝没涨，反而把内容权重拉爆，沦落到均温200的焦虑陷阱中。深度探寻质感输出和多账号批量排布因果机制。\n\n【建议前3秒痛点句】: “你是不是也每天累死累活作图，结果篇篇大批二百纯属自娱自乐？今天告诉你一个血淋淋的小红书事实：没有权重卡点，你所谓的勤奋纯属垃圾输出...”\n\n【爆款潜力值】：98%\n【竞争难度比】：30%\n【预期转化漏斗】：94%',
    type: 'topic',
    category: '创作者运营',
    tags: ['#起号干货', '#运营方法论', '#爆款选题'],
    createdAt: '2026-06-06',
  },
]

// ------------------------------------------------------------ AI Agent 中心（6 大 Agent）
export const STUDIO_AGENTS: StudioAgent[] = [
  {
    id: 'ag-trend',
    name: '热点探针 Agent (TrendSeeker)',
    role: '小红书全网大盘热点接口抓取、舆情峰值分析、起量风口监控',
    status: 'active',
    tasksExecuted: 1420,
    successRate: '99.8%',
    logs: [
      'API Connection online.',
      'Scanned 840 categories in fashion niche.',
      "Identified 3 viral burst terms inside 'New Chinese style'.",
    ],
  },
  {
    id: 'ag-dissect',
    name: '心智透视 Agent (DissectCore)',
    role: '拆解博主首尾段落、痛点锚定机制、评论区利益诱导机制结构化分析',
    status: 'active',
    tasksExecuted: 890,
    successRate: '98.5%',
    logs: [
      'Hook analysis engine ready.',
      'Processing URL feedback parser on RED.',
      'Segmented 6 core triggers on conversion models.',
    ],
  },
  {
    id: 'ag-topic',
    name: '选题创意 Agent (IdeaForge)',
    role: '基于爆款因子大盘推荐、受众痛点，全自动匹配并繁衍高带货选题',
    status: 'active',
    tasksExecuted: 2310,
    successRate: '99.1%',
    logs: [
      'Niche prompt parameters synchronized.',
      'Created 50 potential titles for skin care tag.',
      'Ranked difficulty index by competition rate algorithms.',
    ],
  },
  {
    id: 'ag-writing',
    name: '神笔马良 Agent (CopyWizard)',
    role: '图文排版、视频多镜头台词、小红书高识别表情及带货尾钩书写',
    status: 'active',
    tasksExecuted: 1845,
    successRate: '97.4%',
    logs: [
      'Vite environment verified successfully.',
      'Applying conversational style microtuning parameters.',
      'Writing detailed body copies for RED specifications.',
    ],
  },
  {
    id: 'ag-comment',
    name: '流量闭环 Agent (DealMaker)',
    role: '社交评论、高情商私信自适应分销答疑及引导成交对练会话代理',
    status: 'idle',
    tasksExecuted: 450,
    successRate: '96.2%',
    logs: [
      'Dialog dataset refreshed.',
      'Preset objections scripts synchronized.',
      'Trained conversion weights.',
    ],
  },
  {
    id: 'ag-diagnose',
    name: '体检诊断 Agent (StatSurgeon)',
    role: '曝光点击漏斗转化率、降权风险预测及精细涨粉十五天指令编排',
    status: 'active',
    tasksExecuted: 620,
    successRate: '98.9%',
    logs: [
      'Funnel analytics calculation completed.',
      'Flagged low click through rate (CTR) warning.',
      'Generated diagnostic growth plans.',
    ],
  },
]

// 终端日志池（Agent Hub 滚动日志）
export const AGENT_LOG_POOL = [
  "[ORCHESTRATOR] 探针追踪成功：发现'废土穿搭'在24h内上升了12%点击率",
  '[DB CACHE] 清理 Redis 热点缓存库 3.4 MB，释放资源完毕',
  '[MODEL INFERENCE] Gemini 3.5-flash 运算返回成功，解析用时 1240 ms',
  '[AGENT LOG] 心智透视 Agent: 已将该篇爆款正文特征提取至向量空间',
  '[SYSTEM NOTIFY] 矩阵账号增长趋势触发，粉丝数统计预估相比昨天增长18K',
  '[DEAL AGENT] 对抗练兵舱就绪，创作者 objection 转换路径匹配至 199 面霜 步骤',
  '[DIAGNOSTICS] StatSurgeon: 录入 62K 曝光。提醒点击率 4.03% 偏低，主推封面升级计划',
]

// 初始终端日志
export const INITIAL_TERMINAL_LOGS = [
  '[SYSTEM INFO] 2026-06-07 07:56:09 UTC -爆款工厂 V1 AI Agent 工作流内核状态：正常',
  '[DB LOG] PostgreSQL 向量通道 Milvus 已挂载健康运行',
  '[ORCHESTRATOR] 启动热点探针 Agent 成功，正在拉取 24 小时 Xiaohongshu Hotspot APIs...',
  '[SYSTEM INFO] 全局 Gemini 统一模型路由已连接，优先配比 gemini-3.5-flash',
  '[AGENT HUB] 选题创意 Agent 生成了关于【抗初老面霜】的5组起号风口...',
  '[USER MESSAGE] 用户触发了 爆文一键 AI 拆解 模块，目标 URL verified: OK',
]

// 预置聊天记录（评论成交 Agent 对话模拟舱）
export const INITIAL_CHAT_LOG = [
  { role: 'user', text: '哈喽，看到你发那个大地图笔记了，感觉挺全面的。请问你们这个199的课小白能学会吗？' },
]

// 用户抗拒话术三档
export const OBJECTION_SCRIPTS = [
  '请问这个有什么用啊？小白学完能直接起号成功吗？',
  '亲亲这个怎么卖的呀？能便宜点发一下购买链接吗？',
  '感觉太贵了，奶茶钱还能买点实打实的东西呢...',
]

// ------------------------------------------------------------ 设置（团队成员 / 模型路由）
export const INITIAL_MEMBERS = [
  { name: '张小豪', role: 'MCN 增长合伙人 (Owner)', email: 'zhang@viralmaker.com', status: 'Active' },
  { name: '林妙儿', role: '文案主编 (Writer)', email: 'lin@viralmaker.com', status: 'Active' },
  { name: '陈大川', role: '带货团队投手 (Advertiser)', email: 'chen@viralmaker.com', status: 'Pending' },
]


