<script setup lang="ts">
// 环保 AI 员工矩阵 · 3 分钟客户路演脚本指南 —— 转译自原型 PitchGuideModal.tsx
import { ref, watch, computed } from 'vue'
import {
  X, Clock, Sparkles, ChevronRight, Lightbulb, AlertCircle, Play, Quote,
} from 'lucide-vue-next'
import type { EnvEmployeeId } from '@/data/envAgentData'
import { ENV_AGENTS_META, envAgentMetaOf } from '@/data/envAgentData'
import { ENV_PITCH_SCRIPTS } from '@/data/envPitchData'

export type EnvPitchCurrent = EnvEmployeeId | 'overview'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    currentAgentId?: EnvPitchCurrent
    initialAgentId?: EnvEmployeeId
  }>(),
  { currentAgentId: 'overview', initialAgentId: undefined },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select-agent', id: EnvEmployeeId): void
}>()

// 打开时默认聚焦：显式指定的 Agent > 当前所在 Agent > 合规官
const startAgent = computed<EnvEmployeeId>(() =>
  props.initialAgentId
  ?? (props.currentAgentId === 'overview' ? 'compliance' : props.currentAgentId),
)

const selectedAgent = ref<EnvEmployeeId>(startAgent.value)
watch(
  () => props.isOpen,
  (open) => {
    if (open) selectedAgent.value = startAgent.value
  },
)

const script = computed(() => ENV_PITCH_SCRIPTS[selectedAgent.value] || ENV_PITCH_SCRIPTS.compliance)
const agentMeta = computed(() => envAgentMetaOf(selectedAgent.value))

const handleJumpToAgent = () => {
  emit('select-agent', selectedAgent.value)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div class="relative w-full max-w-4xl bg-[#0F1218] border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-8">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A0C10]">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                环保企业现场演示「3 分钟路演脚本指南」
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  SALES WEAPON
                </span>
              </h2>
              <p class="text-xs text-slate-400">
                专为向环保企业老板、咨询机构合伙人、工业EHS总监现场演示设计的结构化讲演指南
              </p>
            </div>
          </div>
          <button
            @click="emit('close')"
            class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Agent Switcher Tabs inside Modal -->
        <div class="flex items-center gap-1.5 px-6 py-3 bg-[#0A0C10] border-b border-slate-800 overflow-x-auto [scrollbar-width:none]">
          <button
            v-for="agent in ENV_AGENTS_META"
            :key="agent.id"
            @click="selectedAgent = agent.id"
            class="px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
            :class="selectedAgent === agent.id
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'"
          >
            {{ agent.name }}
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <!-- Top Banner: Pain vs Value -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Target Audience Pain -->
            <div class="md:col-span-2 p-4 rounded-xl bg-[#0A0C10] border border-slate-800 space-y-2">
              <div class="flex items-center gap-2 text-xs font-semibold text-rose-400 font-mono uppercase tracking-wider">
                <AlertCircle class="w-4 h-4" />
                <span>客户核心痛点（演示前先提问共鸣）</span>
              </div>
              <ul class="space-y-1.5">
                <li v-for="(pain, idx) in script.targetPain" :key="idx" class="text-xs text-slate-300 flex items-start gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>{{ pain }}</span>
                </li>
              </ul>
            </div>

            <!-- Time Saving Metric -->
            <div class="p-4 rounded-xl bg-[#0A0C10] border border-emerald-500/20 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider">
                  <Clock class="w-4 h-4" />
                  <span>核心提效数据</span>
                </div>
                <p class="mt-2 text-xs font-medium text-emerald-200 leading-relaxed">
                  {{ script.timeSavingMetric }}
                </p>
              </div>
              <div class="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400/80 font-mono">
                <span>传统：{{ agentMeta.traditionalCost }}</span>
                <span>AI：{{ agentMeta.aiCost }}</span>
              </div>
            </div>
          </div>

          <!-- 3-Minute Minute-by-Minute Pitch Script -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2 font-mono uppercase tracking-wider">
              <Play class="w-4 h-4 text-emerald-400" />
              <span>3 分钟实操演示演练步骤</span>
            </h3>

            <div class="space-y-3">
              <div
                v-for="(step, idx) in script.pitchSteps"
                :key="idx"
                class="p-4 rounded-xl bg-[#0A0C10] border border-slate-800 hover:border-emerald-500/30 transition-all space-y-3"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                      {{ step.minute }}
                    </span>
                    <h4 class="text-xs font-bold text-white">
                      {{ step.title }}
                    </h4>
                  </div>
                  <span class="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-500/20 font-mono">
                    💡 {{ step.highlight }}
                  </span>
                </div>

                <!-- UI Action -->
                <div class="p-2.5 rounded-lg bg-[#0F1218] border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <span class="text-cyan-400 font-semibold flex-shrink-0 font-mono">👉 演示动作:</span>
                  <span>{{ step.action }}</span>
                </div>

                <!-- Speaking Script -->
                <div class="p-3 rounded-lg bg-[#0F1218] border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                  <div class="text-[11px] font-semibold text-emerald-400 mb-1 flex items-center gap-1 font-mono">
                    <Quote class="w-3 h-3" />
                    <span>对客讲解话术：</span>
                  </div>
                  {{ step.script }}
                </div>
              </div>
            </div>
          </div>

          <!-- Boss Hook / Closing Phrase -->
          <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20">
            <div class="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1.5 font-mono uppercase tracking-wider">
              <Lightbulb class="w-4 h-4 text-emerald-400" />
              <span>3分钟演示终结句（直击老板心智）</span>
            </div>
            <p class="text-sm font-semibold text-slate-100 italic">
              {{ script.bossHook }}
            </p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0A0C10]">
          <span class="text-xs text-slate-400">
            建议：现场演示时先抛出痛点问答，再点击一键加载案例让客户亲眼见证 30 秒生成。
          </span>
          <button
            @click="handleJumpToAgent"
            class="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <span>立即切换到该 Agent 演示</span>
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
