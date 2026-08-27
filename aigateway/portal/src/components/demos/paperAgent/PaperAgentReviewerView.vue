<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import {
  Search,
  AlertTriangle,
  Bot,
  Loader2,
  Sparkles,
  ArrowRight,
  FileText,
  ShieldAlert,
  ThumbsUp,
  Lightbulb,
  Check,
  Award,
} from 'lucide-vue-next'
import type { ReviewReport, ReviewIssue } from '@/data/paperAgentData'

const props = defineProps<{
  reviewReport: ReviewReport
  isReviewing: boolean
  hasAppliedAblation: boolean
  hasAppliedStats: boolean
  hasAppliedUnits: boolean
  hasAppliedReferences: boolean
}>()

const emit = defineEmits<{
  (e: 'apply-ablation'): void
  (e: 'apply-stats'): void
  (e: 'apply-units'): void
  (e: 'apply-references'): void
  (e: 'apply-all'): void
  (e: 'go-to-paper'): void
}>()

const selectedIssueId = ref('issue-ablation')
const reviewStepIndex = ref(0)
const completedCheckpoints = ref<number[]>([])

const reviewCheckpoints = [
  '方法完整性 (Methodology Completeness)',
  '实验充分性 (Experimental Rigor & Ablation)',
  '数据合理性 (Data Validity & Splits)',
  'Baseline完整性 (Baseline Coverage)',
  '统计显著性 (Statistical Significance & p-values)',
  '图表规范 (Figure & Table Standards)',
  '学术表达 (Academic Tone & Reference Standards)',
]

let reviewTimer: ReturnType<typeof setInterval> | null = null

watch(
  () => props.isReviewing,
  (reviewing) => {
    if (reviewTimer) clearInterval(reviewTimer)
    reviewTimer = null
    if (!reviewing) return
    reviewStepIndex.value = 0
    completedCheckpoints.value = []
    let idx = 0
    reviewTimer = setInterval(() => {
      if (idx < reviewCheckpoints.length) {
        completedCheckpoints.value = [...completedCheckpoints.value, idx]
        idx++
        reviewStepIndex.value = idx
      } else {
        if (reviewTimer) clearInterval(reviewTimer)
        reviewTimer = null
      }
    }, 350)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (reviewTimer) clearInterval(reviewTimer)
})

const allResolved = computed(() => props.hasAppliedAblation && props.hasAppliedStats && props.hasAppliedUnits && props.hasAppliedReferences)
const currentScore = computed(() => (allResolved.value ? '9.6' : props.hasAppliedAblation ? '8.4' : '5.2'))
const currentDecision = computed(() => (allResolved.value ? 'Accept (录用通过)' : props.hasAppliedAblation ? 'Minor Revision (小修录用)' : 'Major Revision (建议大修)'))
const decisionColor = computed(() => (allResolved.value ? 'text-emerald-400' : props.hasAppliedAblation ? 'text-cyan-400' : 'text-amber-400'))

const allIssues = computed(() => [...props.reviewReport.majorIssues, ...props.reviewReport.minorIssues])
const selectedIssue = computed<ReviewIssue>(() => allIssues.value.find((i) => i.id === selectedIssueId.value) || props.reviewReport.majorIssues[0])

function isIssueResolved(issueId: string) {
  if (issueId === 'issue-ablation') return props.hasAppliedAblation
  if (issueId === 'issue-statistics' || issueId === 'issue-fig-error') return props.hasAppliedStats
  if (issueId === 'issue-table-units') return props.hasAppliedUnits
  if (issueId === 'issue-references') return props.hasAppliedReferences
  return false
}

function handleExecuteIssueAction(issueId: string) {
  if (issueId === 'issue-ablation') emit('apply-ablation')
  else if (issueId === 'issue-statistics' || issueId === 'issue-fig-error') emit('apply-stats')
  else if (issueId === 'issue-table-units') emit('apply-units')
  else if (issueId === 'issue-references') emit('apply-references')
}
</script>

