<script setup lang="ts">
// 产品详情 · 分段子组件 5/9 —— AI 差异化设计方案（原型 TAB: diff）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx
import { Layers, CheckCircle2 } from 'lucide-vue-next'
import type { ProductOpportunity } from '@/data/ecomIntelData'

defineProps<{
  product: ProductOpportunity
}>()
</script>

<template>
  <section class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
    <!-- Section 头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <Layers class="w-5 h-5 text-indigo-400" />
          <span>产品差异化建议 (如果你做这个产品，建议这样设计)</span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          围绕“防漏 + 易清洗 + 便携大容量”打造高壁垒私模与功能创新
        </p>
      </div>
    </div>

    <!-- 差异化功能网格 -->
    <div v-if="product.differentiationFeatures.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="feat in product.differentiationFeatures"
        :key="feat.id"
        class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-500/50 transition"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
              {{ feat.featureNumber }}
            </span>
            <span class="text-[10px] text-slate-400">
              开模难度: <span class="text-slate-200 font-semibold">{{ feat.techDifficulty }}</span>
            </span>
          </div>
          <h3 class="text-sm font-bold text-white">{{ feat.name }}</h3>
          <p class="text-xs text-slate-300 leading-relaxed">{{ feat.description }}</p>
        </div>
        <div class="p-2 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-[11px] text-indigo-300">
          <span class="font-semibold">买家价值: </span>{{ feat.userBenefit }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500"
    >
      暂无差异化设计方案数据
    </div>

    <!-- AI 选品架构师总结 -->
    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
      <div class="font-bold text-white flex items-center gap-1.5">
        <CheckCircle2 class="w-4 h-4 text-emerald-400" />
        <span>AI 选品架构师总结：</span>
      </div>
      <p class="text-slate-300 leading-relaxed">{{ product.differentiationSummary }}</p>
    </div>
  </section>
</template>
