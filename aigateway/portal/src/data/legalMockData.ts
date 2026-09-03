// ============================================================================
// AI 法务员工 · Demo 大体积数据
// 忠实取自原型 mockData.ts 全部导出（数字/文案/字段/顺序逐字照搬）：
//   LEGAL_DISCLAIMER_TEXT / DEFAULT_EQUIPMENT_REVIEW_DATA / MOCK_CONTRACTS_REPOSITORY /
//   MOCK_ENTERPRISE_PROFILES / MOCK_COMPLIANCE_CATEGORIES / MOCK_REGULATION_QUERIES /
//   MOCK_LEGAL_TASKS / MOCK_KNOWLEDGE_DOCS / MOCK_AI_TODAY_STATS / MOCK_AI_WORK_LOGS
//   及别名导出 MOCK_ALL_CONTRACTS / MOCK_COMPLIANCE_DIMENSIONS /
//   MOCK_REGULATION_INTEL / MOCK_KNOWLEDGE_TEMPLATES
// 源文件：docs/仓库/xx-ai-·-ai法务员工/src/data/mockData.ts
// 类型定义见 ./legalIntelData.ts（本文件仅 import type，无值导入）。
// 移植日期：2026-09-03
// ============================================================================
import type {
  ContractItem,
  ContractReviewData,
  EnterpriseProfile,
  ComplianceCategory,
  RegulationQueryItem,
  KnowledgeDocument,
  LegalTask,
  AiWorkLog,
} from './legalIntelData'

export const LEGAL_DISCLAIMER_TEXT =
  'AI分析结果仅用于法律信息检索、合同风险识别及企业法务辅助决策，不构成法律意见、律师意见或对具体案件结果的保证。涉及诉讼、仲裁、重大合同、知识产权争议等事项，请咨询专业律师或由企业法务进一步审核。Demo数据，仅用于产品演示。'

