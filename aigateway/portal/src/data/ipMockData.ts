// ============================================================================
// 知识产权 · AI 知识产权顾问 工作台 Demo 大体积数据
// 忠实取自原型 mockData.ts 的六个数据集（数字/字符串/字段/顺序逐字搬运）：
//   MOCK_COMPETITORS / MOCK_RISK_ITEMS / MOCK_OPPORTUNITIES /
//   MOCK_PYRAMID_TIERS / MOCK_INTELLIGENCE / MOCK_PATENTS_DATABASE
//   另含自有专利资产 ENTERPRISE_SELF_PATENTS（my-patents 视图）
// 源文件：docs/仓库/xx-ai-·-ai知识产权顾问/src/data/mockData.ts
// 类型定义见 ./ipIntelData.ts；ipIntelData 已含 AnalysisInput /
//   TechnicalFeatureComparison / RiskLevel / DEFAULT_ANALYSIS_INPUT /
//   IP_TECHNICAL_FIELDS / buildIpWorkflowSteps，本文件不重复导出这些。
// ============================================================================
import type {
  Patent,
  Competitor,
  RiskItem,
  LayoutOpportunity,
  PyramidTier,
  IPIntelligence,
  EnterpriseSelfPatents,
} from './ipIntelData'

export const MOCK_COMPETITORS: Competitor[] = [
  {
    id: 'catl',
    name: '宁德时代 (CATL)',
    englishName: 'Contemporary Amperex Technology Co., Limited',
    logoColor: '#2563EB',
    headquarters: '中国·福建宁德',
    totalPatents: 14820,
    corePatentsCount: 1260,
    recentFiveYearsAdded: 8450,
    overseasPatentRatio: 42,
    marketShare: '36.8%',
    summary: '全球储能与动力电池龙头，储能领域专利集中在CTP高集成Pack、多回路液冷流道板、主动消防联动及BMS高精度SOC算法。在欧美布局了密集的PCT专利网。',
    aiAdvice: 'CATL在储能热管理及系统集成领域形成较完整的专利组合，建议企业重点关注液冷结构、热管理控制及系统集成相关专利，避免直接沿用多孔分流板排布。',
    focusAreas: [
      { field: '液冷系统', intensity: 96, patentCount: 680 },
      { field: '热管理', intensity: 92, patentCount: 750 },
      { field: 'Pack结构', intensity: 88, patentCount: 1120 },
      { field: 'BMS', intensity: 82, patentCount: 890 },
      { field: '消防系统', intensity: 78, patentCount: 430 },
      { field: '电芯', intensity: 94, patentCount: 1850 },
      { field: '储能系统', intensity: 86, patentCount: 520 },
      { field: '控制算法', intensity: 79, patentCount: 390 }
    ],
    matrixPosition: [
      { field: '电芯', intensity: 95, bubbleSize: 32 },
      { field: 'Pack', intensity: 90, bubbleSize: 28 },
      { field: 'BMS', intensity: 84, bubbleSize: 24 },
      { field: '热管理', intensity: 92, bubbleSize: 30 },
      { field: '液冷', intensity: 96, bubbleSize: 34 },
      { field: '消防', intensity: 80, bubbleSize: 20 },
      { field: '储能系统', intensity: 88, bubbleSize: 26 },
      { field: '控制算法', intensity: 81, bubbleSize: 22 }
    ]
  },
  {
    id: 'byd',
    name: '比亚迪 (BYD)',
    englishName: 'BYD Company Limited',
    logoColor: '#DC2626',
    headquarters: '中国·广东深圳',
    totalPatents: 12450,
    corePatentsCount: 940,
    recentFiveYearsAdded: 6820,
    overseasPatentRatio: 31,
    marketShare: '16.2%',
    summary: '依托刀片电池在储能电站广泛应用，其储能系统专利重在直冷直热、蛇形铝扁管贴合工艺及储能魔方模块化结构，电芯层与结构层专利极其坚固。',
    aiAdvice: 'BYD在长薄电芯侧板液冷和直冷换热专利密集，建议我方产品如果采用底部托盘流道方案，须规避其集流管快速卡接与绝缘防凝露权利要求。',
    focusAreas: [
      { field: 'Pack结构', intensity: 94, patentCount: 980 },
      { field: '热管理', intensity: 89, patentCount: 620 },
      { field: '电芯', intensity: 92, patentCount: 1450 },
      { field: '液冷系统', intensity: 85, patentCount: 510 },
      { field: 'BMS', intensity: 76, patentCount: 490 },
      { field: '储能系统', intensity: 88, patentCount: 470 },
      { field: '消防系统', intensity: 72, patentCount: 310 },
      { field: '控制算法', intensity: 74, patentCount: 290 }
    ],
    matrixPosition: [
      { field: '电芯', intensity: 92, bubbleSize: 30 },
      { field: 'Pack', intensity: 94, bubbleSize: 32 },
      { field: 'BMS', intensity: 78, bubbleSize: 20 },
      { field: '热管理', intensity: 88, bubbleSize: 26 },
      { field: '液冷', intensity: 84, bubbleSize: 24 },
      { field: '消防', intensity: 73, bubbleSize: 18 },
      { field: '储能系统', intensity: 89, bubbleSize: 27 },
      { field: '控制算法', intensity: 75, bubbleSize: 19 }
    ]
  },
  {
    id: 'tesla',
    name: '特斯拉 (Tesla)',
    englishName: 'Tesla, Inc.',
    logoColor: '#E11D48',
    headquarters: '美国·德克萨斯奥斯汀',
    totalPatents: 6380,
    corePatentsCount: 810,
    recentFiveYearsAdded: 3950,
    overseasPatentRatio: 68,
    marketShare: '14.5%',
    summary: 'Megapack与Powerwall储能系统技术领军者，专长于整机集成热负荷智能分配、双向冷却回路热泵协同以及分布式BMS神经元网络架构。欧美基础专利壁垒深厚。',
    aiAdvice: 'Tesla在美国和欧洲拥有针对大容量储能集装箱集中冷水机组与各簇独立PID阀控的组合专利，出海欧美市场需重点进行FTO排查。',
    focusAreas: [
      { field: '储能系统', intensity: 95, patentCount: 480 },
      { field: '控制算法', intensity: 93, patentCount: 420 },
      { field: '热管理', intensity: 91, patentCount: 390 },
      { field: '液冷系统', intensity: 87, patentCount: 340 },
      { field: 'BMS', intensity: 89, patentCount: 410 },
      { field: '消防系统', intensity: 84, patentCount: 210 },
      { field: 'Pack结构', intensity: 82, patentCount: 360 },
      { field: '电芯', intensity: 75, patentCount: 280 }
    ],
    matrixPosition: [
      { field: '电芯', intensity: 76, bubbleSize: 18 },
      { field: 'Pack', intensity: 83, bubbleSize: 22 },
      { field: 'BMS', intensity: 90, bubbleSize: 28 },
      { field: '热管理', intensity: 91, bubbleSize: 28 },
      { field: '液冷', intensity: 86, bubbleSize: 25 },
      { field: '消防', intensity: 85, bubbleSize: 22 },
      { field: '储能系统', intensity: 96, bubbleSize: 32 },
      { field: '控制算法', intensity: 94, bubbleSize: 30 }
    ]
  },
  {
    id: 'lg',
    name: 'LG新能源 (LG Energy Solution)',
    englishName: 'LG Energy Solution, Ltd.',
    logoColor: '#BE185D',
    headquarters: '韩国·首尔',
    totalPatents: 11200,
    corePatentsCount: 880,
    recentFiveYearsAdded: 6100,
    overseasPatentRatio: 64,
    marketShare: '10.8%',
    summary: '软包与大圆柱储能应用主力，在导热相变复合胶液冷集成、防热失控隔热气凝胶垫层和多级安全泄压阀方面专利覆盖严密。',
    aiAdvice: 'LG在欧美针对软包储能模组双面贴合散热板申请了高价值专利族，若企业涉及复合导热胶或模组间绝缘散热结构需防范。',
    focusAreas: [
      { field: '热管理', intensity: 88, patentCount: 490 },
      { field: '液冷系统', intensity: 82, patentCount: 380 },
      { field: '电芯', intensity: 93, patentCount: 1320 },
      { field: 'BMS', intensity: 81, patentCount: 440 },
      { field: 'Pack结构', intensity: 84, patentCount: 560 },
      { field: '消防系统', intensity: 86, patentCount: 290 },
      { field: '储能系统', intensity: 79, patentCount: 310 },
      { field: '控制算法', intensity: 73, patentCount: 220 }
    ],
    matrixPosition: [
      { field: '电芯', intensity: 94, bubbleSize: 29 },
      { field: 'Pack', intensity: 85, bubbleSize: 23 },
      { field: 'BMS', intensity: 80, bubbleSize: 21 },
      { field: '热管理', intensity: 89, bubbleSize: 25 },
      { field: '液冷', intensity: 82, bubbleSize: 22 },
      { field: '消防', intensity: 87, bubbleSize: 24 },
      { field: '储能系统', intensity: 78, bubbleSize: 19 },
      { field: '控制算法', intensity: 72, bubbleSize: 17 }
    ]
  },
  {
    id: 'samsung',
    name: '三星SDI (Samsung SDI)',
    englishName: 'Samsung SDI Co., Ltd.',
    logoColor: '#0369A1',
    headquarters: '韩国·首尔',
    totalPatents: 8900,
    corePatentsCount: 650,
    recentFiveYearsAdded: 4500,
    overseasPatentRatio: 59,
    marketShare: '6.5%',
    summary: '主打高安全方形铝壳电芯储能柜，专攻灭火剂定向注入流道管路一体化、微通道均温板焊接防漏设计。',
    aiAdvice: '三星在防漏冷却液回流保护阀与消防水气共用管路有精巧专利，对系统紧凑型设计构成专利交叉。',
    focusAreas: [
      { field: '消防系统', intensity: 90, patentCount: 310 },
      { field: '热管理', intensity: 83, patentCount: 390 },
      { field: '液冷系统', intensity: 79, patentCount: 290 },
      { field: '电芯', intensity: 89, patentCount: 890 },
      { field: 'BMS', intensity: 75, patentCount: 310 },
      { field: 'Pack结构', intensity: 81, patentCount: 420 },
      { field: '储能系统', intensity: 77, patentCount: 260 },
      { field: '控制算法', intensity: 71, patentCount: 190 }
    ],
    matrixPosition: [
      { field: '电芯', intensity: 90, bubbleSize: 26 },
      { field: 'Pack', intensity: 80, bubbleSize: 21 },
      { field: 'BMS', intensity: 76, bubbleSize: 18 },
      { field: '热管理', intensity: 84, bubbleSize: 22 },
      { field: '液冷', intensity: 78, bubbleSize: 20 },
      { field: '消防', intensity: 91, bubbleSize: 25 },
      { field: '储能系统', intensity: 76, bubbleSize: 18 },
      { field: '控制算法', intensity: 70, bubbleSize: 16 }
    ]
  },
  {
    id: 'sungrow',
    name: '阳光电源 (Sungrow)',
    englishName: 'Sungrow Power Supply Co., Ltd.',
    logoColor: '#F59E0B',
    headquarters: '中国·安徽合肥',
    totalPatents: 5200,
    corePatentsCount: 410,
    recentFiveYearsAdded: 3400,
    overseasPatentRatio: 38,
    marketShare: '12.4%',
    summary: '光储一体化与电网友好型储能大厂，在储能变流器PCS与液冷温控联动、全栈微网热损耗动态平衡算法布局突出。',
    aiAdvice: '阳光电源在温控与变流器联动降额保护算法上专利较多，可关注其系统级节能调度。',
    focusAreas: [
      { field: '储能系统', intensity: 92, patentCount: 510 },
      { field: '控制算法', intensity: 88, patentCount: 380 },
      { field: '热管理', intensity: 82, patentCount: 290 },
      { field: '液冷系统', intensity: 78, patentCount: 240 },
      { field: 'BMS', intensity: 79, patentCount: 280 },
      { field: 'Pack结构', intensity: 70, patentCount: 210 },
      { field: '消防系统', intensity: 75, patentCount: 180 },
      { field: '电芯', intensity: 45, patentCount: 80 }
    ],
    matrixPosition: [
      { field: '电芯', intensity: 45, bubbleSize: 12 },
      { field: 'Pack', intensity: 71, bubbleSize: 18 },
      { field: 'BMS', intensity: 80, bubbleSize: 22 },
      { field: '热管理', intensity: 82, bubbleSize: 23 },
      { field: '液冷', intensity: 78, bubbleSize: 20 },
      { field: '消防', intensity: 76, bubbleSize: 19 },
      { field: '储能系统', intensity: 93, bubbleSize: 29 },
      { field: '控制算法', intensity: 89, bubbleSize: 26 }
    ]
  },
  {
    id: 'eve',
    name: '亿纬锂能 (EVE Energy)',
    englishName: 'EVE Energy Co., Ltd.',
    logoColor: '#10B981',
    headquarters: '中国·广东惠州',
    totalPatents: 4800,
    corePatentsCount: 330,
    recentFiveYearsAdded: 3100,
    overseasPatentRatio: 26,
    marketShare: '7.8%',
    summary: '大容量储能磷酸铁锂电芯引领者，其液冷方案偏重于底部液冷与模组间集流母排隔离降温。',
    aiAdvice: '在双面挤压铝冷板与快插盲插水接头处持有实用新型与发明专利，需注意接头结构比对。',
    focusAreas: [
      { field: '电芯', intensity: 91, patentCount: 920 },
      { field: 'Pack结构', intensity: 82, patentCount: 420 },
      { field: '热管理', intensity: 79, patentCount: 280 },
      { field: '液冷系统', intensity: 77, patentCount: 230 },
      { field: '储能系统', intensity: 74, patentCount: 190 },
      { field: 'BMS', intensity: 68, patentCount: 160 },
      { field: '消防系统', intensity: 70, patentCount: 120 },
      { field: '控制算法', intensity: 65, patentCount: 110 }
    ],
    matrixPosition: [
      { field: '电芯', intensity: 91, bubbleSize: 28 },
      { field: 'Pack', intensity: 83, bubbleSize: 22 },
      { field: 'BMS', intensity: 69, bubbleSize: 16 },
      { field: '热管理', intensity: 80, bubbleSize: 21 },
      { field: '液冷', intensity: 77, bubbleSize: 20 },
      { field: '消防', intensity: 71, bubbleSize: 17 },
      { field: '储能系统', intensity: 75, bubbleSize: 18 },
      { field: '控制算法', intensity: 66, bubbleSize: 15 }
    ]
  },
  {
    id: 'gotion',
    name: '国轩高科 (Gotion High-tech)',
    englishName: 'Gotion High-tech Co., Ltd.',
    logoColor: '#6366F1',
    headquarters: '中国·安徽合肥',
    totalPatents: 4200,
    corePatentsCount: 290,
    recentFiveYearsAdded: 2700,
    overseasPatentRatio: 24,
    marketShare: '4.9%',
    summary: '高安全性电池与储能集成，在水冷集装箱内部风道与液冷互补散热拥有组合专利。',
    aiAdvice: '主要聚焦中端风冷+局部液冷混合，与我方全液冷架构冲突度适中。',
    focusAreas: [
      { field: '电芯', intensity: 88, patentCount: 810 },
      { field: '热管理', intensity: 76, patentCount: 240 },
      { field: 'Pack结构', intensity: 79, patentCount: 360 },
      { field: '液冷系统', intensity: 72, patentCount: 190 },
      { field: '储能系统', intensity: 72, patentCount: 180 },
      { field: 'BMS', intensity: 67, patentCount: 150 },
      { field: '消防系统', intensity: 68, patentCount: 110 },
      { field: '控制算法', intensity: 62, patentCount: 90 }
    ],
    matrixPosition: [
      { field: '电芯', intensity: 88, bubbleSize: 25 },
      { field: 'Pack', intensity: 79, bubbleSize: 20 },
      { field: 'BMS', intensity: 67, bubbleSize: 15 },
      { field: '热管理', intensity: 76, bubbleSize: 19 },
      { field: '液冷', intensity: 73, bubbleSize: 18 },
      { field: '消防', intensity: 69, bubbleSize: 16 },
      { field: '储能系统', intensity: 72, bubbleSize: 17 },
      { field: '控制算法', intensity: 63, bubbleSize: 14 }
    ]
  }
]

