<script setup lang="ts">
// 手写 SVG 迷你趋势线（转译自原型 ScoreBadge.tsx 的 MiniSparkline）
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    data: number[]
    color?: string
    height?: number
  }>(),
  { color: '#6366f1', height: 36 },
)

const width = 120
const padding = 4

const geometry = computed(() => {
  if (!props.data.length) return { points: '', dotY: 0 }
  const min = Math.min(...props.data)
  const max = Math.max(...props.data)
  const range = max - min || 1
  const points = props.data
    .map((val, idx) => {
      const x = (idx / (props.data.length - 1)) * (width - padding * 2) + padding
      const y = props.height - padding - ((val - min) / range) * (props.height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')
  const last = props.data[props.data.length - 1]
  const dotY = props.height - padding - ((last - min) / range) * (props.height - padding * 2)
  return { points, dotY }
})
</script>

<template>
  <svg v-if="data.length" :width="width" :height="height" class="overflow-visible">
    <polyline
      fill="none"
      :stroke="color"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :points="geometry.points"
    />
    <circle v-if="data.length > 0" :cx="width - padding" :cy="geometry.dotY" r="3" :fill="color" />
  </svg>
</template>
