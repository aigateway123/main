<script setup lang="ts">
import { Check, ShieldCheck, ArrowRight, Zap } from 'lucide-vue-next'
import { pricingCards } from '@/data/pricing'

defineProps<{
  adminUrl: string
}>()

const emit = defineEmits<{
  'open-console': []
}>()
</script>

<template>
  <section id="pricing" class="py-24 bg-slate-50/80 border-b border-slate-200/80 relative overflow-hidden text-slate-900">
    <!-- Background radial glow -->
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-500/5 blur-[150px] pointer-events-none rounded-full" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <Zap class="w-3.5 h-3.5 text-blue-600" />
          按量计费 · Transparent Pricing
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          按量计费，无隐形开支，
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            开通即送体验额度
          </span>
        </h2>
        <p class="text-slate-600 text-base sm:text-lg">
          无订阅费、无月费，用多少付多少，费用实时可查、成本一目了然。
        </p>
      </div>

      <!-- 3 Pricing Model Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div
          v-for="card in pricingCards"
          :key="card.id"
          :class="[
            'p-8 rounded-3xl bg-white border flex flex-col justify-between transition-all duration-300 relative',
            card.isPopular
              ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20 lg:-translate-y-2'
              : 'border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md'
          ]"
        >
          <div
            v-if="card.isPopular"
            class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md uppercase tracking-wider"
          >
            核心方案
          </div>

          <div>
            <!-- Card Header -->
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-slate-900">{{ card.title }}</h3>
              <p class="text-xs text-slate-500 mt-1">{{ card.subtitle }}</p>
            </div>

            <!-- Description -->
            <div class="mb-6 pb-6 border-b border-slate-100">
              <p class="text-sm text-slate-700 leading-relaxed">{{ card.description }}</p>
            </div>

            <!-- Feature List -->
            <div class="space-y-3.5 mb-8">
              <p class="text-xs font-bold text-slate-700 uppercase tracking-wider">核心权益:</p>
              <div v-for="(feature, idx) in card.features" :key="idx" class="flex items-start gap-3 text-xs text-slate-700 leading-snug">
                <Check class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <button
            @click="emit('open-console')"
            :class="[
              'w-full py-3.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2',
              card.isPopular
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            ]"
          >
            <span>{{ card.cta }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Price Transparency Note -->
      <p class="mt-8 text-center text-xs text-slate-500">
        各模型具体单价与计费明细，可在 Admin 控制台「模型定价」中实时查看。
      </p>

      <!-- Enterprise SLA Guarantee Banner -->
      <div class="mt-10 p-6 rounded-2xl bg-white border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-3 text-left">
          <ShieldCheck class="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h4 class="text-sm font-bold text-slate-900">需要对公转账 / 开具增值税专用发票 / 私有化部署？</h4>
            <p class="text-xs text-slate-600">支持签订 SLA 法律保证协议、企业级专线与专属架构师 1v1 支持。</p>
          </div>
        </div>
        <button
          @click="emit('open-console')"
          class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold whitespace-nowrap shadow-sm"
        >
          联系企业顾问
        </button>
      </div>
    </div>
  </section>
</template>