export const MOCK_RISK_ITEMS: RiskItem[] = [
  {
    id: 'risk-01',
    title: '液冷管路结构与歧管分流专利风险',
    technicalField: '热管理',
    riskLevel: 'high',
    riskScore: 86,
    relatedPatentId: 'CN114567890A',
    relatedPatentTitle: '一种用于储能电池集装箱的等程流道分流液冷管网结构',
    patentApplicant: '宁德时代新能源科技股份有限公司 (CATL)',
    patentCountry: 'CN',
    recommendation: '深入比对，建议启动权利要求规避设计或提出专利无效宣告检索',
    detailedAction: '企业方案在主管路变径设计及U型并联分支管布局上与该专利权利要求1特征高度重合。建议将并联等程改为阶梯阻尼式文丘里分流通道，破坏相同侵权判定。',
    enterpriseScheme: '液冷储能系统采用多通道并联液冷结构，主管进水分配给模组底板，双向对称回流。',
    patentScheme: '主干总管通过阶梯缩径腔体分流至各子流道，且出入口处于对角等程布置。',
    techSimilarity: 91,
    claimOverlap: 82,
    legalStatus: '有效发明授权',
    validUntil: '2039-11-15',
    featureComparisons: [
      {
        featureName: '液冷管路拓扑',
        enterpriseSolution: '多通道并联等程结构，对角进出液',
        patentSolution: '对称阶梯管径对角等流阻布管设计',
        similarity: 92,
        keyDifference: '管径变化过渡角度略有5度差异，属于等同特征范畴',
        infringementRisk: 'high'
      },
      {
        featureName: '冷却液循环方式',
        enterpriseSolution: '变频泵主动加压闭环循环，双向温差反馈',
        patentSolution: '主动闭环恒压泵送及双温区反馈流控',
        similarity: 88,
        keyDifference: '我方采用PID加前馈调节，专利限定恒压比例阀',
        infringementRisk: 'high'
      },
      {
        featureName: '冷却板基材与工艺',
        enterpriseSolution: '钎焊铝合金多腔冲压挤出冷板',
        patentSolution: '真空钎焊双层铝挤压微通道复合板',
        similarity: 81,
        keyDifference: '内部扰流筋形状为菱形，专利为蜂窝阵列',
        infringementRisk: 'high'
      },
      {
        featureName: '温度控制与阀控',
        enterpriseSolution: 'BMS集中算法调配各簇电动三通调节阀',
        patentSolution: '每簇冷板入口独立电磁脉冲间隙阀控',
        similarity: 55,
        keyDifference: '阀体控制形式与信号来源具有明显技术差异',
        infringementRisk: 'medium'
      }
    ]
  },
  {
    id: 'risk-02',
    title: '电池包底部液冷板与绝缘隔热结构侵权风险',
    technicalField: '热管理',
    riskLevel: 'high',
    riskScore: 84,
    relatedPatentId: 'US11234567B2',
    relatedPatentTitle: 'Liquid-cooled thermal barrier plate assembly for energy storage pack',
    patentApplicant: 'Tesla, Inc.',
    patentCountry: 'US',
    recommendation: '出海美国市场前须进行专业FTO法律意见书出具并准备替换方案',
    detailedAction: '特斯拉US独立权利要求涵盖了底板铝挤出件上表面涂覆高分子相变绝缘材料直接贴合电芯底部的保护范围。建议改用分体式预成型绝缘膜+非固化导热凝胶垫。',
    enterpriseScheme: '电芯底部直接坐落于液冷冷板上，冷板顶面一体喷涂环氧绝缘导热层。',
    patentScheme: 'A thermal plate having integral coolant passages and a direct-bonded dielectric polymer matrix layer supporting prismatic cells.',
    techSimilarity: 89,
    claimOverlap: 85,
    legalStatus: 'US Patent Active',
    validUntil: '2038-04-20',
    featureComparisons: [
      {
        featureName: '底板导热界面',
        enterpriseSolution: '一体化静电喷涂纳米氧化铝改性绝缘层',
        patentSolution: 'Direct-bonded dielectric polymer matrix coating',
        similarity: 94,
        keyDifference: '树脂基体配方略有不同，但物理结合状态完全符合字面侵权',
        infringementRisk: 'high'
      },
      {
        featureName: '通道集成形式',
        enterpriseSolution: '下底板摩擦焊一次成型蛇形凹槽',
        patentSolution: 'Integral extruded cooling passages with internal fins',
        similarity: 86,
        keyDifference: '成型工艺不同，但成型后的流道内部微结构效果相同',
        infringementRisk: 'high'
      },
      {
        featureName: '电芯膨胀补偿',
        enterpriseSolution: '侧边微弹性硅胶垫吸收电芯充放电呼吸膨胀',
        patentSolution: 'Compressible foam pads disposed between adjacent cells',
        similarity: 78,
        keyDifference: '弹性吸收部件位置与材质不同',
        infringementRisk: 'medium'
      },
      {
        featureName: '系统防漏排液孔',
        enterpriseSolution: '冷板外沿带漏液导流槽及底部光电测漏传感器',
        patentSolution: 'Drain channel with conductivity sensor at lowest sump',
        similarity: 62,
        keyDifference: '传感器工作原理不同 (光学折射 vs 电导率探针)',
        infringementRisk: 'low'
      }
    ]
  },
  {
    id: 'risk-03',
    title: '储能集装箱簇间温差平衡与流量分配控制算法',
    technicalField: '控制算法',
    riskLevel: 'high',
    riskScore: 82,
    relatedPatentId: 'CN115890123A',
    relatedPatentTitle: '多簇并联液冷储能电站簇间极差自适应流量调控方法与系统',
    patentApplicant: '宁德时代 (CATL)',
    patentCountry: 'CN',
    recommendation: '算法代码层进行规避，引入非线性模糊自整定或强化学习动态策略',
    detailedAction: '涉案专利保护“基于历史发热量与当前最高温差比率计算各簇目标开度”的递推公式。建议我方切换为基于端电压内阻估算的预测模型控制(MPC)。',
    enterpriseScheme: '根据各电池簇最高单体温度与平均温度差值，计算电动调节阀开度比例。',
    patentScheme: '以极差ΔT与SOC加权积分作为输入，查表获取开度步进修正量。',
    techSimilarity: 88,
    claimOverlap: 79,
    legalStatus: '有效授权发明',
    validUntil: '2040-03-12',
    featureComparisons: [
      {
        featureName: '输入特征参数',
        enterpriseSolution: '采集Tmax, Tmin, SOC与充放电倍率C-rate',
        patentSolution: '采集各簇最高温差ΔT、SOC离散度与累计通流Ah',
        similarity: 90,
        keyDifference: '特征量选取高度重合',
        infringementRisk: 'high'
      },
      {
        featureName: '控制执行机制',
        enterpriseSolution: 'PWM驱动各支路比例调节阀',
        patentSolution: '步进电机控制各进水支路开度',
        similarity: 85,
        keyDifference: '执行机构物理形式不同，但控流逻辑等同',
        infringementRisk: 'high'
      },
      {
        featureName: '极差收敛判据',
        enterpriseSolution: '簇间最高温差控制在2.5℃以内',
        patentSolution: '设定温差死区阈值±2℃并在死区内保持',
        similarity: 70,
        keyDifference: '阈值设定范围不同',
        infringementRisk: 'medium'
      },
      {
        featureName: '故障降额联动',
        enterpriseSolution: '温差超5℃触发PCS限功率降额',
        patentSolution: '温差超阈值强制单簇解列隔离',
        similarity: 48,
        keyDifference: '保护动作逻辑具有实质性区别',
        infringementRisk: 'low'
      }
    ]
  },
  {
    id: 'risk-04',
    title: '盲插自密封液冷快换接头防滴漏锁止机构',
    technicalField: '液冷',
    riskLevel: 'high',
    riskScore: 81,
    relatedPatentId: 'EP3891234A1',
    relatedPatentTitle: 'Dripless blind-mate liquid connector assembly for energy storage racks',
    patentApplicant: 'BYD Company Limited',
    patentCountry: 'EP',
    recommendation: '审查欧专局审查意见，考虑与供应商联合开发非侵权弹珠卡扣方案',
    detailedAction: '欧洲专利权利要求1覆盖了具有浮动导向套筒、双向弹簧自闭止回阀芯及二次锁扣限位销的结构。我方采用的公头设计极易落入该保护范围。',
    enterpriseScheme: '电池箱推入机架时，后部液冷公母接头自动对准插入，内置单向截止阀。',
    patentScheme: 'Floating alignment collar with bi-directional spring-loaded poppet valves and secondary latch lock.',
    techSimilarity: 87,
    claimOverlap: 81,
    legalStatus: 'EP Granted',
    validUntil: '2039-08-30',
    featureComparisons: [
      {
        featureName: '盲插容差机构',
        enterpriseSolution: '外圈漏斗形锥形导向喇叭口，径向浮动±3mm',
        patentSolution: 'Radial self-centering spherical guide cone ±3.5mm',
        similarity: 93,
        keyDifference: '锥度角为15度 vs 18度，属于等同特征',
        infringementRisk: 'high'
      },
      {
        featureName: '双向止回防漏',
        enterpriseSolution: '拔出瞬间两端阀芯在弹簧推力下自动闭合',
        patentSolution: 'Synchronized spring poppet closure prior to physical decoupling',
        similarity: 91,
        keyDifference: '闭合顺序微差，实质技术效果一致',
        infringementRisk: 'high'
      },
      {
        featureName: '锁紧防松结构',
        enterpriseSolution: '机箱把手拉紧销联动锁扣',
        patentSolution: 'Integral rotational bayonet latch on connector body',
        similarity: 58,
        keyDifference: '锁紧施力点不同，我方在机箱外侧，专利在接头本体',
        infringementRisk: 'medium'
      },
      {
        featureName: '微泄漏检测',
        enterpriseSolution: '无直接电信号检测，纯机械防漏',
        patentSolution: 'Capacitive moisture detection ring embedded in mating face',
        similarity: 20,
        keyDifference: '不包含该从属权利要求特征',
        infringementRisk: 'low'
      }
    ]
  },
  {
    id: 'risk-05',
    title: '液冷储能电池热失控喷淋与排气协同结构',
    technicalField: '消防',
    riskLevel: 'high',
    riskScore: 79,
    relatedPatentId: 'CN113456789B',
    relatedPatentTitle: '一种储能模组定向泄压防串火与液冷消防双通道构件',
    patentApplicant: '宁德时代 (CATL)',
    patentCountry: 'CN',
    recommendation: '针对其权利要求中的特定双腔结构做单腔物理隔离规避',
    detailedAction: '该专利将泄爆通道与液冷板夹层并列布置。我方研发若将电芯泄压阀直接朝向冷板穿孔喷淋孔，会落入从属权利要求的侵权风险。',
    enterpriseScheme: '电芯防爆阀朝向侧方排气道，排气道内置微型液冷消防喷雾喷嘴。',
    patentScheme: '具有上下分隔腔体，上腔排烟排气，下腔集成液冷通道与破裂触发喷水阀。',
    techSimilarity: 84,
    claimOverlap: 76,
    legalStatus: '有效授权',
    validUntil: '2039-06-18',
    featureComparisons: [
      {
        featureName: '泄压通道布局',
        enterpriseSolution: '模组上盖一体化烟气汇集通道',
        patentSolution: 'Upper exhaust chamber with directional flame baffle',
        similarity: 86,
        keyDifference: '阻火网安装方式不同',
        infringementRisk: 'high'
      },
      {
        featureName: '消防液注入机制',
        enterpriseSolution: '感温玻璃球喷淋喷头受热爆破',
        patentSolution: '热熔合金保险柱释放弹簧阀片',
        similarity: 82,
        keyDifference: '触发敏感元件物理形态不同',
        infringementRisk: 'high'
      },
      {
        featureName: '与液冷板结构关系',
        enterpriseSolution: '独立外接水管，与冷板物理隔离',
        patentSolution: '与液冷板出水歧管共用承压主管',
        similarity: 50,
        keyDifference: '具有重要不相同特征，有利于不侵权抗辩',
        infringementRisk: 'medium'
      },
      {
        featureName: '烟气阻隔防火棉',
        enterpriseSolution: '陶瓷纤维防火隔热垫',
        patentSolution: '膨胀型石墨阻火密封圈',
        similarity: 60,
        keyDifference: '材料机理不同',
        infringementRisk: 'low'
      }
    ]
  },
  {
    id: 'risk-06',
    title: '模块化储能集装箱热泵全工况能效优化策略',
    technicalField: '热管理',
    riskLevel: 'high',
    riskScore: 78,
    relatedPatentId: 'US10987654B2',
    relatedPatentTitle: 'System and method for thermodynamic optimization of multi-rack battery cooling',
    patentApplicant: 'Tesla, Inc.',
    patentCountry: 'US',
    recommendation: '在北美市场进行权利要求拆解，委托第三方律所开展非侵权设计论证',
    detailedAction: '涵盖双回路热泵自由冷却(Free Cooling)模式根据环境湿球温度自动切换的技术方案。我方需增加余热利用或相变蓄冷差异化步骤。',
    enterpriseScheme: '根据室外环境温度与电芯温度，自动在自然冷却(走冷塔)与压缩机制冷间切换。',
    patentScheme: 'Dynamic ambient psychrometric enthalpy switching between economizer and active chiller modes.',
    techSimilarity: 85,
    claimOverlap: 77,
    legalStatus: 'US Patent Active',
    validUntil: '2037-12-10',
    featureComparisons: [
      {
        featureName: '工况判断条件',
        enterpriseSolution: '室外干球温度低于设定阈值(15℃)即切自然冷',
        patentSolution: '计算环境空气焓值与露点综合指数切换',
        similarity: 85,
        keyDifference: '参数计算复杂度不同，但属于等同技术手段',
        infringementRisk: 'high'
      },
      {
        featureName: '多通阀门切换',
        enterpriseSolution: '四通换向阀切换双回路管线',
        patentSolution: 'Multi-port proportional blending valve manifold',
        similarity: 83,
        keyDifference: '我方为离散状态切换，专利含无级比例混合',
        infringementRisk: 'high'
      },
      {
        featureName: '压缩机变频策略',
        enterpriseSolution: '直流变频PID跟随冷冻水出水温差',
        patentSolution: 'Predictive neural model mapping cell thermal inertia',
        similarity: 54,
        keyDifference: '控制模型算法存在显著差异',
        infringementRisk: 'medium'
      },
      {
        featureName: '冷凝水排放处理',
        enterpriseSolution: '重力式倾斜底槽导向外部排水管',
        patentSolution: 'Vaporization nozzle spraying condensate onto condenser',
        similarity: 32,
        keyDifference: '构造与功能完全不同',
        infringementRisk: 'low'
      }
    ]
  },
  {
    id: 'risk-07',
    title: '大容量电芯侧面贴附S型液冷折弯管结构',
    technicalField: '液冷',
    riskLevel: 'high',
    riskScore: 77,
    relatedPatentId: 'CN112987654A',
    relatedPatentTitle: '一种长薄型电池侧向蛇形换热扁管与弹性夹紧组件',
    patentApplicant: '比亚迪股份有限公司 (BYD)',
    patentCountry: 'CN',
    recommendation: '深入比对卡簧弹片及管路间歇折弯半径，申请我方波浪导流专利',
    detailedAction: '若我方采用方形电芯侧贴蛇形扁管方案，极易落入比亚迪核心权利要求。建议采用全底置或者微通道直板三明治结构。',
    enterpriseScheme: '在两排电芯之间插入连续弯折的多回转铝制蛇形扁管。',
    patentScheme: '蛇形扁管外包覆硅胶缓冲垫，通过U型金属卡簧与电芯大面预压贴合。',
    techSimilarity: 86,
    claimOverlap: 78,
    legalStatus: '有效授权',
    validUntil: '2040-01-25',
    featureComparisons: [
      {
        featureName: '扁管成型特征',
        enterpriseSolution: '多孔微通道铝扁管拉弯成S型',
        patentSolution: 'Multi-port microchannel serpentine flat tube with pre-curved bends',
        similarity: 95,
        keyDifference: '折弯节距几乎相同',
        infringementRisk: 'high'
      },
      {
        featureName: '贴合固定方式',
        enterpriseSolution: '弹簧钢片夹爪压紧扁管与电芯侧面',
        patentSolution: 'U-shaped resilient spring clip retaining flat tube against cell casing',
        similarity: 88,
        keyDifference: '卡簧冲压开孔形状不同',
        infringementRisk: 'high'
      },
      {
        featureName: '管路绝缘层',
        enterpriseSolution: '热缩套管包覆',
        patentSolution: '绝缘导热涂料喷涂',
        similarity: 65,
        keyDifference: '工艺方式不同',
        infringementRisk: 'medium'
      },
      {
        featureName: '进出口弯头焊接',
        enterpriseSolution: '激光焊接铜铝过渡接头',
        patentSolution: '火焰钎焊一体化成型',
        similarity: 50,
        keyDifference: '冶金连接工艺不同',
        infringementRisk: 'low'
      }
    ]
  },
  {
    id: 'risk-08',
    title: '高压储能BMS主动均衡与液冷温差补偿协同算法',
    technicalField: 'BMS',
    riskLevel: 'high',
    riskScore: 75,
    relatedPatentId: 'EP3765432B1',
    relatedPatentTitle: 'Method for coordinated cell balancing and thermal dissipation in modular energy storage',
    patentApplicant: 'LG Energy Solution, Ltd.',
    patentCountry: 'EP',
    recommendation: '调整BMS均衡逻辑触发机制，规避“依据温差梯度加权分配均衡电流”特征',
    detailedAction: '该专利保护在电芯温升高于设定阈值时动态抑制主动均衡电流以防止局部过热。我方需更改为基于压差为主、温度仅作为紧急硬切断的逻辑。',
    enterpriseScheme: 'BMS根据单体电芯荷电状态及测温点温差，动态调整双向DC-DC主动均衡占空比。',
    patentScheme: 'Coordinating active balancing current magnitude inversely proportional to local coolant temperature rise.',
    techSimilarity: 83,
    claimOverlap: 75,
    legalStatus: 'EP Granted & Active',
    validUntil: '2038-09-14',
    featureComparisons: [
      {
        featureName: '均衡电流调制',
        enterpriseSolution: '温差大于3℃时将均衡电流线性下调50%',
        patentSolution: 'Dynamic derating of balancing current based on gradient between inlet and outlet coolant',
        similarity: 89,
        keyDifference: '温差计算基准点略有不同，但技术构思高度吻合',
        infringementRisk: 'high'
      },
      {
        featureName: '硬件电路拓扑',
        enterpriseSolution: '反激式隔离双向变压器能量转移电路',
        patentSolution: 'Isolated bidirectional flyback converter matrix',
        similarity: 84,
        keyDifference: 'MOS管驱动时序不同',
        infringementRisk: 'high'
      },
      {
        featureName: '单体健康度SOH评估',
        enterpriseSolution: '安时积分法结合内阻谱估计',
        patentSolution: 'Kalman filter incorporating thermal gradient',
        similarity: 62,
        keyDifference: '状态估计算法模型不同',
        infringementRisk: 'medium'
      },
      {
        featureName: '通讯总线架构',
        enterpriseSolution: '双路菊花链Daisy-Chain菊花链隔离通信',
        patentSolution: 'Dual-ring CAN bus topology',
        similarity: 40,
        keyDifference: '物理层总线标准完全不同',
        infringementRisk: 'low'
      }
    ]
  },
  // 12 Additional Medium & Low Risk Items
  {
    id: 'risk-09',
    title: '液冷储能柜多级漏液自关断电磁截止阀控制',
    technicalField: '液冷',
    riskLevel: 'medium',
    riskScore: 68,
    relatedPatentId: 'CN114321098A',
    relatedPatentTitle: '一种储能集装箱液冷系统分区防漏控制装置',
    patentApplicant: '阳光电源股份有限公司',
    patentCountry: 'CN',
    recommendation: '进一步检索权利要求审查历史，进行从属权利要求防范',
    detailedAction: '审查阳光电源最新答辩意见陈述书，其保护范围可能被限缩在特定压降探头组合。',
    enterpriseScheme: '集装箱底部托盘检测到液体浸润时，切断本簇液冷电磁主阀。',
    patentScheme: '通过进出水流量差与液位继电器双重逻辑联锁切断。',
    techSimilarity: 72,
    claimOverlap: 65,
    legalStatus: '公布实审',
    validUntil: '2041-02-18',
    featureComparisons: []
  },
  {
    id: 'risk-10',
    title: '储能电池包上盖集成膨胀冷凝收集槽',
    technicalField: 'Pack',
    riskLevel: 'medium',
    riskScore: 66,
    relatedPatentId: 'CN217654321U',
    relatedPatentTitle: '一种防止冷凝水滴落的储能电池箱顶盖结构',
    patentApplicant: '中创新航科技集团股份有限公司',
    patentCountry: 'CN',
    recommendation: '结构方案改用倾斜导水筋，避开其顶盖一体压铸十字冷凝收集槽专利',
    detailedAction: '实用新型专利维权较快，建议直接修改箱盖内胆斜面引流设计。',
    enterpriseScheme: '电池箱顶盖内表面设有导流倾角，冷凝水沿边缘汇流排至侧壁。',
    patentScheme: '顶盖设置呈十字形交叉排布的冷凝接水槽和吸水海绵条。',
    techSimilarity: 70,
    claimOverlap: 62,
    legalStatus: '实用新型有效',
    validUntil: '2031-10-09',
    featureComparisons: []
  },
  {
    id: 'risk-11',
    title: '液冷管路快速防冻加热电极PTC启停逻辑',
    technicalField: '热管理',
    riskLevel: 'medium',
    riskScore: 64,
    relatedPatentId: 'US11098761B2',
    relatedPatentTitle: 'Coolant preheating strategy under subzero temperature for outdoor ESS',
    patentApplicant: 'Tesla, Inc.',
    patentCountry: 'US',
    recommendation: '审查欧美市场优先权期限，评估无效答辩空间',
    detailedAction: '涉案专利涉及零下20度工况下利用变频泵自扰动摩擦生热辅助PTC加热的控制流程。',
    enterpriseScheme: '低温冷启动时开启板载PTC加热器加热循环乙二醇水溶液。',
    patentScheme: 'Hydraulic kinetic dissipation combined with high-voltage immersion heater.',
    techSimilarity: 68,
    claimOverlap: 59,
    legalStatus: 'US Active',
    validUntil: '2039-05-12',
    featureComparisons: []
  },
  {
    id: 'risk-12',
    title: '液冷散热板内部流阻均一化树状仿生流道',
    technicalField: '热管理',
    riskLevel: 'medium',
    riskScore: 62,
    relatedPatentId: 'CN113890456A',
    relatedPatentTitle: '分形叶脉状均温换热板及其制造方法',
    patentApplicant: '亿纬锂能 (EVE Energy)',
    patentCountry: 'CN',
    recommendation: '对比叶脉分级分叉比，我方改用对称三维交错多层流道',
    detailedAction: '亿纬锂能专利限定了二级、三级分支流道面积比在特定黄金分割区间内。',
    enterpriseScheme: '冷板内部采用分形多分枝流道以降低各处局部流阻。',
    patentScheme: '采用分形维数为1.6-1.8的叶脉级联分支分流腔体。',
    techSimilarity: 65,
    claimOverlap: 58,
    legalStatus: '在审',
    validUntil: '2041-07-22',
    featureComparisons: []
  },
  {
    id: 'risk-13',
    title: '储能集装箱多簇直冷管路铜铝过渡摩擦焊接头',
    technicalField: 'Pack',
    riskLevel: 'medium',
    riskScore: 60,
    relatedPatentId: 'CN111223344B',
    relatedPatentTitle: '一种电池冷水管铜铝异种金属惯性摩擦焊接工艺与接头',
    patentApplicant: '国轩高科动力能源股份有限公司',
    patentCountry: 'CN',
    recommendation: '要求外协管路供应商出具不侵权证明或改用机械胀管锁紧',
    detailedAction: '该项为制造工艺专利，可通过采购具有自有专利授权合格供应商的成品组件化解。',
    enterpriseScheme: '管路端部铝接管与机柜外部铜阀件通过摩擦焊接头过渡连接。',
    patentScheme: '接头界面具有特定厚度的金属间化合物过渡层及防腐蚀绝缘套。',
    techSimilarity: 63,
    claimOverlap: 54,
    legalStatus: '有效授权',
    validUntil: '2038-02-14',
    featureComparisons: []
  },
  {
    id: 'risk-14',
    title: '储能变流器与液冷机组一体化热电协同控制',
    technicalField: '储能系统',
    riskLevel: 'medium',
    riskScore: 58,
    relatedPatentId: 'CN115678901A',
    relatedPatentTitle: '光储电站变流升压一体舱温控与功率因数动态调节系统',
    patentApplicant: '阳光电源股份有限公司',
    patentCountry: 'CN',
    recommendation: '仅在成套系统投标时做界面隔离，明确由第三方PCS集成商承担责任',
    detailedAction: '主要限定在变流升压一体舱中温控水冷与IGBT结温联动的技术方案。',
    enterpriseScheme: '储能系统EMS根据PCS工作状态预判发热量并提前降温。',
    patentScheme: 'EMS直接读取PCS内部IGBT瞬态结温并作为液冷机组变频前馈。',
    techSimilarity: 61,
    claimOverlap: 50,
    legalStatus: '有效授权',
    validUntil: '2040-08-19',
    featureComparisons: []
  },
  {
    id: 'risk-15',
    title: '储能箱体高防护等级IP67快装防爆呼吸阀',
    technicalField: 'Pack',
    riskLevel: 'low',
    riskScore: 45,
    relatedPatentId: 'CN218765432U',
    relatedPatentTitle: '一种兼具防水透气与瞬时泄爆双功能的储能箱体呼吸阀',
    patentApplicant: '宁德时代 (CATL)',
    patentCountry: 'CN',
    recommendation: '标准件外购，持续监控其专利权有效性',
    detailedAction: '市场已有公知通用件替代，且我方可采购通过CATL交叉许可供应商的部件。',
    enterpriseScheme: '箱体侧面设置透气防水膨胀阀，在微压差下透气，高压下整体翻转泄爆。',
    patentScheme: '防水透气膜组件与弹簧预压泄压板同轴嵌套式安装在法兰座。',
    techSimilarity: 48,
    claimOverlap: 38,
    legalStatus: '有效',
    validUntil: '2032-04-11',
    featureComparisons: []
  },
  {
    id: 'risk-16',
    title: '储能柜内部垂直风道与水平液冷板复合散热通道',
    technicalField: '热管理',
    riskLevel: 'low',
    riskScore: 42,
    relatedPatentId: 'CN110987123B',
    relatedPatentTitle: '一种机柜式储能电池风液混合冷却导流装置',
    patentApplicant: '比亚迪 (BYD)',
    patentCountry: 'CN',
    recommendation: '属于公知常规技术设计，现有技术抗辩证据充分',
    detailedAction: '已检索到2014年欧美现有公开文献公开了类似风液互补方案，侵权诉讼风险极低。',
    enterpriseScheme: '电池簇水平放置液冷板，机柜两侧留有垂直辅助抽风风道。',
    patentScheme: '下进风上出风机柜内配置水平承载式铝冷板。',
    techSimilarity: 44,
    claimOverlap: 35,
    legalStatus: '有效',
    validUntil: '2036-12-05',
    featureComparisons: []
  },
  {
    id: 'risk-17',
    title: '高压汇流铜排与液冷管路平行布线绝缘固定支架',
    technicalField: 'Pack',
    riskLevel: 'low',
    riskScore: 39,
    relatedPatentId: 'CN216543210U',
    relatedPatentTitle: '一种储能高压箱水电隔离走线卡扣',
    patentApplicant: '国轩高科',
    patentCountry: 'CN',
    recommendation: '自行优化卡扣卡合点，建立实用新型专利防御',
    detailedAction: '简单机械固定结构，容易进行非实质性改动。',
    enterpriseScheme: '绝缘尼龙注塑支架分层固定动力母线与冷却液管。',
    patentScheme: '双层卡槽带有自锁搭扣的阻燃塑料卡座。',
    techSimilarity: 42,
    claimOverlap: 30,
    legalStatus: '有效',
    validUntil: '2031-08-20',
    featureComparisons: []
  },
  {
    id: 'risk-18',
    title: '储能电站远程云端BMS电芯热失控早期预警模型',
    technicalField: '控制算法',
    riskLevel: 'low',
    riskScore: 37,
    relatedPatentId: 'US10876543B2',
    relatedPatentTitle: 'Cloud-based thermal runaway risk detection for stationary energy storage',
    patentApplicant: 'Tesla, Inc.',
    patentCountry: 'US',
    recommendation: '我方部署在边缘本地计算，不在云端执行涉案计算步骤',
    detailedAction: '利用执行主体分离抗辩，将核心数据处理置于本地边缘网关完成。',
    enterpriseScheme: '本地EMS网关提取电芯内阻与产气微压，不上报原始时序至云端。',
    patentScheme: 'Transmitting raw cell data to cloud server training recurrent neural network.',
    techSimilarity: 40,
    claimOverlap: 28,
    legalStatus: 'US Active',
    validUntil: '2038-03-29',
    featureComparisons: []
  },
  {
    id: 'risk-19',
    title: '液冷储能电站防冻液除锈防垢缓蚀剂配方',
    technicalField: '液冷',
    riskLevel: 'low',
    riskScore: 32,
    relatedPatentId: 'CN113456123A',
    relatedPatentTitle: '一种长寿命铝合金液冷系统专用防腐抑菌冷却液',
    patentApplicant: '宁德时代 (CATL)',
    patentCountry: 'CN',
    recommendation: '冷却液直接采用中石化或巴斯夫公开标准产品',
    detailedAction: '采购具有成熟市场流通与专利自由使用的标准化冷却液商品。',
    enterpriseScheme: '采用外购标准有机酸复合型工业防冻防腐液。',
    patentScheme: '特定摩尔比的三氮唑与硅酸盐聚合物缓蚀添加剂。',
    techSimilarity: 35,
    claimOverlap: 22,
    legalStatus: '在审',
    validUntil: '2041-05-16',
    featureComparisons: []
  },
  {
    id: 'risk-20',
    title: '储能集装箱底部防震液压缓冲支撑脚垫',
    technicalField: '储能系统',
    riskLevel: 'low',
    riskScore: 28,
    relatedPatentId: 'CN215432198U',
    relatedPatentTitle: '一种抗震型户外储能集装箱基础减震支撑座',
    patentApplicant: '阳光电源',
    patentCountry: 'CN',
    recommendation: '常规土建与底座配合，无侵权风险',
    detailedAction: '符合常规机械抗震规范标准件。',
    enterpriseScheme: '底座采用标准橡胶气垫隔振垫。',
    patentScheme: '双筒液压减震器与碟簧组合抗震脚座。',
    techSimilarity: 30,
    claimOverlap: 18,
    legalStatus: '有效',
    validUntil: '2031-03-05',
    featureComparisons: []
  }
]
export const MOCK_OPPORTUNITIES: LayoutOpportunity[] = [
  {
    id: 'opp-01',
    numberCode: '01',
    title: '智能液冷流量微调与动态自适应拓扑控制',
    opportunityScore: 91,
    competitionIntensity: '中',
    whiteSpaceDegree: '非常明显',
    recommendation: '优先布局',
    technicalField: '控制算法',
    description: '当前巨头多采用整簇统一恒流或集中查表调节，尚未有人对单模组内部细分流道进行脉宽调制(PWM)或微通道电磁脉冲主动均温控制。该方向专利空白明显。',
    targetClaims: [
      '一种基于温度梯度矩阵的储能多通道液冷流量自适应分配方法',
      '微通道内部嵌入形状记忆合金动态变截面导流片结构',
      '具有脉冲交替反向洗刷防结垢功能的流控算法及系统'
    ],
    suggestedFilingWindow: '1-3个月内优先提交中国发明专利，并同步准备PCT国际申请',
    potentialValue: '商业核心'
  },
  {
    id: 'opp-02',
    numberCode: '02',
    title: '模块化液冷板免排空带液快速热插拔更换结构',
    opportunityScore: 87,
    competitionIntensity: '中低',
    whiteSpaceDegree: '较明显',
    recommendation: '重点研究',
    technicalField: '液冷',
    description: '电站运维中单模组故障往往需要停机排空整簇冷却液。研发一套免排空自锁止快换接头与二次集水防漏托盘结构，能大幅降低电站LCOE度电成本。',
    targetClaims: [
      '一种储能电站免停机带液热插拔液冷快换接头机构',
      '具备负压瞬时自抽吸防残液滴漏的自闭式母座组件',
      '模组抽拉导轨与液冷管路同轴滑块联动定位机构'
    ],
    suggestedFilingWindow: '2-4个月内完成样机实验数据补强并申请发明+实用新型双报',
    potentialValue: '防御壁垒'
  },
  {
    id: 'opp-03',
    numberCode: '03',
    title: '储能热管理系统内漏与微压阻降故障早期预测算法',
    opportunityScore: 84,
    competitionIntensity: '中',
    whiteSpaceDegree: '较明显',
    recommendation: '持续布局',
    technicalField: '控制算法',
    description: '现有专利侧重于漏液发生后的电导率或浮子传感器被动报警。基于水泵扬程曲线、管阻微积分与流量瞬变波动实现隐性微渗漏提前数小时预警，是前沿空白。',
    targetClaims: [
      '基于流体动力学状态观测器的储能液冷管网隐蔽性微泄漏预测模型',
      '水泵电机功耗与系统沿程阻力自校准特征提取算法',
      '结合绝缘阻抗衰减斜率的系统级安全综合决策机制'
    ],
    suggestedFilingWindow: '3-6个月内形成算法纯软与软硬结合专利池',
    potentialValue: '授权突破'
  },
  {
    id: 'opp-04',
    numberCode: '04',
    title: '大容量长刀电芯双面相变均温与复合液冷流道集成',
    opportunityScore: 82,
    competitionIntensity: '中',
    whiteSpaceDegree: '较明显',
    recommendation: '重点研究',
    technicalField: '热管理',
    description: '针对500Ah+超大储能电芯，单一冷板难以抑制芯体厚度方向温升。结合微胶囊相变材料涂层与超薄双面复合液冷板可抢占下一代大电芯热管理制高点。',
    targetClaims: [
      '集成相变储能夹层的电芯大面波纹换热复合板',
      '超大容量储能单体内部埋入式微热管与外部冷板导热配合结构',
      '相变潜热利用与液冷泵启停解耦温控系统'
    ],
    suggestedFilingWindow: '近期提交基础结构专利，抢占优先权',
    potentialValue: '出海护城河'
  },
  {
    id: 'opp-05',
    numberCode: '05',
    title: '液冷消防共用管路高压爆破膜定向惰性气体置换系统',
    opportunityScore: 80,
    competitionIntensity: '低',
    whiteSpaceDegree: '非常明显',
    recommendation: '快速占位',
    technicalField: '消防',
    description: '将正常工况下的乙二醇循环回路，在电芯热失控时毫秒级切换为氮气吹扫并注入专用灭火水剂，省去独立消防管路空间。',
    targetClaims: [
      '一种储能电站液冷管网与惰化灭火共用管路的双向隔离切换总成',
      '基于防爆电磁三通阀的残液快速排空并注气联锁控制方法',
      '电芯穿刺热失控早期特征信号与消防流道破裂自触发机构'
    ],
    suggestedFilingWindow: '1-2个月内立即递交技术交底书',
    potentialValue: '商业核心'
  },
  {
    id: 'opp-06',
    numberCode: '06',
    title: '储能集装箱极端高低温环境相变蓄冷余热回收多联系统',
    opportunityScore: 78,
    competitionIntensity: '中低',
    whiteSpaceDegree: '适中',
    recommendation: '持续布局',
    technicalField: '热管理',
    description: '在戈壁沙漠等昼夜温差达40℃的极端储能场景，白天吸收电芯废热蓄热，夜间释放保温；或利用夜间低谷电蓄冷白天释冷，大幅提升全生命周期能效。',
    targetClaims: [
      '一种带有固液相变蓄能水箱的储能液冷温控多模式切换管路',
      '利用夜间环境低温冷源削峰填谷的储能热泵控制策略',
      '三级热回收旁通阀组及其季节性自适应运行模式'
    ],
    suggestedFilingWindow: '半年度内完成专利网构建',
    potentialValue: '防御壁垒'
  },
  {
    id: 'opp-07',
    numberCode: '07',
    title: '三维螺旋扰流微结构无阻滞铝挤出一体冷板制造工艺',
    opportunityScore: 76,
    competitionIntensity: '中',
    whiteSpaceDegree: '较明显',
    recommendation: '优先布局',
    technicalField: 'Pack',
    description: '现有冷板多为传统平直微通道或冲压凹坑，换热效率与流阻矛盾突出。创新内部螺旋肋扰流型腔，可在相同泵功下提升30%对流换热系数。',
    targetClaims: [
      '具有内螺旋强化扰流槽的储能冷板无缝挤压型材及连续加工工艺',
      '变螺距微流道流体均质化压力场设计方法',
      '冷板摩擦搅拌焊无飞边封堵端头结构'
    ],
    suggestedFilingWindow: '配合生产工艺验证完成专利挖掘',
    potentialValue: '防御壁垒'
  },
  {
    id: 'opp-08',
    numberCode: '08',
    title: '基于电网调频调峰功率预测的储能系统热负荷前瞻预冷方法',
    opportunityScore: 75,
    competitionIntensity: '低',
    whiteSpaceDegree: '较明显',
    recommendation: '快速占位',
    technicalField: '控制算法',
    description: '通常热管理是被动响应电芯升温。结合调度AGC指令与日前电价预测，在电池高倍率大电流注入前15分钟提前预冷，消除温度尖峰。',
    targetClaims: [
      '结合电网AGC响应指令的储能液冷系统前瞻性预冷控制模型',
      '考虑电池电化学热惯性迟滞时间常数的前馈调节算法',
      '基于日前充放电计划的温控能耗最小化凸优化策略'
    ],
    suggestedFilingWindow: '建议立即撰写软件著作权及核心发明专利',
    potentialValue: '商业核心'
  },
  {
    id: 'opp-09',
    numberCode: '09',
    title: '储能液冷板全生命周期腐蚀厚度超声波无损自巡检系统',
    opportunityScore: 73,
    competitionIntensity: '低',
    whiteSpaceDegree: '非常明显',
    recommendation: '适时跟进',
    technicalField: '液冷',
    description: '电站设计寿命达15-20年，乙二醇弱酸性长期腐蚀可能导致冷板穿孔造成灾难性短路。集成微型压电超声探头实时监测壁厚变化。',
    targetClaims: [
      '集成声表面波探头的储能冷板腐蚀减薄原位监测装置',
      '基于导波反射谱特性的冷板内壁点蚀智能识别算法',
      '分布式耐腐蚀传感器阵列与BMS通信采集网络'
    ],
    suggestedFilingWindow: '产学研合作预研并布局发明',
    potentialValue: '防御壁垒'
  },
  {
    id: 'opp-10',
    numberCode: '10',
    title: '模块化储能液冷系统无工具单手自紧固盲插对准滑架',
    opportunityScore: 72,
    competitionIntensity: '中低',
    whiteSpaceDegree: '适中',
    recommendation: '持续布局',
    technicalField: 'Pack',
    description: '优化工人在狭小集装箱舱道内的维护人机工程学，通过杠杆增力自偏心滑道实现大推力快插公母头可靠对接。',
    targetClaims: [
      '一种用于重型储能PACK抽拉的自导正增力快锁机械架',
      '偏心凸轮机构连动水电气三合一连接器分步插拔装置',
      '防误插视觉指示与行程微动开关互锁系统'
    ],
    suggestedFilingWindow: '伴随新品结构件定型同步申报实用新型与发明',
    potentialValue: '防御壁垒'
  },
  {
    id: 'opp-11',
    numberCode: '11',
    title: '浸没式氟化液与外循环液冷双模式混动储能热管理系统',
    opportunityScore: 70,
    competitionIntensity: '中',
    whiteSpaceDegree: '局部空白',
    recommendation: '适时跟进',
    technicalField: '热管理',
    description: '针对超高倍率调频储能或极端高温地区，采用模组级全密封微浸没与外部大循环乙二醇水间接换热结合方案。',
    targetClaims: [
      '微量介质浸没绝缘冷却液与外部二次冷水板复合换热箱体',
      '沸腾气化冷凝回流与外循环泵控协同热平衡控制系统',
      '防泄漏氟化液回收自冷凝气囊组件'
    ],
    suggestedFilingWindow: '技术探索储备类专利布局',
    potentialValue: '出海护城河'
  },
  {
    id: 'opp-12',
    numberCode: '12',
    title: '基于数字孪生模型的储能集装箱三维温场流固耦合实时重建',
    opportunityScore: 69,
    competitionIntensity: '中',
    whiteSpaceDegree: '局部空白',
    recommendation: '持续布局',
    technicalField: '控制算法',
    description: '通过布置有限测温点(每簇4-8个)，利用降阶物理模型实时还原数万颗电芯内部热点分布，指导精准控温。',
    targetClaims: [
      '基于本征正交分解(POD)的储能液冷舱实时温度场虚拟重构方法',
      '稀疏温度测点逆向反演冷却液流速偏差的数据驱动算法',
      '电芯核心内部温度与表面散热通量软测量模型'
    ],
    suggestedFilingWindow: '联合高校算法团队进行专利挖掘',
    potentialValue: '授权突破'
  },
  {
    id: 'opp-13',
    numberCode: '13',
    title: '储能液冷集装箱顶部冷凝水回流增湿与绝热遮阳隔热层',
    opportunityScore: 67,
    competitionIntensity: '低',
    whiteSpaceDegree: '较明显',
    recommendation: '快速占位',
    technicalField: '储能系统',
    description: '利用户外集装箱外壁双层空气通风夹层，结合空调冷凝水蒸发吸热，降低箱顶受太阳暴晒导致的辐射得热。',
    targetClaims: [
      '具有太阳辐射自驱动通风隔热外罩的储能方舱',
      '利用机组冷凝水雾化冷却箱顶表面的降温系统',
      '相变绝热涂料与百叶导风板复合集装箱结构'
    ],
    suggestedFilingWindow: '申报结构实用新型快速确权',
    potentialValue: '防御壁垒'
  },
  {
    id: 'opp-14',
    numberCode: '14',
    title: '储能电芯液冷板内置应变片与热失控膨胀压力前兆感知',
    opportunityScore: 65,
    competitionIntensity: '中',
    whiteSpaceDegree: '较明显',
    recommendation: '持续布局',
    technicalField: '热管理',
    description: '在冷板支撑筋内预埋光纤光栅或薄膜压敏电阻，电芯产气早期轻微鼓胀即可直接感知并联动泄水。',
    targetClaims: [
      '集成薄膜应变传感器的储能电池散热承载板',
      '基于多点机械压力突变与温升速率联合判据的失控报警电路',
      '压力感知自开启破水灭火喷嘴联动机械机构'
    ],
    suggestedFilingWindow: '技术原型验证后推进申请',
    potentialValue: '商业核心'
  },
  {
    id: 'opp-15',
    numberCode: '15',
    title: '储能液冷循环机组自净化除藻与介质电导率在线电渗析再生',
    opportunityScore: 64,
    competitionIntensity: '低',
    whiteSpaceDegree: '非常明显',
    recommendation: '适时跟进',
    technicalField: '液冷',
    description: '免去人工定期换液，通过内置微电解或紫外杀菌及微型去离子柱，实现冷却液10年免维护。',
    targetClaims: [
      '在线维持冷却介质去离子状态的储能热管理旁路装置',
      '基于脉冲电场的流体管路防生物污垢及结垢系统',
      '电导率在线监测与离子树脂自动反洗机构'
    ],
    suggestedFilingWindow: '配套运维装备类专利储备',
    potentialValue: '防御壁垒'
  }
]

