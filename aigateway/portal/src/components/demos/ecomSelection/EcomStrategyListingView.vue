<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 —— 商品策略与 Listing 文案工坊
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/strategy/StrategyListingView.tsx
// props: products —— 无 emits；礼花用 EcomConfettiLayer（替代 canvas-confetti）
// ============================================================================
import { computed, onBeforeUnmount, ref } from 'vue'
import { Copy, FileSpreadsheet, RotateCcw, Sparkles } from 'lucide-vue-next'
import type { ProductOpportunity } from '@/data/ecomIntelData'
import EcomConfettiLayer from './EcomConfettiLayer.vue'

const props = defineProps<{
  products: ProductOpportunity[]
}>()

// TOP1-3 机会切换
const topThree = computed(() => props.products.slice(0, 3))
const selectedId = ref<string>(props.products[0]?.id ?? '')
const selected = computed<ProductOpportunity | null>(
  () => topThree.value.find((p) => p.id === selectedId.value) ?? topThree.value[0] ?? null,
)

const selectProduct = (p: ProductOpportunity) => {
  selectedId.value = p.id
}

// AI 重新润色：模拟 1s 生成后触发礼花
const isGenerating = ref(false)
const confettiOn = ref(false)
let regenTimer: ReturnType<typeof setTimeout> | null = null

const handleRegenerate = () => {
  if (isGenerating.value || !selected.value) return
  isGenerating.value = true
  confettiOn.value = false
  if (regenTimer) clearTimeout(regenTimer)
  regenTimer = setTimeout(() => {
    isGenerating.value = false
    confettiOn.value = true
  }, 1000)
}

// 一键复制全套文案
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const copyContent = computed(() => {
  const p = selected.value
  if (!p) return ''
  return `Title:\n${p.amazonListing.title}\n\nBullet Points:\n${p.amazonListing.bulletPoints.join(
    '\n',
  )}\n\nDescription:\n${p.amazonListing.description}\n\nKeywords:\n${p.amazonListing.searchKeywords.join(
    ', ',
  )}`
})

const writeClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } finally {
      document.body.removeChild(ta)
    }
  }
}

const handleCopy = () => {
  if (!selected.value) return
  void writeClipboard(copyContent.value)
  copied.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}

const onConfettiDone = () => {
  confettiOn.value = false
}

