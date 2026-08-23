<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Search, Cpu, X, Zap, Terminal, Info, Clock } from 'lucide-vue-next'
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

      <!-- Pricing Notice: 官方最新价 + 峰谷/动态分档说明 -->
      <div class="mb-12 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-blue-50/80 to-sky-50/80 p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-3">
          <Info class="w-4 h-4 text-indigo-600" />
          <h3 class="text-sm font-bold text-slate-900">按量计费 · 价格说明</h3>
          <span class="text-[10px] font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-full px-2 py-0.5 ml-auto whitespace-nowrap">同步官方最新价</span>
        </div>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-600 leading-relaxed">
          <li class="flex gap-2">
            <span class="text-indigo-500 shrink-0">•</span>
            <span>价格均为官方最新人民币报价（/ 1M Tokens），输入、输出、缓存读分别计费，按量后付费，用多少算多少。</span>
          </li>
          <li class="flex gap-2">
            <span class="text-indigo-500 shrink-0">•</span>
            <span><b>动态分档：</b>GPT-5.6 Sol / Terra 等模型按输入上下文长度分档计费（≤272K 标准档 / &gt;272K 长上下文档，约 2 倍价），请求时自动匹配档位。</span>
          </li>
          <li class="flex gap-2">
            <span class="text-indigo-500 shrink-0">•</span>
            <span><b>峰谷优惠：</b>支持峰谷分时计费 — 夜间低谷时段（21:00–06:00）价格 5 折、周末 8 折；卡片带「峰谷计费」标识的模型已启用该能力。</span>
          </li>
          <li class="flex gap-2">
            <span class="text-indigo-500 shrink-0">•</span>
            <span><b>缓存计费：</b>缓存读价按命中缓存的输入 token 计费；缓存创建价在首次写入缓存时计费（约 5 分钟 TTL），常用上下文可大幅降低成本。</span>
          </li>
        </ul>
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
                <span v-if="model.badge" class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles class="w-3 h-3" />
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
                <span class="text-slate-500 shrink-0">输入价格</span>
                <span class="text-slate-900 font-semibold text-right">{{ model.inputPrice }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-slate-500 shrink-0">输出价格</span>
                <span class="text-slate-900 font-semibold text-right">{{ model.outputPrice }}</span>
              </div>
              <div v-if="model.cachePrice" class="flex justify-between gap-2">
                <span class="text-slate-500 shrink-0">缓存读价</span>
                <span class="text-blue-600 font-semibold text-right">{{ model.cachePrice }}</span>
              </div>
              <div v-if="model.cacheWritePrice" class="flex justify-between gap-2">
                <span class="text-slate-500 shrink-0">缓存创建价</span>
                <span class="text-blue-600 font-semibold text-right">{{ model.cacheWritePrice }}</span>
              </div>
            </div>

            <!-- Dynamic pricing / 峰谷 tag -->
            <div v-if="model.dynamicPricing || model.capabilities.includes('峰谷计费')" class="flex flex-wrap gap-1.5">
              <span v-if="model.dynamicPricing" class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Clock class="w-3 h-3" />
                {{ model.dynamicPricing }}
              </span>
              <span v-if="model.capabilities.includes('峰谷计费')" class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Zap class="w-3 h-3" />
                峰谷计费
              </span>
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
            <div v-if="activeModelModal.cacheWritePrice" class="flex justify-between">
              <span class="text-slate-500">缓存创建价:</span>
              <span class="text-blue-600 font-semibold">{{ activeModelModal.cacheWritePrice }}</span>
            </div>
            <div v-if="activeModelModal.dynamicPricing" class="flex justify-between">
              <span class="text-slate-500">计费方式:</span>
              <span class="text-indigo-600 font-semibold">{{ activeModelModal.dynamicPricing }}</span>
            </div>
            <div v-if="activeModelModal.capabilities.includes('峰谷计费')" class="flex justify-between">
              <span class="text-slate-500">峰谷计费:</span>
              <span class="text-amber-600 font-semibold">夜间低谷 5 折 / 周末 8 折</span>
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
