<script setup lang="ts">
import { Bot, FileText, Settings2, Headset, ArrowRight, CheckCircle2, Sparkles } from 'lucide-vue-next'
import { useContactFloat } from '@/composables/useContactFloat'

const { open } = useContactFloat()

const steps = [
  {
    icon: FileText,
    title: '客户提供资料',
    desc: '企业资质、历史投标文件、企业案例、产品资料、人员信息 —— 真实业务数据。',
  },
  {
    icon: Settings2,
    title: '我们配置 AI 员工',
    desc: '让 AI 学习企业数据，按业务流程编排工作流，配置成专属岗位员工并上线。',
  },
  {
    icon: Headset,
    title: '持续服务调优',
    desc: '知识库维护、效果调优、月度服务支持，让 AI 员工越用越懂你的业务。',
  },
]

const plans = [
  { name: '基础版', price: '轻量起步', desc: '单个岗位 AI 员工，核心业务数据接入' },
  { name: '专业版', price: '深度定制', desc: '多岗位协同，复杂工作流编排与深度调优', isPopular: true },
  { name: '企业版', price: '企业级定制', desc: '全业务线 AI 团队，私有化部署与专属支持' },
]

const openContact = (e: MouseEvent) => {
  e.stopPropagation()
  open()
}
</script>

<template>
  <section id="ai-employee" class="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden text-slate-900">
    <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <Bot class="w-3.5 h-3.5 text-blue-600" />
          AI 员工定制 · AI Employee
        </div>
        <h2 class="text-xl sm:text-5xl font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
          从「买一个技能」到<span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">「雇一个 AI 员工」</span>
        </h2>
        <p class="text-slate-600 text-base sm:text-lg">
          Skill 是通用能力，AI 员工是学会了你公司业务的专属员工 —— 资质、历史文件、案例、产品资料，全部学进去。
        </p>
      </div>

      <!-- 3 Steps -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div
          v-for="(step, idx) in steps"
          :key="step.title"
          class="relative p-8 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-5">
            <div class="w-11 h-11 rounded-xl bg-white border border-slate-200 p-2.5 flex items-center justify-center text-blue-600 shadow-sm">
              <component :is="step.icon" class="w-5 h-5" />
            </div>
            <span class="font-mono text-xs font-bold text-slate-400">0{{ idx + 1 }}</span>
          </div>
          <h3 class="text-lg font-extrabold text-slate-900 mb-2">{{ step.title }}</h3>
          <p class="text-sm text-slate-600 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div
          v-for="plan in plans"
          :key="plan.name"
          :class="[
            'relative p-8 rounded-3xl bg-white border flex flex-col justify-between transition-all duration-300',
            plan.isPopular
              ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20 lg:-translate-y-2'
              : 'border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md'
          ]"
        >
          <div
            v-if="plan.isPopular"
            class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md uppercase tracking-wider"
          >
            推荐
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900">{{ plan.name }}</h3>
            <p class="text-2xl font-extrabold text-blue-600 mt-2">{{ plan.price }}</p>
            <p class="text-xs text-slate-500 mt-2">{{ plan.desc }}</p>
            <div class="mt-5 pt-5 border-t border-slate-100 flex items-start gap-2">
              <CheckCircle2 class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p class="text-xs text-slate-600 leading-relaxed">另收月度服务费（知识库维护 + 效果调优）</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <button
          @click="openContact"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5"
        >
          <Sparkles class="w-4 h-4" />
          <span>定制你的 AI 员工</span>
          <ArrowRight class="w-4 h-4" />
        </button>
        <p class="mt-4 text-xs text-slate-500">专业顾问 1v1 沟通，评估你的业务场景，提供专属方案与报价。</p>
      </div>
    </div>
  </section>
</template>
