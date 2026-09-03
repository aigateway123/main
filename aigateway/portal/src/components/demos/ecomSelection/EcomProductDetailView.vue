<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 —— 产品详情页（主组件）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx（1215 行）
// 原型最大组件：顶部操作条 + 概览 Hero（评分/标签/AI 结论/经济指标）+ 分段 tab 导航
// 内部 tab 为组件本地状态；'all' 表示全量展示模式，全部段落顺序堆叠渲染
//
// 对外唯一公共接口（契约与容器 EcomSelectionDemo.vue 一致）：
//   props : { product: ProductOpportunity; currency: Currency }
//   emits : back() / toggle-save(id) / open-supplier(sup) / export()
// 各分段拆分为 product/EcomPdXxx.vue 本地子组件（见 import 清单）
// 暗色 #0A0C10 系 + indigo 强调；中文文案照抄原型
// ============================================================================
import { computed, ref, watch } from 'vue'
import { ArrowLeft, Bookmark, BookmarkCheck, FileDown, Sparkles } from 'lucide-vue-next'
import type { ProductOpportunity, Currency, SupplierItem } from '@/data/ecomIntelData'
import EcomPdOverview from './product/EcomPdOverview.vue'
import EcomPdDemand from './product/EcomPdDemand.vue'
import EcomPdCompetitors from './product/EcomPdCompetitors.vue'
import EcomPdConsumer from './product/EcomPdConsumer.vue'
import EcomPdDiff from './product/EcomPdDiff.vue'
import EcomPdProfit from './product/EcomPdProfit.vue'
import EcomPdSuppliers from './product/EcomPdSuppliers.vue'
import EcomPdStrategy from './product/EcomPdStrategy.vue'
import EcomPdConclusion from './product/EcomPdConclusion.vue'

type PdSectionId =
  | 'overview'
  | 'demand'
  | 'competitors'
  | 'consumer'
  | 'diff'
  | 'profit'
  | 'suppliers'
  | 'strategy'
  | 'conclusion'

type PdTabId = 'all' | PdSectionId

const props = defineProps<{
  product: ProductOpportunity
  currency: Currency
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'toggle-save', id: string): void
  (e: 'open-supplier', sup: SupplierItem): void
  (e: 'export'): void
}>()

// ---- 分段 tab 本地状态（'all' = 全量堆叠模式） ----
const activeTab = ref<PdTabId>('overview')

// 切换产品时回到默认首个分段
watch(
  () => props.product.id,
  () => {
    activeTab.value = 'overview'
  },
)

const TABS: { id: PdTabId; label: string }[] = [
  { id: 'all', label: '🗂 全部内容' },
  { id: 'overview', label: '📊 综合评分拆解' },
  { id: 'demand', label: '📈 市场需求与趋势' },
  { id: 'competitors', label: '⚔️ 竞品地图与格局' },
  { id: 'consumer', label: '👥 消费者洞察与痛点' },
  { id: 'diff', label: '💡 AI 差异化设计方案' },
  { id: 'profit', label: '🧮 动态利润计算器' },
  { id: 'suppliers', label: '🏭 供应商智能匹配' },
  { id: 'strategy', label: '📝 商品策略与 Listing' },
  { id: 'conclusion', label: '🎯 AI 最终建议与决策' },
]

const visible = (id: PdSectionId): boolean => activeTab.value === 'all' || activeTab.value === id

// 货币格式化：USD $ 两位 / CNY ¥ 乘 7.2 一位
const fmtPrice = (v: number): string =>
  props.currency === 'CNY' ? `¥${(v * 7.2).toFixed(1)}` : `$${v.toFixed(2)}`

const econCards = computed(() => [
  { label: 'Est. Sale Price', value: fmtPrice(props.product.sellingPrice), cls: 'text-white' },
  { label: 'Cost (FOB)', value: fmtPrice(props.product.sourcingCost), cls: 'text-slate-300' },
  { label: 'Est. Shipping', value: fmtPrice(props.product.shippingCost), cls: 'text-slate-300' },
  { label: 'Platform Fee (FBA)', value: fmtPrice(props.product.platformFee), cls: 'text-slate-300' },
  { label: 'Net Profit', value: fmtPrice(props.product.unitProfit), cls: 'text-emerald-400 font-bold' },
  { label: 'Gross Margin', value: `${props.product.grossMargin.toFixed(1)}%`, cls: 'text-emerald-400 font-black' },
])

