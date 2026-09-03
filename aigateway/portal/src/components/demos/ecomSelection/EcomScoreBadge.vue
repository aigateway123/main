<script setup lang="ts">
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/common/ScoreBadge.tsx
withDefaults(
  defineProps<{
    score: number
    size?: 'sm' | 'md' | 'lg' | 'xl'
    showLabel?: boolean
  }>(),
  { size: 'md', showLabel: true },
)
</script>

<template>
  <div
    class="inline-flex items-center gap-1.5 rounded-lg border font-semibold tracking-tight"
    :class="[
      score >= 90
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
        : score >= 80
          ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
          : score >= 70
            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
            : 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      size === 'sm'
        ? 'text-xs px-2 py-0.5'
        : size === 'md'
          ? 'text-sm px-2.5 py-1'
          : size === 'lg'
            ? 'text-lg px-3.5 py-1.5 font-bold'
            : 'text-2xl px-5 py-2.5 font-extrabold',
    ]"
  >
    <span class="font-mono">{{ score }}</span>
    <span class="text-[10px] opacity-70 font-normal">/ 100</span>
    <span v-if="showLabel" class="text-[10px] uppercase font-bold tracking-wider ml-1 opacity-90">
      {{ score >= 90 ? '卓越' : score >= 80 ? '高潜' : score >= 70 ? '良好' : '观察' }}
    </span>
  </div>
</template>
