import type { DocContent } from '@/types/docs'

const docContent: DocContent = {
  defaultItemId: 'what-is',
  sections: [
    {
      id: 'intro',
      title: '产品简介',
      icon: 'BookOpen',
      children: [
        {
          id: 'what-is',
          title: '什么是 Nova AI Gateway',
          content: `
<h2>一句话介绍</h2>
<p>Nova AI Gateway 是一个面向企业和开发者的<strong>大模型统一接入网关</strong>：只需一个 API Key、一套与 OpenAI 完全兼容的接口，即可调用全球主流大模型，并内置额度管理、按量计费与故障自动切换能力。</p>

<h2>解决的问题</h2>
<ul>
  <li><strong>接口不统一</strong>：OpenAI、Anthropic、DeepSeek、智谱、通义等厂商接口各异，逐个适配成本高。Nova AI Gateway 全部归一为 OpenAI Chat Completions 规范，一次接入即可调用所有已配置模型。</li>
  <li><strong>账号与充值分散</strong>：无需为每家厂商单独注册、充值、管理额度。统一在平台分配额度，一个 Key 全平台通用。</li>
  <li><strong>单点故障风险</strong>：同一模型可绑定多个 Provider，主用不可用时自动切换备用，保障业务连续性。</li>
  <li><strong>成本不可控</strong>：按 Token 精确计费（输入/输出分开计价），支持峰谷分时定价，用量与成本在控制台实时可查。</li>
</ul>

<h2>核心价值</h2>
<blockquote>
  <p>「兼容 OpenAI SDK，一个 Key 接入所有主流大模型，故障自动切换，按量付费。」</p>
</blockquote>

<h2>适用场景</h2>
<ul>
  <li>AI 应用 / Agent 开发团队：快速接入多模型，避免绑定单一厂商。</li>
  <li>企业 IT 部门：统一管理团队内模型调用、额度和成本。</li>
  <li>教育与科研机构：按项目分配额度，精细控制预算。</li>
</ul>

<h2>开始使用</h2>
<p>账号由管理员在控制台统一创建并分配额度。获取 API Key 后，只需将 SDK 的 <code>base_url</code> 指向 <code>http://api.starnov.cn/v1</code>，即可像调用 OpenAI 一样发起请求。详见<a href="/docs">快速入门</a>。</p>
`,
        },
        {
          id: 'core-features',
          title: '核心功能',
          content: `
<h2>统一 API 接入</h2>
<p>完全兼容 OpenAI Chat Completions 接口规范。Python / JavaScript / Go SDK 及 cURL 等工具可直接使用，仅需修改 <code>base_url</code> 与 <code>api_key</code>，5 分钟内完成接入，业务代码零改造。</p>

<h2>多 Provider 管理与故障切换</h2>
<p>同一模型可绑定多个 Provider 并配置优先级 / 权重。请求按配置的路由策略选择 Provider，主用 Provider 失败时自动按顺序尝试备用，整个过程对业务透明无感。</p>

<h2>API Key 与额度管理</h2>
<ul>
  <li>支持创建多个 API Key，独立管理、随时禁用。</li>
  <li>每个账户独立额度，按 Token 消耗实时扣减。</li>
  <li>支持模型白名单：可为用户或 Key 限定可调用的模型范围。</li>
</ul>

<h2>按量计费</h2>
<ul>
  <li>无订阅费、无月费，按实际用量付费，用多少付多少。</li>
  <li>输入 / 输出 Token 分开计价，精确到 Token。</li>
  <li>流式请求（SSE）通过解析最后一块数据的 <code>usage</code> 字段完成计费统计。</li>
  <li>额度扣减采用行级锁保证强一致，余额不足返回 402，绝不超扣。</li>
</ul>

<h2>SSE 流式响应</h2>
<p>完整支持 <code>stream: true</code> 流式转发，服务端实时透传数据块，首字延迟低；流式结束自动完成 Token 统计与扣费。</p>

<h2>用量统计与成本报告</h2>
<p>每次调用自动记录请求日志（模型、Provider、Token、费用、延迟、状态），控制台提供用量汇总、明细查询与成本报表，支持导出，成本一目了然。</p>

<h2>权限体系（RBAC）</h2>
<p>内置角色权限体系，包含 15+ 功能权限点（用户管理、额度管理、模型配置、报表查看等），通过 Redis 缓存提升校验效率，适合团队多人协作管理。</p>

<h2>安全与合规</h2>
<ul>
  <li>全链路 TLS 加密传输。</li>
  <li>即时转发架构，不持久保存 Prompt 内容。</li>
  <li>记录调用元数据（不含内容），满足审计与合规需求。</li>
</ul>
`,
        },
        {
          id: 'architecture',
          title: '技术架构',
          content: `
<h2>总体架构</h2>
<p>平台由 5 个独立服务组成，通过 Docker Compose 部署，可独立扩容与维护：</p>
<ul>
  <li><strong>API Gateway</strong>：统一对外入口，处理 Chat Completions 请求，实现认证、路由转发与流式透传。</li>
  <li><strong>Router Engine</strong>：模型路由，按绑定优先级 / 权重选择 Provider，失败时自动切换备用。</li>
  <li><strong>Policy Engine</strong>：额度策略检查、模型白名单校验、费用计算与额度消耗。</li>
  <li><strong>Auth Service</strong>：API Key 校验、JWT 登录鉴权与 RBAC 权限点校验。</li>
  <li><strong>Billing Service</strong>：按量计费、额度扣减（行级锁）与费用流水记录。</li>
</ul>

<h2>请求处理链路</h2>
<ol>
  <li>客户端携带 <code>Authorization: Bearer &lt;API Key&gt;</code> 调用 <code>POST /v1/chat/completions</code>。</li>
  <li>API Gateway 校验 API Key 有效性、状态与额度（不足时返回 402）。</li>
  <li>Router Engine 根据模型路由策略选择 Provider，发起上游调用；失败自动降级到备用 Provider。</li>
  <li>响应（普通或 SSE 流式）实时透传给客户端。</li>
  <li>解析 Token 用量 → 计算费用（含峰谷时段判断）→ 行级锁扣减额度 → 异步记录请求日志。</li>
</ol>

<h2>分层设计</h2>
<p>每个服务内部采用 <code>Controller → Service → Repository</code> 分层，依赖方向由外向内，职责单一、便于测试与演进。</p>

<h2>数据与中间件</h2>
<ul>
  <li><strong>PostgreSQL 15+</strong>：核心业务数据，额度扣减通过 <code>SELECT FOR UPDATE</code> 行锁保证强一致。</li>
  <li><strong>Redis 7+</strong>：缓存权限点、模型配置与高频读取数据，主链路 99% 请求不访问数据库。</li>
  <li><strong>异步化</strong>：日志、成本、统计等非主链路操作通过事件队列异步处理，不阻塞请求。</li>
</ul>

<h2>性能目标</h2>
<ul>
  <li>Gateway 主链路 < 10ms。</li>
  <li>Policy Engine 单次校验 < 2ms。</li>
  <li>Router 路由决策 < 2ms。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'quickstart',
      title: '快速入门',
      icon: 'Rocket',
      children: [
        {
          id: 'get-api-key',
          title: '获取 API Key',
          content: `
<h2>前提条件</h2>
<p>当前账号由管理员在控制台统一创建并分配额度（不支持自主注册）。如需开通，请联系管理员或商务团队。</p>

<h2>获取步骤</h2>
<ol>
  <li>使用管理员分配的账号登录管理控制台。</li>
  <li>进入「API Keys」页面，点击<strong>创建 API Key</strong>。</li>
  <li>按需填写名称（便于识别用途），创建成功后复制 Key。</li>
  <li>将 Key 配置到你的应用或 SDK 中即可开始调用。</li>
</ol>

<h2>Key 格式</h2>
<p>API Key 以 <code>nv_sk-</code> 开头，形如：<code>nv_sk-xxxxxxxxxxxxxxxx</code>。</p>

<h2>安全提示</h2>
<ul>
  <li>Key 仅在创建时完整展示一次，请立即保存到安全位置。</li>
  <li>请勿将 Key 提交到公开仓库、前端代码或日志中。</li>
  <li>如怀疑泄露，可在控制台立即禁用并重新创建。</li>
</ul>
`,
        },
        {
          id: 'configure-sdk',
          title: '配置客户端',
          content: `
<h2>只需要两个参数</h2>
<p>Nova AI Gateway 完全兼容 OpenAI SDK，接入时只需修改 <code>api_key</code> 与 <code>base_url</code> 两个参数，其余用法与 OpenAI 官方一致：</p>
<ul>
  <li><code>api_key</code>：在控制台创建的 <code>nv_sk-</code> 开头 API Key。</li>
  <li><code>base_url</code>：<code>http://api.starnov.cn/v1</code></li>
</ul>

<h2>Python</h2>
<pre><code>from openai import OpenAI

client = OpenAI(
    api_key="nv_sk-xxxxxxxxxxxxxxxx",
    base_url="http://api.starnov.cn/v1",
)</code></pre>

<h2>JavaScript / TypeScript</h2>
<pre><code>import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: "nv_sk-xxxxxxxxxxxxxxxx",
    baseURL: "http://api.starnov.cn/v1",
})</code></pre>

<h2>Go</h2>
<pre><code>import openai "github.com/sashabaranov/go-openai"

client := openai.NewClientWithConfig(
    openai.DefaultConfig(
        "nv_sk-xxxxxxxxxxxxxxxx",
        "http://api.starnov.cn/v1",
    ),
)</code></pre>
`,
        },
        {
          id: 'first-call',
          title: '发起首次调用',
          content: `
<h2>使用 cURL 快速验证</h2>
<pre><code>curl http://api.starnov.cn/v1/chat/completions \\
  -H "Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "你好，请介绍一下你自己"}]
  }'</code></pre>

<h2>响应示例</h2>
<p>正常响应与 OpenAI 完全一致，包含 <code>choices</code> 与 <code>usage</code> 字段：</p>
<pre><code>{
  "id": "chatcmpl-xxxxxxxx",
  "object": "chat.completion",
  "created": 1720000000,
  "model": "deepseek-v4-pro",
  "choices": [{
    "index": 0,
    "message": {"role": "assistant", "content": "你好！我是由 DeepSeek 驱动的大模型……"},
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 42,
    "total_tokens": 60
  }
}</code></pre>

<h2>验证成功</h2>
<p>返回 <code>200</code> 且包含模型回复，即代表接入成功。此时可前往控制台「用量统计」查看本次调用的 Token 消耗与费用。</p>

<h2>常见报错</h2>
<ul>
  <li><code>401</code>：API Key 无效或未携带，请检查 <code>Authorization</code> 头。</li>
  <li><code>402</code>：账户额度不足，请联系管理员充值。</li>
  <li><code>404</code>：模型不存在，请核对 <code>model</code> 名称。</li>
  <li><code>403 MODEL_FORBIDDEN</code>：当前账户未被授权调用该模型。</li>
</ul>
`,
        },
        {
          id: 'code-samples',
          title: '多语言代码示例',
          content: `
<h2>Python SDK</h2>
<pre><code>from openai import OpenAI

client = OpenAI(
    api_key="nv_sk-xxxxxxxxxxxxxxxx",
    base_url="http://api.starnov.cn/v1"
)

# 通过网关调用，自动路由至可用 Provider
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.choices[0].message.content)</code></pre>

<h2>JavaScript SDK</h2>
<pre><code>import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: "nv_sk-xxxxxxxxxxxxxxxx",
    baseURL: "http://api.starnov.cn/v1"
});

