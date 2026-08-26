<script setup lang="ts">
import { GraduationCap, ArrowRight, ArrowUpRight, Lock, Sparkles, CheckCircle2 } from 'lucide-vue-next'
import { solutions } from '@/data/solutions'
import type { Solution } from '@/types'

const primary: Solution | undefined = solutions.find((s) => s.status === 'online')

const placeholderCards = [
  { icon: 'Building2', title: '企业研发解决方案', desc: '企业级 AI 应用研发、私有化部署与合规管控' },
  { icon: 'LineChart', title: '更多行业解决方案', desc: '量化金融、教育信息化等行业场景持续上线' },
]
</script>

<template>
  <section id="solutions" class="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden text-slate-900">
    <!-- Subtle background accents -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap class="w-3.5 h-3.5 text-blue-600" />
          行业解决方案 · Solutions
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          不止是一个 API 网关，更是<span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">场景化解决方案</span>
        </h2>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
          针对高校科研、企业研发等场景，将多模型接入、团队管控与 Agent 自动化封装成开箱即用的工作台，让团队聚焦业务本身。
        </p>
      </div>

      <!-- Solution Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Primary Solution Card (高校科研) -->
        <router-link
          v-if="primary"
          :to="`/solutions/${primary.slug}`"
          class="lg:col-span-2 group relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/60 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
        >
          <!-- Decorative glow -->
          <div class="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div class="relative z-10">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
                  <GraduationCap class="w-6 h-6" />
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-semibold text-blue-600">{{ primary.tag }}</span>
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex w-fit items-center gap-1">
                    <Sparkles class="w-2.5 h-2.5" />
                    第一期上线
                  </span>
                </div>
              </div>
              <ArrowUpRight class="w-5 h-5 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <!-- Title & Tagline -->
            <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
              {{ primary.name }}
            </h3>
            <p class="text-sm sm:text-base font-semibold text-slate-700 mb-6">
              {{ primary.tagline }}
            </p>

            <!-- Description -->
            <p class="text-sm text-slate-600 leading-relaxed max-w-2xl mb-8">
              {{ primary.description }}
            </p>

            <!-- Capability Tags -->
            <div class="flex flex-wrap gap-2 mb-8">
              <span
                v-for="h in primary.highlight"
                :key="h"
                class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 shadow-sm"
              >
                <CheckCircle2 class="w-3.5 h-3.5 text-blue-600" />
                {{ h }}
              </span>
            </div>
          </div>

          <!-- Footer: CTA + audience -->
          <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-200/80">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] text-slate-400 font-semibold">适用：</span>
              <span
                v-for="a in primary.audience"
                :key="a"
                class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
              >
                {{ a }}
              </span>
            </div>
            <span class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all whitespace-nowrap">
              了解详情
              <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </router-link>

        <!-- Placeholder Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
          <div
            v-for="card in placeholderCards"
            :key="card.title"
            class="relative p-8 rounded-3xl bg-slate-50/80 border border-dashed border-slate-200 flex flex-col justify-center items-start gap-3 opacity-80 select-none"
          >
            <div class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 p-2 flex items-center justify-center text-slate-400">
              <Lock class="w-5 h-5" />
            </div>
            <h4 class="text-base font-bold text-slate-500">{{ card.title }}</h4>
            <p class="text-xs text-slate-400 leading-relaxed">{{ card.desc }}</p>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 mt-1">
              敬请期待
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom Link -->
      <div class="mt-14 text-center">
        <router-link
          to="/solutions"
          class="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
        >
          <span>查看全部解决方案</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>
    </div>
  </section>
</template>
