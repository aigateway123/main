<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listLogsApi, type RequestLogEntry } from '@/api/usage'

const logs = ref<RequestLogEntry[]>([])
const loading = ref(false)
const page = ref(1)
const totalPages = ref(1)
const pageSize = 20

async function load() {
  loading.value = true
  try {
    const result = await listLogsApi(page.value, pageSize)
    logs.value = result.items
    totalPages.value = result.pagination.totalPages
  } finally {
    loading.value = false
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    load()
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    load()
  }
}

onMounted(load)
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-border">
      <div>
        <h2 class="text-base font-bold text-text-primary">请求日志</h2>
        <p class="text-xs text-text-secondary mt-0.5">秒级实时网关转发日志、延迟响应与异常报错排查</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="overflow-x-auto rounded border border-border">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
              <th class="px-4 py-2">Model</th>
              <th class="px-4 py-2">Provider</th>
              <th class="px-4 py-2">Input Token</th>
              <th class="px-4 py-2">Output Token</th>
              <th class="px-4 py-2">延迟</th>
              <th class="px-4 py-2">成本</th>
              <th class="px-4 py-2">状态</th>
              <th class="px-4 py-2">时间</th>
            </tr>
          </thead>
          <tbody v-if="!loading && logs.length > 0" class="divide-y divide-border">
            <tr
              v-for="(log, index) in logs"
              :key="log.id"
              :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
            >
              <td class="px-4 py-2 font-mono font-medium text-text-primary">
                <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px]">{{ log.modelCode }}</code>
              </td>
              <td class="px-4 py-2 text-text-primary">{{ log.providerName }}</td>
              <td class="px-4 py-2 text-text-secondary">{{ log.inputTokens.toLocaleString() }}</td>
              <td class="px-4 py-2 text-text-secondary">{{ log.outputTokens.toLocaleString() }}</td>
              <td class="px-4 py-2 font-mono text-text-primary">{{ log.latencyMs }}ms</td>
              <td class="px-4 py-2 font-mono font-medium text-text-primary">¥{{ log.costAmount.toFixed(6) }}</td>
              <td class="px-4 py-2">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                    log.requestStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border-rose-200/60',
                  ]"
                >
                  {{ log.requestStatus }}
                </span>
              </td>
              <td class="px-4 py-2 text-text-secondary text-[11px] font-mono">{{ log.createdAt }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="py-10 text-center text-text-secondary text-xs">加载中...</div>
        <div v-else-if="logs.length === 0" class="py-10 text-center text-text-secondary text-xs">暂无请求日志</div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center gap-3 text-xs text-text-secondary mt-4"
      >
        <button
          class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="page <= 1"
          @click="prevPage"
        >
          上一页
        </button>
        <span>{{ page }} / {{ totalPages }}</span>
        <button
          class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="page >= totalPages"
          @click="nextPage"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
