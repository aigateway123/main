<script setup lang="ts">
import { ref } from 'vue'
import { Briefcase, ArrowRight, ArrowUpRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-vue-next'
import { solutions } from '@/data/solutions'

const online = solutions.filter((s) => s.status === 'online')

const current = ref(0)
const total = online.length

const prev = () => {
  current.value = (current.value - 1 + total) % total
}
const next = () => {
  current.value = (current.value + 1) % total
}

// 触摸滑动
const touchStartX = ref<number | null>(null)
const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
}
const onTouchEnd = (e: TouchEvent) => {
  if (touchStartX.value === null) return
  const delta = e.changedTouches[0].clientX - touchStartX.value
  if (Math.abs(delta) > 50) {
    if (delta < 0) next()
    else prev()
  }
  touchStartX.value = null
}
</script>

<template>
  <section id="solutions" class="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden text-slate-900">
    <!-- Subtle background accents -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-5xl mx-auto mb-14 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          <Briefcase class="w-3.5 h-3.5 text-blue-600" />
          行业解决方案 · Industry AI
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight sm:whitespace-nowrap">
          不止是一个 API 网关，更是<span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">场景化解决方案</span>
        </h2>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
          每个行业都有一套开箱即用的 AI 智能中心
        </p>
      </div>

      <!-- Carousel -->
      <div class="relative max-w-4xl mx-auto">
        <!-- Track -->
        <div class="overflow-hidden rounded-3xl">
          <div
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${current * 100}%)` }"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            <div
              v-for="card in online"
              :key="card.slug"
              class="min-w-full px-1 sm:px-2"
            >
              <router-link
                :to="`/solutions/${card.slug}`"
                class="group relative block p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/60 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden"
              >
                <!-- Decorative glow -->
                <div class="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div class="relative z-10">
                  <!-- Header -->
                  <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
                        <Sparkles class="w-6 h-6" />
                      </div>
                      <div class="flex flex-col gap-1">
                        <span class="text-xs font-semibold text-blue-600">{{ card.tag }}</span>
                        <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex w-fit items-center gap-1">
                          <CheckCircle2 class="w-2.5 h-2.5" />
                          已上线
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight class="w-5 h-5 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <!-- Title & Tagline -->
                  <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {{ card.name }}
                  </h3>
                  <p class="text-sm sm:text-base font-semibold text-slate-700 mb-6">
                    {{ card.tagline }}
                  </p>

                  <!-- Description -->
                  <p class="text-sm text-slate-600 leading-relaxed max-w-2xl mb-8">
                    {{ card.description }}
                  </p>

                  <!-- Capability Tags -->
                  <div class="flex flex-wrap gap-2 mb-8">
                    <span
                      v-for="h in card.highlight"
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
                      v-for="a in card.audience"
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
            </div>
          </div>
        </div>

        <!-- Nav Arrows -->
        <button
          @click="prev"
          aria-label="上一个解决方案"
          class="absolute left-0 lg:-left-16 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-md hover:border-blue-400 hover:bg-blue-600 hover:text-white text-slate-600 transition-all flex items-center justify-center"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <button
          @click="next"
          aria-label="下一个解决方案"
          class="absolute right-0 lg:-right-16 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-md hover:border-blue-400 hover:bg-blue-600 hover:text-white text-slate-600 transition-all flex items-center justify-center"
        >
          <ArrowRight class="w-5 h-5" />
        </button>

        <!-- Dots -->
        <div class="mt-8 flex items-center justify-center gap-2.5">
          <button
            v-for="(card, idx) in online"
            :key="card.slug"
            @click="current = idx"
            :aria-label="`切换到 ${card.name}`"
            class="h-2.5 rounded-full transition-all duration-300"
            :class="idx === current ? 'w-8 bg-gradient-to-r from-blue-600 to-indigo-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'"
          />
        </div>

        <!-- Counter -->
        <p class="mt-4 text-center text-xs font-semibold text-slate-400">
          {{ current + 1 }} / {{ total }}
        </p>
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
