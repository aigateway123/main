<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 —— 消费者洞察视图（无 props / 无 emits）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/consumer/ConsumerInsightsView.tsx
// 产品数据自 ecomProducts.ts 深拷贝本地使用，页面自包含
// ============================================================================
import { computed, onBeforeUnmount, ref } from 'vue'
import {
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Users,
} from 'lucide-vue-next'
import type { PainPointItem, ProductOpportunity } from '@/data/ecomIntelData'
import { PRIMARY_PRODUCT } from '@/data/ecomProducts'

const deepCopy = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T

// 产品数据深拷贝到本地，保证不污染共享数据源
const product = ref<ProductOpportunity>(deepCopy(PRIMARY_PRODUCT))

// ---- 顶部检索表单（本地模拟 700ms 分析态） ----
const productName = ref('Pet Water Bottle')
const market = ref('美国 Amazon')
const isAnalyzing = ref(false)
let analyzeTimer: ReturnType<typeof setTimeout> | null = null

const handleAnalyze = () => {
  isAnalyzing.value = true
  if (analyzeTimer) clearTimeout(analyzeTimer)
  analyzeTimer = setTimeout(() => {
    isAnalyzing.value = false
  }, 700)
}

onBeforeUnmount(() => {
  if (analyzeTimer) clearTimeout(analyzeTimer)
})

// ---- 数据派生 ----
const topPain = computed<PainPointItem | null>(() => product.value.topPainPoints[0] ?? null)

const topPainHeadline = computed(() => {
  const t = topPain.value?.title ?? ''
  return t.split(' (')[0] || t
})

const painImpactClass = (level: PainPointItem['impactLevel']): string => {
  if (level === '极高') return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  if (level === '高') return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  return 'bg-slate-500/15 text-slate-300 border-slate-500/30'
}

const painBarClass = (level: PainPointItem['impactLevel']): string => {
  if (level === '极高') return 'from-rose-500 to-red-400'
  if (level === '高') return 'from-amber-500 to-orange-400'
  return 'from-slate-500 to-slate-400'
}

// 去掉 userWishlist 文案中自带序号（① ② …），改由 UI 序号徽标呈现
const wishlistItems = computed(() =>
  product.value.userWishlist.map((wish, idx) => ({
    id: idx,
    text: wish.replace(/^[①-⑩]\s*/, ''),
  })),
)

