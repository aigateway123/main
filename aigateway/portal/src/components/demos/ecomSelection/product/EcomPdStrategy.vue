<script setup lang="ts">
// 产品详情 · 分段子组件 8/9 —— 商品策略与 Amazon Listing（原型 TAB: strategy）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx
// Listing 复制/再生成交互本地模拟；原型 canvas-confetti 以共享 EcomConfettiLayer 替代
import { ref, watch } from 'vue'
import { FileSpreadsheet, RotateCcw, Copy } from 'lucide-vue-next'
import type { ProductOpportunity } from '@/data/ecomIntelData'
import EcomConfettiLayer from '../EcomConfettiLayer.vue'

const props = defineProps<{
  product: ProductOpportunity
}>()

// Listing 生成 / 复制模拟状态（原型 handleRegenerateListing / handleCopyListing）
const isGeneratingListing = ref(false)
const copiedListing = ref(false)
const confettiOn = ref(false)

watch(
  () => props.product.id,
  () => {
    isGeneratingListing.value = false
    copiedListing.value = false
    confettiOn.value = false
  },
)

const regenerateListing = () => {
  if (isGeneratingListing.value) return
  isGeneratingListing.value = true
  window.setTimeout(() => {
    isGeneratingListing.value = false
    confettiOn.value = true
  }, 1000)
}

const copyListing = async () => {
  const text = `Title: ${props.product.amazonListing.title}\n\nBullet Points:\n${props.product.amazonListing.bulletPoints.join(
    '\n',
  )}\n\nDescription:\n${props.product.amazonListing.description}\n\nKeywords: ${props.product.amazonListing.searchKeywords.join(
    ', ',
  )}`
  try {
    await navigator.clipboard.writeText(text)
    copiedListing.value = true
    window.setTimeout(() => {
      copiedListing.value = false
    }, 2000)
  } catch {
    // clipboard API 不可用（非安全上下文）时静默
  }
}
</script>

<template>
  <section class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
    <!-- Section 头部 + 操作按钮 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <FileSpreadsheet class="w-5 h-5 text-indigo-400" />
          <span>AI 商品策略与 Amazon Listing 生成 (Strategy & Copy Studio)</span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          AI 基于市场定位、受众画像、核心卖点自动生成的全套高转化英文文案
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          :disabled="isGeneratingListing"
          @click="regenerateListing"
        >
          <RotateCcw class="w-3.5 h-3.5" :class="isGeneratingListing ? 'animate-spin' : ''" />
          <span>{{ isGeneratingListing ? 'AI 生成中...' : '重新生成文案' }}</span>
        </button>
        <button
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
          @click="copyListing"
        >
          <Copy class="w-3.5 h-3.5" />
          <span>{{ copiedListing ? '已复制全部' : '一键复制 Listing' }}</span>
        </button>
      </div>
    </div>

    <!-- 策略矩阵 4 卡 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
        <div class="text-[11px] font-bold text-indigo-400">商品定位 (Positioning)</div>
        <p class="text-xs text-slate-200 leading-relaxed font-medium">{{ product.productStrategy.positioning }}</p>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
        <div class="text-[11px] font-bold text-cyan-400">建议定价区间 (Pricing)</div>
        <div class="text-base font-mono font-bold text-white">{{ product.productStrategy.suggestedPriceRange }}</div>
        <p class="text-[10px] text-slate-400">避开低价内卷，卡位品质中产</p>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
        <div class="text-[11px] font-bold text-emerald-400">核心卖点提炼 (USPs)</div>
        <div v-if="product.productStrategy.coreUSPs.length" class="flex flex-wrap gap-1 text-[11px]">
          <span v-for="(u, i) in product.productStrategy.coreUSPs" :key="i" class="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">
            {{ u }}
          </span>
        </div>
        <p v-else class="text-[11px] text-slate-500">暂无 USP 数据</p>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
        <div class="text-[11px] font-bold text-amber-400">目标消费者 (Target Audience)</div>
        <div v-if="product.productStrategy.targetAudience.length" class="space-y-1 text-[11px] text-slate-300">
          <div v-for="(a, i) in product.productStrategy.targetAudience.slice(0, 3)" :key="i">• {{ a }}</div>
        </div>
        <p v-else class="text-[11px] text-slate-500">暂无受众数据</p>
      </div>
    </div>

    <!-- Generated Amazon Listing 预览 -->
    <div class="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-5">
      <!-- Title -->
      <div class="space-y-1.5">
        <div class="flex justify-between items-center text-xs">
          <span class="font-bold text-indigo-300">Product Title (英文标题)</span>
          <span class="text-[10px] text-slate-400 font-mono">{{ product.amazonListing.title.length }} 字符</span>
        </div>
        <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-white leading-relaxed select-all">
          {{ product.amazonListing.title }}
        </div>
      </div>

      <!-- Bullet Points -->
      <div v-if="product.amazonListing.bulletPoints.length" class="space-y-2">
        <div class="text-xs font-bold text-cyan-300">Bullet Points (5大五点描述)</div>
        <div class="space-y-2">
          <div
            v-for="(bp, idx) in product.amazonListing.bulletPoints"
            :key="idx"
            class="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans"
          >
            <span class="font-bold text-indigo-400 mr-1.5">BP {{ idx + 1 }}:</span>
            {{ bp }}
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-1.5">
        <div class="text-xs font-bold text-slate-300">Product Description (A+ 基础文案)</div>
        <div
          class="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto"
        >
          {{ product.amazonListing.description }}
        </div>
      </div>

      <!-- Search Backend Keywords -->
      <div v-if="product.amazonListing.searchKeywords.length" class="space-y-1.5">
        <div class="text-xs font-bold text-amber-300">Search Keywords (后台埋词与 PPC 词根)</div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(kw, idx) in product.amazonListing.searchKeywords"
            :key="idx"
            class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-indigo-300 font-mono"
          >
            {{ kw }}
          </span>
        </div>
      </div>
    </div>

    <!-- 再生成成功的粒子反馈（替代原型 canvas-confetti） -->
    <EcomConfettiLayer :trigger="confettiOn" @done="confettiOn = false" />
  </section>
</template>
