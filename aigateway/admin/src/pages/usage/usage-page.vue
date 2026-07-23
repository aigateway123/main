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
  <div class="page">
    <div class="page-header">
      <h1>Usage Logs</h1>
    </div>

    <div class="table-wrap">
      <table v-if="logs.length > 0">
        <thead>
          <tr>
            <th>Model</th><th>Provider</th><th>Input Token</th><th>Output Token</th>
            <th>延迟</th><th>成本</th><th>状态</th><th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td><code>{{ log.modelCode }}</code></td>
            <td>{{ log.providerName }}</td>
            <td>{{ log.inputTokens.toLocaleString() }}</td>
            <td>{{ log.outputTokens.toLocaleString() }}</td>
            <td>{{ log.latencyMs }}ms</td>
            <td>¥{{ log.costAmount.toFixed(6) }}</td>
            <td><span :class="['badge', log.requestStatus === 'success' ? 'badge-active' : 'badge-revoked']">{{ log.requestStatus }}</span></td>
            <td class="time-cell">{{ log.createdAt }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="!loading" class="empty">暂无请求日志</p>
      <p v-else class="empty">加载中...</p>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button :disabled="page <= 1" @click="prevPage">上一页</button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button :disabled="page >= totalPages" @click="nextPage">下一页</button>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 1100px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 24px; }

.table-wrap { background: #1e293b; border-radius: 12px; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px 14px; border-bottom: 1px solid #334155; }
th { font-size: 12px; color: #94a3b8; font-weight: 600; }
td { font-size: 13px; }
.time-cell { font-size: 12px; color: #64748b; white-space: nowrap; }
.badge { padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-active { background: #065f46; color: #6ee7b7; }
.badge-revoked { background: #7f1d1d; color: #fca5a5; }
code { background: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
.empty { padding: 40px; text-align: center; color: #64748b; }

.pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 16px; }
.pagination button { padding: 8px 16px; border: 1px solid #475569; border-radius: 6px; background: transparent; color: #cbd5e1; cursor: pointer; }
.pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
.pagination span { color: #94a3b8; font-size: 14px; }
</style>
