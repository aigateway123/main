<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getDashboardApi, getRecentLogsApi, type DashboardStats, type RequestLogEntry } from '@/api/usage'

const stats = ref<DashboardStats | null>(null)
const recentLogs = ref<RequestLogEntry[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [s, logs] = await Promise.all([getDashboardApi(), getRecentLogsApi()])
    stats.value = s
    recentLogs.value = logs
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Nova AI Gateway 实时概览</p>
      </div>
    </header>

    <div v-if="loading" class="loading">加载中...</div>

    <template v-else-if="stats">
      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-label">今日请求</span>
          <strong class="stat-value">{{ stats.todayRequests }}</strong>
        </article>
        <article class="stat-card">
          <span class="stat-label">今日 Token</span>
          <strong class="stat-value">{{ stats.todayTokens.toLocaleString() }}</strong>
        </article>
        <article class="stat-card">
          <span class="stat-label">今日成本</span>
          <strong class="stat-value">¥{{ stats.todayCost.toFixed(4) }}</strong>
        </article>
        <article class="stat-card">
          <span class="stat-label">总请求</span>
          <strong class="stat-value">{{ stats.totalRequests.toLocaleString() }}</strong>
        </article>
        <article class="stat-card">
          <span class="stat-label">平均延迟</span>
          <strong class="stat-value">{{ stats.averageLatency }}ms</strong>
        </article>
        <article class="stat-card">
          <span class="stat-label">活跃 API Keys</span>
          <strong class="stat-value">{{ stats.activeApiKeys }}</strong>
        </article>
        <article class="stat-card">
          <span class="stat-label">活跃 Provider</span>
          <strong class="stat-value">{{ stats.activeProviders }}</strong>
        </article>
        <article class="stat-card">
          <span class="stat-label">总成本</span>
          <strong class="stat-value">¥{{ stats.totalCost.toFixed(4) }}</strong>
        </article>
      </div>

      <div v-if="recentLogs.length > 0" class="recent-section">
        <h2>最近请求</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Model</th><th>Provider</th><th>Input</th><th>Output</th><th>延迟</th><th>成本</th><th>状态</th><th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in recentLogs" :key="log.id">
                <td><code>{{ log.modelCode }}</code></td>
                <td>{{ log.providerName }}</td>
                <td>{{ log.inputTokens }}</td>
                <td>{{ log.outputTokens }}</td>
                <td>{{ log.latencyMs }}ms</td>
                <td>¥{{ log.costAmount.toFixed(6) }}</td>
                <td><span :class="['badge', log.requestStatus === 'success' ? 'badge-active' : 'badge-revoked']">{{ log.requestStatus }}</span></td>
                <td class="time-cell">{{ log.createdAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 24px; }
.page-header h1 { margin: 0 0 8px; font-size: 28px; }
.page-header p { margin: 0; color: #94a3b8; }
.loading { padding: 40px; text-align: center; color: #64748b; }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
.stat-card { padding: 20px; border-radius: 12px; background: #1e293b; border: 1px solid rgba(148, 163, 184, 0.2); }
.stat-label { display: block; margin-bottom: 8px; color: #94a3b8; font-size: 13px; }
.stat-value { font-size: 24px; font-weight: 700; }

.recent-section h2 { font-size: 18px; margin: 0 0 12px; }
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
</style>
