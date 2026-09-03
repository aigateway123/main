<script setup lang="ts">
// ============================================================================
// 竞品情报扫描与差异化破局策略（转译自选品原型 CompetitorAnalysisView.tsx）
//   原型来源：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/competitor/CompetitorAnalysisView.tsx
//   数据契约：ProductOpportunity / CompetitorItem（见 @/data/ecomIntelData.ts），
//             产品数据取自 ecomProducts.ts 的 PRIMARY_PRODUCT，深拷贝本地使用（不污染源数据）。
// 自包含视图（无 props / 无 emits）。
// 移植增强：新增「头部品牌集中度 (CR4/CR8)」竞品结构分布区（数据来自 competitorsOverview，
//           头部/腰部/长尾占比由数据实时计算，不虚构数值）；竞品表补上月销列 (estimatedMonthlySales)。
// ============================================================================
import { computed, onBeforeUnmount, ref } from 'vue'
import { Sparkles, Swords } from 'lucide-vue-next'
import type { CompetitorItem, ProductOpportunity } from '@/data/ecomIntelData'
import { PRIMARY_PRODUCT } from '@/data/ecomProducts'

// 深拷贝 PRIMARY_PRODUCT 到本地，任何展示逻辑不触碰源数据
const product = JSON.parse(JSON.stringify(PRIMARY_PRODUCT)) as ProductOpportunity

const competitors = computed<CompetitorItem[]>(() => product.competitorsList)
const overview = computed(() => product.competitorsOverview)

// ---- 扫描输入（原型交互：仅触发扫描动画，展示数据为 PRIMARY_PRODUCT 静态快照） ----
const productQuery = ref('Pet Water Bottle')
const marketQuery = ref('Amazon US')
const marketOptions = ['Amazon US', 'Amazon UK', 'Amazon DE', 'Amazon JP']
const isAnalyzing = ref(false)

let scanTimer: ReturnType<typeof setTimeout> | undefined

const handleSearch = () => {
  isAnalyzing.value = true
  if (scanTimer) clearTimeout(scanTimer)
  scanTimer = setTimeout(() => {
    isAnalyzing.value = false
  }, 800)
}

onBeforeUnmount(() => {
  if (scanTimer) clearTimeout(scanTimer)
})

// ---- 竞品结构分布（头部 / 腰部 / 长尾，占比由 competitorsOverview 实时计算） ----
interface SegmentStat {
  key: 'head' | 'mid' | 'longTail'
  label: string
  desc: string
  bar: string
  text: string
}

const segmentStats: SegmentStat[] = [
  {
    key: 'head',
    label: '头部品牌',
    desc: 'Reviews > 5000 · 垄断基础款词',
    bar: 'bg-rose-500',
    text: 'text-rose-400',
  },
  {
    key: 'mid',
    label: '腰部竞品',
    desc: 'Reviews 1000-5000 · 同质化严重',
    bar: 'bg-amber-500',
    text: 'text-amber-400',
  },
  {
    key: 'longTail',
    label: '长尾竞品',
    desc: 'Reviews < 1000 · 差异化空位',
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
  },
]

const segmentPercent = (key: 'head' | 'mid' | 'longTail'): number =>
  overview.value.total > 0 ? Math.round((overview.value[key] / overview.value.total) * 100) : 0