const toggleSave = () => emit('toggle-save', props.product.id)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- ==================== 顶部返回 / 收藏 / 导出操作条 ==================== -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <button
        class="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition cursor-pointer w-fit"
        @click="emit('back')"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>返回选品排行榜</span>
      </button>

      <div class="flex items-center gap-2.5">
        <button
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer"
          :class="
            product.isSaved
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
          "
          @click="toggleSave"
        >
          <BookmarkCheck v-if="product.isSaved" class="w-4 h-4" />
          <Bookmark v-else class="w-4 h-4" />
          <span>{{ product.isSaved ? '已收藏在选品池' : '加入我的选品' }}</span>
        </button>

        <button
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          @click="emit('export')"
        >
          <FileDown class="w-4 h-4 text-indigo-400" />
          <span>导出该产品情报报告</span>
        </button>
      </div>
    </div>

    <!-- ==================== Hero 概览头部卡（评分 + AI 结论 + 经济指标） ==================== -->
    <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div class="relative z-10 space-y-6">
        <!-- 标题与评分 -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div class="space-y-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] rounded uppercase font-bold">
                Top Recommendation
              </span>
              <span
                class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold"
              >
                RANK #{{ product.rank }} · {{ product.badge }}
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">{{ product.nameEn }}</h1>
            <p class="text-sm text-slate-400 font-medium">
              {{ product.nameCn }} · {{ product.category }} &gt; {{ product.subCategory }}
            </p>

            <div v-if="product.tags.length" class="flex flex-wrap gap-1.5 pt-0.5">
              <span
                v-for="(t, idx) in product.tags"
                :key="idx"
                class="text-xs px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium"
              >
                {{ t }}
              </span>
            </div>
          </div>

          <!-- 机会分展示徽章 -->
          <div class="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-5 shadow-inner w-fit">
            <div class="space-y-1 text-right">
              <div class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Opportunity Score</div>
              <div class="flex items-baseline gap-1.5 justify-end">
                <span class="text-4xl sm:text-5xl font-black text-indigo-400 font-mono tracking-tight leading-none">
                  {{ product.score }}
                </span>
                <span class="text-sm text-slate-500 font-normal">/100</span>
              </div>
              <div class="text-[11px] text-emerald-400 font-medium">综合研判：极高潜力准入</div>
            </div>
          </div>
        </div>

        <!-- AI 选品结论 -->
        <div class="flex items-start gap-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl px-4 py-3.5">
          <Sparkles class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div class="text-xs leading-relaxed">
            <span class="font-bold text-indigo-300">AI 选品结论：</span>
            <span class="text-slate-300">{{ product.aiConclusion }}</span>
          </div>
        </div>

        <!-- 价格与毛利关键指标 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            v-for="(item, idx) in econCards"
            :key="idx"
            class="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1"
          >
            <div class="text-[10px] uppercase text-slate-500 tracking-wider font-semibold">{{ item.label }}</div>
            <div class="text-base sm:text-lg font-mono font-bold" :class="item.cls">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 分段 tab 导航（含「全部内容」全量模式） ==================== -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold">
      <button
        v-for="tab in TABS"
        :key="tab.id"
        class="px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer"
        :class="
          activeTab === tab.id
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
        "
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ==================== 分段内容（activeTab==='all' 时全量顺序堆叠） ==================== -->
    <EcomPdOverview v-if="visible('overview')" :product="product" />
    <EcomPdDemand v-if="visible('demand')" :product="product" />
    <EcomPdCompetitors v-if="visible('competitors')" :product="product" :currency="currency" />
    <EcomPdConsumer v-if="visible('consumer')" :product="product" />
    <EcomPdDiff v-if="visible('diff')" :product="product" />
    <EcomPdProfit v-if="visible('profit')" :product="product" />
    <EcomPdSuppliers v-if="visible('suppliers')" :product="product" :currency="currency" @open-supplier="(sup) => emit('open-supplier', sup)" />
    <EcomPdStrategy v-if="visible('strategy')" :product="product" />
    <EcomPdConclusion
      v-if="visible('conclusion')"
      :product="product"
      @toggle-save="(id: string) => emit('toggle-save', id)"
      @goto-strategy="activeTab = 'strategy'"
    />
  </div>
</template>
