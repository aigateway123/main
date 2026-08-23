<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Search, Cpu, X, Zap, Terminal } from 'lucide-vue-next'
import { models, providers, providerFilterList } from '@/data/models'
import type { ModelInfo } from '@/types'
import PlaygroundModal from '@/components/PlaygroundModal.vue'

defineProps<{
  adminUrl?: string
}>()

const emit = defineEmits<{
  'open-console': []
}>()

const selectedProvider = ref('All')
const searchQuery = ref('')
const activeModelModal = ref<ModelInfo | null>(null)
const isPlaygroundOpen = ref(false)
const playgroundModelId = ref('deepseek-v4-pro')

const filteredModels = computed(() => {
  return models.filter((model) => {
    const matchesProvider = selectedProvider.value === 'All' || model.provider === selectedProvider.value
    const matchesSearch =
      searchQuery.value === '' ||
      model.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      model.capabilities.some((c) => c.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesProvider && matchesSearch
  })
})

// 按厂商分组，保留数据原始顺序
const groupedModels = computed(() => {
  const groups: { provider: string; models: ModelInfo[] }[] = []
  for (const model of filteredModels.value) {
    let group = groups.find((g) => g.provider === model.provider)
    if (!group) {
      group = { provider: model.provider, models: [] }
      groups.push(group)
    }
    group.models.push(model)
  }
  return groups
})

const providerInitial = (provider: string) => provider.charAt(0).toUpperCase()

const openSandboxFor = (model: ModelInfo) => {
  activeModelModal.value = null
  playgroundModelId.value = model.id
  isPlaygroundOpen.value = true
}
</script>

<template>
  <section id="models" class="py-24 bg-white text-slate-900 border-b border-slate-200/80 relative overflow-hidden">
    <!-- Background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[150px] pointer-events-none rounded-full" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles class="w-3.5 h-3.5 text-blue-600" />
          模型广场 · 全部按量计费
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          全球主流 AI 模型，<span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">一个 API 全面兼容</span>
        </h2>
        <p class="text-slate-600 text-base sm:text-lg">
          聚合 OpenAI、Anthropic、DeepSeek、智谱、阿里通义、Google、Meta 等主流前沿大模型，无需维护多家账号与充值规则。
        </p>
      </div>

      <!-- Supported Provider Logo Wall -->
      <div class="mb-12 p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80">
        <p class="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
          已完美适配全网 50+ 顶级模型供应商 (OpenAI 协议无缝映射)
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center text-center">
          <div
            v-for="provider in providers"
            :key="provider.name"
            class="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
          >
            <div class="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
              {{ provider.name }}
            </div>
            <div class="text-[10px] text-slate-500 font-mono mt-0.5">{{ provider.desc }}</div>
          </div>
        </div>
      </div>

      <!-- Filters & Search Header -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <!-- Provider Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            v-for="provider in providerFilterList"
            :key="provider"
            @click="selectedProvider = provider"
            :class="[
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all',
              selectedProvider === provider
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            ]"
          >
            {{ provider }}
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-64">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索模型或能力关键词..."
            class="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>
      </div>

      <!-- Grouped by Provider -->
      <div v-if="groupedModels.length === 0" class="py-16 text-center text-slate-400 text-sm">
        未找到匹配的模型，试试其他关键词或切换厂商。
      </div>

      <div v-for="group in groupedModels" :key="group.provider" class="mb-10">
        <!-- Provider Section Header -->
        <div class="flex items-center gap-3 mb-5">
          <div class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
            {{ providerInitial(group.provider) }}
          </div>
          <h3 class="text-lg font-bold text-slate-900">{{ group.provider }}</h3>
          <span class="text-xs text-slate-400">{{ group.models.length }} 个模型</span>
          <div class="flex-1 h-px bg-slate-200" />
        </div>

        <!-- Model Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="model in group.models"
            :key="model.id"
            @click="activeModelModal = model"
            :class="[
              'p-5 rounded-2xl bg-white border transition-all duration-300 flex flex-col gap-4 cursor-pointer group shadow-sm',
              model.isPopular
                ? 'border-blue-400 shadow-md ring-1 ring-blue-500/20 bg-gradient-to-b from-blue-50/20 to-white'
                : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
            ]"
          >
            <!-- Header: provider + pay-as-you-go badge -->
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500">{{ model.provider }}</span>
              <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Zap class="w-3 h-3" />
                按量计费
              </span>
            </div>

            <!-- Name -->
            <div>
              <h4 class="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                {{ model.name }}
                <span v-if="model.badge" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {{ model.badge }}
                </span>
              </h4>
            </div>

            <!-- Description -->
            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
              {{ model.description }}
            </p>

            <!-- Pricing -->
            <div class="space-y-1.5 py-3 border-y border-slate-100 text-xs font-mono">
              <div class="flex justify-between gap-2">
                <span class="text-slate-500 shrink-0">Input Price</span>
                <span class="text-slate-900 font-semibold text-right">{{ model.inputPrice }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-slate-500 shrink-0">Completion Price</span>
                <span class="text-slate-900 font-semibold text-right">{{ model.outputPrice }}</span>
              </div>
              <div v-if="model.cachePrice" class="flex justify-between gap-2">
                <span class="text-slate-500 shrink-0">Cache Read Price</span>
                <span class="text-blue-600 font-semibold text-right">{{ model.cachePrice }}</span>
              </div>
            </div>

            <!-- Capability tags -->
            <div class="flex flex-wrap gap-1.5 mt-auto">
              <span
                v-for="(cap, idx) in model.capabilities"
                :key="idx"
                class="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
              >
                {{ cap }}
              </span>
            </div>

            <!-- Click hint -->
            <div class="text-[10px] text-slate-400 font-semibold flex items-center gap-1 group-hover:text-blue-600 transition-colors">
              <Terminal class="w-3 h-3" />
              点击查看详细参数 & 沙盒测试
            </div>
          </div>
        </div>
      </div>

      <!-- Modal for Model Details -->
      <div
        v-if="activeModelModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        @click.self="activeModelModal = null"
      >
        <div class="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl text-slate-900">
          <button
            @click="activeModelModal = null"
            class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg bg-slate-100"
          >
            <X class="w-4 h-4" />
          </button>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
              <Cpu class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900">{{ activeModelModal.name }}</h3>
              <span class="text-xs text-blue-600 font-semibold">
                适配规范: OpenAI Chat Completion / Stream API
              </span>
            </div>
          </div>

          <div class="space-y-3 bg-slate-50 p-4 rounded-xl text-xs font-mono border border-slate-200">
            <div class="flex justify-between">
              <span class="text-slate-500">模型 API ID:</span>
              <span class="text-blue-600 font-bold">{{ activeModelModal.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">厂商 Provider:</span>
              <span class="text-slate-800">{{ activeModelModal.provider }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Context Window:</span>
              <span class="text-slate-800">{{ activeModelModal.contextWindow }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">输入计费:</span>
              <span class="text-emerald-600 font-semibold">{{ activeModelModal.inputPrice }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">输出计费:</span>
              <span class="text-emerald-600 font-semibold">{{ activeModelModal.outputPrice }}</span>
            </div>
            <div v-if="activeModelModal.cachePrice" class="flex justify-between">
              <span class="text-slate-500">缓存读价:</span>
              <span class="text-blue-600 font-semibold">{{ activeModelModal.cachePrice }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">网关路由策略:</span>
              <span class="text-indigo-600 font-semibold">自动负载均衡 + 健康监控降级</span>
            </div>
          </div>

          <p class="text-sm text-slate-600">{{ activeModelModal.description }}</p>

          <div class="flex gap-3">
            <button
              @click="openSandboxFor(activeModelModal)"
              class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors text-center"
            >
              在 API 沙盒中测试此模型
            </button>
            <button
              @click="activeModelModal = null"
              class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              关闭
            </button>
          </div>
        </div>
      </div>

      <!-- Playground Sandbox -->
      <PlaygroundModal
        v-if="isPlaygroundOpen"
        :initial-model-id="playgroundModelId"
        @close="isPlaygroundOpen = false"
      />
    </div>
  </section>
</template>
