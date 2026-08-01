import type { InfrastructureItem } from '@/types'

export const infrastructureData: InfrastructureItem[] = [
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
]

export const globalRegions = [
  'US-West (Silicon Valley)',
  'US-East (N. Virginia)',
  'EU-Central (Frankfurt)',
  'AP-East (Hong Kong)',
  'AP-Northeast (Tokyo)',
  'AP-Southeast (Singapore)',
  'AU-East (Sydney)',
]
