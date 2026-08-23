<script setup lang="ts">
import { ArrowRight, Terminal, Play, Sparkles } from 'lucide-vue-next'

defineProps<{
  adminUrl: string
}>()

const emit = defineEmits<{
  'open-console': []
}>()
</script>

<template>
  <section class="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-8 sm:p-14 overflow-hidden shadow-2xl shadow-blue-600/20">
        <!-- Subtle decorative background circles -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div class="relative z-10 max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles class="w-3.5 h-3.5 text-yellow-300" />
            <span>只需 1 分钟，完成全局 OpenAI SDK APIKey 替换</span>
          </div>

          <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            准备好升级您的企业级 <br />
            AI 统一接入网关了吗？
          </h2>

          <p class="text-blue-100 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
            立即注册即可免费试用。体验高并发并发控制、智能缓存降低 70% 成本与毫秒级故障自动切流。
          </p>

          <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              @click="emit('open-console')"
              class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-600 hover:bg-slate-50 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Terminal class="w-4 h-4 text-blue-600" />
              <span>立即免费注册体验</span>
              <ArrowRight class="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-700/60 hover:bg-blue-700/80 border border-white/30 text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Play class="w-4 h-4 text-white fill-white/20" />
              <span>进入在线 API 沙盒试用</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
