<script setup lang="ts">
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import { GraduationCap, ArrowRight, ArrowUpRight, Lock, Sparkles, CheckCircle2 } from 'lucide-vue-next'
import { solutions } from '@/data/solutions'

const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

const online = solutions.filter((s) => s.status === 'online')

const comingSoonCards = [
  { title: '企业研发解决方案', desc: '企业级 AI 应用研发、私有化部署与合规管控，敬请期待' },
  { title: '量化金融解决方案', desc: '金融数据分析、策略研究自动化，敬请期待' },
  { title: '教育信息化解决方案', desc: '高校教学与行政场景的 AI 赋能，敬请期待' },
]
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <!-- Page header offset -->
    <div class="pt-20" />

    <main>
      <!-- Hero -->
      <section class="relative py-20 overflow-hidden bg-white border-b border-slate-200/80">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center max-w-3xl mx-auto space-y-5">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap class="w-3.5 h-3.5 text-blue-600" />
              解决方案中心 · Solutions
            </div>
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              按场景，为你的团队<span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">准备好了一切</span>
            </h1>
            <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
              从模型能力到完整工作流。面向高校科研、企业研发等场景，将多模型接入、团队管控与 Agent 自动化打包成开箱即用的解决方案。
            </p>
          </div>
        </div>
      </section>

      <!-- Solution Cards -->
      <section class="py-16 bg-slate-50/60 relative overflow-hidden">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- Online Solutions -->
          <div class="space-y-8">
            <router-link
              v-for="sol in online"
              :key="sol.slug"
              :to="`/solutions/${sol.slug}`"
              class="group relative block p-8 sm:p-10 rounded-3xl bg-white border-2 border-blue-200 hover:border-blue-400 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div class="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div class="relative z-10 flex flex-col lg:flex-row gap-8">
                <!-- Left: identity -->
                <div class="lg:w-2/5 space-y-4">
                  <div class="flex items-center gap-3">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 shrink-0">
                      <GraduationCap class="w-7 h-7" />
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-semibold text-blue-600">{{ sol.tag }}</span>
                      <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex w-fit items-center gap-1">
                        <Sparkles class="w-2.5 h-2.5" />
                        已上线
                      </span>
                    </div>
                  </div>
                  <h2 class="text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">{{ sol.name }}</h2>
                  <p class="text-sm font-semibold text-slate-700">{{ sol.tagline }}</p>
                </div>

                <!-- Right: details -->
                <div class="lg:w-3/5 space-y-5">
                  <p class="text-sm text-slate-600 leading-relaxed">{{ sol.description }}</p>

                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="h in sol.highlight"
                      :key="h"
                      class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700"
                    >
                      <CheckCircle2 class="w-3.5 h-3.5 text-blue-600" />
                      {{ h }}
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-[11px] text-slate-400 font-semibold">适用：</span>
                    <span
                      v-for="a in sol.audience"
                      :key="a"
                      class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {{ a }}
                    </span>
                  </div>

                  <div class="flex items-center gap-3 pt-2">
                    <span class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition-all">
                      查看详情
                      <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span class="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                      {{ sol.pipeline.filter((s) => !s.endpoint).length }} 个科研阶段
                      <ArrowUpRight class="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>

          <!-- Coming Soon -->
          <div class="mt-14">
            <div class="flex items-center gap-3 mb-6">
              <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider">更多解决方案</h3>
              <div class="flex-1 h-px bg-slate-200" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="card in comingSoonCards"
                :key="card.title"
                class="p-6 rounded-2xl bg-white border border-dashed border-slate-300 space-y-2.5 opacity-80 select-none"
              >
                <div class="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 p-2 flex items-center justify-center text-slate-400">
                  <Lock class="w-4 h-4" />
                </div>
                <h4 class="text-sm font-bold text-slate-500">{{ card.title }}</h4>
                <p class="text-xs text-slate-400 leading-relaxed">{{ card.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <FooterSection />
    <ContactFloat />
  </div>
</template>