// 核心默认演示合同：《设备采购合同》完整审查数据
export const DEFAULT_EQUIPMENT_REVIEW_DATA: ContractReviewData = {
  contractTitle: '《自动化智能制造设备采购及安装调试合同》',
  partyA: '江苏先锋智造装备股份有限公司（甲方/买方）',
  partyB: '昆山创捷精工智能装备科技有限公司（乙方/卖方）',
  contractType: '设备采购合同',
  pageCount: 18,
  totalClauses: 47,
  keyClauses: 16,
  totalRisks: 12,
  highRiskCount: 3,
  mediumRiskCount: 6,
  lowRiskCount: 3,
  overallScore: 68,
  overallRiskLevel: '中高风险',
  contractAmount: '¥2,860,000',
  contractDuration: '24个月',
  paymentMethod: '70%预付款 / 20%交付 / 10%验收',
  deliveryPeriod: '合同生效后90个自然日内',
  breachPenalty: '每日0.05%（最高上限未封顶）',
  disputeResolution: '乙方所在地人民法院管辖',
  riskBreakdown: [
    { category: '付款风险', score: 72, riskCount: 3, status: 'high' },
    { category: '违约责任', score: 81, riskCount: 3, status: 'high' },
    { category: '交付履约', score: 65, riskCount: 2, status: 'medium' },
    { category: '质量验收', score: 76, riskCount: 2, status: 'medium' },
    { category: '知识产权', score: 54, riskCount: 1, status: 'medium' },
    { category: '保密安全', score: 48, riskCount: 0, status: 'low' },
    { category: '争议解决', score: 76, riskCount: 1, status: 'medium' },
  ],
  criticalConcerns: [
    {
      priority: 'P0',
      title: '70%预付款比例过高且缺少履约担保',
      description: '合同签订生效后3个工作日内即需支付70%高额预付款，未约定卖方提供银行履约保函或等额担保，买方资金敞口过大。',
      clauseNumber: '第5条 付款与结算'
    },
    {
      priority: 'P0',
      title: '违约责任存在严重不对等',
      description: '甲方逾期付款每日按逾期金额0.1%支付违约金且无上限，而乙方逾期交付仅按未交货物价值每日0.02%计罚，严重失衡。',
      clauseNumber: '第8条 违约责任'
    },
    {
      priority: 'P1',
      title: '设备验收标准与异议期界定不清',
      description: '原条款规定“设备到场通电即视为初验合格”，且7个工作日内未出具书面异议即视为终验通过，极易丧失质量追索权。',
      clauseNumber: '第6条 验收与质量保证'
    },
    {
      priority: 'P1',
      title: '定制控制软件及工艺源码知识产权归属不明',
      description: '设备配套开发的定制控制系统、图纸与工艺配置参数未明确归属买方，存在知识产权侵权抗辩及技术受制风险。',
      clauseNumber: '第11条 知识产权及保密'
    },
    {
      priority: 'P2',
      title: '争议管辖地点对甲方极其不利',
      description: '约定由乙方所在地人民法院管辖，异地诉讼增加维权成本，建议修改为甲方所在地或双方约定的仲裁机构。',
      clauseNumber: '第15条 适用法律与争议解决'
    }
  ],
  reviewConclusion: {
    overallVerdict: '建议重点修改后再签署',
    actionAdvice: '本合同在付款节点比例、履约保证、违约责任平衡性以及验收异议期存在多处对甲方明显不利的条款，存在较大法律和履约资金风险。建议法务与商务团队根据AI修改建议，与乙方重新磋商后再行签署。',
    prioritizedModifications: [
      { priority: 'P0', item: '调整付款条款为 30%预付款 + 30%到货 + 30%初验 + 10%质保金，并要求乙方提供银行履约保函', reason: '降低甲方单边资金垫资敞口' },
      { priority: 'P0', item: '对等设定双方违约责任比例（统一为每日0.05%，设定上限不超过合同总额20%）', reason: '避免违约惩罚不对等' },
      { priority: 'P1', item: '补充详细技术协议附件作为终验依据，设定不少于30天的带载联动试运行验收期', reason: '防止设备带病验收风险' },
      { priority: 'P1', item: '明确定制化算法及控制软件的所有权与免费永久授权', reason: '规避后续IP维权及升级卡脖子' },
      { priority: 'P2', item: '将管辖法院变更为“原告所在地”或“合同履行地（甲方工厂所在地）”法院', reason: '降低维权诉讼差旅成本' }
    ]
  },
  risks: [
    {
      id: 'risk-1',
      title: '付款比例过高且无对等担保',
      clauseIndex: '第5条',
      clauseTitle: '合同金额与付款进度安排',
      riskLevel: 'high',
      score: 88,
      suggestionType: '建议调整',
      priority: 'P0',
      category: '付款结算',
      originalClause: '5.2 付款方式：本合同签署生效后3个工作日内，甲方应向乙方指定账户支付合同总金额的70%（即人民币贰佰万零贰仟元整）作为设备预付款；设备发货前支付20%；设备到厂通电运行后3个工作日内支付剩余10%尾款。',
      aiAnalysis: '当前付款安排中，合同签订后即支付高达70%的预付款，且未要求乙方提供任何银行履约保函或母公司担保。同时，尾款10%在“通电运行”后即结清，未设置任何质量保证金周期。',
      impactPoints: [
        '甲方前期资金占用极大，若供应商产生经营危机可能导致款项无法追回',
        '供应商在发货前已收到90%款项，对于延期交付、调试不配合的约束力完全丧失',
        '未留存质量保证金，设备运行初期发生重大故障时丧失经济制约抓手'
      ],
      suggestion: '建议将付款比例重构为：合同生效后支付30%预付金（需凭等额银行保函），设备交付甲方厂区并开箱清点合格后支付30%，带载连续无故障试运行合格签署终验报告后支付30%，剩余10%作为质保金于满12个月质保期后结清。',
      recommendedClause: '5.2 付款方式与进度安排：\n(1) 预付款：本合同生效后7个工作日内，且在收到乙方开具的等额增值税专用发票及符合甲方要求的银行履约保函后，甲方支付合同总价30%（即人民币858,000元）；\n(2) 发货到场款：全部设备运抵甲方指定厂区，经双方共同开箱清点外观无损、随机配件与单证齐全并签署《到货交接单》后10个工作日内，甲方支付合同总价30%（即人民币858,000元）；\n(3) 验收款：设备完成安装调试，经过连续30日满负荷带载试运行达到《技术协议》指标，双方签署《设备最终验收合格单》后15个工作日内，甲方支付合同总价30%（即人民币858,000元）；\n(4) 质量保证金：剩余合同总价10%（即人民币286,000元）作为质保金，自最终验收合格之日起满12个月且无未解决的质量缺陷，甲方于10个工作日内无息付清。'
    },
    {
      id: 'risk-2',
      title: '违约金计算标准严重不对等',
      clauseIndex: '第8条',
      clauseTitle: '双方违约责任及赔偿范围',
      riskLevel: 'high',
      score: 91,
      suggestionType: '建议修改',
      priority: 'P0',
      category: '违约赔偿',
      originalClause: '8.1 违约责任：若甲方未能按期支付任何一笔款项，每逾期一日应按逾期未付金额的0.1%向乙方支付滞纳违约金，逾期超过15日，乙方有权单方停机并解除合同；若乙方延期交付设备，每逾期一日按延期部分货物金额的0.02%支付违约金，最高不超过延期货物价值的2%。',
      aiAnalysis: '买卖双方违约责任存在极度失衡：买方逾期违约金高达每日0.1%（年化超36%）且无封顶，仅逾期15天卖方即可单方停机并解约；而卖方逾期交付仅按每日0.02%计收，且设定了极低的2%封顶上限，完全不足以弥补买方产线停工待料的巨大经济损失。',
      impactPoints: [
        '违约成本失衡，供应商故意拖延或转供其他客户时惩处力度过弱',
        '卖方设置“单方停机并解除合同”权限，若卖方在设备内置后门远程锁机，将造成甲方整个生产线瘫痪',
        '上限2%封顶导致卖方延期成本仅数万元，远低于生产线延期投产损失'
      ],
      suggestion: '建议将双方违约金标准对称平衡：统一约定为每日0.05%，总违约金上限设定为合同总金额的15%~20%；同时删除乙方单方停机/锁机条款，并增加因乙方逾期交付导致甲方停产所产生的实际直接损失由乙方全额赔偿。',
      recommendedClause: '8.1 对等违约责任：\n(1) 甲方如未按约付款，每逾期一日按逾期应付未付金额的0.05%向乙方支付违约金；乙方如未能按约完成设备交付或调试验收，每逾期一日按合同总金额的0.05%向甲方支付违约金；任一方违约金总额累计不超过合同总金额的15%；\n(2) 乙方严禁在供应的设备及控制软件中植入任何后门、远程关机或限制运行功能；如乙方违规实施远程锁机或擅自停机，应按合同总额的30%向甲方承担惩罚性违约金，并全额赔偿由此造成甲方停工停产的一切直接经济损失；\n(3) 任一方逾期超过30个自然日的，守约方有权书面通知解除合同并要求违约方退还全部已收款项及利息。'
    },
    {
      id: 'risk-3',
      title: '验收标准不明确且设置不利推定',
      clauseIndex: '第6条',
      clauseTitle: '设备交接、试车与验收标准',
      riskLevel: 'high',
      score: 85,
      suggestionType: '建议补充',
      priority: 'P1',
      category: '质量验收',
      originalClause: '6.3 验收判定：设备运抵甲方现场后通电运行即视为初验合格。甲方应在设备通电后7个工作日内完成终验并出具书面证明，若逾期未出具书面异议，即视为终验完全合格，质保期自通电之日起算。',
      aiAnalysis: '该条款存在典型的“默示视为合格”陷阱。大型智能制造设备从到厂、就位、接线、单机调试、连线带载试运行到稳定达产，通常需30至60天，“通电运行”绝不等于性能达标。7个工作日异议期极短，极易因客观工期延误而被卖方主张“推定合格”。',
      impactPoints: [
        '通电仅代表通电回路完好，不能检验设备生产节拍、良品率、热稳定性与连续加工精度',
        '7日默认合格会导致设备内在隐蔽质量瑕疵无法追究卖方责任',
        '质保期从“通电之日”起算缩短了实际质保周期'
      ],
      suggestion: '必须明确验收依据为双方确认签署的《技术协议附件》，明确验收分为“开箱清点”、“静态通电初验”、“空载调试”与“连续30天带载性能终验”四个阶段，终验必须以双方授权代表签署的纸质终验单为唯一凭证。',
      recommendedClause: '6.3 严格分阶段验收与标准：\n(1) 验收标准以本合同附件《技术规格与验收标准协议书》约定的性能参数（含生产节拍≥60pcs/min、综合良品率≥99.5%、24小时故障停机率≤0.1%）为准；\n(2) 验收分为到货开箱初验、安装空载调试以及生产带载综合终验。带载终验需连续满负荷运行不少于30个工作日；\n(3) 终验合格以双方授权代表共同签署加盖公章的《设备终验合格确认书》为唯一有效证明，任何默示、邮件沟通或单方试车记录均不构成终验通过；\n(4) 质保期自双方签署《设备终验合格确认书》次日起正式起算。'
    },
    {
      id: 'risk-4',
      title: '知识产权与定制程序归属约定模糊',
      clauseIndex: '第11条',
      clauseTitle: '知识产权及技术所有权',
      riskLevel: 'medium',
      score: 71,
      suggestionType: '建议明确',
      priority: 'P1',
      category: '知识产权',
      originalClause: '11.1 乙方提供设备所包含的技术、专利及软件程序版权均归乙方所有。未经乙方许可，甲方不得向第三方透露或复制。',
      aiAnalysis: '合同未明确区分“乙方既有背景知识产权”与“基于甲方生产工艺和技术参数定制开发的前景知识产权”。如果甲方提供了核心产品加工工艺及配方，该部分知识产权若被乙方申请专利或用于同行业竞争对手，将造成重大泄密风险。',
      impactPoints: [
        '甲方的工艺参数与加工逻辑可能被卖方复制转让给竞对',
        '未约定卖方提供源代码备份及不可撤销的永久免费使用权，后期设备升级维护完全受制于卖方',
        '缺少侵权担保条款，若乙方设备侵犯第三方专利，甲方可能被连带起诉'
      ],
      suggestion: '建议明确划分背景知识产权与定制开发成果，要求乙方提供免费永久授权，同时增加乙方对第三方知识产权侵权的全部赔偿担保。',
      recommendedClause: '11.1 知识产权划分与侵权担保：\n(1) 乙方原有通用技术成果归乙方所有，但乙方特此授予甲方及甲方关联方在全球范围内、不可撤销、永久免费、排他的商用许可权；\n(2) 双方基于本合同针对甲方特定产品定制开发的新增技术、工装夹具图纸、PLC控制源码及配方参数，其知识产权完全归甲方单独所有；\n(3) 乙方明确保证其提供的设备及软件不侵犯任何第三方的专利权、著作权、商业秘密等合法权益；如发生第三方索赔或诉讼，由乙方承担全部抗辩责任与赔偿损失。'
    },
    {
      id: 'risk-5',
      title: '争议解决管辖地对甲方不利',
      clauseIndex: '第15条',
      clauseTitle: '法律适用与争议解决条款',
      riskLevel: 'medium',
      score: 69,
      suggestionType: '建议评估',
      priority: 'P2',
      category: '争议解决',
      originalClause: '15.2 凡因本合同引起的或与本合同有关的任何争议，双方应友好协商解决；协商不成的，应向乙方所在地人民法院提起诉讼。',
      aiAnalysis: '约定由乙方所在地法院管辖，一旦产生设备质量争议或退款纠纷，甲方作为买方异地应诉将产生较高的差旅费用、地方司法保护壁垒及取证周期风险。',
      impactPoints: [
        '异地应诉时间成本和法务外聘律师开支大幅上升',
        '财产保全与异地查封执行效率相对较低'
      ],
      suggestion: '修改为由甲方住所地法院管辖，或者修改为“向原告住所地人民法院起诉”，或者约定由双方认可的第三方商事仲裁委员会裁决。',
      recommendedClause: '15.2 争议管辖条款建议：\n本合同履行过程中发生争议，协商不成的，任何一方均可向甲方住所地（即江苏省苏州市）有管辖权的人民法院提起诉讼；或提交中国国际经济贸易仲裁委员会（CIETAC）上海分会依其仲裁规则进行仲裁。'
    },
    {
      id: 'risk-6',
      title: '不可抗力定义过于宽泛且未限定证明期限',
      clauseIndex: '第13条',
      clauseTitle: '不可抗力与免责条款',
      riskLevel: 'medium',
      score: 66,
      suggestionType: '建议修改',
      priority: 'P2',
      category: '合同解除',
      originalClause: '13.1 因自然灾害、政府行为、疫情、原材料暴涨、供应商缺料停产等原因导致乙方无法如期供货的，乙方不承担延期违约责任。',
      aiAnalysis: '将“原材料暴涨”、“供应商缺料停产”等常规商业经营风险强行列入不可抗力免责范围，属于典型的单方不合理免责，严重侵蚀买方合同履约确定性。',
      impactPoints: [
        '卖方可以以供应链缺料为借口任意拖延交期且无需承担赔偿',
        '商业价格波动风险被转嫁给买方'
      ],
      suggestion: '严格限定不可抗力为法定范畴（不能预见、不能避免并不能克服的客观事件），剔除商业风险，并要求在事件发生后48小时内出具官方机构出具的书面证明。',
      recommendedClause: '13.1 严格不可抗力条款：\n不可抗力仅限于法律规定的不能预见、不能避免且不能克服的客观情况（如重大自然灾害、战争等）。市场价格波动、汇率变动、内部劳资纠纷、一般供应商缺货等纯商业经营风险概不属于不可抗力。'
    },
    {
      id: 'risk-7',
      title: '质量保证期承诺未涵盖核心易损件与上门响应时间',
      clauseIndex: '第7条',
      clauseTitle: '质量保证与售后服务',
      riskLevel: 'medium',
      score: 64,
      suggestionType: '建议补充',
      priority: 'P1',
      category: '质量验收',
      originalClause: '7.1 乙方对整机提供12个月免费质保服务，易损件除外。若设备发生故障，乙方承诺在收到甲方书面通知后合理时间内予以答复。',
      aiAnalysis: '“合理时间”用词模糊，无法量化考核。未明确提供易损件清单、未约定技术支持驻场时效（如2小时电话响应，24小时内工程师到达现场），未约定因质保期内重大维修导致质保期顺延的规则。',
      impactPoints: [
        '生产线停产时无法要求卖方限时抵达维修',
        '卖方可能将大量核心运动机构部件列为“易损件”要求有偿更换'
      ],
      suggestion: '补充附表《易损件清单及价格封顶表》，约定“2小时响应、24小时内到场、48小时内恢复生产”，质保期内发生核心部件维修的，质保期相应顺延。',
      recommendedClause: '7.1 售后响应与质保保障协议：\n(1) 整机质保期24个月，核心电气及传动部件质保36个月；\n(2) 故障响应时限：乙方提供7×24小时热线，故障发生后2小时内给出解决方案，需要现场处理的，乙方工程师须在24小时内到达甲方现场；\n(3) 累计停机补偿：如因设备设计缺陷单次连续停机超过72小时，质保期相应顺延3个月，并按每日5000元补偿甲方停产损失。'
    },
    {
      id: 'risk-8',
      title: '交付延迟与合同解除权门槛缺失',
      clauseIndex: '第9条',
      clauseTitle: '合同变更与提前解除',
      riskLevel: 'medium',
      score: 62,
      suggestionType: '建议补充',
      priority: 'P1',
      category: '合同解除',
      originalClause: '9.2 除本合同特别约定外，任何一方非经双方书面协商一致，不得单方解除本合同。',
      aiAnalysis: '未赋予买方在卖方严重延期交付、调试超过限定期限仍无法达到技术指标时的法定解除权和索赔权。',
      impactPoints: [
        '卖方若交付严重延期甚至烂尾，甲方无法依据合同简便单方解约并追回全部预付款'
      ],
      suggestion: '补充买方单方解约权利：当乙方逾期交付超过30天，或调试超过60天仍未通过验收，甲方有权立即发出解约通知，乙方须在5日内全额退还已付款项并加算LPR利率。',
      recommendedClause: '9.2 甲方单方解除特权：\n出现下列任一情形的，甲方有权经书面通知单方解除本合同，乙方应在收到通知后5个工作日内全额返还甲方已支付的全部款项（按同期LPR计息），并承担合同总额20%的违约赔偿：\n① 乙方延期交付设备超过20个自然日的；\n② 设备进厂后调试超过45个自然日仍无法达到《技术协议》约定标准的；\n③ 设备发生重大质量缺陷无法根本修复的。'
    },
    {
      id: 'risk-9',
      title: '运输保险与交付风险转移时点界定不清',
      clauseIndex: '第4条',
      clauseTitle: '包装运输与风险转移',
      riskLevel: 'medium',
      score: 58,
      suggestionType: '建议明确',
      priority: 'P2',
      category: '交付履约',
      originalClause: '4.1 乙方负责组织运输，货物自离开乙方仓库时起，在途运输的灭失与毁损风险由双方共同分担。',
      aiAnalysis: '根据民法典及国内设备采购惯例，由卖方负责送货的合同，货物风险应在买方厂区验收交接前由卖方全额承担并购买足额运输一切险。原条款要求买方分担在途风险，极不合规。',
      impactPoints: [
        '在途发生倾覆、淋雨受损或交通事故，甲方可能被迫承担连带损失'
      ],
      suggestion: '修改为“DDP甲方指定车间就位点”，在完成开箱交接前的一切安全、在途风险及保险费用均由乙方单方承担。',
      recommendedClause: '4.1 运输保险与风险交接：\n乙方负责安排将设备运送至甲方指定生产车间具体就位点，并承担全部运输费、装卸费及吊装费。乙方必须投保不低于货物总值110%的国内水路/陆路货物运输综合险。货物在最终交付甲方并经双方签署《到货交接单》前的一切毁损、灭失风险均由乙方独立承担。'
    },
    {
      id: 'risk-10',
      title: '安全生产与现场施工责任未明确切分',
      clauseIndex: '第12条',
      clauseTitle: '现场安装与施工安全责任',
      riskLevel: 'low',
      score: 45,
      suggestionType: '建议补充',
      priority: 'P2',
      category: '交付履约',
      originalClause: '12.1 乙方施工人员在甲方厂区作业时，应遵守现场规章制度，甲方应提供必要的安全支持。',
      aiAnalysis: '施工现场高空吊装、强电接驳等高危作业容易发生工伤事故。若未签订专项安全生产协议并约定由承包方承担全部人身意外赔偿，甲方可能承担安全管理连带责任。',
      impactPoints: [
        '现场发生人身伤亡事故可能导致甲方被安监部门追责停产'
      ],
      suggestion: '要求乙方签署《外协施工作业安全生产协议》，为所有入场施工人员购买不低于100万元/人的人身意外商业险。',
      recommendedClause: '12.1 施工安全责任保证：\n乙方派遣至甲方现场的所有安装调试人员与乙方构成劳动关系，乙方必须为入场人员办理不低于100万元保额的人身意外伤害险。乙方人员在安装调试期间发生的一切人身伤害、职业病或第三方财产损失，均由乙方全额承担，与甲方无涉。'
    },
    {
      id: 'risk-11',
      title: '商业秘密保护缺乏脱密期与违约金硬性约定',
      clauseIndex: '第10条',
      clauseTitle: '保密义务及期限',
      riskLevel: 'low',
      score: 42,
      suggestionType: '建议明确',
      priority: 'P2',
      category: '保密安全',
      originalClause: '10.1 双方对在履约过程中获知的对方商业秘密负有保密义务，保密期限为合同终止后2年。',
      aiAnalysis: '保密期限仅约定2年过短，对于涉及制造配方、产线布局及核心工艺参数的信息，应当约定为“永久保密”或“直至该信息非因受密方过错进入公知领域”。',
      impactPoints: [
        '2年后卖方可合法使用甲方提供的核心生产工艺参数'
      ],
      suggestion: '修改保密期限为永久保密，并设定泄露商业秘密的定额违约金不低于50万元。',
      recommendedClause: '10.1 商业秘密与专有技术保护：\n双方对履约期间获知的对方商业秘密承担永久保密义务，不因本合同终止、无效而解除。任何一方擅自向第三方泄露的，须向守约方支付违约金人民币50万元，损失超出违约金的部分据实赔偿。'
    },
    {
      id: 'risk-12',
      title: '反商业贿赂与廉洁履约条款缺失',
      clauseIndex: '第16条',
      clauseTitle: '廉洁合作及反商业贿赂',
      riskLevel: 'low',
      score: 38,
      suggestionType: '建议补充',
      priority: 'P2',
      category: '合同解除',
      originalClause: '（原合同无此条款）',
      aiAnalysis: '大型设备采购涉及大额资金支付，缺少对乙方私下向甲方采购、技术、财务等经办人员输送不正当利益的禁止性约定与罚则。',
      impactPoints: [
        '存在采购寻租风险，不利于企业内部内控合规管理'
      ],
      suggestion: '增加标准的《廉洁诚信合作条款》，约定若发现商业贿赂行为，甲方有权解除合同并处以合同金额20%的违约金。',
      recommendedClause: '16.1 廉洁合作准则：\n乙方及其工作人员严禁向甲方经办人员提供任何形式的礼金、回扣、有价证券、宴请或私下利益输送。若发现乙方存在任何商业贿赂行为，甲方有权立即解除本合同，并由乙方按合同总额20%支付廉洁违约金。'
    }
  ],
  comparisons: [
    {
      id: 'comp-1',
      category: '付款条款',
      clauseNumber: '第5条',
      title: '付款比例与履约保证对比',
      originalClause: '5.2 付款方式：本合同签署生效后3个工作日内，甲方应向乙方指定账户支付合同总金额的70%（即人民币2,002,000元）作为设备预付款；设备发货前支付20%；设备到厂通电运行后3个工作日内支付剩余10%尾款。',
      proposedClause: '5.2 付款方式与进度安排：\n(1) 预付款：本合同生效后7个工作日内，且在收到乙方开具的等额增值税专用发票及符合甲方要求的银行履约保函后，甲方支付合同总价30%（即人民币858,000元）；\n(2) 发货到场款：全部设备运抵甲方指定厂区，经双方共同开箱清点外观无损、随机配件与单证齐全并签署《到货交接单》后10个工作日内，甲方支付合同总价30%（即人民币858,000元）；\n(3) 验收款：设备完成安装调试，经过连续30日满负荷带载试运行达到《技术协议》指标，双方签署《设备最终验收合格单》后15个工作日内，甲方支付合同总价30%（即人民币858,000元）；\n(4) 质量保证金：剩余合同总价10%（即人民币286,000元）作为质保金，自最终验收合格之日起满12个月且无未解决的质量缺陷，甲方于10个工作日内无息付清。',
      changeExplanation: '将预付款比例从极具风险的70%大幅压降至30%，引入银行履约保函前置要求；增加到货与终验节点付款各30%；留存10%作为满12个月质保金。彻底扭转甲方资金无保障的劣势。',
      keyChanges: ['预付款 70% 降至 30%', '新增银行履约保函前提', '新增到场开箱与30天带载终验两个付款控制节点', '尾款转为12个月质保金']
    },
    {
      id: 'comp-2',
      category: '违约责任',
      clauseNumber: '第8条',
      title: '违约赔偿标准与停机权限对比',
      originalClause: '8.1 违约责任：若甲方未能按期支付任何一笔款项，每逾期一日应按逾期未付金额的0.1%向乙方支付滞纳违约金，逾期超过15日，乙方有权单方停机并解除合同；若乙方延期交付设备，每逾期一日按延期部分货物金额的0.02%支付违约金，最高不超过延期货物价值的2%。',
      proposedClause: '8.1 对等违约责任与反锁机保护：\n(1) 甲方如未按约付款，每逾期一日按逾期应付未付金额的0.05%向乙方支付违约金；乙方如未能按约完成设备交付或调试验收，每逾期一日按合同总金额的0.05%向甲方支付违约金；任一方违约金总额累计不超过合同总金额的15%；\n(2) 乙方严禁在供应的设备及控制软件中植入任何后门、远程关机或限制运行功能；如乙方违规实施远程锁机或擅自停机，应按合同总额的30%向甲方承担惩罚性违约金，并全额赔偿由此造成甲方停工停产的一切直接经济损失；\n(3) 任一方逾期超过30个自然日的，守约方有权书面通知解除合同并要求违约方退还全部已收款项及利息。',
      changeExplanation: '双方违约金比例实现同等对标（统一0.05%/日），将卖方单边低封顶（2%）调整为合同总额15%，彻底删除卖方单方锁机特权并增加高额反锁机惩罚性条款。',
      keyChanges: ['违约金统一为每日0.05%', '删除乙方单方停机/解约权', '增加禁止远程锁机与30%惩罚性赔偿', '设定合理的双方15%赔偿上限']
    },
    {
      id: 'comp-3',
      category: '验收条款',
      clauseNumber: '第6条',
      title: '设备验收判定标准与异议期对比',
      originalClause: '6.3 验收判定：设备运抵甲方现场后通电运行即视为初验合格。甲方应在设备通电后7个工作日内完成终验并出具书面证明，若逾期未出具书面异议，即视为终验完全合格，质保期自通电之日起算。',
      proposedClause: '6.3 严格分阶段验收与标准：\n(1) 验收标准以本合同附件《技术规格与验收标准协议书》约定的性能参数（含生产节拍≥60pcs/min、综合良品率≥99.5%、24小时故障停机率≤0.1%）为准；\n(2) 验收分为到货开箱初验、安装空载调试以及生产带载综合终验。带载终验需连续满负荷运行不少于30个工作日；\n(3) 终验合格以双方授权代表共同签署加盖公章的《设备终验合格确认书》为唯一有效证明，任何默示、邮件沟通或单方试车记录均不构成终验通过；\n(4) 质保期自双方签署《设备终验合格确认书》次日起正式起算。',
      changeExplanation: '彻底铲除“通电即视为初验合格”和“7日逾期默示视为终验合格”的霸王条款，建立开箱、空载、30天带载试运行三阶段客观达标考核，杜绝被动丧失维权期。',
      keyChanges: ['绑定技术附件良品率与生产节拍参数', '终验需满负荷试运行连续30天', '取消7日默示视为合格条款', '质保期起算点由通电日延后至终验合格日']
    },
    {
      id: 'comp-4',
      category: '知识产权',
      clauseNumber: '第11条',
      title: '知识产权归属与侵权抗辩担保对比',
      originalClause: '11.1 乙方提供设备所包含的技术、专利及软件程序版权均归乙方所有。未经乙方许可，甲方不得向第三方透露或复制。',
      proposedClause: '11.1 知识产权划分与侵权担保：\n(1) 乙方原有通用技术成果归乙方所有，但乙方特此授予甲方及甲方关联方在全球范围内、不可撤销、永久免费、排他的商用许可权；\n(2) 双方基于本合同针对甲方特定产品定制开发的新增技术、工装夹具图纸、PLC控制源码及配方参数，其知识产权完全归甲方单独所有；\n(3) 乙方明确保证其提供的设备及软件不侵犯任何第三方的专利权、著作权、商业秘密等合法权益；如发生第三方索赔或诉讼，由乙方承担全部抗辩责任与赔偿损失。',
      changeExplanation: '厘清通用成果与甲方定制成果边界，锁定买方享有定制源码与图纸所有权，同时加入第三方侵权全面免责担保。',
      keyChanges: ['通用软件获得永久免费全球排他商用许可', '定制工艺与PLC源码归甲方所有', '新增卖方对第三方侵权兜底担保']
    },
    {
      id: 'comp-5',
      category: '争议解决',
      clauseNumber: '第15条',
      title: '管辖法院与管辖权对比',
      originalClause: '15.2 凡因本合同引起的或与本合同有关的任何争议，双方应友好协商解决；协商不成的，应向乙方所在地人民法院提起诉讼。',
      proposedClause: '15.2 争议管辖条款建议：\n本合同履行过程中发生争议，协商不成的，任何一方均可向甲方住所地（即江苏省苏州市）有管辖权的人民法院提起诉讼；或提交中国国际经济贸易仲裁委员会（CIETAC）上海分会依其仲裁规则进行仲裁。',
      changeExplanation: '将不利的乙方属地管辖变更为甲方本地法院管辖或知名涉外商事仲裁机构，化解异地诉讼高成本与司法保护风险。',
      keyChanges: ['由乙方所在地法院改为甲方所在地法院或仲裁', '提高争议维权主动权']
    }
  ]
}

