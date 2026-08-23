import type { Feature } from '@/types'

export const features: Feature[] = [
  {
    id: 'unified-api',
    iconName: 'Layers',
    title: '统一 API，自由切换',
    highlight: '兼容 OpenAI 接口规范',
    description:
      '告别不同大模型 SDK 的繁琐封装。Nova AI Gateway 完全兼容 OpenAI 接口规范，只需变更 model 名称即可在数秒内切换任意模型。',
    details: [
      '兼容 OpenAI Chat Completions 标准接口',
      '多模型统一接入，零改造迁移',
      '统一的鉴权、计费与流控体系',
    ],
    metrics: '统一接入',
  },
  {
    id: 'auto-fallback',
    iconName: 'ShieldCheck',
    title: '多 Provider 自动故障切换',
    highlight: '服务连续不中断',
    description:
      '当主用 Provider 返回错误或超时时，系统自动按优先级顺序切换至备用 Provider，整个过程对用户透明，业务无感。',
    details: [
      '多 Provider 自动容灾切换',
      '按优先级/权重自动路由选择',
      '可配置多组 Provider 绑定',
    ],
    metrics: '自动切换',
  },
  {
    id: 'pay-per-use',
    iconName: 'Zap',
    title: '按量计费，与厂商同价',
    highlight: 'Token 级精确计费',
    description:
      '按实际 Token 消耗计费，精确区分输入（Prompt）和输出（Completion）Token。对外报价与大模型厂商官方价格一致、不加价，所有费用在控制台实时可查。',
    details: [
      '精确区分输入/输出 Token 计费',
      '价格与厂商官方一致，零加价',
      '实时用量监控与费用明细',
    ],
    metrics: '按量付费',
  },
  {
    id: 'streaming-support',
    iconName: 'Terminal',
    title: 'SSE 流式响应支持',
    highlight: '完整流式转发',
    description:
      '完整支持 SSE（Server-Sent Events）流式响应，实时转发 Provider 的流式输出。流式计费精度与普通请求一致，从最后一块数据中精确解析 Token 用量，不遗漏任何费用。',
    details: [
      '完整 SSE 流式代理转发',
      '流式场景 Token 级精确计费',
      '实时监控流式响应状态',
    ],
    metrics: 'SSE',
  },
  {
    id: 'developer-experience',
    iconName: 'Terminal',
    title: '丝滑极致的开发者体验',
    highlight: '5 分钟零改造接入',
    description:
      '极简配置。提供原生 HTTP 直连支持，兼容 OpenAI 原生 SDK。只需修改 base_url 和 api_key，5 分钟内即可完成接入。',
    details: [
      '兼容 OpenAI 原生 SDK',
      '每次 API 调用的请求日志记录',
      '支持多语言 cURL/Python/JS/Go 示例',
    ],
    metrics: '5 min',
  },
  {
    id: 'api-key-management',
    iconName: 'Lock',
    title: 'API Key 管理与权限控制',
    highlight: '多 Key + 额度限制',
    description:
      '支持创建多个 API Key，每个 Key 可独立设置额度上限和模型访问白名单。内置角色权限体系，支持管理员、操作员等不同角色，满足团队协作需求。',
    details: [
      '多 API Key 独立管理',
      '额度上限与模型白名单控制',
      '请求日志审计记录',
    ],
    metrics: '安全可控',
  },
]