export const MOCK_PYRAMID_TIERS: PyramidTier[] = [
  {
    level: 4,
    title: '第四层：算法专利 (商业制高点)',
    category: '算法专利',
    color: 'from-violet-500 to-indigo-600',
    items: [
      { name: 'AI温控与自适应流量预测', existingCount: 1, recommendedCount: 4, status: 'urgent', description: '基于负荷前瞻与环境气象预测的动态热泵与变频泵全局能效优化' },
      { name: '异常微渗漏与内阻阻抗预警', existingCount: 0, recommendedCount: 3, status: 'urgent', description: '利用水泵扬程与流量差分状态观测器的隐性漏液算法' },
      { name: '储能电站全生命周期能耗优化', existingCount: 1, recommendedCount: 2, status: 'planned', description: '结合峰谷电价与调频AGC指令的温控降耗调度' }
    ]
  },
  {
    level: 3,
    title: '第三层：控制专利 (差异化壁垒)',
    category: '控制专利',
    color: 'from-blue-500 to-cyan-600',
    items: [
      { name: '各簇独立流量平衡与PID控制', existingCount: 2, recommendedCount: 3, status: 'planned', description: '针对多簇并联极差温差自适应电动调节阀开度控制策略' },
      { name: '温度梯度与均衡动态调控', existingCount: 1, recommendedCount: 2, status: 'planned', description: 'BMS主动均衡电流与液冷进出水温差补偿协同机制' },
      { name: '自然冷却与压缩机双工况切换', existingCount: 1, recommendedCount: 2, status: 'stable', description: '高低温极端环境双回路焓值切换控制回路' }
    ]
  },
  {
    level: 2,
    title: '第二层：系统专利 (系统集成与应用)',
    category: '系统专利',
    color: 'from-emerald-500 to-teal-600',
    items: [
      { name: '液冷管网与歧管等程回路系统', existingCount: 3, recommendedCount: 4, status: 'urgent', description: '规避CATL等程专利，采用阶梯阻尼式文丘里分流主管网' },
      { name: '热管理与机柜消防联动一体化', existingCount: 1, recommendedCount: 3, status: 'urgent', description: '泄压排气与液冷介质惰化隔离灭火共用管路总成' },
      { name: '光储充一体化舱级热平衡', existingCount: 1, recommendedCount: 2, status: 'stable', description: 'PCS变流器与电池舱共用冷却回路热负荷调配' }
    ]
  },
  {
    level: 1,
    title: '第一层：基础结构专利 (底层护城河)',
    category: '基础结构专利',
    color: 'from-amber-500 to-orange-600',
    items: [
      { name: '冲压/挤压微通道双层铝冷板', existingCount: 3, recommendedCount: 5, status: 'urgent', description: '三维螺旋扰流型腔与新型耐腐蚀复合钎焊工艺冷板' },
      { name: '无滴漏自密封带液快插接头', existingCount: 1, recommendedCount: 3, status: 'urgent', description: '盲插自导正浮动机构与双向防漏弹簧阀卡扣' },
      { name: '模组侧向绝缘与弹性膨胀补偿', existingCount: 2, recommendedCount: 2, status: 'stable', description: '高分子相变导热垫层与非粘接结构设计' }
    ]
  }
]

