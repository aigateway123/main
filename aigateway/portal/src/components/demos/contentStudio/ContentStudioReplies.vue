<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { MessageSquareCode, Sliders, Cpu, Sparkles, Bookmark, Users } from 'lucide-vue-next'
import type { ConversionsPack, StudioAssetType } from '@/data/contentStudioData'
import { PRESET_CONVERSIONS, INITIAL_CHAT_LOG, OBJECTION_SCRIPTS } from '@/data/contentStudioData'

const emit = defineEmits<{ (e: 'saveToAssets', title: string, content: string, category: string, type: StudioAssetType): void }>()

const product = ref('爆款自媒体起号实战训练营')
const price = ref('￥199')
const sellingPoints = ref('3套傻瓜填空表, 大咖1对1诊断, 7天无理由退款保障')
const loading = ref(false)
const conversions = ref<ConversionsPack | null>(null)
const agentTyping = ref(false)
const saved = ref(false)
const chatLog = ref<{ role: 'user' | 'ai'; text: string }[]>(JSON.parse(JSON.stringify(INITIAL_CHAT_LOG)))
let timer: ReturnType<typeof setTimeout> | null = null

const handleGenerateConversions = () => {
  if (loading.value) return
  loading.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    loading.value = false
    conversions.value = PRESET_CONVERSIONS
    saved.value = false
    chatLog.value = [{ role: 'user', text: `哈喽，看到你发的内容了，请问你们的 【${product.value}】 还有优惠吗？感觉挺贵呀！` }]
  }, 1500)
}

const handleSimulateObjectionReply = (idx: number) => {
  if (!conversions.value || agentTyping.value) return
  chatLog.value = [...chatLog.value, { role: 'user', text: OBJECTION_SCRIPTS[idx] }]
  agentTyping.value = true
  const closing = conversions.value.salesClosing[idx]
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    chatLog.value = [...chatLog.value, { role: 'ai', text: closing.lines }]
    agentTyping.value = false
  }, 1200)
}

