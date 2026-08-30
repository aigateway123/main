<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import { getTeamBySlug } from '@/data/expertTeams'
import { skills } from '@/data/skills'
import { teamIconMap, teamCommonIcons } from '@/utils/teamIcons'
import { skillIconMap } from '@/utils/skillIcons'
import MarkdownOutput from '@/components/MarkdownOutput.vue'
import { Play, RotateCcw, Download, Loader2, CheckCircle2, Pause } from 'lucide-vue-next'
import type { SkillInputField } from '@/types'

const route = useRoute()
const router = useRouter()
const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

const slug = computed(() => String(route.params.slug || ''))
const team = computed(() => getTeamBySlug(slug.value))

const skillOf = (skillSlug: string) => skills.find((s) => s.slug === skillSlug)

// 表单状态
const formValues = ref<Record<string, string>>({})
const initForm = () => {
  if (!team.value) return
  const init: Record<string, string> = {}
  for (const f of team.value.inputFields) {
    init[f.key] = team.value.sampleTask ?? ''
  }
  formValues.value = init
}
onMounted(initForm)

// 运行状态
type StepStatus = 'pending' | 'running' | 'done'
const stepStatus = ref<StepStatus[]>([])
const isRunning = ref(false)
const currentStep = ref(-1)
const finishedSteps = ref<number[]>([])
const output = ref('')
const elapsedMs = ref(0)
const charsPerTick = 8
const tickMs = 16
let stepTimer: number | null = null
let outTimer: number | null = null

const resetRun = () => {
  if (stepTimer) clearInterval(stepTimer)
  if (outTimer) clearInterval(outTimer)
  stepTimer = null
  outTimer = null
  stepStatus.value = (team.value?.flow ?? []).map(() => 'pending')
  currentStep.value = -1
  finishedSteps.value = []
  output.value = ''
  elapsedMs.value = 0
  isRunning.value = false
}

const fieldInput = (f: SkillInputField) => (event: Event) => {
  formValues.value[f.key] = (event.target as HTMLInputElement | HTMLTextAreaElement).value
}

/** 汇总最终交付物（结合团队示例交付物） */
const buildDeliverable = () => {
  const base = team.value?.sampleDeliverable || ''
  return `【${team.value?.name || '专家团'} · 协作完成】\n\n${base}\n\n——\n⚡ ${team.value?.members.length || 0} 位专家接力完成\n🧩 流程节点 ${team.value?.flow.length || 0} 步\n📊 本次任务输入 ${formValues.value[team.value?.inputFields[0]?.key || '']?.length || 0} 字，总耗时预估 ${(elapsedMs.value / 1000).toFixed(1)}s`
}

/** 执行一个流程节点 */
const runStep = (idx: number) => {
  stepStatus.value[idx] = 'running'
  currentStep.value = idx
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      stepStatus.value[idx] = 'done'
      finishedSteps.value.push(idx)
      currentStep.value = -1
      resolve()
    }, 900)
  })
}

const run = async () => {
  if (!team.value || isRunning.value) return
  const requiredMissing = team.value.inputFields.filter((f) => f.required && !formValues.value[f.key]?.trim())
  if (requiredMissing.length) {
    alert(`请先填写必填项：${requiredMissing.map((f) => f.label).join('、')}`)
    return
  }

  isRunning.value = true
  output.value = ''
  elapsedMs.value = 0
  stepStatus.value = team.value.flow.map(() => 'pending')
  finishedSteps.value = []

  // 逐步执行协作流程
  for (let i = 0; i < team.value.flow.length; i++) {
    await runStep(i)
  }

  // 最终交付物流式输出
  const full = buildDeliverable()
  let n = 0
  outTimer = window.setInterval(() => {
    n += charsPerTick
    elapsedMs.value += tickMs
    output.value = full.slice(0, n)
    if (n >= full.length) {
      output.value = full
      if (outTimer) clearInterval(outTimer)
      outTimer = null
      isRunning.value = false
    }
  }, tickMs)
}

