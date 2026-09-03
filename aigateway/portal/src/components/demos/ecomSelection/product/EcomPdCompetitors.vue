<script setup lang="ts">
// 产品详情 · 分段子组件 3/9 —— 竞品分析与竞争格局（原型 TAB: competitors）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx
// 竞品售价随容器 currency（USD $ / CNY ¥×7.2）切换
import { computed } from 'vue'
import { Swords, Sparkles } from 'lucide-vue-next'
import type { ProductOpportunity, Currency, CompetitorItem } from '@/data/ecomIntelData'

const props = defineProps<{
  product: ProductOpportunity
  currency: Currency
}>()

const fmtPrice = (v: number): string =>
  props.currency === 'CNY' ? `¥${(v * 7.2).toFixed(1)}` : `$${v.toFixed(2)}`

const tierStats = computed(() => [
  { label: '主要竞品总数', value: `${props.product.competitorsOverview.total} 款`, sub: '类目活跃在售', cls: 'text-indigo-400' },
  { label: '头部垄断竞品', value: `${props.product.competitorsOverview.head} 款`, sub: 'Reviews > 5000+', cls: 'text-rose-400' },
  { label: '中等体量竞品', value: `${props.product.competitorsOverview.mid} 款`, sub: 'Reviews 1000-5000', cls: 'text-amber-400' },
  { label: '长尾腰部竞品', value: `${props.product.competitorsOverview.longTail} 款`, sub: 'Reviews < 1000', cls: 'text-emerald-400' },
])

const levelClass = (comp: CompetitorItem): string =>
  comp.competitionLevel === '高'
    ? 'bg-rose-500/20 text-rose-300'
    : 'bg-amber-500/20 text-amber-300'
</script>

<template>
  <section class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
    <!-- Section 头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <Swords class="w-5 h-5 text-indigo-400" />
          <span>竞品分析与竞争格局 (Competitor Intelligence Map)</span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">扫描类目下所有主要竞品分布与核心垄断度</p>
      </div>
    </div>

    <!-- 竞品分层分布卡 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div v-for="t in tierStats" :key="t.label" class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
        <div class="text-[11px] text-slate-400">{{ t.label }}</div>
        <div class="text-xl font-bold font-mono" :class="t.cls">{{ t.value }}</div>
        <div class="text-[10px] text-slate-400">{{ t.sub }}</div>
      </div>
    </div>

    <!-- 代表性竞品对比表 -->
    <div class="space-y-3">
      <div class="text-xs font-bold text-slate-300">代表性竞品对比表 (Benchmarking Table)</div>
      <div v-if="product.competitorsList.length" class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs min-w-[860px]">
          <thead class="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th class="py-2.5 px-3">竞品名称 / ASIN</th>
              <th class="py-2.5 px-3 text-right">售价</th>
              <th class="py-2.5 px-3 text-center">Rating 评分</th>
              <th class="py-2.5 px-3 text-right">Reviews 评论数</th>
              <th class="py-2.5 px-3 text-center">估算月销量</th>
              <th class="py-2.5 px-3 text-center">竞争程度</th>
              <th class="py-2.5 px-3">主要优势与缺陷</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-slate-900/60">
            <tr v-for="comp in product.competitorsList" :key="comp.id" class="hover:bg-slate-800/40 transition">
              <td class="py-3 px-3">
                <div class="font-bold text-white">{{ comp.name }}</div>
                <div class="text-[10px] font-mono text-indigo-400">{{ comp.asin }} · {{ comp.brand }}</div>
              </td>
              <td class="py-3 px-3 font-mono font-semibold text-white text-right">{{ fmtPrice(comp.price) }}</td>
              <td class="py-3 px-3 text-center">
                <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono font-bold">★ {{ comp.rating }}</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-300 text-right">{{ comp.reviews.toLocaleString() }}</td>
              <td class="py-3 px-3 text-center">
                <span class="text-[11px] font-medium text-slate-200">{{ comp.estimatedMonthlySales }}</span>
              </td>
              <td class="py-3 px-3 text-center">
                <span class="text-[10px] px-2 py-0.5 rounded font-bold" :class="levelClass(comp)">
                  {{ comp.competitionLevel }}
                </span>
              </td>
              <td class="py-3 px-3 text-[11px] min-w-[240px]">
                <div class="text-emerald-400">✓ {{ comp.mainPros }}</div>
                <div class="text-rose-400">✗ {{ comp.mainCons }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
        暂无代表性竞品样本数据
      </div>
    </div>

    <!-- AI 竞争策略建议 -->
    <div class="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-1.5">
      <div class="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
        <Sparkles class="w-3.5 h-3.5" />
        <span>AI 竞争策略建议 (AI Competitive Strategy)</span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">{{ product.competitorAiStrategy }}</p>
    </div>
  </section>
</template>
