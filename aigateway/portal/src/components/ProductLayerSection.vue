<script setup lang="ts">
import { Layers, Store, Bot, Briefcase, Server, ArrowRight, ArrowDown } from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'

interface Layer {
  icon: FunctionalComponent
  name: string
  desc: string
  link?: string
  external?: boolean
  tag?: string
}

const layers: Layer[] = [
  {
    icon: Server,
    name: 'AI 基础设施',
    desc: '统一接入全品类顶级模型，智能路由、成本管控、安全合规，支撑上层一切能力。',
    link: '/#features',
    tag: 'L1 · 底座',
  },
  {
    icon: Store,
    name: 'AI 能力商城',
    desc: '即买即用的 Skill 与跨岗协作专家团 —— 从单个 AI 专家，到一支 AI 团队。',
    link: '/skills',
    tag: 'L2 · 即买即用',
  },
  {
    icon: Bot,
    name: 'AI 员工',
    desc: '学习企业资质、历史文档与业务数据，配置成专属你的 AI 员工，像真人员工一样上岗。',
    link: '/#ai-employee',
    tag: 'L3 · 专属定制',
  },
  {
    icon: Briefcase,
    name: '行业解决方案',
    desc: '面向工程投标、外贸出海、内容增长等行业的一体化智能中心，多员工协同作战。',
    link: '/#solutions',
    tag: 'L4 · 行业纵深',
  },
  {
    icon: Layers,
    name: '私有化 · 订阅',
    desc: '数据不出企业，私有化部署、系统集成、知识库维护与长期运维服务。',
    tag: 'L5 · 企业级',
  },
]
</script>

<template>
  <section class="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden text-slate-900">
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-5xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <Layers class="w-3.5 h-3.5 text-blue-600" />
          产品架构 · One Platform
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight sm:whitespace-nowrap">
          从一套 AI 能力基础设施，到一家企业的<span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">完整 AI 团队</span>
        </h2>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed sm:whitespace-nowrap">
          底层赚算力和模型的钱，中间赚 AI 能力的钱，上层赚企业解决方案的钱 —— 五层业务，一条路径。
        </p>
      </div>

      <!-- Layer Stack -->
      <div class="space-y-2.5">
        <template v-for="(layer, idx) in layers" :key="layer.name">
          <!-- Layer Card -->
          <div
            class="group relative flex items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
          >
            <!-- Layer badge -->
            <div class="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
              <component :is="layer.icon" class="w-6 h-6" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {{ layer.name }}
                </h3>
                <span v-if="layer.tag" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  {{ layer.tag }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                {{ layer.desc }}
              </p>
            </div>

            <router-link
              v-if="layer.link"
              :to="layer.link"
              class="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold transition-all"
            >
              <span>进入</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
            <span
              v-else
              class="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 text-slate-400 text-xs font-semibold border border-slate-200"
            >
              咨询定制
            </span>
          </div>

          <!-- Connector Arrow -->
          <div v-if="idx < layers.length - 1" class="flex justify-center py-0.5">
            <ArrowDown class="w-4 h-4 text-slate-300" />
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