// 30+ 真实企业级合同列表数据
export const MOCK_CONTRACTS_REPOSITORY: ContractItem[] = [
  {
    id: 'ct-001',
    title: '《自动化智能制造设备采购及安装调试合同》',
    code: 'HT-2026-EQ-0822',
    type: '设备采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '昆山创捷精工智能装备科技有限公司',
    amount: '¥2,860,000',
    amountRaw: 2860000,
    signDate: '2026-08-15',
    expireDate: '2028-08-14',
    remainingDays: 710,
    riskLevel: 'high',
    riskScore: 68,
    status: 'pending',
    statusText: '待法务复核',
    riskCount: 12,
    highRiskCount: 3,
    changeStatus: '↑ 3项新发现风险',
    lastAnalyzed: '2026-09-03 09:12',
    activeAlerts: ['付款比例过高（70%）', '双方违约金失衡', '验收标准默示视为合格'],
    isPinned: true
  },
  {
    id: 'ct-002',
    title: '《大储电芯及BMS管理系统年度供货协议》',
    code: 'HT-2026-SA-0419',
    type: '产品销售',
    partyA: '上海新能源科技发展有限公司',
    partyB: '江苏先锋智造装备股份有限公司',
    amount: '¥14,500,000',
    amountRaw: 14500000,
    signDate: '2025-09-20',
    expireDate: '2026-09-28',
    remainingDays: 25,
    riskLevel: 'high',
    riskScore: 74,
    status: 'expiring',
    statusText: '即将到期',
    riskCount: 8,
    highRiskCount: 2,
    changeStatus: '续约评估中',
    lastAnalyzed: '2026-09-02 16:40',
    activeAlerts: ['合同将在25天后到期', '价格联动调整条款未触发', '尚未出具质保金退还回执'],
    isPinned: true
  },
  {
    id: 'ct-003',
    title: '《AI视觉质检算法模型开发技术服务合同》',
    code: 'HT-2026-TS-0611',
    type: '技术服务',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '杭州图灵智能感知研究院有限公司',
    amount: '¥980,000',
    amountRaw: 980000,
    signDate: '2026-03-10',
    expireDate: '2027-03-09',
    remainingDays: 187,
    riskLevel: 'medium',
    riskScore: 56,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 5,
    highRiskCount: 1,
    changeStatus: '已完成二期验收',
    lastAnalyzed: '2026-09-01 11:25',
    activeAlerts: ['阶段三技术验收节点将于15日后截止', '训练数据集知识产权归属需补充协议'],
    isPinned: false
  },
  {
    id: 'ct-004',
    title: '《企业全栈ERP及供应链云平台软件采购许可合同》',
    code: 'HT-2026-SF-0105',
    type: '软件采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '用友广联软件系统股份有限公司',
    amount: '¥1,650,000',
    amountRaw: 1650000,
    signDate: '2026-01-18',
    expireDate: '2029-01-17',
    remainingDays: 866,
    riskLevel: 'low',
    riskScore: 32,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 2,
    highRiskCount: 0,
    changeStatus: '无新风险',
    lastAnalyzed: '2026-08-28 14:00',
    activeAlerts: ['SLA服务可用性99.9%保障正常运行中'],
    isPinned: false
  },
  {
    id: 'ct-005',
    title: '《高管高级技术专家聘用与专项竞业限制协议》',
    code: 'HT-2026-HR-0033',
    type: '劳动人事',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '核心研发副总裁（张某某）',
    amount: '¥1,200,000/年',
    amountRaw: 1200000,
    signDate: '2026-05-01',
    expireDate: '2029-04-30',
    remainingDays: 969,
    riskLevel: 'high',
    riskScore: 78,
    status: 'normal',
    statusText: '重点监控',
    riskCount: 6,
    highRiskCount: 2,
    changeStatus: '补偿金发放审核',
    lastAnalyzed: '2026-08-30 17:15',
    activeAlerts: ['离职竞业限制补偿金计算基数存在争议隐患', '竞争对手负面清单需定期更新'],
    isPinned: true
  },
  {
    id: 'ct-006',
    title: '《新能源电池Pack产线海外总承包（EPC）合作协议》',
    code: 'HT-2026-CO-0780',
    type: '战略合作',
    partyA: '德国Nordic Energy Solutions GmbH',
    partyB: '江苏先锋智造装备股份有限公司',
    amount: '€5,800,000',
    amountRaw: 45000000,
    signDate: '2026-06-12',
    expireDate: '2028-06-11',
    remainingDays: 647,
    riskLevel: 'high',
    riskScore: 82,
    status: 'pending',
    statusText: '境外合规审核中',
    riskCount: 14,
    highRiskCount: 4,
    changeStatus: '涉欧盟新电池法',
    lastAnalyzed: '2026-09-02 20:10',
    activeAlerts: ['涉欧盟碳足迹及尽职调查指令风险', '涉外汇率波动防范机制不足', '适用德国法及法兰克福仲裁'],
    isPinned: true
  },
  {
    id: 'ct-007',
    title: '《高精度五轴联动加工中心销售与维保合同》',
    code: 'HT-2026-SA-0312',
    type: '产品销售',
    partyA: '先锋智造（苏州）有限公司',
    partyB: '无锡航天精密结构件制造有限公司',
    amount: '¥4,350,000',
    amountRaw: 4350000,
    signDate: '2025-11-05',
    expireDate: '2027-11-04',
    remainingDays: 427,
    riskLevel: 'medium',
    riskScore: 52,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 4,
    highRiskCount: 1,
    changeStatus: '待收二期款',
    lastAnalyzed: '2026-08-25 10:18',
    activeAlerts: ['二期进度款已逾期7天未付，建议发出法务催告函'],
    isPinned: false
  },
  {
    id: 'ct-008',
    title: '《苏州工业园区智造智谷二期厂房租赁合同》',
    code: 'HT-2026-LE-0012',
    type: '房屋租赁',
    partyA: '苏州新智创城产业园发展有限公司',
    partyB: '江苏先锋智造装备股份有限公司',
    amount: '¥3,480,000/年',
    amountRaw: 3480000,
    signDate: '2024-10-01',
    expireDate: '2026-09-30',
    remainingDays: 27,
    riskLevel: 'medium',
    riskScore: 61,
    status: 'expiring',
    statusText: '即将到期',
    riskCount: 5,
    highRiskCount: 1,
    changeStatus: '续约谈判期',
    lastAnalyzed: '2026-09-01 09:40',
    activeAlerts: ['合同将在27天后到期，须提早30日书面通知续约', '若未按期续约面临原状恢复高额装修赔偿'],
    isPinned: true
  },
  {
    id: 'ct-009',
    title: '《双向保密与非公开技术信息保护协议（NDA）》',
    code: 'HT-2026-ND-0099',
    type: '保密协议',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '比亚迪半导体技术研发中心',
    amount: '—',
    amountRaw: 0,
    signDate: '2026-07-01',
    expireDate: '2031-06-30',
    remainingDays: 1761,
    riskLevel: 'low',
    riskScore: 24,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 1,
    highRiskCount: 0,
    changeStatus: '条款完备',
    lastAnalyzed: '2026-07-02 15:30',
    activeAlerts: ['保密期限5年，已涵盖衍生开发成果权属'],
    isPinned: false
  },
  {
    id: 'ct-010',
    title: '《工业级AGV全自动搬运机器人批量采购合同》',
    code: 'HT-2026-EQ-0640',
    type: '设备采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '合肥海康智行机器人科技有限公司',
    amount: '¥1,920,000',
    amountRaw: 1920000,
    signDate: '2026-04-18',
    expireDate: '2027-04-17',
    remainingDays: 226,
    riskLevel: 'medium',
    riskScore: 49,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 3,
    highRiskCount: 0,
    changeStatus: '调度系统联调中',
    lastAnalyzed: '2026-08-20 11:00',
    activeAlerts: ['WMS系统接口联调进度稍慢，注意防范延期履约'],
    isPinned: false
  },
  {
    id: 'ct-011',
    title: '《年产3000套工业变流器北美独家经销代理协议》',
    code: 'HT-2026-SA-0520',
    type: '产品销售',
    partyA: 'Apex Power Dynamics LLC (USA)',
    partyB: '江苏先锋智造装备股份有限公司',
    amount: '$4,200,000',
    amountRaw: 30000000,
    signDate: '2026-02-15',
    expireDate: '2028-02-14',
    remainingDays: 529,
    riskLevel: 'high',
    riskScore: 84,
    status: 'normal',
    statusText: '重点监控',
    riskCount: 11,
    highRiskCount: 4,
    changeStatus: '出口关税波动',
    lastAnalyzed: '2026-09-02 10:15',
    activeAlerts: ['排他独家代理缺少最低销售采购承诺门槛', '美国加州65号提案及UL认证抗辩义务全压买方'],
    isPinned: true
  },
  {
    id: 'ct-012',
    title: '《全自动化立体仓储物流输送线施工建设合同》',
    code: 'HT-2026-EQ-0902',
    type: '设备采购',
    partyA: '先锋智造常州新能源基地',
    partyB: '太原刚玉物流工程设备有限公司',
    amount: '¥5,200,000',
    amountRaw: 5200000,
    signDate: '2026-08-01',
    expireDate: '2027-10-31',
    remainingDays: 423,
    riskLevel: 'medium',
    riskScore: 63,
    status: 'pending',
    statusText: '待法务复核',
    riskCount: 7,
    highRiskCount: 2,
    changeStatus: '施工界面待划分',
    lastAnalyzed: '2026-09-01 14:22',
    activeAlerts: ['土建工程与钢结构荷载责任边界有交叉风险'],
    isPinned: false
  },
  {
    id: 'ct-013',
    title: '《专利交叉实施许可与技术秘密共用协议》',
    code: 'HT-2026-IP-0018',
    type: '战略合作',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '中科院苏州纳米技术与纳米仿生研究所',
    amount: '¥800,000',
    amountRaw: 800000,
    signDate: '2026-01-01',
    expireDate: '2030-12-31',
    remainingDays: 1579,
    riskLevel: 'low',
    riskScore: 28,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 2,
    highRiskCount: 0,
    changeStatus: '执行良好',
    lastAnalyzed: '2026-07-15 16:30',
    activeAlerts: ['年度专利实施使用情况报告将于12月提交'],
    isPinned: false
  },
  {
    id: 'ct-014',
    title: '《大功率激光切割加工中心核心光源采购合同》',
    code: 'HT-2026-EQ-0442',
    type: '设备采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '武汉锐科光纤激光技术股份有限公司',
    amount: '¥1,380,000',
    amountRaw: 1380000,
    signDate: '2025-10-10',
    expireDate: '2026-10-09',
    remainingDays: 36,
    riskLevel: 'medium',
    riskScore: 47,
    status: 'expiring',
    statusText: '即将到期',
    riskCount: 3,
    highRiskCount: 0,
    changeStatus: '准备返还质保金',
    lastAnalyzed: '2026-08-25 18:00',
    activeAlerts: ['质保期将在36天后届满，注意出具质量无异议确认单'],
    isPinned: false
  },
  {
    id: 'ct-015',
    title: '《企业常年法律顾问服务协议》',
    code: 'HT-2026-LE-0001',
    type: '技术服务',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '北京市金杜律师事务所（上海分所）',
    amount: '¥360,000/年',
    amountRaw: 360000,
    signDate: '2026-01-01',
    expireDate: '2026-12-31',
    remainingDays: 119,
    riskLevel: 'low',
    riskScore: 18,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 1,
    highRiskCount: 0,
    changeStatus: '合作顺畅',
    lastAnalyzed: '2026-08-10 10:00',
    activeAlerts: ['每季度重大诉讼与涉税合规专项排查进行中'],
    isPinned: false
  },
  {
    id: 'ct-016',
    title: '《数字化车间MES制造执行管理系统软件开发合同》',
    code: 'HT-2026-SF-0389',
    type: '软件采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '中控技术股份有限公司',
    amount: '¥2,100,000',
    amountRaw: 2100000,
    signDate: '2026-03-25',
    expireDate: '2028-03-24',
    remainingDays: 568,
    riskLevel: 'medium',
    riskScore: 59,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 6,
    highRiskCount: 1,
    changeStatus: '蓝图设计交付',
    lastAnalyzed: '2026-08-29 09:30',
    activeAlerts: ['变更需求计费标准缺少明细封顶标准'],
    isPinned: false
  },
  {
    id: 'ct-017',
    title: '《2026年度钢材原材料大宗供应链直采长协》',
    code: 'HT-2026-PU-0199',
    type: '设备采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '宝武钢铁集团华东物资销售有限公司',
    amount: '¥18,000,000',
    amountRaw: 18000000,
    signDate: '2026-01-05',
    expireDate: '2026-12-31',
    remainingDays: 119,
    riskLevel: 'medium',
    riskScore: 53,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 4,
    highRiskCount: 1,
    changeStatus: '月度结算中',
    lastAnalyzed: '2026-08-27 15:45',
    activeAlerts: ['现货价格浮动已超基准价8%，关注价格调整触发通知'],
    isPinned: false
  },
  {
    id: 'ct-018',
    title: '《中东沙特阿拉伯特高压配套设备出口供货框架协议》',
    code: 'HT-2026-SA-0899',
    type: '产品销售',
    partyA: 'Saudi Electricity & Infrastructure Corp.',
    partyB: '江苏先锋智造装备股份有限公司',
    amount: '$9,600,000',
    amountRaw: 68000000,
    signDate: '2026-07-20',
    expireDate: '2029-07-19',
    remainingDays: 1050,
    riskLevel: 'high',
    riskScore: 89,
    status: 'pending',
    statusText: '待法务复核',
    riskCount: 16,
    highRiskCount: 5,
    changeStatus: '新提交重大合同',
    lastAnalyzed: '2026-09-02 22:00',
    activeAlerts: ['采用沙特本国法律与利雅得仲裁', '见索即付独立保函条款风险极高', '不可抗力未纳入中东地缘局势变化'],
    isPinned: true
  },
  {
    id: 'ct-019',
    title: '《劳务外包与产线辅助工种派遣服务协议》',
    code: 'HT-2026-HR-0120',
    type: '劳动人事',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '苏州汇思人力资源服务集团有限公司',
    amount: '¥2,400,000/年',
    amountRaw: 2400000,
    signDate: '2026-02-01',
    expireDate: '2027-01-31',
    remainingDays: 150,
    riskLevel: 'medium',
    riskScore: 65,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 7,
    highRiskCount: 2,
    changeStatus: '社保缴纳自查中',
    lastAnalyzed: '2026-08-20 14:00',
    activeAlerts: ['真外包假派遣认定风险，需注意生产现场指挥权切分', '工伤连带赔偿责任分担需补充协议'],
    isPinned: false
  },
  {
    id: 'ct-020',
    title: '《智慧工厂绿色屋顶光伏EMC合同能源管理协议》',
    code: 'HT-2026-CO-0102',
    type: '战略合作',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '晶科电力科技股份有限公司',
    amount: '¥7,500,000',
    amountRaw: 7500000,
    signDate: '2025-06-01',
    expireDate: '2045-05-31',
    remainingDays: 6845,
    riskLevel: 'medium',
    riskScore: 48,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 4,
    highRiskCount: 0,
    changeStatus: '并网发电良好',
    lastAnalyzed: '2026-06-05 11:20',
    activeAlerts: ['20年长周期下厂房改扩建或拆迁补偿权益归属约定需留档备查'],
    isPinned: false
  },
  {
    id: 'ct-021',
    title: '《工业网络安全态势感知防御系统采购与运维协议》',
    code: 'HT-2026-SF-0410',
    type: '软件采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '奇安信科技集团股份有限公司',
    amount: '¥850,000',
    amountRaw: 850000,
    signDate: '2026-04-10',
    expireDate: '2027-04-09',
    remainingDays: 218,
    riskLevel: 'low',
    riskScore: 22,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 1,
    highRiskCount: 0,
    changeStatus: '合规备案完成',
    lastAnalyzed: '2026-08-15 17:00',
    activeAlerts: ['等级保护三级认证已通过测评'],
    isPinned: false
  },
  {
    id: 'ct-022',
    title: '《锂电池极耳超声波焊接机采购合同》',
    code: 'HT-2026-EQ-0211',
    type: '设备采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '东莞市超声自动化设备科技有限公司',
    amount: '¥1,120,000',
    amountRaw: 1120000,
    signDate: '2025-08-20',
    expireDate: '2026-09-15',
    remainingDays: 12,
    riskLevel: 'high',
    riskScore: 70,
    status: 'expiring',
    statusText: '即将到期',
    riskCount: 5,
    highRiskCount: 2,
    changeStatus: '焊接虚焊纠纷中',
    lastAnalyzed: '2026-09-02 14:10',
    activeAlerts: ['合同将在12天后到期', '已产生3批次虚焊客诉，建议暂停支付质保金尾款'],
    isPinned: true
  },
  {
    id: 'ct-023',
    title: '《新能源商用车底盘线控转向系统联合研发协议》',
    code: 'HT-2026-RD-0050',
    type: '战略合作',
    partyA: '吉利远程新能源商用车集团',
    partyB: '江苏先锋智造装备股份有限公司',
    amount: '¥6,000,000',
    amountRaw: 6000000,
    signDate: '2026-02-28',
    expireDate: '2028-02-27',
    remainingDays: 542,
    riskLevel: 'medium',
    riskScore: 60,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 6,
    highRiskCount: 1,
    changeStatus: 'A样件测试中',
    lastAnalyzed: '2026-08-22 10:40',
    activeAlerts: ['联合申请专利先用权与署名顺序约定需完善'],
    isPinned: false
  },
  {
    id: 'ct-024',
    title: '《企业债券受托管理与承销法律合作协议》',
    code: 'HT-2026-FI-0008',
    type: '技术服务',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '中信建投证券股份有限公司',
    amount: '¥1,800,000',
    amountRaw: 1800000,
    signDate: '2026-06-30',
    expireDate: '2027-06-29',
    remainingDays: 299,
    riskLevel: 'low',
    riskScore: 26,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 2,
    highRiskCount: 0,
    changeStatus: '交易所初审中',
    lastAnalyzed: '2026-08-18 16:20',
    activeAlerts: ['募集说明书重大法律披露审核完成'],
    isPinned: false
  },
  {
    id: 'ct-025',
    title: '《工厂VOCs挥发性有机废气深度净化环保治理BOT合同》',
    code: 'HT-2026-EP-0019',
    type: '设备采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '苏伊士环境科技（江苏）有限公司',
    amount: '¥3,800,000',
    amountRaw: 3800000,
    signDate: '2025-12-10',
    expireDate: '2028-12-09',
    remainingDays: 827,
    riskLevel: 'medium',
    riskScore: 55,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 5,
    highRiskCount: 1,
    changeStatus: '在线监测联网',
    lastAnalyzed: '2026-08-12 11:30',
    activeAlerts: ['环保超标在线罚款追偿条款需明确由运营方兜底承担'],
    isPinned: false
  },
  {
    id: 'ct-026',
    title: '《面向工业互联网的标识解析二级节点运营服务合同》',
    code: 'HT-2026-TS-0891',
    type: '技术服务',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '中国信息通信研究院云计算与大数据研究所',
    amount: '¥500,000/年',
    amountRaw: 500000,
    signDate: '2026-01-10',
    expireDate: '2027-01-09',
    remainingDays: 128,
    riskLevel: 'low',
    riskScore: 20,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 1,
    highRiskCount: 0,
    changeStatus: '节点解析量超1亿',
    lastAnalyzed: '2026-07-28 14:15',
    activeAlerts: ['数据合规跨境传输审查符合网信办最新监管规定'],
    isPinned: false
  },
  {
    id: 'ct-027',
    title: '《德国汉诺威工业博览会展位搭建与国际货代展运协议》',
    code: 'HT-2026-EX-0021',
    type: '技术服务',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '中外运跨境展览物流有限公司',
    amount: '¥720,000',
    amountRaw: 720000,
    signDate: '2026-08-10',
    expireDate: '2027-05-30',
    remainingDays: 269,
    riskLevel: 'low',
    riskScore: 31,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 2,
    highRiskCount: 0,
    changeStatus: '展位图纸确认',
    lastAnalyzed: '2026-08-26 15:00',
    activeAlerts: ['ATA单证册海关暂准进出口申报手续已提交'],
    isPinned: false
  },
  {
    id: 'ct-028',
    title: '《高端数控系统核心主轴轴承及滚珠丝杠进口直采协议》',
    code: 'HT-2026-PU-0411',
    type: '设备采购',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: 'NSK 日本精工株式会社上海贸易代表处',
    amount: '¥3,200,000',
    amountRaw: 3200000,
    signDate: '2026-05-15',
    expireDate: '2027-05-14',
    remainingDays: 253,
    riskLevel: 'medium',
    riskScore: 50,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 3,
    highRiskCount: 0,
    changeStatus: '分批到货中',
    lastAnalyzed: '2026-08-14 10:00',
    activeAlerts: ['国际海运周期波动，安全备库周期已提升至60天'],
    isPinned: false
  },
  {
    id: 'ct-029',
    title: '《精密钣金外壳结构件连续冲压委外代工制造合同》',
    code: 'HT-2026-MA-0089',
    type: '技术服务',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '昆山市华威精密五金模具有限公司',
    amount: '¥4,100,000',
    amountRaw: 4100000,
    signDate: '2026-03-01',
    expireDate: '2027-02-28',
    remainingDays: 178,
    riskLevel: 'medium',
    riskScore: 62,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 5,
    highRiskCount: 1,
    changeStatus: '良率爬坡中',
    lastAnalyzed: '2026-08-31 16:50',
    activeAlerts: ['模具所有权及专供保密约定需强化驻厂盘点'],
    isPinned: false
  },
  {
    id: 'ct-030',
    title: '《企业全员商业综合意外险与补充雇主责任险投保单》',
    code: 'HT-2026-IN-0012',
    type: '技术服务',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '中国平安财产保险股份有限公司苏州分公司',
    amount: '¥420,000/年',
    amountRaw: 420000,
    signDate: '2026-04-01',
    expireDate: '2027-03-31',
    remainingDays: 209,
    riskLevel: 'low',
    riskScore: 21,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 1,
    highRiskCount: 0,
    changeStatus: '批单实时更新',
    lastAnalyzed: '2026-08-01 09:00',
    activeAlerts: ['生产车间特种作业人员免责条款已完成批注删除'],
    isPinned: false
  },
  {
    id: 'ct-031',
    title: '《智能物流AGV多机调度集群系统专利转让合同》',
    code: 'HT-2026-IP-0091',
    type: '战略合作',
    partyA: '浙江大学工业自动化国家工程研究中心',
    partyB: '江苏先锋智造装备股份有限公司',
    amount: '¥1,500,000',
    amountRaw: 1500000,
    signDate: '2026-06-01',
    expireDate: '2026-10-31',
    remainingDays: 58,
    riskLevel: 'medium',
    riskScore: 57,
    status: 'pending',
    statusText: '国家局转让审查',
    riskCount: 4,
    highRiskCount: 1,
    changeStatus: '国知局受理',
    lastAnalyzed: '2026-08-25 14:30',
    activeAlerts: ['专利过户前原权利人对外已许可合同的继承与收益分割需补充确认'],
    isPinned: false
  },
  {
    id: 'ct-032',
    title: '《企业集团资金池跨境归集与人民币结算服务协议》',
    code: 'HT-2026-BA-0004',
    type: '技术服务',
    partyA: '江苏先锋智造装备股份有限公司',
    partyB: '中国工商银行股份有限公司苏州工业园区支行',
    amount: '—',
    amountRaw: 0,
    signDate: '2025-11-20',
    expireDate: '2028-11-19',
    remainingDays: 807,
    riskLevel: 'low',
    riskScore: 29,
    status: 'normal',
    statusText: '正常履约中',
    riskCount: 2,
    highRiskCount: 0,
    changeStatus: '外管局备案完备',
    lastAnalyzed: '2026-07-10 11:00',
    activeAlerts: ['跨境资金双向归集宏观审慎调节系数合规监测中'],
    isPinned: false
  }
]

