<script setup lang="ts">
// 轻量 CSS 粒子礼花层（替代原型 canvas-confetti，零依赖，blue 系配色）
// 用法：父组件 <IpConfettiLayer :trigger="on" @done="on = false" />，:trigger 置 true 即喷射 1.8s
import { ref, watch, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{ trigger?: boolean }>(), { trigger: false })
const emit = defineEmits<{ (e: 'done'): void }>()

const active = ref(false)
const COLORS = ['#2563eb', '#3b82f6', '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

interface Piece {
  id: number
  left: string
  delay: string
  dur: string
  w: number
  h: number
  round: boolean
  color: string
}

const pieces = ref<Piece[]>([])
let timer: ReturnType<typeof setTimeout> | null = null

const fire = () => {
  pieces.value = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${(Math.random() * 0.18).toFixed(2)}s`,
    dur: `${(1 + Math.random() * 0.7).toFixed(2)}s`,
    w: 5 + Math.random() * 6,
    h: 8 + Math.random() * 7,
    round: i % 3 === 0,
    color: COLORS[i % COLORS.length],
  }))
  active.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    active.value = false
    emit('done')
  }, 1800)
}

watch(
  () => props.trigger,
  (v) => v && fire(),
)

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div v-if="active" class="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
    <span
      v-for="p in pieces"
      :key="p.id"
      class="ip-confetti-piece absolute -top-3"
      :style="{
        left: p.left,
        animationDelay: p.delay,
        animationDuration: p.dur,
        background: p.color,
        width: `${p.w}px`,
        height: `${p.h}px`,
        borderRadius: p.round ? '50%' : '2px',
      }"
    />
  </div>
</template>

<style scoped>
.ip-confetti-piece {
  animation-name: ip-confetti-fall;
  animation-timing-function: linear;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
@keyframes ip-confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translateY(112vh) rotate(720deg);
    opacity: 0;
  }
}
</style>
