import type { DocSection } from '@/types/docs'

/**
 * 能力商城章节：Skill · 专家 · 专家团
 * 数据与 portal/src/data/skills.ts、expertTeams.ts 保持一致
 */
const marketplaceSection: DocSection = {
  id: 'marketplace',
  title: '能力商城 · Skill 与专家团',
  icon: 'Store',
  group: 'business',
  children: [
    {
      id: 'marketplace-overview',
      title: '能力商城总览',
      content: `
<h2>能力商城是什么</h2>
<p>能力商城（<a href="/skills">Skill · 专家 · 专家团</a>）是 Nova AI Gateway 面向企业业务场景的<strong>AI 能力货架</strong>：把资深专家的经验封装成可直接使用的 AI 技能，按需购买、即买即用，无需写代码、无需自己接模型。</p>

<h2>三类能力形态</h2>
<table>
  <thead>
    <tr><th>形态</th><th>是什么</th><th>适合谁</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Skill · 技能专家</strong></td><td>单点业务能力，一位 AI 专家完成一项专业任务（投标分析、合同审查、数据分析等）</td><td>有明确单点任务、想快速验证效果的团队</td></tr>
    <tr><td><strong>专家团</strong></td><td>多位 AI 专家按协作流程接力完成任务，从需求拆解到成果交付全流程闭环</td><td>需要多人协作、全链路交付的业务场景</td></tr>
    <tr><td><strong>解决方案</strong></td><td>面向行业的整套 AI 基础设施 + Agent 工作流，覆盖某一行业的核心业务链路</td><td>高校、工程、内容等行业客户</td></tr>
  </tbody>
</table>

<h2>如何使用</h2>
<ol>
  <li>进入<a href="/skills">能力商城</a>，按行业分类或搜索找到所需能力。</li>
  <li>点击卡片进入详情页，查看交付成果预览与使用流程。</li>
  <li>点击「使用」进入交互页，填写任务信息，AI 即开始工作并交付成果。</li>
</ol>

<h2>当前已上线</h2>
<ul>
  <li>Skill · 技能专家：19 个，覆盖投标、外贸、合同、内容、数据、营销、财务、客服、电商、人力、法务、研发等 12+ 行业。</li>
  <li>专家团：11 支，覆盖投标、外贸、内容增长、电商、经营决策、客服、招聘、法务合规、研发交付等场景。</li>
</ul>

<h2>与 API 网关的关系</h2>
<p>能力商城构建在 API 网关之上：商城内的每个 Skill / 专家团，底层都通过统一网关调用主流大模型（GPT / Claude / DeepSeek / 通义等），由平台统一管理模型路由、额度与成本。企业接入 API 网关后可获得全部模型能力，能力商城则进一步将能力「业务化」。</p>
`,
    },
    {
      id: 'marketplace-skill-guide',
      title: 'Skill 使用指南',
      content: `
<h2>什么是 Skill</h2>
<p>Skill 是封装了某类专业岗位经验的 AI 技能专家。每个 Skill 都有明确的输入表单、执行流程与交付成果，开箱即用。</p>

<h2>三步完成一次任务</h2>
<ol>
  <li><strong>进入使用页</strong>：在能力商城点击 Skill 卡片进入详情页，再点击「使用」。</li>
  <li><strong>填写任务信息</strong>：按表单提示粘贴业务材料（如招标文件、合同文本、销售数据），可选择关注重点。</li>
  <li><strong>查看交付成果</strong>：AI 按专家流程执行，输出结构化成果包，可直接用于业务。</li>
</ol>

<h2>交付成果结构</h2>
<p>每个 Skill 的交付物都是一份「成果包」，包含以下要素：</p>
<ul>
  <li><strong>执行摘要</strong>：一句话概括核心结论与建议。</li>
  <li><strong>KPI 指标卡</strong>：关键数据一目了然（预测值、缺口、健康度等）。</li>
  <li><strong>明细表</strong>：逐条明细支撑结论，可核对、可追溯。</li>
  <li><strong>风险分级清单</strong>：高 / 中 / 低三级风险，先处理一票否决项。</li>
  <li><strong>行动清单</strong>：可勾选的下步动作，完成一项勾一项。</li>
</ul>

<h2>Skill 一览（19 个）</h2>
<table>
  <thead>
    <tr><th>行业</th><th>Skill</th><th>一句话定位</th></tr>
  </thead>
  <tbody>
    <tr><td>投标</td><td>AI 投标经理</td><td>看得懂标 · 过得了审 · 拿得下分</td></tr>
    <tr><td>外贸</td><td>AI 外贸销售</td><td>开发信 · 询盘跟进 · 报价谈判一站式</td></tr>
    <tr><td>合同</td><td>AI 合同审查</td><td>合同风险一眼看穿</td></tr>
    <tr><td>内容</td><td>AI 内容运营</td><td>爆款选题 · 内容生成 · 回复成交闭环</td></tr>
    <tr><td>数据</td><td>AI 数据分析</td><td>数据清洗 · 统计分析 · 可视化报告</td></tr>
    <tr><td>营销</td><td>AI 营销文案</td><td>广告语 · 详情页 · 朋友圈文案一站式</td></tr>
    <tr><td>财务</td><td>AI 财务分析</td><td>看懂报表 · 找出问题 · 给出建议</td></tr>
    <tr><td>企业服务</td><td>AI 知识库助手</td><td>企业知识 · 即问即答 · 有据可查</td></tr>
    <tr><td>企业服务</td><td>AI 采购管理</td><td>询价比价 · 供应商评估 · 采购合规</td></tr>
    <tr><td>电商</td><td>AI 跨境电商运营</td><td>选品 · 优化 · 投放一站式</td></tr>
    <tr><td>客服</td><td>AI 客服</td><td>秒回客户 · 口径统一 · 工单不丢</td></tr>
    <tr><td>企业服务</td><td>AI 供应链管理</td><td>库存预测 · 交期管控 · 断供预警</td></tr>
    <tr><td>人力</td><td>AI 招聘 HR</td><td>写 JD · 筛简历 · 面试评估</td></tr>
    <tr><td>电商</td><td>AI 电商运营</td><td>店铺诊断 · 活动策划 · 转化优化</td></tr>
    <tr><td>法务</td><td>AI 法务顾问</td><td>风险前置 · 条款解读 · 维权指引</td></tr>
    <tr><td>研发</td><td>AI 产品经理</td><td>需求分析 · PRD 生成 · 竞品洞察</td></tr>
    <tr><td>研发</td><td>AI 编程助手</td><td>写代码 · 查问题 · 出方案</td></tr>
    <tr><td>内容</td><td>AI 视频脚本</td><td>选题 · 脚本 · 分镜一步到位</td></tr>
    <tr><td>营销</td><td>AI 社媒运营</td><td>选题 · 发帖 · 互动运营</td></tr>
  </tbody>
</table>

<h2>案例：AI 投标经理</h2>
<p>以「AI 投标经理」为例，完整演示一次任务：</p>
<ol>
  <li><strong>填写输入</strong>：粘贴招标文件关键内容（项目概况、资格要求、评标办法），可选填写企业信息。</li>
  <li><strong>选择重点</strong>：可选「全面分析 / 废标风险 / 评分策略 / 技术标大纲 / 标书体检」。</li>
  <li><strong>交付成果</strong>：输出投标分析报告——资格核对、废标风险分级（红黄绿）、评分拆解与提分空间、作战建议。</li>
</ol>
`,
    },
    {
      id: 'marketplace-team-guide',
      title: '专家团使用指南',
      content: `
<h2>什么是专家团</h2>
<p>专家团是把多个 Skill 专家按业务协作流程编排成的一支 AI 团队：任务自动拆解、多专家并行作业、逐节点汇总，最终产出一份完整交付物。</p>

<h2>协作流程四种模式</h2>
<table>
  <thead>
    <tr><th>模式</th><th>含义</th><th>示例</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>拆解</strong>（plan）</td><td>把总任务拆成子任务并规划节奏</td><td>投标作战团第一步：拆解招标要求</td></tr>
    <tr><td><strong>并行</strong>（parallel）</td><td>多专家同时处理不同子任务</td><td>内容增长团：选题与素材并行</td></tr>
    <tr><td><strong>串行</strong>（sequential）</td><td>专家按顺序接力，后者依赖前者成果</td><td>外贸出海团：询盘 → 报价 → 营销</td></tr>
    <tr><td><strong>汇总</strong>（merge）</td><td>把各节点成果汇成最终交付物</td><td>经营决策团：财务 + 数据 + 知识汇总</td></tr>
  </tbody>
</table>

<h2>使用流程</h2>
<ol>
  <li>在能力商城选择专家团（Tab 切换至「专家团」），进入详情页。</li>
  <li>查看协作流程：每个节点展示负责专家、任务内容、输入与输出，节点完成后展示过程快照。</li>
  <li>点击「协作流程」启动，按流程逐步运行，最终在交付区查看汇总成果包。</li>
</ol>

<h2>专家团一览（11 支）</h2>
<table>
  <thead>
    <tr><th>团队</th><th>一句话定位</th></tr>
  </thead>
  <tbody>
    <tr><td>投标作战团</td><td>一个团队，从招标到投标全程接力</td></tr>
    <tr><td>外贸出海团</td><td>询盘 → 报价 → 营销，出海全链路一支团队搞定</td></tr>
    <tr><td>内容增长团</td><td>规划 → 生产 → 复盘，内容全链路滚动增长</td></tr>
    <tr><td>电商增长团</td><td>一个团队，从选品到爆单全程接力</td></tr>
    <tr><td>经营决策团</td><td>财务 + 数据 + 知识，一次看清经营全局</td></tr>
    <tr><td>客服提效团</td><td>秒回 + 溯源 + 复盘，服务闭环不脱节</td></tr>
    <tr><td>招聘流程团</td><td>JD 到 offer，招聘链路全程接力</td></tr>
    <tr><td>法务合规团</td><td>合同 + 法务 + 数据，合规风险一次看清</td></tr>
    <tr><td>研发交付团</td><td>需求到交付，研发链路全流程接力</td></tr>
    <tr><td>出海增长团</td><td>询盘到成交，外贸增长全程接力</td></tr>
    <tr><td>内容营销团</td><td>内容 + 社媒 + 文案，营销链路全火力</td></tr>
  </tbody>
</table>

<h2>Skill 与专家团怎么选</h2>
<table>
  <thead>
    <tr><th>对比项</th><th>Skill · 技能专家</th><th>专家团</th></tr>
  </thead>
  <tbody>
    <tr><td>任务类型</td><td>单点专业任务</td><td>多环节业务链路</td></tr>
    <tr><td>执行方式</td><td>一位专家一次完成</td><td>多专家接力协作</td></tr>
    <tr><td>交付物</td><td>单份成果包</td><td>过程快照 + 汇总成果包</td></tr>
    <tr><td>适用阶段</td><td>先验证、单点提效</td><td>全流程跑通、规模化复用</td></tr>
  </tbody>
</table>
`,
    },
    {
      id: 'marketplace-faq',
      title: '常见问题（业务侧）',
      content: `
<h2>数据安全吗？</h2>
<p>平台为即时转发架构，不持久保存 Prompt 与业务内容；调用仅记录元数据（模型、Token、费用、耗时），满足审计与合规需求。涉及敏感业务数据的企业，可选购私有化部署方案，数据不出企业内网。</p>

<h2>效果如何验证？</h2>
<p>每个 Skill / 专家团详情页均提供「成果预览 · Demo」：展示真实场景下的输入与结构化交付成果（KPI 指标卡、明细表、风险分级、行动清单），使用前即可判断是否符合预期。</p>

<h2>购买后如何使用？</h2>
<p>当前版本购买后即进入交互页直接使用，无需部署、无需开发。支付与订单系统将在后续版本上线，届时支持在线开通与团队共享。</p>

<h2>能定制自己的专家 / 专家团吗？</h2>
<p>可以。企业可按自身业务定制专属 AI 员工（学习企业资料与历史数据）或整套行业解决方案，具体请通过页面右下角「商务咨询」浮层或<a href="mailto:xncn@starnovation.cn">邮件联系</a>商务团队沟通。</p>

<h2>价格如何？</h2>
<p>能力商城按技能/团队即买即用；AI 员工按岗位定制；行业方案按企业规模报价；底层 API 按量计费。具体报价请联系商务团队获取。</p>
`,
    },
  ],
}

export default marketplaceSection
