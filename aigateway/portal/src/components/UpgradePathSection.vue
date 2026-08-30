<script setup lang="ts">
import { TrendingUp, ArrowRight, Sparkles } from 'lucide-vue-next'

interface Step {
  no: string
  name: string
  price: string
  desc: string
  scenario: string
}

const steps: Step[] = [
  {
    no: '01',
    name: '先买一个 Skill 试试',
    price: '低门槛试用',
    desc: '在能力商城购买「AI 投标」等 Skill，在线使用，验证效果。',
    scenario: '企业想低成本先验证 AI 能不能用',
  },
  {
    no: '02',
    name: '升级成专属 AI 员工',
    price: '按岗位定制',
    desc: '让 AI 学习贵司历史投标文件、资质与案例，成为专属「AI 投标经理」。',
    scenario: '客户说：希望它学习我们公司的历史投标文件',
  },
  {
    no: '03',
    name: '企业私有化部署',
    price: '按需报价',
    desc: '数据不出企业，AI 员工在内网运行，敏感招投标数据全程可控。',
    scenario: '企业要求数据安全与合规',
  },
  {
    no: '04',
    name: '工程行业解决方案',
    price: '项目制报价',
    desc: 'AI 投标 + AI 合同 + AI 项目管理 + AI 经营分析，一支 AI 团队覆盖全业务线。',
    scenario: '企业发现还需要合同、项目、经营全套能力',
  },
]
</script>

<template>
  <section class="py-24 bg-slate-50/80 border-b border-slate-200/80 relative overflow-hidden text-slate-900">
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-5xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <TrendingUp class="w-3.5 h-3.5 text-blue-600" />
          客户成长路径 · Growth Path
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight sm:whitespace-nowrap">
          从一个小小的技能，到<span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">一套企业级解决方案</span>
        </h2>
        <p class="text-slate-600 text-base sm:text-lg">
          以「AI 投标」为例 —— 客户的需求每深入一步，能力与投入就升一级，全程无需更换平台。
        </p>
      </div>

      <!-- Path Steps -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(step, idx) in steps"
          :key="step.no"
          class="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 flex flex-col"
        >
          <!-- Arrow Connector -->
          <div v-if="idx < steps.length - 1" class="hidden lg:flex absolute top-1/2 -right-4 z-10 -translate-y-1/2">
            <div class="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
              <ArrowRight class="w-3.5 h-3.5 text-blue-600" />
            </div>
          </div>

          <!-- Step no + price -->
          <div class="flex items-center justify-between mb-4">
            <span class="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              STEP {{ step.no }}
            </span>
            <span class="text-sm font-extrabold text-slate-900">{{ step.price }}</span>
          </div>

          <h3 class="text-base font-extrabold text-slate-900 mb-2">
            {{ step.name }}
          </h3>
          <p class="text-xs text-slate-600 leading-relaxed mb-5 flex-1">
            {{ step.desc }}
          </p>

          <!-- Scenario -->
          <div class="pt-4 border-t border-slate-100">
            <p class="text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center gap-1">
              <Sparkles class="w-3 h-3 text-indigo-400" />
              什么情况下升级
            </p>
            <p class="text-[11px] text-slate-600 leading-relaxed">
              「{{ step.scenario }}」
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Slogan -->
      <div class="mt-14 text-center">
        <p class="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-slate-800 bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <Sparkles class="w-5 h-5 text-blue-600" />
          用 Skills 获客，用 AI 员工赚钱，用行业 Agent 做大单
        </p>
      </div>
    </div>
  </section>
</template>
