import { ModelInfo } from '../types';

// ============================================================
// CODE SAMPLES — Hero 区代码展示
// ============================================================
export const CODE_SAMPLES = [
  {
    lang: 'python',
    label: 'Python SDK',
    filename: 'client.py',
    code: `from openai import OpenAI

client = OpenAI(
    api_key="nv_sk-xxxxxxxxxxxxxxxx",
    base_url="https://api.novagateway.ai/v1"
)

# 智能路由至最优模型
response = client.chat.completions.create(
    model="deepseek-r1",  # 自动故障切换
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.choices[0].message.content)`,
  },
  {
    lang: 'javascript',
    label: 'JavaScript SDK',
    filename: 'client.js',
    code: `import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: "nv_sk-xxxxxxxxxxxxxxxx",
    baseURL: "https://api.novagateway.ai/v1"
});

// 智能路由至最优模型
const response = await client.chat.completions.create({
    model: "deepseek-r1",  // 自动故障切换
    messages: [{ role: "user", content: "Hello" }]
});
console.log(response.choices[0].message.content);`,
  },
  {
    lang: 'curl',
    label: 'cURL',
    filename: 'request.sh',
    code: `curl https://api.novagateway.ai/v1/chat/completions \\
  -H "Authorization: Bearer nv_sk-xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-r1",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
  },
  {
    lang: 'go',
    label: 'Go SDK',
    filename: 'client.go',
    code: `package main

import (
    "context"
    openai "github.com/sashabaranov/go-openai"
)

func main() {
    client := openai.NewClientWithConfig(
        openai.DefaultConfig(
            "nv_sk-xxxxxxxxxxxxxxxx",
            "https://api.novagateway.ai/v1",
        ),
    )

    resp, _ := client.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model: "deepseek-r1",
            Messages: []openai.ChatCompletionMessage{
                {Role: "user", Content: "Hello"},
            },
        },
    )
    println(resp.Choices[0].Message.Content)
}`,
  },
];

// ============================================================
// FEATURES_DATA — 产品特性（6 大卡片）
// ============================================================
export const FEATURES_DATA = [
  {
    id: 'unified-api',
    iconName: 'Layers',
    title: '统一 API，无限模型',
    highlight: '一次接入，自由切换',
    description:
      '告别不同大模型 SDK 的繁琐封装。Nova AI Gateway 完全兼容 OpenAI 接口规范，只需变更 model 名称即可在数秒内切换任意模型。',
    details: [
      '支持 Function Calling 与 JSON Mode',
      '50+ 模型统一接入，零改造迁移',
      '统一的鉴权、计费与流控体系',
    ],
    metrics: '50+ Models',
  },
  {
    id: 'smart-routing',
    iconName: 'Cpu',
    title: '智能企业级模型路由',
    highlight: '动态调度，高可用保障',
    description:
      '根据实时节点延迟、成功率动态调整路由策略。遇到厂商波动时，极速平滑热切换至备用模型，保障核心体验。',
    details: [
      '毫秒级故障自动切流',
      '基于延迟/成本的智能调度',
      '支持 A/B 测试与灰度发布',
    ],
    metrics: '< 5ms',
  },
  {
    id: 'stability',
    iconName: 'ShieldCheck',
    title: '金融级网关稳定性',
    highlight: '99.99% SLA 保障',
    description:
      '自建全球多地域分发网络，具备请求断路器、指数重试与智能限流策略。为企业级负载提供坚如磐石的可靠保证。',
    details: [
      '自建全球 Anycast 分发网络',
      '请求断路器与指数退避重试',
      '多级限流与熔断保护',
    ],
    metrics: '99.99%',
  },
  {
    id: 'cost-optimization',
    iconName: 'Zap',
    title: '显著降低推理成本',
    highlight: '语义缓存，直降 40-70%',
    description:
      '融合语义精准缓存架构，面对高频相似请求直接返回结果。无需调用大模型，每百万次 Token 调用可省下 40-70% 费用。',
    details: [
      '语义级精准缓存命中',
      '后置成本的自动路由策略',
      '详细的可视化成本分析报表',
    ],
    metrics: '-70%',
  },
  {
    id: 'developer-experience',
    iconName: 'Terminal',
    title: '丝滑极致的开发者体验',
    highlight: '5 分钟零改造接入',
    description:
      '极简配置。提供 SDK 及原生 HTTP 直连支持。开箱即用的 Playground 支持即时的调试、参数监控与流式结果展示。',
    details: [
      '兼容 OpenAI 原生 SDK',
      '在线 API 沙盒即时调试',
      '实时日志与调用链路追踪',
    ],
    metrics: '5 min',
  },
  {
    id: 'security',
    iconName: 'Lock',
    title: '企业合规与安全边界',
    highlight: '数据完全由您掌控',
    description:
      '拥有您数据的完全控制。含高级审计日志、子账户角色访问鉴权（RBAC），并可针对合规需求锁定数据路由物理区域。',
    details: [
      '完整的审计日志记录',
      'RBAC 角色权限体系',
      '数据路由区域锁定',
    ],
    metrics: 'SOC 2',
  },
];

// ============================================================
// MODELS_DATA — 模型列表
// ============================================================
export const MODELS_DATA: ModelInfo[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'OpenAI 最新多模态旗舰模型，支持文本、图像、音频理解与生成。综合能力最强，适用于复杂推理与创意任务。',
    contextWindow: '128K',
    avgLatency: '0.8s',
    inputPrice: '¥15 / M Tokens',
    outputPrice: '¥60 / M Tokens',
    capabilities: ['多模态', 'Function Call', 'Stream', 'JSON Mode', 'Vision'],
    badge: '旗舰',
    isPopular: true,
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Anthropic 最新版本，在编程、代码生成和长文档理解方面表现卓越，安全性领先。',
    contextWindow: '200K',
    avgLatency: '1.2s',
    inputPrice: '¥20 / M Tokens',
    outputPrice: '¥80 / M Tokens',
    capabilities: ['代码生成', '长文本', 'Vision', 'Function Call'],
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    description: '深度求索最新推理模型，在数学、代码和逻辑推理方面达到国际领先水平，中文能力优秀。',
    contextWindow: '128K',
    avgLatency: '1.5s',
    inputPrice: '¥2 / M Tokens',
    outputPrice: '¥8 / M Tokens',
    capabilities: ['推理', '代码', '数学', 'Stream'],
    badge: '性价比之王',
    isPopular: true,
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    description: 'DeepSeek 通用对话模型，在自然对话和内容创作方面表现优异，具备极高的性价比。',
    contextWindow: '64K',
    avgLatency: '0.6s',
    inputPrice: '¥1 / M Tokens',
    outputPrice: '¥4 / M Tokens',
    capabilities: ['对话', '创作', '翻译', 'Stream'],
  },
  {
    id: 'glm-4-plus',
    name: 'GLM-4-Plus',
    provider: '智谱 GLM',
    description: '智谱 AI 最新旗舰模型，中英文综合能力全面升级，支持长达 1M Token 的超长上下文处理。',
    contextWindow: '1M',
    avgLatency: '1.0s',
    inputPrice: '¥10 / M Tokens',
    outputPrice: '¥30 / M Tokens',
    capabilities: ['超长上下文', 'Function Call', 'Stream', 'Vision'],
    badge: '1M 上下文',
  },
  {
    id: 'qwen-2.5-72b',
    name: 'Qwen 2.5-72B',
    provider: '通义千问',
    description: '阿里通义千问最大参数版本，中文能力业界领先，在理解和生成任务上表现均衡出色。',
    contextWindow: '128K',
    avgLatency: '0.9s',
    inputPrice: '¥4 / M Tokens',
    outputPrice: '¥12 / M Tokens',
    capabilities: ['中文优', '代码', 'Function Call', 'Stream'],
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Google 最新快速模型，极低延迟同时保持优秀的理解与生成能力，多模态输入。',
    contextWindow: '1M',
    avgLatency: '0.5s',
    inputPrice: '¥5 / M Tokens',
    outputPrice: '¥20 / M Tokens',
    capabilities: ['多模态', '低延迟', 'Stream', 'Vision'],
    badge: '极速',
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: 'Meta 最新开源大模型，在推理、代码生成和指令遵循方面达到闭源模型级别水平。',
    contextWindow: '128K',
    avgLatency: '1.1s',
    inputPrice: '¥3 / M Tokens',
    outputPrice: '¥10 / M Tokens',
    capabilities: ['开源', '推理', '代码', '多语言'],
  },
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    description: 'Mistral 最新旗舰模型，在多语言任务和代码生成方面表现突出，支持 Function Calling。',
    contextWindow: '128K',
    avgLatency: '1.3s',
    inputPrice: '¥8 / M Tokens',
    outputPrice: '¥32 / M Tokens',
    capabilities: ['多语言', '代码', 'Function Call', 'Stream'],
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Anthropic 最快模型，极低延迟适合实时对话场景，在指令遵循方面表现优秀。',
    contextWindow: '200K',
    avgLatency: '0.4s',
    inputPrice: '¥5 / M Tokens',
    outputPrice: '¥25 / M Tokens',
    capabilities: ['低延迟', '指令遵循', '长文本', 'Vision'],
  },
];

// ============================================================
// INFRA_DATA — 基础设施（4 个支柱）
// ============================================================
export const INFRA_DATA = [
  {
    id: 'global-distribution',
    iconName: 'Globe',
    title: '全球智能分发',
    subtitle: 'Anycast · 32+ 边缘节点',
    description:
      '基于智能算法就近分配入口及降级节点，大幅缩短物理连接延迟。支持美西、欧洲、亚太等 32+ 全球地域就近接入。',
    stats: '< 20ms',
    statsLabel: '全球平均延迟',
    features: [
      '全球 Anycast 路由，就近接入',
      '多云节点容灾，故障自动切换',
      'BGP Anycast 任播技术，网络路径最优',
    ],
  },
  {
    id: 'low-latency',
    iconName: 'Gauge',
    title: '超低延迟设计',
    subtitle: 'Rust 内核 · 流式加速',
    description:
      '以底层 Rust 语言优化转发链路，对流式回复有特殊网络加速。网关额外中间代理延时控制在 5ms 以内。',
    stats: '< 5ms',
    statsLabel: '网关额外延时',
    features: [
      'Rust 高性能代理内核',
      'SSE 流式传输专线加速',
      '连接池复用，减少握手开销',
    ],
  },
  {
    id: 'cache-acceleration',
    iconName: 'Database',
    title: '分层精细缓存',
    subtitle: '语义缓存 · 命中率 45%+',
    description:
      '自适应拦截同质化请求，语义级缓存精准匹配。在特定高频场景中，缓存命中率可达 60% 以上，大幅降低推理成本。',
    stats: '45%+',
    statsLabel: '平均缓存命中率',
    features: [
      '语义级 Embedding 相似度匹配',
      '多级缓存（L1/L2/L3）分层架构',
      'TTL 智能过期与主动预热',
    ],
  },
  {
    id: 'auto-scaling',
    iconName: 'Server',
    title: '自动弹性扩容',
    subtitle: 'K8s · 从 0 到百万 QPS',
    description:
      '从极少量请求至瞬发百万流量高峰，后端均提供无感热拓展。基于实际负载自动扩缩容，无需人工干预。',
    stats: '0 → ∞',
    statsLabel: '弹性伸缩范围',
    features: [
      '基于 K8s HPA 的自动扩缩容',
      '请求突发缓冲与队列管理',
      '无感热更新，零停机部署',
    ],
  },
];

// ============================================================
// FAQ_DATA — 常见问题
// ============================================================
export const FAQ_DATA = [
  {
    id: 'faq-1',
    question: '如何接入 Nova AI Gateway？',
    answer:
      '只需 3 步：① 登录 Admin 控制台获取 API Key；② 将您的请求 base_url 指向 https://api.novagateway.ai/v1；③ 传入 model 名称即可调用对应模型。完全兼容 OpenAI SDK，通常 5 分钟内即可完成接入。',
  },
  {
    id: 'faq-2',
    question: 'API 兼容 OpenAI 格式吗？',
    answer:
      '是的。Nova AI Gateway 完全兼容 OpenAI Chat Completions 接口规范。您可以直接使用 OpenAI 的 Python SDK、Node.js SDK、cURL 等工具无缝切换，只需修改 base_url 和 api_key 即可。同时支持 Function Calling、Stream、JSON Mode 等全部特性。',
  },
  {
    id: 'faq-3',
    question: '支持哪些 AI 模型？',
    answer:
      '目前已接入 50+ 主流模型，包括 OpenAI（GPT-4o/o1）、Anthropic（Claude 3.5）、DeepSeek（R1/V3）、智谱（GLM-4）、阿里通义（Qwen 2.5）、Google（Gemini 2.0）、Meta（Llama 3.3）、Mistral AI 等。覆盖对话、推理、代码、多模态、向量嵌入等全场景。',
  },
  {
    id: 'faq-4',
    question: '如何计费？支持哪些支付方式？',
    answer:
      '采用按量计费模式，按实际 Token 消耗计费（区分输入和输出）。注册即赠送 1,000,000 Tokens 体验额度。支持支付宝、微信支付、银行对公转账。企业客户可申请月结账期和专属折扣。',
  },
  {
    id: 'faq-5',
    question: '数据传输是否安全？会不会泄露我的 Prompt？',
    answer:
      '绝对安全。Nova AI Gateway 采用即时转发架构，不持久保存任何 Prompt 数据。所有传输均使用 TLS 1.3 加密。同时提供完整的审计日志，记录每一次 API 调用的元数据（不记录内容），满足企业合规需求。',
  },
  {
    id: 'faq-6',
    question: '故障自动切换是如何工作的？',
    answer:
      '当主调模型返回错误或超时时，系统会在毫秒级自动切换到您配置的备用模型。支持多种切换策略：① 按优先级顺序切换；② 按最低延迟切换；③ 按最低成本切换。整个过程对用户透明，业务无感。',
  },
  {
    id: 'faq-7',
    question: '语义缓存能省多少钱？',
    answer:
      '语义缓存对高频相似请求场景效果显著。例如客服对话、内容审核等场景，缓存命中率可达 45-60%。以 GPT-4o 为例，每百万次请求通过缓存可节省 40-70% 的费用。您可以在 Admin 控制台中查看实时缓存命中率和节省金额。',
  },
  {
    id: 'faq-8',
    question: '是否支持 Function Calling 和工具调用？',
    answer:
      '完全支持。Nova AI Gateway 完整透传 OpenAI 标准的 Function Calling（工具调用）参数。您可以直接在请求中传入 tools/functions 参数，无论是 GPT-4o、Claude 3.5 还是 DeepSeek 系列均可正常使用。',
  },
  {
    id: 'faq-9',
    question: '企业客户有什么特殊支持？',
    answer:
      '企业客户可享受：① 专属技术支持群（7×24h）；② 定制化 SLA 保障（最高 99.99%）；③ 私有化部署方案；④ 月结账期与用量折扣；⑤ 数据路由区域锁定（满足 GDPR 等合规要求）。详情请联系售前团队。',
  },
  {
    id: 'faq-10',
    question: '是否支持多 API Key 管理和权限控制？',
    answer:
      '支持。Admin 控制台提供完整的 API Key 生命周期管理，可创建多个 Key 并分别设置：① 额度上限；② 可调用的模型白名单；③ 关联的子账户。同时内置 RBAC 角色权限体系，支持管理员、操作员、只读用户等角色。',
  },
];

// ============================================================
// PRICING_PLANS — 定价套餐
// ============================================================
export const PRICING_PLANS = [
  {
    id: 'starter',
    name: '入门版',
    price: '免费',
    period: '永久',
    description: '适合个人开发者体验和测试',
    features: [
      '1,000,000 Tokens 免费额度',
      '10 个 API Key',
      '基础模型访问权限',
      '每日 10,000 次请求限制',
      '社区支持',
    ],
    cta: '免费开始',
    isPopular: false,
  },
  {
    id: 'professional',
    name: '专业版',
    price: '¥299',
    period: '/月',
    description: '适合中小团队和生产环境',
    features: [
      '5,000,000 Tokens/月 基础配额',
      '无限 API Key',
      '全模型访问权限',
      '语义缓存加速',
      '智能故障切换',
      '实时用量监控与告警',
      '邮件技术支持',
    ],
    cta: '立即开通',
    isPopular: true,
    badge: '推荐',
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: '定制',
    period: '',
    description: '适合大规模企业和定制化需求',
    features: [
      '按需定制 Token 配额',
      '专属 SLA 保障 (99.99%)',
      '私有化部署可选',
      '数据路由区域锁定',
      '专属技术支持群 7×24h',
      '月结账期与用量折扣',
      '定制化模型路由策略',
    ],
    cta: '联系销售',
    isPopular: false,
  },
];
