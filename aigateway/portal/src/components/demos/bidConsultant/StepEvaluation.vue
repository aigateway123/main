<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calculator,
  Sparkles,
  TrendingUp
} from 'lucide-vue-next'
import type { EvaluationScoreItem } from '@/data/bidConsultantData'

interface Props {
  scores: EvaluationScoreItem[]
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

const totalMaxScore = computed(() => props.scores.reduce((sum, item) => sum + item.maxScore, 0))
const totalExpectedScore = computed(() => props.scores.reduce((sum, item) => sum + item.expectedScore, 0))
const totalPotential = computed(() => props.scores.reduce((sum, item) => sum + item.improvementPotential, 0))

const percentage = computed(() => Math.round((totalExpectedScore.value / totalMaxScore.value) * 100) || 0)
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200">
    <!-- Header with Score KPI Card -->
    <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Calculator class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              第四步：评标规则全维度拆解
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              将商务、技术、价格、团队及服务逐项打通，精确测算当前预计得分与可挖掘的提分空间。
            </p>
          </div>
        </div>

        <!-- Big Bento Score Counter -->
        <div class="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 self-stretch sm:self-auto">
          <div>
            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">预计综合得分</div>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="text-3xl sm:text-4xl font-extrabold text-blue-700 font-mono">
                {{ totalExpectedScore.toFixed(1) }}
              </span>
              <span class="text-sm font-bold text-slate-500">/ {{ totalMaxScore }} 分</span>
            </div>
          </div>

          <div class="h-10 w-px bg-slate-200" />

          <div>
            <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">最大提分潜能</div>
            <div class="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5 font-mono">
              +{{ totalPotential.toFixed(1) }} 分
            </div>
          </div>
        </div>
      </div>

      <!-- Visual Progress Bar -->
      <div class="mt-6 space-y-2">
        <div class="flex justify-between text-xs font-semibold">
          <span class="text-slate-700">得分率测算: <strong class="text-blue-700">{{ percentage }}%</strong></span>
          <span class="text-emerald-700 font-bold">冲刺目标: {{ (totalExpectedScore + totalPotential).toFixed(1) }} 分 (满分竞争力)</span>
        </div>
        <div class="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 flex gap-1 border border-slate-200">
          <div
            class="h-full rounded-full bg-blue-600 transition-all duration-500"
            :style="{ width: `${(totalExpectedScore / totalMaxScore) * 100}%` }"
          />
          <div
            class="h-full rounded-full bg-emerald-500 transition-all duration-500"
            :style="{ width: `${(totalPotential / totalMaxScore) * 100}%` }"
            :title="`可挖掘提分空间: +${totalPotential}分`"
          />
        </div>
      </div>
    </div>

    <!-- Main Scoring Breakdown Table -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BarChart3 class="w-4 h-4 text-blue-600" />
          <h3 class="text-sm font-bold text-slate-900">评分细则与得分预测明细</h3>
        </div>
        <span class="text-xs font-semibold text-slate-500">共 {{ scores.length }} 个评分项</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase">
              <th class="py-3.5 px-4 w-[16%]">评分项</th>
              <th class="py-3.5 px-4 w-[8%] text-center">满分</th>
              <th class="py-3.5 px-4 w-[28%]">评分标准与扣分规则</th>
              <th class="py-3.5 px-4 w-[26%]">企业当前情况匹配</th>
              <th class="py-3.5 px-4 w-[10%] text-center">预计得分</th>
              <th class="py-3.5 px-4 w-[12%] text-center">提分空间</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
            <tr v-for="item in scores" :key="item.id" class="hover:bg-slate-50/60 transition-colors">
              <!-- Name & Category -->
              <td class="py-4 px-4 align-top">
                <div class="font-bold text-slate-900 text-xs sm:text-sm">{{ item.name }}</div>
                <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {{ item.category }}
                </span>
              </td>

              <!-- Max Score -->
              <td class="py-4 px-4 align-top text-center">
                <span class="font-mono font-bold text-slate-800 text-sm">
                  {{ item.maxScore }}
                </span>
              </td>

              <!-- Criteria -->
              <td class="py-4 px-4 align-top">
                <p class="text-xs text-slate-700 leading-relaxed font-mono">
                  {{ item.criteria }}
                </p>
              </td>

              <!-- Current Status -->
              <td class="py-4 px-4 align-top">
                <div class="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {{ item.currentStatus }}
                </div>
                <p v-if="item.improvementTips" class="text-[11px] text-amber-700 font-medium mt-1.5 flex items-start gap-1">
                  <Sparkles class="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                  <span>{{ item.improvementTips }}</span>
                </p>
              </td>

              <!-- Expected Score -->
              <td class="py-4 px-4 align-top text-center">
                <span class="inline-block font-extrabold text-blue-700 text-base font-mono bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  {{ item.expectedScore }}
                </span>
              </td>

              <!-- Improvement Potential -->
              <td class="py-4 px-4 align-top text-center">
                <template v-if="item.improvementPotential > 0">
                  <span class="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-sm font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <TrendingUp class="w-3.5 h-3.5" />
                    +{{ item.improvementPotential }}
                  </span>
                </template>
                <span v-else class="text-slate-400 text-xs font-mono">已顶格(满分)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between pt-2">
      <button
        @click="$emit('prev-step')"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-sm transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>返回：废标风险</span>
      </button>

      <button
        @click="$emit('next-step')"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
      >
        <span>下一步：寻找得分机会</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
</template>
