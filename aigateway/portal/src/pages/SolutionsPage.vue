<script setup lang="ts">
import { ref, computed } from 'vue'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import { Briefcase, ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-vue-next'
import { solutions } from '@/data/solutions'
import {
  SOLUTION_INDUSTRIES,
  INDUSTRY_ICONS,
  INDUSTRY_TONES,
  INDUSTRY_BTN,
} from '@/data/solutionIndustries'
import type { SolutionIndustry } from '@/data/solutionIndustries'
import type { Solution } from '@/types'

const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

// ---- 行业筛选（数据驱动：SOLUTION_INDUSTRIES） ----
const onlineIndustries = computed(() => SOLUTION_INDUSTRIES.filter((i) => i.status === 'online'))
const comingIndustries = computed(() => SOLUTION_INDUSTRIES.filter((i) => i.status === 'coming-soon'))

const activeIndustry = ref<'all' | string>('all')

/** 某行业下的 online 方案 */
const solsByIndustry = (ind: SolutionIndustry) =>
  ind.solutionSlugs
    .map((slug) => solutions.find((s) => s.slug === slug && s.status === 'online'))
    .filter((s): s is Solution => Boolean(s))

/** 当前筛选命中的行业 */
const visibleIndustries = computed(() =>
  activeIndustry.value === 'all'
    ? onlineIndustries.value
    : onlineIndustries.value.filter((i) => i.id === activeIndustry.value),
)

/** 展平为 [行业, 方案] 卡片列表（保持行业顺序） */
const visibleCards = computed(() =>
  visibleIndustries.value.flatMap((ind) =>
    solsByIndustry(ind).map((sol) => ({ industry: ind, sol })),
  ),
)

const totalCards = computed(() =>
  onlineIndustries.value.reduce((sum, ind) => sum + solsByIndustry(ind).length, 0),
)
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <!-- Page header offset -->
    <div class="pt-20" />

    <main>
      <!-- Hero -->
      <section class="relative py-16 sm:py-20 overflow-hidden bg-white border-b border-slate-200/80">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center max-w-3xl mx-auto space-y-5">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
              <Briefcase class="w-3.5 h-3.5 text-blue-600" />
              解决方案中心 · Solutions
            </div>
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              按行业，为你的业务<span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">准备好了一整支 AI 团队</span>
            </h1>
            <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
              面向高校科研、环保、投标等行业，将多模型接入、团队管控与 Agent 自动化打包成开箱即用的解决方案。
            </p>
          </div>
        </div>
      </section>

      <!-- 行业筛选 + 紧凑方案网格 -->
      <section class="py-14 sm:py-16 bg-slate-50/60 relative overflow-hidden">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- 筛选 Tabs -->
          <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                行业场景筛选
              </h2>
              <p class="text-xs text-slate-500 mt-1">
                当前 {{ onlineIndustries.length }} 个行业已上线 · {{ totalCards }} 套完整方案，更多行业陆续接入
              </p>
            </div>

            <div class="flex flex-wrap gap-2" role="tablist" aria-label="行业场景筛选">
              <button
                type="button"
                role="tab"
                :aria-selected="activeIndustry === 'all'"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                :class="activeIndustry === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'"
                @click="activeIndustry = 'all'"
              >
                全部
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  :class="activeIndustry === 'all' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'"
                >
                  {{ totalCards }}
                </span>
              </button>

              <button
                v-for="ind in onlineIndustries"
                :key="ind.id"
                type="button"
                role="tab"
                :aria-selected="activeIndustry === ind.id"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                :class="activeIndustry === ind.id
                  ? INDUSTRY_TONES[ind.id]?.tabActive ?? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'"
                @click="activeIndustry = ind.id"
              >
                <component :is="INDUSTRY_ICONS[ind.icon]" class="w-3.5 h-3.5" />
                {{ ind.name }}
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  :class="activeIndustry === ind.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'"
                >
                  {{ solsByIndustry(ind).length }}
                </span>
              </button>
            </div>
          </div>

          <!-- 紧凑卡片网格 -->
          <div v-if="visibleCards.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
            <router-link
              v-for="card in visibleCards"
              :key="card.sol.slug"
              :to="`/solutions/${card.sol.slug}`"
              class="group relative flex h-full flex-col rounded-2xl bg-white border-2 border-slate-200 p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm"
              :class="INDUSTRY_TONES[card.industry.id]?.card ?? 'hover:border-blue-300'"
            >
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-11 h-11 rounded-xl p-2.5 flex items-center justify-center text-white shadow-lg shrink-0"
                    :class="INDUSTRY_TONES[card.industry.id]?.iconBox ?? 'bg-gradient-to-tr from-blue-600 to-indigo-600'"
                  >
                    <component :is="INDUSTRY_ICONS[card.industry.icon]" class="w-5 h-5" />
                  </div>
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                    :class="INDUSTRY_TONES[card.industry.id]?.badge ?? 'bg-blue-50 text-blue-700 border border-blue-200'"
                  >
                    {{ card.industry.name }}
                  </span>
                </div>
                <span class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles class="w-2.5 h-2.5" />
                  已上线
                </span>
              </div>

              <h3 class="text-lg font-extrabold text-slate-900 leading-snug line-clamp-1">
                {{ card.sol.name }}
              </h3>
              <p class="text-sm text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                {{ card.sol.tagline }}
              </p>

              <div class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="h in card.sol.highlight.slice(0, 2)"
                  :key="h"
                  class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border"
                  :class="INDUSTRY_TONES[card.industry.id]?.chip ?? 'bg-blue-50 text-blue-700 border border-blue-100'"
                >
                  <CheckCircle2 class="w-3 h-3" />
                  {{ h }}
                </span>
              </div>

              <div class="mt-auto pt-5 flex items-center justify-between gap-3">
                <span
                  v-if="card.sol.audience.length"
                  class="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 line-clamp-1"
                >
                  {{ card.sol.audience[0] }}
                </span>
                <span
                  class="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-bold shadow-md shadow-slate-900/5 transition-all group-hover:shadow-lg whitespace-nowrap"
                  :class="INDUSTRY_BTN[card.industry.id] ?? 'bg-gradient-to-r from-blue-600 to-indigo-600'"
                >
                  查看详情
                  <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </router-link>
          </div>

          <!-- 空态 -->
          <div v-else class="rounded-2xl bg-white border border-dashed border-slate-300 p-10 text-center">
            <p class="text-sm text-slate-500">该行业方案筹备中，敬请期待</p>
          </div>

          <!-- 规划中行业 -->
          <div v-if="comingIndustries.length" class="mt-14">
            <div class="flex items-center gap-3 mb-6">
              <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider">更多行业 · 规划中</h3>
              <div class="flex-1 h-px bg-slate-200" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              <div
                v-for="ind in comingIndustries"
                :key="ind.id"
                class="p-6 rounded-2xl bg-white border border-dashed border-slate-300 space-y-3 opacity-80 select-none flex flex-col"
              >
                <div class="flex items-center justify-between gap-3">
                  <div
                    class="w-10 h-10 rounded-xl p-2 flex items-center justify-center text-white shrink-0"
                    :class="INDUSTRY_TONES[ind.id]?.iconBox ?? 'bg-gradient-to-tr from-slate-500 to-slate-700'"
                  >
                    <component :is="INDUSTRY_ICONS[ind.icon]" class="w-5 h-5" />
                  </div>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                    <Lock class="w-2.5 h-2.5" />
                    规划中
                  </span>
                </div>
                <h4 class="text-sm font-bold text-slate-600">{{ ind.name }}</h4>
                <p class="text-xs text-slate-400 leading-relaxed">{{ ind.desc }}</p>
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
