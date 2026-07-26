<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'blue' | 'danger' | 'success' | 'warning' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()

const variants: Record<string, string> = {
  primary: 'bg-primary hover:bg-blue-700 text-white font-medium rounded-btn shadow-xs',
  secondary: 'border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 font-medium rounded-btn',
  blue: 'border border-blue-200 text-primary hover:bg-blue-50 font-medium rounded-btn',
  danger: 'border border-red-200 text-red-600 hover:bg-red-50 font-medium rounded-btn',
  success: 'border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-btn',
  warning: 'border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 font-medium rounded-btn',
  icon: 'text-text-secondary hover:text-text-primary hover:bg-[#f8f9fa] rounded-btn',
}

const sizes: Record<string, string> = {
  lg: 'h-9 px-4 text-xs',
  md: 'h-8 px-3 text-xs',
  sm: 'px-2.5 py-1 text-xs',
}
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer',
      variants[variant ?? 'primary'],
      sizes[size ?? 'lg'],
      disabled ? 'opacity-70 cursor-not-allowed' : '',
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
