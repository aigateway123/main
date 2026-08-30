import { TenderAnalysisResult, CompanyProfile } from '../types';

export const SAMPLE_COMPANY_PROFILES: Record<string, CompanyProfile> = {
  it_company: {
    companyName: '中科智联信息技术工程有限公司',
    industry: 'IT集成 & 数字化',
    registeredCapital: '2000万元人民币',
    certifications: [
      '电子与智能化工程专业承包一级',
      'CMMI 3级认证',
      'ISO9001 质量管理体系认证',
      'ISO27001 信息安全管理体系认证',
      'ITSS 信息技术服务运行维护标准三级',
      'AAA级企业信用等级证书'
    ],
    personnel: [
      { name: '张工 (技术总监)', role: '项目经理/技术负责人', certs: '高级系统集成项目管理工程师 (高级信息系统项目管理师)、PMP', experience: '12年大型政务与智慧城市系统架构经验' },
      { name: '李工 (安全主管)', role: '网络安全工程师', certs: 'CISP 注册信息安全专业人员', experience: '8年政务云等保三级加固经验' },
      { name: '王工 (运维主管)', role: '售后与运维主管', certs: 'ITIL V4 Foundation', experience: '6年7×24小时现场维保经验' }
    ],
    cases: [
      { projectName: '某市城市运行管理中心大数据平台', client: '某市大数据管理局', amount: '1280万元', date: '2024-05', description: '涵盖微服务治理、一网统管与全景数字孪生驾驶舱' },
      { projectName: '省交通执法信息化智能综合调度系统', client: '省交通运输厅', amount: '890万元', date: '2023-11', description: '高并发流媒体处理与跨部门数据交换' },
      { projectName: '高新区智慧政务一体化协同办公平台', client: '高新区管委会', amount: '620万元', date: '2023-03', description: '信创环境适配及全栈国产化改造' }
    ],
    financialHealth: '近三年财务状况良好，资产负债率42%，连续3年经审计无亏损，纳税信用等级A级',
    afterSalesNetwork: '在本地设有常驻分支机构及备件库，承诺提供7×24小时驻场响应服务，30分钟内到场'
  },
  medical_company: {
    companyName: '诺德医疗装备科技服务有限公司',
    industry: '医疗器械 & 医院装备',
    registeredCapital: '3000万元人民币',
    certifications: [
      '第三类医疗器械经营许可证',
      '第二类医疗器械经营备案凭证',
      'ISO13485 医疗器械质量管理体系认证',
      'ISO9001 质量管理体系',
      'AAA级重合同守信用企业'
    ],
    personnel: [
      { name: '陈经理', role: '项目经理', certs: '医疗器械临床工程师、中级机电工程师', experience: '10年三甲医院手术室与影像机房交付经验' },
      { name: '刘工程师', role: '原厂认证主检工程师', certs: '西门子/飞利浦影像设备原厂高级认证技师', experience: '8年CT/DSA维护维修经验' }
    ],
    cases: [
      { projectName: '某省立第二人民医院数字化手术室系统采购', client: '某省立医院', amount: '2350万元', date: '2024-02', description: '包含术中4K影像传输及示教系统' },
      { projectName: '市中医院医疗影像中心升级采购项目', client: '市中医院', amount: '1680万元', date: '2023-08', description: 'CT、DR设备及配套机房屏蔽工程' }
    ],
    financialHealth: '注册资本3000万，年营收1.2亿元，财务审计报告规范健全',
    afterSalesNetwork: '本地化工程团队8人，备品备件库齐全，承诺2小时到达现场，备用机替换服务'
  },
  construction_company: {
    companyName: '华建建设工程总承包有限公司',
    industry: '建筑工程 & 市政施工',
    registeredCapital: '6500万元人民币',
    certifications: [
      '建筑工程施工总承包一级',
      '市政公用工程施工总承包二级',
      '建筑装修装饰工程专业承包一级',
      '安全生产许可证（在有效期内）',
      'ISO9001 / ISO14001 / ISO45001 三体系认证'
    ],
    personnel: [
      { name: '赵项目总', role: '拟任项目经理', certs: '一级建造师（建筑工程）电子注册证书、安全B证', experience: '15年房建总承包管理，无在建工程' },
      { name: '孙总工', role: '技术负责人', certs: '高级工程师职称（结构工程）', experience: '12年复杂超大跨度结构施工技术总工' }
    ],
    cases: [
      { projectName: '某高新区生物医药产业园1期厂房及研发楼', client: '经开区投资建设有限公司', amount: '7800万元', date: '2023-12', description: '钢筋混凝土框架结构，总建筑面积4.2万㎡' },
      { projectName: '市民中心便民服务大楼装修改造工程', client: '市机关事务管理局', amount: '3200万元', date: '2024-04', description: 'BIM全程协同施工' }
    ],
    financialHealth: '注册资本6500万，无重大司法冻结，提供银行开具的无不良信用记录证明',
    afterSalesNetwork: '自建工程项目维保售后部，提供两年缺陷责任期及终身结构保修服务'
  }
};