const painBarStyle = (pp: PainPointItem) => ({
  width: `${Math.min(100, Math.max(0, pp.percentage))}%`,
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
          <Users class="w-3.5 h-3.5" />
          <span>AI 深度买家舆情与痛点挖掘引擎</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          消费者洞察与买家决策动机 (Consumer Insights)
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          自然语言解析 {{ product.reviewsAnalyzedCount.toLocaleString() }} 条真实买家评价，剖析“为什么买、为什么不买、希望改良什么”
        </p>
      </div>
    </div>

    <!-- Input Search Form -->
    <form @submit.prevent="handleAnalyze" class="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div class="md:col-span-6 space-y-1">
          <label class="text-xs font-bold text-slate-300">分析产品品类 / ASIN</label>
          <input
            v-model="productName"
            type="text"
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div class="md:col-span-3 space-y-1">
          <label class="text-xs font-bold text-slate-300">目标市场</label>
          <input
            v-model="market"
            type="text"
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div class="md:col-span-3 self-end">
          <button
            type="submit"
            class="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles class="w-3.5 h-3.5" :class="isAnalyzing ? 'animate-spin' : ''" />
            <span>{{ isAnalyzing ? '正在聚类分析...' : '挖掘买家真实评价' }}</span>
          </button>
        </div>
      </div>
    </form>

    <!-- Overview Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <div class="text-[11px] text-slate-400">已聚类买家评价总量</div>
        <div class="text-2xl font-bold font-mono text-cyan-400">{{ product.reviewsAnalyzedCount.toLocaleString() }} 条</div>
        <div class="text-[10px] text-slate-400">好评率 84.2% / 差评率 15.8%</div>
      </div>

      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <div class="text-[11px] text-slate-400">头号差评杀手痛点</div>
        <div v-if="topPain" class="text-2xl font-bold font-mono text-rose-400">
          {{ topPain.frequency }} {{ topPainHeadline }}
        </div>
        <div class="text-[10px] text-slate-400">严重影响复购与星级</div>
      </div>

      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <div class="text-[11px] text-slate-400">核心买家人群画像</div>
        <div class="text-2xl font-bold text-white">户外遛狗中产</div>
        <div class="text-[10px] text-slate-400">女性养宠人占比约 68%</div>
      </div>

      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <div class="text-[11px] text-slate-400">价格敏感度区间</div>
        <div class="text-xl font-bold font-mono text-emerald-400 leading-7">
          {{ product.productStrategy.suggestedPriceRange }}
        </div>
        <div class="text-[10px] text-slate-400">防漏大容量愿支付 30% 溢价</div>
      </div>
    </div>

    <!-- WHY BUY vs WHY NOT BUY Core Decision Board -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Why Consumers Buy -->
      <div class="bg-slate-900/90 p-6 rounded-2xl border border-emerald-500/30 space-y-4">
        <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <ThumbsUp class="w-4 h-4" />
          <span>消费者为什么买？(Top Purchasing Motivations)</span>
        </div>

        <div v-if="product.whyBuyReasons.length" class="space-y-3 text-xs">
          <div
            v-for="(reason, idx) in product.whyBuyReasons"
            :key="idx"
            class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
          >
            <div class="font-bold text-white flex items-center gap-2">
              <span class="w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] shrink-0">
                {{ idx + 1 }}
              </span>
              <span>{{ reason }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Why Consumers Do NOT Buy / Leave Bad Reviews -->
      <div class="bg-slate-900/90 p-6 rounded-2xl border border-rose-500/30 space-y-4">
        <div class="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <ThumbsDown class="w-4 h-4" />
          <span>消费者为什么不买 / 为什么退货？(Top Objections &amp; Churn)</span>
        </div>

        <div v-if="product.whyNotBuyReasons.length" class="space-y-3 text-xs">
          <div
            v-for="(reason, idx) in product.whyNotBuyReasons"
            :key="idx"
            class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
          >
            <div class="font-bold text-rose-300 flex items-center gap-2">
              <span class="w-5 h-5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center font-mono text-[10px] shrink-0">
                {{ idx + 1 }}
              </span>
              <span>{{ reason }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Pain Points Breakdown Detail Cards -->
    <div v-if="product.topPainPoints.length" class="space-y-3">
      <h3 class="text-sm font-bold text-white">用户痛点深度解析与买家原声引语 (Quotes)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div v-for="pp in product.topPainPoints" :key="pp.id" class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2.5 flex flex-col">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold text-rose-400">{{ pp.title }}</span>
            <span class="text-xs font-mono font-bold text-slate-300 shrink-0">{{ pp.frequency }}</span>
          </div>

          <!-- percentage 进度条 -->
          <div class="space-y-1">
            <div class="h-1.5 rounded-full bg-slate-950 overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r"
                :class="painBarClass(pp.impactLevel)"
                :style="painBarStyle(pp)"
              />
            </div>
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-slate-500">差评占比 {{ pp.percentage }}%</span>
              <span class="px-1.5 py-0.5 rounded border font-semibold" :class="painImpactClass(pp.impactLevel)">
                影响度: {{ pp.impactLevel }}
              </span>
            </div>
          </div>

          <p class="text-xs text-slate-300 leading-relaxed">{{ pp.description }}</p>

          <div class="p-2 rounded bg-slate-950 text-[11px] text-slate-400 italic flex items-start gap-1.5 mt-auto">
            <MessageSquare class="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
            <span>{{ pp.sampleQuote }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 买家 Wishlist 与 AI 改进建议 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Wishlist -->
      <div class="bg-slate-900/90 p-6 rounded-2xl border border-indigo-500/30 space-y-4">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <AlertCircle class="w-4 h-4" />
            <span>买家 Wishlist · 呼声最高的改良诉求</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">{{ product.userWishlist.length }} 项核心诉求</span>
        </div>

        <div v-if="wishlistItems.length" class="space-y-2">
          <div
            v-for="item in wishlistItems"
            :key="item.id"
            class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
          >
            <span class="w-5 h-5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-mono text-[10px] shrink-0">
              {{ item.id + 1 }}
            </span>
            <span class="leading-relaxed">{{ item.text }}</span>
          </div>
        </div>
      </div>

      <!-- AI Suggested Improvement -->
      <div class="bg-gradient-to-br from-indigo-950/50 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 space-y-4">
        <div class="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <Lightbulb class="w-4 h-4" />
          <span>AI 改进建议 · 下一代产品定义</span>
        </div>

        <div class="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
          <div class="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">AI Suggested Product Headline</div>
          <p class="text-sm text-white font-bold leading-relaxed">{{ product.aiSuggestedProductHeadline }}</p>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            该改进方向由 {{ product.reviewsAnalyzedCount.toLocaleString() }} 条真实评价聚类得出，围绕 Wishlist 高频诉求形成差异化结构方案，避免与市面公模低价产品正面内卷。
          </p>
        </div>

        <div class="flex items-start gap-2.5 text-[11px] text-slate-300 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
          <Sparkles class="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            完整 6 大差异化开模方案（防漏 / 容量 / 拆洗 / 单手操作 / 外挂 / 水槽）可在「商品策略与 Listing 文案工坊」中查看与一键上架。
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
