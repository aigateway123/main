<script setup lang="ts">
// 转译自原型各 Agent Header Banner —— 统一的「员工 Hero 价值横幅」
import { computed } from 'vue'
import type { Component } from 'vue'
import { ENV_TONES, type EnvTone } from '@/data/envTone'

const props = defineProps<{
  tone: EnvTone
  icon: Component
  code: string
  roleName: string
  agentName: string
  /** h1 中 "agentName" 之后紧跟的短语，如 '· 企业环保合规体检' */
  headlinePhrase: string
  /** tagline + 补充段落 */
  desc: string
  /** 指标行条目，如 [{ icon, text, accent }] 由父级组装成简单字段 */
  statItems: { label: string; accent?: boolean }[]
  /** 右上统计卡 */
  statLabel: string
  statValue: string
  statNote: string
}>()

const tone = computed(() => ENV_TONES[props.tone])
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-gradient-to-br border p-6 lg:p-8 shadow-2xl"
    :class="[tone.banner, tone.bannerBorder]"
  >
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
      <div class="space-y-3 max-w-3xl">
        <div class="flex items-center gap-2.5">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold" :class="tone.codePill">
            {{ code }}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
            {{ roleName }}
          </span>
        </div>

        <h1 class="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <component :is="icon" class="w-8 h-8" :class="tone.icon" />
          <span>{{ agentName }}<span v-if="headlinePhrase"> {{ headlinePhrase }}</span></span>
        </h1>

        <p class="text-sm text-slate-300 leading-relaxed">{{ desc }}</p>

        <div class="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
          <template v-for="(item, idx) in statItems" :key="idx">
            <span v-if="idx > 0">•</span>
            <span :class="item.accent ? tone.accentText : 'text-slate-300'">{{ item.label }}</span>
          </template>
        </div>
      </div>

      <!-- Quick Stats Pill -->
      <div
        class="p-4 rounded-xl bg-slate-900/90 border flex flex-col items-center justify-center text-center space-y-1 min-w-[200px] shadow-lg"
        :class="tone.statBorder"
      >
        <div class="text-xs text-slate-400">{{ statLabel }}</div>
        <div class="text-2xl font-black font-mono" :class="tone.statValue">{{ statValue }}</div>
        <div class="text-[11px] text-slate-400 flex items-center gap-1">{{ statNote }}</div>
      </div>
    </div>
  </div>
</template>
