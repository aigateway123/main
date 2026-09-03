<script setup lang="ts">
// ============================================================================
// AI 选品综合报告与高潜机会池（转译自选品原型 ReportOverview.tsx）
//   原型来源：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ReportOverview.tsx
//   数据契约：ProductOpportunity（见 @/data/ecomIntelData.ts）
//   容器契约：EcomSelectionDemo.vue —— products/marketLabel/categoryLabel 传入，
//             select-product / toggle-save / export 事件分别触发产品详情 / 收藏切换 / 导出弹窗。
// 移植修复：原型声明未使用的 taskMarket/taskCategory 改为渲染任务上下文（marketLabel/categoryLabel）；
//           TOP3 卡引入 EcomScoreBadge + EcomMiniSparkline（复用 ecomSelection 共享小组件）；
//           表格新增「状态」「收藏」列（toggle-save）；prototype 定义了 filterTag 但无 UI，
//           此处补充筛选 pills（全部 / TOP3 / 高毛利 / 高需求）。products 只读，筛选排序均基于副本。
// ============================================================================
import { computed, ref } from 'vue'
import {
  ArrowRight,
  Award,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  FileDown,
  Layers,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-vue-next'
import type { ProductOpportunity } from '@/data/ecomIntelData'
import EcomScoreBadge from './EcomScoreBadge.vue'
import EcomMiniSparkline from './EcomMiniSparkline.vue'

const props = defineProps<{
  products: ProductOpportunity[]
  marketLabel: string
  categoryLabel: string
}>()

const emit = defineEmits<{
  (e: 'select-product', product: ProductOpportunity): void
  (e: 'toggle-save', id: string): void
  (e: 'export'): void
}>()

type TagFilter = 'all' | 'top' | 'margin' | 'demand'
type SortKey = 'score' | 'margin' | 'demand'

// ---- 顶部四项执行结果指标（原型静态摘要） ----
const headlineMetrics = [
  { label: 'Products Analyzed', value: '1,286', sub: '抓取 BSR Top 500', color: 'text-slate-100' },
  { label: 'Opportunities Found', value: '47', sub: '存在高潜改良空间', color: 'text-slate-100' },
  { label: 'High Potential', value: '9', sub: '通过毛利与痛点验证', color: 'text-emerald-400' },
  { label: 'Market Opportunity Score', value: '87/100', sub: '蓝海需求指数', color: 'text-indigo-400' },
]

// ---- 本地检索/筛选/排序状态（仅影响展示，绝不修改传入 products） ----
const searchTerm = ref('')
const filterTag = ref<TagFilter>('all')
const sortBy = ref<SortKey>('score')

const filterOptions: { id: TagFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'top', label: 'TOP3 重点' },
  { id: 'margin', label: '高毛利 ≥40%' },
  { id: 'demand', label: '高需求 ≥85' },
]

const top3 = computed(() => props.products.slice(0, 3))

const visibleProducts = computed(() => {
  const q = searchTerm.value.trim()
  const list = props.products.filter((p) => {
    const matchSearch =
      !q ||
      p.nameEn.toLowerCase().includes(q.toLowerCase()) ||
      p.nameCn.includes(q) ||
      p.subCategory.includes(q)
    if (!matchSearch) return false
    if (filterTag.value === 'top') return p.rank <= 3
    if (filterTag.value === 'margin') return p.grossMargin >= 40
    if (filterTag.value === 'demand') return p.scoreBreakdown.marketDemand >= 85
    return true
  })
  return list.sort((a, b) => {
    if (sortBy.value === 'score') return b.score - a.score
    if (sortBy.value === 'margin') return b.grossMargin - a.grossMargin
    return b.scoreBreakdown.marketDemand - a.scoreBreakdown.marketDemand
  })
})

const sparkIndex = (p: ProductOpportunity): number[] => p.searchTrend12M.map((d) => d.index)