export const MOCK_INTELLIGENCE: IPIntelligence[] = [
  {
    id: 'intel-01',
    priority: 'high',
    title: 'CATL新增一项储能多簇液冷自平衡分流发明专利',
    competitor: '宁德时代 (CATL)',
    time: '10分钟前',
    category: '新增竞品专利',
    relevanceScore: 94,
    recommendation: '立即查看技术特征对比，评估与我方研发中V2.0管路的冲突度',
    patentNumber: 'CN117890123A',
    details: '该专利公开了一种用于大容量储能柜的自适应文丘里分流阀，权利要求1限定了根据进水动压自调节开度的膜片结构。'
  },
  {
    id: 'intel-02',
    priority: 'high',
    title: 'Tesla在欧洲专利局(EPO)获得Megapack高压冷水分流授权',
    competitor: '特斯拉 (Tesla)',
    time: '2小时前',
    category: '专利状态变化',
    relevanceScore: 91,
    recommendation: '出海欧洲机型需启动FTO防侵权排查，核实该授权专利的答辩修改文本',
    patentNumber: 'EP3987654B1',
    details: '特斯拉涉案欧洲专利今日正式授权公告，覆盖储能集装箱左右对称双冷水环路分配机制。'
  },
  {
    id: 'intel-03',
    priority: 'high',
    title: 'BYD公开刀片储能电芯底部直冷与液冷切换新专利',
    competitor: '比亚迪 (BYD)',
    time: '5小时前',
    category: '新增竞品专利',
    relevanceScore: 88,
    recommendation: '技术团队评估其冷板双介质流道结构，防范未来专利纠纷',
    patentNumber: 'CN117865432A',
    details: '发明内容涉及电芯底部设置冷媒直膨流道与乙二醇水流道交替布置的三明治结构。'
  },
  {
    id: 'intel-04',
    priority: 'medium',
    title: 'LG新能源在美国提交储能热失控气固液三相灭火联动PCT',
    competitor: 'LG新能源',
    time: '1天前',
    category: '新增竞品专利',
    relevanceScore: 82,
    recommendation: '关注其进入中国国家阶段的时间节点(约30个月内)',
    patentNumber: 'WO2024123456A1',
    details: '涵盖在电池箱内部设置相变防火微囊并在高压喷淋管路中混合雾化注入的方案。'
  },
  {
    id: 'intel-05',
    priority: 'medium',
    title: '阳光电源新增一项储能变流器与液冷机组协同降噪专利',
    competitor: '阳光电源',
    time: '1天前',
    category: '新增竞品专利',
    relevanceScore: 78,
    recommendation: '持续关注，我方可参考其风扇变频算法做规避布局',
    patentNumber: 'CN117812345A',
    details: '主要解决户外储能电站在居民区夜间运行时的水泵与散热风机声学噪声控制。'
  },
  {
    id: 'intel-06',
    priority: 'medium',
    title: '某竞争对手液冷快插接头核心专利进入年费滞纳期预警',
    competitor: '第三方关键供应商',
    time: '2天前',
    category: '核心专利到期',
    relevanceScore: 76,
    recommendation: '监控是否缴费，若最终权利终止可释放公共技术领域空间',
    patentNumber: 'CN211234567U',
    details: '涉案实用新型涉及双O型圈快速卡接自锁接头，目前处于宽限期第4个月。'
  },
  {
    id: 'intel-07',
    priority: 'low',
    title: '亿纬锂能申请新型储能电池汇流排局部浸没液冷专利',
    competitor: '亿纬锂能',
    time: '3天前',
    category: '空白突破机会',
    relevanceScore: 68,
    recommendation: '可在我方技术雷达中备案，暂无需采取法律阻击措施',
    patentNumber: 'CN117765432A',
    details: '针对高倍率大电流接线铜排设置封闭微液冷盒并注入绝缘介质。'
  },
  {
    id: 'intel-08',
    priority: 'low',
    title: '国家知识产权局公布最新储能热管理领域分类审查提速政策',
    competitor: '行业政策动态',
    time: '4天前',
    category: '专利状态变化',
    relevanceScore: 65,
    recommendation: '我方研发中P0级重点专利建议申请绿色专利快速预审通道(3个月下发授权)',
    details: '对新能源储能绿色低碳安全技术开辟快审绿色通道，平均审查周期从18个月压缩至3个月。'
  }
]
// 100+ Realistic Mock Patents
export const MOCK_PATENTS_DATABASE: Patent[] = [
  {
    id: 'pat-001',
    patentNumber: 'CN114567890A',
    title: '一种用于储能电池集装箱的等程流道分流液冷管网结构',
    applicant: '宁德时代新能源科技股份有限公司 (CATL)',
    country: 'CN',
    applicationDate: '2021-11-15',
    publicationDate: '2022-05-24',
    technicalField: '热管理',
    relevanceScore: 95,
    riskLevel: 'high',
    legalStatus: '有效',
    abstract: '本发明公开了一种用于储能电池集装箱的等程流道分流液冷管网结构，包括主管路、多条并联支管路以及位于各支路前端的等程变径分流腔。各支管路上连通有多个冷却板，冷却液自一端流入，沿各支管等流阻分流后由另一端对角汇流回液，显著改善了储能电站各电池簇间温差一致性。',
    aiSummary: '该专利保护大容量储能集装箱中的对角对流阻等程管网布置，涵盖了变径分流腔体与并联流道的空间拓扑。如果企业采用对角进出液主管路，存在高侵权风险。',
    technicalFeatures: [
      '对角进出水等程流阻管路拓扑',
      '主干总管具有阶梯收缩截面积',
      '各电池簇进水支路配置独立手动平衡阀',
      '多通道铝挤压冷却板并联连通'
    ],
    claimCount: 18,
    citedCount: 42,
    isCorePatent: true
  },
  {
    id: 'pat-002',
    patentNumber: 'US11234567B2',
    title: 'Liquid-cooled thermal barrier plate assembly for energy storage pack',
    applicant: 'Tesla, Inc.',
    country: 'US',
    applicationDate: '2020-04-20',
    publicationDate: '2022-01-18',
    technicalField: '热管理',
    relevanceScore: 92,
    riskLevel: 'high',
    legalStatus: '有效',
    abstract: 'A thermal management plate assembly for an electric energy storage system. The plate includes integral longitudinal coolant channels and an integrated dielectric ceramic-infused polymer coating on the top surface. The coating provides electrical breakdown protection while minimizing thermal resistance to prismatic lithium-ion cells placed directly thereon.',
    aiSummary: '特斯拉核心底板专利，保护将导热绝缘高分子聚合物直接复合在铝挤压微通道顶面的装配结构。出海欧美需重点规避该权利要求。',
    technicalFeatures: [
      'Integral extruded coolant channels with micro-ribs',
      'Direct-bonded ceramic polymer composite dielectric coating',
      'Cell bottom direct thermal conduction without secondary gap pad',
      'Perimeter drainage channel with leakage detection probe'
    ],
    claimCount: 24,
    citedCount: 68,
    isCorePatent: true
  },
  {
    id: 'pat-003',
    patentNumber: 'EP3891234A1',
    title: 'Dripless blind-mate liquid connector assembly for energy storage racks',
    applicant: 'BYD Company Limited',
    country: 'EP',
    applicationDate: '2019-08-30',
    publicationDate: '2021-04-14',
    technicalField: '液冷',
    relevanceScore: 89,
    riskLevel: 'high',
    legalStatus: '有效',
    abstract: 'A blind-mate fluid coupling assembly configured for energy storage battery modules. The assembly comprises a male plug and female socket, each featuring spring-loaded internal poppet valves that automatically seal during disengagement to prevent liquid glycol leakage onto electrical busbars.',
    aiSummary: '比亚迪欧洲布局的盲插无滴漏接头，涵盖双向内置弹簧止回阀及径向浮动容差套筒。模组插拔设计需规避其阀芯同步开启触发结构。',
    technicalFeatures: [
      'Radial floating alignment collar accommodating ±3mm tolerance',
      'Synchronized internal double-poppet seals',
      'Rotational locking cam interface on rack frame',
      'Corrosion-resistant anodized aluminum housing'
    ],
    claimCount: 16,
    citedCount: 31,
    isCorePatent: true
  },
  {
    id: 'pat-004',
    patentNumber: 'CN115890123A',
    title: '多簇并联液冷储能电站簇间极差自适应流量调控方法与系统',
    applicant: '宁德时代新能源科技股份有限公司 (CATL)',
    country: 'CN',
    applicationDate: '2022-03-12',
    publicationDate: '2023-04-07',
    technicalField: '控制算法',
    relevanceScore: 88,
    riskLevel: 'high',
    legalStatus: '有效',
    abstract: '本发明公开了一种多簇并联液冷储能电站簇间极差自适应流量调控方法，实时采集各电池簇电芯最高温度、平均温度及充放电倍率，根据簇间极差动态计算各簇电动调节阀的增量开度，使各簇电芯温度一致性稳定在设定阈值以内。',
    aiSummary: 'CATL在温控算法上的代表性专利，限定了温差极差反馈驱动分簇阀门步进开度的公式逻辑。建议采用基于模型预测控制(MPC)进行算法规避。',
    technicalFeatures: [
      '基于极差ΔT与充放电电流的开度查表增量算法',
      '电动三通比例积分调节阀闭环驱动',
      '自适应死区阈值动态抗振荡滤波',
      '极差超限降额联锁控制'
    ],
    claimCount: 12,
    citedCount: 19,
    isCorePatent: false
  },
  {
    id: 'pat-005',
    patentNumber: 'CN113456789B',
    title: '一种储能模组定向泄压防串火与液冷消防双通道构件',
    applicant: '宁德时代 (CATL)',
    country: 'CN',
    applicationDate: '2020-06-18',
    publicationDate: '2021-12-03',
    technicalField: '消防',
    relevanceScore: 86,
    riskLevel: 'high',
    legalStatus: '已授权',
    abstract: '本发明属于储能安全技术领域，公开了一种集成了排气泄压腔与下层液冷灭火腔的一体化双层构件，上腔收集电芯防爆阀排出的高温可燃气体并引向防爆风道，下腔在测温异常时破裂自动注入消防冷却水。',
    aiSummary: '将排气阻火与液冷消防双通道垂直集成的复合结构，防护等级高，对紧凑型储能Pack设计有强约束。',
    technicalFeatures: [
      '双层物理隔离腔体结构',
      '上腔内置多孔陶瓷阻火抑爆片',
      '下腔兼具正常液冷与应急灭火水源注入功能',
      '热敏合金易熔塞自触发喷淋阀'
    ],
    claimCount: 15,
    citedCount: 27,
    isCorePatent: true
  },
  {
    id: 'pat-006',
    patentNumber: 'US10987654B2',
    title: 'System and method for thermodynamic optimization of multi-rack battery cooling',
    applicant: 'Tesla, Inc.',
    country: 'US',
    applicationDate: '2019-12-10',
    publicationDate: '2021-06-22',
    technicalField: '热管理',
    relevanceScore: 85,
    riskLevel: 'high',
    legalStatus: '有效',
    abstract: 'An energy storage system cooling controller optimizes power consumption of refrigeration circuits by dynamically modulating variable-speed chillers and economizer bypass loops based on outdoor ambient dry-bulb and wet-bulb temperatures and predicted thermal inertia of battery stacks.',
    aiSummary: '特斯拉Megapack系统级能效调度专利，保护自然冷却与压缩机制冷双模式热焓切换算法。',
    technicalFeatures: [
      'Dual-loop economizer and chiller dynamic switching',
      'Wet-bulb temperature predictive psychrometric mapping',
      'Variable speed DC compressor and fan PWM modulation',
      'Battery thermal mass heat dissipation storage model'
    ],
    claimCount: 20,
    citedCount: 54,
    isCorePatent: true
  },
  {
    id: 'pat-007',
    patentNumber: 'CN112987654A',
    title: '一种长薄型电池侧向蛇形换热扁管与弹性夹紧组件',
    applicant: '比亚迪股份有限公司 (BYD)',
    country: 'CN',
    applicationDate: '2020-01-25',
    publicationDate: '2021-06-18',
    technicalField: '液冷',
    relevanceScore: 84,
    riskLevel: 'high',
    legalStatus: '有效',
    abstract: '本发明公开了一种长薄型刀片储能电池侧向冷却组件，包括穿插在两列电芯大面之间的S型多弯折铝扁管，以及位于扁管外侧的连续弹性冲压卡簧片。卡簧片在电池充放电膨胀时提供恒定预紧力，确保换热大面始终无间隙贴合。',
    aiSummary: '比亚迪侧碰/侧冷组合专利，保护针对长薄电芯侧面的蛇形管弯折与夹紧卡簧，若我方采用类似侧板换热需极其审慎。',
    technicalFeatures: [
      '长薄方形电芯大面侧向贴合',
      '多通道蛇形铝扁管一体拉弯成型',
      'U形弹簧钢卡爪自适应膨胀补偿',
      '两端铜铝激光焊接歧管集水头'
    ],
    claimCount: 14,
    citedCount: 39,
    isCorePatent: true
  },
  {
    id: 'pat-008',
    patentNumber: 'EP3765432B1',
    title: 'Method for coordinated cell balancing and thermal dissipation in modular energy storage',
    applicant: 'LG Energy Solution, Ltd.',
    country: 'EP',
    applicationDate: '2019-09-14',
    publicationDate: '2021-08-11',
    technicalField: 'BMS',
    relevanceScore: 83,
    riskLevel: 'high',
    legalStatus: '有效',
    abstract: 'A battery management system moderates active balancing current between high-capacity cells according to instantaneous localized coolant temperature gradients. When the temperature rise exceeds a threshold, balancing duty cycle is scaled back to prevent hotspot generation.',
    aiSummary: 'LG新能源欧洲授权专利，保护温差梯度与主动均衡电流的负反馈联动。我方需从逻辑层解耦温度与均衡电流。',
    technicalFeatures: [
      'Active inductive energy transfer balancing topology',
      'Coolant temperature gradient feedback derating function',
      'Individual cell temperature delta threshold monitoring',
      'Dual-microcontroller redundant safety check'
    ],
    claimCount: 22,
    citedCount: 45,
    isCorePatent: true
  },
  // Additional Patents
  {
    id: 'pat-009',
    patentNumber: 'CN114321098A',
    title: '一种储能集装箱液冷系统分区防漏控制装置',
    applicant: '阳光电源股份有限公司',
    country: 'CN',
    applicationDate: '2021-02-18',
    publicationDate: '2022-04-12',
    technicalField: '液冷',
    relevanceScore: 81,
    riskLevel: 'medium',
    legalStatus: '有效',
    abstract: '本发明涉及一种集装箱内部液体泄漏快速隔离装置，通过压力传感器阵列检测各电池簇出入水压降，发现局部异常减压即关闭对应分区电动球阀，避免整个集装箱排液。',
    aiSummary: '阳光电源保护集装箱分区隔离与漏液压降诊断，属于典型实用性控制硬件方案。',
    technicalFeatures: ['压降斜率监测', '分区切断电动阀', '底部漏液感应带', '声光报警联锁'],
    claimCount: 11,
    citedCount: 14,
    isCorePatent: false
  },
  {
    id: 'pat-010',
    patentNumber: 'CN217654321U',
    title: '一种防止冷凝水滴落的储能电池箱顶盖结构',
    applicant: '中创新航科技集团股份有限公司',
    country: 'CN',
    applicationDate: '2021-10-09',
    publicationDate: '2022-10-25',
    technicalField: 'Pack',
    relevanceScore: 78,
    riskLevel: 'medium',
    legalStatus: '有效',
    abstract: '一种防止冷凝水滴落的储能电池箱顶盖，顶盖内侧冲压有十字交叉的集水导流凹槽，槽内附着高吸水率高分子纤维条，端部连通向外的呼吸排液微孔。',
    aiSummary: '中创新航针对防冷凝水短路的实用新型专利，结构简单且防御针对性强。',
    technicalFeatures: ['十字交叉集水槽', '吸水纤维条', '呼吸排水单向微孔', '顶盖一体冲压'],
    claimCount: 8,
    citedCount: 9,
    isCorePatent: false
  },
  {
    id: 'pat-011',
    patentNumber: 'US11098761B2',
    title: 'Coolant preheating strategy under subzero temperature for outdoor ESS',
    applicant: 'Tesla, Inc.',
    country: 'US',
    applicationDate: '2019-05-12',
    publicationDate: '2021-08-24',
    technicalField: '热管理',
    relevanceScore: 77,
    riskLevel: 'medium',
    legalStatus: '有效',
    abstract: 'A system and control method for preheating battery packs in freezing environments prior to high-current charging. Utilizes a high-power PTC immersion heater in combination with fluid viscous heating generated by throttling variable-speed coolant pumps.',
    aiSummary: '利用水泵自身水阻黏性发热与PTC加热联合进行极低温冷启动的特斯拉专利。',
    technicalFeatures: ['水泵高转速水力摩擦发热', 'PTC辅助浸入式加热', '极低温自启动判定', '分段升温速率限制'],
    claimCount: 19,
    citedCount: 33,
    isCorePatent: false
  },
  {
    id: 'pat-012',
    patentNumber: 'CN113890456A',
    title: '分形叶脉状均温换热板及其制造方法',
    applicant: '亿纬锂能股份有限公司 (EVE Energy)',
    country: 'CN',
    applicationDate: '2021-07-22',
    publicationDate: '2022-01-04',
    technicalField: '热管理',
    relevanceScore: 75,
    riskLevel: 'medium',
    legalStatus: '实质审查',
    abstract: '本发明公开了一种用于大容量储能电芯底部均温的换热板，内部流道采用仿生分形叶脉拓扑，一级主脉、二级支脉与三级微脉截面积呈黄金比例递减，压降均匀且无局部死水区。',
    aiSummary: '亿纬锂能仿生叶脉均温冷板，目前在审中，需关注其最终授权权利要求范围。',
    technicalFeatures: ['叶脉分形分流', '微通道截面积梯级递减', '双层铝板吹胀成型', '进出水口同侧设置'],
    claimCount: 14,
    citedCount: 8,
    isCorePatent: false
  },
  {
    id: 'pat-013',
    patentNumber: 'CN115678901A',
    title: '光储电站变流升压一体舱温控与功率因数动态调节系统',
    applicant: '阳光电源股份有限公司',
    country: 'CN',
    applicationDate: '2022-08-19',
    publicationDate: '2023-02-03',
    technicalField: '储能系统',
    relevanceScore: 74,
    riskLevel: 'medium',
    legalStatus: '有效',
    abstract: '本发明公开了一种光储一体舱级温控方案，通过统一协调PCS水冷回路与电池簇水冷回路的热量交换，在电网调度大发时优先保障电池舱散热，在轻载时将余热用于冬季舱室保温。',
    aiSummary: '系统级热负荷调度协同，重点在于PCS变流器与电池舱的余热再利用。',
    technicalFeatures: ['一体化共享冷水机组', '热交换旁通换向阀', '功率因数与温控联合优化', '冬季余热保温模式'],
    claimCount: 15,
    citedCount: 16,
    isCorePatent: false
  },
  {
    id: 'pat-014',
    patentNumber: 'WO2023123456A1',
    title: 'Advanced diagnostic method for micro-leakage in liquid-cooled battery racks',
    applicant: 'Samsung SDI Co., Ltd.',
    country: 'WO',
    applicationDate: '2022-06-15',
    publicationDate: '2023-12-21',
    technicalField: '液冷',
    relevanceScore: 73,
    riskLevel: 'medium',
    legalStatus: '公开',
    abstract: 'A method of detecting minute coolant leakage in a modular energy storage system. The method analyzes pressure decay during scheduled maintenance pulses and compares electrical insulation resistance degradation against ambient humidity trends.',
    aiSummary: '三星SDI在PCT申请的微漏液诊断方法，结合静压保压测试与绝缘阻抗趋势。',
    technicalFeatures: ['保压微压降测量', '绝缘阻抗时序滤波', '环境湿度自适应校准', '早期预警分级响应'],
    claimCount: 17,
    citedCount: 6,
    isCorePatent: false
  },
  {
    id: 'pat-015',
    patentNumber: 'CN111223344B',
    title: '一种电池冷水管铜铝异种金属惯性摩擦焊接工艺与接头',
    applicant: '国轩高科动力能源股份有限公司',
    country: 'CN',
    applicationDate: '2019-02-14',
    publicationDate: '2021-03-09',
    technicalField: 'Pack',
    relevanceScore: 71,
    riskLevel: 'medium',
    legalStatus: '已授权',
    abstract: '本发明公开了一种储能液冷管路中铝制冷板管口与外部铜制截止阀的惯性摩擦焊接结构，在界面处形成致密无气孔的金属间化合物薄层，耐压达2.5MPa以上且耐乙二醇电化学腐蚀。',
    aiSummary: '制造工艺与接头金属连接专利，主要约束管路外协生产环节。',
    technicalFeatures: ['惯性摩擦焊成型', '金属间化合物厚度小于5微米', '外包注塑密封套', '耐高压脉冲冲击'],
    claimCount: 10,
    citedCount: 22,
    isCorePatent: false
  },
  {
    id: 'pat-016',
    patentNumber: 'JP2022512345A',
    title: 'Energy storage container fire suppression system with localized nitrogen purging',
    applicant: 'LG Energy Solution, Ltd.',
    country: 'JP',
    applicationDate: '2020-08-11',
    publicationDate: '2022-04-18',
    technicalField: '消防',
    relevanceScore: 70,
    riskLevel: 'medium',
    legalStatus: '公开',
    abstract: 'A localized fire suppression and thermal runaway prevention apparatus for containerized energy storage systems. Utilizes nitrogen gas purging prior to water mist injection to lower oxygen concentration below ignition threshold.',
    aiSummary: '日本公开的LG新能源专利，氮气局部惰化先于细水雾喷淋的双阶段控火。',
    technicalFeatures: ['氮气先导惰化置换', '氧气浓度低于12%判据', '细水雾二次降温喷淋', '排烟风门联锁关闭'],
    claimCount: 16,
    citedCount: 11,
    isCorePatent: false
  },
  {
    id: 'pat-017',
    patentNumber: 'CN218765432U',
    title: '一种兼具防水透气与瞬时泄爆双功能的储能箱体呼吸阀',
    applicant: '宁德时代 (CATL)',
    country: 'CN',
    applicationDate: '2022-04-11',
    publicationDate: '2022-12-02',
    technicalField: 'Pack',
    relevanceScore: 68,
    riskLevel: 'low',
    legalStatus: '有效',
    abstract: '一种储能箱体呼吸阀，中心设置ePTFE防水透气膜保持箱内外气压平衡，外圈设置预制剪切压条，在箱内压力突增超过15kPa时瞬间翻转开启大通径泄压孔。',
    aiSummary: 'CATL呼吸阀实用新型，属于常规防爆减压配件设计。',
    technicalFeatures: ['ePTFE防水透气膜', '预应力剪切泄压环', 'IP67防水等级', '快装法兰结构'],
    claimCount: 6,
    citedCount: 15,
    isCorePatent: false
  },
  {
    id: 'pat-018',
    patentNumber: 'CN110987123B',
    title: '一种机柜式储能电池风液混合冷却导流装置',
    applicant: '比亚迪 (BYD)',
    country: 'CN',
    applicationDate: '2018-12-05',
    publicationDate: '2020-07-14',
    technicalField: '热管理',
    relevanceScore: 65,
    riskLevel: 'low',
    legalStatus: '已授权',
    abstract: '本发明公开了一种风液互补散热结构，电池模组下方为液冷板，机柜两侧垂直布置导风槽，在夏季高负荷时同时开启风扇与冷水循环，在春秋季仅开启轴流风机。',
    aiSummary: '早期风液互补机柜专利，已被较多现有技术公开，诉讼风险较低。',
    technicalFeatures: ['下底板液冷', '侧面辅助风道', '双模式温差分级控制', '离心抽风机顶置'],
    claimCount: 12,
    citedCount: 29,
    isCorePatent: false
  },
  {
    id: 'pat-019',
    patentNumber: 'US10876543B2',
    title: 'Cloud-based thermal runaway risk detection for stationary energy storage',
    applicant: 'Tesla, Inc.',
    country: 'US',
    applicationDate: '2018-03-29',
    publicationDate: '2020-12-29',
    technicalField: '控制算法',
    relevanceScore: 63,
    riskLevel: 'low',
    legalStatus: '有效',
    abstract: 'A cloud diagnostic service processes telemetry data from fleets of battery energy storage sites. Machine-learning models identify subtle cell internal short circuit patterns indicated by localized thermal divergence during non-operational resting states.',
    aiSummary: '特斯拉云端车队/站队热失控诊断专利，我方采用本地边缘端计算可避免落入。',
    technicalFeatures: ['云端大数据训练', '静置期间自放电与温差特征', '长短期记忆神经网络LSTM', '远程安全降额触发'],
    claimCount: 21,
    citedCount: 47,
    isCorePatent: false
  },
  {
    id: 'pat-020',
    patentNumber: 'CN216543210U',
    title: '一种储能高压箱水电隔离走线卡扣',
    applicant: '国轩高科',
    country: 'CN',
    applicationDate: '2021-08-20',
    publicationDate: '2022-05-17',
    technicalField: 'Pack',
    relevanceScore: 60,
    riskLevel: 'low',
    legalStatus: '有效',
    abstract: '一种水电分流固线卡扣，采用阻燃PA66材质注塑成型，上下层分别开设高压动力电缆卡槽与耐压EPDM水管卡槽，中间设有物理隔绝凸缘。',
    aiSummary: '标准结构件实用新型，设计空间广阔，极易规避。',
    technicalFeatures: ['上下双层卡槽', '阻燃绝缘隔板', '卡爪防脱自锁', '钣金孔快速推入固定'],
    claimCount: 5,
    citedCount: 7,
    isCorePatent: false
  }
]

