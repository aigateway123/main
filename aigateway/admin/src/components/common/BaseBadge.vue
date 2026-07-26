<script setup lang="ts">
defineProps<{
  type?: 'green' | 'red' | 'blue' | 'purple' | 'gray'
}>()

const badgeVariants: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
  red: 'bg-rose-50 text-rose-700 border border-rose-200/60',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200/60',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
  gray: 'bg-slate-100 text-slate-600 border border-slate-200',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium',
      badgeVariants[type ?? 'green'],
    ]"
  >
    <slot />
  </span>
</template>