// 10家演示企业档案
export const MOCK_ENTERPRISE_PROFILES: EnterpriseProfile[] = [
  {
    id: 'ep-01',
    name: '江苏先锋智造装备股份有限公司',
    industry: '新能源高端装备制造',
    scale: '成长型拟上市企业',
    employees: 320,
    targetMarkets: ['中国', '美国', '欧洲', '东南亚'],
    mainBusiness: '锂电池Pack智能产线、储能设备研发、智能机器人与自动化成套设备研制与销售',
    riskScore: 74,
    riskLevel: '中等',
    summary: '企业业务高速扩张且涉足海外市场，出口管制、跨境数据传输、专利侵权抗辩及大额设备采购资金风险为重点防控方向。'
  },
  {
    id: 'ep-02',
    name: '上海芯界半导体微电子科技有限公司',
    industry: '半导体集成电路',
    scale: '高新技术企业',
    employees: 180,
    targetMarkets: ['中国', '韩国', '日本'],
    mainBusiness: '车规级功率半导体（SiC/IGBT）芯片设计、晶圆制造委外与测试封装销售',
    riskScore: 81,
    riskLevel: '高',
    summary: '面临极高知识产权专利壁垒、核心技术骨干竞业限制以及国际技术转让出口管制严苛合规要求。'
  },
  {
    id: 'ep-03',
    name: '深圳飞拓跨越数字跨境电商有限公司',
    industry: '跨境贸易与数字出海',
    scale: '中型电商企业',
    employees: 210,
    targetMarkets: ['美国', '欧盟', '拉美'],
    mainBusiness: '消费电子与智能户外产品在Amazon、TikTok、Temu等平台的自营与代运营出口',
    riskScore: 83,
    riskLevel: '高',
    summary: '平台账号冻结、欧美消费者集体诉讼与产品责任法案、海外税务合规及商标抢注风险突出。'
  },
  {
    id: 'ep-04',
    name: '苏州博创生物医药技术创新中心',
    industry: '生物医药与体外诊断',
    scale: '创新药研发企业',
    employees: 95,
    targetMarkets: ['中国', '美国'],
    mainBusiness: '肿瘤靶向小分子新药研发、临床试验CRO合作与技术对外许可授权（License-out）',
    riskScore: 69,
    riskLevel: '中等',
    summary: '临床试验受试者知情同意权益保障、人类遗传资源出境合规审批、跨国License-out排他性条款需严控。'
  },
  {
    id: 'ep-05',
    name: '宁波海泰高科汽车轻量化底盘制造有限公司',
    industry: '传统汽车零部件及新能源轻量化',
    scale: '规模以上制造企业',
    employees: 650,
    targetMarkets: ['中国', '德国', '墨西哥'],
    mainBusiness: '一体化压铸铝合金副车架、控制臂及新能源底盘结构件大批量冲压与机加工',
    riskScore: 58,
    riskLevel: '中等',
    summary: '车企主机厂压账期、模具所有权与质量追溯追偿极具压迫性，劳动用工外包合规需重点规范。'
  },
  {
    id: 'ep-06',
    name: '杭州数智云享工业SaaS软件股份有限公司',
    industry: '工业软件与企业服务',
    scale: '科技企业（专精特新）',
    employees: 140,
    targetMarkets: ['中国', '新加坡'],
    mainBusiness: '工业互联网低代码平台、MES云原生系统开发与私有化部署订阅服务',
    riskScore: 52,
    riskLevel: '低',
    summary: '软件开源代码协议污染风险、客户生产数据商业秘密与网络安全等级保护合规重点。'
  },
  {
    id: 'ep-07',
    name: '无锡绿动储能系统集成有限责任公司',
    industry: '新型工商业储能',
    scale: '新能源成长企业',
    employees: 160,
    targetMarkets: ['中国', '中东', '南非'],
    mainBusiness: '集装箱式工商业储能电站集成制造、电网侧调频调峰设备投资与EPC建设',
    riskScore: 76,
    riskLevel: '中等',
    summary: '储能电站消防安全强制性标准责任划分、海外EPC保函兑付风险及安全生产环境评估要求极高。'
  },
  {
    id: 'ep-08',
    name: '广州华南冷链物流与跨境保税仓储有限公司',
    industry: '现代综合物流与供应链',
    scale: '规上物流企业',
    employees: 480,
    targetMarkets: ['中国', '东盟'],
    mainBusiness: '冷链生鲜保税仓储、港口集装箱公路干线运输与供应链金融质押监管',
    riskScore: 63,
    riskLevel: '中等',
    summary: '货损货差货物留置权行使、货车司机劳务用工侵权责任、供应链存货重复质押监管法律漏洞。'
  },
  {
    id: 'ep-09',
    name: '北京拓扑灵动智能机器人感知技术有限公司',
    industry: '人工智能与具身智能',
    scale: '初创高科技',
    employees: 65,
    targetMarkets: ['中国'],
    mainBusiness: '工业协作机器人3D视觉传感器、力控末端夹爪与自主导航系统研发',
    riskScore: 47,
    riskLevel: '低',
    summary: '创始团队高校职务发明争议防范、天使与A轮股权融资反稀释与优先清算权法务把关。'
  },
  {
    id: 'ep-10',
    name: '常州金源特种高分子复合材料制造有限公司',
    industry: '新材料与精细化工',
    scale: '中型制造企业',
    employees: 290,
    targetMarkets: ['中国', '日本'],
    mainBusiness: '锂电隔膜涂覆PVDF树脂、风电叶片特种环氧树脂胶粘剂研发与合成生产',
    riskScore: 71,
    riskLevel: '中等',
    summary: '危化品安全生产许可与排污许可证全周期管理、技术配方商业秘密保护防范竞业跳槽。'
  }
]

