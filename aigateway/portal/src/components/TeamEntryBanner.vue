<script setup lang="ts">
import { Users, ArrowRight, Sparkles } from 'lucide-vue-next'
import { expertTeams } from '@/data/expertTeams'

const onlineCount = expertTeams.filter((t) => t.status === 'online').length
</script>

<template>
  <router-link
    to="/skills?tab=team"
    class="group relative block rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 text-white p-5 sm:p-6 overflow-hidden shadow-lg shadow-indigo-600/15 hover:shadow-xl hover:shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
  >
    <!-- Decorative circles -->
    <div class="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-start gap-3.5">
        <div class="w-10 h-10 shrink-0 rounded-xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-md">
          <Users class="w-5 h-5 text-white" />
        </div>
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/25 inline-flex items-center gap-1">
              <Sparkles class="w-3 h-3 text-yellow-300" />
              专家团 · {{ onlineCount }} 支 AI 团队上线
            </span>
          </div>
          <h3 class="text-base sm:text-lg font-extrabold tracking-tight">
            一支 AI 团队，协作完成一件事
          </h3>
          <p class="text-indigo-100 text-xs leading-relaxed max-w-2xl">
            投标作战团 / 外贸出海团 / 内容增长团 —— 多专家分工接力，从任务到交付一站式完成。
          </p>
        </div>
      </div>

      <span class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-indigo-600 font-bold text-xs shadow-lg transition-all group-hover:shadow-xl shrink-0">
        看专家协作
        <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </div>
  </router-link>
</template>
