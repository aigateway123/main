<script setup lang="ts">
import { ArrowRight, Store, Bot, Briefcase } from 'lucide-vue-next'
import { skills } from '@/data/skills'
import { expertTeams } from '@/data/expertTeams'

const skillCount = skills.filter((s) => s.status === 'online').length
const teamCount = expertTeams.filter((t) => t.status === 'online').length

const matrix = [
  {
    icon: Store,
    title: 'AI 能力商城',
    desc: `${skillCount} 个 Skill · ${teamCount} 支专家团，即买即用`,
    to: '/skills',
    cta: '逛能力商城',
  },
  {
    icon: Bot,
    title: 'AI 员工定制',
    desc: '学习企业资料，配置专属 AI 员工',
    to: '/#ai-employee',
    cta: '了解定制',
  },
  {
    icon: Briefcase,
    title: '行业解决方案',
    desc: '工程投标 · 外贸出海 · 内容增长',
    to: '/#solutions',
    cta: '查看方案',
  },
]
</script>

<template>
  <section class="relative min-h-screen pt-32 pb-20 overflow-hidden bg-white text-slate-900 flex flex-col justify-center border-b border-slate-100">
    <!-- Background Gradients & Mesh Accent -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />
    <div class="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

    <!-- Subtle Grid overlay -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 my-auto">
      <!-- Top Badge -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-sm hover:border-blue-300 transition-colors">
          <span class="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span>AI 能力商城 · {{ skillCount }} 个 Skill · {{ teamCount }} 支专家团 · 行业解决方案</span>
          <ArrowRight class="w-3.5 h-3.5 text-blue-600" />
        </div>
      </div>

      <!-- Main Headline & Slogan -->
      <div class="text-center max-w-5xl mx-auto space-y-6">
        <h1 class="text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-slate-900 leading-[1.15] sm:whitespace-nowrap">
          让每一家中小企业，
          <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
            都拥有自己的 AI 员工
          </span>
        </h1>

        <p class="text-xl sm:text-2xl text-slate-700 font-semibold tracking-wide">
          AI 能力商城 <span class="text-blue-600 font-bold">·</span> 定制 AI 员工 <span class="text-blue-600 font-bold">·</span> 行业智能化解决方案
        </p>

        <p class="text-sm sm:text-base text-slate-600 max-w-4xl mx-auto leading-relaxed font-normal sm:whitespace-nowrap">
          底层 AI Gateway 统一接入全品类顶级模型，上层 Skill、AI 员工与行业方案开箱即用 —— 不用招人，也能组建一支专属 AI 团队。
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <router-link
            to="/skills"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>逛能力商城</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </router-link>
          <a
            href="/#solutions"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <span>了解行业解决方案</span>
          </a>
        </div>
      </div>

      <!-- Product Matrix Cards -->
      <div class="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        <router-link
          v-for="item in matrix"
          :key="item.title"
          :to="item.to"
          class="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4"
        >
          <div class="w-11 h-11 shrink-0 rounded-xl bg-blue-50 border border-blue-100 p-2.5 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <component :is="item.icon" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 group-hover:text-blue-700 transition-colors">
              {{ item.title }}
              <ArrowRight class="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ item.desc }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>