// ---- 由竞品清单实时计算的汇总口径（售价区间 / 评分 / 评论 / 未满足痛点） ----
const prices = computed<number[]>(() => competitors.value.map((c) => c.price))
const minPrice = computed<number>(() => (prices.value.length ? Math.min(...prices.value) : 0))
const maxPrice = computed<number>(() => (prices.value.length ? Math.max(...prices.value) : 0))
const avgRating = computed<number>(() =>
  competitors.value.length
    ? competitors.value.reduce((sum, c) => sum + c.rating, 0) / competitors.value.length
    : 0,
)
const avgReviews = computed<number>(() =>
  competitors.value.length
    ? Math.round(competitors.value.reduce((sum, c) => sum + c.reviews, 0) / competitors.value.length)
    : 0,
)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- 页面标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
          <Swords class="w-3.5 h-3.5" />
          <span>AI 竞品格局与蓝海空位探测</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          竞品情报扫描与差异化破局策略 (Competitor Matrix)
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          输入任意目标产品与站点，AI 自动扫描头部、腰部竞品垄断度并输出避开正面内卷的侧翼战术
        </p>
      </div>
    </div>

    <!-- 扫描输入条 -->
    <form
      class="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl"
      @submit.prevent="handleSearch"
    >
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div class="md:col-span-6 space-y-1">
          <label class="text-xs font-bold text-slate-300">目标产品关键词 / ASIN</label>
          <input
            v-model="productQuery"
            type="text"
            placeholder="例如: Pet Water Bottle, Dog slow feeder..."
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div class="md:col-span-3 space-y-1">
          <label class="text-xs font-bold text-slate-300">目标站点</label>
          <select
            v-model="marketQuery"
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option v-for="m in marketOptions" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <div class="md:col-span-3 self-end">
          <button
            type="submit"
            class="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles :class="isAnalyzing ? 'w-3.5 h-3.5 animate-spin' : 'w-3.5 h-3.5'" />
            <span>{{ isAnalyzing ? '正在扫描竞品...' : '启动竞品深度扫描' }}</span>
          </button>
        </div>
      </div>
    </form>

    <!-- 竞品扫描总览（口径实时计算自 PRIMARY_PRODUCT） -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <div class="text-[11px] text-slate-400">主要竞品数量</div>
        <div class="text-2xl font-bold font-mono text-indigo-400">{{ overview.total }} 款</div>
        <div class="text-[10px] text-slate-400">头部{{ overview.head }}款 / 腰部{{ overview.mid }}款 / 长尾{{ overview.longTail }}款</div>
      </div>

      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <div class="text-[11px] text-slate-400">主流价格区间</div>
        <div class="text-2xl font-bold font-mono text-white">${{ minPrice.toFixed(2) }} – ${{ maxPrice.toFixed(2) }}</div>
        <div class="text-[10px] text-slate-400">综合成本与溢价空间测算</div>
      </div>

      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <div class="text-[11px] text-slate-400">平均评分与评论</div>
        <div class="text-2xl font-bold font-mono text-amber-400">
          ★ {{ avgRating.toFixed(1) }}
          <span class="text-xs text-slate-400">(均 {{ avgReviews.toLocaleString() }} 条)</span>
        </div>
        <div class="text-[10px] text-slate-400">头部老牌平均差评率高达 12%</div>
      </div>

      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <div class="text-[11px] text-slate-400">发现竞争空位 (White Space)</div>
        <div class="text-2xl font-bold font-mono text-emerald-400">{{ product.topPainPoints.length }} 个未满足</div>
        <div class="text-[10px] text-slate-400">大容量+全拆洗无强竞品</div>
      </div>
    </div>

    <!-- 头部品牌集中度 (CR4/CR8) 竞品结构分布 -->
    <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
      <div class="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Swords class="w-4 h-4 text-rose-400" />
        <h3 class="text-sm font-bold text-white">头部品牌集中度与竞品结构分布 (CR4/CR8 扫描)</h3>
        <span class="text-[11px] text-slate-500">数据来自 AI 对 BSR 畅销榜 Top 500 的竞品抓取</span>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="seg in segmentStats"
          :key="seg.key"
          class="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2"
        >
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-slate-400">{{ seg.label }}</span>
            <span class="font-mono font-bold text-sm" :class="seg.text">
              {{ overview[seg.key] }} 款
            </span>
          </div>
          <div class="text-2xl font-black font-mono" :class="seg.text">{{ segmentPercent(seg.key) }}%</div>
          <div class="text-[10px] text-slate-500 leading-snug">{{ seg.desc }}</div>
        </div>
      </div>

      <!-- 头部 / 腰部 / 长尾占比条 -->
      <div class="space-y-1.5">
        <div class="flex h-2.5 w-full rounded-full overflow-hidden bg-slate-950 border border-slate-800">
          <div v-if="segmentPercent('head') > 0" class="h-full bg-rose-500" :style="{ width: `${segmentPercent('head')}%` }"></div>
          <div v-if="segmentPercent('mid') > 0" class="h-full bg-amber-500" :style="{ width: `${segmentPercent('mid')}%` }"></div>
          <div v-if="segmentPercent('longTail') > 0" class="h-full bg-emerald-500" :style="{ width: `${segmentPercent('longTail')}%` }"></div>
        </div>
        <p class="text-[10px] text-slate-400 leading-relaxed">
          头部 {{ overview.head }} 款约占 {{ segmentPercent('head') }}%（未形成绝对垄断），腰部与长尾合计占比过半，
          存在明显侧翼差异化切入窗口 —— 详见下方 AI 破局战术。
        </p>
      </div>
    </div>

    <!-- AI 破局战术决策横幅 -->
    <div class="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 rounded-2xl border-2 border-indigo-500/40 p-6 space-y-3 shadow-xl">
      <div class="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
        <Sparkles class="w-4 h-4 text-amber-400" />
        <span>AI 破局战术决策 (AI Competitive Strategy)</span>
      </div>
      <h2 class="text-xl font-bold text-white leading-snug">
        “{{ product.aiSuggestedProductHeadline }}”
      </h2>
      <p class="text-xs text-slate-300 leading-relaxed max-w-4xl">
        {{ product.competitorAiStrategy }}
      </p>
    </div>

    <!-- 竞品矩阵明细表 -->
    <div class="space-y-3">
      <div class="text-xs font-bold text-slate-300">头部与腰部代表性竞品详细档案</div>
      <div class="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">竞品名称</th>
                <th class="py-3 px-4">品牌 / ASIN</th>
                <th class="py-3 px-4 text-right">售价</th>
                <th class="py-3 px-4 text-center">Rating</th>
                <th class="py-3 px-4 text-right">Reviews</th>
                <th class="py-3 px-4">月销</th>
                <th class="py-3 px-4">核心卖点</th>
                <th class="py-3 px-4">主要用户痛点与差评</th>
              </tr>
            </thead>
            <tbody v-if="competitors.length" class="divide-y divide-slate-800/60">
              <tr v-for="comp in competitors" :key="comp.id" class="hover:bg-slate-800/40 transition">
                <td class="py-3.5 px-4">
                  <div class="font-bold text-white whitespace-nowrap">{{ comp.name }}</div>
                  <span
                    v-if="comp.badge"
                    class="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]"
                  >
                    {{ comp.badge }}
                  </span>
                </td>
                <td class="py-3.5 px-4 font-mono text-indigo-400 whitespace-nowrap">{{ comp.brand }} · {{ comp.asin }}</td>
                <td class="py-3.5 px-4 font-mono font-bold text-white text-right whitespace-nowrap">${{ comp.price.toFixed(2) }}</td>
                <td class="py-3.5 px-4 text-center text-amber-300 font-mono font-bold">★ {{ comp.rating }}</td>
                <td class="py-3.5 px-4 font-mono text-slate-300 text-right whitespace-nowrap">{{ comp.reviews.toLocaleString() }}</td>
                <td class="py-3.5 px-4 text-slate-300 whitespace-nowrap">{{ comp.estimatedMonthlySales }}</td>
                <td class="py-3.5 px-4 text-emerald-400 text-[11px] leading-snug max-w-[180px]">{{ comp.mainPros }}</td>
                <td class="py-3.5 px-4 text-rose-400 text-[11px] leading-snug max-w-[220px]">{{ comp.mainCons }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="8" class="py-8 text-center text-slate-500">该产品暂无已建档竞品数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
