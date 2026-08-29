<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Bot, X, Send, Loader2, Sparkles } from 'lucide-vue-next'
import type { TenderAnalysisResult } from '@/data/bidConsultantData'

interface Props {
  isOpen: boolean
  tenderData: TenderAnalysisResult
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

interface ChatMessage {
  id: string
  role: 'user' | 'model'
  content: string
  time: string
}

const formatTime = () => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

const messages = ref<ChatMessage[]>([
  {
    id: 'init-1',
    role: 'model',
    content: `您好！我是您的专属「AI 投标顾问 Agent」。
我已通读并深度解析《${props.tenderData?.overview?.projectName || '当前项目'}》。

您可以向我咨询关于此项目的任何招投标疑难问题，例如：
1. 本项目最致命的废标条款有哪些？如何防范？
2. 我们的资质如何组合能拿到最高评分？
3. 招标文件有模糊表述，如何向招标代理发起正式澄清函？
4. 电子签章与保证金支付有哪些关键避坑要点？`,
    time: '刚刚'
  }
])
const inputValue = ref('')
const isLoading = ref(false)
const messagesEndRef = ref<HTMLDivElement | null>(null)

watch(messages, async () => {
  await nextTick()
  messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
})

// If tender changes, reset initial message
watch(
  () => props.tenderData?.id,
  (id) => {
    if (!id) return
    messages.value = [
      {
        id: 'init-' + id,
        role: 'model',
        content: `您好！已为您切换至《${props.tenderData?.overview?.projectName || '当前项目'}》。
预算：${props.tenderData?.overview?.budget || '详见标书'} | 评标办法：${props.tenderData?.overview?.evaluationMethod || '综合评分法'}
请问需要我为您分析哪一方面的投标策略或合规细节？`,
        time: '刚刚'
      }
    ]
  }
)

// 本地模拟：不依赖任何后端，约 900ms 后返回预设咨询建议
const handleSendMessage = (customText?: string) => {
  const textToSend = customText || inputValue.value
  if (!textToSend.trim() || isLoading.value) return

  const userMsg: ChatMessage = {
    id: 'msg-' + Date.now(),
    role: 'user',
    content: textToSend,
    time: formatTime()
  }

  messages.value = [...messages.value, userMsg]
  if (!customText) inputValue.value = ''
  isLoading.value = true

  setTimeout(() => {
    const aiReply: ChatMessage = {
      id: 'reply-' + Date.now(),
      role: 'model',
      content:
        `针对您的提问「${textToSend}」，根据招标文件要求：建议仔细核查项目否决条款，` +
        '并按照《政府采购法》及招标文件专用格式准备盖章与业绩证明材料。',
      time: formatTime()
    }
    messages.value = [...messages.value, aiReply]
    isLoading.value = false
  }, 900)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
    >
      <!-- Drawer Header -->
      <div class="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot class="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-sm text-white">AI 投标顾问实时对齐</h3>
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p class="text-[11px] text-slate-400 truncate max-w-[280px]">
              项目：{{ tenderData?.overview?.projectName }}
            </p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Suggested Quick Inquiries -->
      <div class="p-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        <button
          @click="handleSendMessage('请列出本项目所有一票否决项（废标红线）')"
          class="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          🚨 一票否决项
        </button>
        <button
          @click="handleSendMessage('本项目技术方案怎样才能拿满分？')"
          class="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          🎯 技术方案提分策略
        </button>
        <button
          @click="handleSendMessage('如果遇到参数偏离或疑问，如何写澄清函？')"
          class="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          ✉️ 答疑澄清函模板
        </button>
      </div>

      <!-- Chat Messages Body -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex gap-3"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            v-if="msg.role !== 'user'"
            class="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-1"
          >
            <Bot class="w-4 h-4" />
          </div>

          <div
            class="max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm"
            :class="msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-slate-950/90 border border-slate-800 text-slate-100 rounded-bl-none'"
          >
            <div class="whitespace-pre-wrap">{{ msg.content }}</div>
            <div class="text-[10px] mt-1.5" :class="msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'">
              {{ msg.time }}
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="flex gap-3 justify-start">
          <div class="w-7 h-7 rounded-lg bg-blue-600/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Loader2 class="w-4 h-4 animate-spin" />
          </div>
          <div class="bg-slate-950/90 border border-slate-800 text-slate-400 rounded-2xl p-3 text-xs flex items-center gap-2">
            <Sparkles class="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>顾问 Agent 正在调取招标规则研判中...</span>
          </div>
        </div>

        <div ref="messagesEndRef" />
      </div>

      <!-- Input Form -->
      <div class="p-3 border-t border-slate-800 bg-slate-950/80">
        <form
          @submit.prevent="handleSendMessage()"
          class="flex items-center gap-2"
        >
          <input
            v-model="inputValue"
            type="text"
            placeholder="向 AI 投标顾问提问（如：保证金退还、同类业绩认定期）..."
            class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            :disabled="!inputValue.trim() || isLoading"
            class="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all shadow-md shadow-blue-600/20"
          >
            <Send class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