<template>
  <div class="space-y-6 pb-16">
    <!-- AI 审稿进行中动画 -->
    <div
      v-if="isReviewing"
      class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100 relative overflow-hidden"
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
          <Loader2 class="w-5 h-5 animate-spin" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            AI 审稿专家正在评审论文…
            <span class="px-2 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">{{ reviewStepIndex }} / {{ reviewCheckpoints.length }}</span>
          </h2>
          <p class="text-xs text-slate-400">Reviewer Agent 正在按 IEEE 审稿标准逐项检查方法与实验，请稍候</p>
        </div>
      </div>

      <div class="space-y-2.5">
        <div v-for="(cp, idx) in reviewCheckpoints" :key="cp" class="flex items-center gap-3">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 border transition-colors"
            :class="completedCheckpoints.includes(idx)
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : idx === reviewStepIndex && completedCheckpoints.includes(idx - 1)
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 animate-pulse'
                : 'bg-slate-950/60 border-slate-800 text-slate-600'"
          >
            <Check v-if="completedCheckpoints.includes(idx)" class="w-3 h-3" />
            <Loader2 v-else-if="idx === reviewStepIndex && completedCheckpoints.includes(idx - 1)" class="w-3 h-3 animate-spin" />
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span class="text-xs" :class="completedCheckpoints.includes(idx) ? 'text-slate-200' : 'text-slate-500'">{{ cp }}</span>
        </div>
      </div>

      <div class="mt-6 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
          :style="{ width: (reviewStepIndex / reviewCheckpoints.length) * 100 + '%' }"
        />
      </div>
    </div>

    <template v-else>
    <!-- Reviewer Header Card -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100 relative overflow-hidden">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1.5">
              <Search class="w-3.5 h-3.5" />
              <span>Reviewer Agent Peer Report · 同行审稿评审报告</span>
            </span>
            <span class="text-xs text-slate-400 font-mono">{{ reviewReport.confidence }}</span>
          </div>

          <div class="flex items-center gap-4">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
              审稿结论: <span :class="decisionColor">{{ currentDecision }}</span>
            </h1>
            <div class="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl font-mono text-lg font-extrabold text-cyan-400">Score: {{ currentScore }} / 10</div>
          </div>

          <p class="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">{{ reviewReport.summary }}</p>
        </div>

        <!-- Quick Resolution Actions -->
        <div class="flex flex-col gap-2.5 min-w-[220px]">
          <button
            v-if="!allResolved"
            @click="emit('apply-all')"
            class="w-full px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
          >
            <Sparkles class="w-4 h-4 text-emerald-200" />
            <span>一键执行所有修改建议</span>
          </button>
          <div v-else class="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center animate-pulse">
            <div class="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
              <Award class="w-4 h-4 text-emerald-400" />
              <span>论文已通过同行审稿！</span>
            </div>
            <div class="text-[10px] text-emerald-400/80 mt-0.5">所有 Major/Minor 缺陷均已修复</div>
          </div>

          <button
            @click="emit('go-to-paper')"
            class="w-full px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <FileText class="w-4 h-4 text-blue-400" />
            <span>返回论文正文查看改动</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Strengths checklist -->
      <div class="mt-6 pt-4 border-t border-slate-800/80">
        <div class="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
          <ThumbsUp class="w-3.5 h-3.5 text-blue-400" />
          <span>审稿人认可的论文亮点 (Strengths & Contributions)</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div v-for="(str, idx) in reviewReport.strengths" :key="idx" class="text-xs text-slate-300 flex items-start gap-2">
            <span class="text-emerald-400 font-bold mt-0.5">✓</span>
            <span>{{ str }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Reviewer Layout: Left Issue List + Right AI Suggestion & Action Panel -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Issues Classified by Major & Minor -->
      <div class="lg:col-span-6 space-y-5">
        <!-- Major Issues Box -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span class="font-bold text-red-400 flex items-center gap-1.5">
              <AlertTriangle class="w-4 h-4" />
              <span>Major Issues (关键重大缺陷)</span>
            </span>
            <span class="px-2 py-0.5 text-[10px] font-mono bg-red-500/20 text-red-300 rounded border border-red-500/30">{{ reviewReport.majorIssues.length }} Items</span>
          </div>

          <div class="mt-3 space-y-2.5">
            <div
              v-for="issue in reviewReport.majorIssues"
              :key="issue.id"
              @click="selectedIssueId = issue.id"
              :class="`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedIssueId === issue.id ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div v-if="isIssueResolved(issue.id)" class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</div>
                  <span v-else class="text-amber-400 font-bold flex-shrink-0">⚠</span>
                  <span :class="`text-xs font-bold ${isIssueResolved(issue.id) ? 'text-emerald-300 line-through' : 'text-slate-100'}`">{{ issue.title }}</span>
                </div>
                <span v-if="isIssueResolved(issue.id)" class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">已修复</span>
                <span v-else class="px-2 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-300 rounded border border-red-500/30">待解决</span>
              </div>
              <p class="mt-2 text-[11px] text-slate-400 line-clamp-2">{{ issue.critique }}</p>
            </div>
          </div>
        </div>

        <!-- Minor Issues Box -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldAlert class="w-4 h-4" />
              <span>Minor Issues (格式与细节规范)</span>
            </span>
            <span class="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">{{ reviewReport.minorIssues.length }} Items</span>
          </div>

          <div class="mt-3 space-y-2.5">
            <div
              v-for="issue in reviewReport.minorIssues"
              :key="issue.id"
              @click="selectedIssueId = issue.id"
              :class="`p-3 rounded-xl border transition-all cursor-pointer ${
                selectedIssueId === issue.id ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div v-if="isIssueResolved(issue.id)" class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</div>
                  <span v-else class="text-amber-400 font-bold flex-shrink-0">⚠</span>
                  <span :class="`text-xs font-semibold ${isIssueResolved(issue.id) ? 'text-emerald-300 line-through' : 'text-slate-200'}`">{{ issue.title }}</span>
                </div>
                <span v-if="isIssueResolved(issue.id)" class="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 rounded">已修复</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: AI Modification Suggestions & Interactive Resolution Action -->
      <div class="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 sticky top-40">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center">
              <Lightbulb class="w-3.5 h-3.5" />
            </div>
            <span class="font-bold text-white">AI 修改建议 (AI Revision Suggestions)</span>
          </div>
          <span class="text-[11px] text-cyan-400 font-mono">Target: {{ selectedIssue.title.split('(')[0] }}</span>
        </div>

        <!-- Selected Issue Reviewer Critique -->
        <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
          <div class="text-[11px] font-bold text-red-300 uppercase tracking-wider font-mono">审稿人原始意见 (Reviewer Critique)</div>
          <p class="text-xs text-slate-300 leading-relaxed italic">"{{ selectedIssue.critique }}"</p>
        </div>

        <!-- AI Suggestion Box (Detailed in prompt!) -->
        <div class="bg-blue-950/30 border border-blue-500/40 rounded-xl p-4 space-y-3">
          <div class="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <Bot class="w-4 h-4 text-cyan-400" />
            <span>AI 专家智能改进方案</span>
          </div>
          <div class="text-xs text-slate-200 whitespace-pre-line leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-sans">{{ selectedIssue.aiSuggestion }}</div>
          <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-cyan-400" />
            <span>执行效果: {{ selectedIssue.resolutionEffectDescription }}</span>
          </div>
        </div>

        <!-- Primary Action Button for this issue -->
        <div class="pt-2">
          <div v-if="isIssueResolved(selectedIssue.id)" class="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center flex items-center justify-center gap-2 text-xs font-bold text-emerald-300">
            <Check class="w-4 h-4 text-emerald-400" />
            <span>该问题已通过 AI 自动完成修补并写入论文</span>
          </div>
          <button
            v-else
            @click="handleExecuteIssueAction(selectedIssue.id)"
            class="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles class="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>{{ selectedIssue.actionTitle }}</span>
          </button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>
