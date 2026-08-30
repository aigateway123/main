<script setup lang="ts">
import { Store, ArrowRight, Sparkles } from 'lucide-vue-next'
import { skills } from '@/data/skills'
import { expertTeams } from '@/data/expertTeams'

const onlineCount = skills.filter((s) => s.status === 'online').length + expertTeams.filter((t) => t.status === 'online').length
</script>

<template>
  <router-link
    to="/skills"
    class="group relative block rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-6 sm:p-8 overflow-hidden shadow-xl shadow-blue-600/15 hover:shadow-2xl hover:shadow-blue-600/25 transition-all hover:-translate-y-0.5"
  >
    <!-- Decorative circles -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 shrink-0 rounded-xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-lg">
          <Store class="w-6 h-6 text-white" />
        </div>
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/25 inline-flex items-center gap-1">
              <Sparkles class="w-3 h-3 text-yellow-300" />
              Skill · 专家 · 专家团 · {{ onlineCount }} 个能力上线
            </span>
          </div>
          <h3 class="text-lg sm:text-xl font-extrabold tracking-tight">
            从单个 AI 专家，到一支 AI 团队
          </h3>
          <p class="text-blue-100 text-sm leading-relaxed max-w-2xl">
            AI 专家即买即用，专家团跨岗协同 —— 不用招人，也能组建一支专属 AI 团队。
          </p>
        </div>
      </div>

      <span class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-bold text-sm shadow-lg transition-all group-hover:shadow-xl shrink-0">
        逛能力市场
        <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  </router-link>
</template>
