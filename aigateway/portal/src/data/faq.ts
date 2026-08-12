import type { FaqItem } from '@/types'

export const faqData: FaqItem[] = [
  {
    id: 'faq-1',
    question: '如何接入 Nova AI Gateway？',
    answer:
      '只需 3 步：① 登录 Admin 控制台获取 API Key；② 将您的请求 base_url 指向 http://api.starnov.cn/v1；③ 传入 model 名称即可调用对应模型。完全兼容 OpenAI SDK，通常 5 分钟内即可完成接入。',
  },
  {
    id: 'faq-2',
    question: 'API 兼容 OpenAI 格式吗？',
    answer:
      '是的。Nova AI Gateway 完全兼容 OpenAI Chat Completions 接口规范。您可以直接使用 OpenAI 的 Python SDK、Node.js SDK、cURL 等工具无缝切换，只需修改 base_url 和 api_key 即可。同时支持 Stream 流式响应模式。',
  },
  {
    id: 'faq-3',
    question: '支持哪些 AI 模型？',
    answer:
      '目前已接入 DeepSeek（R1/V3）、智谱（GLM-4）等主流模型。平台支持灵活接入新模型，您可以在 Admin 控制台中查看最新模型列表。',
  },
  {
    id: 'faq-4',
    question: '如何计费？支持哪些支付方式？',
    answer:
      '采用按量计费模式，按实际 Token 消耗计费（区分输入和输出）。注册即赠送体验额度。企业客户可申请月结账期和专属折扣。详情请联系销售团队了解支付方式。',
  },
  {
    id: 'faq-5',
    question: '数据传输是否安全？会不会泄露我的 Prompt？',
    answer:
      'Nova AI Gateway 采用即时转发架构，不持久保存任何 Prompt 数据。所有传输均使用 TLS 1.3 加密。同时记录每一次 API 调用的元数据（不记录内容），满足企业合规需求。',
  },
  {
    id: 'faq-6',
    question: '故障自动切换是如何工作的？',
    answer:
      '当主用 Provider 返回错误或超时时，系统会自动按配置的优先级顺序切换至备用 Provider。您可以在模型中绑定多个 Provider 并设置权重，权重高的优先分配流量，失败时自动尝试下一个。整个过程对用户透明，业务无感。',
  },
  {
    id: 'faq-7',
    question: '是否支持多 API Key 管理和权限控制？',
    answer:
      '支持。Admin 控制台提供完整的 API Key 生命周期管理，可创建多个 Key 并分别设置：① 额度上限；② 可调用的模型白名单；③ 关联的子账户。同时内置角色权限体系，支持管理员、操作员、只读用户等角色。',
  },
  {
    id: 'faq-8',
    question: '是否支持 Function Calling 和工具调用？',
    answer:
      'Gateway 会将 tools/functions 参数完整透传给 Provider。具体是否支持 Function Calling 取决于您调用的 Provider 本身的能力，建议查阅对应 Provider 的文档。',
  },
  {
    id: 'faq-9',
    question: '企业客户有什么特殊支持？',
    answer:
      '企业客户可享受：① 专属技术支持群（7×24h）；② 私有化部署方案；③ 月结账期与用量折扣。详情请联系售前团队。',
  },
  {
    id: 'faq-10',
    question: '是否支持 Anthropic 协议？',
    answer:
      '支持。网关同时提供 Anthropic Messages 兼容端点（POST /v1/messages）。可直接使用 Anthropic 官方 Python / Node SDK，仅需把 base_url 指向 https://api.starnov.cn、api_key 替换为网关 Key、model 替换为网关模型名称即可，支持流式与工具调用。',
  },
]
