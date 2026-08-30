<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import { skills } from '@/data/skills'
import MarkdownOutput from '@/components/MarkdownOutput.vue'
import type { SkillInputField } from '@/types'
import { skillIconMap, skillCommonIcons } from '@/utils/skillIcons'
import { Play, RotateCcw, Download, Cpu, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

const slug = computed(() => String(route.params.slug || ''))
const skill = computed(() => skills.find((s) => s.slug === slug.value))

// 表单状态
const formValues = ref<Record<string, string>>({})
const initForm = () => {
  if (!skill.value) return
  const init: Record<string, string> = {}
  for (const f of skill.value.inputFields) {
    init[f.key] = skill.value.sampleInput[f.key] ?? ''
  }
  formValues.value = init
}
onMounted(initForm)

// 运行状态
const isRunning = ref(false)
const output = ref('')
const elapsedMs = ref(0)
const charsPerTick = 6
const tickMs = 16
let timer: number | null = null

const currentModel = computed(() => skill.value?.defaultModel || 'deepseek-r1')

// 生成模拟输出：结合 Skill 的 sampleOutput 与用户输入，构造真实的「正在生成」效果
const buildPreview = () => {
  const base = skill.value?.sampleOutput || ''
  const name = skill.value?.name || 'AI 能力'
  return `【${name} · 分析完成】\n\n${base}\n\n——\n⚡ 由 Nova AI Gateway 路由至 ${currentModel.value}\n📊 本次会话输入 ${formValues.value[skill.value?.inputFields[0]?.key || '']?.length || 0} 字，输出预估耗时 ${(elapsedMs.value / 1000).toFixed(1)}s`
}

const stopRun = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isRunning.value = false
}

const run = async () => {
  if (isRunning.value) return
  const requiredMissing = skill.value?.inputFields.filter((f) => f.required && !formValues.value[f.key]?.trim())
  if (requiredMissing && requiredMissing.length) {
    alert(`请先填写必填项：${requiredMissing.map((f) => f.label).join('、')}`)
    return
  }

  isRunning.value = true
  output.value = ''
  elapsedMs.value = 0
  const preview = buildPreview()
  const full = preview

  // 流式输出模拟
  timer = window.setInterval(() => {
    elapsedMs.value += tickMs
    const target = Math.min(output.value.length + charsPerTick, full.length)
    output.value = full.slice(0, target)
    if (output.value.length >= full.length) {
      stopRun()
    }
  }, tickMs)
}

const reset = () => {
  stopRun()
  output.value = ''
  elapsedMs.value = 0
  initForm()
}

const downloadResult = () => {
  if (!output.value) return
  const blob = new Blob([output.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${skill.value?.slug || 'skill'}-result.md`
  a.click()
  URL.revokeObjectURL(url)
}

const fieldInput = (f: SkillInputField) => (event: Event) => {
  formValues.value[f.key] = (event.target as HTMLInputElement | HTMLTextAreaElement).value
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <div class="pt-20" />

    <main v-if="skill" class="pb-20">
      <!-- Breadcrumb + title -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <router-link :to="`/skills/${skill.slug}`" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <component :is="skillCommonIcons.ArrowRight" class="w-3.5 h-3.5 rotate-180" />
          返回 {{ skill.name }} 详情
        </router-link>

        <div class="flex items-center gap-3.5 mt-4">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
            <component :is="skillIconMap[skill.icon] || skillCommonIcons.Zap" class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">{{ skill.name }} · 在线使用</h1>
            <p class="text-xs text-slate-500 mt-0.5">填写左侧表单，点击「开始运行」体验效果（当前为演示输出）</p>
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
                  <Cpu class="w-3.5 h-3.5 text-blue-400" />
                  输入参数
                </span>
                <span class="text-[10px] text-slate-500 font-mono">skill://{{ skill.slug }}</span>
              </div>
              <div class="p-5 space-y-4">
                <div v-for="f in skill.inputFields" :key="f.key" class="space-y-1.5">
                  <label class="flex items-center gap-1 text-xs font-bold text-slate-700">
                    {{ f.label }}
                    <span v-if="f.required" class="text-red-500">*</span>
                  </label>

                  <textarea
                    v-if="f.type === 'textarea'"
                    :value="formValues[f.key] || ''"
                    @input="fieldInput(f)"
                    :placeholder="f.placeholder"
                    rows="3"
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
                class="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
              >
                <Loader2 v-if="isRunning" class="w-4 h-4 animate-spin" />
                <Play v-else class="w-4 h-4" />
                {{ isRunning ? '生成中…' : '开始运行' }}
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
            <div class="rounded-xl bg-blue-50 border border-blue-200 px-3.5 py-3 text-xs text-blue-700 leading-relaxed">
              当前为在线演示模式，输出为示例效果。购买后即可接入真实模型调用，享受完整能力。
            </div>
          </div>

          <!-- Output -->
          <div class="lg:col-span-3">
            <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div class="px-5 py-3 bg-slate-900 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-slate-300">输出结果</span>
                  <span v-if="isRunning" class="text-[10px] text-emerald-400 flex items-center gap-1.5">
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
              <div class="p-5 flex-1 min-h-[380px]">
                <MarkdownOutput v-if="output" :content="output" />
                <div v-else class="h-full flex flex-col items-center justify-center text-center py-16">
                  <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                    <component :is="skillCommonIcons.Play" class="w-5 h-5" />
                  </div>
                  <p class="text-sm text-slate-400 max-w-xs leading-relaxed">
                    填写左侧参数后点击「开始运行」，这里会展示 {{ skill.name }} 的输出结果
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
      <h2 class="text-2xl font-extrabold text-slate-900 mb-4">Skill 不存在</h2>
      <router-link
        to="/skills"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl"
      >
        返回能力市场
      </router-link>
    </main>

    <FooterSection />
    <ContactFloat />
  </div>
</template>