// 企业合规8大分类与风险评分数据
export const MOCK_COMPLIANCE_CATEGORIES: ComplianceCategory[] = [
  {
    id: 'comp-export',
    name: '出口贸易合规',
    score: 81,
    level: 'high',
    description: '涉及海外目标市场海关关税、EAR出口管制受限物项筛查、反倾销调查及反规避法律监管。',
    keyRisks: [
      '出口北美产品未进行完整EAR出口管制物项ECCN编码排查',
      '关税分类代码（HS Code）申报存在归类不准可能引发海关巨额补税及行政罚款',
      '海外代理商未签署最终用户与最终用途（End-User）承诺函'
    ],
    actionPlans: [
      { priority: 'P0', action: '建立企业出口合规筛查机制，对涉及海外出货的产品进行BOM物项物料穿透审核', department: '国际贸易部 / 法务部', cycle: '15天内完成' },
      { priority: 'P1', action: '聘请美国专业贸易律师完善涉外合同中的出口管制与最终用途声明条款', department: '法务部', cycle: '30天内完成' }
    ]
  },
  {
    id: 'comp-ip',
    name: '知识产权与专利防侵权',
    score: 72,
    level: 'medium',
    description: '海外目标市场核心技术专利侵权检索（FTO）、商标多国马德里注册以及涉外展会侵权预警。',
    keyRisks: [
      '海外主力销售设备在欧美市场尚未进行系统的FTO自由实施尽职检索，存在专利流氓（NPE）侵权诉讼隐患',
      '供应商供应的第三方激光光源与视觉算法未出具完整知识产权权利来源无瑕疵担保书',
      '英文品牌商标尚未在部分欧洲目标国家完成商标注册防御'
    ],
    actionPlans: [
      { priority: 'P0', action: '针对核心出口机型启动重点国家专利自由运作检索（FTO）排查报告', department: '研发中心 / 知识产权部', cycle: '30天内启动' },
      { priority: 'P1', action: '修订标准采购合同模板，增加第三方侵权全额追偿与律师费承担条款', department: '法务部 / 采购部', cycle: '7天内完成' }
    ]
  },
  {
    id: 'comp-product',
    name: '产品质量与责任标准',
    score: 68,
    level: 'medium',
    description: '涉及强制性认证（CE/UL/FCC）、消费者保护法、产品召回义务及产品侵权连带责任。',
    keyRisks: [
      '部分定制电气控制柜未获得北美UL 508A认证即装船发运',
      '产品英文安全警示说明书未严格对照美国ANSI Z535格式规范，涉产品警告责任抗辩缺陷',
      '海外产品责任商业综合保险（CGL）保额偏低且未覆盖召回费用'
    ],
    actionPlans: [
      { priority: 'P0', action: '全面核查所有出海机型安全认证证书并在产品醒目位置张贴规范警示标签', department: '质量管理部 / 生产中心', cycle: '20天内完成' },
      { priority: 'P1', action: '将海外产品责任险保额由100万美元提升至500万美元并附加召回损失险', department: '财务部 / 法务部', cycle: '15天内完成' }
    ]
  },
  {
    id: 'comp-contract',
    name: '合同全生命周期管理',
    score: 65,
    level: 'medium',
    description: '合同拟定、重大条款审批授权、履约变更跟进、应收账款催收及诉讼时效管理。',
    keyRisks: [
      '业务部门存在“先发货后补签合同”或“盖章文本与法务定稿版本不一致”的越权操作漏洞',
      '合同履行过程中的往来微信记录、技术变更联系单未按要求归档，诉讼举证困难',
      '应收账款账龄超过1年的高风险合同未及时采取诉讼财产保全措施'
    ],
    actionPlans: [
      { priority: 'P1', action: '上线电子合同智能审核与用印防伪一致性核验系统，杜绝萝卜章与阴阳合同', department: '法务部 / IT部', cycle: '30天内上线' },
      { priority: 'P1', action: '梳理逾期超60天的应收账款清单，批量发送法务催告函与律师函', department: '法务部 / 财务部', cycle: '10天内完成' }
    ]
  },
  {
    id: 'comp-data',
    name: '网络安全与数据出境合规',
    score: 61,
    level: 'medium',
    description: '个人信息保护法（PIPL）、欧盟GDPR、重要工业数据分类分级及数据跨境传输安全评估。',
    keyRisks: [
      '智能设备采集的海外客户工厂运行遥测日志与产线参数上传至国内服务器，未进行数据出境合规申报',
      '官网及客户端软件隐私政策条款存在默认勾选与过度收集信息的情形',
      '核心生产系统未完全落实网络安全等级保护（等保三级）整改要求'
    ],
    actionPlans: [
      { priority: 'P1', action: '对产线设备数据流向进行盘点，区分工业运行数据与个人隐私信息并实施就地存储', department: 'IT信息中心 / 法务部', cycle: '45天内完成' },
      { priority: 'P2', action: '更新官网用户隐私协议，增加个人信息处理撤回同意机制', department: '法务部', cycle: '7天内完成' }
    ]
  },
  {
    id: 'comp-labor',
    name: '劳动人事与用工风险',
    score: 48,
    level: 'low',
    description: '劳动合同订立、加班费合规、调岗调薪合规性、劳务外包切分与核心骨干竞业限制。',
    keyRisks: [
      '车间倒班员工综合工时制审批批文已到期，尚未及时办理延续行政许可',
      '部分外包人员与本厂员工混岗作业，存在劳务派遣比例超标与混同用工认定风险'
    ],
    actionPlans: [
      { priority: 'P2', action: '重新向人社局申报不定时工作制与综合计算工时工作制许可', department: '人力资源部', cycle: '20天内完成' },
      { priority: 'P2', action: '规范劳务外包协议与现场管理规章，确立外包公司独立考核与调度机制', department: '人力资源部 / 法务部', cycle: '30天内完成' }
    ]
  },
  {
    id: 'comp-secret',
    name: '商业秘密与竞业防护',
    score: 55,
    level: 'medium',
    description: '核心技术图纸密级划分、物理与网络防泄密措施（DLP）、离职骨干员工竞业限制跟踪。',
    keyRisks: [
      '研发服务器图纸与源码未强制推行透明加密与外发水印追踪机制',
      '技术骨干离职后的竞业限制补偿金未在离职后次月按时支付，可能导致竞业限制协议失效'
    ],
    actionPlans: [
      { priority: 'P1', action: '建立商业秘密密级划分制度并对涉密图纸加盖电子受控章', department: '研发中心 / 保密办', cycle: '25天内完成' },
      { priority: 'P1', action: '建立离职高管及核心研发人员竞业限制补偿金台账与动态就业跟踪调查', department: 'HR / 法务部', cycle: '常态化执行' }
    ]
  },
  {
    id: 'comp-env',
    name: '环境保护与双碳安全',
    score: 42,
    level: 'low',
    description: '环保环评批复、“三同时”验收、危险废物转移联单管理、欧盟电池法碳足迹核查。',
    keyRisks: [
      '产线喷涂与清洗环节产生的废活性炭未严格按照危废规范存放于专用危废库',
      '出口欧盟设备尚未建立全生命周期碳足迹核算体系'
    ],
    actionPlans: [
      { priority: 'P2', action: '规范危废储存标识并核验第三方危废处置单位资质与转移联单', department: '安环部', cycle: '10天内完成' },
      { priority: 'P2', action: '引入碳核算第三方评估机构出具设备碳足迹核查基线报告', department: '战略部 / 安环部', cycle: '60天内完成' }
    ]
  }
]