onBeforeUnmount(() => {
  if (regenTimer) clearTimeout(regenTimer)
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
          <FileSpreadsheet class="w-3.5 h-3.5" />
          <span>AI 跨境商品策略与高转化 Listing 生成工作台</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          商品策略与 Listing 文案工坊 (Listing Studio)
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          自动提炼核心卖点、定位目标买家并一键生成符合 Amazon 算法的高权重五点与描述
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          :disabled="isGenerating || !selected"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-60"
          @click="handleRegenerate"
        >
          <RotateCcw class="w-3.5 h-3.5" :class="isGenerating ? 'animate-spin' : ''" />
          <span>AI 重新润色</span>
        </button>

        <button
          type="button"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
          @click="handleCopy"
        >
          <Copy class="w-3.5 h-3.5" />
          <span>{{ copied ? '已复制全套 Listing' : '一键复制全套文案' }}</span>
        </button>
      </div>
    </div>

    <template v-if="selected">
      <!-- Select Product Switcher (TOP1-3) -->
      <div v-if="topThree.length" class="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">选择待上架产品:</span>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-for="p in topThree"
              :key="p.id"
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
              :class="
                selected.id === p.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              "
              @click="selectProduct(p)"
            >
              TOP {{ p.rank }}: {{ p.nameEn.slice(0, 20) }}...
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2 text-[11px] text-slate-400">
          <Sparkles class="w-3.5 h-3.5 text-indigo-400" />
          <span>{{ isGenerating ? 'AI 正在基于最新竞品数据润色文案...' : 'AI 已根据买家痛点自动优化五要素与埋词' }}</span>
        </div>
      </div>

      <!-- AI Strategy Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- Positioning -->
        <div class="lg:col-span-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1.5">
          <div class="text-[11px] font-bold text-indigo-400">商品定位 (Positioning)</div>
          <p class="text-xs text-slate-200 leading-relaxed font-medium">
            {{ selected.productStrategy.positioning }}
          </p>
        </div>

        <!-- Suggested Price -->
        <div class="lg:col-span-3 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1.5">
          <div class="text-[11px] font-bold text-cyan-400">建议售价区间</div>
          <div class="text-lg font-mono font-bold text-white leading-6">
            {{ selected.productStrategy.suggestedPriceRange }}
          </div>
          <p class="text-[10px] text-slate-400">避开公模内卷，保证毛利空间</p>
        </div>

        <!-- Core USPs -->
        <div class="lg:col-span-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1.5">
          <div class="text-[11px] font-bold text-emerald-400">核心卖点提炼 (USPs)</div>
          <div v-if="selected.productStrategy.coreUSPs.length" class="flex flex-wrap gap-1 text-[11px]">
            <span
              v-for="(u, i) in selected.productStrategy.coreUSPs"
              :key="i"
              class="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
            >
              {{ u }}
            </span>
          </div>
        </div>

        <!-- Target Audience -->
        <div class="lg:col-span-6 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1.5">
          <div class="text-[11px] font-bold text-amber-400">目标消费者画像</div>
          <div v-if="selected.productStrategy.targetAudience.length" class="space-y-1 text-[11px] text-slate-300">
            <div v-for="(a, i) in selected.productStrategy.targetAudience" :key="i">• {{ a }}</div>
          </div>
        </div>

        <!-- Market Gaps -->
        <div class="lg:col-span-6 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1.5">
          <div class="text-[11px] font-bold text-rose-400">市场空白与切入机会 (Market Gaps)</div>
          <div v-if="selected.productStrategy.marketGaps.length" class="space-y-1 text-[11px] text-slate-300">
            <div v-for="(g, i) in selected.productStrategy.marketGaps" :key="i">• {{ g }}</div>
          </div>
        </div>
      </div>

      <!-- Generated Amazon Listing Studio -->
      <div class="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
        <!-- Title -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs gap-2 flex-wrap">
            <span class="font-bold text-indigo-300">Product Title (Amazon 英文标题 - 包含高频核心词)</span>
            <span class="text-[10px] text-slate-400 font-mono">{{ selected.amazonListing.title.length }} 字符</span>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white leading-relaxed select-all">
            {{ selected.amazonListing.title }}
          </div>
        </div>

        <!-- Bullet Points -->
        <div v-if="selected.amazonListing.bulletPoints.length" class="space-y-2">
          <div class="text-xs font-bold text-cyan-300">Bullet Points (5大五点描述 - 突出防漏/容量/便携)</div>
          <div class="space-y-2">
            <div
              v-for="(bp, idx) in selected.amazonListing.bulletPoints"
              :key="idx"
              class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed"
            >
              <span class="font-bold text-indigo-400 mr-2">【Bullet {{ idx + 1 }}】</span>
              {{ bp }}
            </div>
          </div>
        </div>

        <!-- Product Description -->
        <div class="space-y-1.5">
          <div class="text-xs font-bold text-slate-300">Product Description (A+ 详述与品牌故事)</div>
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
            {{ selected.amazonListing.description }}
          </div>
        </div>

        <!-- Search Keywords -->
        <div v-if="selected.amazonListing.searchKeywords.length" class="space-y-1.5">
          <div class="text-xs font-bold text-amber-300">Search Keywords (后台埋词与 PPC 词库)</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(kw, idx) in selected.amazonListing.searchKeywords"
              :key="idx"
              class="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-mono"
            >
              {{ kw }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty Guard -->
    <div v-else class="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
      <FileSpreadsheet class="w-8 h-8 text-slate-400 mx-auto" />
      <div class="text-sm font-bold text-white">暂无待上架产品机会</div>
      <p class="text-xs text-slate-400">请先完成选品报告，AI 将自动生成商品策略与 Listing 文案</p>
    </div>

    <!-- 润色完成礼花庆祝 -->
    <EcomConfettiLayer :trigger="confettiOn" @done="onConfettiDone" />
  </div>
</template>
