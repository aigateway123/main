import { CompanyLead, SupplierItem, MarketOpportunity, CompetitorItem, CommercialOpportunity, TaskHistoryItem } from '../types';

export const mockCustomerLeads: CompanyLead[] = [
  {
    id: 'lead-01',
    name: 'ABC Building Supply & Fenestration Group',
    legalName: 'ABC Building Supply Corporation',
    country: 'United States',
    countryCode: 'US',
    city: 'Los Angeles',
    region: 'California',
    companyType: '建材与门窗综合批发商 / Building Materials Distributor',
    industry: '建筑材料与门窗幕墙工程 (Building Materials)',
    establishedYear: 2004,
    employeeScale: '150 - 300人',
    annualRevenue: '$48,000,000 / 年',
    website: 'https://www.abcbuildingsupply-us.com',
    logoInitial: 'ABC',
    productMatch: 95,
    purchasePotential: 92,
    overallScore: 92,
    tier: 'A',
    recommendedAction: '立即开发',
    actionColor: 'emerald',
    summary: '加州大型建材与门窗连锁批发商，正在寻找具备NFRC节能认证与极窄边框铝合金门窗的中国源头ODM代工厂。',
    isStarred: true,
    businessPortrait: {
      overview: 'ABC Building Supply 是美国西海岸知名的高端建材与门窗系统批发商，业务网络覆盖加州、内华达州及亚利桑那州，主要为当地商业地产开发商、独栋住宅承建商及高端装修承包商提供全套门窗与建材方案。',
      targetMarketSegment: '西海岸中高端住宅翻新、新建商业联排别墅、沿海防风阻燃建筑项目。',
      chinaCooperationPotential: '极高。该企业在2021-2023年有从越南与中国广东持续进口断桥铝及五金件记录，近期因本地供货周期拉长（>14周），正积极寻访交期在4-6周内且具备AAMA/NFRC认证的高品质中国直供制造厂。',
      keyHighlights: [
        '拥有5个大型区域配送中心与2个定制加工车间',
        '年门窗采购体量约合80-120个40HQ集装箱',
        '明确偏好断桥铝合金系统窗、提升推拉门与超大落地折叠门',
        '具备自理清关能力，支持FOB/CIF结算条款'
      ]
    },
    productMatchDetails: {
      overall: 95,
      categories: [
        { name: '断桥铝合金门窗系统', percentage: 96 },
        { name: '重型提升推拉门 / 折叠门', percentage: 94 },
        { name: 'Low-E中空钢化节能玻璃窗', percentage: 92 },
        { name: '商用铝合金幕墙型材', percentage: 88 }
      ],
      aiVerdict: [
        '企业主营业务与目标铝合金门窗产品具有95%以上的结构重合度',
        '企业现售产品线中，铝合金中高端系列占比达62%，利润贡献率最高',
        '现有北美本土供应商交期偏长（平均85天），中国直发具备交期与定制双重优势',
        '建议列入A级首批重点直推名单'
      ]
    },
    scoreBreakdown: {
      productMatch: 95,
      companyScale: 88,
      marketMatch: 93,
      purchasePotential: 92,
      cooperationProbability: 90
    },
    aiOpportunities: [
      {
        id: 'opp-1',
        title: '西海岸绿色建筑法案（Title 24）升级带来的换代需求',
        description: '加州最新节能建筑规范对门窗U值与SHGC提出更严苛要求，ABC正在淘汰旧款非断桥产品，急需符合Title 24标准的低U值断桥铝窗。',
        level: '高',
        tag: '政策红利'
      },
      {
        id: 'opp-2',
        title: '拓展商业联排与豪华别墅定制产品线',
        description: '企业官网上月新增"Modern Slimline Panoramic Doors"宣传横幅，但目前缺货严重，急需极窄边框全景推拉门供应链支持。',
        level: '高',
        tag: '急缺现货'
      },
      {
        id: 'opp-3',
        title: '已有中国采购经验，沟通门槛极低',
        description: '海关提单显示曾与佛山及常州厂商合作，熟悉国内集装箱配载、保护膜定制及海运单证操作流程。',
        level: '中高',
        tag: '成熟买家'
      }
    ],
    nextSteps: [
      { id: 1, step: '寻找并锁定采购副总及供应链主管 (VP of Procurement)', status: 'completed', recommendedTime: '立即执行' },
      { id: 2, step: '发送针对美国加州Title 24标准的铝合金产品画册及检测报告', status: 'in_progress', recommendedTime: '第1天' },
      { id: 3, step: '提供极窄边框推拉门与经典美式外开窗的FOB Long Beach参考价格区间', status: 'pending', recommendedTime: '第3天' },
      { id: 4, step: '寄送小样角（断桥切面结构样块 + 表面氟碳喷涂色板）', status: 'pending', recommendedTime: '第5天' },
      { id: 5, step: '安排Zoom线上工厂全景验厂与技术总工对接会', status: 'pending', recommendedTime: '第7天' }
    ],
    contacts: [
      { name: 'David Miller', title: 'VP of Global Sourcing & Procurement', email: 'd.miller@abcbuildingsupply-us.com', phone: '+1 (213) 584-9210', linkedin: 'https://linkedin.com/in/david-miller-procure', isKeyDecisionMaker: true },
      { name: 'Sarah Jenkins', title: 'Senior Product Category Manager (Windows & Doors)', email: 's.jenkins@abcbuildingsupply-us.com', phone: '+1 (213) 584-9215', linkedin: 'https://linkedin.com/in/sarah-jenkins-fenestration', isKeyDecisionMaker: true },
      { name: 'Michael Chang', title: 'Supply Chain & Logistics Director', email: 'm.chang@abcbuildingsupply-us.com', phone: '+1 (213) 584-9288', linkedin: 'https://linkedin.com/in/michael-chang-logistics', isKeyDecisionMaker: false }
    ],
    informationSources: [
      { sourceName: 'ABC Building Supply 官方网站与产品目录', sourceType: '企业官网', sourceDate: '2026-08-28', reliability: 99, linkTitle: 'https://www.abcbuildingsupply-us.com/products/fenestration', verified: true },
      { sourceName: '美国海关进口提单数据 (US Customs Bill of Lading)', sourceType: '海关提单', sourceDate: '2026-07-15', reliability: 98, linkTitle: 'HS Code 7610.10.00 / 32 Containers cleared', verified: true },
      { sourceName: 'IBS (International Builders Show) 2026 采购商名录', sourceType: '展会名录', sourceDate: '2026-02-20', reliability: 96, linkTitle: 'IBS Official Buyer Badge #US-84912', verified: true },
      { sourceName: 'D&B 邓白氏全球企业信用评级数据库', sourceType: '商业数据库', sourceDate: '2026-06-10', reliability: 95, linkTitle: 'D-U-N-S Number: 83-291-0492', verified: true }
    ],
    importData: {
      hasImportHistory: true,
      mainImportOrigin: ['中国 (China)', '越南 (Vietnam)', '德国 (Germany)'],
      annualImportShipments: 96,
      recentCustomsRecord: '2026-07-15: 4x40HQ Aluminum Door & Window Components from Yantian Port'
    }
  },
  {
    id: 'lead-02',
    name: 'XYZ Windows & Architectural Systems Inc.',
    legalName: 'XYZ Windows & Facades Canada Ltd.',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto',
    region: 'Ontario',
    companyType: '专业门窗系统经销商 / Window & Door Specialist Distributor',
    industry: '门窗系统工程与批发 (Fenestration Engineering)',
    establishedYear: 2011,
    employeeScale: '80 - 160人',
    annualRevenue: '$28,500,000 / 年',
    website: 'https://www.xyzwindows-canada.ca',
    logoInitial: 'XYZ',
    productMatch: 91,
    purchasePotential: 89,
    overallScore: 90,
    tier: 'A',
    recommendedAction: '立即开发',
    actionColor: 'emerald',
    summary: '加拿大安大略省知名工程门窗供应商，专攻高保暖三玻两腔断桥铝窗与公寓幕墙改造。',
    isStarred: true,
    businessPortrait: {
      overview: 'XYZ Windows 专注于加拿大极寒气候下的高隔热、高气密性门窗产品分销与工程配套，在多伦多、蒙特利尔均有大型展厅及分销网络，与当地多家大型总包商（General Contractors）保持长期合作。',
      targetMarketSegment: '多伦多高层公寓窗改、北美寒带高性能被动房（Passive House）住宅。',
      chinaCooperationPotential: '极高。加拿大冬季极冷，对断桥铝注胶隔热条及双银/三银Low-E玻璃有严格要求。中国目前在三玻两腔高性能系统门窗上具备极致性价比。',
      keyHighlights: [
        '年均采购额持续15%稳步增长',
        '主打通过Energy Star Canada认证的高保温断桥铝窗',
        '需要供货商提供英文CAD深化图纸及安装节点图支持'
      ]
    },
    productMatchDetails: {
      overall: 91,
      categories: [
        { name: '多腔体高隔热断桥铝系统窗', percentage: 95 },
        { name: '三玻两腔Low-E防结霜节能窗', percentage: 92 },
        { name: '商住两用铝合金平开门', percentage: 88 },
        { name: '遮阳一体化百叶门窗', percentage: 82 }
      ],
      aiVerdict: [
        '加拿大寒冷气候对铝合金注胶断桥技术有刚性需求',
        '该客户目前正从欧洲进口，成本高企且海运不稳定，中国替代潜力巨大'
      ]
    },
    scoreBreakdown: {
      productMatch: 91,
      companyScale: 85,
      marketMatch: 92,
      purchasePotential: 89,
      cooperationProbability: 91
    },
    aiOpportunities: [
      {
        id: 'opp-201',
        title: '欧洲高昂能源成本导致欧洲货源涨价35%',
        description: '此前从波兰及德国进口，近期因欧洲制造成本与运费飙升，正紧急寻找具备同等热阻性能的亚洲高品质替代厂商。',
        level: '高',
        tag: '替代欧洲'
      },
      {
        id: 'opp-202',
        title: '多伦多2个大型在建住宅项目指定断桥铝窗',
        description: '2026年下半年需交付8000平米高性能外开内倒窗及推拉门。',
        level: '高',
        tag: '明确大单'
      }
    ],
    nextSteps: [
      { id: 1, step: '获取采购经理Robert MacLeod直接联系方式', status: 'completed', recommendedTime: '立即执行' },
      { id: 2, step: '发送加拿大Energy Star合规产品参数表（U值≤1.2 W/m²·K）', status: 'in_progress', recommendedTime: '第1天' },
      { id: 3, step: '提供多伦多DDP落地到门预估报价', status: 'pending', recommendedTime: '第4天' }
    ],
    contacts: [
      { name: 'Robert MacLeod', title: 'Director of Procurement & Vendor Relations', email: 'r.macleod@xyzwindows-canada.ca', phone: '+1 (416) 792-3104', linkedin: 'https://linkedin.com/in/robert-macleod-xyz', isKeyDecisionMaker: true }
    ],
    informationSources: [
      { sourceName: 'XYZ Windows 官方产品手册', sourceType: '企业官网', sourceDate: '2026-08-15', reliability: 98, linkTitle: 'Official Commercial Spec 2026', verified: true },
      { sourceName: '加拿大建筑展 (Construct Canada) 参展商名录', sourceType: '展会名录', sourceDate: '2026-05-18', reliability: 97, linkTitle: 'Construct Canada Booth #702', verified: true }
    ]
  },
  {
    id: 'lead-03',
    name: 'Global Home Materials & Architectural Glazing',
    legalName: 'Global Home Materials LLC',
    country: 'United States',
    countryCode: 'US',
    city: 'Miami',
    region: 'Florida',
    companyType: '建材进口批发商 / Building Materials Importer',
    industry: '飓风抗冲击门窗与高端建材 (Impact Resistant Fenestration)',
    establishedYear: 2007,
    employeeScale: '120 - 220人',
    annualRevenue: '$39,000,000 / 年',
    website: 'https://www.globalhomematerials-fl.com',
    logoInitial: 'GHM',
    productMatch: 86,
    purchasePotential: 84,
    overallScore: 85,
    tier: 'A',
    recommendedAction: '重点跟进',
    actionColor: 'emerald',
    summary: '佛罗里达州知名防飓风抗冲击门窗（Impact Windows）分销商，需求强劲且利润丰厚。',
    isStarred: false,
    businessPortrait: {
      overview: '专注佛州及加勒比海沿海高风压地区的抗冲击门窗、防盗折叠门及高端阳台玻璃栏杆系统。',
      targetMarketSegment: '佛州沿海豪华公寓、飓风高发区抗灾民居改造。',
      chinaCooperationPotential: '高。佛州严苛的Miami-Dade NOA防飓风认证是准入门槛，若国内工厂拥有或能配合过检，即可获得极高溢价订单。',
      keyHighlights: [
        '年进口夹胶防爆门窗体量超过60个货柜',
        '对铝型材壁厚（≥2.0mm）及SentryGlas/PVB夹胶工艺有极高要求'
      ]
    },
    productMatchDetails: {
      overall: 86,
      categories: [
        { name: '防飓风抗冲击铝合金窗', percentage: 94 },
        { name: '重型铝合金折叠推拉门', percentage: 90 },
        { name: '无立柱全铝阳台栏杆系统', percentage: 80 }
      ],
      aiVerdict: ['客户具有极强区域代表性，一旦攻克佛州认证，年复购率超过85%']
    },
    scoreBreakdown: {
      productMatch: 86,
      companyScale: 88,
      marketMatch: 85,
      purchasePotential: 84,
      cooperationProbability: 82
    },
    aiOpportunities: [
      {
        id: 'opp-301',
        title: '佛州大西洋飓风季催生大量更换需求',
        description: '当地保险公司要求沿海房屋必须升级为Impact-Rated门窗，催生巨额置换潮。',
        level: '高',
        tag: '刚需爆发'
      }
    ],
    nextSteps: [
      { id: 1, step: '向客户发送Miami-Dade抗风压测试报告（ASTM E1886/E1996）', status: 'pending', recommendedTime: '第1天' }
    ],
    contacts: [
      { name: 'Carlos Rodriguez', title: 'Head of Purchasing', email: 'c.rodriguez@globalhomematerials-fl.com', phone: '+1 (305) 441-8920', linkedin: 'https://linkedin.com/in/carlos-rodriguez-glazing', isKeyDecisionMaker: true }
    ],
    informationSources: [
      { sourceName: 'Florida Building Commission 认证数据库', sourceType: '商业数据库', sourceDate: '2026-08-01', reliability: 99, linkTitle: 'FL Product Approval Database', verified: true }
    ]
  },
  {
    id: 'lead-04',
    name: 'North America Construction & Development Group',
    legalName: 'North America Construction Corp',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Vancouver',
    region: 'British Columbia',
    companyType: '大型建筑工程总包与地产开发商 / Construction & GC',
    industry: '商业与住宅地产工程 (General Contracting)',
    establishedYear: 1998,
    employeeScale: '300 - 600人',
    annualRevenue: '$95,000,000 / 年',
    website: 'https://www.naconstruction-bc.com',
    logoInitial: 'NAC',
    productMatch: 78,
    purchasePotential: 76,
    overallScore: 77,
    tier: 'B',
    recommendedAction: '培育跟进',
    actionColor: 'amber',
    summary: '温哥华大型建筑工程公司，定期以工程直采形式进行大宗门窗与幕墙招投标。',
    isStarred: false,
    businessPortrait: {
      overview: 'BC省排名前列的商业地产与高端多层住宅承建商，主要承接大体量公建与精装楼盘。',
      targetMarketSegment: '温哥华都会区住宅楼盘、商业综合体幕墙。',
      chinaCooperationPotential: '中高。倾向于整体工程打包采购，重视技术交底、保函及交期节点。',
      keyHighlights: ['单笔工程订单体量大（单项目可达500-1500万人民币）', '决策周期较长，需打通设计院与项目总工']
    },
    productMatchDetails: {
      overall: 78,
      categories: [
        { name: '单元式铝合金幕墙', percentage: 85 },
        { name: '工程标配断桥铝合金平开窗', percentage: 80 }
      ],
      aiVerdict: ['属于大客户培育性质，建议先进入其合格供应商初选库（Vendor List）']
    },
    scoreBreakdown: {
      productMatch: 78,
      companyScale: 95,
      marketMatch: 75,
      purchasePotential: 76,
      cooperationProbability: 72
    },
    aiOpportunities: [
      {
        id: 'opp-401',
        title: '温哥华Richmond新楼盘启动公开招标',
        description: '项目规划300套中高档精装公寓，预计采购12,000平米铝合金门窗系统。',
        level: '高',
        tag: '大型工程'
      }
    ],
    nextSteps: [
      { id: 1, step: '提交企业资质包、工程案例册（ISO9001/CE/AAMA）', status: 'pending', recommendedTime: '第2天' }
    ],
    contacts: [
      { name: 'Elena Rostova', title: 'Chief Estimator & Commercial Manager', email: 'e.rostova@naconstruction-bc.com', phone: '+1 (604) 330-9182', linkedin: 'https://linkedin.com/in/elena-rostova-estimator', isKeyDecisionMaker: true }
    ],
    informationSources: [
      { sourceName: 'BC Construction Association (BCCA) 招标网', sourceType: '商业数据库', sourceDate: '2026-08-20', reliability: 98, linkTitle: 'BCCA Project Tender #2026-BC-991', verified: true }
    ]
  },
  {
    id: 'lead-05',
    name: 'Apex Fenestration & Door Distributors',
    legalName: 'Apex Building Products LLC',
    country: 'United States',
    countryCode: 'US',
    city: 'Dallas',
    region: 'Texas',
    companyType: '门窗专业分销商 / Specialty Window Distributor',
    industry: '住宅门窗与五金批发',
    establishedYear: 2015,
    employeeScale: '60 - 110人',
    annualRevenue: '$22,000,000 / 年',
    website: 'https://www.apexfenestration-tx.com',
    logoInitial: 'APD',
    productMatch: 94,
    purchasePotential: 90,
    overallScore: 91,
    tier: 'A',
    recommendedAction: '立即开发',
    actionColor: 'emerald',
    summary: '德州快速扩张的门窗分销商，受当地建房热潮带动，月均采购量环比增长20%。',
    isStarred: true,
    businessPortrait: {
      overview: '德州达拉斯-沃斯堡大都会区增长极快的门窗经销商，专注为独栋住宅承建商与翻新客群提供定制铝合金与塑钢门窗。',
      targetMarketSegment: '德州南部阳光地带新房开工与节能置换。',
      chinaCooperationPotential: '极高。德州当前建筑市场极其火爆，本地产能无法满足交付，极度欢迎性价比高且交期敏捷的中国制造。',
      keyHighlights: ['仓储面积超过10万平方英尺', '对黑色阳极氧化铝与深灰氟碳喷涂有大宗稳定订单需求']
    },
    productMatchDetails: {
      overall: 94,
      categories: [
        { name: '现代哑光黑铝合金窄边推拉门', percentage: 97 },
        { name: '美式手摇外推窗与下悬窗', percentage: 92 },
        { name: '法式双开铝合金防盗阳台门', percentage: 90 }
      ],
      aiVerdict: ['产品结构契合度极高，属于典型的即插即用型目标采购商']
    },
    scoreBreakdown: {
      productMatch: 94,
      companyScale: 82,
      marketMatch: 95,
      purchasePotential: 90,
      cooperationProbability: 92
    },
    aiOpportunities: [
      {
        id: 'opp-501',
        title: '德州建筑潮持续爆发，本地供应链严重缺货',
        description: '德州本地门窗厂订单已排至4个月后，Apex正在寻找能够30天内出货的海外直供工厂。',
        level: '高',
        tag: '交付痛点'
      }
    ],
    nextSteps: [
      { id: 1, step: '向采购主管发送德州热门款式现货库存及排产周期表', status: 'pending', recommendedTime: '立即执行' }
    ],
    contacts: [
      { name: 'Jason Bennett', title: 'Managing Director & Procurement Lead', email: 'j.bennett@apexfenestration-tx.com', phone: '+1 (214) 890-4112', linkedin: 'https://linkedin.com/in/jason-bennett-apex', isKeyDecisionMaker: true }
    ],
    informationSources: [
      { sourceName: '德州门窗行业协会名录', sourceType: '行业目录', sourceDate: '2026-07-29', reliability: 97, linkTitle: 'Texas Fenestration Association Registry', verified: true }
    ]
  },
  {
    id: 'lead-06',
    name: 'Timber & Alloy Architectural Windows Ltd.',
    legalName: 'Timber & Alloy Windows UK Ltd',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    region: 'Greater London',
    companyType: '铝木复合与高端铝门窗工程商 / High-end Glazing Contractor',
    industry: '高端定制住宅门窗',
    establishedYear: 2009,
    employeeScale: '45 - 90人',
    annualRevenue: '£18,000,000 / 年',
    website: 'https://www.timberalloy-uk.co.uk',
    logoInitial: 'TAL',
    productMatch: 88,
    purchasePotential: 85,
    overallScore: 86,
    tier: 'A',
    recommendedAction: '重点跟进',
    actionColor: 'emerald',
    summary: '英国伦敦高端豪宅与别墅定制门窗商，重视英标PAS 24安全认证与超窄视面极简设计。',
    isStarred: false,
    businessPortrait: {
      overview: '专注伦敦及英格兰南部的高端私宅、老建筑改造及现代极简玻璃建筑。',
      targetMarketSegment: '英国高端私宅定制、保护区老建筑合规更换。',
      chinaCooperationPotential: '高。注重五金件品质（如德国格屋/丝吉利娅）及隐藏式铰链铝合金窗。',
      keyHighlights: ['平均客单价极高', '支持定期空运样件与小批量海运拼箱']
    },
    productMatchDetails: {
      overall: 88,
      categories: [
        { name: '极窄边框全景折叠门 (Bifold Doors)', percentage: 96 },
        { name: '内倒侧开铝合金系统窗', percentage: 90 },
        { name: '全铝阳光房与采光顶系统', percentage: 85 }
      ],
      aiVerdict: ['对品质与细节要求苛刻，但利润空间巨大']
    },
    scoreBreakdown: {
      productMatch: 88,
      companyScale: 79,
      marketMatch: 89,
      purchasePotential: 85,
      cooperationProbability: 86
    },
    aiOpportunities: [
      {
        id: 'opp-601',
        title: '英格兰新版建筑规范Part L节能门窗强制要求',
        description: '需整体门窗U值达到1.2以下，客户现有铝合金系统需全面技术迭代。',
        level: '高',
        tag: '规范升级'
      }
    ],
    nextSteps: [
      { id: 1, step: '发送英标PAS 24防盗测试及热工性能报告', status: 'pending', recommendedTime: '第2天' }
    ],
    contacts: [
      { name: 'Oliver Wright', title: 'Technical Director', email: 'o.wright@timberalloy-uk.co.uk', phone: '+44 20 7946 0912', linkedin: 'https://linkedin.com/in/oliver-wright-ukglazing', isKeyDecisionMaker: true }
    ],
    informationSources: [
      { sourceName: '英国玻璃与玻璃制品联合会 (GGF) 认证名录', sourceType: '行业目录', sourceDate: '2026-06-30', reliability: 98, linkTitle: 'GGF Member ID: 49012', verified: true }
    ]
  },
  {
    id: 'lead-07',
    name: 'Bavaria Fenstersysteme & Fassaden GmbH',
    legalName: 'Bavaria Fenstersysteme GmbH',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Munich',
    region: 'Bavaria',
    companyType: '德国门窗系统与外立面工程公司 / Fenestration Systems',
    industry: '被动房节能门窗工程',
    establishedYear: 2002,
    employeeScale: '90 - 180人',
    annualRevenue: '€32,000,000 / 年',
    website: 'https://www.bavaria-fenster.de',
    logoInitial: 'BFS',
    productMatch: 83,
    purchasePotential: 80,
    overallScore: 81,
    tier: 'B',
    recommendedAction: '培育跟进',
    actionColor: 'amber',
    summary: '德国巴伐利亚知名节能门窗供应商，严格遵从德国被动房研究所（PHI）与DIN标准。',
    isStarred: false,
    businessPortrait: {
      overview: '服务德国南部及奥地利市场，以极高工艺精密度和严谨测试著称。',
      targetMarketSegment: '德语区高端低能耗公共建筑与节能住宅。',
      chinaCooperationPotential: '中。需具备严格的IFT Rosenheim测试报告及CE认证。',
      keyHighlights: ['对注胶工艺、EPDM复合胶条及气密性有极高检验指标']
    },
    productMatchDetails: {
      overall: 83,
      categories: [
        { name: 'PHI认证被动房铝合金系统窗', percentage: 90 },
        { name: '隐藏式排水铝合金幕墙系统', percentage: 82 }
      ],
      aiVerdict: ['质量标准最高，适合作为品牌标杆客户攻坚']
    },
    scoreBreakdown: {
      productMatch: 83,
      companyScale: 85,
      marketMatch: 80,
      purchasePotential: 80,
      cooperationProbability: 76
    },
    aiOpportunities: [
      {
        id: 'opp-701',
        title: '德国建筑翻新基金（KfW补贴）拉动高能效门窗',
        description: '政府补贴项目急需高性价比且符合Uw≤0.8 W/m²K标准的系统窗货源。',
        level: '中高',
        tag: '能效补贴'
      }
    ],
    nextSteps: [
      { id: 1, step: '提供IFT Rosenheim或者CE符合性声明文件', status: 'pending', recommendedTime: '第3天' }
    ],
    contacts: [
      { name: 'Klaus Wagner', title: 'Head of Engineering & Procurement', email: 'k.wagner@bavaria-fenster.de', phone: '+49 89 2442 8190', linkedin: 'https://linkedin.com/in/klaus-wagner-de', isKeyDecisionMaker: true }
    ],
    informationSources: [
      { sourceName: 'BAU Munich 2025 官方展商数据库', sourceType: '展会名录', sourceDate: '2025-01-22', reliability: 99, linkTitle: 'BAU Munich Trade Directory', verified: true }
    ]
  },
  {
    id: 'lead-08',
    name: 'Sydney Architectural Glazing & Aluminium Co.',
    legalName: 'Sydney Glazing Pty Ltd',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    region: 'New South Wales',
    companyType: '澳大利亚大型门窗制造商与分销商 / Glazing Fabricator & Wholesaler',
    industry: '商用与民用铝合金门窗幕墙',
    establishedYear: 2006,
    employeeScale: '110 - 200人',
    annualRevenue: 'A$42,000,000 / 年',
    website: 'https://www.sydneyglazing-au.com.au',
    logoInitial: 'SAG',
    productMatch: 93,
    purchasePotential: 88,
    overallScore: 90,
    tier: 'A',
    recommendedAction: '立即开发',
    actionColor: 'emerald',
    summary: '澳洲东海岸知名门窗企业，熟悉澳标AS2047与AS1288认证，年采购量巨大。',
    isStarred: true,
    businessPortrait: {
      overview: '覆盖悉尼、墨尔本及布里斯班，主要供应联排别墅、商办写字楼与临海住宅项目。',
      targetMarketSegment: '澳洲东部沿海高采光推拉门、双折门及百叶通风窗。',
      chinaCooperationPotential: '极高。澳洲长期从中国佛山、常州大批量进口铝型材及成品门窗。',
      keyHighlights: ['持有澳洲标准协会AS2047合规批文', '对中澳自贸协定（ChAFTA零关税政策）应用极其熟练']
    },
    productMatchDetails: {
      overall: 93,
      categories: [
        { name: '澳标AS2047重型双轨推拉门', percentage: 96 },
        { name: '断桥铝合金防蚊百叶一体窗', percentage: 93 },
        { name: '商业店面超大无框玻璃门', percentage: 89 }
      ],
      aiVerdict: ['中澳自贸协定关税优惠，合作门槛极低，回报极快']
    },
    scoreBreakdown: {
      productMatch: 93,
      companyScale: 89,
      marketMatch: 91,
      purchasePotential: 88,
      cooperationProbability: 92
    },
    aiOpportunities: [
      {
        id: 'opp-801',
        title: '澳洲2026年NCC全国建筑规范提升NatHERS评级要求',
        description: '新建住宅必须达到7星节能标准，澳洲本土铝门窗厂产能严重脱节，正加速向中国下单。',
        level: '高',
        tag: '政策催化'
      }
    ],
    nextSteps: [
      { id: 1, step: '向客户发送符合AS2047测试的澳标门窗图册与出厂检验流程', status: 'pending', recommendedTime: '第1天' }
    ],
    contacts: [
      { name: 'Liam O’Connor', title: 'Procurement Director', email: 'l.oconnor@sydneyglazing-au.com.au', phone: '+61 2 9840 2190', linkedin: 'https://linkedin.com/in/liam-oconnor-fenestration', isKeyDecisionMaker: true }
    ],
    informationSources: [
      { sourceName: 'Australian Glass and Window Association (AGWA) 认证名录', sourceType: '行业目录', sourceDate: '2026-07-10', reliability: 99, linkTitle: 'AGWA Certified Member Directory', verified: true }
    ]
  },
  {
    id: 'lead-09',
    name: 'Singapore Pan-Asian Facade Technologies Pte Ltd',
    legalName: 'Pan-Asian Facade Technologies Pte Ltd',
    country: 'Singapore',
    countryCode: 'SG',
    city: 'Singapore',
    region: 'Central',
    companyType: '东南亚幕墙与高端门窗工程承包商 / Facade Contractor',
    industry: '绿色建筑与商业幕墙工程',
    establishedYear: 2012,
    employeeScale: '70 - 130人',
    annualRevenue: 'S$35,000,000 / 年',
    website: 'https://www.panasian-facade.com.sg',
    logoInitial: 'PAF',
    productMatch: 87,
    purchasePotential: 83,
    overallScore: 85,
    tier: 'A',
    recommendedAction: '重点跟进',
    actionColor: 'emerald',
    summary: '新加坡BCA绿色建筑认证项目重要承建商，业务辐射马来西亚与印尼。',
    isStarred: false,
    businessPortrait: {
      overview: '专攻热带多雨高湿气候下的高性能遮阳铝合金门窗、双层呼吸幕墙与天窗系统。',
      targetMarketSegment: '东南亚绿色节能公建、高端私宅及五星级度假酒店。',
      chinaCooperationPotential: '极高。新加坡至中国沿海航运仅需4-6天，物流成本低且供应链响应极快。',
      keyHighlights: ['严格执行新加坡BCA Green Mark Platinum标准', '偏好高耐候粉末喷涂（如阿克苏诺贝尔/老虎粉）']
    },
    productMatchDetails: {
      overall: 87,
      categories: [
        { name: '热带高效防水防渗铝合金推拉窗', percentage: 92 },
        { name: '外置电动遮阳百叶一体铝门窗', percentage: 89 }
      ],
      aiVerdict: ['船运极短，资金周转快，可作为东南亚枢纽客户重点开拓']
    },
    scoreBreakdown: {
      productMatch: 87,
      companyScale: 84,
      marketMatch: 88,
      purchasePotential: 83,
      cooperationProbability: 86
    },
    aiOpportunities: [
      {
        id: 'opp-901',
        title: '马来西亚柔佛州森林城市与新山高端住宅配套项目采购',
        description: '计划分批采购50,000平米铝合金推拉门窗，预算充足。',
        level: '高',
        tag: '地缘项目'
      }
    ],
    nextSteps: [
      { id: 1, step: '发送热带抗风雨水密性测试报告（AAMA 501.1）', status: 'pending', recommendedTime: '第2天' }
    ],
    contacts: [
      { name: 'Kenneth Tan', title: 'Managing Director', email: 'k.tan@panasian-facade.com.sg', phone: '+65 6742 8190', linkedin: 'https://linkedin.com/in/kenneth-tan-facade', isKeyDecisionMaker: true }
    ],
    informationSources: [
      { sourceName: 'Singapore BCA 建筑局注册企业名册', sourceType: '商业数据库', sourceDate: '2026-08-05', reliability: 98, linkTitle: 'BCA Registered Contractors Directory', verified: true }
    ]
  },
  {
    id: 'lead-10',
    name: 'Pacific Coast Window & Door Wholesalers',
    legalName: 'Pacific Coast Fenestration LLC',
    country: 'United States',
    countryCode: 'US',
    city: 'Seattle',
    region: 'Washington',
    companyType: '区域门窗批发商 / Regional Window Wholesaler',
    industry: '民用与商用建材批发',
    establishedYear: 2005,
    employeeScale: '90 - 150人',
    annualRevenue: '$31,000,000 / 年',
    website: 'https://www.pacificcoast-windows.com',
    logoInitial: 'PCW',
    productMatch: 92,
    purchasePotential: 87,
    overallScore: 89,
    tier: 'A',
    recommendedAction: '立即开发',
    actionColor: 'emerald',
    summary: '美国西北部知名门窗批发商，西雅图至波特兰重点供货商，主打高气密性现代门窗。',
    isStarred: false,
    businessPortrait: {
      overview: '服务美国西北太平洋沿岸湿润多雨地区，对门窗排水槽专利设计、双道密封胶条及抗腐蚀五金件有明确采购偏好。',
      targetMarketSegment: '华盛顿州与俄勒冈州现代住宅改造与定制新房。',
      chinaCooperationPotential: '高。西雅图港直达航线便捷，具有长期海运清关协作经验。',
      keyHighlights: ['月均吞吐量40-50柜', '设有专业的售后与安装培训中心']
    },
    productMatchDetails: {
      overall: 92,
      categories: [
        { name: '高水密性断桥铝合金平开窗', percentage: 95 },
        { name: '现代超窄边全景落地移门', percentage: 92 }
      ],
      aiVerdict: ['客户信誉优良，付款条件健康（支持信用证与T/T结合）']
    },
    scoreBreakdown: {
      productMatch: 92,
      companyScale: 85,
      marketMatch: 90,
      purchasePotential: 87,
      cooperationProbability: 88
    },
    aiOpportunities: [
      {
        id: 'opp-1001',
        title: '西雅图科技新贵住宅区扩建潮',
        description: '高端现代工业风黑框铝合金窗供不应求，寻求高品质稳定代工厂。',
        level: '高',
        tag: '消费升级'
      }
    ],
    nextSteps: [
      { id: 1, step: '发送西雅图港口CIF最新拼箱与整柜报价表', status: 'pending', recommendedTime: '第2天' }
    ],
    contacts: [
      { name: 'Mark Evans', title: 'VP Purchasing', email: 'm.evans@pacificcoast-windows.com', phone: '+1 (206) 482-9102', linkedin: 'https://linkedin.com/in/mark-evans-windows', isKeyDecisionMaker: true }
    ],
    informationSources: [
      { sourceName: 'US Fenestration & Glazing Industry Alliance', sourceType: '行业目录', sourceDate: '2026-07-15', reliability: 98, linkTitle: 'FGIA Verified Supplier Search', verified: true }
    ]
  },
  // Additional 20+ realistic leads for broad display and filtering
  {
    id: 'lead-11',
    name: 'Midwest Architectural Building Products',
    legalName: 'Midwest Fenestration Solutions Inc',
    country: 'United States',
    countryCode: 'US',
    city: 'Chicago',
    region: 'Illinois',
    companyType: '建材批发商 / Building Materials Distributor',
    industry: '中西部商用建材分销',
    establishedYear: 2001,
    employeeScale: '180 - 320人',
    annualRevenue: '$52,000,000 / 年',
    website: 'https://www.midwestarch-us.com',
    logoInitial: 'MAB',
    productMatch: 89,
    purchasePotential: 86,
    overallScore: 88,
    tier: 'A',
    recommendedAction: '重点跟进',
    actionColor: 'emerald',
    summary: '芝加哥及中西部核心分销网络，涵盖12个连锁门店，年大宗采购规模稳定。',
    isStarred: false,
    businessPortrait: {
      overview: '历史悠久的中西部老牌建材集团，正在逐步升级旗下门窗专区，引入现代化轻奢铝合金产品系列。',
      targetMarketSegment: '伊利诺伊州、印第安纳州商住两用建筑。',
      chinaCooperationPotential: '高。对价格弹性敏感，重视规模化低成本采购。',
      keyHighlights: ['连锁门店覆盖广', '重视产品标准化与包装抗震防护']
    },
    productMatchDetails: {
      overall: 89,
      categories: [{ name: '重型断桥铝合金平开门', percentage: 91 }, { name: '标准尺寸工程铝合金窗', percentage: 88 }],
      aiVerdict: ['大客户体量，适合推销大批量标准化畅销型号']
    },
    scoreBreakdown: { productMatch: 89, companyScale: 92, marketMatch: 86, purchasePotential: 86, cooperationProbability: 84 },
    aiOpportunities: [{ id: 'opp-1101', title: '中西部连锁门店统一换代', description: '计划采购300套展厅展示样品架。', level: '中高', tag: '展厅改造' }],
    nextSteps: [{ id: 1, step: '寄送展厅样角专柜方案', status: 'pending', recommendedTime: '第3天' }],
    contacts: [{ name: 'Brian Scott', title: 'Category Director', email: 'b.scott@midwestarch-us.com', phone: '+1 (312) 650-8910', linkedin: 'https://linkedin.com/in/brian-scott-midwest', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'ThomasNet Enterprise Profile', sourceType: '商业数据库', sourceDate: '2026-06-18', reliability: 96, linkTitle: 'ThomasNet Verified Distributor', verified: true }]
  },
  {
    id: 'lead-12',
    name: 'Maple Leaf Fenestration & Supply Co.',
    legalName: 'Maple Leaf Glazing Corp',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Calgary',
    region: 'Alberta',
    companyType: '门窗经销商 / Fenestration Wholesaler',
    industry: '高寒地区住宅门窗',
    establishedYear: 2014,
    employeeScale: '50 - 90人',
    annualRevenue: '$19,000,000 / 年',
    website: 'https://www.mapleleaffene-ca.com',
    logoInitial: 'MLF',
    productMatch: 90,
    purchasePotential: 85,
    overallScore: 87,
    tier: 'A',
    recommendedAction: '重点跟进',
    actionColor: 'emerald',
    summary: '阿尔伯塔省专业门窗批发商，专注耐低温-40℃超保温铝合金断桥窗。',
    isStarred: false,
    businessPortrait: {
      overview: '卡尔加里当地增长极快的门窗经销商，专注极地保温与耐候型铝合金门窗系统。',
      targetMarketSegment: '加拿大内陆寒冷地带独栋别墅。',
      chinaCooperationPotential: '极高。正积极寻求支持聚酰胺PA66超宽隔热条的国内高定工厂。',
      keyHighlights: ['对注胶式断桥与双道暖边条有刚性技术指标']
    },
    productMatchDetails: {
      overall: 90,
      categories: [{ name: '超厚多腔体断桥铝系统', percentage: 94 }, { name: '三层充氩气Low-E中空玻璃', percentage: 91 }],
      aiVerdict: ['小而美的高毛利客户，对技术指标重于单纯比价']
    },
    scoreBreakdown: { productMatch: 90, companyScale: 78, marketMatch: 90, purchasePotential: 85, cooperationProbability: 88 },
    aiOpportunities: [{ id: 'opp-1201', title: '卡尔加里冬季换窗高峰期', description: '急需锁定下半年保冷门窗备货货源。', level: '高', tag: '季节刚需' }],
    nextSteps: [{ id: 1, step: '发送耐低温抗冻胀门窗技术白皮书', status: 'pending', recommendedTime: '第2天' }],
    contacts: [{ name: 'Trevor Wright', title: 'General Manager', email: 't.wright@mapleleaffene-ca.com', phone: '+1 (403) 892-1044', linkedin: 'https://linkedin.com/in/trevor-wright-calgary', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'Fenestration Canada 行业名录', sourceType: '行业目录', sourceDate: '2026-07-22', reliability: 97, linkTitle: 'Fenestration Canada Directory', verified: true }]
  },
  {
    id: 'lead-13',
    name: 'Lone Star Door & Window Logistics',
    legalName: 'Lone Star Glazing LLC',
    country: 'United States',
    countryCode: 'US',
    city: 'Houston',
    region: 'Texas',
    companyType: '建筑材料进口商 / Building Importer',
    industry: '工程与民用门窗分销',
    establishedYear: 2010,
    employeeScale: '75 - 130人',
    annualRevenue: '$26,000,000 / 年',
    website: 'https://www.lonestar-glazing.com',
    logoInitial: 'LSD',
    productMatch: 88,
    purchasePotential: 82,
    overallScore: 85,
    tier: 'A',
    recommendedAction: '重点跟进',
    actionColor: 'emerald',
    summary: '休斯顿港直达分销网络，常年从亚洲进口铝合金型材及成品门窗。',
    isStarred: false,
    businessPortrait: {
      overview: '依托休斯顿大型海港优势，具备高效的清关与区域卡车运输网络，分销德州全境。',
      targetMarketSegment: '德州南部商业与民居项目。',
      chinaCooperationPotential: '极高。常年整柜进口，对订舱、电放及包装要求标准化。',
      keyHighlights: ['月均进口20-30个40HQ集装箱', '现金流充裕，支持快速定金结算']
    },
    productMatchDetails: {
      overall: 88,
      categories: [{ name: '美式提升推拉门', percentage: 90 }, { name: '商用双玻铝合金隔断', percentage: 86 }],
      aiVerdict: ['海运口岸优势明显，整柜发货极具成本竞争力']
    },
    scoreBreakdown: { productMatch: 88, companyScale: 84, marketMatch: 87, purchasePotential: 82, cooperationProbability: 89 },
    aiOpportunities: [{ id: 'opp-1301', title: '扩建休斯顿新物流中转仓', description: '新仓库投入使用后，仓储能力提升100%。', level: '中高', tag: '产能扩张' }],
    nextSteps: [{ id: 1, step: '提供FOB休斯顿整柜拼装最优方案', status: 'pending', recommendedTime: '第2天' }],
    contacts: [{ name: 'William Vance', title: 'Import Specialist', email: 'w.vance@lonestar-glazing.com', phone: '+1 (713) 991-3401', linkedin: 'https://linkedin.com/in/william-vance-houston', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'US Customs Import Matrix', sourceType: '海关提单', sourceDate: '2026-07-04', reliability: 99, linkTitle: 'Port of Houston Customs Data', verified: true }]
  },
  {
    id: 'lead-14',
    name: 'Quebec Portes & Fenetres Express',
    legalName: 'Quebec Fenestration Ltee',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Montreal',
    region: 'Quebec',
    companyType: '门窗经销商 / Window Distributor',
    industry: '法裔加拿大住宅建材',
    establishedYear: 2013,
    employeeScale: '40 - 80人',
    annualRevenue: '$15,000,000 / 年',
    website: 'https://www.quebecfenetres.qc.ca',
    logoInitial: 'QPF',
    productMatch: 84,
    purchasePotential: 78,
    overallScore: 81,
    tier: 'B',
    recommendedAction: '培育跟进',
    actionColor: 'amber',
    summary: '蒙特利尔及魁北克省本地经销商，需求稳定，倾向法英文双语技术支持。',
    isStarred: false,
    businessPortrait: {
      overview: '专注魁北克本地住宅改造市场，偏好欧式外开内倒铝合金窗。',
      targetMarketSegment: '魁北克多层住宅与老街区建筑翻新。',
      chinaCooperationPotential: '中高。需提供法语标签及安装指导书。',
      keyHighlights: ['重视客户口碑与安装便捷性']
    },
    productMatchDetails: {
      overall: 84,
      categories: [{ name: '欧式内倒平开窗 (Tilt & Turn)', percentage: 92 }, { name: '仿古铝合金窗型', percentage: 80 }],
      aiVerdict: ['利基市场，竞争相对缓和']
    },
    scoreBreakdown: { productMatch: 84, companyScale: 75, marketMatch: 82, purchasePotential: 78, cooperationProbability: 80 },
    aiOpportunities: [{ id: 'opp-1401', title: '蒙特利尔老城翻新专项基金', description: '需要兼具现代保温性能与复古外观的断桥铝窗。', level: '中', tag: '专项改造' }],
    nextSteps: [{ id: 1, step: '提供法语/英语对照产品手册电子档', status: 'pending', recommendedTime: '第4天' }],
    contacts: [{ name: 'Jean-Pierre Dubois', title: 'Directeur des achats', email: 'jp.dubois@quebecfenetres.qc.ca', phone: '+1 (514) 820-9912', linkedin: 'https://linkedin.com/in/jpdubois-fenetres', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'Quebec Association of Window Manufacturers', sourceType: '行业目录', sourceDate: '2026-05-12', reliability: 95, linkTitle: 'APCHQ Member Listing', verified: true }]
  },
  {
    id: 'lead-15',
    name: 'Great Lakes Architectural Glass & Metal',
    legalName: 'Great Lakes Glazing Inc',
    country: 'United States',
    countryCode: 'US',
    city: 'Detroit',
    region: 'Michigan',
    companyType: '建筑工程公司 / Engineering Contractor',
    industry: '商用幕墙与大跨度玻璃工程',
    establishedYear: 2003,
    employeeScale: '140 - 260人',
    annualRevenue: '$44,000,000 / 年',
    website: 'https://www.greatlakesglazing.com',
    logoInitial: 'GLA',
    productMatch: 85,
    purchasePotential: 81,
    overallScore: 83,
    tier: 'B',
    recommendedAction: '培育跟进',
    actionColor: 'amber',
    summary: '五大湖地区主要商业工程承包商，长期承接医院、大学及工业研发中心外立面。',
    isStarred: false,
    businessPortrait: {
      overview: '技术实力雄厚的工程商，具有自主深化设计团队。',
      targetMarketSegment: '密歇根及俄亥俄州公共建筑工程。',
      chinaCooperationPotential: '中高。偏好型材深加工、预装五金及整体单元出货。',
      keyHighlights: ['工程回款周期稳定', '对结构计算书及抗震验算要求严格']
    },
    productMatchDetails: {
      overall: 85,
      categories: [{ name: '单元式半隐框铝合金幕墙', percentage: 90 }, { name: '重型商用平开门系统', percentage: 85 }],
      aiVerdict: ['适合作为大工程案例样板突破']
    },
    scoreBreakdown: { productMatch: 85, companyScale: 89, marketMatch: 80, purchasePotential: 81, cooperationProbability: 77 },
    aiOpportunities: [{ id: 'opp-1501', title: '底特律创新园区公共建筑招标', description: '外立面铝合金门窗幕墙体量约350万美元。', level: '高', tag: '公建大单' }],
    nextSteps: [{ id: 1, step: '由总工团队出具幕墙结构计算方案', status: 'pending', recommendedTime: '第5天' }],
    contacts: [{ name: 'Greg Thompson', title: 'Chief Engineer', email: 'g.thompson@greatlakesglazing.com', phone: '+1 (313) 490-1120', linkedin: 'https://linkedin.com/in/greg-thompson-glazing', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'Engineering News-Record (ENR) 排名', sourceType: '商业数据库', sourceDate: '2026-06-01', reliability: 98, linkTitle: 'ENR Top Specialty Contractors', verified: true }]
  },
  {
    id: 'lead-16',
    name: 'Sunbelt Building Supply & Windows',
    legalName: 'Sunbelt Fenestration Corp',
    country: 'United States',
    countryCode: 'US',
    city: 'Phoenix',
    region: 'Arizona',
    companyType: '建材批发商 / Building Materials Distributor',
    industry: '沙漠干旱耐候建材分销',
    establishedYear: 2012,
    employeeScale: '70 - 120人',
    annualRevenue: '$25,000,000 / 年',
    website: 'https://www.sunbeltwindows-az.com',
    logoInitial: 'SBS',
    productMatch: 91,
    purchasePotential: 86,
    overallScore: 88,
    tier: 'A',
    recommendedAction: '立即开发',
    actionColor: 'emerald',
    summary: '亚利桑那州防晒抗紫外线高性能铝合金门窗分销主力，增长迅速。',
    isStarred: false,
    businessPortrait: {
      overview: '针对沙漠强烈日照气候，主推遮阳系数SHGC≤0.20的超隔热铝合金系统窗。',
      targetMarketSegment: '凤凰城新城扩张住宅群。',
      chinaCooperationPotential: '极高。急需低成本、高隔热双银Low-E玻璃铝窗。',
      keyHighlights: ['年出货量持续保持25%高增速']
    },
    productMatchDetails: {
      overall: 91,
      categories: [{ name: '超低SHGC太阳能隔热铝窗', percentage: 95 }, { name: '全景落地推拉门', percentage: 90 }],
      aiVerdict: ['产品定位精准，痛点明确']
    },
    scoreBreakdown: { productMatch: 91, companyScale: 82, marketMatch: 93, purchasePotential: 86, cooperationProbability: 90 },
    aiOpportunities: [{ id: 'opp-1601', title: '凤凰城夏季节能置换刚需', description: '当地电费上涨驱动居民大量更换老旧窗户。', level: '高', tag: '电费痛点' }],
    nextSteps: [{ id: 1, step: '发送超隔热玻璃热工数据对比表', status: 'pending', recommendedTime: '第1天' }],
    contacts: [{ name: 'Austin Cole', title: 'VP Sourcing', email: 'a.cole@sunbeltwindows-az.com', phone: '+1 (602) 771-4402', linkedin: 'https://linkedin.com/in/austin-cole-sunbelt', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'Arizona Builders Alliance', sourceType: '行业目录', sourceDate: '2026-07-02', reliability: 96, linkTitle: 'ABA Member Registry', verified: true }]
  },
  {
    id: 'lead-17',
    name: 'Atlantic Coast Glazing & Fenestration',
    legalName: 'Atlantic Coast Glazing LLC',
    country: 'United States',
    countryCode: 'US',
    city: 'Boston',
    region: 'Massachusetts',
    companyType: '门窗经销商 / Window Distributor',
    industry: '新英格兰历史与现代门窗',
    establishedYear: 2008,
    employeeScale: '65 - 110人',
    annualRevenue: '$23,000,000 / 年',
    website: 'https://www.atlanticcoastglazing.com',
    logoInitial: 'ACG',
    productMatch: 87,
    purchasePotential: 83,
    overallScore: 85,
    tier: 'A',
    recommendedAction: '重点跟进',
    actionColor: 'emerald',
    summary: '波士顿高端住宅门窗供应商，兼顾北美现代风与红砖古建风格改造。',
    isStarred: false,
    businessPortrait: {
      overview: '深耕麻省及新英格兰地区，客户多为高收入业主与知名建筑师事务所。',
      targetMarketSegment: '波士顿及剑桥豪华公寓、郊区独立庄园。',
      chinaCooperationPotential: '高。追求定制精细度与无瑕疵喷涂品质。',
      keyHighlights: ['对定制色卡及特殊异形窗有较多需求']
    },
    productMatchDetails: {
      overall: 87,
      categories: [{ name: '定制格条铝合金复古窗', percentage: 92 }, { name: '窄框全景阳台门', percentage: 88 }],
      aiVerdict: ['设计导向型客户，提供3D渲染与样角极具吸引力']
    },
    scoreBreakdown: { productMatch: 87, companyScale: 80, marketMatch: 88, purchasePotential: 83, cooperationProbability: 85 },
    aiOpportunities: [{ id: 'opp-1701', title: '新英格兰沿海抗盐雾腐蚀需求', description: '要求阳极氧化涂层达AAMA 611 Class I标准。', level: '中高', tag: '防腐升级' }],
    nextSteps: [{ id: 1, step: '寄送超强耐候盐雾测试样板（3000小时盐雾测试通过）', status: 'pending', recommendedTime: '第3天' }],
    contacts: [{ name: 'Daniel Clark', title: 'Design & Procurement Lead', email: 'd.clark@atlanticcoastglazing.com', phone: '+1 (617) 502-8831', linkedin: 'https://linkedin.com/in/daniel-clark-glazing', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'Boston Society of Architects (BSA) 供应商库', sourceType: '行业目录', sourceDate: '2026-06-12', reliability: 97, linkTitle: 'BSA Architectural Directory', verified: true }]
  },
  {
    id: 'lead-18',
    name: 'Prairie State Building Supplies Corp',
    legalName: 'Prairie State Building Inc',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Winnipeg',
    region: 'Manitoba',
    companyType: '建材批发商 / Building Materials Distributor',
    industry: '农场与住宅综合建材分销',
    establishedYear: 2000,
    employeeScale: '85 - 140人',
    annualRevenue: '$21,000,000 / 年',
    website: 'https://www.prairiestatebuilding.ca',
    logoInitial: 'PSB',
    productMatch: 82,
    purchasePotential: 77,
    overallScore: 79,
    tier: 'B',
    recommendedAction: '持续观察',
    actionColor: 'slate',
    summary: '曼尼托巴省主要建材批发商，以坚固耐用、高性价比农用及民用门窗为主。',
    isStarred: false,
    businessPortrait: {
      overview: '服务加拿大草原三省，产品以结实耐用、安装简便为主。',
      targetMarketSegment: '农场住宅、仓库及轻钢结构配套门窗。',
      chinaCooperationPotential: '中。主要考量到岸综合单价与抗破损包装。',
      keyHighlights: ['大批量平价走量型客户']
    },
    productMatchDetails: {
      overall: 82,
      categories: [{ name: '轻型经济款断桥铝推拉窗', percentage: 88 }, { name: '车库与农用铝合金防风门', percentage: 80 }],
      aiVerdict: ['价格竞争较激烈，作为走量备选']
    },
    scoreBreakdown: { productMatch: 82, companyScale: 81, marketMatch: 78, purchasePotential: 77, cooperationProbability: 76 },
    aiOpportunities: [{ id: 'opp-1801', title: '轻钢农用大棚与仓库改造', description: '计划采购2000樘经济款铝合金采光排烟窗。', level: '中', tag: '平价大单' }],
    nextSteps: [{ id: 1, step: '提供经济款出厂阶梯报价单（1000套以上特价）', status: 'pending', recommendedTime: '第4天' }],
    contacts: [{ name: 'Henry Falk', title: 'Purchasing Director', email: 'h.falk@prairiestatebuilding.ca', phone: '+1 (204) 912-3341', linkedin: 'https://linkedin.com/in/henry-falk-supply', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'Western Retail Lumber Association (WRLA)', sourceType: '行业目录', sourceDate: '2026-04-18', reliability: 95, linkTitle: 'WRLA Buyer Index', verified: true }]
  },
  {
    id: 'lead-19',
    name: 'Cascade Architectural Doors & Windows',
    legalName: 'Cascade Fenestration Systems LLC',
    country: 'United States',
    countryCode: 'US',
    city: 'Portland',
    region: 'Oregon',
    companyType: '专业门窗经销商 / Specialty Window Distributor',
    industry: '绿色环保与被动式建筑门窗',
    establishedYear: 2016,
    employeeScale: '45 - 75人',
    annualRevenue: '$16,500,000 / 年',
    website: 'https://www.cascadewindows-or.com',
    logoInitial: 'CAD',
    productMatch: 93,
    purchasePotential: 88,
    overallScore: 90,
    tier: 'A',
    recommendedAction: '立即开发',
    actionColor: 'emerald',
    summary: '俄勒冈州先锋环保门窗分销商，专注LEED金级与零碳住宅门窗供应。',
    isStarred: true,
    businessPortrait: {
      overview: '波特兰具有高度环保意识的精细化门窗机构，与当地前卫设计师紧密合作。',
      targetMarketSegment: '西海岸零碳生态社区、现代木铝复合与断桥铝混搭私宅。',
      chinaCooperationPotential: '极高。认可中国顶尖制造厂的绿建认证与环保再生铝材（低碳铝）。',
      keyHighlights: ['明确要求提供碳足迹（EPD）及环保型材认证']
    },
    productMatchDetails: {
      overall: 93,
      categories: [{ name: '低碳再生铝环保系统门窗', percentage: 96 }, { name: '超静音三层夹胶隔音窗', percentage: 92 }],
      aiVerdict: ['环保溢价能力高，客户忠诚度高']
    },
    scoreBreakdown: { productMatch: 93, companyScale: 79, marketMatch: 94, purchasePotential: 88, cooperationProbability: 91 },
    aiOpportunities: [{ id: 'opp-1901', title: '波特兰市中心木结构高层住宅门窗供应', description: '项目指定要求达到LEED Platinum标准。', level: '高', tag: '高溢价环保' }],
    nextSteps: [{ id: 1, step: '提供EPD环境产品声明与低碳铝材质检书', status: 'pending', recommendedTime: '第1天' }],
    contacts: [{ name: 'Chloe Vance', title: 'Sustainability & Sourcing Director', email: 'c.vance@cascadewindows-or.com', phone: '+1 (503) 220-4910', linkedin: 'https://linkedin.com/in/chloe-vance-eco', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'US Green Building Council (USGBC) 产品目录', sourceType: '商业数据库', sourceDate: '2026-07-08', reliability: 99, linkTitle: 'USGBC Verified Product Showcase', verified: true }]
  },
  {
    id: 'lead-20',
    name: 'Southern Cross Fenestration Supplies',
    legalName: 'Southern Cross Windows Pty Ltd',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Melbourne',
    region: 'Victoria',
    companyType: '建材批发商 / Building Materials Distributor',
    industry: '维多利亚州商用民用门窗分销',
    establishedYear: 2008,
    employeeScale: '95 - 170人',
    annualRevenue: 'A$36,000,000 / 年',
    website: 'https://www.southerncross-windows.com.au',
    logoInitial: 'SCW',
    productMatch: 91,
    purchasePotential: 87,
    overallScore: 89,
    tier: 'A',
    recommendedAction: '立即开发',
    actionColor: 'emerald',
    summary: '墨尔本排名前列的门窗批发商，主要供应高端联排住宅与现代商业办公外立面。',
    isStarred: false,
    businessPortrait: {
      overview: '维州资深分销商，在墨尔本东西两区设有大型展示中枢与物流仓。',
      targetMarketSegment: '墨尔本内城区旧房重建及远郊新卫星城开发。',
      chinaCooperationPotential: '极高。熟悉中国海运集装箱直发墨尔本港（航程仅14天左右）。',
      keyHighlights: ['重视五金件顺畅度与重型推拉门下滑轮承重指标（要求≥300kg）']
    },
    productMatchDetails: {
      overall: 91,
      categories: [{ name: '重载300kg全铝推拉门', percentage: 95 }, { name: '澳标外开悬窗与纱窗一体化系统', percentage: 92 }],
      aiVerdict: ['海运周期短，资金周转极其顺畅']
    },
    scoreBreakdown: { productMatch: 91, companyScale: 87, marketMatch: 90, purchasePotential: 87, cooperationProbability: 90 },
    aiOpportunities: [{ id: 'opp-2001', title: '墨尔本联排别墅批量采购订单', description: '首批采购计划15个40HQ，寻找稳定长期代工厂。', level: '高', tag: '批量整柜' }],
    nextSteps: [{ id: 1, step: '安排墨尔本港门到门DDP精准测算表', status: 'pending', recommendedTime: '第2天' }],
    contacts: [{ name: 'Matthew Harris', title: 'Procurement Manager', email: 'm.harris@southerncross-windows.com.au', phone: '+61 3 9420 8810', linkedin: 'https://linkedin.com/in/matthew-harris-melb', isKeyDecisionMaker: true }],
    informationSources: [{ sourceName: 'Australian Trade and Investment Commission', sourceType: '商业数据库', sourceDate: '2026-06-25', reliability: 98, linkTitle: 'Austrade Business Directory', verified: true }]
  }
];

