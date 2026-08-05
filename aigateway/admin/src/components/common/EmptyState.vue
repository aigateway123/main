<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: '暂无数据',
})
</script>

<template>
  <div class="py-14 flex flex-col items-center justify-center gap-3 text-center">
    <div class="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="text-xs text-text-secondary">{{ message }}</div>
  </div>
</template>
