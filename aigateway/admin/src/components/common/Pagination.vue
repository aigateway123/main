<script setup lang="ts">
defineProps<{
  page: number
  totalPages: number
  total?: number
}>()

const emit = defineEmits<{
  'prev': []
  'next': []
}>()
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center gap-3 text-xs text-text-secondary mt-4"
  >
    <span v-if="total !== undefined">共 {{ total }} 条</span>
    <button
      class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="page <= 1"
      @click="emit('prev')"
    >
      上一页
    </button>
    <span>第 {{ page }} / {{ totalPages }} 页</span>
    <button
      class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="page >= totalPages"
      @click="emit('next')"
    >
      下一页
    </button>
  </div>
</template>
