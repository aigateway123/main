<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight, Code2, Copy, Check } from 'lucide-vue-next'
import { codeSamples } from '@/data/codeSamples'

defineProps<{
  adminUrl: string
}>()

const emit = defineEmits<{
  'open-console': []
}>()

const selectedLang = ref('python')
const copied = ref(false)

const currentSample = computed(() => {
  return codeSamples.find((s) => s.lang === selectedLang.value) || codeSamples[0]
})

const handleCopy = () => {
  navigator.clipboard.writeText(currentSample.value.code)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const highlightUrl = (line: string) => {
  const url = 'https://api.novagateway.ai/v1'
  if (line.includes(url)) {
    const parts = line.split(url)
    return {
      hasHighlight: true,
      before: parts[0],
      url: url,
      after: parts.slice(1).join(url),
    }
  }
  return { hasHighlight: false }
}

const isComment = (line: string) => {
  const trimmed = line.trim()
  return trimmed.startsWith('#') || trimmed.startsWith('//')
}
</script>

<template>
  <section class="relative pt-32 pb-20 overflow-hidden bg-white text-slate-900 flex flex-col justify-center border-b border-slate-100">
    <!-- Background Gradients & Mesh Accent -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />
    <div class="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

    <!-- Subtle Grid overlay -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 my-auto">
      <!-- Top Badge -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-sm hover:border-blue-300 transition-colors">
          <span class="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Nova Gateway v2.5 发布</span>
          <span class="text-slate-300">|</span>
          <span>已支持 DeepSeek、智谱 GLM 等多模型统一接入</span>
          <ArrowRight class="w-3.5 h-3.5 text-blue-600" />
        </div>
      </div>

      <!-- Main Headline & Slogan -->
      <div class="text-center max-w-4xl mx-auto space-y-6">
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
          一个 API 调用 <br class="hidden sm:inline" />
          <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
            全品类顶级 AI 模型
          </span>
        </h1>

        <p class="text-xl sm:text-2xl text-slate-700 font-semibold tracking-wide">
          统一接入 <span class="text-blue-600 font-bold">·</span> 智能路由 <span class="text-blue-600 font-bold">·</span> 成本优化
        </p>

        <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          企业级 AI 统一网关，兼容 OpenAI SDK 接口规范。免改造集成 DeepSeek、智谱 GLM 等主流大模型，支持多 Provider 自动故障切换，让您专注于业务而非基础设施。
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            @click="emit('open-console')"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>开始免费使用</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <!-- Live Code Snippet Box -->
      <div class="mt-12 max-w-5xl mx-auto">
        <div class="rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl overflow-hidden">
          <!-- Window Bar Header -->
          <div class="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 gap-2">
            <div class="flex items-center gap-2">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-500/80" />
                <div class="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div class="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span class="text-xs font-mono text-slate-400 ml-2 hidden sm:inline-flex items-center gap-1.5">
                <Code2 class="w-3.5 h-3.5 text-blue-400" />
                {{ currentSample.filename }}
              </span>
            </div>

            <!-- Language Selector Tabs -->
            <div class="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                v-for="sample in codeSamples"
                :key="sample.lang"
                @click="selectedLang = sample.lang"
                :class="[
                  'px-3 py-1 text-xs font-medium rounded-md transition-all',
                  selectedLang === sample.lang
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                ]"
              >
                {{ sample.label.split(' ')[0] }}
              </button>
            </div>

            <!-- Copy Code Button -->
            <button
              @click="handleCopy"
              class="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <template v-if="copied">
                <Check class="w-3.5 h-3.5 text-emerald-400" />
                <span class="text-emerald-400 font-semibold">已复制</span>
              </template>
              <template v-else>
                <Copy class="w-3.5 h-3.5 text-slate-400" />
                <span>复制代码</span>
              </template>
            </button>
          </div>

          <!-- Code Content Box -->
          <div class="p-4 sm:p-6 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto min-h-[420px]">
            <div v-for="(line, i) in currentSample.code.split('\n')" :key="i" class="flex leading-[1.15]">
              <span class="w-8 text-slate-600 select-none text-right pr-4 text-xs shrink-0">{{ i + 1 }}</span>
              <span class="whitespace-pre-wrap break-words" :class="isComment(line) ? 'text-slate-500 italic' : 'text-slate-300'">
                <template v-if="highlightUrl(line).hasHighlight">
                  {{ highlightUrl(line).before }}
                  <span class="bg-blue-600/30 text-blue-300 font-bold px-1 rounded border border-blue-500/40">"https://api.novagateway.ai/v1"</span>
                  {{ highlightUrl(line).after }}
                </template>
                <template v-else>
                  {{ line }}
                </template>
              </span>
            </div>
          </div>

          <!-- Footer Notice -->
          <div class="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>全网 API 端点地址: <code class="text-blue-300 font-mono">https://api.novagateway.ai/v1</code></span>
            </div>
            <span class="text-slate-400">支持原生 OpenAI 客户端 / Python / JS / Go / LangChain</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