// Suppliers data (20+ realistic China / Global suppliers)
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
    advantages: ['具备全套美标NFRC/AAMA及佛州飓风认证', '资深英文工程图纸深化团队（AutoCAD/Revit）', '出货准时率99.2%，零重大索赔记录']
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
    advantages: ['源头铝锭直供，价格较华南低8-12%', '严寒地区多腔体保温系统专利丰富', '自有大型深加工保税车间']
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
    advantages: ['上海港/宁波港直发，船期密集', '大跨度超白玻璃加工能力极强']
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
    advantages: ['MOQ极低，支持快速打样与小柜测试', '配齐美式全套预冲孔与快装配件']
  }
];

// Market Opportunities (10+ key target regions)
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
    aiRecommendation: '主推U值≤0.28（美标）的高隔热断桥铝系统，搭配现代极简黑/深灰氟碳喷涂，重点突破西海岸大型独立建材批发商。'
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
    aiRecommendation: '分两线出击：德州主攻大体量标准断桥铝窗，佛州与具备NOA测试能力的实验室合作主推抗冲击高端线。'
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
    aiRecommendation: '利用中国在三玻两腔中空玻璃与大腔体注胶断桥上的成本优势，精准替代昂贵的欧洲进口品牌。'
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
    aiRecommendation: '以零关税与短交期为核心抓手，重点切入悉尼和墨尔本中大型组装厂的半成品与成品整柜采购。'
  }
];

// Competitors Data (10+ key players)
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
      '同样达到NFRC美标隔热性能指标'
    ]
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
      '支持贴牌OEM专属品牌定制，帮助经销商建立自有品牌资产'
    ]
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
      '响应敏捷，工程师24小时在线提供深化图纸'
    ]
  }
];

// Commercial Opportunities (10+ real-time leads)
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
    status: 'new'
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
    status: 'new'
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
    status: 'new'
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
    status: 'contacted'
  }
];

// Task History Data
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
    keyLeadsCount: 12
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
    keyLeadsCount: 8
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
    keyLeadsCount: 6
  }
];

// Convenient export aliases
export const mockLeads = mockCustomerLeads;
export const mockCommercialOpportunities = mockOpportunities;
