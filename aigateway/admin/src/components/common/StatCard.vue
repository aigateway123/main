<script setup lang="ts">
defineProps<{
  title: string
  value: string
  change?: string
  isPositive?: boolean
  iconColor?: string
}>()
</script>

<template>
  <div
    class="bg-white rounded-card border border-border p-4 flex flex-col justify-between hover:border-primary/40 transition-all shadow-xs"
  >
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-semibold text-text-secondary">{{ title }}</span>
      <div
        v-if="$slots.icon"
        :class="['w-8 h-8 rounded-md flex items-center justify-center shrink-0', iconColor ?? 'text-blue-600 bg-blue-50']"
      >
        <slot name="icon" />
      </div>
    </div>
    <div>
      <div class="text-2xl font-bold text-text-primary tracking-tight">{{ value }}</div>
      <div v-if="change" class="mt-1 flex items-center gap-1 text-[11px] text-text-secondary">
        <svg
          v-if="isPositive"
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3 text-emerald-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3 text-rose-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
        </svg>
        <span>{{ change }}</span>
      </div>
    </div>
  </div>
</template>