const response = await client.chat.completions.create({
    model: "deepseek-v4-pro",
    messages: [{ role: "user", content: "Hello" }]
});
console.log(response.choices[0].message.content);</code></pre>

<h2>cURL</h2>
<pre><code>curl http://api.starnov.cn/v1/chat/completions \\
  -H "Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "Hello"}]
  }'</code></pre>

<h2>Go</h2>
<pre><code>package main

import (
    "context"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    client := openai.NewClientWithConfig(
        openai.DefaultConfig(
            "nv_sk-xxxxxxxxxxxxxxxx",
            "http://api.starnov.cn/v1",
        ),
    )

    resp, err := client.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model: "deepseek-v4-pro",
            Messages: []openai.ChatCompletionMessage{
                {Role: "user", Content: "Hello"},
            },
        },
    )
    if err != nil {
        panic(err)
    }
    println(resp.Choices[0].Message.Content)
}</code></pre>
`,
        },
        {
          id: 'model-guide',
          title: '模型与选择指南',
          content: `
<h2>查看可用模型</h2>
<p>调用 <code>GET /v1/models</code> 可实时获取当前可用模型列表（OpenAI 兼容格式），返回的 <code>data[].id</code> 即请求时的 <code>model</code> 参数值。</p>

<h2>Chat 模型</h2>
<table>
  <thead>
    <tr><th>模型</th><th>厂商</th><th>上下文</th><th>输入价 / M Tokens</th><th>输出价 / M Tokens</th><th>适用场景</th></tr>
  </thead>
  <tbody>
    <tr><td><code>gpt-5.6-sol</code></td><td>OpenAI</td><td>400K</td><td>$5</td><td>$30</td><td>最强推理与编程，Agent 场景</td></tr>
    <tr><td><code>gpt-5.6-terra</code></td><td>OpenAI</td><td>400K</td><td>$2.5</td><td>$15</td><td>生产环境主力，性能与成本平衡</td></tr>
    <tr><td><code>claude-opus-5</code></td><td>Anthropic</td><td>1M</td><td>$5</td><td>$25</td><td>深度推理、超长文本、复杂任务</td></tr>
    <tr><td><code>claude-sonnet-4.6</code></td><td>Anthropic</td><td>200K</td><td>$3</td><td>$15</td><td>日常主力，编程 + 多模态</td></tr>
    <tr><td><code>gemini-3.5-pro</code></td><td>Google</td><td>2M</td><td>$1.25</td><td>$5</td><td>超长上下文、视频 / 图像理解</td></tr>
    <tr><td><code>grok-4.5</code></td><td>xAI</td><td>1M</td><td>$2</td><td>$6</td><td>实时资讯、高性价比推理</td></tr>
    <tr><td><code>deepseek-v4-pro</code></td><td>DeepSeek</td><td>128K</td><td>¥6</td><td>¥12</td><td>国产旗舰，数学 / 代码，支持峰谷计费</td></tr>
    <tr><td><code>deepseek-v4-flash</code></td><td>DeepSeek</td><td>128K</td><td>¥1</td><td>¥2</td><td>高并发、高频调用，谷时段更低价</td></tr>
    <tr><td><code>glm-5.2</code></td><td>智谱 GLM</td><td>1M</td><td>¥4</td><td>¥12</td><td>超长上下文，Function Call 生产级</td></tr>
    <tr><td><code>qwen-3.6-plus</code></td><td>通义千问</td><td>1M</td><td>¥2</td><td>¥8</td><td>中文场景、高频调用</td></tr>
    <tr><td><code>kimi-k3</code></td><td>月之暗面</td><td>1M</td><td>¥5</td><td>¥20</td><td>开源领先，WebDev、超长文本</td></tr>
    <tr><td><code>llama-4</code></td><td>Meta</td><td>128K</td><td>$0.5</td><td>$1.5</td><td>开源模型，私有化定制</td></tr>
    <tr><td><code>hunyuan-hy3</code></td><td>腾讯</td><td>256K</td><td>¥3</td><td>¥10</td><td>Agent 能力突出，Apache 2.0 商用</td></tr>
    <tr><td><code>mistral-large-3</code></td><td>Mistral</td><td>256K</td><td>$4</td><td>$20</td><td>多语言、代码生成</td></tr>
  </tbody>
