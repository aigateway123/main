<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Search, ArrowRight, Cpu, X } from 'lucide-vue-next'
import { models, providers, providerFilterList } from '@/data/models'
import type { ModelInfo } from '@/types'

defineProps<{
  adminUrl?: string
}>()

const emit = defineEmits<{
  'open-console': []
}>()

const selectedProvider = ref('All')
const searchQuery = ref('')
const activeModelModal = ref<ModelInfo | null>(null)
const currentPage = ref(1)

const PER_PAGE = 8 // 2 rows × 4 columns

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

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredModels.value.length / PER_PAGE))
})

const pagedModels = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  const end = start + PER_PAGE
  return filteredModels.value.slice(start, end)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Reset to page 1 when filter/search changes
const prevFilteredLength = ref(filteredModels.value.length)
import { watch } from 'vue'
watch(filteredModels, (val) => {
  if (val.length !== prevFilteredLength.value) {
    currentPage.value = 1
    prevFilteredLength.value = val.length
  }
})
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
          全矩阵模型覆盖 · Supported Models
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

      <!-- Model Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="model in pagedModels"
          :key="model.id"
          :class="[
            'p-6 rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between group shadow-sm',
            model.isPopular
              ? 'border-blue-400 shadow-md ring-1 ring-blue-500/20 bg-gradient-to-b from-blue-50/20 to-white'
              : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
          ]"
        >
          <div>
            <!-- Header Badge -->
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {{ model.provider }}
              </span>
              <span v-if="model.badge" class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {{ model.badge }}
              </span>
            </div>

            <!-- Name -->
            <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
              {{ model.name }}
            </h3>
            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {{ model.description }}
            </p>

            <!-- Specs -->
            <div class="space-y-2 py-3 border-y border-slate-100 text-xs font-mono">
              <div class="flex justify-between text-slate-500">
                <span>上下文窗口:</span>
                <span class="text-slate-800 font-semibold">{{ model.contextWindow }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>平均首字延迟:</span>
                <span class="text-emerald-600 font-semibold">{{ model.avgLatency }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>输入 / 输出单价:</span>
                <span class="text-blue-600 font-semibold">{{ model.inputPrice }}</span>
              </div>
            </div>

            <!-- Capabilities tags -->
            <div class="flex flex-wrap gap-1.5 my-4">
              <span
                v-for="(cap, idx) in model.capabilities"
                :key="idx"
                class="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
              >
                {{ cap }}
              </span>
            </div>
          </div>

          <!-- Action Button -->
          <button
            @click="activeModelModal = model"
            class="w-full mt-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <span>查看详细参数 & 试用</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Pagination Dots -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'w-2.5 h-2.5 rounded-full transition-all duration-300',
            currentPage === page
              ? 'bg-blue-600 w-6'
              : 'bg-slate-300 hover:bg-slate-400'
          ]"
          :aria-label="'第 ' + page + ' 页'"
        />
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
            <div class="flex justify-between">
              <span class="text-slate-500">网关路由策略:</span>
              <span class="text-indigo-600 font-semibold">自动负载均衡 + 健康监控降级</span>
            </div>
          </div>

          <p class="text-sm text-slate-600">{{ activeModelModal.description }}</p>

          <div class="flex gap-3">
            <button
              @click="activeModelModal = null"
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
    </div>
  </section>
</template>