const reset = () => {
  resetRun()
  initForm()
}

const downloadResult = () => {
  if (!output.value) return
  const blob = new Blob([output.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${team.value?.slug || 'team'}-result.md`
  a.click()
  URL.revokeObjectURL(url)
}

const modeLabel = (mode: string) => {
  const map: Record<string, string> = { plan: '拆解', parallel: '并行', sequential: '串行', merge: '汇总' }
  return map[mode] || mode
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <div class="pt-20" />

    <main v-if="team" class="pb-20">
      <!-- Breadcrumb + title -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <router-link :to="`/skills?tab=team`" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <component :is="teamCommonIcons.ArrowRight" class="w-3.5 h-3.5 rotate-180" />
          返回能力市场 · 专家团
        </router-link>

        <div class="flex items-center gap-3.5 mt-4">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
            <component :is="teamIconMap[team.icon] || teamCommonIcons.Users" class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">{{ team.name }} · 在线协作</h1>
            <p class="text-xs text-slate-500 mt-0.5">填写左侧任务，一键启动 {{ team.members.length }} 位专家接力协作（当前为演示输出）</p>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <!-- Input form -->
          <div class="lg:col-span-2 space-y-4">
            <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div class="px-5 py-3 bg-slate-900 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  任务输入
                </span>
                <span class="text-[10px] text-slate-500 font-mono">team://{{ team.slug }}</span>
              </div>
              <div class="p-5 space-y-4">
                <div v-for="f in team.inputFields" :key="f.key" class="space-y-1.5">
                  <label class="flex items-center gap-1 text-xs font-bold text-slate-700">
                    {{ f.label }}
                    <span v-if="f.required" class="text-red-500">*</span>
                  </label>

                  <textarea
                    v-if="f.type === 'textarea'"
                    :value="formValues[f.key] || ''"
                    @input="fieldInput(f)"
                    :placeholder="f.placeholder"
                    rows="4"
                    class="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all resize-none"
                  />
                  <input
                    v-else-if="f.type === 'text'"
                    :value="formValues[f.key] || ''"
                    @input="fieldInput(f)"
                    :placeholder="f.placeholder"
                    class="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                  />
                  <select
                    v-else
                    :value="formValues[f.key] || ''"
                    @change="fieldInput(f)"
                    class="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                  >
                    <option value="" disabled>请选择</option>
                    <option v-for="opt in f.options" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2.5">
              <button
                @click="run"
                :disabled="isRunning"
                class="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
              >
                <Loader2 v-if="isRunning" class="w-4 h-4 animate-spin" />
                <Play v-else class="w-4 h-4" />
                {{ isRunning ? '协作中…' : '启动协作' }}
              </button>
              <button
                @click="reset"
                class="inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all"
              >
                <RotateCcw class="w-4 h-4" />
                重置
              </button>
            </div>

            <!-- Notice -->
            <div class="rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-3 text-xs text-indigo-700 leading-relaxed">
              协作过程为演示模拟，购买后可接入真实模型多轮调用，体验完整协作。
            </div>
          </div>

          <!-- 协作舞台 + 输出 -->
          <div class="lg:col-span-3 space-y-4">
            <!-- 协作过程舞台 -->
            <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div class="px-5 py-3 bg-slate-900 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  协作过程
                  <span v-if="isRunning" class="text-[10px] text-emerald-400 flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    专家接力中
                  </span>
                </span>
                <span class="text-[10px] text-slate-500 font-mono">{{ finishedSteps.length }}/{{ team.flow.length }} 步完成</span>
              </div>

              <div class="p-5 space-y-3">
                <!-- 任务起点 -->
                <div class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="w-7 h-7 rounded-lg bg-slate-900 p-1.5 flex items-center justify-center text-white shrink-0">
                    <component :is="teamCommonIcons.Users" class="w-3.5 h-3.5 text-indigo-400" />
                  </span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-800">你下达任务</p>
                    <p class="text-[11px] text-slate-500 truncate">一句话描述目标，专家团开始拆解分工</p>
                  </div>
                </div>

                <!-- 流程节点 -->
                <div
                  v-for="(node, idx) in team.flow"
                  :key="node.step"
                  class="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border transition-all"
                  :class="{
                    'border-indigo-300 bg-indigo-50/50 shadow-sm': stepStatus[idx] === 'running',
                    'border-slate-200 bg-slate-50': stepStatus[idx] === 'done',
                    'border-slate-200 bg-white opacity-70': stepStatus[idx] === 'pending',
                  }"
                >
                  <span
                    class="w-8 h-8 rounded-lg p-1.5 flex items-center justify-center text-white shrink-0"
                    :class="[
                      stepStatus[idx] === 'done' ? 'bg-emerald-500'
                        : stepStatus[idx] === 'running' ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                        : 'bg-slate-300'
                    ]"
                  >
                    <CheckCircle2 v-if="stepStatus[idx] === 'done'" class="w-4 h-4" />
                    <Loader2 v-else-if="stepStatus[idx] === 'running'" class="w-4 h-4 animate-spin" />
                    <component v-else :is="skillIconMap[skillOf(node.skillSlug)?.icon || ''] || teamCommonIcons.Zap" class="w-4 h-4" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-xs font-extrabold text-slate-900">{{ node.role }}</span>
                      <span class="text-[9px] font-bold px-1.5 py-px rounded bg-slate-100 text-slate-500 border border-slate-200">
                        {{ modeLabel(node.mode) }}
                      </span>
                      <span v-if="stepStatus[idx] === 'done'" class="text-[10px] text-emerald-600 font-semibold">已完成</span>
                      <span v-else-if="stepStatus[idx] === 'running'" class="text-[10px] text-indigo-600 font-semibold">工作中…</span>
                    </div>
                    <p class="text-xs font-semibold text-slate-700 mt-0.5">{{ node.title }}</p>
                    <p v-if="stepStatus[idx] === 'done'" class="text-[11px] text-slate-500 leading-relaxed mt-1">
                      输出：{{ node.output }}
                    </p>
                    <div
                      v-if="stepStatus[idx] === 'done' && node.snapshot"
                      class="mt-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-600 leading-relaxed"
                    >
                      {{ node.snapshot }}
                    </div>
                  </div>
                </div>

                <!-- 交付终点 -->
                <div
                  class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all"
                  :class="output ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50 opacity-70'"
                >
                  <span class="w-7 h-7 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 flex items-center justify-center text-white shrink-0">
                    <Download class="w-3.5 h-3.5" />
                  </span>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-800">交付成果</p>
                    <p class="text-[11px] text-slate-500 truncate">{{ output ? '交付物已生成，可下载' : '等待专家完成协作' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 输出区 -->
            <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div class="px-5 py-3 bg-slate-900 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-slate-300">交付结果</span>
                  <span v-if="output && isRunning" class="text-[10px] text-emerald-400 flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    生成中
                  </span>
                  <span v-else-if="output" class="text-[10px] text-slate-500">{{ (elapsedMs / 1000).toFixed(1) }}s</span>
                </div>
                <button
                  @click="downloadResult"
                  :disabled="!output"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-all"
                >
                  <Download class="w-3 h-3" />
                  下载 Markdown
                </button>
              </div>
              <div class="p-5 min-h-[220px]">
                <MarkdownOutput v-if="output" :content="output" />
                <div v-else class="flex flex-col items-center justify-center text-center py-10">
                  <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                    <Pause class="w-5 h-5" />
                  </div>
                  <p class="text-sm text-slate-400 max-w-xs leading-relaxed">
                    填写左侧任务后点击「启动协作」，专家们将接力完成并汇总交付结果
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Not found -->
    <main v-else class="py-32 text-center">
      <h2 class="text-2xl font-extrabold text-slate-900 mb-4">专家团不存在</h2>
      <router-link
        to="/skills?tab=team"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl"
      >
        返回能力市场
      </router-link>
    </main>

    <FooterSection />
    <ContactFloat />
  </div>
</template>
