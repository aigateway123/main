<script setup lang="ts">
// 产品详情 · 分段子组件 4/9 —— 消费者洞察与痛点（原型 TAB: consumer）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx
import { Users, Sparkles } from 'lucide-vue-next'
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
          <Users class="w-5 h-5 text-indigo-400" />
          <span>AI 消费者洞察 (Consumer Sentiment & Pain Point Extraction)</span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          深度挖掘分析
          <span class="text-white font-mono font-bold">{{ product.reviewsAnalyzedCount.toLocaleString() }} 条</span>
          真实买家评价
        </p>
      </div>
      <div class="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/60 w-fit">
        NLP 语义聚类模型 v4.2
      </div>
    </div>

    <!-- 核心用户痛点排行 -->
    <div class="space-y-3">
      <div class="text-xs font-bold text-slate-300">AI 自动提炼核心用户痛点排行 (Top Pain Points)</div>

      <div v-if="product.topPainPoints.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(pp, idx) in product.topPainPoints"
          :key="pp.id"
          class="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-3 flex flex-col justify-between relative overflow-hidden"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                TOP {{ idx + 1 }}
              </span>
              <span class="text-xs font-mono font-bold text-rose-300">出现频率: {{ pp.frequency }}</span>
            </div>
            <h4 class="text-sm font-bold text-white">{{ pp.title }}</h4>
            <p class="text-xs text-slate-300 leading-relaxed">{{ pp.description }}</p>
          </div>
          <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 italic">
            {{ pp.sampleQuote }}
          </div>
        </div>
      </div>
      <div v-else class="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
        暂无差评痛点样本数据
      </div>
    </div>

    <!-- 用户 Wishlist + AI 产品概念 + 推导闭环 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <!-- User Wishlist -->
      <div class="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>用户真正想要什么？(User Wishlist)</span>
        </h3>
        <div v-if="product.userWishlist.length" class="space-y-2 text-xs">
          <div
            v-for="(w, idx) in product.userWishlist"
            :key="idx"
            class="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200"
          >
            {{ w }}
          </div>
        </div>
        <div v-else class="text-xs text-slate-500">暂无用户期望样本数据</div>
      </div>

      <!-- AI Suggested Concept & Closed Loop -->
      <div class="bg-gradient-to-br from-indigo-950/60 to-slate-950 p-5 rounded-xl border border-indigo-500/40 space-y-4 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles class="w-4 h-4 text-amber-400" />
            <span>AI 建议产品雏形定义 (AI Product Concept)</span>
          </div>
          <div class="p-3.5 rounded-xl bg-indigo-900/30 border border-indigo-500/40 text-sm font-bold text-white leading-relaxed">
            "{{ product.aiSuggestedProductHeadline }}"
          </div>
        </div>

        <!-- 洞察推导逻辑闭环 -->
        <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
          <div class="text-[11px] text-slate-400 mb-2 font-semibold">洞察推导逻辑闭环 (Derivation Flow):</div>
          <div class="flex items-center justify-between text-center text-[10px] font-medium text-slate-300">
            <span class="p-1.5 bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">消费者痛点</span>
            <span>→</span>
            <span class="p-1.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">AI提取需求</span>
            <span>→</span>
            <span class="p-1.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">产品机会</span>
            <span>→</span>
            <span class="p-1.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">差异化方案</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
