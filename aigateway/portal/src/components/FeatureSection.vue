<script setup lang="ts">
import { ref } from 'vue'
import { Layers, Cpu, ShieldCheck, Zap, Terminal, Lock, ArrowUpRight, CheckCircle2, Activity, ChevronRight } from 'lucide-vue-next'
import { features } from '@/data/features'
import PlaygroundModal from '@/components/PlaygroundModal.vue'
import type { FunctionalComponent } from 'vue'

const iconMap: Record<string, FunctionalComponent> = {
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Terminal,
  Lock,
}

const activeFeature = ref<string | null>(null)
const isPlaygroundOpen = ref(false)
</script>

<template>
  <section id="features" class="py-24 bg-slate-50/80 border-b border-slate-200/80 relative overflow-hidden text-slate-900">
    <!-- Subtle background accents -->
    <div class="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <Cpu class="w-3.5 h-3.5 text-blue-600" />
          底层 AI 基础设施 · AI Infrastructure
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          支撑上层全部能力的<span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI 基础设施基座</span>
        </h2>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
          统一接入全品类顶尖模型、智能路由与成本管控。Skill、AI 员工与行业解决方案，都跑在这套基座之上 —— 稳定、省钱、安全。
        </p>
      </div>

      <!-- 6 Feature Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="feature in features"
          :key="feature.id"
          @click="activeFeature = activeFeature === feature.id ? null : feature.id"
          :class="[
            'group relative p-8 rounded-2xl bg-white border transition-all duration-300 cursor-pointer flex flex-col justify-between',
            activeFeature === feature.id
              ? 'border-blue-600 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20'
              : 'border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1'
          ]"
        >
          <div>
            <!-- Top Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 p-2.5 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <component :is="iconMap[feature.iconName] || Layers" class="w-6 h-6" />
              </div>
              <span class="px-2.5 py-1 text-xs font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 rounded-full">
                {{ feature.metrics }}
              </span>
            </div>

            <!-- Title & Highlight -->
            <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors flex items-center justify-between">
              <span>{{ feature.title }}</span>
              <ArrowUpRight class="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </h3>
            <p class="text-xs font-semibold text-blue-600 mb-3">
              {{ feature.highlight }}
            </p>

            <!-- Description -->
            <p class="text-sm text-slate-600 leading-relaxed mb-6">
              {{ feature.description }}
            </p>
          </div>

          <!-- Sub-features list -->
          <div class="pt-4 border-t border-slate-100 space-y-2">
            <div v-for="(detail, idx) in feature.details" :key="idx" class="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 class="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>{{ detail }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Feature Demo CTA -->
      <div class="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left">
          <h4 class="text-lg font-bold text-slate-900 flex items-center gap-2 justify-center md:justify-start">
            <Activity class="w-5 h-5 text-blue-600" />
            想体验语义缓存与智能容灾效果？
          </h4>
          <p class="text-sm text-slate-600 max-w-xl">
            直接在在线 API 沙盒中测试相同的 Prompt，观看多模型流式返回速度与语义缓存命中对延时的瞬间优化！
          </p>
        </div>
        <button
          @click="isPlaygroundOpen = true"
          class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all whitespace-nowrap flex items-center gap-2"
        >
          <span>开启 Playground 模拟</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Playground API Sandbox -->
    <PlaygroundModal v-if="isPlaygroundOpen" @close="isPlaygroundOpen = false" />
  </section>
</template>