</table>

<h2>选择建议</h2>
<ul>
  <li><strong>追求最强效果</strong>：GPT-5.6 Sol、Claude Opus 5。</li>
  <li><strong>生产性价比</strong>：GPT-5.6 Terra、Claude Sonnet 4.6、DeepSeek V4 Pro。</li>
  <li><strong>中文与成本敏感</strong>：DeepSeek V4 Flash、Qwen 3.6-Plus、GLM-5.2。</li>
  <li><strong>超长上下文</strong>：Gemini 3.5 Pro（2M）、Claude Opus 5（1M）。</li>
</ul>

<h2>注意事项</h2>
<p>以上为平台当前展示的模型清单与参考价格，<strong>实际可用模型及定价以控制台配置和 <code>GET /v1/models</code> 返回为准</strong>，平台会持续新增模型。</p>
`,
        },
        {
          id: 'ai-tools',
          title: '在 AI 编程工具中使用',
          content: `
<h2>快速上手</h2>
<p>Trae、Cursor、Codex CLI、Claude Code 等各工具的<strong>详细配置步骤</strong>见文档中心「<a href="/docs#tools-trae">工具接入</a>」章节。</p>

<h2>适用工具</h2>
<p>只要工具支持 OpenAI 兼容 API（自定义 Base URL），即可接入 Nova AI Gateway。常见工具包括：</p>
<ul>
  <li><strong>编程工具</strong>：Cursor、Windsurf、Continue、JetBrains AI、VS Code Copilot Chat</li>
  <li><strong>桌面客户端</strong>：ChatBox、NextChat、LobeChat、Open WebUI</li>
</ul>

<h2>通用配置三步</h2>
<ol>
  <li>在控制台创建 API Key（<code>nv_sk-</code> 开头）。</li>
  <li>在工具的「自定义 Provider / 自定义 Base URL」中填入：<code>http://api.starnov.cn/v1</code>。</li>
  <li>填入 API Key，选择平台上已配置的模型（如 <code>deepseek-v4-pro</code>）即可使用。</li>