const handleSaveAssetsPack = () => {
  if (!conversions.value) return
  const c = conversions.value
  const body = [
    `【产品】: ${product.value}`,
    `【客单价】: ${price.value}`,
    `【卖点】: ${sellingPoints.value}`,
    '【社交评论区回复模板】' + c.commentsReplies.map((r) => `场景${r.scenario}. ${r.reply}`).join('\n'),
    '【后端私信漏斗营销闭环】' + c.dmReplies.map((r) => `步骤${r.trigger}. ${r.reply}`).join('\n'),
    '【高情商高转化成交闭环】' + c.salesClosing.map((s) => `链路${s.step}. ${s.lines}`).join('\n'),
  ].join('\n\n')
  emit('saveToAssets', `【成交话术包】${product.value}`, body, product.value, 'copy')
  saved.value = true
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 标题区 -->
    <div>
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <MessageSquareCode class="w-5 h-5 text-pink-500" />
        全天候高转化成交 Agent
      </h2>
      <p class="text-xs text-zinc-400 mt-1">通过多层拟人话术框架，打通小红书首层高粘度神级评论、私信跟进链路与最后一步高情商高转化锁客成交话术。</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- 左：参数表单 -->
      <div class="lg:col-span-4 rounded-xl bg-[#0c0c0e] border border-zinc-900 p-5 space-y-4 self-start">
        <h4 class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
          <Sliders class="w-3.5 h-3.5 text-pink-500" />
          产品转换核心要素
        </h4>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">带货产品 / 服务名称</label>
          <input v-model="product" type="text" id="reply-product" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">产品单价 / 服务限额</label>
          <input v-model="price" type="text" id="reply-price" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">核心交付品质 / 强悍背书卖点</label>
          <textarea v-model="sellingPoints" id="reply-usp" rows="3" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50 resize-none"></textarea>
        </div>
        <button
          class="w-full py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-60"
          :disabled="loading"
          @click="handleGenerateConversions"
        >
          <Cpu class="w-3.5 h-3.5" :class="loading ? 'animate-spin-slow' : ''" />
          {{ loading ? '引流模型计算排雷中...' : '批量生成全链路成交术' }}
        </button>
        <p v-if="loading" class="text-[10px] text-zinc-500 leading-relaxed font-mono">
          正在部署社交对话代理角色，围绕价格 [{{ price }}] 打造一站式闭环引流回复包...
        </p>
      </div>

      <!-- 右：结果 + 对话舱 -->
      <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- 结果区 -->
        <div class="md:col-span-7">
          <div v-if="loading" class="p-12 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
            <div class="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
            <p class="mt-4 text-[11px] text-zinc-500">正在部署社交对话代理角色...</p>
          </div>

          <div v-else-if="conversions" class="rounded-xl bg-[#0c0c0e] border border-zinc-900 p-5 space-y-5">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5 text-pink-500" />
                成交话术推荐表
              </h4>
              <button
                class="px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                :class="saved ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40' : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-emerald-600/50 hover:text-emerald-400'"
                @click="handleSaveAssetsPack"
              >
                <Bookmark class="w-3 h-3" :class="saved ? 'fill-current' : ''" />
                {{ saved ? '话术包已归档' : '一键保存到资产库' }}
              </button>
            </div>

            <div>
              <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">评论区热度神评截流术:</p>
              <div class="space-y-2.5">
                <div v-for="r in conversions.commentsReplies" :key="r.scenario" class="rounded-lg bg-zinc-950 border border-zinc-900 p-3">
                  <span class="text-[8px] font-bold text-pink-500 bg-pink-950/30 border border-pink-900/40 px-1.5 py-0.5 rounded font-mono">场景.{{ r.scenario }}</span>
                  <p class="mt-1.5 text-[11px] text-zinc-300 italic leading-relaxed">“{{ r.reply }}”</p>
                </div>
              </div>
            </div>

            <div>
              <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">私信长链转化钩子链路:</p>
              <div class="space-y-2.5">
                <div v-for="r in conversions.dmReplies" :key="r.trigger" class="rounded-lg bg-zinc-950 border border-zinc-900 p-3">
                  <span class="text-[8px] font-bold text-indigo-400 bg-indigo-950/30 border border-indigo-900/40 px-1.5 py-0.5 rounded font-mono">步骤.{{ r.trigger }}</span>
                  <p class="mt-1.5 text-[11px] text-zinc-400 leading-relaxed">{{ r.reply }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="p-10 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
            <Sparkles class="w-8 h-8 text-zinc-700" />
            <p class="mt-4 text-sm font-bold text-zinc-300">成交策略部署就绪</p>
            <p class="mt-1.5 text-[11px] text-zinc-500 max-w-xs">输入带货属性并点击【一键生成】，模型将智能打造针对不愿付费、零基础、怀疑成分等创作者的销售推论。</p>
          </div>
        </div>

        <!-- 对话模拟舱 -->
        <div class="md:col-span-5 rounded-xl bg-[#0c0c0e] border border-zinc-900 border-l-2 border-l-pink-500 flex flex-col h-[560px]">
          <div class="p-4 border-b border-zinc-900 flex items-center gap-3">
            <Users class="w-4 h-4 text-pink-500" />
            <div>
              <h4 class="text-xs font-bold text-zinc-200">转化对话模拟舱</h4>
              <p class="text-[8px] text-zinc-600 font-mono uppercase tracking-wider">Conversion Playground</p>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div v-for="(msg, i) in chatLog" :key="i" class="flex" :class="msg.role === 'ai' ? 'justify-end' : 'justify-start'">
              <div class="max-w-[85%]">
                <p class="text-[8px] text-zinc-600 font-mono mb-1">{{ msg.role === 'ai' ? '爆款销售 Agent' : '模拟真实创作者' }}</p>
                <div
                  class="px-3 py-2 rounded-xl text-[11px] leading-relaxed border"
                  :class="msg.role === 'ai' ? 'bg-pink-950/20 border-pink-900/30 text-pink-400 rounded-tr-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-300 rounded-tl-sm'"
                >
                  {{ msg.text }}
                </div>
              </div>
            </div>
            <div v-if="agentTyping" class="flex justify-end">
              <div class="flex items-center gap-1 px-3 py-2 rounded-xl bg-pink-950/20 border border-pink-900/30">
                <span class="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style="animation-delay: 0.15s"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style="animation-delay: 0.3s"></span>
                <span class="ml-1 text-[9px] text-pink-400/80 font-mono">AI 话术卡片回复加载中...</span>
              </div>
            </div>
          </div>

          <div class="p-4 border-t border-zinc-900 space-y-2">
            <p class="text-[9px] text-zinc-500">选择下方抗拒话术，一键触发 AI 对练方案:</p>
            <button
              v-for="(s, i) in conversions?.salesClosing ?? []"
              :key="s.step"
              class="w-full text-left px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-pink-500/50 text-[10px] text-zinc-400 hover:text-pink-400 cursor-pointer transition-all disabled:opacity-50"
              :disabled="agentTyping"
              @click="handleSimulateObjectionReply(i)"
            >
              客户 objections.{{ s.step }}
            </button>
            <p v-if="!conversions" class="text-[9px] text-zinc-600 font-mono pt-1">提示: 需首先生成成交话术，才能调配抗拒对练 Agent。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
