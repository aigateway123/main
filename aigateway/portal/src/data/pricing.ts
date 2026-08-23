import type { PricingCard } from '@/types'

export const pricingCards: PricingCard[] = [
  {
    id: 'same-price',
    title: '厂商同价',
    subtitle: '零加价 · 价格透明',
    description: '对接哪个大模型，对外就按该模型的官方价格收费，中间不加一分钱。',
    features: [
      '价格与大模型厂商官方一致',
      '输入 / 输出 Token 分开计价',
      '无任何隐藏费用',
    ],
    cta: '免费开始',
    isPopular: true,
  },
  {
    id: 'pay-as-you-go',
    title: '按量计费',
    subtitle: '用多少 · 付多少',
    description: '按实际消耗的 Token 数量计费，无需预付订阅，无月费、无最低消费。',
    features: [
      '无订阅费 / 无月费',
      '流式请求同样按最终用量计费',
      '图像生成按张数计费',
    ],
    cta: '免费开始',
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
    cta: '联系企业顾问',
  },
]
