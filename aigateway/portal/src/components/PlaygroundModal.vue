<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, Play, Copy, Check, Sparkles, RefreshCw, Cpu } from 'lucide-vue-next'
import { models } from '@/data/models'

const emit = defineEmits<{
  close: []
}>()

const selectedModelId = ref('deepseek-v4-pro')
const promptInput = ref('写一段 Python 脚本，使用 OpenAI 官方客户端连接 Nova AI 网关，发起多轮流式对话并计算延迟。')
const temperature = ref(0.7)
const useCache = ref(true)
const isStreaming = ref(true)

const isLoading = ref(false)
const responseOutput = ref('')
const latencyMetrics = ref<{ ttft: number; totalTime: number; tokens: number; cacheHit: boolean } | null>(null)
const copied = ref(false)

let streamTimer: number | null = null

const currentModel = computed(
  () => models.find((m) => m.id === selectedModelId.value) || models[0],
)

const buildResponse = (isHit: boolean) => {
  const streamFlag = isStreaming.value ? 'True' : 'False'
  const code = `import os
from openai import OpenAI

# 配置 Nova API Key 与 Base URL 即可接入
client = OpenAI(
    api_key=os.environ.get("NOVA_API_KEY", "nv-sk-xxxxxxxxxxxxxxxx"),
    base_url="http://api.starnov.cn/v1"
)

response = client.chat.completions.create(
    model="${selectedModelId.value}",
    messages=[
        {"role": "system", "content": "You are Nova AI Assistant."},
        {"role": "user", "content": "${promptInput.value.replace(/"/g, '\\"')}"}
    ],
    temperature=${temperature.value},
    stream=${streamFlag}
)

if ${streamFlag}:
    for chunk in response:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)
else:
    print(response.choices[0].message.content)`

  return `已通过 Nova AI Gateway 转发至 ${currentModel.value.name}（${currentModel.value.provider}）

\`\`\`python
${code}
\`\`\`

✅ **Request Status**: 200 OK
⚡ **Gateway Overhead**: 1.2ms
🧠 **Semantic Cache**: ${isHit ? 'Hit (Saved 80% Cost)' : 'Miss (Forwarded to Provider)'}
📡 **Stream**: ${isStreaming.value ? 'SSE 流式转发' : '非流式'}`
}

const handleRunSimulation = () => {
  if (isLoading.value) return
  isLoading.value = true
  responseOutput.value = ''
  latencyMetrics.value = null
  copied.value = false

  const isHit = useCache.value && Math.random() > 0.3
  const ttft = isHit ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 80) + 120
  const totalTokens = Math.floor(Math.random() * 200) + 150

  latencyMetrics.value = {
    ttft,
    totalTime: ttft + Math.floor(totalTokens * 1.8),
    tokens: totalTokens,
    cacheHit: isHit,
  }

  const full = buildResponse(isHit)
  let i = 0
  if (streamTimer) {
    clearInterval(streamTimer)
  }
  streamTimer = window.setInterval(() => {
    i += 60
    responseOutput.value = full.slice(0, i)
    if (i >= full.length) {
      responseOutput.value = full
      if (streamTimer) {
        clearInterval(streamTimer)
        streamTimer = null
      }
      isLoading.value = false
    }
  }, 30)
}