// 30条法规检索情报库
export const MOCK_REGULATION_QUERIES: RegulationQueryItem[] = [
  {
    id: 'reg-01',
    query: '我们是一家生产储能设备的企业，准备向美国出口产品。涉及产品责任、数据合规和知识产权，目前需要关注哪些法律风险？',
    businessScenario: '新能源储能设备制造企业对美出口贸易与海外市场准入',
    targetMarkets: ['美国', '北美自由贸易区'],
    relevantRegulations: [
      {
        name: '美国《消费品安全改进法案》（CPSIA）及UL 9540储能系统安全标准',
        category: '产品安全与市场准入',
        keyArticles: '强制要求电气储能系统必须通过第三方NRTL国家认可实验室测试，符合热失控防范与火灾抑制技术要求。',
        compliancePoints: '必须取得UL 9540与UL 1973认证并附带NRTL标志，建立批次质量召回与缺陷通报机制。'
      },
      {
        name: '美国《出口管理条例》（EAR）及涉外商业管制清单（CCL）',
        category: '出口管制与国家安全',
        keyArticles: '严格管制含有特定高性能微处理器、加密算法的硬件与嵌入式软件的出口、再出口与国内转移。',
        compliancePoints: '对设备内含的芯片、嵌入式Linux系统进行ECCN归类判定，核查海外买家是否在实体清单（Entity List）中。'
      },
      {
        name: '加州《消费者隐私法案》（CCPA/CPRA）及《加州65号提案》（Prop 65）',
        category: '数据合规与化学物质警示',
        keyArticles: '若储能管理系统联网收集用户使用数据需提供不销售隐私选择权；若外壳材料含铅、邻苯二甲酸酯等需张贴醒目警示黄标。',
        compliancePoints: '提供脱敏数据传输通道并张贴标准加州Prop 65警示声明，避免职业打假律师提出惩罚性索赔。'
      }
    ],
    legalIssues: [
      '产品责任侵权诉讼抗辩与惩罚性赔偿风险',
      '出口管制与受限物项穿透合规审查',
      '设备云端远程遥测数据出境合规',
      '专利侵权（337调查）与FTO自由实施风险',
      '国际海运集装箱危险品（UN 3480/3536 9类危品）运输申报'
    ],
    aiPlainExplanation:
      '该业务场景涉及多个高强度法律与监管领域。核心建议：第一，在技术层面必须确保设备获得UL认证，否则一旦发生火灾事故，将面临无过错产品严格责任诉讼与巨额惩罚性赔偿；第二，在合同层面，必须要求美国进口商承担进口清关主体责任，明确知识产权纠纷抗辩义务；第三，严格审查设备控制软件中是否存在加密模块受制于美国EAR管制物项，防止因被列入涉外制裁名单导致供应链中断。',
    recommendedSteps: [
      '对出口机型开展全套UL 9540A热失控防火测试认证',
      '针对核心储能PCS与BMS算法在北美开展专利FTO防侵权检索',
      '修订涉外采购与销售合同，增加合规与不可抗力免责防御条款',
      '购买不低于500万美元限额的国际产品责任商业综合保险（CGL）'
    ]
  },
  {
    id: 'reg-02',
    query: '企业裁员或解除高管劳动合同时，如何避免支付双倍赔偿金（2N）？竞业限制补偿金应该如何依法约定？',
    businessScenario: '企业高级管理人员与核心技术骨干离职谈判与劳动用工合规',
    targetMarkets: ['中国'],
    relevantRegulations: [
      {
        name: '《中华人民共和国劳动合同法》第四十条、第四十七条、第八十七条',
        category: '劳动法与劳动仲裁',
        keyArticles: '明确无过失性辞退需提前30日书面通知或额外支付一个月工资（代通知金），违法解除需支付二倍经济补偿金（2N）。',
        compliancePoints: '确保辞退依据（严重违反规章制度或客观情况发生重大变化）证据链充分，制度经民主程序制定并公示送达。'
      },
      {
        name: '最高人民法院关于审理劳动争议案件适用法律问题的解释（一）第三十六条至第四十条',
        category: '司法解释与竞业限制',
        keyArticles: '用人单位未约定竞业限制经济补偿的，劳动者履行竞业义务后有权要求按解除前十二个月平均工资的30%支付（不得低于当地最低工资）。',
        compliancePoints: '解除合同后连续三个月未支付补偿金的，劳动者有权请求解除竞业限制约定。'
      }
    ],
    legalIssues: [
      '违法解除劳动合同被判定2N赔偿金风险',
      '规章制度未经职工代表大会民主程序导致无法适用',
      '竞业限制范围约定过宽被法院依法调减',
      '竞业限制补偿金未按期支付导致保密协议自动失效'
    ],
    aiPlainExplanation:
      '高管与骨干离职辞退风险极高。避免2N判定的核心在于“证据前置”与“协商一致（N+1协议解除优先）”。绝不可仅凭口头沟通即强行停发工资或收回门禁卡，否则90%以上劳动仲裁均会判定用人单位违法解除。对于竞业限制，必须在离职交接当日出具书面《竞业限制履行通知书》，明确竞业公司清单与补偿金发放银行账号，并在离职次月起按期打款留存凭证。',
    recommendedSteps: [
      '优先采取《协商解除劳动合同协议书》（N+1方式）并签署完整权利放弃与互不追究承诺',
      '核查员工工时考勤、绩效考核签字确认单以及公司规章制度培训签到表',
      '单方辞退前必须书面通知工会并征求工会意见（法定前置程序）',
      '离职次月15日前按时发放首期竞业限制补偿金，保留银行电子回单'
    ]
  },
  {
    id: 'reg-03',
    query: '拟采购大型定制成套设备，合同中如何约定验收标准、异议期和付款节点才能最大程度保障买方资金安全？',
    businessScenario: '买方大额非标智能制造装备采购合同起草与商务谈判',
    targetMarkets: ['中国'],
    relevantRegulations: [
      {
        name: '《中华人民共和国民法典》第六百二十条至第六百二十三条',
        category: '合同编买卖合同',
        keyArticles: '买受人收到标的物应当在约定的检验期限内检验。约定的检验期限过短，依照标的物的性质买受人难以在检验期限内完成全面检验的，该期限仅视为对外观瑕疵的检验。',
        compliancePoints: '明确区分外观初验与内在性能终验，杜绝合同出现“通电即视为终验合格”的不利默示条款。'
      }
    ],
    legalIssues: [
      '预付款过高且无履约担保的资金落空风险',
      '默示视为合格条款导致买方丧失质量瑕疵追索权',
      '卖方单方远程停机或锁死软件侵权行为',
      '因卖方延期交付导致买方停工停产的间接损失赔偿界定'
    ],
    aiPlainExplanation:
      '对于非标定制设备，买方必须牢牢抓住“付款进度与客观实测指标绑定”这根生命线。强烈建议摒弃70%以上的重度预付款模式，采用“3-3-3-1”阶梯支付方式，并以双方盖章的书面《最终验收合格报告》作为支付关键款项的唯一凭证，同时严厉禁止卖方内置后门或远程锁机。',
    recommendedSteps: [
      '合同正文后必须附加经总工程师签字确认的《技术性能指标及验收标准协议书》',
      '约定分段付款：30%预付（附保函）+ 30%到货 + 30%连续30日满负荷终验 + 10%质保金',
      '明确写入“严禁远程锁机”条款并约定不低于合同总额30%的违约金',
      '将管辖法院明确约定在买方所在地或合同履行地法院'
    ]
  }
]

