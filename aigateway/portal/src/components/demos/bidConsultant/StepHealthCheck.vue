<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  Stethoscope
} from 'lucide-vue-next'
import type { BidHealthCheckResult, HealthCheckIssue } from '@/data/bidConsultantData'

interface Props {
  healthCheck: BidHealthCheckResult
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

const issues = ref<HealthCheckIssue[]>(props.healthCheck.top10Issues)
const solvedIds = ref<Set<number>>(new Set())

const toggleSolved = (rank: number) => {
  const next = new Set(solvedIds.value)
  if (next.has(rank)) {
    next.delete(rank)
  } else {
    next.add(rank)
  }
  solvedIds.value = next
}

const solvedCount = computed(() => solvedIds.value.size)

// Dynamic score based on solved count
const dynamicScore = computed(() =>
  Math.min(
    100,
    props.healthCheck.healthScore +
      Math.round((solvedCount.value / (issues.value.length || 1)) * (100 - props.healthCheck.healthScore))
  )
)

const remainingHigh = computed(
  () => issues.value.filter((i) => i.severity === 'high' && !solvedIds.value.has(i.rank)).length
)
const remainingMedium = computed(
  () => issues.value.filter((i) => i.severity === 'medium' && !solvedIds.value.has(i.rank)).length
)

const dimensions = computed(() => [
  { label: '资格文件完整性', data: props.healthCheck.dimensionChecks.qualification },
  { label: '商务及印章签署', data: props.healthCheck.dimensionChecks.commercial },
  { label: '技术参数响应度', data: props.healthCheck.dimensionChecks.technical },
  { label: '评分项材料齐全', data: props.healthCheck.dimensionChecks.scoreCoverage },
  { label: '格式排版规范', data: props.healthCheck.dimensionChecks.formatting },
  { label: '前后逻辑一致性', data: props.healthCheck.dimensionChecks.consistency }
])

const getDimensionStatus = (status: string) => {
  const badgeClass =
    status === 'pass'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : status === 'warning'
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-red-700 bg-red-50 border-red-200'
  const statusText = status === 'pass' ? '✓ 合规通过' : status === 'warning' ? '⚠ 存在瑕疵' : '✕ 存在风险'
  return { badgeClass, statusText }
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200">
    <!-- Health Score Overview Card -->
    <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Stethoscope class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                第九步：投标文件智能体检（封标前终审）
              </h2>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              模拟资深评标专家与封标审查员，全方位排查格式、印章、参数及评分闭环漏洞。
            </p>
          </div>
        </div>

        <!-- Health Score Gauge -->
        <div class="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 self-stretch sm:self-auto shadow-sm">
          <div>
            <div class="text-[11px] font-semibold text-slate-500 uppercase">当前标书健康度评分</div>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span
                :class="dynamicScore >= 95
                  ? 'text-emerald-600'
                  : dynamicScore >= 80
                  ? 'text-blue-600'
                  : 'text-amber-600'"
                class="text-3xl sm:text-4xl font-extrabold"
              >
                {{ dynamicScore }}
              </span>
              <span class="text-sm font-semibold text-slate-500">/ 100 分</span>
            </div>
          </div>

          <div class="h-10 w-px bg-slate-200" />

          <div class="text-xs space-y-1">
            <div class="text-red-700 font-bold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-red-600"></span>
              <span>未解高危: {{ remainingHigh }} 项</span>
            </div>
            <div class="text-amber-700 font-semibold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>未解中危: {{ remainingMedium }} 项</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 6 Dimensions Health Status -->
      <div class="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div
          v-for="(dim, idx) in dimensions"
          :key="idx"
          class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-between"
        >
          <span class="text-[11px] text-slate-500 block mb-1.5 font-medium">{{ dim.label }}</span>
          <div>
            <span
              :class="getDimensionStatus(dim.data.status).badgeClass"
              class="inline-block px-2 py-0.5 rounded text-[11px] font-bold border"
            >
              {{ getDimensionStatus(dim.data.status).statusText }}
            </span>
            <p v-if="dim.data.detail" class="text-[10px] text-slate-500 mt-1 line-clamp-1" :title="dim.data.detail">
              {{ dim.data.detail }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 10 Issues Table -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Flame class="w-4 h-4 text-red-600" />
          <h3 class="text-sm font-bold text-slate-900">
            提交前必须解决的 Top 10 重点问题清单
          </h3>
        </div>
        <span class="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          已解决 {{ solvedCount }} / {{ issues.length }} 项
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase">
              <th class="py-3.5 px-4 w-[6%] text-center">排查</th>
              <th class="py-3.5 px-4 w-[8%] text-center">序号</th>
              <th class="py-3.5 px-4 w-[12%]">问题类别</th>
              <th class="py-3.5 px-4 w-[34%]">排查隐患与异常描述</th>
              <th class="py-3.5 px-4 w-[8%] text-center">严峻度</th>
              <th class="py-3.5 px-4 w-[14%]">所在章节/位置</th>
              <th class="py-3.5 px-4 w-[18%]">整改建议动作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
            <tr
              v-for="issue in issues"
              :key="issue.rank"
              :class="solvedIds.has(issue.rank) ? 'bg-slate-50/40 opacity-60' : ''"
              class="hover:bg-slate-50/60 transition-colors"
            >
              <!-- Solve Checkbox -->
              <td class="py-4 px-4 align-middle text-center">
                <button
                  @click="toggleSolved(issue.rank)"
                  :class="solvedIds.has(issue.rank)
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'border border-slate-300 hover:border-blue-500 text-transparent'"
                  class="w-5 h-5 rounded flex items-center justify-center transition-all"
                  :title="solvedIds.has(issue.rank) ? '标记为未解决' : '标记为已整改完成'"
                >
                  <Check v-if="solvedIds.has(issue.rank)" class="w-4 h-4" />
                </button>
              </td>

              <!-- Rank -->
              <td class="py-4 px-4 align-middle text-center font-mono font-bold text-slate-500">
                #{{ issue.rank }}
              </td>

              <!-- Category -->
              <td class="py-4 px-4 align-middle font-semibold text-slate-700">
                {{ issue.category }}
              </td>

              <!-- Issue Description -->
              <td class="py-4 px-4 align-middle">
                <p :class="solvedIds.has(issue.rank) ? 'line-through text-slate-400' : 'text-slate-900'" class="font-medium">
                  {{ issue.issue }}
                </p>
              </td>

              <!-- Severity -->
              <td class="py-4 px-4 align-middle text-center">
                <span v-if="issue.severity === 'high'" class="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                  🔴 致命
                </span>
                <span v-else-if="issue.severity === 'medium'" class="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  🟡 严重
                </span>
                <span v-else class="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🟢 提示
                </span>
              </td>

              <!-- Location -->
              <td class="py-4 px-4 align-middle">
                <span class="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {{ issue.location }}
                </span>
              </td>

              <!-- Fix advice -->
              <td class="py-4 px-4 align-middle">
                <span class="text-xs text-emerald-700 font-semibold leading-relaxed">
                  {{ issue.fixAdvice }}
                </span>
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
        <span>返回：方案框架</span>
      </button>

      <button
        @click="$emit('next-step')"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
      >
        <span>生成一页纸「AI投标作战报告」</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
</template>