const rankChipClass = (rank: number): string => {
  if (rank === 1) return 'bg-amber-500/20 text-amber-400 font-extrabold border border-amber-500/40'
  if (rank === 2) return 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
  if (rank === 3) return 'bg-amber-700/20 text-amber-600 border border-amber-700/40'
  return 'text-slate-400'
}

const statusChipClass = (status?: string): string => {
  switch (status) {
    case '待验证':
    case '验证中':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    case '供应商询价':
    case '竞品分析':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    case '打样':
    case '寄样':
    case '上架':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    default:
      return 'bg-slate-800/60 text-slate-400 border-slate-700'
  }
}

const statusLabel = (status?: string): string => status ?? '未入库'

const selectProduct = (p: ProductOpportunity) => emit('select-product', p)
const toggleSave = (id: string) => emit('toggle-save', id)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-10">
    <!-- 顶部标题 / 任务上下文 / 导出报告 -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>AI 选品多维深度分析已完成 · 报告生成完毕</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>AI 选品综合报告与高潜机会池</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          基于 1,286 款热门产品与 12,846 条消费者真实差评建立的选品决策雷达
        </p>
        <div class="flex items-center gap-2 flex-wrap mt-2 text-[11px]">
          <span class="text-slate-500">任务上下文:</span>
          <span class="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">{{ marketLabel }}</span>
          <span class="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">{{ categoryLabel }}</span>
        </div>
      </div>

      <button
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer self-start md:self-auto"
        @click="emit('export')"
      >
        <FileDown class="w-4 h-4 text-indigo-400" />
        <span>导出选品决策报告</span>
      </button>
    </div>

    <!-- 顶部 4 项执行结果指标 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="item in headlineMetrics"
        :key="item.label"
        class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex-1 shadow-sm"
      >
        <div class="text-xs text-slate-500 uppercase tracking-wider font-semibold">{{ item.label }}</div>
        <div class="text-2xl font-bold mt-1 font-mono" :class="item.color">{{ item.value }}</div>
        <div class="text-[11px] text-slate-500 mt-0.5 truncate">{{ item.sub }}</div>
      </div>
    </div>

    <!-- TOP 3 重点推荐大卡 -->
    <div v-if="top3.length" class="space-y-4">
      <div class="flex items-center gap-2">
        <Award class="w-5 h-5 text-amber-400" />
        <h2 class="text-base font-bold text-white">AI 重点推荐产品 (TOP Recommendations)</h2>
        <span class="text-xs text-slate-500 font-normal">建议优先进入样品验证与供应商打样流程</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          v-for="product in top3"
          :key="product.id"
          class="bg-slate-900 rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-lg"
          :class="product.rank === 1 ? 'border-indigo-500/50 ring-1 ring-indigo-500/30' : 'border-slate-800 hover:border-slate-700'"
        >
          <!-- 头部条 -->
          <div class="p-5 border-b border-slate-800 bg-slate-800/30 flex justify-between items-start gap-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] rounded uppercase font-bold">
                  {{ product.rank === 1 ? 'Top Recommendation' : `Rank #${product.rank}` }}
                </span>
                <span
                  class="px-2 py-0.5 text-[10px] rounded font-semibold"
                  :class="statusChipClass(product.status)"
                >
                  {{ statusLabel(product.status) }}
                </span>
              </div>
              <h3 class="text-base font-bold text-white leading-snug">{{ product.nameEn }}</h3>
              <div class="text-xs text-slate-400 mt-0.5 truncate">{{ product.nameCn }}</div>
            </div>
            <div class="shrink-0">
              <EcomScoreBadge :score="product.score" size="lg" />
            </div>
          </div>

          <div class="p-5 space-y-4 flex-1">
            <!-- 利润预测 -->
            <div class="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Profitability Forecast
              </div>
              <div class="space-y-1.5 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-400">Est. Sale Price</span>
                  <span class="font-mono text-slate-200">${{ product.sellingPrice.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Cost (FOB)</span>
                  <span class="font-mono text-slate-200">${{ product.sourcingCost.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between font-bold text-emerald-400">
                  <span class="text-slate-400 font-normal">Net Profit</span>
                  <span class="font-mono">${{ product.unitProfit.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Gross Margin</span>
                  <span class="px-1.5 py-0.5 bg-emerald-500/10 rounded text-emerald-400 text-xs font-mono font-bold">
                    {{ product.grossMargin.toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- 市场缺口分析进度条 -->
            <div class="space-y-2 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 text-xs">
              <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Market Gap Analysis
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <div class="w-20 text-[10px] text-slate-400 truncate">Demand</div>
                  <div class="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-indigo-500 rounded-full"
                      :style="{ width: `${product.scoreBreakdown.marketDemand}%` }"
                    ></div>
                  </div>
                  <div class="text-[11px] font-mono font-semibold text-slate-300 w-6 text-right">
                    {{ product.scoreBreakdown.marketDemand }}
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-20 text-[10px] text-slate-400 truncate">Differentiation</div>
                  <div class="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-emerald-500 rounded-full"
                      :style="{ width: `${product.scoreBreakdown.differentiationSpace}%` }"
                    ></div>
                  </div>
                  <div class="text-[11px] font-mono font-semibold text-slate-300 w-6 text-right">
                    {{ product.scoreBreakdown.differentiationSpace }}
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-20 text-[10px] text-slate-400 truncate">Competition</div>
                  <div class="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-amber-500 rounded-full"
                      :style="{ width: `${product.scoreBreakdown.competitionEase}%` }"
                    ></div>
                  </div>
                  <div class="text-[11px] font-mono font-semibold text-slate-300 w-6 text-right">
                    {{ product.scoreBreakdown.competitionEase }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 12 个月搜索趋势 sparkline -->
            <div
              v-if="product.searchTrend12M.length"
              class="flex items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60"
            >
              <div class="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
                <TrendingUp class="w-3.5 h-3.5 text-emerald-400" />
                <span>近12月搜索趋势</span>
                <span class="px-1.5 py-0.5 ml-1 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">
                  {{ product.searchGrowth }}
                </span>
              </div>
              <EcomMiniSparkline :data="sparkIndex(product)" color="#34d399" :height="30" />
            </div>

            <!-- AI 结论摘要 -->
            <div class="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
              <span class="text-indigo-400 font-bold mr-1 text-[11px] uppercase">AI Verdict:</span>
              {{ product.aiConclusion }}
            </div>
          </div>

          <!-- 卡片底部 CTA -->
          <div class="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              class="p-2 rounded-lg border text-xs font-semibold transition cursor-pointer"
              :class="
                product.isSaved
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              "
              title="收藏到我的选品池"
              @click="toggleSave(product.id)"
            >
              <BookmarkCheck v-if="product.isSaved" class="w-4 h-4" />
              <Bookmark v-else class="w-4 h-4" />
            </button>

            <button
              class="flex-1 py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              :class="
                product.rank === 1
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              "
              @click="selectProduct(product)"
            >
              <span>查看完整情报</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 完整产品机会排行榜 -->
    <div class="space-y-4">
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <Layers class="w-4 h-4 text-indigo-400" />
            <span>全部发现的产品机会排行榜 (Product Opportunity Leaderboard)</span>
          </h2>
          <p class="text-xs text-slate-400">
            点击任意产品行即可展开市场需求、竞品矩阵、痛点分析、利润测算与 Listing 生成
          </p>
        </div>

        <!-- 搜索 / 筛选 / 排序控制 -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- 状态筛选 pills -->
          <div class="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              v-for="opt in filterOptions"
              :key="opt.id"
              class="px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer"
              :class="
                filterTag === opt.id
                  ? 'bg-indigo-600/40 text-indigo-300 border border-indigo-500/50'
                  : 'text-slate-400 hover:text-white'
              "
              @click="filterTag = opt.id"
            >
              {{ opt.label }}
            </button>
          </div>

          <div class="relative">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="搜索产品或品类..."
              class="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 w-40 sm:w-52"
            />
          </div>

          <select
            v-model="sortBy"
            class="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="score">按机会评分</option>
            <option value="margin">按预计毛利</option>
            <option value="demand">按市场需求</option>
          </select>
        </div>
      </div>

      <!-- 表格容器 -->
      <div class="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">排名</th>
                <th class="py-3 px-4">产品机会与细分品类</th>
                <th class="py-3 px-4 text-center">状态</th>
                <th class="py-3 px-4 text-center">机会总评分</th>
                <th class="py-3 px-4">售价 / 采购成本</th>
                <th class="py-3 px-4">预计毛利率</th>
                <th class="py-3 px-4">核心标签</th>
                <th class="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr
                v-for="p in visibleProducts"
                :key="p.id"
                class="hover:bg-slate-800/60 transition cursor-pointer group"
                @click="selectProduct(p)"
              >
                <td class="py-3.5 px-4 font-mono font-bold text-slate-300">
                  <span
                    class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs"
                    :class="rankChipClass(p.rank)"
                  >
                    #{{ p.rank }}
                  </span>
                </td>

                <td class="py-3.5 px-4">
                  <div class="font-bold text-white group-hover:text-indigo-300 transition">{{ p.nameEn }}</div>
                  <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{{ p.nameCn }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-400"></span>
                    <span class="text-indigo-400">{{ p.subCategory }}</span>
                  </div>
                </td>

                <td class="py-3.5 px-4 text-center">
                  <span
                    class="inline-block px-2 py-0.5 rounded-md border text-[10px] font-semibold whitespace-nowrap"
                    :class="statusChipClass(p.status)"
                  >
                    {{ statusLabel(p.status) }}
                  </span>
                </td>

                <td class="py-3.5 px-4 text-center">
                  <EcomScoreBadge :score="p.score" size="sm" :show-label="false" />
                </td>

                <td class="py-3.5 px-4 font-mono whitespace-nowrap">
                  <div class="text-white font-semibold">${{ p.sellingPrice.toFixed(2) }}</div>
                  <div class="text-[11px] text-slate-400">采购: ${{ p.sourcingCost.toFixed(2) }}</div>
                </td>

                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="font-mono font-bold text-cyan-400">{{ p.grossMargin.toFixed(1) }}%</div>
                  <div class="text-[10px] text-slate-400">单件利润: ${{ p.unitProfit.toFixed(2) }}</div>
                </td>

                <td class="py-3.5 px-4">
                  <div v-if="p.tags.length" class="flex flex-wrap gap-1 max-w-xs">
                    <span
                      v-for="(t, idx) in p.tags.slice(0, 3)"
                      :key="idx"
                      class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {{ t }}
                    </span>
                  </div>
                </td>

                <td class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="p-1.5 rounded-lg border transition cursor-pointer"
                      :class="
                        p.isSaved
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      "
                      :title="p.isSaved ? '取消收藏' : '收藏到我的选品池'"
                      @click.stop="toggleSave(p.id)"
                    >
                      <BookmarkCheck v-if="p.isSaved" class="w-3.5 h-3.5" />
                      <Bookmark v-else class="w-3.5 h-3.5" />
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-semibold transition whitespace-nowrap cursor-pointer"
                      @click.stop="selectProduct(p)"
                    >
                      深度分析 &gt;
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!visibleProducts.length">
                <td colspan="8" class="py-10 text-center text-slate-500">
                  <Sparkles class="w-4 h-4 mx-auto mb-2 opacity-50" />
                  未找到匹配的产品机会，请尝试调整搜索或筛选条件
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
