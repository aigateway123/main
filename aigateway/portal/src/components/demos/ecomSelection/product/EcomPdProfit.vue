<script setup lang="ts">
// 产品详情 · 分段子组件 6/9 —— 动态利润计算器（原型 TAB: profit）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx
// 内嵌模拟器以共享 EcomProfitSimulator 替换（seed 由 product 经济参数组装，模拟器自身渲染完整测算网格）
import { computed } from 'vue'
import { Calculator } from 'lucide-vue-next'
import type { ProductOpportunity } from '@/data/ecomIntelData'
import EcomProfitSimulator from '../EcomProfitSimulator.vue'

const props = defineProps<{
  product: ProductOpportunity
}>()

const profitSeed = computed(() => ({
  sellingPrice: props.product.sellingPrice,
  sourcingCost: props.product.sourcingCost,
  shippingCost: props.product.shippingCost,
  platformFee: props.product.platformFee,
  adCost: props.product.adCost,
  otherCost: props.product.otherCost,
}))
</script>

<template>
  <section class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
    <!-- Section 头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <Calculator class="w-5 h-5 text-indigo-400" />
          <span>AI 利润计算器与销量模拟 (Live Profit Simulator)</span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          支持实时滑动调整售价、采购成本、物流与广告费用，实时计算单件利润与月度 ROI
        </p>
      </div>
    </div>

    <!-- 共享利润测算器（seed = 产品真实经济参数） -->
    <EcomProfitSimulator :seed="profitSeed" />
  </section>
</template>