// Generate remainder of patents up to 105 realistic items for search view
;(function populateMockDatabase() {
  const applicants = [
    '宁德时代新能源科技股份有限公司 (CATL)',
    '比亚迪股份有限公司 (BYD)',
    'Tesla, Inc.',
    'LG Energy Solution, Ltd.',
    'Samsung SDI Co., Ltd.',
    '阳光电源股份有限公司',
    '亿纬锂能股份有限公司',
    '国轩高科动力能源股份有限公司',
    '中创新航科技集团',
    '派能科技股份有限公司'
  ]

  const domains = ['热管理', '液冷', 'BMS', 'Pack', '控制算法', '消防', '储能系统', '电芯']
  const countries: ('CN' | 'US' | 'EP' | 'JP' | 'WO')[] = ['CN', 'US', 'EP', 'JP', 'WO']
  const riskLevels: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low']
  const statuses: ('有效' | '实质审查' | '已授权' | '公开' | '已转让')[] = ['有效', '已授权', '实质审查', '公开']

  const titles = [
    '高倍率储能电芯液冷底托盘微凹槽焊接结构',
    '储能电池簇间流量均衡调节阀及其闭环控制方法',
    '大容量储能集装箱集中冷水分离器与排气自平衡箱',
    '基于数字孪生模型的储能集装箱热应力仿真与流阻预测',
    '储能电池模组液冷管路快速插拔自锁机构与密封胶圈',
    '一种模块化储能变频热泵智能除霜与补气增焓控制回路',
    '储能电站直流侧接触器与液冷温升联动保护系统',
    '高寒地区储能电池包乙二醇水加热恒温自适应启停逻辑',
    '储能电池箱体侧向导水槽与底部多点绝缘测漏传感器',
    '双向储能变流器IGBT水冷基板与电池冷板串联供液系统',
    '储能电芯大面相变微胶囊复合阻燃隔热垫',
    '储能系统热失控气体定向收集与防爆阀气动连动机构',
    '用于储能集装箱的管网阻力自动平衡调节装置与方法',
    '一种高导热氮化铝微粉改性储能液冷结构胶及其制备方法',
    '户外集装箱式储能电站顶棚双层遮阳通风自然冷却结构',
    '多电池簇并联环状液冷主管网压力脉动阻尼减振装置',
    '储能BMS基于电芯交流阻抗谱的温度场在线重构算法',
    '一种储能电站紧急工况下液冷消防两用自动转换切换阀',
    '集装箱储能系统全生命周期热管理能效评估与退化模型',
    '储能电站液冷管路防电化学腐蚀牺牲阳极保护接头'
  ]

  for (let i = 21; i <= 108; i++) {
    const applicant = applicants[i % applicants.length]
    const country = countries[i % countries.length]
    const prefix = country === 'CN' ? 'CN11' : country === 'US' ? 'US11' : country === 'EP' ? 'EP3' : country === 'JP' ? 'JP202' : 'WO202'
    const suffix = country === 'CN' ? (i % 2 === 0 ? 'A' : 'B') : country === 'US' ? 'B2' : country === 'EP' ? 'A1' : 'A1'
    const patNum = `${prefix}${100000 + i * 37}${suffix}`
    const title = `${titles[i % titles.length]} (系列 ${Math.floor(i / 10) + 1})`
    const domain = domains[i % domains.length]
    const risk: Patent['riskLevel'] = i <= 28 ? 'high' : i <= 58 ? 'medium' : 'low'
    const relevance = Math.max(50, Math.min(96, 96 - Math.floor((i - 20) * 0.5) + (i % 5)))

    MOCK_PATENTS_DATABASE.push({
      id: `pat-${String(i).padStart(3, '0')}`,
      patentNumber: patNum,
      title,
      applicant,
      country,
      applicationDate: `202${1 + (i % 3)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      publicationDate: `202${2 + (i % 3)}-${String(((i + 4) % 12) + 1).padStart(2, '0')}-${String(((i + 8) % 28) + 1).padStart(2, '0')}`,
      technicalField: domain,
      relevanceScore: relevance,
      riskLevel: risk,
      legalStatus: statuses[i % statuses.length],
      abstract: `本专利涉及${domain}领域，公开了一种针对大容量储能系统的新型设计。通过特定的机械构造或算法优化，有效降低系统热失控风险，提升电池簇充放电一致性并抑制极差温升。`,
      aiSummary: `AI系统分析：该专利主要保护${domain}方向的关键实施例，涉及${title}的权利要求布局，与储能液冷方案有较高相关度。`,
      technicalFeatures: [
        `优化${domain}核心结构参数`,
        '具有自适应均温或流阻平衡特性',
        '满足储能电站高安全高寿命设计规范',
        '降低维护频次与防范液体渗漏'
      ],
      claimCount: 8 + (i % 18),
      citedCount: (i * 3) % 45,
      isCorePatent: relevance >= 85 && (i % 3 === 0)
    })
  }
})()
export const ENTERPRISE_SELF_PATENTS: EnterpriseSelfPatents = {
  totalCount: 126,
  activeCount: 98,
  expiringCount: 8,
  coreCount: 21,
  overseasCount: 17,
  fieldDistribution: [
    { field: '液冷结构', count: 38, percentage: 30.1 },
    { field: '热管理系统', count: 29, percentage: 23.0 },
    { field: 'BMS与控制', count: 24, percentage: 19.0 },
    { field: 'Pack结构', count: 18, percentage: 14.3 },
    { field: '消防安全', count: 11, percentage: 8.7 },
    { field: '控制算法', count: 6, percentage: 4.9 }
  ],
  countryDistribution: [
    { country: '中国 (CN)', count: 109, flag: '🇨🇳' },
    { country: '美国 (US)', count: 9, flag: '🇺🇸' },
    { country: '欧洲 (EP)', count: 6, flag: '🇪🇺' },
    { country: '日本 (JP)', count: 2, flag: '🇯🇵' }
  ],
  recentRenewals: [
    { name: '一种储能集装箱底部液冷微通道导流板', patentNumber: 'CN108912345B', dueDate: '2026-10-15', fee: '¥ 4,000', status: '待缴费 (剩42天)' },
    { name: '液冷储能电站簇间极差温控方法及控制器', patentNumber: 'CN110234567B', dueDate: '2026-11-20', fee: '¥ 6,000', status: '待缴费 (剩78天)' },
    { name: 'Modular liquid cooling manifold for battery racks', patentNumber: 'US10654321B2', dueDate: '2026-12-08', fee: '$ 1,200', status: '处理中' }
  ]
}
