import type { ExpertTeam } from '@/types'

/** 专家团场景分类 */
export const teamIndustries = [
  { name: '全部', value: 'all' },
  { name: '投标', value: '投标' },
  { name: '外贸', value: '外贸' },
  { name: '内容增长', value: '内容增长' },
  { name: '电商', value: '电商' },
  { name: '企业服务', value: '企业服务' },
  { name: '客服', value: '客服' },
  { name: '人力', value: '人力' },
  { name: '法务', value: '法务' },
  { name: '研发', value: '研发' },
  { name: '营销', value: '营销' },
] as const

export const expertTeams: ExpertTeam[] = [
  {
    slug: 'bid-ops-team',
    name: '投标作战团',
    industry: '投标',
    tagline: '一个团队，从招标到投标全程接力',
    description:
      '将投标全流程拆分为「读标 → 风控 → 测算 → 汇合」四个环节，由投标经理指挥、合同审查把风控、数据分析做测算，一支 AI 团队协作完成从招标文件解析到投标策略定稿的全部工作。',
    icon: 'Target',
    badge: '混合协作',
    price: '¥899',
    highlights: [
      '三位专家分工接力，全流程无断点',
      '合同审查并行扫描废标风险，不遗漏一票否决项',
      '数据分析并行测算评分与报价空间',
      '总指挥汇总成一份可执行的投标作战方案',
    ],
    scenarios: [
      '收到招标文件，需要快速出一份完整投标策略',
      '标书量大，需要分工并行处理风险与测算',
      '团队人手不足，一个人要顶一个投标团队',
    ],
    members: [
      {
        skillSlug: 'ai-bid-manager',
        role: '总指挥',
        responsibility: '解析招标文件、制定作战计划、汇总最终方案',
      },
      {
        skillSlug: 'ai-contract-review',
        role: '风控专家',
        responsibility: '并行扫描合同条款与废标风险',
      },
      {
        skillSlug: 'ai-data-analyst',
        role: '测算专家',
        responsibility: '并行测算评分得分点与报价空间',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-bid-manager',
        mode: 'plan',
        title: '解析招标，制定作战计划',
        description: '读懂招标文件，识别资格要求、评标办法与关键节点，拆解为风控与测算两项并行任务。',
        input: '招标文件 + 企业信息',
        output: '作战计划（任务分工 / 时间节点）',
        snapshot: '已识别硬性门槛：壹级资质、业绩、保证金（必须基本户转出）；按 09-18 09:30 截标倒排 D-5 起作战节奏。',
        duration: '约 30s',
      },
      {
        step: 2,
        role: '风控专家',
        skillSlug: 'ai-contract-review',
        mode: 'parallel',
        title: '并行扫描废标风险',
        description: '逐条核对资格条件、保证金、截止时间等一票否决项，输出风险清单。',
        input: '作战计划 + 招标文件',
        output: '废标风险清单（分级）',
        snapshot: '风控扫描出 3 项中危：保证金汇出账户、签字盖章位置、样品邮寄时效，其中保证金账户为一票否决高危项。',
        duration: '约 20s',
      },
      {
        step: 3,
        role: '测算专家',
        skillSlug: 'ai-data-analyst',
        mode: 'parallel',
        title: '并行测算评分与报价',
        description: '拆解综合评分法，估算各分项得分空间与报价最优区间。',
        input: '作战计划 + 评标办法',
        output: '评分测算表 + 报价建议',
        snapshot: '按综合评分法测算：技术 40 分为主战场，可提 +4.5 分；报价建议下浮 6%，预计总分约 86.5。',
        duration: '约 20s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-bid-manager',
        mode: 'merge',
        title: '汇总交付投标方案',
        description: '合并风控清单与测算结果，产出结构化投标作战方案与提分策略。',
        input: '风险清单 + 测算表',
        output: '投标作战方案（含提分策略）',
        snapshot: '已合并风控清单与评分测算，生成投标作战方案：资格判定 + 风险清单 + 提分策略 + 作战节奏。',
        duration: '约 30s',
      },
    ],
    inputFields: [
      {
        key: 'tenderContent',
        label: '招标文件内容',
        type: 'textarea',
        placeholder: '粘贴招标文件关键内容（项目概况、资格要求、评标办法、时间节点等）…',
        required: true,
      },
      {
        key: 'companyProfile',
        label: '企业信息（可选）',
        type: 'textarea',
        placeholder: '粘贴企业资质、业绩案例、人员信息等…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全流程作战', '废标风险优先', '评分与报价优先'],
      },
    ],
    sampleTask: '智慧城市项目招标，预算 1500 万元，综合评分法（商务20+技术40+报价30+售后10），投标保证金 30 万元，2026年09月18日 09:30 截标。资格要求：电子与智能化工程专业承包壹级。',
    sampleDeliverable: `# 投标作战方案 · 智慧城市项目

> kpi: 项目预算: 1500 万元 | 预计总分: 86.5/100 | 提分空间: +8.5 分 | 风险项: 3 项

## 一、资格判定与硬性门槛

| 检查项 | 结论 | 说明 |
| --- | --- | --- |
| 电子与智能化壹级资质 | ✅ 满足 | 资质等级达标 |
| 企业业绩 | ✅ 达标 | 近 3 年同类项目 5 个 |
| 投标保证金 30 万 | ⚠️ 高危 | 必须从基本户转出并截图留档 |

## 二、废标风险清单

- [高] 保证金汇出账户不符 → 开标前 3 天完成基本户转账
- [中] 签字盖章遗漏 → 封标前逐份核对授权书 / 报价 / 技术标
- [中] 样品邮寄时效 → D-2 顺丰特快发出并跟踪签收

## 三、评分测算与报价建议

| 评分项 | 权重 | 现状分 | 可提分 | 提分动作 |
| --- | --- | --- | --- | --- |
| 商务 | 20 | 16 | +1.5 | 补齐体系认证证书 |
| 技术 | 40 | 31 | +4.5 | 深化施工组织设计 |
| 报价 | 30 | 24 | +2 | 建议下浮 6% |
| 售后 | 10 | 8 | +0.5 | 完善驻场响应方案 |

## 四、作战节奏（倒排）

- [ ] D-5：完成技术标框架与评分对照表
- [ ] D-3：风控与测算复核，补齐加分证书
- [ ] D-2：标书体检 + 封标预演
- [ ] D-1：封标复核 + 保证金转账确认

## 风险分级清单

- [高] 保证金汇出账户不符将直接废标
- [中] 样品邮寄受节假日时效影响
- [低] 报价下浮 6% 对毛利影响可控

> 依据：综合评分法逐项测算；资格要求取自招标文件，投标前请以最新版招标文件复核。`,
    faq: [
      {
        id: 'bid-team-faq-1',
        question: '投标作战团和单个 AI 投标经理有什么区别？',
        answer: '单个 Skill 是「一个人干一件事」，作战团是「一支团队分工接力」：投标经理指挥、合同审查并行查风险、数据分析并行做测算，适合需要全流程覆盖、并行处理的完整投标场景。',
      },
      {
        id: 'bid-team-faq-2',
        question: '三个专家可以单独购买吗？',
        answer: '可以。团队中的每位成员都对应一个 Skill，可在 Skill 商城单独购买；作战团按打包价提供协作编排，价格更划算。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥899',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥1,499',
        period: '一次性',
        description: '高频投标场景，更多调用与高级模板',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '高级输出模板（含附件）', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,999',
        period: '一次性',
        description: '企业级用量与团队共享',
        features: ['三位专家协作流程', '不限次数调用', '企业共享席位', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'trade-export-team',
    name: '外贸出海团',
    industry: '外贸',
    tagline: '询盘 → 报价 → 营销，出海全链路一支团队搞定',
    description:
      '围绕外贸获客全流程：外贸销售分析询盘与客户、营销文案起草开发信与营销内容、数据分析扫描市场与竞品，三位专家协作输出从客户跟进到营销投放的完整出海方案。',
    icon: 'Globe2',
    badge: '混合协作',
    price: '¥699',
    highlights: [
      '询盘分析 + 客户画像 + 跟进话术一步到位',
      '开发信 / 社媒内容由营销专家并行产出',
      '市场与竞品数据实时扫描支撑报价决策',
      '适合一人外贸公司，一个人顶一个外贸团队',
    ],
    scenarios: [
      '收到海外询盘，需要快速分析客户并起草回复',
      '准备开发信与社媒营销内容，缺人手',
      '需要市场行情与竞品分析支撑报价',
    ],
    members: [
      {
        skillSlug: 'ai-trade-sales',
        role: '总指挥',
        responsibility: '分析询盘、制定跟进策略、汇总报价方案',
      },
      {
        skillSlug: 'ai-marketing-copy',
        role: '内容专家',
        responsibility: '起草开发信、社媒文案等营销内容',
      },
      {
        skillSlug: 'ai-data-analyst',
        role: '市场专家',
        responsibility: '扫描市场行情与竞品信息',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-trade-sales',
        mode: 'plan',
        title: '分析询盘，制定跟进策略',
        description: '识别客户背景、采购意向与决策链，拆解为内容与市场两项并行任务。',
        input: '询盘内容 + 产品资料',
        output: '客户画像 + 跟进计划',
        snapshot: '客户画像：德国中型采购商，年采购 500 万欧，决策链含采购+技术，倾向本地化技术支持。',
        duration: '约 25s',
      },
      {
        step: 2,
        role: '内容专家',
        skillSlug: 'ai-marketing-copy',
        mode: 'parallel',
        title: '并行起草营销内容',
        description: '根据客户画像起草开发信、产品介绍与社媒营销文案。',
        input: '客户画像 + 跟进计划',
        output: '开发信 + 营销文案',
        snapshot: '开发信 2 版 + 德语产品介绍：突出 CE/ISO 认证与德语技术支持，确保 24h 内送达。',
        duration: '约 20s',
      },
      {
        step: 3,
        role: '市场专家',
        skillSlug: 'ai-data-analyst',
        mode: 'parallel',
        title: '并行扫描市场与竞品',
        description: '检索目标市场行情、竞品定价与需求热度，输出市场简报。',
        input: '客户画像 + 产品资料',
        output: '市场简报（行情 / 竞品 / 建议价）',
        snapshot: '市场简报：德国市场同类产品均价 12-18 欧，竞品主推认证与交期，建议基础报价下浮 5% 换量。',
        duration: '约 25s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-trade-sales',
        mode: 'merge',
        title: '汇总交付出海方案',
        description: '合并营销内容与市场简报，产出完整的外贸跟进与报价方案。',
        input: '营销文案 + 市场简报',
        output: '出海方案（跟进策略 + 报价建议）',
        snapshot: '已合并输出出海方案：跟进节奏 + 报价建议 + LinkedIn 行业帖与德语彩页营销内容。',
        duration: '约 25s',
      },
    ],
    inputFields: [
      {
        key: 'inquiry',
        label: '询盘 / 客户信息',
        type: 'textarea',
        placeholder: '粘贴询盘内容或客户背景（客户来源、采购意向、联系方式等）…',
        required: true,
      },
      {
        key: 'productInfo',
        label: '产品资料（可选）',
        type: 'textarea',
        placeholder: '粘贴产品卖点、参数、价格区间等…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全流程出海', '跟进策略优先', '营销内容优先'],
      },
    ],
    sampleTask: '收到来自德国客户的询盘：我们是中型采购商，年采购额 500 万欧，正在寻找工业传感器供应商，要求通过 ISO 认证并提供德语技术支持。我方产品为工业传感器，已通过 CE/ISO，支持 OEM。',
    sampleDeliverable: `# 外贸出海方案 · 德国询盘跟进

> kpi: 客户年采购额: 500 万欧 | 询盘评级: A 级 | 建议报价: 下浮 5% | 首轮回复: 24h 内

## 一、客户画像与意图判断

| 维度 | 分析 |
| --- | --- |
| 客户背景 | 德国中型采购商，年采购额约 500 万欧 |
| 采购意向 | 明确（工业传感器 + 认证 + 技术） |
| 决策链 | 采购 + 技术双角色，技术权重高 |
| 关键诉求 | ISO 认证、德语技术支持、本地化服务 |

## 二、跟进策略（时间线）

- [ ] 24h 内：首封开发信（德语版）+ 产品参数表
- [ ] 48h 内：补齐 CE/ISO 证书与产线产能证明
- [ ] 第 5 天：报价单（附 MOQ 阶梯折扣）+ 2 个同类 OEM 案例
- [ ] 第 7 天：LinkedIn 触达采购负责人 + 邀约线上技术会

## 三、报价建议

| 方案 | 说明 |
| --- | --- |
| 基础报价 | 市场均价下浮 5%，换取首单与案例背书 |
| MOQ 阶梯 | 500 / 1,000 / 2,000 件三档，逐档让利 3% |
| 认证保障 | 承诺交付前提供 CE/ISO 原版证书扫描件 |

## 四、营销内容配套

- [ ] LinkedIn 行业帖：德语版「工业传感器选型要点」
- [ ] 德语产品彩页 + 技术参数表
- [ ] 投放德语区行业社群（2 个目标群组）

## 风险分级清单

- [中] 客户要求德语技术支持 → 需确认内部德语资源或外包支持
- [低] 首单账期风险 → 建议首单 30% 预付款

> 依据：市场行情基于公开出口均价与竞品公开报价；报价建议结合 MOQ 与认证成本测算。`,
    faq: [
      {
        id: 'trade-team-faq-1',
        question: '外贸出海团适合新手外贸员吗？',
        answer: '非常适合。总指挥会基于询盘给出结构化跟进策略，内容专家直接产出可用的开发信文案，等于一个资深外贸团队在背后支持。',
      },
      {
        id: 'trade-team-faq-2',
        question: '报价建议会实时更新吗？',
        answer: '当前版本基于市场数据快照给出建议价区间；接入 B1 平台后可配置实时行情数据源，报价建议随数据更新。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥699',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥1,199',
        period: '一次性',
        description: '高频出海场景，更多调用与多语言模板',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '多语言模板（德/法/西）', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,699',
        period: '一次性',
        description: '企业级用量与团队共享',
        features: ['三位专家协作流程', '不限次数调用', '企业共享席位', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'content-growth-team',
    name: '内容增长团',
    industry: '内容增长',
    tagline: '规划 → 生产 → 复盘，内容全链路滚动增长',
    description:
      '按「内容规划 → 内容生产 → 数据复盘」三步串行接力：内容运营定选题与节奏，营销文案批量生产，数据分析复盘效果并反哺下一轮规划，形成可持续增长的内容飞轮。',
    icon: 'Megaphone',
    badge: '串行协作',
    price: '¥599',
    highlights: [
      '选题规划到复盘闭环，不再拍脑袋做内容',
      '营销文案批量生产，一次规划多篇成稿',
      '数据复盘反哺下一轮选题，越做越准',
      '适合内容团队与个人博主全流程提效',
    ],
    scenarios: [
      '公众号 / 小红书 / 短视频多平台内容运营',
      '需要批量生产文案但人手不足',
      '内容效果差，需要数据复盘改进选题',
    ],
    members: [
      {
        skillSlug: 'ai-content-ops',
        role: '总指挥',
        responsibility: '制定内容规划、把控选题与节奏、汇总复盘',
      },
      {
        skillSlug: 'ai-marketing-copy',
        role: '生产专家',
        responsibility: '按规划批量生产各平台文案',
      },
      {
        skillSlug: 'ai-data-analyst',
        role: '复盘专家',
        responsibility: '分析内容数据，提炼改进建议',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-content-ops',
        mode: 'plan',
        title: '制定内容规划',
        description: '明确目标人群与平台，拆解选题方向、发布节奏与考核指标。',
        input: '业务目标 + 目标人群',
        output: '内容规划（选题池 + 节奏表）',
        snapshot: '规划确定：公众号深度干货周更 2 篇 + 小红书场景种草日更 1 条，核心指标为互动率与涨粉归因。',
        duration: '约 25s',
      },
      {
        step: 2,
        role: '生产专家',
        skillSlug: 'ai-marketing-copy',
        mode: 'sequential',
        title: '批量生产内容',
        description: '按选题池逐批产出标题、正文与配图建议，适配各平台调性。',
        input: '内容规划',
        output: '内容成稿（多平台版本）',
        snapshot: '选题池 12 个（AI 办公实战 / 效率工具测评 / 行业案例拆解），标题各 3 版 A/B 备选。',
        duration: '约 30s',
      },
      {
        step: 3,
        role: '复盘专家',
        skillSlug: 'ai-data-analyst',
        mode: 'sequential',
        title: '数据复盘',
        description: '分析阅读、互动与转化数据，定位爆款因子与低效选题。',
        input: '内容成稿 + 数据表现',
        output: '数据复盘报告',
        snapshot: '复盘发现「AI 办公实战」互动率最高（7.2%）、工具测评转化最好，低效选题占 30% 需淘汰。',
        duration: '约 20s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-content-ops',
        mode: 'merge',
        title: '汇总优化下一轮规划',
        description: '结合复盘结论更新选题池与发布策略，闭环进入下一轮增长。',
        input: '复盘报告',
        output: '下一轮优化规划',
        snapshot: '已输出下一轮规划：放大爆款因子，「AI 办公实战」提至 50% 排期，周度复盘机制落地。',
        duration: '约 20s',
      },
    ],
    inputFields: [
      {
        key: 'goal',
        label: '内容目标与人群',
        type: 'textarea',
        placeholder: '描述业务目标、目标人群、运营平台（如：公众号涨粉，面向 B 端采购决策人）…',
        required: true,
      },
      {
        key: 'pastData',
        label: '历史数据（可选）',
        type: 'textarea',
        placeholder: '粘贴近期内容数据（阅读 / 互动 / 转化等），用于复盘…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全链路增长', '选题规划优先', '文案生产优先'],
      },
    ],
    sampleTask: '公众号 + 小红书双平台运营，面向 B 端企业高管，目标是 3 个月内粉丝从 2 万涨到 5 万，重点提升 AI 办公类选题的互动率。',
    sampleDeliverable: `# 双平台内容增长方案

> kpi: 选题池: 12 个 | 双平台排期: 9 篇/周 | 爆款因子: 3 个 | 月度复盘: 4 次

## 一、平台与人群定位

| 平台 | 定位 | 发布节奏 | 内容形态 |
| --- | --- | --- | --- |
| 公众号 | 深度干货 | 周更 2 篇 | 长文 + 案例 |
| 小红书 | 场景化种草 | 日更 1 条 | 图文 + 清单 |

## 二、选题池（首批 12 个）

1. AI 办公实战（5 个）：写周报 / 做 PPT / 读研报 / 提效清单 / 开会纪要
2. 效率工具测评（4 个）：协作 / 文档 / 会议 / 自动化
3. 行业案例拆解（3 个）：同行业标杆内容复盘

## 三、生产节奏与模板

- [ ] 标题统一「爆款钩子 + 数字 + 人群」公式，每篇 A/B 各 3 版
- [ ] 正文按「痛点 → 方法 → 结果」结构，配 3 张信息图
- [ ] 小红书首图固定 3 套模板轮换，降低制作成本

## 四、复盘与放大机制

| 指标 | 当前 | 目标 | 动作 |
| --- | --- | --- | --- |
| 互动率 | 4.1% | 6%+ | 放大 AI 办公实战选题占比 |
| 涨粉 | +2,000/月 | +10,000/月 | 爆款追投 + 合集化 |
| 低效选题 | 30% | <15% | 周度淘汰，回流选题池 |

## 风险分级清单

- [中] 爆款模板复用后审美疲劳 → 每 2 周迭代模板细节
- [低] 平台算法波动 → 以周为单位看趋势

> 依据：选题源自账号历史爆款与同类头部账号拆解；指标基于当前粉丝体量合理设定。`,
    faq: [
      {
        id: 'content-team-faq-1',
        question: '内容增长团能直接生成发布内容吗？',
        answer: '能。生产专家会按各平台调性输出标题与正文初稿，总指挥还会给出配图建议与发布节奏，可直接进入排版发布环节。',
      },
      {
        id: 'content-team-faq-2',
        question: '复盘需要接入我的账号数据吗？',
        answer: '当前为演示模式，可在输入中粘贴历史数据文本即可复盘；接入 B1 平台后可配置数据源自动拉取。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥599',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥999',
        period: '一次性',
        description: '高频内容团队，更多调用与批量生产',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '批量生产模式', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,499',
        period: '一次性',
        description: '企业级用量与多账号管理',
        features: ['三位专家协作流程', '不限次数调用', '多账号管理', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'ecommerce-growth-team',
    name: '电商增长团',
    industry: '电商',
    tagline: '一个团队，从选品到爆单全程接力',
    description:
      '将电商增长拆解为「定打法 → 做内容 → 看数据」三个环节，由电商运营制定策略、营销文案产出活动与商品文案、数据分析复盘转化漏斗，一支 AI 团队协作完成从店铺诊断到增长方案落地的全部工作。',
    icon: 'ShoppingCart',
    badge: '并行协作',
    price: '¥899',
    highlights: [
      '三位专家分工接力，增长打法有策略有执行',
      '营销文案并行产出活动与商品文案，直接可发',
      '数据分析并行拆解转化漏斗，定位短板',
      '总指挥汇总成一份可落地的增长作战方案',
    ],
    scenarios: [
      '店铺有流量没转化，需要一套完整增长方案',
      '大促临近，要同时搞定策略、文案与复盘',
      '运营人手不足，一个人要顶一个增长团队',
    ],
    members: [
      {
        skillSlug: 'ai-ecommerce-ops',
        role: '总指挥',
        responsibility: '诊断店铺数据、制定增长打法、汇总最终方案',
      },
      {
        skillSlug: 'ai-marketing-copy',
        role: '内容专家',
        responsibility: '并行产出活动策划与商品文案',
      },
      {
        skillSlug: 'ai-data-analyst',
        role: '数据专家',
        responsibility: '并行拆解转化漏斗与流量结构',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-ecommerce-ops',
        mode: 'plan',
        title: '诊断店铺，制定增长打法',
        description: '分析店铺流量与转化数据，定位短板，拆解为内容与数据两项并行任务。',
        input: '店铺数据 + 商品信息',
        output: '增长打法（策略 / 分工）',
        snapshot: '诊断定位：转化 1.8% 偏低、退款 12% 偏高，短板在转化与客单而非流量，主攻双十一大促。',
        duration: '约 30s',
      },
      {
        step: 2,
        role: '内容专家',
        skillSlug: 'ai-marketing-copy',
        mode: 'parallel',
        title: '并行产出活动与文案',
        description: '按打法产出大促活动方案、商品标题与详情页文案。',
        input: '增长打法 + 商品卖点',
        output: '活动方案 + 文案初稿',
        snapshot: '活动方案定稿：满 199-30 + 前 2 小时 9 折 + 详情页实拍对比图，标题文案各 3 版。',
        duration: '约 25s',
      },
      {
        step: 3,
        role: '数据专家',
        skillSlug: 'ai-data-analyst',
        mode: 'parallel',
        title: '并行拆解转化漏斗',
        description: '分析流量、加购、转化各环节数据，定位转化短板与优化点。',
        input: '增长打法 + 店铺数据',
        output: '转化漏斗分析 + 优化点',
        snapshot: '漏斗分析：加购率 6.2% 但未转化，购物车营销缺失；直通车投产 2.1 偏低，无效词占 40%。',
        duration: '约 25s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-ecommerce-ops',
        mode: 'merge',
        title: '汇总交付增长方案',
        description: '合并内容方案与数据分析结论，产出可执行的增长作战方案。',
        input: '文案方案 + 漏斗分析',
        output: '电商增长作战方案',
        snapshot: '已输出电商增长作战方案：P0 详情页改版 + 购物车券，P1 直通车瘦身，大促前 3 天全量上线。',
        duration: '约 30s',
      },
    ],
    inputFields: [
      {
        key: 'shopData',
        label: '店铺数据',
        type: 'textarea',
        placeholder: '粘贴近 30 天店铺数据（访客、转化、客单价、推广花费等）…',
        required: true,
      },
      {
        key: 'productInfo',
        label: '商品 / 竞品信息（可选）',
        type: 'textarea',
        placeholder: '描述核心商品卖点、价格带、竞品情况…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全链路增长', '大促策划优先', '转化优化优先'],
      },
    ],
    sampleTask: '家居收纳店近 30 天：访客 21,000，转化率 1.8%，客单价 ¥128，退款率 12%，直通车投产 2.1。核心款「真空压缩袋」即将参加双十一，需要一套完整增长方案。',
    sampleDeliverable: `# 电商增长作战方案 · 双十一

> kpi: 月访客: 2.1 万 | 目标转化率: 3.5% | 目标退款率: <8% | 大促 GMV: 60 万

## 一、增长诊断（主攻转化而非流量）

| 指标 | 当前 | 行业均值 | 差距 |
| --- | --- | --- | --- |
| 转化率 | 1.8% | 3.5% | 差 1.7pp |
| 退款率 | 12% | 6% | 高 6pp |
| 直通车投产 | 2.1 | 3.0 | 差 0.9 |
| 加购率 | 6.2% | 5% | 正常 |

## 二、双十一活动方案

- [ ] 满 199 减 30 + 前 2 小时 9 折（叠加店铺券）
- [ ] 详情页首屏补实拍对比图 + 尺寸参考图
- [ ] 购物车 48h 限时券（未转化加购人群定向发放）

## 三、转化漏斗优化

| 环节 | 现状 | 优化动作 | 预期提升 |
| --- | --- | --- | --- |
| 进店→加购 | 6.2% | 首图短视频化 | +0.8pp |
| 加购→成交 | 29% | 购物车券 + 提醒 | +5pp |
| 成交→复购 | 18% | 满减凑单推荐 | +3pp |

## 四、执行排期

- [ ] 第 1 周：详情页改版 + 退款核查（对标实拍图）
- [ ] 第 2 周：直通车词表瘦身，聚焦 5 个高转化词
- [ ] 大促前 3 天：全量活动配置 + 库存锁单 + 客服话术

## 风险分级清单

- [高] 退款率若不降，大促放量将放大损失
- [中] 直通车调词后 3 天流量下滑属正常波动
- [低] 让利压缩毛利 → 提前测算让利上限

> 依据：数据来自店铺后台近 30 天报表；行业均值取自类目大盘公开数据。`,
    faq: [
      {
        id: 'ecom-team-faq-1',
        question: '电商增长团适合哪种店铺？',
        answer: '适合有稳定流量但转化或利润不理想的店铺，也适合大促前需要一次性产出策略、文案与复盘的运营团队。',
      },
      {
        id: 'ecom-team-faq-2',
        question: '文案和数据可以分别单独用吗？',
        answer: '可以。团队协作模式下每位专家成果独立交付，你可以只取文案或只取数据分析部分单独使用。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥699',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥899',
        period: '一次性',
        description: '高频增长团队，更多调用与批量生产',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '批量生产模式', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,499',
        period: '一次性',
        description: '企业级用量与多店铺管理',
        features: ['三位专家协作流程', '不限次数调用', '多店铺管理', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'business-decision-team',
    name: '经营决策团',
    industry: '企业服务',
    tagline: '财务 + 数据 + 知识，一次看清经营全局',
    description:
      '将经营决策拆解为「财务分析 → 数据洞察 → 制度查证」三个环节，由财务分析透视利润结构、数据分析深挖经营指标、知识库助手查证政策制度，一支 AI 团队协作完成从数据到决策建议的闭环。',
    icon: 'TrendingUp',
    badge: '混合协作',
    price: '¥899',
    highlights: [
      '财务分析透视毛利与费用结构，找准钱去哪了',
      '数据分析并行深挖经营指标，定位异常归因',
      '知识库助手查证制度政策，结论有据可依',
      '总指挥汇总成一份老板能拍板的经营决策报告',
    ],
    scenarios: [
      '月底经营分析，数据多但没人讲得清',
      '利润下滑，想同时查财务、数据与制度三个层面',
      '要给董事会/老板一份决策导向的经营简报',
    ],
    members: [
      {
        skillSlug: 'ai-finance-analyst',
        role: '总指挥',
        responsibility: '透视利润与现金流、制定分析框架、汇总决策建议',
      },
      {
        skillSlug: 'ai-data-analyst',
        role: '数据专家',
        responsibility: '并行深挖经营指标与异常归因',
      },
      {
        skillSlug: 'ai-knowledge-assistant',
        role: '资料专家',
        responsibility: '查证制度政策，确保结论有据可依',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-finance-analyst',
        mode: 'plan',
        title: '透视财务，制定分析框架',
        description: '速读三表，定位经营核心问题，拆解为数据与资料两项并行任务。',
        input: '财务报表 + 经营数据',
        output: '分析框架（问题 / 分工）',
        snapshot: '分析框架定位 3 大问题：毛利下滑归因、应收拉长与现金流转负，拆解为数据+资料并行查证。',
        duration: '约 30s',
      },
      {
        step: 2,
        role: '数据专家',
        skillSlug: 'ai-data-analyst',
        mode: 'parallel',
        title: '并行深挖经营指标',
        description: '分析营收结构、毛利归因与费用效率，输出指标洞察。',
        input: '分析框架 + 经营数据',
        output: '指标洞察（归因 / 趋势）',
        snapshot: '数据洞察：毛利下滑 4.5pct 源于大客户实施成本高（结构性）；应收 +12 天为资金风险主因。',
        duration: '约 25s',
      },
      {
        step: 3,
        role: '资料专家',
        skillSlug: 'ai-knowledge-assistant',
        mode: 'parallel',
        title: '并行查证制度政策',
        description: '检索企业制度与行业政策，为结论补充依据与约束条件。',
        input: '分析框架 + 企业资料',
        output: '制度政策查证结论',
        snapshot: '制度查证：成本增长集中在交付人力外包，符合预算制度但有优化空间；行业政策无强制限制。',
        duration: '约 25s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-finance-analyst',
        mode: 'merge',
        title: '汇总交付决策报告',
        description: '合并财务、数据与资料结论，产出经营决策报告与行动建议。',
        input: '指标洞察 + 查证结论',
        output: '经营决策报告（含行动项）',
        snapshot: '已输出经营决策报告：合同改「实施+订阅」分拆、90 天应收暂停新单、外包转固定团队降本。',
        duration: '约 30s',
      },
    ],
    inputFields: [
      {
        key: 'financialData',
        label: '财务与经营数据',
        type: 'textarea',
        placeholder: '粘贴三表关键数据、经营指标（营收、毛利、费用、应收等）…',
        required: true,
      },
      {
        key: 'companyDocs',
        label: '制度 / 政策资料（可选）',
        type: 'textarea',
        placeholder: '粘贴相关企业制度、行业政策等资料…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全链路决策', '利润分析优先', '风险审查优先'],
      },
    ],
    sampleTask: '公司 Q2：营收 860 万环比 -8%，毛利率 28.5%（Q1 33%），应收账期 68 天环比 +12 天，经营现金流 -15 万。需向董事会提交经营分析与调整建议。',
    sampleDeliverable: `# 经营决策报告 · 2026 Q2

> kpi: 营收: 860 万（-8%） | 毛利率: 28.5%（-4.5pct） | 应收账期: 68 天（+12 天） | 现金流: -15 万

## 一、核心问题定位

| 问题 | 严重度 | 归因 |
| --- | --- | --- |
| 毛利率下滑 4.5pct | 高 | 新签大客户实施成本高，属结构性因素 |
| 应收账期 +12 天 | 高 | 大客户账期宽松 + 回款催收缺失 |
| 经营现金流 -15 万 | 中高危 | 应收拉长 + 交付外包垫资 |

## 二、数据洞察（逐项归因）

| 指标 | Q1 | Q2 | 变化 | 归因 |
| --- | --- | --- | --- | --- |
| 毛利率 | 33% | 28.5% | -4.5pct | 大客户实施成本 |
| 应收账期 | 56 天 | 68 天 | +12 天 | 回款节奏失控 |
| 新签占比 | 30% | 42% | +12pp | 大客户战略 |

## 三、决策建议（行动项）

- [ ] 合同改「实施 + 订阅」分拆计价，摊薄一次性成本
- [ ] 90 天以上应收暂停新单，逾期 30 天启动催收流程
- [ ] 交付人力外包转为固定团队，长期降本约 15%
- [ ] 月度经营复盘会：毛利、应收、现金流三项必看

## 风险分级清单

- [高] 现金流持续为负将影响工资与供应商付款
- [中] 大客户战略短期拉低毛利，需平衡客户结构与报价
- [低] 外包转固定团队有 2 个月过渡成本

> 依据：基于三表与经营数据归因；制度查证对照公司差旅/预算制度；建议提交董事会评审。`,
    faq: [
      {
        id: 'decision-team-faq-1',
        question: '输出能直接上董事会吗？',
        answer: '能。总指挥按「财务-数据-资料-决策」四段式输出，结论量化、带行动项与优先级，稍作格式调整即可上会。',
      },
      {
        id: 'decision-team-faq-2',
        question: '制度查证真的有用吗？',
        answer: '资料专家只基于你提供的制度与政策回答，用于约束建议的可行性，确保方案不踩制度红线。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥699',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥899',
        period: '一次性',
        description: '高频决策团队，更多调用',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '批量分析模式', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,499',
        period: '一次性',
        description: '企业级用量与知识库接入',
        features: ['三位专家协作流程', '不限次数调用', '企业知识库接入', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'customer-service-team',
    name: '客服提效团',
    industry: '客服',
    tagline: '秒回 + 溯源 + 复盘，服务闭环不脱节',
    description:
      '将客户服务拆解为「应答 → 溯源 → 复盘」三个环节，由客服专家即时应答、知识库助手校准口径、数据分析复盘工单，一支 AI 团队协作完成从客户提问到服务优化的闭环。',
    icon: 'Headphones',
    badge: '混合协作',
    price: '¥799',
    highlights: [
      '客服专家秒级应答，高峰期不排队',
      '知识库助手同步溯源，口径统一不跑偏',
      '数据分析并行复盘工单，发现服务短板',
      '总指挥汇总成服务优化方案，持续提效',
    ],
    scenarios: [
      '咨询量暴增，客服忙不过来',
      '想统一应答口径又怕漏掉复杂问题',
      '售后工单多，要复盘投诉原因优化服务',
    ],
    members: [
      {
        skillSlug: 'ai-customer-service',
        role: '总指挥',
        responsibility: '即时应答、识别复杂问题、汇总服务优化建议',
      },
      {
        skillSlug: 'ai-knowledge-assistant',
        role: '知识专家',
        responsibility: '从知识库溯源答案，统一应答口径',
      },
      {
        skillSlug: 'ai-data-analyst',
        role: '复盘专家',
        responsibility: '分析工单与满意度数据，定位服务短板',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-customer-service',
        mode: 'plan',
        title: '识别问题，制定应答计划',
        description: '判断客户意图与情绪，规划应答路径与溯源需求。',
        input: '客户消息 + 知识库',
        output: '应答计划（意图 / 分工）',
        snapshot: '应答计划：三类高频工单（物流/瑕疵/退款）建立标准话术分支，物流延迟优先给补偿方案。',
        duration: '约 20s',
      },
      {
        step: 2,
        role: '知识专家',
        skillSlug: 'ai-knowledge-assistant',
        mode: 'parallel',
        title: '并行溯源知识口径',
        description: '从知识库检索标准答案与政策依据，校准应答内容。',
        input: '应答计划 + 知识库',
        output: '标准口径（含引用）',
        snapshot: '标准口径 6 条：附政策原文引用（物流赔付标准 / 7 天退换），客服可一键复制。',
        duration: '约 20s',
      },
      {
        step: 3,
        role: '复盘专家',
        skillSlug: 'ai-data-analyst',
        mode: 'parallel',
        title: '并行复盘工单数据',
        description: '分析工单类型、满意度与高频问题，定位服务短板。',
        input: '应答计划 + 工单数据',
        output: '工单复盘（短板 / 趋势）',
        snapshot: '工单复盘：物流延迟 38% 为最大短板，高延误区域集中华南 3 省，建议更换快递商。',
        duration: '约 25s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-customer-service',
        mode: 'merge',
        title: '汇总交付服务方案',
        description: '合并标准口径与复盘结论，产出应答方案与优化建议。',
        input: '标准口径 + 工单复盘',
        output: '服务应答方案 + 优化建议',
        snapshot: '已输出服务应答方案：口径模板 + 物流整改 + 满意度 78%→90% 提升路径。',
        duration: '约 25s',
      },
    ],
    inputFields: [
      {
        key: 'customerMsg',
        label: '客户消息 / 工单',
        type: 'textarea',
        placeholder: '粘贴客户咨询原文或批量工单内容…',
        required: true,
      },
      {
        key: 'knowledgeBase',
        label: '话术 / 知识资料（可选）',
        type: 'textarea',
        placeholder: '粘贴产品 FAQ、售后政策、话术规范等…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['即时应答优先', '工单复盘优先', '全链路提效'],
      },
    ],
    sampleTask: '电商售后工单批量涌入：主要类型为「物流延迟」（38%）、「商品瑕疵」（29%）、「退款咨询」（22%），近 30 天满意度 78%。需要一套标准应答方案与服务优化建议。',
    sampleDeliverable: `# 客服提效方案 · 售后工单专项

> kpi: 工单类型: 3 类 | 标准话术: 6 条 | 满意度: 78% → 90% | 首响目标: <30s

## 一、工单结构分析

| 工单类型 | 占比 | 根因 | 处理重点 |
| --- | --- | --- | --- |
| 物流延迟 | 38% | 高延误区域集中 | 主动补偿 + 更换快递商 |
| 商品瑕疵 | 29% | 品控波动 | 退换流程 + 质检反馈 |
| 退款咨询 | 22% | 规则不明 | 口径统一 + 自助退款 |

## 二、标准应答口径（附政策引用）

- [x] 物流延迟：赔付标准引用《快递服务国家标准》，主动补偿 5 元券
- [x] 商品瑕疵：7 天无理由退换 + 运费平台垫付
- [ ] 退款咨询：到账时效 1-3 个工作日 + 进度可查

## 三、短板整改与满意度路径

| 阶段 | 动作 | 预期 |
| --- | --- | --- |
| 1 周内 | 高延误区域切换快递商 | 物流工单 -30% |
| 2 周内 | 上线自助退款入口 | 退款咨询 -40% |
| 1 月内 | 质检环节加图片复核 | 瑕疵工单 -20% |

## 四、执行清单

- [ ] 客服台话术库导入 6 条标准口径
- [ ] 物流补偿权限下放至一线客服（≤20 元免审批）
- [ ] 每日工单看板：类型 / 响应时长 / 满意度

## 风险分级清单

- [高] 物流根因不解决，话术再好满意度难提升
- [中] 补偿放开需防滥用 → 设月度额度与异常监控
- [低] 质检复核增加人力 → 用 AI 图片初筛降低压力

> 依据：工单数据取自近 30 天客服后台；政策引用见《快递服务国家标准》与平台退换规则。`,
    faq: [
      {
        id: 'cs-team-faq-1',
        question: '和单个 AI 客服有什么区别？',
        answer: '单个客服负责应答，客服提效团增加了知识溯源与工单复盘环节，让应答有依据、服务可优化，形成闭环。',
      },
      {
        id: 'cs-team-faq-2',
        question: '复杂投诉能处理吗？',
        answer: '能识别高情绪与争议工单，标准流程之外会自动升级标注，提示转入人工深度处理。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥599',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥799',
        period: '一次性',
        description: '高频客服团队，更多调用',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '批量工单处理', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,499',
        period: '一次性',
        description: '企业级用量与平台接入',
        features: ['三位专家协作流程', '不限次数调用', '客服平台接入', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'recruiting-team',
    name: '招聘流程团',
    industry: '人力',
    tagline: 'JD 到 offer，招聘链路全程接力',
    description:
      '将招聘拆解为「定需求 → 写 JD → 筛简历 → 出评估」四个环节，由招聘 HR 把关标准、内容运营打磨 JD 与雇主品牌、数据分析量化筛选，一支 AI 团队协作完成从岗位分析到候选人评估的招聘链路。',
    icon: 'UserPlus',
    badge: '串行协作',
    price: '¥799',
    highlights: [
      '招聘 HR 把控岗位画像与硬性门槛',
      '内容运营打磨 JD，岗位自带吸引力',
      '数据分析并行量化筛选与漏斗复盘',
      '总指挥汇总成候选人评估报告与决策建议',
    ],
    scenarios: [
      '急招核心岗位，需要专业 JD 与快速筛选',
      '简历量大，一个人筛不过来',
      '想复盘招聘漏斗，优化渠道与流程',
    ],
    members: [
      {
        skillSlug: 'ai-hr-recruiter',
        role: '总指挥',
        responsibility: '分析岗位需求、制定评估标准、汇总候选人报告',
      },
      {
        skillSlug: 'ai-content-ops',
        role: '内容专家',
        responsibility: '打磨 JD 与雇主品牌文案',
      },
      {
        skillSlug: 'ai-data-analyst',
        role: '数据专家',
        responsibility: '量化简历匹配度与招聘漏斗',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-hr-recruiter',
        mode: 'plan',
        title: '分析岗位，制定画像',
        description: '拆解岗位职责与任职要求，形成岗位画像与硬性筛选标准。',
        input: '岗位需求 + 团队情况',
        output: '岗位画像（门槛 / 加分项）',
        snapshot: '岗位画像：5 年+ SaaS 销售为硬门槛，2 年+ 带团队为强加分，行业客户资源为差异项。',
        duration: '约 25s',
      },
      {
        step: 2,
        role: '内容专家',
        skillSlug: 'ai-content-ops',
        mode: 'sequential',
        title: '打磨 JD 与雇主品牌',
        description: '基于岗位画像产出专业 JD 与卖点文案，提升岗位吸引力。',
        input: '岗位画像',
        output: 'JD 初稿 + 雇主卖点',
        snapshot: 'JD 成稿：职责 6 条 + 3 个雇主卖点（扩张期晋升快 / 头部客户资源 / 弹性办公）。',
        duration: '约 30s',
      },
      {
        step: 3,
        role: '数据专家',
        skillSlug: 'ai-data-analyst',
        mode: 'parallel',
        title: '量化筛选与漏斗',
        description: '按硬性标准给候选人匹配度打分，复盘各渠道漏斗转化。',
        input: '岗位画像 + 简历',
        output: '匹配度排序 + 漏斗复盘',
        snapshot: '120 份简历打分：Top5 均过门槛，最佳候选人匹配度 92%；Boss 直聘渠道转化最佳。',
        duration: '约 30s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-hr-recruiter',
        mode: 'merge',
        title: '汇总候选人评估',
        description: '合并 JD、匹配度与漏斗结论，产出候选人评估报告与招聘建议。',
        input: 'JD + 匹配度 + 漏斗',
        output: '候选人评估报告',
        snapshot: '已输出候选人评估报告：Top1 建议优先面试并提前对齐薪资预期，附面试题与背调清单。',
        duration: '约 25s',
      },
    ],
    inputFields: [
      {
        key: 'jobRequirement',
        label: '岗位需求',
        type: 'textarea',
        placeholder: '描述岗位职责、任职要求、薪资范围、团队情况…',
        required: true,
      },
      {
        key: 'resumes',
        label: '简历内容（可选）',
        type: 'textarea',
        placeholder: '粘贴候选人简历关键信息，可多份…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全链路招聘', 'JD 与品牌优先', '筛选评估优先'],
      },
    ],
    sampleTask: '招聘「B 端销售经理」，base 上海，薪资 25-35K，需 5 年+ SaaS 销售与团队管理经验。已收 120 份简历，需快速筛选出 5 名候选人进入面试并输出评估报告。',
    sampleDeliverable: `# 候选人评估报告 · B 端销售经理

> kpi: 简历总数: 120 份 | 通过初筛: 12 人 | 进入面试: 5 人 | Top1 匹配度: 92%

## 一、岗位画像与筛选标准

| 维度 | 硬性门槛 | 权重 |
| --- | --- | --- |
| 销售经验 | 5 年+ B 端 SaaS | 40% |
| 团队管理 | 2 年+ 带团队 | 25% |
| 行业资源 | 制造业 / 软件行业客户 | 20% |
| 综合 | 本科 + 沟通表达 | 15% |

## 二、Top 5 候选人排名

| 排名 | 候选人 | 匹配度 | 亮点 | 风险 |
| --- | --- | --- | --- | --- |
| 1 | A | 92% | 7 年 SaaS + 8 人团队 + 超额达成 | 竞业协议需核验 |
| 2 | B | 81% | 行业资源丰富 | 管理经验不足 |
| 3 | C | 74% | 方法论完整 | 跳槽频繁 |
| 4 | D | 68% | 大团队管理 | 打法传统 |
| 5 | E | 62% | 学习能力强 | 无销售经验 |

## 三、渠道漏斗复盘

| 渠道 | 简历数 | 有效率 | 结论 |
| --- | --- | --- | --- |
| Boss 直聘 | 55 | 38% | 最佳，建议加预算 |
| 猎头 | 20 | 25% | 中高端补充 |
| 内推 | 15 | 47% | 质量最高，可激励 |

## 四、面试与背调清单（Top1）

- [ ] 带团队风格与下属培养案例深挖
- [ ] 竞业协议书面确认
- [ ] 薪资预期 25-35K 提前对齐
- [ ] 上家 2 位直属上级背调

## 风险分级清单

- [高] Top1 竞业风险 → 入职前完成承诺核验
- [中] 若 A 谈崩，B 需补管理能力测试
- [低] 其他候选人暂无高潜 → 延长窗口 1 周

> 依据：打分基于岗位硬性条件与明确评分维度，全部附打分理由供招聘负责人复核。`,
    faq: [
      {
        id: 'recruit-team-faq-1',
        question: '能处理大批量简历吗？',
        answer: '能。把简历批量粘贴即可统一打分排序，Pro 版支持更大批量与导出。',
      },
      {
        id: 'recruit-team-faq-2',
        question: 'JD 文案和筛选能分开用吗？',
        answer: '可以。内容专家只输出 JD，数据专家只做筛选，按需取用，团队协作只是让链路更完整。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥599',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥799',
        period: '一次性',
        description: '高频招聘团队，更多调用',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '批量简历处理', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,499',
        period: '一次性',
        description: '企业级用量与岗位库',
        features: ['三位专家协作流程', '不限次数调用', '岗位库管理', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'legal-compliance-team',
    name: '法务合规团',
    industry: '法务',
    tagline: '合同 + 法务 + 数据，合规风险一次看清',
    description:
      '将法务合规拆解为「定框架 → 审合同 → 量风险」三个环节，由法务顾问梳理风险框架、合同审查逐条扫条款、数据分析量化风险等级，一支 AI 团队协作完成从合同审查到合规报告的闭环。',
    icon: 'Gavel',
    badge: '混合协作',
    price: '¥899',
    highlights: [
      '法务顾问制定风险审查框架与应对策略',
      '合同审查并行逐条扫描，一票否决项不遗漏',
      '数据分析并行量化风险等级，轻重缓急分明',
      '总指挥汇总成一份可直接执行的合规报告',
    ],
    scenarios: [
      '签合同前要全面过一遍风险，一个人看不全',
      '收到对方模板合同，想逐条审查并给修改建议',
      '多份合同待审，要并行处理并排风险优先级',
    ],
    members: [
      {
        skillSlug: 'ai-legal-counsel',
        role: '总指挥',
        responsibility: '梳理风险框架、制定审查重点、汇总合规报告',
      },
      {
        skillSlug: 'ai-contract-review',
        role: '合同专家',
        responsibility: '并行逐条审查合同条款与违约责任',
      },
      {
        skillSlug: 'ai-data-analyst',
        role: '数据专家',
        responsibility: '并行量化风险等级与赔付敞口',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-legal-counsel',
        mode: 'plan',
        title: '梳理风险，制定框架',
        description: '识别合同类型与高风险条款，制定审查框架与分工。',
        input: '合同原文 + 背景',
        output: '审查框架（重点 / 分工）',
        snapshot: '审查框架：聚焦付款、验收、违约金、争议解决 4 组高风险条款，合同专家+数据专家并行。',
        duration: '约 30s',
      },
      {
        step: 2,
        role: '合同专家',
        skillSlug: 'ai-contract-review',
        mode: 'parallel',
        title: '并行逐条审查条款',
        description: '逐条扫描付款、验收、违约金、争议解决等关键条款。',
        input: '审查框架 + 合同原文',
        output: '风险条款清单（含修改建议）',
        snapshot: '条款审查 12 条：3 项高风险（验收单方化 / 违约金 50% / 管辖不利），2 项中风险。',
        duration: '约 30s',
      },
      {
        step: 3,
        role: '数据专家',
        skillSlug: 'ai-data-analyst',
        mode: 'parallel',
        title: '并行量化风险敞口',
        description: '估算违约金、付款周期与争议成本，量化风险等级。',
        input: '审查框架 + 合同金额',
        output: '风险量化（等级 / 敞口）',
        snapshot: '风险量化：验收拖延占用尾款 15 万 + 违约金敞口 25 万，合计约 25 万风险敞口。',
        duration: '约 25s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-legal-counsel',
        mode: 'merge',
        title: '汇总交付合规报告',
        description: '合并条款审查与量化结论，产出合规审查报告与谈判策略。',
        input: '条款清单 + 风险量化',
        output: '合规审查报告',
        snapshot: '已输出合规审查报告：修改建议 + 谈判优先级（验收 > 违约金 > 管辖），严禁原样签署。',
        duration: '约 30s',
      },
    ],
    inputFields: [
      {
        key: 'contractContent',
        label: '合同原文',
        type: 'textarea',
        placeholder: '粘贴合同条款原文（付款、验收、违约、争议解决等）…',
        required: true,
      },
      {
        key: 'background',
        label: '背景补充（可选）',
        type: 'textarea',
        placeholder: '补充双方关系、合同金额、行业等背景…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全链路审查', '条款审查优先', '风险量化优先'],
      },
    ],
    sampleTask: '技术服务合同，金额 50 万：预付款 30%、验收后 40%、尾款 30%；「验收合格以甲方书面确认为准」；违约金为合同总额 50%；争议解决约定在甲方所在地法院。我方为乙方。',
    sampleDeliverable: `# 合规审查报告 · 技术服务合同

> kpi: 审查条款: 12 条 | 高风险: 3 项 | 中风险: 2 项 | 风险敞口: 约 25 万

## 一、合同关键信息

| 维度 | 内容 |
| --- | --- |
| 合同金额 | 50 万（预付 30% / 验收 40% / 尾款 30%） |
| 我方角色 | 乙方（服务提供方） |
| 审查范围 | 付款、验收、违约金、争议解决等 12 条 |

## 二、高风险条款与修改建议

| # | 条款要点 | 风险说明 | 修改建议 |
| --- | --- | --- | --- |
| 1 | 验收以甲方书面确认为准 | 验收无限期拖延，尾款 15 万被占用 | 交付后 10 个工作日内验收，超期视为合格 |
| 2 | 违约金 50% | 超司法保护范围 | 下调至 30% 以下并设上限 |
| 3 | 甲方所在地管辖 | 我方维权成本高 | 约定乙方所在地或仲裁 |

## 三、风险量化

| 风险 | 敞口估算 |
| --- | --- |
| 尾款长期占用 | 15 万 |
| 违约金风险 | 25 万（上限） |
| 维权成本 | 异地诉讼差旅 + 时间 |

## 四、谈判策略

- [ ] 优先级：验收条款 > 违约金 > 管辖条款
- [ ] 底线：验收期限必须争取到
- [ ] 让步空间：违约金可谈至 20%，管辖可接受共同仲裁地

## 风险分级清单

- [高] 验收条款不改，尾款回收不可控
- [高] 违约金过高可能被认定无效
- [中] 管辖约定增加维权成本
- [低] 其余条款可控，维持现状

> 依据：参考《民法典》合同编与常见司法裁判口径；重大交易请咨询执业律师复核。`,
    faq: [
      {
        id: 'legal-team-faq-1',
        question: '审查意见专业吗？',
        answer: '意见按「条款原文 → 风险等级 → 法律依据 → 修改建议」结构输出，标注依据与实务参考，重大事项提醒咨询执业律师。',
      },
      {
        id: 'legal-team-faq-2',
        question: '能批量审多份合同吗？',
        answer: '可以。多份合同并行审查并统一按风险等级排序，优先处理高风险合同。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥699',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥899',
        period: '一次性',
        description: '高频法务团队，更多调用',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '批量合同审查', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,499',
        period: '一次性',
        description: '企业级用量与合同库',
        features: ['三位专家协作流程', '不限次数调用', '合同模板库', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'dev-delivery-team',
    name: '研发交付团',
    industry: '研发',
    tagline: '需求到交付，研发链路全流程接力',
    description:
      '将研发交付拆解为「转 PRD → 写代码 → 验数据」三个环节，由产品经理把关需求、编程助手实现代码、数据分析验证效果，一支 AI 团队协作完成从需求到可交付方案的研发链路。',
    icon: 'Code',
    badge: '串行协作',
    price: '¥899',
    highlights: [
      '产品经理把关需求，先想清楚再做',
      '编程助手按 PRD 产出可运行代码',
      '数据分析并行验证与测试，质量有依据',
      '总指挥汇总成交付文档，可直接进入联调',
    ],
    scenarios: [
      '需求评审过了，要快速出可运行原型',
      '功能开发完，要代码与数据双验证',
      '小团队人力不足，一个人要顶一个研发组',
    ],
    members: [
      {
        skillSlug: 'ai-product-manager',
        role: '总指挥',
        responsibility: '需求转 PRD、把控范围、汇总交付文档',
      },
      {
        skillSlug: 'ai-coding-assistant',
        role: '开发专家',
        responsibility: '按 PRD 生成与完善代码实现',
      },
      {
        skillSlug: 'ai-data-analyst',
        role: '验证专家',
        responsibility: '分析验证结果与数据，辅助测试评估',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-product-manager',
        mode: 'plan',
        title: '需求转 PRD，拆解任务',
        description: '梳理需求背景与功能点，形成 PRD 与开发任务清单。',
        input: '需求 + 竞品参考',
        output: 'PRD + 任务清单',
        snapshot: 'PRD v0.1 定稿：提前 7 天触发、邮件+站内信双渠道、客户级别去重，验收标准 6 条。',
        duration: '约 35s',
      },
      {
        step: 2,
        role: '开发专家',
        skillSlug: 'ai-coding-assistant',
        mode: 'sequential',
        title: '按 PRD 实现代码',
        description: '按任务清单产出核心功能代码与关键实现说明。',
        input: 'PRD + 任务清单',
        output: '功能代码 + 实现说明',
        snapshot: 'Go 定时任务扫描 + 双渠道通知代码完成，附核心实现说明与 SQL 迁移脚本。',
        duration: '约 40s',
      },
      {
        step: 3,
        role: '验证专家',
        skillSlug: 'ai-data-analyst',
        mode: 'parallel',
        title: '并行验证与测试',
        description: '构造用例验证功能与数据逻辑，输出验证结论与修复建议。',
        input: '功能代码 + PRD',
        output: '验证报告 + 修复建议',
        snapshot: '验证 3 组用例（7 天内 / 当天 / 已过期）全部通过，去重逻辑无重复通知。',
        duration: '约 30s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-product-manager',
        mode: 'merge',
        title: '汇总交付文档',
        description: '合并代码与验证结论，产出交付文档与下一轮迭代建议。',
        input: '功能代码 + 验证报告',
        output: '交付文档（含联调说明）',
        snapshot: '已输出交付文档：API 契约 + 部署说明 + 下一轮迭代建议（提醒频率可配置化）。',
        duration: '约 30s',
      },
    ],
    inputFields: [
      {
        key: 'requirement',
        label: '需求描述',
        type: 'textarea',
        placeholder: '描述要开发的功能、目标用户、验收标准、技术栈…',
        required: true,
      },
      {
        key: 'codeContext',
        label: '代码上下文（可选）',
        type: 'textarea',
        placeholder: '粘贴已有代码、接口文档、配置等…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全链路交付', 'PRD 优先', '代码实现优先'],
      },
    ],
    sampleTask: '开发一个「客户到期提醒」功能：CRM 中即将到期客户需提前 7 天提醒销售，支持邮件与站内信，技术栈 React + Go + PostgreSQL。',
    sampleDeliverable: `# 研发交付文档 · 客户到期提醒功能

> kpi: 功能点: 4 个 | 用例通过: 3/3 | 提醒渠道: 2 种 | 代码量: 210 行

## 一、PRD 摘要

| 维度 | 内容 |
| --- | --- |
| 触发规则 | 到期前 7 天每天 9:00 扫描 |
| 通知渠道 | 邮件 + 站内信双渠道 |
| 去重策略 | 客户级别，同一客户 7 天内仅提醒一次 |
| 目标用户 | 销售 / 销售主管 |

## 二、交付代码（核心逻辑）

\`\`\`go
// 每日扫描即将到期客户并触发双渠道提醒
func RunExpiryScan(ctx context.Context) error {
    due := time.Now().AddDate(0, 0, 7)
    customers, err := repo.FindExpiring(ctx, due)
    if err != nil {
        return err
    }
    for _, c := range customers {
        if err := notify.Send(ctx, c); err != nil {
            log.Err(err).Str("cust", c.ID).Msg("notify failed")
        }
    }
    return nil
}
\`\`\`

## 三、验证结论

| 用例 | 场景 | 结果 |
| --- | --- | --- |
| 用例 1 | 7 天内到期 → 双渠道提醒 | ✅ 通过 |
| 用例 2 | 当天到期 → 立即提醒 | ✅ 通过 |
| 用例 3 | 已过期 → 不再提醒 | ✅ 通过 |
| 去重 | 同客户 7 天内多次扫描 | ✅ 仅 1 次 |

## 四、交付清单

- [ ] API 契约：POST /api/v1/expiry/scan
- [ ] SQL 迁移：expiry_reminder_log 表 + 索引
- [ ] 部署：Cron 定时任务 + 邮件/站内信配置

## 风险与注意

- [中] 邮件服务商限流 → 分批发送（每批 200 封）
- [低] 时区差异 → 使用 Asia/Shanghai 固定时区

> 依据：按 PRD 验收标准逐项验证通过；代码为可直接运行的参考实现，请按项目规范复核后上线。`,
    faq: [
      {
        id: 'dev-team-faq-1',
        question: '生成代码能直接上线吗？',
        answer: '交付的是可运行的参考实现与联调说明，建议按团队规范 Review 与自测后合并上线，复杂业务仍需人工把关。',
      },
      {
        id: 'dev-team-faq-2',
        question: '适合大项目吗？',
        answer: '适合 MVP、中小功能与小团队提效；大型项目可作为辅助，帮助快速出 PRD、原型与验证方案。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥699',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥899',
        period: '一次性',
        description: '高频研发团队，更多调用',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '批量任务处理', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,499',
        period: '一次性',
        description: '企业级用量与代码规范',
        features: ['三位专家协作流程', '不限次数调用', '代码规范接入', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'export-growth-team',
    name: '出海增长团',
    industry: '外贸',
    tagline: '询盘到成交，外贸增长全程接力',
    description:
      '将外贸出海拆解为「析询盘 → 快跟进 → 出内容」三个环节，由外贸销售制定跟进策略、客服快速响应、营销文案产出开发信与社媒内容，一支 AI 团队协作完成从询盘分析到成交方案的外贸增长链路。',
    icon: 'Ship',
    badge: '混合协作',
    price: '¥899',
    highlights: [
      '外贸销售拆解询盘，制定跟进作战策略',
      '客服专家快速响应，夜间询盘不流失',
      '营销文案并行产出开发信与社媒内容',
      '总指挥汇总成一份可执行的外贸成交方案',
    ],
    scenarios: [
      '询盘多但转化低，跟进跟不上',
      '海外客户有时差，回复慢丢单',
      '出海缺内容，开发信与社媒发不起来',
    ],
    members: [
      {
        skillSlug: 'ai-trade-sales',
        role: '总指挥',
        responsibility: '分析询盘、制定跟进策略、汇总成交方案',
      },
      {
        skillSlug: 'ai-customer-service',
        role: '客服专家',
        responsibility: '快速响应客户咨询，多语言无障碍',
      },
      {
        skillSlug: 'ai-marketing-copy',
        role: '内容专家',
        responsibility: '产出开发信与社媒营销内容',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-trade-sales',
        mode: 'plan',
        title: '分析询盘，制定策略',
        description: '判断询盘质量与客户意图，制定跟进优先级与分工。',
        input: '询盘内容 + 客户背景',
        output: '跟进策略（优先级 / 分工）',
        snapshot: '询盘评级 A 级：数量明确 + 认证要求，判定高意向；按德国时区排首轮回复时间为本地 9:00。',
        duration: '约 30s',
      },
      {
        step: 2,
        role: '客服专家',
        skillSlug: 'ai-customer-service',
        mode: 'parallel',
        title: '并行快速响应客户',
        description: '针对客户提问给出即时应答，消除疑虑推进转化。',
        input: '跟进策略 + 客户消息',
        output: '即时应答（多语言）',
        snapshot: '即时应答（德语）：确认报价单已备、CE 认证可提供、MOQ 可谈，24h 内正式报价。',
        duration: '约 20s',
      },
      {
        step: 3,
        role: '内容专家',
        skillSlug: 'ai-marketing-copy',
        mode: 'parallel',
        title: '并行产出营销内容',
        description: '按策略产出开发信、报价跟进与社媒内容。',
        input: '跟进策略 + 产品卖点',
        output: '开发信 + 营销文案',
        snapshot: '开发信要点：报价区间 + 交期承诺 + 2 个同类 OEM 案例 + 产线产能证明。',
        duration: '约 25s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-trade-sales',
        mode: 'merge',
        title: '汇总交付成交方案',
        description: '合并应答与内容成果，产出外贸成交作战方案。',
        input: '即时应答 + 营销文案',
        output: '外贸成交作战方案',
        snapshot: '已输出外贸成交方案：48h 跟进节奏 + 45 天交期风险预案 + 首单预付款保障。',
        duration: '约 30s',
      },
    ],
    inputFields: [
      {
        key: 'inquiry',
        label: '询盘内容',
        type: 'textarea',
        placeholder: '粘贴客户询盘原文（产品、数量、地区、时差、关注点）…',
        required: true,
      },
      {
        key: 'productInfo',
        label: '产品与报价信息（可选）',
        type: 'textarea',
        placeholder: '描述产品卖点、报价、MOQ、认证等…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全链路成交', '跟进策略优先', '营销内容优先'],
      },
    ],
    sampleTask: '收到德国客户询盘：询问 5,000 个「太阳能充电宝」OEM 报价，要求 CE 认证与 45 天交期，客户所在时区比中国晚 6 小时，首次合作。',
    sampleDeliverable: `# 外贸成交作战方案 · 太阳能充电宝 OEM

> kpi: 询盘评级: A 级 | 首轮回复: 24h 内 | 交期: 45 天（留 5 天缓冲） | 首单保障: 30% 预付

## 一、询盘质量判定

| 维度 | 信号 | 评级 |
| --- | --- | --- |
| 数量明确 | 5,000 个 OEM | A 级 |
| 认证要求 | CE 认证 | 高意向 |
| 交期要求 | 45 天 | 明确 |
| 首次合作 | 信任待建立 | 需增信 |

## 二、跟进节奏（按德国时区）

- [ ] 24h 内：德语确认函 + 参数表（本地 9:00 发送）
- [ ] 48h 内：正式报价 + CE 证书扫描件 + 产线产能证明
- [ ] 第 5 天：2 个同类 OEM 案例 + 线上技术会邀请
- [ ] 第 7 天：跟进决策链，同步打样计划

## 三、报价与成交设计

| 要素 | 设计 |
| --- | --- |
| 报价 | 分 3 档（5K / 10K / 20K），首单让利换案例 |
| 交期 | 承诺 45 天，内部排产按 40 天留缓冲 |
| 增信 | 视频验厂 / 样品空运 / 信用证或 30% 预付 |

## 四、风险预案

- [高] 45 天交期偏紧 → 提前锁定产线 + 书面约定延期罚则
- [中] 首次合作信任 → 提供验厂直播或第三方质检报告
- [低] 汇率波动 → 报价锁定 30 天有效期

## 风险分级清单

- [高] 交期若违约将损害首单信任
- [中] 客户观望期长 → 用打样进度保持温度
- [低] 认证翻译文件需提前备齐德语版

> 依据：跟进节奏基于外贸成交漏斗经验与德国客户商务习惯；报价为建议区间，请以成本核算为准。`,
    faq: [
      {
        id: 'export-team-faq-1',
        question: '能处理多语言询盘吗？',
        answer: '可以。客服专家支持多语言应答，开发信也可按客户地区语言习惯产出。',
      },
      {
        id: 'export-team-faq-2',
        question: '和外贸出海团有什么区别？',
        answer: '出海增长团在询盘跟进基础上增加了客服即时响应环节，更适合询盘量大、时差覆盖不足的团队。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥699',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥899',
        period: '一次性',
        description: '高频外贸团队，更多调用',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '批量询盘处理', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,499',
        period: '一次性',
        description: '企业级用量与多语言',
        features: ['三位专家协作流程', '不限次数调用', '多语言增强', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
  {
    slug: 'content-marketing-team',
    name: '内容营销团',
    industry: '营销',
    tagline: '内容 + 社媒 + 文案，营销链路全火力',
    description:
      '将内容营销拆解为「定规划 → 做选题 → 产文案」三个环节，由内容运营把控节奏、社媒运营挖掘选题、营销文案批量生产，一支 AI 团队协作完成从内容规划到发布运营的营销链路。',
    icon: 'Share2',
    badge: '并行协作',
    price: '¥799',
    highlights: [
      '内容运营制定全平台内容规划与节奏',
      '社媒运营并行挖掘爆款选题与互动点',
      '营销文案并行批量生产，标题多版可选',
      '总指挥汇总成发布排期与复盘机制',
    ],
    scenarios: [
      '账号内容断档，要快速补齐规划与排期',
      '要同时做公众号 / 小红书 / 短视频，人手不够',
      '内容生产慢，想批量出稿并保持质量',
    ],
    members: [
      {
        skillSlug: 'ai-content-ops',
        role: '总指挥',
        responsibility: '制定内容规划、把控选题节奏、汇总复盘',
      },
      {
        skillSlug: 'ai-social-media',
        role: '社媒专家',
        responsibility: '挖掘爆款选题、设计互动话术与排期',
      },
      {
        skillSlug: 'ai-marketing-copy',
        role: '文案专家',
        responsibility: '批量生产各平台营销文案',
      },
    ],
    flow: [
      {
        step: 1,
        role: '总指挥',
        skillSlug: 'ai-content-ops',
        mode: 'plan',
        title: '制定内容规划',
        description: '明确目标人群与平台定位，制定内容方向与生产节奏。',
        input: '业务目标 + 人群',
        output: '内容规划（方向 / 节奏）',
        snapshot: '内容规划：公众号深度（周更 1 篇）+ 小红书种草（日更 1 条），聚焦 AI 办公主题与高管人群。',
        duration: '约 30s',
      },
      {
        step: 2,
        role: '社媒专家',
        skillSlug: 'ai-social-media',
        mode: 'parallel',
        title: '并行挖掘选题排期',
        description: '按平台产出 7 天选题排期、标题与互动话术。',
        input: '内容规划 + 平台信息',
        output: '选题排期 + 互动话术',
        snapshot: '8 篇选题定稿（AI 办公实战 / 效率工具测评 / 高管视角三类），标题各 3 版 + 互动话术。',
        duration: '约 25s',
      },
      {
        step: 3,
        role: '文案专家',
        skillSlug: 'ai-marketing-copy',
        mode: 'parallel',
        title: '并行批量生产文案',
        description: '按选题排期批量产出各平台正文与多版标题。',
        input: '选题排期 + 内容规划',
        output: '文案成稿（多平台）',
        snapshot: '文案成稿 8 篇 + 首图 3 套模板，评论区引导话术与私信钩子配置完成。',
        duration: '约 25s',
      },
      {
        step: 4,
        role: '总指挥',
        skillSlug: 'ai-content-ops',
        mode: 'merge',
        title: '汇总发布与复盘',
        description: '合并选题与文案，产出发布排期表与数据复盘机制。',
        input: '选题排期 + 文案成稿',
        output: '发布排期 + 复盘机制',
        snapshot: '已输出发布排期表 + 周度复盘机制：阅读/互动归因，低效选题淘汰，爆款追投。',
        duration: '约 30s',
      },
    ],
    inputFields: [
      {
        key: 'goal',
        label: '营销目标与人群',
        type: 'textarea',
        placeholder: '描述业务目标、目标人群、运营平台（如：公众号涨粉 + 小红书种草）…',
        required: true,
      },
      {
        key: 'material',
        label: '素材与卖点（可选）',
        type: 'textarea',
        placeholder: '粘贴产品卖点、资料、近期数据等…',
        required: false,
      },
      {
        key: 'focus',
        label: '关注重点',
        type: 'select',
        placeholder: '请选择',
        required: false,
        options: ['全链路营销', '选题排期优先', '文案生产优先'],
      },
    ],
    sampleTask: 'B 端 SaaS 公司，公众号 + 小红书双平台，目标人群为企业高管，本月需 8 篇内容（公众号 4 篇深度 + 小红书 4 条种草），提升「AI 办公」主题的互动率。',
    sampleDeliverable: `# 内容营销执行方案 · AI 办公专题

> kpi: 内容篇数: 8 篇 | 平台: 2 个 | 目标互动率: 6%+ | 复盘频次: 周度

## 一、平台定位与节奏

| 平台 | 定位 | 篇数 | 形态 |
| --- | --- | --- | --- |
| 公众号 | 行业深度 | 4 篇 | 长文 + 高管视角 |
| 小红书 | 场景种草 | 4 条 | 图文 + 清单 |

## 二、选题与标题

| # | 选题 | 平台 | 标题方向 |
| --- | --- | --- | --- |
| 1 | AI 写周报实战 | 公众号 | 高管周报的 3 层结构 |
| 2 | 效率工具测评 | 小红书 | 打工人实测 5 款 |
| 3 | 行业案例拆解 | 公众号 | 同行用 AI 提效 40% |
| 4 | AI 会议纪要 | 小红书 | 会议 10 分钟变纪要 |

## 三、互动与转化机制

- [ ] 每篇评论区置顶引导话术 + 私信资料钩子
- [ ] 公众号文末 CTA 引导添加顾问
- [ ] 爆款（互动率 > 8%）24h 内追加合集系列

## 四、发布排期与复盘

| 周 | 公众号 | 小红书 | 复盘动作 |
| --- | --- | --- | --- |
| W1 | 2 篇 | 2 条 | 首轮数据归因 |
| W2 | 2 篇 | 2 条 | 淘汰低效选题 |

## 风险分级清单

- [中] 高管人群触达难度高 → 结合行业社群分发
- [低] 内容同质化 → 用真实案例数据差异化

> 依据：选题源自账号历史爆款与同类头部账号拆解；指标基于当前账号体量设定。`,
    faq: [
      {
        id: 'content-mkt-team-faq-1',
        question: '和内容增长团有什么区别？',
        answer: '内容增长团偏全案增长（含数据复盘），内容营销团侧重营销火力——规划 + 选题 + 文案生产一体化，适合内容产能不足的团队。',
      },
      {
        id: 'content-mkt-team-faq-2',
        question: '能直接发到平台吗？',
        answer: '文案按平台调性产出成稿与多版标题，配图建议也包含在内，稍作排版即可发布。',
      },
    ],
    status: 'online',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '¥599',
        period: '一次性',
        description: '标准协作流程，含 3 位专家全部能力',
        features: ['三位专家协作流程', '每专家 50 次/月调用', '标准输出模板', '邮件支持'],
        cta: '立即购买',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '¥799',
        period: '一次性',
        description: '高频营销团队，更多调用',
        features: ['三位专家协作流程', '每专家 200 次/月调用', '批量生产模式', '优先支持'],
        cta: '立即购买',
        isPopular: true,
      },
      {
        id: 'business',
        name: 'Business',
        price: '¥1,499',
        period: '一次性',
        description: '企业级用量与多账号',
        features: ['三位专家协作流程', '不限次数调用', '多账号管理', '专属支持经理'],
        cta: '联系顾问',
      },
    ],
  },
]

export const getTeamBySlug = (slug: string) => expertTeams.find((t) => t.slug === slug)