// 30条法务日常任务
export const MOCK_LEGAL_TASKS: LegalTask[] = [
  {
    id: 'task-01',
    title: '《设备采购合同》重点条款复核及修改建议书出具',
    contractName: '《自动化智能制造设备采购及安装调试合同》',
    type: '合同初审',
    priority: 'P0',
    status: '进行中',
    assignee: 'AI法务员工 / 王法务经理',
    deadline: '2026-09-03 18:00',
    createdAt: '2026-09-03 09:12'
  },
  {
    id: 'task-02',
    title: '大储电芯年度供货协议到期续约条款与质保金结算审查',
    contractName: '《大储电芯及BMS管理系统年度供货协议》',
    type: '续约评估',
    priority: 'P0',
    status: '待处理',
    assignee: '张律师 / 法务一组',
    deadline: '2026-09-08 12:00',
    createdAt: '2026-09-02 16:40'
  },
  {
    id: 'task-03',
    title: '针对储能设备北美出口项目出具产品责任与合规排查备忘录',
    contractName: '《年产3000套工业变流器北美独家经销代理协议》',
    type: '合规排查',
    priority: 'P0',
    status: '进行中',
    assignee: 'AI法务员工 / 涉外合规部',
    deadline: '2026-09-05 17:30',
    createdAt: '2026-09-02 10:15'
  },
  {
    id: 'task-04',
    title: '二期厂房租赁合同到期前30天书面续租告知函拟定',
    contractName: '《苏州工业园区智造智谷二期厂房租赁合同》',
    type: '条款复核',
    priority: 'P1',
    status: '待处理',
    assignee: '李法务专员',
    deadline: '2026-09-04 12:00',
    createdAt: '2026-09-01 09:40'
  },
  {
    id: 'task-05',
    title: '高管离职竞业限制补偿金发放及同业竞争负面清单更新',
    contractName: '《高管高级技术专家聘用与专项竞业限制协议》',
    type: '合规排查',
    priority: 'P1',
    status: '已完成',
    assignee: 'HR法务连线 / 陈法务',
    deadline: '2026-08-31 18:00',
    createdAt: '2026-08-30 17:15'
  },
  {
    id: 'task-06',
    title: '沙特EPC特高压供货涉外法律管辖与独立保函风险防范评估',
    contractName: '《中东沙特阿拉伯特高压配套设备出口供货框架协议》',
    type: '法规研判',
    priority: 'P0',
    status: '进行中',
    assignee: '涉外大律师团队 / AI法务',
    deadline: '2026-09-06 18:00',
    createdAt: '2026-09-02 22:00'
  },
  {
    id: 'task-07',
    title: '五轴加工中心二期付款逾期法务催告函审核签发',
    contractName: '《高精度五轴联动加工中心销售与维保合同》',
    type: '合同初审',
    priority: 'P1',
    status: '已完成',
    assignee: '王法务经理',
    deadline: '2026-08-28 17:00',
    createdAt: '2026-08-25 10:18'
  },
  {
    id: 'task-08',
    title: '超声波焊接机批量虚焊客诉质量索赔函及尾款扣留法律意见书',
    contractName: '《锂电池极耳超声波焊接机采购合同》',
    type: '条款复核',
    priority: 'P0',
    status: '待处理',
    assignee: 'AI法务员工 / 诉讼仲裁组',
    deadline: '2026-09-04 15:00',
    createdAt: '2026-09-02 14:10'
  },
  {
    id: 'task-09',
    title: '工业互联网二级节点解析数据跨境安全自评估报告复核',
    contractName: '《面向工业互联网的标识解析二级节点运营服务合同》',
    type: '合规排查',
    priority: 'P2',
    status: '已完成',
    assignee: '数据合规官',
    deadline: '2026-08-20 18:00',
    createdAt: '2026-07-28 14:15'
  },
  {
    id: 'task-10',
    title: '大宗钢材供应链长协价格波动联动机制触发审查',
    contractName: '《2026年度钢材原材料大宗供应链直采长协》',
    type: '条款复核',
    priority: 'P1',
    status: '进行中',
    assignee: '采购供应链法务专员',
    deadline: '2026-09-05 18:00',
    createdAt: '2026-08-27 15:45'
  }
]

