import type { PricingCard } from '@/types'

export const pricingCards: PricingCard[] = [
  {
    id: 'pay-as-you-go',
    title: '按量计费',
    subtitle: '用多少 · 付多少',
    description: '按实际消耗的 Token 数量计费，无需预付订阅，无月费、无最低消费。',
    features: [
      '无订阅费 / 无月费',
      '输入 / 输出 Token 分开计价',
      '流式请求同样按最终用量计费',
    ],
    cta: '免费开始',
    isPopular: true,
  },
  {
    id: 'cost-control',
    title: '成本可控',
    subtitle: '实时可查 · 随时掌控',
    description: '控制台实时展示每一笔用量与费用明细，成本一目了然，杜绝超支。',
    features: [
      '用量与费用实时查看',
      '按模型 / 按日汇总统计',
      '额度预警与自动熔断',
    ],
    cta: '免费开始',
  },
  {
    id: 'free-trial',
    title: '免费体验',
    subtitle: '开通即送 · 零门槛',
    description: '开通账号即赠送体验额度，先体验再付费，无需预付即可完整体验平台能力。',
    features: [
      '开通即送体验额度',
      '全模型访问体验',
      '5 分钟快速接入',
    ],
    cta: '免费开始',
  },
]
