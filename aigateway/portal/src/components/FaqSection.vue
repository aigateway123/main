<script setup lang="ts">
import { ref } from 'vue'
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-vue-next'
import { faqData } from '@/data/faq'
import { useContactFloat } from '@/composables/useContactFloat'

const openId = ref<string>('faq-1')
const { open } = useContactFloat()

const toggleFaq = (id: string) => {
  openId.value = openId.value === id ? '' : id
}
</script>

<template>
  <section id="faq" class="py-24 bg-slate-50/80 border-b border-slate-200/80 relative overflow-hidden text-slate-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle class="w-3.5 h-3.5 text-blue-600" />
          常见问题解答 · FAQ
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          关于 Nova Gateway 的
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            核心疑问解答
          </span>
        </h2>
        <p class="text-slate-600 text-base">
          有其他关于安全防护、API 兼容性与并发限制的疑问？可以查看下方回答或联系在线客服。
        </p>
      </div>

      <!-- Accordions -->
      <div class="space-y-4">
        <div
          v-for="faq in faqData"
          :key="faq.id"
          :class="[
            'rounded-2xl bg-white border transition-all duration-200 overflow-hidden',
            openId === faq.id
              ? 'border-blue-400 shadow-md ring-1 ring-blue-500/10'
              : 'border-slate-200 hover:border-slate-300'
          ]"
        >
          <button
            @click="toggleFaq(faq.id)"
            class="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
          >
            <span class="text-base font-bold text-slate-900 flex items-center gap-3">
              <span class="text-blue-600 font-mono text-xs font-semibold bg-blue-50 px-2 py-1 rounded">Q</span>
              {{ faq.question }}
            </span>
            <div
              :class="[
                'w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-200',
                openId === faq.id ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-400'
              ]"
            >
              <ChevronDown class="w-4 h-4" />
            </div>
          </button>

          <div v-if="openId === faq.id" class="px-6 pb-6 pt-1 border-t border-slate-100 text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200">
            <p class="pl-8 border-l-2 border-blue-600">{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Contact Support Footer -->
      <div class="mt-12 text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 text-left">
          <MessageSquare class="w-6 h-6 text-blue-600" />
          <div>
            <p class="text-sm font-bold text-slate-900">未找到您想了解的问题？</p>
            <p class="text-xs text-slate-500">我们的技术专家团队随时准备为您解答部署架构与技术细节。</p>
          </div>
        </div>
        <button
          @click="open"
          class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap"
        >
          提交技术工单
        </button>
      </div>
    </div>
  </section>
</template>