</ol>

<h2>示例：Cursor</h2>
<ol>
  <li>打开 Settings → Models → OpenAI API Key，填入你的网关 API Key。</li>
  <li>在 Base URL / Override Base URL 处填写 <code>http://api.starnov.cn/v1</code>。</li>
  <li>选择或输入模型名称（与平台上配置一致），即可开始对话。</li>
</ol>

<h2>示例：ChatBox / LobeChat</h2>
<ol>
  <li>添加自定义模型提供商，协议选择 OpenAI 兼容。</li>
  <li>API 域名 / Base URL 填 <code>http://api.starnov.cn/v1</code>。</li>
  <li>填写 API Key 并选择模型，保存后即可使用。</li>
</ol>

<h2>提示</h2>
<ul>
  <li>不同工具的字段名略有差异（Base URL / Override Base URL / API 域名），含义相同。</li>
  <li>模型名需与平台上配置的模型 <code>id</code> 完全一致，可通过 <code>GET /v1/models</code> 查询。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'tool-integration',
      title: '工具接入',
      icon: 'Wrench',
      children: [
        {
          id: 'tools-trae',
          title: 'Trae IDE',
          content: `
<h2>配置入口</h2>
<p><strong>设置 → 模型 → 添加模型</strong>（或 AI 对话框右下角模型列表 → 添加模型）。</p>

<h2>操作步骤</h2>
<ol>
  <li>点击「添加模型」，选择<strong>自定义配置</strong>。</li>
  <li><strong>API 格式</strong>：选择「OpenAI Chat Completions 格式」。</li>
  <li><strong>请求地址</strong>：
    <ul>
      <li>关闭「完整 URL」开关 → 填 <code>http://api.starnov.cn/v1</code></li>
      <li>开启「完整 URL」开关 → 填 <code>http://api.starnov.cn/v1/chat/completions</code></li>
    </ul>
    两种写法二选一，效果一致。</li>
  <li><strong>模型 ID</strong>：填网关上的模型 ID，如 <code>deepseek-v4-pro</code>（必须与后台 modelCode 完全一致，大小写敏感）。</li>
  <li><strong>API 密钥</strong>：填 <code>nv_sk-xxxxxxxxxxxxxxxx</code>。</li>
  <li>点击「添加模型」，Trae 会自动预检连通性，成功后模型出现在模型列表。</li>
  <li>回到 AI 对话框，选中该模型，发一条测试消息验证。</li>
</ol>

<h2>验证与排错</h2>
<ul>
  <li>预检失败：检查请求地址是否漏 <code>/v1</code>、模型 ID 是否与网关一致、Key 是否有空格或复制不全。</li>
  <li><code>404 Model Not Found</code>：模型 ID 与网关不一致，通过 <code>GET /v1/models</code> 核对。</li>
</ul>
`,
        },
        {
          id: 'tools-cursor',
          title: 'Cursor IDE',
          content: `
<h2>方式一：OpenAI 兼容覆盖（推荐）</h2>
<ol>
  <li>打开 <strong>Settings（⌘+,）→ Models</strong>。</li>
  <li>在「OpenAI API Key」处填入 <code>nv_sk-xxxxxxxxxxxxxxxx</code>。</li>
  <li>勾选<strong>「Override OpenAI Base URL」</strong>，填入 <code>http://api.starnov.cn/v1</code>。</li>
  <li>回到对话框，在模型选择器中选择需要的模型（如 <code>deepseek-v4-pro</code>）；若模型未出现，可在页面底部的自定义模型输入框中手动输入模型 ID。</li>
</ol>

<h2>方式二：添加自定义模型（Cursor 新版）</h2>
<ol>
  <li>打开 <strong>Settings → Models → Add model</strong>。</li>
  <li>模型名称 / ID 填网关模型 ID（如 <code>deepseek-v4-pro</code>）。</li>
  <li>Base URL 填 <code>http://api.starnov.cn/v1</code>。</li>
  <li>API Key 填 <code>nv_sk-xxxxxxxxxxxxxxxx</code>（或配置请求头 <code>Authorization: Bearer nv_sk-...</code>）。</li>
  <li>保存后在模型选择器中选用，发测试消息验证。</li>
</ol>

<h2>验证与排错</h2>
<ul>
  <li>首次使用报 <code>404</code>：核对自定义模型 ID 是否与网关 modelCode 一致。</li>
</ul>
`,
        },
        {
          id: 'tools-codex',
          title: 'Codex CLI',
          content: `
<h2>安装</h2>
<pre><code>npm install -g @openai/codex
# 或 brew install codex</code></pre>

<h2>配置自定义 Provider</h2>
<p>编辑 <code>~/.codex/config.toml</code>，声明网关为模型提供方：</p>
<pre><code># 默认使用的模型提供方
model_provider = "nova"

[model_providers.nova]
name = "Nova AI Gateway"
base_url = "http://api.starnov.cn/v1"
env_key = "NOVA_API_KEY"      # 从环境变量读取 API Key
wire_api = "chat"             # 网关为 OpenAI Chat Completions 协议</code></pre>
<p><code>wire_api</code> 必须为 <code>"chat"</code>（对应 <code>POST /v1/chat/completions</code>），不能填 <code>"responses"</code>。</p>

<h2>配置环境变量</h2>
<p>在 <code>~/.zshrc</code> / <code>~/.bashrc</code> 中加入：</p>
<pre><code>export NOVA_API_KEY="nv_sk-xxxxxxxxxxxxxxxx"</code></pre>
<p>执行 <code>source ~/.zshrc</code> 生效。</p>

<h2>使用</h2>
<pre><code>codex                          # 在项目目录中启动
codex --model deepseek-v4-pro  # 指定模型</code></pre>
<p>也可在 <code>config.toml</code> 中设置默认模型：</p>
<pre><code>[model]
model = "deepseek-v4-pro"</code></pre>

<h2>验证与排错</h2>
<ul>
  <li><code>401</code>：检查 <code>NOVA_API_KEY</code> 环境变量是否已导出、Key 是否正确。</li>
  <li>模型持续报错：确认 <code>wire_api = "chat"</code> 配置正确。</li>
</ul>
`,
        },
        {
          id: 'tools-claude-code',
          title: 'Claude Code',
          content: `
<h2>安装</h2>
<pre><code>npm install -g @anthropic-ai/claude-code</code></pre>

<h2>通过环境变量指向网关</h2>
<p>网关提供 Anthropic 兼容端点（<code>POST /v1/messages</code>），Claude Code 可直接指向网关：</p>
<pre><code>export ANTHROPIC_BASE_URL="http://api.starnov.cn"        # 注意：不带 /v1，SDK 自动拼接 /v1/messages
export ANTHROPIC_AUTH_TOKEN="nv_sk-xxxxxxxxxxxxxxxx"
export ANTHROPIC_MODEL="deepseek-v4-pro"                 # 默认主模型
export ANTHROPIC_SMALL_FAST_MODEL="deepseek-v4-flash"    # 后台轻量模型（推荐）</code></pre>
<ul>
  <li><code>ANTHROPIC_AUTH_TOKEN</code> 走 <code>Authorization: Bearer</code> 头；网关同时兼容 <code>x-api-key</code> 头。</li>
  <li><code>ANTHROPIC_BASE_URL</code> 填到域名为止（<code>http://api.starnov.cn</code>），不要带 <code>/v1/messages</code>。</li>
</ul>

<h2>启动</h2>
<pre><code>claude</code></pre>
<p>在项目目录中启动后，Claude Code 将以网关为后端进行对话与编码。</p>

<h2>验证与排错</h2>
<ul>
  <li>认证失败：确认 <code>ANTHROPIC_AUTH_TOKEN</code> 为 <code>nv_sk-</code> 开头的网关 Key。</li>
  <li><code>404 model not found</code>：核对 <code>ANTHROPIC_MODEL</code> 与网关 modelCode 一致。</li>
</ul>
`,
        },
        {
          id: 'tools-generic',
          title: '其他 OpenAI 兼容工具',
          content: `
<h2>适用工具</h2>
<p>Cline、Continue、Roo Code、ChatBox、LobeChat、Open WebUI 等工具普遍支持「自定义 OpenAI 兼容 Provider」，配置套路一致：</p>
<table>
  <thead>
    <tr><th>配置项</th><th>值</th></tr>
  </thead>
  <tbody>
    <tr><td>Provider 类型</td><td>OpenAI Compatible / 自定义</td></tr>
    <tr><td>Base URL / 请求地址</td><td><code>http://api.starnov.cn/v1</code></td></tr>
    <tr><td>API Key</td><td><code>nv_sk-xxxxxxxxxxxxxxxx</code></td></tr>
    <tr><td>模型 ID</td><td>网关上的 modelCode，如 <code>deepseek-v4-pro</code></td></tr>
  </tbody>
</table>

<h2>通用配置步骤</h2>
<ol>
  <li>在工具设置中新建「自定义 Provider / 自定义模型」。</li>
  <li>选择 OpenAI Chat Completions 格式。</li>
  <li>填入上表的 Base URL、API Key、模型 ID。</li>
  <li>保存后发起一条测试消息验证。</li>
</ol>

<h2>提示</h2>
<ul>
  <li>不同工具字段名略有差异（Base URL / Override Base URL / API 域名），含义相同。</li>
  <li>模型名需与网关配置的 <code>id</code> 完全一致，可通过 <code>GET /v1/models</code> 查询。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'api',
      title: 'API 接口',
      icon: 'Terminal',
      children: [
        {
          id: 'chat-completions',
          title: 'Chat Completions',
          content: `
<h2>接口定义</h2>
<pre><code>POST http://api.starnov.cn/v1/chat/completions</code></pre>
<p>创建一次对话补全请求，兼容 OpenAI Chat Completions 规范，支持普通响应与流式（SSE）响应。</p>

<h2>请求头</h2>
<ul>
  <li><code>Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx</code> — API Key 认证，必填。</li>
  <li><code>Content-Type: application/json</code> — 必填。</li>
</ul>

<h2>请求体</h2>
<pre><code>{
  "model": "deepseek-v4-pro",
  "messages": [
    {"role": "system", "content": "你是一个乐于助人的助手"},
    {"role": "user", "content": "你好"}
  ],
  "temperature": 0.7,
  "stream": false
}</code></pre>

<h2>响应体</h2>
<pre><code>{
  "id": "chatcmpl-xxxxxxxx",
  "object": "chat.completion",
  "created": 1720000000,
  "model": "deepseek-v4-pro",
  "choices": [{
    "index": 0,
    "message": {"role": "assistant", "content": "你好！有什么可以帮你？"},
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 6,
    "completion_tokens": 8,
    "total_tokens": 14
  }
}</code></pre>

<h2>查询可用模型</h2>
<p>使用 API Key 调用 <code>GET /v1/models</code> 可获取当前可用的模型列表（OpenAI 兼容格式）：</p>
<pre><code>curl http://api.starnov.cn/v1/models \\
  -H "Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx"</code></pre>

<h2>错误响应</h2>
<p>网关统一返回 <code>HTTP 状态码 + 错误码</code>，例如：</p>
<pre><code>{
  "code": "QUOTA_EXCEEDED",
  "message": "quota balance is insufficient"
}</code></pre>
`,
        },
        {
          id: 'auth',
          title: '认证与鉴权',
          content: `
<h2>认证方式</h2>
<p>所有 API 请求均需携带 API Key，通过 <code>Authorization</code> 请求头以 Bearer 方式传递：</p>
<pre><code>Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx</code></pre>
<p>网关在校验通过后，会同时完成额度检查与模型白名单校验，未通过则拒绝请求。</p>

<h2>API Key 类型</h2>
<ul>
  <li>每个账户可创建多个 Key，分别用于不同应用或环境（如生产 / 测试）。</li>
  <li>Key 支持随时禁用，禁用后立即失效。</li>
  <li>被禁用的 Key 调用将返回 <code>403 AUTH004</code>。</li>
</ul>

<h2>错误码对照</h2>
<table>
  <thead>
    <tr><th>HTTP 状态码</th><th>错误码</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td>401</td><td>AUTH001</td><td>缺少 Authorization 请求头</td></tr>
    <tr><td>401</td><td>AUTH002</td><td>Authorization 格式错误或 API Key 无效</td></tr>
    <tr><td>403</td><td>AUTH004</td><td>API Key 已被禁用</td></tr>
    <tr><td>402</td><td>QUOTA_EXCEEDED</td><td>账户额度不足</td></tr>
    <tr><td>403</td><td>MODEL_FORBIDDEN</td><td>模型未授权给当前账户</td></tr>
  </tbody>
</table>

<h2>安全建议</h2>
<ul>
  <li>Key 通过服务端环境变量管理，切勿硬编码在客户端或前端代码中。</li>
  <li>为不同环境使用独立 Key，便于隔离与审计。</li>
  <li>定期轮换 Key，最小化泄露风险。</li>
</ul>
`,
        },
        {
          id: 'parameters',
          title: '请求参数',
          content: `
<h2>核心参数</h2>
<table>
  <thead>
    <tr><th>参数</th><th>类型</th><th>必填</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td><code>model</code></td><td>string</td><td>是</td><td>模型名称，如 <code>deepseek-v4-pro</code>。可通过 <code>GET /v1/models</code> 查询。</td></tr>
    <tr><td><code>messages</code></td><td>array</td><td>是</td><td>对话消息列表，元素含 <code>role</code>（system / user / assistant）与 <code>content</code>。</td></tr>
    <tr><td><code>temperature</code></td><td>number</td><td>否</td><td>采样温度，0~2，默认按模型自身策略。</td></tr>
    <tr><td><code>stream</code></td><td>boolean</td><td>否</td><td>是否流式返回，默认 <code>false</code>。</td></tr>
  </tbody>
</table>

<h2>透传参数</h2>
<p><code>max_tokens</code>、<code>top_p</code>、<code>stop</code>、<code>presence_penalty</code>、<code>tools</code> 等 OpenAI 标准参数会被<strong>原样透传</strong>给上游 Provider。是否生效取决于所调用模型 / Provider 的实际支持情况，建议以对应厂商文档为准。</p>

<h2>请求体限制</h2>
<p>请求体大小上限为 10MB，超出将返回 <code>400 VALID001</code>。</p>

<h2>消息示例</h2>
<pre><code>{
  "model": "deepseek-v4-pro",
  "messages": [
    {"role": "system", "content": "你是一名专业的文案编辑"},
    {"role": "user", "content": "为新品写一句宣传语"},
    {"role": "assistant", "content": "好的，请告诉我新品的特点。"},
    {"role": "user", "content": "主打轻便与续航"}
  ],
  "temperature": 0.8,
  "max_tokens": 200
}</code></pre>
`,
        },
        {
          id: 'streaming',
          title: '流式响应（SSE）',
          content: `
<h2>开启流式</h2>
<p>在请求体中设置 <code>stream: true</code>，网关将以 <code>text/event-stream</code> 格式实时透传数据块，客户端可边生成边展示，大幅降低首字延迟：</p>
<pre><code>{
  "model": "deepseek-v4-pro",
  "messages": [{"role": "user", "content": "写一首关于秋天的诗"}],
  "stream": true
}</code></pre>

<h2>SSE 数据格式</h2>
<p>每块数据以 <code>data:</code> 开头，内容为 JSON 片段，以空行分隔：</p>
<pre><code>data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"秋"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"风"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[],"usage":{"prompt_tokens":12,"completion_tokens":36}}

data: [DONE]</code></pre>

<h2>流式计费说明</h2>
<ul>
  <li>网关从最后一块包含 <code>usage</code> 字段的数据中解析 Token 消耗，用于计费统计。</li>
  <li>流结束后自动完成费用计算与额度扣减，无需额外操作。</li>
  <li>中途断流：若连接中断未收到完整的 <code>usage</code>，本次请求的计费可能不完整，建议客户端在网络异常时重试。</li>
</ul>

<h2>Python 流式示例</h2>
<pre><code>from openai import OpenAI

client = OpenAI(
    api_key="nv_sk-xxxxxxxxxxxxxxxx",
    base_url="http://api.starnov.cn/v1",
)

stream = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[{"role": "user", "content": "写一首关于秋天的诗"}],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")</code></pre>
`,
        },
        {
          id: 'images',
          title: '图像生成（Images）',
          content: `
<h2>接口定义</h2>
<pre><code>POST http://api.starnov.cn/v1/images/generations</code></pre>
<p>根据文本提示生成图像，兼容 OpenAI Images 接口规范。认证方式与 Chat Completions 一致，使用 <code>Authorization: Bearer nv_sk-xxx</code>。</p>

<h2>请求参数</h2>
<table>
  <thead>
    <tr><th>参数</th><th>类型</th><th>必填</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td><code>model</code></td><td>string</td><td>是</td><td>图像模型名称，以控制台配置为准。</td></tr>
    <tr><td><code>prompt</code></td><td>string</td><td>是</td><td>文本提示词，描述期望生成的图像。</td></tr>
    <tr><td><code>n</code></td><td>integer</td><td>否</td><td>生成张数，默认 1。</td></tr>
    <tr><td><code>size</code></td><td>string</td><td>否</td><td>图像尺寸，如 <code>1024x1024</code>，默认按模型策略。</td></tr>
    <tr><td><code>response_format</code></td><td>string</td><td>否</td><td>返回格式：<code>url</code> 或 <code>b64_json</code>。</td></tr>
  </tbody>
</table>

<h2>cURL 示例</h2>
<pre><code>curl http://api.starnov.cn/v1/images/generations \\
  -H "Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "image-model-name",
    "prompt": "一只戴着宇航员头盔的柴犬，赛博朋克风格",
    "n": 1,
    "size": "1024x1024"
  }'</code></pre>

<h2>响应结构</h2>
<pre><code>{
  "created": 1720000000,
  "data": [
    {
      "url": "https://.../generated-image.png",
      "revised_prompt": "A shiba inu wearing an astronaut helmet, cyberpunk style"
    }
  ],
  "usage": {
    "prompt_tokens": 32,
    "total_tokens": 32,
    "image_count": 1
  }
}</code></pre>

<h2>Python 示例</h2>
<pre><code>from openai import OpenAI

client = OpenAI(
    api_key="nv_sk-xxxxxxxxxxxxxxxx",
    base_url="http://api.starnov.cn/v1",
)

result = client.images.generate(
    model="image-model-name",
    prompt="一只戴着宇航员头盔的柴犬，赛博朋克风格",
    n=1,
    size="1024x1024",
)
print(result.data[0].url)</code></pre>

<h2>计费说明</h2>
<p>图像生成<strong>按张数计费</strong>（参考响应中的 <code>usage.image_count</code>），而非按 Token 计费。单价以控制台模型定价为准。</p>
`,
        },
        {
          id: 'error-codes',
          title: '错误码说明',
          content: `
<h2>错误响应格式</h2>
<p>网关统一返回 <code>HTTP 状态码 + 错误码</code> 的 JSON 结构：</p>
<pre><code>{
  "code": "QUOTA_EXCEEDED",
  "message": "quota balance is insufficient"
}</code></pre>

<h2>错误码总表</h2>
<table>
  <thead>
    <tr><th>HTTP 状态码</th><th>错误码</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td>400</td><td>VALID001</td><td>请求参数校验失败 / 请求体过大（>10MB）</td></tr>
    <tr><td>401</td><td>AUTH001</td><td>缺少 Authorization 请求头</td></tr>
    <tr><td>401</td><td>AUTH002</td><td>Authorization 格式错误或 API Key 无效</td></tr>
    <tr><td>402</td><td>QUOTA_EXCEEDED</td><td>账户额度不足</td></tr>
    <tr><td>403</td><td>AUTH004</td><td>API Key 已被禁用</td></tr>
    <tr><td>403</td><td>MODEL_FORBIDDEN</td><td>模型未授权给当前账户</td></tr>
    <tr><td>403</td><td>QUOTA_EXCEEDED</td><td>该模型配额已用完（Policy 层检查）</td></tr>
    <tr><td>404</td><td>VALID001</td><td>模型不存在（<code>model</code> 名称错误）</td></tr>
    <tr><td>500</td><td>INTERNAL</td><td>服务器内部错误</td></tr>
    <tr><td>502</td><td>GATEWAY001</td><td>上游 Provider 请求失败</td></tr>
    <tr><td>503</td><td>ROUTER001</td><td>模型未绑定可用 Provider 或全部 Provider 不可用</td></tr>
  </tbody>
</table>

<h2>常见问题排查</h2>
<ul>
  <li><code>401 AUTH002</code>：确认 Key 正确且以 <code>nv_sk-</code> 开头，Authorization 头格式为 <code>Bearer &lt;Key&gt;</code>。</li>
  <li><code>402 QUOTA_EXCEEDED</code>：账户额度不足，联系管理员充值 / 调整额度。</li>
  <li><code>403 MODEL_FORBIDDEN</code>：当前账户未被授权调用该模型，联系管理员配置模型白名单。</li>
  <li><code>404 VALID001</code>：<code>model</code> 名称与平台配置不一致，通过 <code>GET /v1/models</code> 核对。</li>
  <li><code>503 ROUTER001</code>：模型未绑定 Provider 或绑定全部异常，请管理员检查 Provider 配置。</li>
</ul>
`,
        },
        {
          id: 'anthropic-messages',
          title: 'Anthropic Messages',
          content: `
<h2>概述</h2>
<p>网关同时提供 <strong>Anthropic Messages API 兼容端点</strong>：<code>POST /v1/messages</code>。可直接使用 Anthropic 官方 Python / Node SDK（<code>anthropic</code> / <code>@anthropic-ai/sdk</code>），仅需修改 <code>base_url</code> 与 <code>api_key</code>，业务代码零改造。</p>

<h2>支持的端点</h2>
<table>
  <thead>
    <tr><th>端点</th><th>方法</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td><code>/v1/messages</code></td><td>POST</td><td>对话补全（支持流式 SSE 与工具调用）</td></tr>
    <tr><td><code>/v1/messages/count_tokens</code></td><td>POST</td><td>Token 估算（网关按字符估算，计费以实际用量为准）</td></tr>
    <tr><td><code>/v1/models</code></td><td>GET</td><td>模型列表（同时兼容 OpenAI / Anthropic SDK）</td></tr>
  </tbody>
</table>

<h2>Python 示例</h2>
<pre><code>from anthropic import Anthropic

client = Anthropic(
    api_key="nv_sk-xxxxxxxxxxxxxxxx",
    base_url="https://api.starnov.cn",   # 注意不要以 /v1 结尾
)

resp = client.messages.create(
    model="glm-5.2",
    max_tokens=1024,
    system="You are a helpful assistant.",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.content[0].text)

# 流式
with client.messages.stream(
    model="glm-5.2", max_tokens=1024,
    messages=[{"role": "user", "content": "你好"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="")

# 模型列表
for m in client.models.list().data:
    print(m.id)</code></pre>

<h2>Node.js 示例</h2>
<pre><code>import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: 'nv_sk-xxxxxxxxxxxxxxxx',
  baseURL: 'https://api.starnov.cn',
});

const resp = await client.messages.create({
  model: 'glm-5.2',
  max_tokens: 1024,
  messages: [{ role: 'user', content: '你好' }],
});
console.log(resp.content[0].text);</code></pre>

<h2>认证方式</h2>
<p>Anthropic 端点同时支持 <code>x-api-key</code> 与 <code>Authorization: Bearer</code> 两种请求头传入网关 API Key，SDK 默认使用 <code>x-api-key</code>，开箱即用。</p>

<h2>错误响应</h2>
<p>Anthropic 端点返回 Anthropic 标准错误格式：</p>
<pre><code>{
  "type": "error",
  "error": {
    "type": "rate_limit_error",
    "message": "..."
  }
}</code></pre>
<p>错误类型与 <code>HTTP</code> 状态码映射：<code>401 authentication_error</code>、<code>402 insufficient_quota</code>、<code>403 permission_error</code>、<code>404 not_found_error</code>、<code>429 rate_limit_error</code>、<code>503 overloaded_error</code>、<code>5xx api_error</code>。</p>
`,
        },
      ],
    },
    {
      id: 'faq',
      title: '常见问题',
      icon: 'HelpCircle',
      children: [
        {
          id: 'faq-access',
          title: '接入问题',
          content: `
<h2>如何接入 Nova AI Gateway？</h2>
<p>只需 3 步：① 登录管理控制台获取 API Key；② 将 SDK 的 <code>base_url</code> 指向 <code>http://api.starnov.cn/v1</code>；③ 传入 <code>model</code> 名称发起调用。完全兼容 OpenAI SDK，通常 5 分钟内即可完成接入。</p>

<h2>账号如何开通？</h2>
<p>平台不支持自主注册，账号由管理员在控制台统一创建并分配额度。如需开通请直接联系管理员或商务团队。</p>

<h2>API 兼容 OpenAI 格式吗？</h2>
<p>完全兼容。可直接使用 OpenAI 官方 Python / JavaScript / Go SDK 及 cURL 等工具无缝切换，仅需修改 <code>base_url</code> 和 <code>api_key</code>，业务代码零改造。</p>

<h2>现有业务代码需要改动吗？</h2>
<p>不需要。只要原项目使用 OpenAI SDK，把 <code>base_url</code> 替换为网关地址、<code>api_key</code> 替换为网关 Key、<code>model</code> 替换为网关上的模型名称即可，其余逻辑保持不变。</p>

<h2>如何排查接入失败？</h2>
<ul>
  <li><code>401</code>：检查 Authorization 头是否携带正确的 <code>nv_sk-</code> 开头 Key。</li>
  <li><code>402</code>：账户额度不足，联系管理员充值。</li>
  <li><code>404</code>：模型名称不存在，通过 <code>GET /v1/models</code> 确认可用模型。</li>
  <li><code>503</code>：模型未绑定可用 Provider，请管理员在控制台检查 Provider 配置。</li>
</ul>
`,
        },
        {
          id: 'faq-billing',
          title: '计费问题',
          content: `
<h2>如何计费？</h2>
<p>按量计费：按实际消耗的 Token 数计算，输入与输出分别计价，单价可在控制台的模型定价中查看。流式请求同样按最终 Token 用量计费，图像生成则按张数计费。</p>

<h2>Token 是什么？</h2>
<p>Token 是模型处理文本的基本单位，粗略换算：英文 1 Token ≈ 4 个字符 / 0.75 个单词，中文 1 Token ≈ 1~2 个汉字。每次调用的 Token 消耗可通过响应中的 <code>usage</code> 字段查看（<code>prompt_tokens</code> 输入 / <code>completion_tokens</code> 输出）。</p>

<h2>什么是峰谷计价？</h2>
<p>部分模型支持<strong>峰谷分时计价</strong>：后台可配置不同时间段的不同单价。例如 DeepSeek V4 系列在夜间低谷时段输入单价更低，适合批量任务安排在低价时段执行。具体时段与价格以控制台配置为准。</p>

<h2>额度不足怎么办？</h2>
<p>调用时将返回 <code>402 QUOTA_EXCEEDED</code>，提示额度不足。请及时联系管理员在控制台充值 / 调整额度，系统通过行级锁保证扣减准确，不会出现超扣。</p>

<h2>如何查看用量与费用？</h2>
<p>登录管理控制台进入「用量统计 / 成本报告」：支持按时间范围查看 Token 消耗、费用汇总与明细，并可导出报表。每次调用的模型、Provider、延迟、状态均有记录。</p>

<h2>支持哪些支付方式？</h2>
<p>当前以额度分配制为主，由管理员统一管理。企业客户可联系销售团队沟通月结账期、专属折扣等商务方案。</p>
`,
        },
        {
          id: 'faq-models',
          title: '模型问题',
          content: `
<h2>支持哪些 AI 模型？</h2>
<p>平台已配置 OpenAI、Anthropic、Google、xAI、DeepSeek、智谱 GLM、通义千问、月之暗面、Meta、腾讯、Mistral 等主流厂商的模型，并在持续更新。实际可用模型以控制台配置为准，也可通过 <code>GET /v1/models</code> 实时查询。</p>

<h2>如何新增或更换模型？</h2>
<p>由管理员在控制台「模型管理」中配置：新增模型需定义模型名称、绑定一个或多个 Provider（含 API 地址、密钥、优先级 / 权重），并可设置定价与峰谷时段。配置即时生效。</p>

<h2>为什么提示模型未授权？</h2>
<p>返回 <code>403 MODEL_FORBIDDEN</code> 说明当前账户 / API Key 未被授权调用该模型。平台支持模型白名单控制，请联系管理员在账户配置中为该用户开放对应模型。</p>

<h2>支持 Function Calling 吗？</h2>
<p>网关会将 <code>tools</code> / <code>functions</code> 参数完整透传给上游 Provider，是否生效取决于所调用模型本身的能力。若模型原生支持工具调用，即可正常使用。</p>

<h2>同一个模型可以绑定多个厂商吗？</h2>
<p>可以。同一个模型可绑定多个 Provider 并配置优先级 / 权重，实现负载分配与故障自动切换：主用 Provider 不可用时，请求自动切换到备用 Provider，业务无感。</p>
`,
        },
      ],
    },
  ],
}

export default docContent
