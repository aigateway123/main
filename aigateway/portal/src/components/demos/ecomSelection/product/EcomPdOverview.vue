<script setup lang="ts">
// 产品详情 · 分段子组件 1/9 —— 综合评分拆解（原型 TAB: overview & Score Breakdown）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx
// 机会评分维度条复用共享 EcomScoreBadge（原型 common/ScoreBadge）
import { computed } from 'vue'
import { Award, ShieldCheck } from 'lucide-vue-next'
import type { ProductOpportunity, ScoreBreakdown } from '@/data/ecomIntelData'
import EcomScoreBadge from '../EcomScoreBadge.vue'

const props = defineProps<{
  product: ProductOpportunity
}>()

const DIMS: { label: string; desc: string; key: keyof ScoreBreakdown }[] = [
  { label: '市场需求', key: 'marketDemand', desc: '年同比搜索 +38.4%' },
  { label: '增长趋势', key: 'growthTrend', desc: 'Google Trends持续攀升' },
  { label: '竞争程度 (易度)', key: 'competitionEase', desc: '头部老旧模具差评多' },
  { label: '利润空间', key: 'profitMargin', desc: '单件毛利超 42%' },
  { label: '差异化空间', key: 'differentiationSpace', desc: '6大结构改良壁垒' },
  { label: '用户痛点明显', key: 'userPainPoints', desc: '28% 集中漏水差评' },
  { label: '进入难度 (易度)', key: 'entryDifficultyEase', desc: '长三角/东莞供应链成熟' },
]

const scoreCards = computed(() =>
  DIMS.map((d) => ({ label: d.label, desc: d.desc, score: props.product.scoreBreakdown[d.key] })),
)
</script>

<template>
  <section class="space-y-6">
    <!-- Section 头部 -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <Award class="w-5 h-5 text-indigo-400" />
        <span>产品机会评分体系 (Product Opportunity Score Breakdown)</span>
      </h2>
      <span class="text-xs text-slate-400">总分 {{ product.score }} / 100</span>
    </div>

    <!-- 7 大机会评分维度条 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
      <div
        v-for="c in scoreCards"
        :key="c.label"
        class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
      >
        <div class="space-y-1">
          <div class="text-[11px] text-slate-400 font-medium">{{ c.label }}</div>
          <EcomScoreBadge :score="c.score" size="sm" :show-label="false" />
        </div>
        <div class="space-y-1">
          <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
              :style="{ width: `${c.score}%` }"
            ></div>
          </div>
          <div class="text-[10px] text-slate-400 leading-tight">{{ c.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 评分机制说明 -->
    <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
      <ShieldCheck class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
      <div>
        <span class="font-bold text-white">评分机制说明：</span>
        竞争程度与进入难度得分采用“反向归一化”，分数越高代表该维度越容易进入（即竞争阻力小、供应链成熟、新手友好）。
      </div>
    </div>
  </section>
</template>
