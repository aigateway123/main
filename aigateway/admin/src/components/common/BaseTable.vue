<script setup lang="ts">
defineProps<{
  loading?: boolean
  emptyText?: string
  columns: { key: string; label: string; class?: string }[]
}>()
</script>

<template>
  <div class="bg-white rounded-lg border border-border p-5 space-y-4">
    <div class="overflow-x-auto rounded border border-border">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
            <th
              v-for="col in columns"
              :key="col.key"
              :class="['px-4 py-2', col.class]"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading" class="divide-y divide-border">
          <slot name="rows" />
        </tbody>
      </table>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-10 text-center text-text-secondary text-xs">
      加载中...
    </div>

    <!-- Empty -->
    <div
      v-else-if="$slots.rows && ($slots.rows as any)?.()?.length === 0"
      class="py-10 text-center text-text-secondary text-xs"
    >
      {{ emptyText ?? '暂无数据' }}
    </div>
  </div>
</template>
