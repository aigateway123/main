<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Flame,
  PlusCircle,
  Sparkles,
  Swords,
  Zap
} from 'lucide-vue-next'
import type { ScoreOptimizationStrategy } from '@/data/bidConsultantData'

interface Props {
  strategy: ScoreOptimizationStrategy
}

defineProps<Props>()

defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200">
    <!-- Header Bento Card -->
    <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
          <Zap class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              第五步：寻找“得分机会”与差异化提分策略
            </h2>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
              决胜策略
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            不只看文件写了什么，更聚焦于「如何超越竞争对手拿到最高综合分、拉开分差」。
          </p>
        </div>
      </div>
    </div>

    <!-- 4 Classification Quadrants Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 1. 必须满足项 -->
      <div class="p-5 rounded-2xl bg-white border border-red-200 relative overflow-hidden shadow-sm">
        <div class="flex items-center gap-2 text-sm font-bold text-red-700 mb-3">
          <Flame class="w-4 h-4 text-red-600" />
          <span>1. 必须满足项（不满足一票废标）</span>
        </div>
        <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
          <li
            v-for="(item, index) in strategy.mustPassItems"
            :key="index"
            class="flex items-start gap-2 bg-red-50/50 p-2.5 rounded-xl border border-red-100 font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2"></span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- 2. 核心得分项 -->
      <div class="p-5 rounded-2xl bg-white border border-blue-200 relative overflow-hidden shadow-sm">
        <div class="flex items-center gap-2 text-sm font-bold text-blue-700 mb-3">
          <Award class="w-4 h-4 text-blue-600" />
          <span>2. 核心得分项（决定最终排名的基本盘）</span>
        </div>
        <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
          <li
            v-for="(item, index) in strategy.coreScoringItems"
            :key="index"
            class="flex items-start gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2"></span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- 3. 容易被竞争对手拉开差距的项目 -->
      <div class="p-5 rounded-2xl bg-white border border-amber-200 relative overflow-hidden shadow-sm">
        <div class="flex items-center gap-2 text-sm font-bold text-amber-800 mb-3">
          <Swords class="w-4 h-4 text-amber-600" />
          <span>3. 易拉开分差项（重点布防战场）</span>
        </div>
        <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
          <li
            v-for="(item, index) in strategy.competitiveGapItems"
            :key="index"
            class="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2"></span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- 4. 潜在加分项 -->
      <div class="p-5 rounded-2xl bg-white border border-emerald-200 relative overflow-hidden shadow-sm">
        <div class="flex items-center gap-2 text-sm font-bold text-emerald-800 mb-3">
          <PlusCircle class="w-4 h-4 text-emerald-600" />
          <span>4. 潜在加分项（补充材料可拿额外分）</span>
        </div>
        <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
          <li
            v-for="(item, index) in strategy.bonusItems"
            :key="index"
            class="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 font-medium"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Actionable Strategy Cards List (投标提分策略) -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div class="flex items-center gap-2 mb-5">
        <Sparkles class="w-5 h-5 text-amber-500" />
        <h3 class="text-base font-bold text-slate-900">
          AI 投标提分实操打法（Actionable Tactics）
        </h3>
      </div>

      <div class="space-y-3.5">
        <div
          v-for="(tactic, idx) in strategy.actionableTactics"
          :key="idx"
          class="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono border border-blue-200">
                {{ idx + 1 }}
              </span>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base">
                {{ tactic.title }}
              </h4>
            </div>

            <div class="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 font-mono">
                预计增益: {{ tactic.estimatedGain }}
              </span>
              <span
                :class="tactic.priority === 'high' ? 'bg-red-100 text-red-800' : tactic.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'"
                class="px-2 py-0.5 rounded text-[11px] font-bold"
              >
                {{ tactic.priority === 'high' ? '最高优先级' : tactic.priority === 'medium' ? '中优先级' : '优化项' }}
              </span>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8 font-medium">
            {{ tactic.detail }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between pt-2">
      <button
        @click="$emit('prev-step')"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-sm transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>返回：评分拆解</span>
      </button>

      <button
        @click="$emit('next-step')"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
      >
        <span>下一步：企业能力匹配</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
</template>
