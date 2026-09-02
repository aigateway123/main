<script setup lang="ts">
import { ArrowRight, Sparkles } from 'lucide-vue-next'
import { solutions } from '@/data/solutions'
import { industryOfSlug, INDUSTRY_ICONS } from '@/data/solutionIndustries'

const primary = solutions.find((s) => s.status === 'online')
const industry = primary ? industryOfSlug(primary.slug) : undefined
</script>

<template>
  <div v-if="primary && industry">
    <router-link
      :to="`/solutions/${primary.slug}`"
      class="group relative block rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-6 sm:p-8 overflow-hidden shadow-xl shadow-blue-600/15 hover:shadow-2xl hover:shadow-blue-600/25 transition-all hover:-translate-y-0.5"
    >
      <!-- Decorative circles -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 shrink-0 rounded-xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-lg">
            <component :is="INDUSTRY_ICONS[industry.icon]" class="w-6 h-6 text-white" />
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/25 inline-flex items-center gap-1">
                <Sparkles class="w-3 h-3 text-yellow-300" />
                {{ industry.name }}解决方案
              </span>
            </div>
            <h3 class="text-lg sm:text-xl font-extrabold tracking-tight">
              {{ primary.name }}
            </h3>
            <p class="text-blue-100 text-sm leading-relaxed max-w-2xl">
              {{ industry.desc }}，开箱即用，让团队聚焦核心业务本身。
            </p>
          </div>
        </div>

        <span class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-bold text-sm shadow-lg transition-all group-hover:shadow-xl shrink-0">
          查看解决方案
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </router-link>
  </div>
</template>