const handleCopy = async () => {
  if (!responseOutput.value) return
  try {
    await navigator.clipboard.writeText(responseOutput.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* 剪贴板权限受限时静默忽略 */
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (streamTimer) clearInterval(streamTimer)
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
    <div class="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
      <!-- Modal Header -->
      <div class="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Nova API 实时沙盒控制台</span>
              <span class="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-mono">
                Live API Testing
              </span>
            </h3>
            <p class="text-xs text-slate-500">
              测试跨模型请求响应速度、控制参数与语义缓存降级效果
            </p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Config Panel -->
        <div class="lg:col-span-5 space-y-5">
          <!-- Model Select -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-2">
              目标测试模型 (Model ID)
            </label>
            <select
              v-model="selectedModelId"
              class="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
            >
              <option v-for="m in models" :key="m.id" :value="m.id">
                {{ m.name }} ({{ m.provider }}) - {{ m.inputPrice }}
              </option>
            </select>
          </div>

          <!-- Prompt Input -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-2">
              测试 Prompt 输入
            </label>
            <textarea
              v-model="promptInput"
              rows="4"
              class="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-sans resize-none"
              placeholder="请输入用于测试大模型的提示词..."
            />
          </div>

          <!-- Controls -->
          <div class="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <div class="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Temperature (随机性)</span>
                <span class="font-mono text-blue-600">{{ temperature }}</span>
              </div>
              <input
                v-model.number="temperature"
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-200">
              <span class="font-semibold text-slate-700">开启语义流式缓存 (Cache)</span>
              <input v-model="useCache" type="checkbox" class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-200">
              <span class="font-semibold text-slate-700">开启 SSE 流式传输 (Stream)</span>
              <input v-model="isStreaming" type="checkbox" class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
            </div>
          </div>

          <button
            @click="handleRunSimulation"
            :disabled="isLoading"
            class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <template v-if="isLoading">
              <RefreshCw class="w-4 h-4 animate-spin text-white" />
              <span>正在模拟网关路由并发响应...</span>
            </template>
            <template v-else>
              <Play class="w-4 h-4 fill-white" />
              <span>发起 API 沙盒模拟请求</span>
            </template>
          </button>
        </div>

        <!-- Right Output Terminal -->
        <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div class="flex-1 rounded-2xl bg-slate-900 border border-slate-800 p-4 text-slate-200 font-mono text-xs flex flex-col justify-between overflow-hidden shadow-inner">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <span class="text-slate-400 font-semibold flex items-center gap-1.5">
                <Cpu class="w-3.5 h-3.5 text-blue-400" />
                API Response Inspector
              </span>

              <button
                v-if="responseOutput"
                @click="handleCopy"
                class="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300"
              >
                <Check v-if="copied" class="w-3 h-3 text-emerald-400" />
                <Copy v-else class="w-3 h-3" />
                <span>{{ copied ? '已复制' : '复制结果' }}</span>
              </button>
            </div>

            <div class="py-4 overflow-y-auto max-h-[260px] whitespace-pre-wrap leading-relaxed text-slate-300">
              <div
                v-if="isLoading && !responseOutput"
                class="flex items-center gap-2 text-blue-400 animate-pulse py-8 justify-center"
              >
                <RefreshCw class="w-5 h-5 animate-spin" />
                <span>通过 Anycast 优化路由转发中...</span>
              </div>

              <div
                v-if="!isLoading && !responseOutput"
                class="text-center text-slate-500 py-12"
              >
                <p>点击左下角按钮发起来自 API 网关的请求模拟</p>
              </div>

              <span v-if="responseOutput">{{ responseOutput }}</span>
            </div>

            <!-- Metrics bar -->
            <div
              v-if="latencyMetrics"
              class="pt-3 border-t border-slate-800 grid grid-cols-4 gap-2 text-[11px] text-center"
            >
              <div class="bg-slate-950 p-2 rounded border border-slate-800">
                <span class="block text-slate-400">TTFT 首字延迟</span>
                <span class="font-bold text-emerald-400">{{ latencyMetrics.ttft }} ms</span>
              </div>
              <div class="bg-slate-950 p-2 rounded border border-slate-800">
                <span class="block text-slate-400">总响应耗时</span>
                <span class="font-bold text-blue-400">{{ latencyMetrics.totalTime }} ms</span>
              </div>
              <div class="bg-slate-950 p-2 rounded border border-slate-800">
                <span class="block text-slate-400">生成 Tokens</span>
                <span class="font-bold text-slate-200">{{ latencyMetrics.tokens }}</span>
              </div>
              <div class="bg-slate-950 p-2 rounded border border-slate-800">
                <span class="block text-slate-400">语义缓存命中</span>
                <span :class="latencyMetrics.cacheHit ? 'text-emerald-400' : 'text-slate-400'" class="font-bold">
                  {{ latencyMetrics.cacheHit ? 'HIT (缓存)' : 'MISS' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
        * 沙盒使用真实 OpenAI SDK Protocol 模拟转发，生产环境只需更改 Base URL 与 API Key 即可全量切换。
      </div>
    </div>
  </div>
</template>
