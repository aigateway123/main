import type { DocSection } from '@/types/docs'

/**
 * 行业解决方案章节
 * 数据与 portal/src/data/solutions.ts 保持一致（仅收录 status: 'online' 的方案）
 */
const solutionsSection: DocSection = {
  id: 'solutions-doc',
  title: '行业解决方案',
  icon: 'Building2',
  group: 'business',
  children: [
    {
      id: 'solution-overview',
      title: '解决方案总览',
      content: `
<h2>什么是行业解决方案</h2>
<p>行业解决方案是面向特定行业客户的<strong>整套 AI 基础设施 + Agent 工作流</strong>：不止提供模型接入，更把行业的业务链路（文献调研、爆款生产、投标作战等）编排成可复用的 Agent 流程，让行业客户「开箱即用、用完见效」。</p>

<h2>与能力商城的关系</h2>
<table>
  <thead>
    <tr><th>层级</th><th>是什么</th><th>面向谁</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Skill / 专家团</strong></td><td>单点能力与单条业务链路</td><td>有单点任务或单条链路的团队</td></tr>
    <tr><td><strong>行业解决方案</strong></td><td>覆盖行业核心业务链路的整套方案，含统一入口、Agent 编排、成本管控</td><td>高校、内容、工程等行业的成建制客户</td></tr>
  </tbody>
</table>

<h2>解决方案构成</h2>
<p>每个行业解决方案通常包含四类能力：</p>
<ul>
  <li><strong>统一入口</strong>：主流大模型统一接入，按任务智能选型。</li>
  <li><strong>Agent 自动化</strong>：把行业业务链路编排成可复用的 Agent 工作流。</li>
  <li><strong>团队管理</strong>：成员、组织、API Key、权限、额度统一管理。</li>
  <li><strong>成本管控</strong>：按成员 / 项目 / 模型实时统计用量与成本，额度预算可控。</li>
</ul>

<h2>已上线方案（3 个）</h2>
<table>
  <thead>
    <tr><th>方案</th><th>面向</th><th>一句话定位</th></tr>
  </thead>
  <tbody>
    <tr><td>高校科研 Agent 解决方案</td><td>高校课题组</td><td>让科研团队 用得起 · 管得好 · 跑得快</td></tr>
    <tr><td>内容增长工作台 · 爆款工厂</td><td>内容创业者 / 带货团队</td><td>找得到爆款 · 写得出爆款 · 卖得动爆款</td></tr>
    <tr><td>AI 投标顾问 Agent · 投标作战指挥台</td><td>投标企业</td><td>看得懂标 · 过得了审 · 拿得下分</td></tr>
  </tbody>
</table>

<h2>采购流程</h2>
<p>每个解决方案详情页提供完整的能力说明、业务流程与交付物预览。采购与实施流程见「<a href="/docs#solution-procurement">采购与实施流程</a>」。</p>
`,
    },
    {
      id: 'solution-university',
      title: '高校科研 Agent 解决方案',
      content: `
<h2>定位</h2>
<p>面向高校课题组的大模型科研基础设施，让科研团队<strong>用得起 · 管得好 · 跑得快</strong>。</p>

<h2>适用对象</h2>
<ul>
  <li>高校课题组、研究生导师、博士 / 硕士生、科研实验室。</li>
</ul>

<h2>四大能力</h2>
<table>
  <thead>
    <tr><th>能力</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td>统一模型入口</td><td>GPT / Claude / Gemini / 国内主流模型统一接入，按任务智能选型，无需维护多家账号。</td></tr>
    <tr><td>团队协作管理</td><td>课题组成员、组织、API Key、权限、额度统一管理。</td></tr>
    <tr><td>科研 Agent 自动化</td><td>文献调研、代码生成、数据分析、论文辅助等任务编排成可复用工作流。</td></tr>
    <tr><td>经费与用量管控</td><td>按成员 / 项目 / 模型实时统计 Token、调用量与成本，支持额度与预算控制。</td></tr>
  </tbody>
</table>

<h2>业务链路</h2>
<ol>
  <li><strong>一个科研问题</strong>：导师或研究生提出研究问题，作为链路起点。</li>
  <li><strong>Research Agent 自动编排</strong>：先做领域文献调研与研究空白分析，判断研究方向。</li>
  <li><strong>文献调研</strong>：从 200 篇论文自动检索、筛选、阅读、分类、总结，输出实验方案。</li>
  <li><strong>代码生成</strong>：自动生成实验代码，一键复现论文结果。</li>
  <li><strong>数据分析</strong>：几十 GB 数据交给 AI 清洗、统计与可视化。</li>
  <li><strong>论文撰写与审校</strong>：从实验结果到论文初稿，自动编排与审校。</li>
  <li><strong>全程管控</strong>：经费与用量一目了然。</li>
</ol>

<h2>交付物</h2>
<p>整条链路输出：研究方向报告、文献调研报告、实验方案、实验代码、数据分析报告、论文初稿，每个节点均有结构化成果。</p>

<h2>更多信息</h2>
<p>前往 <a href="/solutions/university-agent">高校科研 Agent 解决方案详情页</a> 查看完整业务演示。</p>
`,
    },
    {
      id: 'solution-content',
      title: '爆款工厂 · 内容增长工作台',
      content: `
<h2>定位</h2>
<p>面向内容创业者与带货团队的内容增长工作台，让创作者<strong>找得到爆款 · 写得出爆款 · 卖得动爆款</strong>。</p>

<h2>适用对象</h2>
<ul>
  <li>内容创作者、MCN / 带货团队、电商商家、直播运营团队。</li>
</ul>

<h2>四大能力</h2>
<table>
  <thead>
    <tr><th>能力</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td>爆款雷达 · 全网热点监测</td><td>实时监测全网热点与风口，提前发现可追内容。</td></tr>
    <tr><td>AI 内容工厂</td><td>选题、标题、正文、封面一键成稿，批量生产。</td></tr>
    <tr><td>成交转化闭环</td><td>评论 / 私信自动跟进，流量转化为成交。</td></tr>
    <tr><td>成本与素材管控</td><td>内容成本与团队额度一目了然，素材统一沉淀复用。</td></tr>
  </tbody>
</table>

<h2>业务链路</h2>
<ol>
  <li><strong>一个内容增长需求</strong>：输入账号定位与目标。</li>
  <li><strong>爆款雷达</strong>：全网热点与风口监测，锁定可追方向。</li>
  <li><strong>内容拆解</strong>：把爆款拆成可复制的配方。</li>
  <li><strong>智能选题</strong>：批量繁衍高带货选题。</li>
  <li><strong>内容生成</strong>：标题、正文、封面一键成稿。</li>
  <li><strong>回复转化</strong>：评论 / 私信成交闭环。</li>
  <li><strong>内容诊断</strong>：曝光、互动、转化全链路体检，持续优化。</li>
  <li><strong>全程管控</strong>：内容成本与团队额度一目了然。</li>
</ol>

<h2>交付物</h2>
<p>整条链路输出：热点监测报告、爆款拆解、选题清单、成稿内容（标题 / 正文 / 封面）、转化话术、内容诊断报告。</p>

<h2>更多信息</h2>
<p>前往 <a href="/solutions/content-creator">内容增长工作台 · 爆款工厂详情页</a> 查看完整业务演示。</p>
`,
    },
    {
      id: 'solution-bid',
      title: 'AI 投标顾问 · 投标作战指挥台',
      content: `
<h2>定位</h2>
<p>面向投标企业的 AI 投标作战平台，让投标团队<strong>看得懂标 · 过得了审 · 拿得下分</strong>。</p>

<h2>适用对象</h2>
<ul>
  <li>建筑工程企业、IT 集成 / 系统集成商、设备制造商、医疗器械企业、安防工程企业、政府采购投标团队。</li>
</ul>

<h2>四大能力</h2>
<table>
  <thead>
    <tr><th>能力</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td>招标文件智能解析</td><td>3 分钟读懂上百页标书，自动提取关键要求。</td></tr>
    <tr><td>废标风险防控</td><td>提前识别一票否决红线，逐条规避废标风险。</td></tr>
    <tr><td>评分得分策略</td><td>拆解综合评分法，测算预计得分与提分空间。</td></tr>
    <tr><td>标书智能体检</td><td>封标前模拟专家终审，输出健康度评分。</td></tr>
  </tbody>
</table>

<h2>业务链路</h2>
<ol>
  <li><strong>一份招标文件</strong>：上传或粘贴招标文件。</li>
  <li><strong>招标解析</strong>：3 分钟读懂上百页标书。</li>
  <li><strong>资格预审</strong>：逐条核对资质与业绩要求。</li>
  <li><strong>废标风险</strong>：提前识别一票否决红线。</li>
  <li><strong>评分拆解</strong>：预计得分与提分空间测算。</li>
  <li><strong>得分策略</strong>：必过项与冲刺项战术规划。</li>
  <li><strong>能力匹配</strong>：企业实力与招标要求矩阵分析。</li>
  <li><strong>作战任务</strong>：拆解成可执行的任务清单。</li>
  <li><strong>技术标撰写</strong>：章节大纲与 AI 成稿。</li>
  <li><strong>标书体检</strong>：封标前模拟专家终审。</li>
  <li><strong>AI 投标作战报告</strong>：最终交付完整作战报告。</li>
</ol>

<h2>交付物</h2>
<p>整条链路输出：招标解析报告、资格预审核对表、废标风险清单（分级）、评分拆解与提分建议、技术标大纲与成稿、标书体检报告、投标作战报告。</p>

<h2>更多信息</h2>
<p>前往 <a href="/solutions/bid-consultant">AI 投标顾问 · 投标作战指挥台详情页</a> 查看完整业务演示。</p>
`,
    },
    {
      id: 'solution-procurement',
      title: '采购与实施流程',
      content: `
<h2>整体流程</h2>
<ol>
  <li><strong>售前咨询</strong>：通过页面右下角「商务咨询」浮层或<a href="mailto:xncn@starnovation.cn">邮件联系</a>商务团队沟通业务目标与现状。</li>
  <li><strong>需求确认</strong>：商务与技术团队共同确认业务链路、数据接入方式与预期效果。</li>
  <li><strong>方案定制</strong>：基于标准方案做行业化配置（Agent 工作流、模型选型、成本控制策略）。</li>
  <li><strong>部署交付</strong>：标准 SaaS 版开通即用；敏感行业可选择私有化部署（数据不出企业）。</li>
  <li><strong>培训与试跑</strong>：团队培训 + 真实业务试跑，验证效果。</li>
  <li><strong>售后调优</strong>：持续调优 Agent 效果，成本用量随时可查。</li>
</ol>

<h2>采购方式</h2>
<table>
  <thead>
    <tr><th>方式</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td>标准方案开通</td><td>三个已上线方案可直接进入详情页体验，按企业规模报价。</td></tr>
    <tr><td>私有化部署</td><td>数据不出企业的部署模式，适合对数据安全要求高的客户。</td></tr>
    <tr><td>深度定制</td><td>行业化定制 Agent 工作流与业务系统集成。</td></tr>
  </tbody>
</table>

<h2>联系商务</h2>
<p>请通过页面右下角「商务咨询」浮层提交需求，或<a href="mailto:xncn@starnovation.cn">邮件联系</a>您的客户经理。商务团队将在 1 个工作日内响应。</p>
`,
    },
  ],
}

export default solutionsSection
