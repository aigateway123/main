<script setup lang="ts">
// 产品详情 · 分段子组件 2/9 —— 市场需求与 12 个月搜索趋势（原型 TAB: demand）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx
// 趋势折线复用共享 EcomMiniSparkline，月度柱状保留原型 12M bar chart 语义
import { computed } from 'vue'
import { TrendingUp, Sparkles } from 'lucide-vue-next'
import type { ProductOpportunity } from '@/data/ecomIntelData'
import EcomMiniSparkline from '../EcomMiniSparkline.vue'

const props = defineProps<{
  product: ProductOpportunity
}>()

const maxVolume = computed(() => Math.max(...props.product.searchTrend12M.map((m) => m.volume), 1))
const sparkIndex = computed(() => props.product.searchTrend12M.map((m) => m.index))

const peakMonth = computed(() => {
  const arr = props.product.searchTrend12M
  return arr.length ? arr.reduce((a, b) => (b.volume > a.volume ? b : a), arr[0]) : null
})

const lastMonth = computed(() => {
  const arr = props.product.searchTrend12M
  return arr.length ? arr[arr.length - 1] : null
})

const avgVolume = computed(() => {
  const arr = props.product.searchTrend12M
  if (!arr.length) return 0
  return Math.round(arr.reduce((sum, m) => sum + m.volume, 0) / arr.length)
})

const barHeightPct = (volume: number): number => Math.round((volume / maxVolume.value) * 100)
const isPeak = (volume: number): boolean => volume === peakMonth.value?.volume
</script>

<template>
  <section class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
    <!-- Section 头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp class="w-5 h-5 text-indigo-400" />
          <span>市场需求分析 (Market Demand & 12-Month Search Trend)</span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          基于 Amazon 站内搜索词与 Google Trends 过去 12 个月搜索指数拟合
        </p>
      </div>
      <div
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono w-fit"
      >
        <span>搜索热度 {{ product.searchGrowth }} YoY</span>
      </div>
    </div>

    <!-- 趋势主体：左 12M 柱状图 / 右 MiniSparkline 指数走势 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- 12-Month Bar Chart -->
      <div class="lg:col-span-8 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
        <div class="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>过去 12 个月月度搜索量趋势图 (Search Volume Trend)</span>
          <span class="text-slate-400">单位：次/月</span>
        </div>

        <div v-if="product.searchTrend12M.length" class="h-44 flex items-end gap-1.5 sm:gap-2 px-1">
          <div
            v-for="m in product.searchTrend12M"
            :key="m.month"
            class="group flex-1 h-full flex flex-col items-center justify-end gap-1.5 min-w-0"
          >
            <!-- Hover Tooltip -->
            <div
              class="opacity-0 group-hover:opacity-100 transition text-[10px] font-mono text-indigo-300 bg-indigo-950/90 px-1.5 py-0.5 rounded border border-indigo-800 pointer-events-none"
            >
              {{ m.volume.toLocaleString() }}
            </div>
            <div class="w-full h-24 bg-slate-800/80 rounded-md overflow-hidden flex items-end p-0.5">
              <div
                class="w-full rounded transition-all duration-500"
                :class="isPeak(m.volume) ? 'bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-lg shadow-cyan-500/30' : 'bg-indigo-600/70 group-hover:bg-indigo-500'"
                :style="{ height: `${barHeightPct(m.volume)}%` }"
              ></div>
            </div>
            <span class="text-[10px] font-mono text-slate-500 group-hover:text-white">{{ m.month }}</span>
          </div>
        </div>
        <div v-else class="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
          暂无搜索趋势数据
        </div>
      </div>

      <!-- 12M 热度指数走势摘要 -->
      <div class="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div class="text-xs font-semibold text-slate-300">
          12M 热度指数走势 (Google Trends Index)
        </div>
        <div v-if="product.searchTrend12M.length" class="flex justify-center py-3 bg-slate-900/60 rounded-lg border border-slate-800">
          <EcomMiniSparkline :data="sparkIndex" :height="72" color="#22d3ee" />
        </div>
        <div class="space-y-2 text-xs pt-1 border-t border-slate-800">
          <div class="flex justify-between text-slate-300">
            <span>12M 峰值月份</span>
            <span class="font-mono font-bold text-cyan-300">{{ peakMonth?.month }} · {{ peakMonth?.volume.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>最新月份指数</span>
            <span class="font-mono font-bold text-white">{{ lastMonth?.month }} · index {{ lastMonth?.index }}</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>月均搜索量</span>
            <span class="font-mono font-bold text-white">{{ avgVolume.toLocaleString() }} 次/月</span>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 需求深度解读 -->
    <div class="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/30 space-y-2">
      <div class="text-xs font-bold text-indigo-300 flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-indigo-400" />
        <span>AI 市场需求深度解读</span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">{{ product.aiDemandAnalysis }}</p>
      <div class="text-[11px] text-slate-400 pt-1">
        <span class="font-semibold text-slate-300">季节性特征：</span>{{ product.seasonality }}
      </div>
    </div>
  </section>
</template>
