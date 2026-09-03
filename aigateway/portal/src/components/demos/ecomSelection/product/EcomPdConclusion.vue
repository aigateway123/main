<script setup lang="ts">
// 产品详情 · 分段子组件 9/9 —— AI 最终建议与决策（原型 TAB: conclusion）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx
// 星级由 finalDecision.stars 驱动（主产品 5 星），文案忠实照抄原型
import { computed } from 'vue'
import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-vue-next'
import type { ProductOpportunity } from '@/data/ecomIntelData'

const props = defineProps<{
  product: ProductOpportunity
}>()

const emit = defineEmits<{
  (e: 'toggle-save', id: string): void
  (e: 'goto-strategy'): void
}>()

const filledStars = computed(() => props.product.finalDecision.stars)
const emptyStars = computed(() => Math.max(0, 5 - props.product.finalDecision.stars))

const toggleSave = () => emit('toggle-save', props.product.id)
const gotoStrategy = () => emit('goto-strategy')
</script>

<template>
  <section
    class="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border-2 border-indigo-500/50 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
  >
    <!-- 决策头部 -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-500/30">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2 w-fit">
          <Sparkles class="w-3.5 h-3.5" />
          <span>AI 选品情报员最终建议与决策研判</span>
        </div>
        <h2 class="text-2xl font-black text-white">{{ product.finalDecision.verdict }}</h2>
        <div class="text-sm font-mono text-emerald-400 font-bold mt-1 flex items-center gap-2">
          <span>{{ product.finalDecision.scoreText }}</span>
          <span class="text-amber-400 tracking-wider">
            <span v-for="n in filledStars" :key="`f${n}`">★</span>
            <span v-for="n in emptyStars" :key="`e${n}`" class="text-slate-600">★</span>
          </span>
        </div>
      </div>

      <div class="bg-slate-950/90 border border-indigo-500/40 px-5 py-3 rounded-xl text-center w-fit md:w-auto">
        <div class="text-[10px] text-slate-400">建议执行动作</div>
        <div class="text-base font-bold text-white">{{ product.finalDecision.recommendationAction }}</div>
      </div>
    </div>

    <!-- 正向信号 / 风险与预案 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Pros -->
      <div v-if="product.finalDecision.pros.length" class="bg-slate-950/80 p-5 rounded-xl border border-emerald-500/30 space-y-3">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 class="w-4 h-4" />
          <span>为什么值得卖？核心立项依据 (6大正向信号)</span>
        </h3>
        <div class="space-y-2 text-xs text-slate-200">
          <div
            v-for="(pro, idx) in product.finalDecision.pros"
            :key="idx"
            class="p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/40 leading-relaxed"
          >
            {{ pro }}
          </div>
        </div>
      </div>

      <!-- Risks -->
      <div class="bg-slate-950/80 p-5 rounded-xl border border-amber-500/30 space-y-3">
        <h3 class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle class="w-4 h-4" />
          <span>主要潜在风险与应对预案 (3项预警)</span>
        </h3>
        <div v-if="product.finalDecision.risks.length" class="space-y-2 text-xs text-slate-200">
          <div
            v-for="(risk, idx) in product.finalDecision.risks"
            :key="idx"
            class="p-2 rounded-lg bg-amber-950/20 border border-amber-900/40 leading-relaxed"
          >
            {{ risk }}
          </div>
        </div>
        <p v-else class="text-xs text-slate-500">暂无风险预警数据</p>

        <!-- Next Steps -->
        <div v-if="product.finalDecision.nextSteps.length" class="pt-2">
          <div class="text-xs font-bold text-indigo-300 mb-2">下一步推进建议清单：</div>
          <div class="space-y-1 text-[11px] text-slate-400">
            <div v-for="(step, idx) in product.finalDecision.nextSteps" :key="idx">{{ step }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Final AI Verdict Banner -->
    <div class="bg-indigo-600/10 border border-indigo-500/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h4 class="text-sm font-bold text-indigo-300">Final AI Verdict: Highly Recommended</h4>
        <p class="text-xs text-indigo-200/70 mt-0.5">
          Highly recommended for market entry. Focus on portability and anti-leakage branding for a 40%+ margin potential.
        </p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <button
          class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold shadow-lg shadow-indigo-500/20 transition cursor-pointer"
          @click="gotoStrategy"
        >
          Generate Amazon Listing
        </button>
        <button
          class="px-5 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-md text-xs font-bold transition cursor-pointer"
          @click="toggleSave"
        >
          {{ product.isSaved ? 'In Portfolio' : 'Save to Portfolio' }}
        </button>
      </div>
    </div>
  </section>
</template>