export const SAMPLE_TENDERS: Record<string, TenderAnalysisResult> = {
  'smart-city-it': {
    id: 'smart-city-it',
    timestamp: '2026-08-29 10:00:00',
    rawTextPreview: `市大数据管理局【项目编号：SZ-2026-IT-0089】智慧城市一网统管与大数据中枢平台建设项目招标公告。项目预算1500万元，资金来源为财政性资金。本项目采用综合评分法评标（商务20分，技术40分，价格30分，服务10分）。投标截止时间：2026年9月18日09:30（北京时间）。要求投标人具备电子与智能化工程专业承包一级或软件企业成熟度CMMI3及以上认证，提供近三年类似政务大数据平台合同金额不少于1000万元业绩至少2个。投标保证金30万元需于截标前由基本账户电汇。项目经理须具备高级信息系统项目管理师证书。不接受联合体投标。`,
    overview: {
      projectName: '市智慧城市“一网统管”与大数据中枢平台建设项目',
      tenderer: '市大数据发展与政务服务管理局',
      projectCode: 'SZ-2026-IT-0089',
      projectType: 'IT集成 & 政府采购',
      budget: '15,000,000.00 元（1500万元）',
      submissionDeadline: '2026年09月18日 09:30 (北京时间)',
      bidOpeningTime: '2026年09月18日 09:30 (网上不见面开标室3)',
      deliveryPeriod: '合同签订后180个日历天内完成系统上线试运行',
      bidBond: '300,000.00 元（30万元，须从基本账户转出）',
      evaluationMethod: '综合评分法（商务资信20分 + 技术方案40分 + 投标报价30分 + 售后服务10分）',
      coreSummary: '这是一个市级政务大数据与数字孪生“一网统管”枢纽工程，最适合具备电子智能化一级或CMMI3资质、拥有同类千万级政务大数据成功案例且有本地化快速响应能力的综合IT厂商参与；核心竞争点在于微服务治理与数据中枢的技术架构先进性、信创全栈适配能力及拟派团队的项目经理执业资历。',
      sourceFile: '市智慧城市一网统管与大数据中枢平台招标文件.pdf',
      fileIntegrityNote: '文件解析完整，包含招标公告、投标人须知前附表、技术需求书、评标办法及投标文件格式规范，关键条款清晰。'
    },
    qualifications: [
      {
        id: 'q1',
        category: '企业资质',
        requirement: '具备电子与智能化工程专业承包一级资质，或具备 CMMI 3 级及以上认证',
        status: '已满足',
        riskLevel: 'low',
        supplementNeeded: '提供有效资质证书正副本扫描件并加盖公章，需在全国建筑市场监管公共服务平台可查',
        sourceQuote: '第三章 投标人资格条件 第1.2条：“投标人须具备电子与智能化工程专业承包一级资质或软件能力成熟度模型CMMI3及以上认证。”'
      },
      {
        id: 'q2',
        category: '企业业绩',
        requirement: '近三年（2023年1月1日至今）具备单个合同金额不低于1000万元的市级或以上政务大数据/一网统管系统集成业绩至少2个',
        status: '待确认',
        riskLevel: 'medium',
        supplementNeeded: '需核实历史案例中合同金额是否均≥1000万元，必须提供中标通知书、合同关键页及第三方验收合格证明文件',
        sourceQuote: '资格审查表第3项：“投标人近三年须具有单项合同金额≥1000万元的政务大数据平台或一网统管实施案例至少2份。”'
      },
      {
        id: 'q3',
        category: '人员要求',
        requirement: '项目经理须具备高级信息系统项目管理师（机考证书）或一级建造师（机电），且在本单位缴纳社保连续满6个月',
        status: '已满足',
        riskLevel: 'low',
        supplementNeeded: '提供项目经理执业资格证书、身份证、社保机构出具的最近6个月参保证明',
        sourceQuote: '投标人须知第3.5.2条：“拟派项目经理须具备高级信息系统项目管理师或一级建造师（机电工程），且无在建项目承诺。”'
      },
      {
        id: 'q4',
        category: '财务要求',
        requirement: '注册资本金不低于1000万元，提供经会计师事务所审计的2023-2025年度财务审计报告（无亏损）',
        status: '已满足',
        riskLevel: 'low',
        supplementNeeded: '提供2023、2024、2025年度经审计的资产负债表、利润表、现金流量表及审计报告附注',
        sourceQuote: '资格审查标准第2.1条：“具有良好的商业信誉和健全的财务会计制度，提供近三年经审计的财务审计报告。”'
      },
      {
        id: 'q5',
        category: '其他要求',
        requirement: '本项目严禁转包、分包；不接受联合体投标；在“信用中国”及“中国政府采购网”无重大失信黑名单记录',
        status: '已满足',
        riskLevel: 'low',
        supplementNeeded: '截标前3日内在“信用中国”网站下载信用信息报告并生成带防伪码的PDF打印件附入标书',
        sourceQuote: '第一章 招标公告第5条：“本项目不接受联合体投标，不得以任何形式转包或分包。”'
      }
    ],
    risks: [
      {
        id: 'r1',
        title: '投标保证金从非基本账户转出或逾期到账导致直接废标',
        riskLevel: 'high',
        category: '投标保证金',
        originalQuote: '投标人须知前附表第16项：“投标保证金人民币30万元整，必须于2026年9月18日09:00前由投标人基本存款账户一次性汇入指定子账号。未按规定从基本账户转出或逾期到达者，其投标文件作否决投标处理。”',
        riskExplanation: '政府采购与公开招投标中最常见的一票否决项。如果财务通过一般户、个人垫付或跨行延迟导致9:00前未生成银行回执，系统将自动废标。',
        suggestedAction: '建议在截标前3天（9月15日前）完成基本户网银电汇，获取清晰的带有“基本账户”标识的银行电子回单，并将开户许可证（或基本户备案表）与回单装订在商务标显著位置。'
      },
      {
        id: 'r2',
        title: '投标文件法定代表人电子印章与CA证书授权签名不一致',
        riskLevel: 'high',
        category: '签字盖章',
        originalQuote: '评标办法附则第4.1条：“电子投标文件所有要求签字、盖章处，须按招标文件格式要求加盖单位公章及法定代表人或授权委托人电子印章/亲笔签名。授权委托书须附授权人及被授权人双人身份证正反面扫描件。”',
        riskExplanation: '若投标函、授权委托书或报价明细表遗漏电子签章，或者授权委托书上的法人签名与公章重叠遮挡、身份证有效期过期，按否决投标条款执行。',
        suggestedAction: '安排专职商务人员在电子招投标交易客户端进行“三查”：检查每一页签署位、检查CA锁数字证书有效期、检查授权委托书两份身份证清晰度。'
      },
      {
        id: 'r3',
        title: '关键技术参数（★条款）负偏离导致技术废标',
        riskLevel: 'high',
        category: '技术参数响应',
        originalQuote: '技术规格书第2.4条：“标有‘★’号的技术参数为实质性关键指标（共5项，包括高可用容灾RTO<15分钟、信创全栈中间件兼容等），投标人若出现任何一项负偏离，评标委员会将直接判定其技术审查不合格。”',
        riskExplanation: '招标文件中有5项带★条款，只要有一项指标响应为“负偏离”或未提供证明材料，将直接失去评标资格。',
        suggestedAction: '制作《★条款逐项响应与佐证材料索引表》，对5项★参数必须全部标记“完全正偏离/无偏离”，并附上对应软件著作权、第三方权威机构测试报告或官方白皮书截图作为附件。'
      },
      {
        id: 'r4',
        title: '投标报价低于成本价或超出预算控制价（1500万元）',
        riskLevel: 'medium',
        category: '报价要求',
        originalQuote: '投标人须知第12.3条：“投标总报价不得超过最高投标限价1500.00万元，否则按无效投标处理；若评标委员会认为投标人的报价明显低于其他通过符合性审查投标人的报价，有可能影响履约的，应当要求其在规定时间内提供书面说明及相关证明材料。”',
        riskExplanation: '超限价直接废标；报价过低可能触发“恶意低价澄清程序”，若2小时内无法提供成本分析佐证则被判定无效。',
        suggestedAction: '报价测算控制在1350万~1420万元最优得分区间（约占最高限价90%~94%），并提前准备好《供应链成本核算与低成本交付保障说明书》备用。'
      },
      {
        id: 'r5',
        title: '投标文件格式与页码未严格对应目录索引',
        riskLevel: 'low',
        category: '文件格式',
        originalQuote: '编制规范第6条：“投标文件应编排连续页码并生成准确目录，因页码混乱导致评委无法查阅评分佐证材料的，不利后果由投标人自行承担。”',
        riskExplanation: '不影响投标有效性，但评委快速阅卷时若找不到业绩与人员证书，会导致商务分或技术分白白被扣。',
        suggestedAction: '采用自动生成目录与超链接书签，并在技术方案前附一页《评标办法评分点与投标文件章节精准对照表》。'
      }
    ],
    evaluationScores: [
      {
        id: 's1',
        name: '企业综合资质与信誉',
        category: '商务评分',
        maxScore: 6,
        criteria: '具备CMMI5级得6分，CMMI4级得4分，CMMI3级得2分；具备ISO9001/27001体系各得1分，满分6分',
        currentStatus: '具备CMMI3级（2分） + ISO9001（1分） + ISO27001（1分） + 电子智能化一级（2分）',
        expectedScore: 5,
        improvementPotential: 1,
        improvementTips: '可补充ITSS三级证书及AAA信用评级证书以争取商务信誉满分。'
      },
      {
        id: 's2',
        name: '同类项目成功业绩',
        category: '项目业绩',
        maxScore: 10,
        criteria: '近三年单项合同金额≥1000万的政务大数据/一网统管项目，每提供1个得2.5分，最高10分（需提供合同及验收报告）',
        currentStatus: '已确认具备1个1280万案例（2.5分），另有1个890万案例（未达1000万门槛）及1个620万案例',
        expectedScore: 5,
        improvementPotential: 5,
        improvementTips: '必须深挖历史合同库，寻找满足≥1000万的第2个、第3个政务合同，或者核查890万项目是否有二期增补合同合并计算。'
      },
      {
        id: 's3',
        name: '项目团队与人员配置',
        category: '人员配置',
        maxScore: 8,
        criteria: '项目经理具备高项得3分；架构师具备高级职称得2分；安全工程师具备CISP得2分；团队人数及专业配置完善得1分',
        currentStatus: '张工（高项3分） + 李工（CISP 2分） + 王工（运维1分） + 团队完备（1分）',
        expectedScore: 7,
        improvementPotential: 1,
        improvementTips: '建议给架构师补充高级系统分析师或高级工程师职称证明，将团队项打满8分。'
      },
      {
        id: 's4',
        name: '总体架构设计与技术方案',
        category: '技术评分',
        maxScore: 25,
        criteria: '架构先进性、微服务治理、信创全栈兼容、数据中枢模型设计、高并发性能保障等5个维度，优（21-25分）、良（16-20分）、一般（10-15分）',
        currentStatus: '具备标准技术框架，微服务与中枢模型设计扎实，预计落在良好偏优区间',
        expectedScore: 22,
        improvementPotential: 3,
        improvementTips: '针对招标文件的数字孪生驾驶舱与低代码接口进行专项原型图设计，绘制高规格技术架构图，直冲24-25分顶级档位。'
      },
      {
        id: 's5',
        name: '实施部署与质量进度保障',
        category: '技术评分',
        maxScore: 15,
        criteria: '项目实施计划周密、里程碑清晰、风险应急预案完善、数据迁移与割接方案可行性',
        currentStatus: '实施计划规范，180天甘特图完整',
        expectedScore: 13,
        improvementPotential: 2,
        improvementTips: '增加“政务网络零停机割接方案”及“突发网络安全攻防演练应急处置方案”专项章节。'
      },
      {
        id: 's6',
        name: '投标报价（基准价法）',
        category: '价格评分',
        maxScore: 30,
        criteria: '满足招标文件要求且投标价格最低的投标报价为评标基准价，得满分30分。其他投标人的价格分统一按照公式：投标报价得分=(评标基准价/投标报价)×30 计算',
        currentStatus: '预计以1380万元进行测算（基准价预测在1360万左右）',
        expectedScore: 28.5,
        improvementPotential: 1.5,
        improvementTips: '采用博弈论报价模型进行精准测算，测定竞争对手均价，将价格分损失控制在1分以内。'
      },
      {
        id: 's7',
        name: '本地化售后服务与技术培训',
        category: '售后能力',
        maxScore: 6,
        criteria: '本地常驻服务机构、备件库、7×24小时响应（30分钟内到场）、驻场人员承诺及终身免费培训方案',
        currentStatus: '在本地有分公司、备件库及7×24小时响应承诺',
        expectedScore: 6,
        improvementPotential: 0,
        improvementTips: '已具备满分条件，提供房屋租赁合同、本地社保缴费凭证及服务车辆照片增强说服力。'
      }
    ],
    strategy: {
      mustPassItems: [
        '投标保证金30万元必须于9月18日09:00前从企业基本账户电汇至指定账号，切勿使用一般户',
        '法定代表人授权书与电子印章必须完整，避免因CA签名失效导致否决',
        '技术参数中5项带★关键条款必须全部响应为“正偏离/无偏离”，绝不可出现负偏离',
        '投标总报价严格不得超过最高限价1500.00万元'
      ],
      coreScoringItems: [
        '技术方案分（40分）是拉开分差的关键战场，必须在微服务架构、数据中枢模型与信创适配做深度定制',
        '投标报价分（30分）需建立数学模型拟合基准价，争取获得28.5分以上',
        '项目业绩分（10分）单项差距大，每多一个合格案例拉开2.5分'
      ],
      competitiveGapItems: [
        '同类业绩数量（要求≥1000万）：对手可能有3-4个案例（10分），我方目前仅稳拿1个（2.5分），分差可能达5分',
        '技术方案定制化深度：通用模板方案通常只拿中档分（18分左右），深度定制可冲至24分以上'
      ],
      bonusItems: [
        '提供信创产品互认适配证书（如统信UOS、麒麟OS、达梦数据库等适配证书）可作为方案加分佐证',
        '团队成员除项目经理外，补充系统架构师、CISP信息安全员高级职称可争取满分'
      ],
      actionableTactics: [
        {
          title: '方案突围策略：技术方案从“通用模板”升级为“定制化交付方案”',
          detail: '针对技术需求中提及的某市12个委办局数据打通难点，针对性设计“一网统管多租户隔离与实时流批一体中枢”，绘制高精架构图，力争技术分超越对手3-5分。',
          estimatedGain: '+3.5分',
          priority: 'high'
        },
        {
          title: '业绩补强策略：联合核查历史合同增补协议与验收单',
          detail: '紧急复核2023-2025年所有已完成项目，查验是否存在可合并计算的二期/三期增补合同，使第2个业绩达到1000万门槛，挽回2.5分。',
          estimatedGain: '+2.5分',
          priority: 'high'
        },
        {
          title: '人员配置顶配策略：绑定高级系统分析师与CISP专家',
          detail: '将拟派团队名单升级为“1位高项+1位高级架构师+2位CISP安全专家+1位ITIL运维主管”，并备齐连续6个月社保证明，锁定团队分满分8分。',
          estimatedGain: '+1.0分',
          priority: 'medium'
        },
        {
          title: '售后差异化优势：强化“本地化15分钟极速到场+首年免费驻场工程师”',
          detail: '在服务章节出具承诺函，将招标文件要求的“30分钟到场”提升为“15分钟响应、1小时解决问题”，并附上本地备件库实景图与常驻运维团队工牌。',
          estimatedGain: '+0.5分',
          priority: 'low'
        },
        {
          title: '科学博弈报价：测算最优报价区间锁定在1385万元',
          detail: '根据历史政务信息化中标折扣率（通常在91%~93.5%之间），结合项目实际软硬件供应链成本（约1050万），将报价设定为1385.00万元，确保利润率24%的同时实现综合得分最大化。',
          estimatedGain: '+1.5分',
          priority: 'high'
        }
      ]
    },
    capabilityMatrix: [
      {
        id: 'm1',
        requirement: '具备电子与智能化一级或 CMMI3 级资质',
        companyCapability: '公司具备电子与智能化工程专业承包一级资质及 CMMI3 认证，均在有效期内',
        matchScore: 100,
        gap: '无缺口，完全满足',
        suggestion: '在商务标第一部分放置双资质正副本彩色扫描件及住建部/CMMI官网查验截图',
        status: 'fully_matched'
      },
      {
        id: 'm2',
        requirement: '近三年具有≥1000万元政务大数据/一网统管类似项目业绩至少2个',
        companyCapability: '具备1个1280万市运行管理中心项目（已验收），另有1个890万省交通系统项目（未达1000万门槛）',
        matchScore: 65,
        gap: '缺少第2个单项合同≥1000万的政务大数据已验收业绩（存在2.5~5分被扣风险）',
        suggestion: '核实890万项目是否存在二期扩容合同可合并，或提报另一备选政务云项目材料',
        status: 'partially_matched'
      },
      {
        id: 'm3',
        requirement: '拟派项目经理具备高级信息系统项目管理师证书及连续6个月社保',
        companyCapability: '张工持有高项软考高级证书，已在公司缴纳社保14个月，无在建项目',
        matchScore: 100,
        gap: '无缺口',
        suggestion: '下载近6个月社保证明PDF并由人社局验真二维码附后',
        status: 'fully_matched'
      },
      {
        id: 'm4',
        requirement: '具备信创全栈环境（国产芯片/操作系统/数据库/中间件）适配能力',
        companyCapability: '已拥有与华为鲲鹏、麒麟OS、达梦数据库的兼容性互认证证书，具备实操迁移经验',
        matchScore: 100,
        gap: '无缺口',
        suggestion: '在技术方案第4章专辟一节展示互认证证书及信创性能压测数据',
        status: 'fully_matched'
      },
      {
        id: 'm5',
        requirement: '本地具备常驻售后服务机构及备件库，承诺提供7×24小时现场维保',
        companyCapability: '在项目所在市设有全资分公司，配备备件仓库及6名技术支持人员',
        matchScore: 100,
        gap: '无缺口',
        suggestion: '提供分公司营业执照、房产/租赁合同及售后服务车队照片',
        status: 'fully_matched'
      }
    ],
    combatTasks: [
      {
        id: 't1',
        task: '基本账户缴纳投标保证金30万元并获取银行电子回单',
        owner: '财务部 - 刘会计',
        deadline: '2026-09-14 (截标前4天)',
        priority: 'high',
        status: 'pending',
        note: '必须走基本账户网银转账，核对附言项目编号 SZ-2026-IT-0089'
      },
      {
        id: 't2',
        task: '开具企业资质、近3年财务审计报告及法定代表人授权书',
        owner: '商务部 - 赵经理',
        deadline: '2026-09-15',
        priority: 'high',
        status: 'in_progress',
        note: '检查审计报告盖章完整性、信用中国报告防伪码及法人授权签名'
      },
      {
        id: 't3',
        task: '技术方案核心架构图设计与5项★参数逐项响应表编制',
        owner: '技术部 - 张总工',
        deadline: '2026-09-15',
        priority: 'high',
        status: 'in_progress',
        note: '重点突出微服务中枢与信创适配，5项★参数严禁负偏离'
      },
      {
        id: 't4',
        task: '组织软硬件供应链设备询价及投标最终报价模型测算',
        owner: '商务部 + 财务部',
        deadline: '2026-09-16',
        priority: 'high',
        status: 'pending',
        note: '锁定目标报价1385万元，核算分项报价明细清单'
      },
      {
        id: 't5',
        task: '全本投标文件汇编、排版、查重与CA数字证书电子签名',
        owner: '投标项目组全体',
        deadline: '2026-09-17 12:00',
        priority: 'high',
        status: 'pending',
        note: '执行《标书体检Top10问题清单》逐项交叉复核'
      },
      {
        id: 't6',
        task: '登录公共资源电子交易平台完成投标文件上传与解密演练',
        owner: '项目负责人 - 张工',
        deadline: '2026-09-17 18:00 (截标前夜)',
        priority: 'high',
        status: 'pending',
        note: '保存上传成功回执与时间戳截图，提前测试开标机房环境'
      }
    ],
    proposalOutline: [
      {
        id: 'ch1',
        chapterNumber: '第一章',
        title: '项目背景与需求深度剖析',
        description: '全面阐述对某市智慧城市一网统管现状、政务数据孤岛痛点及建设目标的理解。',
        keyRequirements: ['理解市级政务信息化演进历程', '梳理12个委办局数据归集口径', '满足数字政府十四五发展规划'],
        draftContent: '本项目旨在依托某市现有政务云基础设施，构建“横向到边、纵向到底”的城市运行一网统管智能中枢...'
      },
      {
        id: 'ch2',
        chapterNumber: '第二章',
        title: '总体架构设计与技术路线（★重点评分项）',
        description: '详细设计微服务技术架构、数据中枢模型、信息安全防护体系及全栈信创适配方案。',
        correspondsToScoreItem: '技术评分 - 总体架构与技术方案 (满分25分)',
        scoreWeight: '25分 (核心分值项)',
        keyRequirements: ['支持每秒10万级高并发消息吞吐', '满足高可用双活容灾RTO<15分钟(★)', '全面支持国产化主流软硬件环境'],
        draftContent: '系统采用“微服务+事件驱动+流批一体”中枢架构设计，分为基础设施层、数据中枢层、业务赋能层与全景展现层...'
      },
      {
        id: 'ch3',
        chapterNumber: '第三章',
        title: '核心业务子系统与功能实现方案',
        description: '逐一响应城市运行体征监控、事件协同联动调度、视频AI智能解析、低代码看板构建等功能模块。',
        correspondsToScoreItem: '技术评分 - 功能满足度与易用性 (含在技术方案中)',
        keyRequirements: ['一网统管事件全流程闭环处置', '支持GIS一张图多图层叠加呈现', '提供开放标准的RESTful OpenAPI接口']
      },
      {
        id: 'ch4',
        chapterNumber: '第四章',
        title: '国产化信创适配与数据安全保障方案（★关键响应）',
        description: '阐明系统在麒麟/统信OS、达梦/人大金仓数据库、东方通中间件环境下的部署测试及等保三级防护措施。',
        correspondsToScoreItem: '技术评分 - 安全与信创方案 (技术加分项)',
        scoreWeight: '技术参数★条款第3项',
        keyRequirements: ['通过公安部网络安全等级保护三级测评要求', '数据传输与存储采用国密SM2/SM3/SM4加密', '提供信创互认证体系证明']
      },
      {
        id: 'ch5',
        chapterNumber: '第五章',
        title: '项目实施部署与进度质量保证计划',
        description: '制定详尽的180天工程实施甘特图、里程碑控制点、人员进场计划及质量管理规程。',
        correspondsToScoreItem: '技术评分 - 实施部署与质量进度保障 (满分15分)',
        scoreWeight: '15分',
        keyRequirements: ['合同签订后180日历天完成上线', '制定阶段性交付物与验收标准', '提供严密的风险防控与应急响应预案']
      },
      {
        id: 'ch6',
        chapterNumber: '第六章',
        title: '售后服务承诺、驻场支持与培训保障体系',
        description: '阐述7×24小时本地化运维、30分钟到场应急、为期3年的免费维保及针对操作人员的系统化培训。',
        correspondsToScoreItem: '服务评分 - 售后服务与培训承诺 (满分10分)',
        scoreWeight: '10分 (满分项)',
        keyRequirements: ['本地常设机构与备件库', '7×24小时热线及15分钟极速响应承诺', '提供全套运维操作手册与视频教程']
      },
      {
        id: 'ch7',
        chapterNumber: '第七章',
        title: '项目实施团队配置与主要人员资历',
        description: '展示项目经理、架构师、安全工程师、前端UI设计师等核心骨干的人员履历、资格证书与社保凭证。',
        correspondsToScoreItem: '商务评分 - 项目团队与人员配置 (满分8分)',
        scoreWeight: '8分',
        keyRequirements: ['项目经理具备高项软考高级证书', '配备CISP注册信息安全员', '团队成员无不良履约记录']
      },
      {
        id: 'ch8',
        chapterNumber: '第八章',
        title: '同类项目成功案例与用户评价',
        description: '汇总展示千万级政务大数据与一网统管落地案例，附中标通知书、合同关键页及用户验收表扬信。',
        correspondsToScoreItem: '商务评分 - 同类项目业绩 (满分10分)',
        scoreWeight: '10分',
        keyRequirements: ['单项合同金额≥1000万元', '附盖章版验收证明或用户评价表']
      }
    ],
    healthCheck: {
      healthScore: 84,
      highRiskCount: 2,
      mediumRiskCount: 4,
      lowRiskCount: 5,
      summary: '整体投标文件响应框架完整，技术方案亮点突出；但存在“同类千万级业绩数量偏弱”及“投标保证金与电子签名合规性”等需在提交前立即整改的关键事项。',
      dimensionChecks: {
        qualification: { title: '资格审查', status: 'pass', detail: '营业执照、CMMI3资质、纳税社保均齐全合规' },
        commercial: { title: '商务响应', status: 'warning', detail: '业绩金额存在1个案例未达1000万门槛，可能损失2.5分' },
        technical: { title: '技术参数响应', status: 'pass', detail: '5项带★实质性指标已逐项正偏离响应，附带互认证佐证' },
        scoreCoverage: { title: '评分点覆盖', status: 'warning', detail: '技术架构分已基本拉满，团队高工职称证明需进一步补齐' },
        formatting: { title: '格式与签章', status: 'warning', detail: '检查发现授权委托书第2页法人印章存在边缘微小模糊，需重新施加清晰电子印章' },
        consistency: { title: '六位一体一致性', status: 'pass', detail: '项目名称、项目编号、投标总价大写与小写金额校验无误' }
      },
      top10Issues: [
        {
          rank: 1,
          category: '资格',
          issue: '投标保证金30万元尚未打款，需严格确认由企业基本账户电汇',
          severity: 'high',
          location: '商务标 - 投标保证金缴纳凭证页',
          fixAdvice: '安排财务于9月15日前网银转账，务必附言准确的项目编号，并回贴电子回单。'
        },
        {
          rank: 2,
          category: '商务',
          issue: '案例二《省交通执法信息化项目》合同金额为890万元，未达招标文件规定的“≥1000万元”门槛',
          severity: 'high',
          location: '商务标 - 近三年类似项目业绩证明材料',
          fixAdvice: '如无法提供二期补充合同使其合并达标，应在业绩汇总表中明确标注说明，或替换为其他合规千万级业绩。'
        },
        {
          rank: 3,
          category: '技术',
          issue: '技术规格书中“双活容灾RTO<15分钟（★）”缺少第三方测试机构或软件自测报告证明',
          severity: 'medium',
          location: '技术标 - 第2章 关键技术指标响应表',
          fixAdvice: '补充附录《系统高可用与容灾恢复实测报告》作为佐证附件。'
        },
        {
          rank: 4,
          category: '格式',
          issue: '法定代表人授权委托书中的被授权人身份证复印件背面边缘有轻微遮挡',
          severity: 'medium',
          location: '商务标 - 法定代表人身份证明及授权书',
          fixAdvice: '重新高清彩色扫描被授权人身份证正反面，并由法人加盖手写电子签名。'
        },
        {
          rank: 5,
          category: '评分',
          issue: '架构师张工的高级工程师职称证书未附全国职称评审网查验二维码',
          severity: 'medium',
          location: '商务标 - 主要技术人员资历表',
          fixAdvice: '在全国人力资源社会保障政务服务平台截取职称电子证书验真页面并附于证书下方。'
        },
        {
          rank: 6,
          category: '一致性',
          issue: '分项报价表中“大数据治理中枢模块”单价合计数与分项汇总表存在0.02元四舍五入尾差',
          severity: 'medium',
          location: '开标一览表与分项报价明细表',
          fixAdvice: '重新校验Excel计算公式，确保“单价×数量=合价”、“各项合价累加=总报价”，金额大小写完全一致。'
        },
        {
          rank: 7,
          category: '格式',
          issue: '技术方案第4章部分页码跳转在目录中显示为“Error! Bookmark not defined”',
          severity: 'low',
          location: '技术标 - 目录与正文第45页',
          fixAdvice: '在导出PDF前右键更新整篇文档全部目录域，确保所有书签超链接准确。'
        },
        {
          rank: 8,
          category: '商务',
          issue: '本地化维保网络证明中，分公司房屋租赁协议有效截止日期为2026年10月，即将到期',
          severity: 'low',
          location: '服务标 - 本地化服务机构证明',
          fixAdvice: '附上分公司与物业签订的最新续租意向协议书或补充承诺函。'
        },
        {
          rank: 9,
          category: '一致性',
          issue: '投标函中投标有效期写为“90天”，招标文件前附表要求“自开标之日起120日历天”',
          severity: 'high',
          location: '商务标 - 投标函第3条',
          fixAdvice: '必须立即修改投标函中的有效期限为“120日历天”，否则构成不响应招标文件导致废标！'
        },
        {
          rank: 10,
          category: '技术',
          issue: '项目实施计划甘特图未标明国家法定节假日安排',
          severity: 'low',
          location: '技术标 - 实施进度管理表',
          fixAdvice: '在甘特图下方增加一条说明：“工期测算已包含法定节假日并安排了轮班应急保障”。'
        }
      ]
    },
    finalReport: {
      projectName: '市智慧城市“一网统管”与大数据中枢平台建设项目',
      recommendation: 'recommend',
      coreReasons: {
        qualificationMatchRate: 95,
        experienceMatchRate: 70,
        expectedScore: 86.5,
        maxScore: 100,
        primaryStrength: '拥有电子智能化一级与CMMI3双硬资质，技术架构扎实且具备自主信创互认生态，本地服务体系完备可拿满分',
        primaryWeakness: '单项合同≥1000万的历史政务业绩仅有1个确定达标，相比头部竞争对手在业绩项可能存在2.5~5分被拉开',
        maxDisqualificationRisk: '投标保证金30万必须从基本户汇出 + 投标函有效期必须满120天（严防模板笔误）',
        maxScoreOpportunity: '技术方案通过微服务治理与信创深度定制冲击24分高分档，同时将报价锁定在1385万最优博弈点'
      },
      strategicVerdict: '【🟢 建议积极参与投标】该项目与企业核心IT集成与大数据能力高度契合，资质门槛完全符合，虽然同类千万级业绩项稍有失分，但凭借技术方案深度定制（可争取+3分）和科学测算的最优报价策略，预计综合总分可达86.5~89分，具备强劲的中标竞争力。关键前置动作为：9月15日前由基本账户汇出保证金并逐项核对修正Top10问题。',
      timestamp: '2026-08-29 10:30'
    }
  },
  'hospital-medical': {
    id: 'hospital-medical',
    timestamp: '2026-08-29 11:00:00',
    rawTextPreview: `市人民医院【项目编号：YY-2026-MED-042】数字化手术室及高端影像设备采购与维保项目公开招标公告。预算金额2800万元。评标方法为综合评分法（商务25分，技术45分，价格30分）。要求投标人具备三类医疗器械经营许可证或医疗器械生产许可证，提供进口/国产设备原厂授权书及原厂技术服务承诺函。`,
    overview: {
      projectName: '市人民医院数字化手术室及高端影像设备采购与维保项目',
      tenderer: '市人民医院',
      projectCode: 'YY-2026-MED-042',
      projectType: '医疗器械 & 设备采购',
      budget: '28,000,000.00 元（2800万元）',
      submissionDeadline: '2026年09月25日 14:00 (北京时间)',
      bidOpeningTime: '2026年09月25日 14:00 (市政府采购中心开标2室)',
      deliveryPeriod: '中标后90个日历天内完成供货、机房安装调试及临床试运行',
      bidBond: '500,000.00 元（50万元）',
      evaluationMethod: '综合评分法（技术方案及设备性能45分 + 商务资信与业绩25分 + 投标报价30分）',
      coreSummary: '这是一个公立三甲医院高端医疗装备与手术室信息化升级项目，最适合具备三类医疗器械经营许可、拥有成熟原厂授权合作链条及本地化医疗工程维保团队的供应商参与；核心竞争点在于设备关键技术参数（如术中低延迟4K传输、探测器物理分辨率）完全响应、原厂售后质保年限以及合理的总包报价。',
      sourceFile: '市人民医院数字化手术室及影像设备招标文件.pdf',
      fileIntegrityNote: '文件解析完整，包含招标公告、关键参数★项清单、售后维保考核标准。'
    },
    qualifications: [
      {
        id: 'mq1',
        category: '企业资质',
        requirement: '具备有效的《医疗器械经营许可证》（第三类）或《医疗器械生产许可证》，所投产品具备《医疗器械注册证》及附表',
        status: '已满足',
        riskLevel: 'low',
        supplementNeeded: '提供许可证正副本清晰扫描件及国家药监局数据库可查证明',
        sourceQuote: '资格要求第2.1条：“投标人须具有相应类别医疗器械经营/生产许可证。”'
      },
      {
        id: 'mq2',
        category: '企业资质',
        requirement: '投标人非所投主要核心设备制造商的，须出具制造商针对本项目的合法有效授权书原件及售后服务承诺函',
        status: '待确认',
        riskLevel: 'high',
        supplementNeeded: '需立即与原厂渠道对接，取得加盖制造商公章的一对一排他性项目授权书原件',
        sourceQuote: '投标人须知第3.2条：“代理商投标必须提供制造商针对本项目的唯一项目授权书，否则投标无效。”'
      },
      {
        id: 'mq3',
        category: '企业业绩',
        requirement: '近三年（2023年至今）具备单个合同金额≥1500万元的三甲医院数字化手术室或影像设备供货与安装业绩至少1个',
        status: '已满足',
        riskLevel: 'low',
        supplementNeeded: '提供省立第二人民医院2350万案例的中标通知书、合同和验收证明',
        sourceQuote: '资格审查标准第3项：“具有三甲医院类似金额供货业绩。”'
      },
      {
        id: 'mq4',
        category: '人员要求',
        requirement: '拟派售后主检工程师须具备原厂高级技术认证证书及医疗器械临床工程师资质',
        status: '已满足',
        riskLevel: 'low',
        supplementNeeded: '提供刘工的原厂技术认证证书及身份证社保复印件',
        sourceQuote: '人员要求第4条：“技术服务人员须持有原厂认证资质证书。”'
      },
      {
        id: 'mq5',
        category: '财务要求',
        requirement: '注册资本≥2000万元，提供经会计师事务所审计的2024年度无保留意见财务审计报告',
        status: '已满足',
        riskLevel: 'low',
        supplementNeeded: '附2024年度审计报告整本扫描件',
        sourceQuote: '财务资质第1条：“财务健全，提供审计报告。”'
      }
    ],
    risks: [
      {
        id: 'mr1',
        title: '缺少原厂针对本项目的合法有效唯一项目授权书（直接废标）',
        riskLevel: 'high',
        category: '供应商资格',
        originalQuote: '招标文件否决投标条款第2条：“若投标人为代理商，未提供主要产品原厂出具的针对本项目的排他性授权书或原厂售后服务承诺书，作无效投标处理。”',
        riskExplanation: '医疗设备招标中最核心的一票否决点，一旦原厂授权给其他竞争对手或授权函格式不符，直接导致废标。',
        suggestedAction: '立即向原厂申请锁定报备本招标项目，签署排他性代理协议并获取带有防伪码或公章原件的授权书。'
      },
      {
        id: 'mr2',
        title: '核心设备8项★号技术参数存在负偏离（技术一票否决）',
        riskLevel: 'high',
        category: '技术参数响应',
        originalQuote: '技术规格书第3.1条：“数字化手术室4K术中超低延迟编码传输延时≤30ms（★）及CT探测器排数≥128排（★）为关键实质性指标，任一项负偏离直接废标。”',
        riskExplanation: '医院对医疗设备精度有强制要求，技术参数有任何不达标直接判定技术不合格。',
        suggestedAction: '对照原厂最新产品说明书及国家检验报告，逐字核实8项★参数，并附产品白皮书彩色原件扫描。'
      },
      {
        id: 'mr3',
        title: '整机及核心部件质保年限不满足招标文件最低要求（5年全保）',
        riskLevel: 'medium',
        category: '服务承诺',
        originalQuote: '售后要求第1.1条：“中标人须提供整机及球管、探测器等核心部件不少于5年的全免费原厂质保与维保（含零配件及人工）。”',
        riskExplanation: '常规设备标配质保为1-3年，若未在商务报价和原厂协议中包含5年全保，将被大幅扣除服务分甚至废标。',
        suggestedAction: '在与原厂订立采购意向时，明确将5年全保费用纳入成本核算，并出具由制造商与投标人联合盖章的《5年全免费质保承诺书》。'
      }
    ],
    evaluationScores: [
      {
        id: 'ms1',
        name: '设备技术性能与配置参数（45分）',
        category: '技术评分',
        maxScore: 45,
        criteria: '技术指标优劣评定，8项★号无偏离（基础合格），普通参数正偏离项每项加1分，满分45分',
        currentStatus: '设备性能优异，满足所有技术指标且有4项正偏离',
        expectedScore: 42,
        improvementPotential: 3,
        improvementTips: '补充临床试验数据对比表及三甲医院使用反馈报告以争取技术满分。'
      },
      {
        id: 'ms2',
        name: '商务资质与类似项目业绩（25分）',
        category: '商务评分',
        maxScore: 25,
        criteria: '三甲医院1500万以上同类业绩每提供1个得5分（最高15分）；企业三体系与信用得10分',
        currentStatus: '具备1个2350万省立医院三甲业绩（得5分），企业信用及体系健全（得10分）',
        expectedScore: 20,
        improvementPotential: 5,
        improvementTips: '寻找第2个三甲医院案例，力争再加5分。'
      },
      {
        id: 'ms3',
        name: '投标报价（30分）',
        category: '价格评分',
        maxScore: 30,
        criteria: '低价优先法计算价格得分',
        currentStatus: '预计以2580万元进行测算',
        expectedScore: 27,
        improvementPotential: 3,
        improvementTips: '测算合理降价空间至2520万元以提升价格分。'
      }
    ],
    strategy: {
      mustPassItems: [
        '必须取得原厂针对本项目的唯一项目授权书及原厂售后服务承诺函原件',
        '8项★号技术参数必须全部正偏离或无偏离',
        '三类医疗器械经营许可证与注册证必须在有效期内'
      ],
      coreScoringItems: [
        '设备技术性能参数（45分）占总分近半壁江山，是决定胜负的最核心分值',
        '投标报价分（30分）需精细核算设备进口关税、安装机房屏蔽工程及5年维保成本'
      ],
      competitiveGapItems: [
        '原厂售后质保承诺与本地工程师驻点：原厂联合服务方案更受院方专家青睐',
        '类似三甲医院大型案例数量'
      ],
      bonusItems: [
        '提供数字化手术室配套临床AI辅助分析软件著作权及试用授权',
        '提供原厂认证的高级机电与临床工程技术人员证书'
      ],
      actionableTactics: [
        {
          title: '锁定原厂唯一授权与价格保护',
          detail: '第一时间与设备原厂签订项目锁定函，防止竞争对手通过同一品牌低价串标。',
          estimatedGain: '核心准入前提',
          priority: 'high'
        },
        {
          title: '强化手术室洁净与铅屏蔽工程施工一体化方案',
          detail: '除了设备供货外，将机房射线防护及层流洁净施工做成特色图解方案，提升技术方案评委打分。',
          estimatedGain: '+3.0分',
          priority: 'high'
        },
        {
          title: '推出“5年全保+2小时极速备机替换”保障承诺',
          detail: '解决医院临床停机风险痛点，打满售后服务分。',
          estimatedGain: '+2.0分',
          priority: 'medium'
        }
      ]
    },
    capabilityMatrix: [
      {
        id: 'mm1',
        requirement: '具备三类医疗器械经营许可证及有效医疗器械注册证',
        companyCapability: '三类医疗器械经营许可证齐全，所投型号注册证有效期至2028年',
        matchScore: 100,
        gap: '无',
        suggestion: '附药监局官方备案与注册证扫描件',
        status: 'fully_matched'
      },
      {
        id: 'mm2',
        requirement: '原厂合法授权书与原厂售后服务承诺函',
        companyCapability: '与主流原厂有战略合作，正在推进本项目专属授权书签署',
        matchScore: 85,
        gap: '待原厂正式盖章回传原件',
        suggestion: '指定专人跟踪原厂授权函用印进度',
        status: 'partially_matched'
      },
      {
        id: 'mm3',
        requirement: '近三年三甲医院≥1500万类似项目业绩',
        companyCapability: '有省立第二人民医院2350万项目合同及验收证明',
        matchScore: 100,
        gap: '已有1个，若能补充第2个更佳',
        suggestion: '重点展示省立医院案例的高清实景照片与用户满意度回执',
        status: 'fully_matched'
      }
    ],
    combatTasks: [
      {
        id: 'mt1',
        task: '跟踪落实设备原厂唯一项目授权书与5年质保承诺函盖章原件',
        owner: '商务部 - 陈经理',
        deadline: '2026-09-18',
        priority: 'high',
        status: 'in_progress',
        note: '原厂授权为一票否决项，必须拿到原件并扫描放入标书'
      },
      {
        id: 'mt2',
        task: '汇出投标保证金50万元并打印银行回单',
        owner: '财务部',
        deadline: '2026-09-20',
        priority: 'high',
        status: 'pending',
        note: '从基本户打款至指定专户'
      },
      {
        id: 'mt3',
        task: '核对8项★技术指标及设备彩页技术参数响应表',
        owner: '技术部 - 刘工',
        deadline: '2026-09-21',
        priority: 'high',
        status: 'pending',
        note: '逐项核对检测报告页码'
      },
      {
        id: 'mt4',
        task: '标书最终汇编胶装与密封（正本1份，副本4份，电子U盘1份）',
        owner: '投标项目组',
        deadline: '2026-09-24 15:00',
        priority: 'high',
        status: 'pending',
        note: '严格按文件要求双信封密封并加盖骑缝章'
      }
    ],
    proposalOutline: [
      {
        id: 'mch1',
        chapterNumber: '第一章',
        title: '项目概述与三甲医院临床需求响应',
        description: '响应院方对手术室信息化、4K超高清术中示教及医疗设备安全稳定性的严苛要求。',
        keyRequirements: ['医院数字化发展目标', '临床工作流适配']
      },
      {
        id: 'mch2',
        chapterNumber: '第二章',
        title: '核心医疗设备性能参数与技术规格逐项响应（★核心评分）',
        description: '逐条响应8项★参数与普通参数，附国家药监局检验报告及彩页。',
        correspondsToScoreItem: '技术评分 - 设备性能与配置 (45分)',
        scoreWeight: '45分',
        keyRequirements: ['8项★参数完全无负偏离', '探测器与图像算法正偏离佐证']
      },
      {
        id: 'mch3',
        chapterNumber: '第三章',
        title: '数字化手术室与影像机房施工安装及屏蔽工程方案',
        description: '机房射线防护施工、洁净层流配套与弱电布线实施计划。',
        correspondsToScoreItem: '技术评分 - 施工与安装方案',
        keyRequirements: ['符合国家辐射防护安全标准', '90天交钥匙工期安排']
      },
      {
        id: 'mch4',
        chapterNumber: '第四章',
        title: '5年原厂全免费保修与本地化维保应急响应承诺',
        description: '原厂工程师驻场、2小时到场、备件库现货及备用机替换方案。',
        correspondsToScoreItem: '商务服务评分 - 售后与培训 (15分)',
        scoreWeight: '15分',
        keyRequirements: ['5年全保承诺书', '本地工程师资质']
      }
    ],
    healthCheck: {
      healthScore: 89,
      highRiskCount: 1,
      mediumRiskCount: 2,
      lowRiskCount: 3,
      summary: '设备参数与资质响应完备，需重点防范原厂授权书用印时效及纸质标书双信封密封盖章。',
      dimensionChecks: {
        qualification: { title: '资格审查', status: 'pass', detail: '三类医疗许可证有效，注册证在期' },
        commercial: { title: '商务响应', status: 'warning', detail: '原厂授权书正本需在截标前入库' },
        technical: { title: '技术参数响应', status: 'pass', detail: '★条款全部正偏离响应' },
        scoreCoverage: { title: '评分点覆盖', status: 'pass', detail: '技术分与服务分结构完整' },
        formatting: { title: '格式与密封', status: 'warning', detail: '要求技术标与商务报价标分设独立密封袋（双信封法）' },
        consistency: { title: '一致性核对', status: 'pass', detail: '设备型号与注册证完全一致' }
      },
      top10Issues: [
        {
          rank: 1,
          category: '资格',
          issue: '原厂授权书原件需在9月20日前快递到位并加盖原厂公章',
          severity: 'high',
          location: '商务标 - 制造商授权书',
          fixAdvice: '指定专人跟踪快递单号，收到后即刻扫描并装入正本。'
        },
        {
          rank: 2,
          category: '格式',
          issue: '本项目采用双信封开标，商务报价标与技术标必须分别独立密封',
          severity: 'high',
          location: '标书外包装与封皮',
          fixAdvice: '准备两套不同封条，分别标注“商务标封袋”与“技术标封袋”，封口处由法定代表人加盖公章与骑缝章。'
        },
        {
          rank: 3,
          category: '技术',
          issue: '数字化手术室软件著作权登记证书上的权利人名称需与投标人完全一致',
          severity: 'medium',
          location: '技术标 - 软件自主知识产权证明',
          fixAdvice: '若属于母子公司共有，须补充出具母子公司授权关联证明函。'
        }
      ]
    },
    finalReport: {
      projectName: '市人民医院数字化手术室及高端影像设备采购与维保项目',
      recommendation: 'recommend',
      coreReasons: {
        qualificationMatchRate: 100,
        experienceMatchRate: 85,
        expectedScore: 89.0,
        maxScore: 100,
        primaryStrength: '拥有三甲医院同类成功交付案例，技术参数完全响应且具备原厂深度合作与5年本地化全保优势',
        primaryWeakness: '原厂唯一授权书原件获取进度需严密跟进，防范对手恶性抢注',
        maxDisqualificationRisk: '缺少原厂排他性授权书或双信封密封混淆将导致直接废标',
        maxScoreOpportunity: '技术参数4项正偏离可冲刺42分以上高分，配合2520万精准报价'
      },
      strategicVerdict: '【🟢 建议积极参与投标】该项目为公司核心优势领域，技术契合度极高，只要按期拿到原厂排他授权并做好双信封密封合规，中标胜率极高。',
      timestamp: '2026-08-29 11:15'
    }
  }
};

export const sampleTenders = SAMPLE_TENDERS;
export const sampleCompanyProfiles = Object.values(SAMPLE_COMPANY_PROFILES);

