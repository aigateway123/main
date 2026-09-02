<script setup lang="ts">
// 转译自原型 AgentExecutionFlow.tsx —— 8 位员工通用的「任务执行流水线」
import { CheckCircle2, Loader2, Sparkles, BookOpen, Terminal } from 'lucide-vue-next'
import type { EnvExecutionStep } from '@/data/envAgentData'
import { computed } from 'vue'

const props = defineProps<{
  steps: EnvExecutionStep[]
  isExecuting: boolean
  agentName: string
}>()
const emit = defineEmits<{ (e: 'execute-again'): void }>()

const completedCount = computed(() => props.steps.filter((s) => s.status === 'completed').length)
const progressPercent = computed(() => Math.round((completedCount.value / props.steps.length) * 100))
</script>

<template>
  <div class="bg-[#0F1218] border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
            AI WORKFORCE PIPELINE
          </span>
          <span class="text-xs text-slate-600">|</span>
          <span class="text-xs font-semibold text-slate-300">
            {{ agentName }} · 任务执行流水线
          </span>
        </div>
        <h3 class="text-base font-bold text-white mt-1">
          实时业务闭环：资料解析 → 法规匹配 → 风险建模 → 成果生成
        </h3>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <div class="text-xs text-slate-400">执行进度</div>
          <div class="text-sm font-bold text-emerald-400 font-mono">
            {{ completedCount }} / {{ steps.length }} 步骤 ({{ progressPercent }}%)
          </div>
        </div>
        <button
          @click="emit('execute-again')"
          :disabled="isExecuting"
          class="px-3.5 py-1.5 rounded-lg bg-[#0A0C10] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          <Loader2 v-if="isExecuting" class="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <Sparkles v-else class="w-3.5 h-3.5 text-emerald-400" />
          <span>{{ isExecuting ? 'AI 正在分析...' : '重新运行分析' }}</span>
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-[#0A0C10] rounded-full h-1.5 overflow-hidden border border-slate-800">
      <div
        class="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 ease-out"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>

    <!-- Step Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(step, idx) in steps"
        :key="step.id"
        :class="[
          'p-4 rounded-xl border transition-all relative flex flex-col justify-between',
          step.status === 'completed'
            ? 'bg-[#0A0C10] border-emerald-500/30 text-slate-200 shadow-sm'
            : step.status === 'running'
              ? 'bg-[#0A0C10] border-emerald-500 text-slate-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-[#0A0C10]/60 border-slate-800 text-slate-500',
        ]"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
              STEP 0{{ idx + 1 }}
            </span>
            <div v-if="step.status === 'completed'" class="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>已完成</span>
            </div>
            <div v-else-if="step.status === 'running'" class="flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
              <Loader2 class="w-3.5 h-3.5 animate-spin" />
              <span>正在执行...</span>
            </div>
            <span v-else class="text-[11px] text-slate-500">等待中</span>
          </div>

          <h4 class="text-xs font-bold text-slate-200 mb-1">
            {{ step.title }}
          </h4>
          <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {{ step.description }}
          </p>
        </div>

        <!-- Matched Rules or Logs Badges -->
        <div v-if="step.rulesMatched && step.rulesMatched.length > 0" class="mt-3 pt-2.5 border-t border-slate-800 space-y-1">
          <div class="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <BookOpen class="w-3 h-3" />
            <span>已调用 {{ step.rulesMatched.length }} 条国家法规库</span>
          </div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(rule, rIdx) in step.rulesMatched.slice(0, 2)"
              :key="rIdx"
              class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 truncate max-w-full font-mono"
            >
              {{ rule }}
            </span>
          </div>
        </div>

        <div v-if="step.detailLogs && step.detailLogs.length > 0" class="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1 font-mono truncate">
          <Terminal class="w-3 h-3 text-cyan-400 flex-shrink-0" />
          <span class="truncate">{{ step.detailLogs[0] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