// 法务知识库分类与文件
export const MOCK_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'kb-01',
    title: '《企业标准设备采购合同示范文本（2026版·买方保护型）》',
    category: '合同模板',
    format: 'DOCX',
    fileSize: '428 KB',
    uploadDate: '2026-08-01',
    extractedTerms: 52,
    usageCount: 142,
    tags: ['设备采购', '示范模板', '反锁机条款', '买方保护'],
    summary: '包含3-3-3-1付款梯度、银行履约保函标准格式、开箱与带载试运行验收分级标准、反恶意远程锁机惩罚性条款及本地仲裁示范条款。'
  },
  {
    id: 'kb-02',
    title: '《新能源装备海外销售与独家经销标准协议（中英双语）》',
    category: '合同模板',
    format: 'DOCX',
    fileSize: '812 KB',
    uploadDate: '2026-07-15',
    extractedTerms: 68,
    usageCount: 96,
    tags: ['海外贸易', '独家经销', '出口管制', '中英双语'],
    summary: '涵盖汇率锁定机制、最低采购量考核考核标准、知识产权侵权兜底抗辩与最终用户EAR不扩散合规声明。'
  },
  {
    id: 'kb-03',
    title: '《企业商业秘密保护与核心技术图纸密级受控管理办法》',
    category: '企业制度',
    format: 'PDF',
    fileSize: '1.2 MB',
    uploadDate: '2026-06-20',
    extractedTerms: 34,
    usageCount: 210,
    tags: ['商业秘密', '图纸管理', '内控制度', '涉密定级'],
    summary: '规定研发服务器图纸水印权限、外发加密申请审批流程、核心技术人员离职脱密期管理与泄密责任调查流程。'
  },
  {
    id: 'kb-04',
    title: '《最高人民法院关于大型非标设备买卖合同纠纷裁判观点汇总（2024-2026）》',
    category: '历史案例',
    format: 'PDF',
    fileSize: '2.4 MB',
    uploadDate: '2026-08-10',
    extractedTerms: 88,
    usageCount: 78,
    tags: ['司法判例', '非标设备', '默示合格抗辩', '停产损失'],
    summary: '汇编最高法及各高级法院针对“设备通电是否视为合格”、“停工停产间接损失赔偿判定准则”及“技术协议与主合同冲突时如何适用”的司法观点。'
  },
  {
    id: 'kb-05',
    title: '《核心技术骨干全流程竞业限制协议与离职交接承诺书》',
    category: '合同模板',
    format: 'DOCX',
    fileSize: '315 KB',
    uploadDate: '2026-05-12',
    extractedTerms: 28,
    usageCount: 165,
    tags: ['人事用工', '竞业限制', '骨干离职', '补偿金'],
    summary: '符合最新劳动争议司法解释，明确竞争对手认定范围、离职后补偿金发放账号核验与违约金两倍赔偿标准。'
  },
  {
    id: 'kb-06',
    title: '《欧盟新电池法规（EU 2023/1542）全生命周期合规指引与企业应对白皮书》',
    category: '合规文件',
    format: 'PDF',
    fileSize: '3.6 MB',
    uploadDate: '2026-07-28',
    extractedTerms: 110,
    usageCount: 189,
    tags: ['欧盟法规', '电池护照', '碳足迹', 'ESG合规'],
    summary: '详细剖析电池护照（Battery Passport）数据要求、回收材料最低利用比例、尽职调查（Due Diligence）供应链责任及通报义务。'
  },
  {
    id: 'kb-07',
    title: '《2025年度重大涉诉案件复盘及法律风险防范审查报告》',
    category: '历史审查报告',
    format: 'PDF',
    fileSize: '1.8 MB',
    uploadDate: '2026-01-15',
    extractedTerms: 45,
    usageCount: 62,
    tags: ['诉讼复盘', '应收账款', '合同漏洞', '风险整改'],
    summary: '全面剖析过去三年内3起设备采购验收纠纷与2起应收款催收胜诉案件，总结合同起草阶段必须规避的十大漏洞。'
  },
  {
    id: 'kb-08',
    title: '《关于拟引进外资股东对赌协议（VAM）回购条款合法性之律师法律意见书》',
    category: '律师意见',
    format: 'PDF',
    fileSize: '950 KB',
    uploadDate: '2026-06-05',
    extractedTerms: 31,
    usageCount: 45,
    tags: ['投融资', '对赌协议', '金杜律所', '股权回购'],
    summary: '针对九民纪要及新公司法关于目标公司对赌回购减资程序的合法有效性进行全面法理论证与实操架构设计建议。'
  }
]

// AI今日法务情报与工作记录数据
export const MOCK_AI_TODAY_STATS = {
  todayProcessedContracts: 18,
  totalRisksFound: 32,
  highRisksFound: 6,
  expiringContractsCount: 4,
  newRegulationIntelCount: 12
}

export const MOCK_AI_WORK_LOGS: AiWorkLog[] = [
  {
    id: 'log-01',
    time: '09:12',
    title: '完成《设备采购合同》深度AI审查',
    type: 'review',
    description: '成功扫描18页合同、识别47项条款，发现12项法律风险，输出3项P0级高风险条款重构建议'
  },
  {
    id: 'log-02',
    time: '09:36',
    title: '发现3项高风险关键条款并标记预警',
    type: 'risk',
    description: '针对第5条预付款70%、第8条对等违约金缺失、第6条通电默示视为合格完成示范条款改写'
  },
  {
    id: 'log-03',
    time: '10:21',
    title: '完成《产品销售合同》履约风险自动扫描',
    type: 'review',
    description: '复核上海新能源1450万供货合同，识别出价格浮动机制与质保期结算潜在差异'
  },
  {
    id: 'log-04',
    time: '11:03',
    title: '触发企业合同即将到期实时预警',
    type: 'expire',
    description: '识别《智造智谷二期厂房租赁合同》仅剩27天届满，自动提醒法务草拟书面续约申请书'
  },
  {
    id: 'log-05',
    time: '14:26',
    title: '完成新能源出海企业合规与法规情报分析',
    type: 'regulation',
    description: '针对储能设备对美出口涉及的产品责任、UL 9540标准及加州Prop 65完成情报矩阵映射'
  },
  {
    id: 'log-06',
    time: '15:40',
    title: '企业法律知识库入库与智能关联完成',
    type: 'compliance',
    description: '新增《欧盟新电池法合规指引》与《设备采购示范文本》，自动提取162项关键合规点'
  }
]

export const MOCK_ALL_CONTRACTS = MOCK_CONTRACTS_REPOSITORY
export const MOCK_COMPLIANCE_DIMENSIONS = MOCK_COMPLIANCE_CATEGORIES
export const MOCK_REGULATION_INTEL = MOCK_REGULATION_QUERIES
export const MOCK_KNOWLEDGE_TEMPLATES = MOCK_KNOWLEDGE_DOCS
