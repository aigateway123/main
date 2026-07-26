<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getDashboardApi, getRecentLogsApi, type DashboardStats, type RequestLogEntry } from '@/api/usage'

const stats = ref<DashboardStats | null>(null)
const recentLogs = ref<RequestLogEntry[]>([])
const loading = ref(true)
const activeChartTab = ref<'requests' | 'tokens' | 'latency'>('requests')

onMounted(async () => {
  try {
    const [s, logs] = await Promise.all([getDashboardApi(), getRecentLogsApi()])
    stats.value = s
    recentLogs.value = logs
  } finally { loading.value = false }
})

const statCards = [
  { title: '今日请求数', key: 'todayRequests' as const, icon: 'activity', color: 'text-blue-600 bg-blue-50' },
  { title: '今日 Token', key: 'todayTokens' as const, icon: 'cpu', color: 'text-indigo-600 bg-indigo-50', format: (v: number) => v.toLocaleString() },
  { title: '今日成本', key: 'todayCost' as const, icon: 'dollar', color: 'text-emerald-600 bg-emerald-50', prefix: '¥', fixed: 4 },
  { title: '平均延迟', key: 'averageLatency' as const, icon: 'clock', color: 'text-amber-600 bg-amber-50', suffix: 'ms' },
  { title: '活跃 API Keys', key: 'activeApiKeys' as const, icon: 'key', color: 'text-sky-600 bg-sky-50' },
  { title: '活跃 Provider', key: 'activeProviders' as const, icon: 'server', color: 'text-purple-600 bg-purple-50' },
  { title: '总请求数', key: 'totalRequests' as const, icon: 'trending', color: 'text-blue-600 bg-blue-50' },
  { title: '总成本', key: 'totalCost' as const, icon: 'layers', color: 'text-teal-600 bg-teal-50', prefix: '¥', fixed: 4 },
]

function getIconSvg(icon: string): string {
  const icons: Record<string, string> = {
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    cpu: 'M9 3h6v2H9zm3 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 9h2v6H3zm16 0h2v6h-2zM9 21h6v2H9zM9 1h6v2H9z',
    dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0l0 10 5 5',
    key: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
    server: 'M22 12h-4l-3 9L9 3l-3 9H2',
    trending: 'M23 6l-9.5 9.5-5-5L1 18',
    layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  }
  return icons[icon] ?? ''
}
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Loading -->
    <div v-if="loading" class="py-20 text-center text-text-secondary text-xs">加载中...</div>

    <template v-else-if="stats">
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="card in statCards"
          :key="card.key"
          class="bg-white rounded-card border border-border p-4 flex flex-col justify-between hover:border-primary/40 transition-all shadow-xs"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-text-secondary">{{ card.title }}</span>
            <div :class="['w-8 h-8 rounded-md flex items-center justify-center shrink-0', card.color]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path :d="getIconSvg(card.icon)" />
              </svg>
            </div>
          </div>
          <div class="text-2xl font-bold text-text-primary tracking-tight">
            {{ card.prefix ?? '' }}{{ card.fixed !== undefined ? (stats[card.key] as number).toFixed(card.fixed) : (card.format ? card.format(stats[card.key] as number) : stats[card.key]) }}{{ card.suffix ?? '' }}
          </div>
        </div>
      </div>

      <!-- Chart placeholder -->
      <div class="bg-white rounded-card border border-border p-5 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span class="text-sm font-bold text-text-primary">网关实时吞吐与延迟趋势</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <button
              v-for="tab in [{ id: 'requests' as const, label: '请求量 QPS' }, { id: 'tokens' as const, label: 'Token 消耗' }, { id: 'latency' as const, label: '响应延迟' }]"
              :key="tab.id"
              :class="[
                'px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                activeChartTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-[#f8f9fa] text-text-secondary hover:bg-[#e2e8f0]',
              ]"
              @click="activeChartTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="w-full h-56 border-2 border-dashed border-[#cbd5e1] rounded-lg bg-[#fafbfc] flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
          <svg class="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 500 150">
            <path d="M0,100 Q100,20 200,80 T400,30 T500,90" fill="none" stroke="#2563eb" stroke-width="4" />
            <path d="M0,120 Q120,60 250,110 T450,50 T500,110" fill="none" stroke="#10b981" stroke-width="3" />
          </svg>
          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div>
            <div class="text-sm font-bold text-text-primary">「待接入图表」</div>
            <p class="text-xs text-text-secondary max-w-md mt-1">可接入 ECharts / Recharts 监控指标看板。展示 24 小时并发请求量 (QPS)、各 Provider 流量分布及 Token 消费趋势图。</p>
          </div>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#e2e8f0] rounded text-xs font-medium text-primary">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse" />
            数据流推送状态: WebSocket Ready
          </div>
        </div>
      </div>

      <!-- Recent Requests -->
      <div class="bg-white rounded-card border border-border p-5 space-y-4">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <h3 class="text-sm font-bold text-text-primary">最近请求记录</h3>
        </div>

        <div v-if="recentLogs.length > 0" class="overflow-x-auto rounded border border-border">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
                <th class="px-4 py-2">Model</th><th class="px-4 py-2">Provider</th><th class="px-4 py-2">Input</th><th class="px-4 py-2">Output</th>
                <th class="px-4 py-2">延迟</th><th class="px-4 py-2">成本</th><th class="px-4 py-2">状态</th><th class="px-4 py-2">时间</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="(log, index) in recentLogs"
                :key="log.id"
                :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
              >
                <td class="px-4 py-2">
                  <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px] font-medium">{{ log.modelCode }}</code>
                </td>
                <td class="px-4 py-2 text-text-primary">{{ log.providerName }}</td>
                <td class="px-4 py-2 text-text-secondary">{{ log.inputTokens.toLocaleString() }}</td>
                <td class="px-4 py-2 text-text-secondary">{{ log.outputTokens.toLocaleString() }}</td>
                <td class="px-4 py-2 font-mono text-text-primary">{{ log.latencyMs }}ms</td>
                <td class="px-4 py-2 font-mono font-medium text-text-primary">¥{{ log.costAmount.toFixed(4) }}</td>
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
        </div>
        <div v-else class="py-10 text-center text-text-secondary text-xs">暂无请求记录</div>
      </div>
    </template>
  </div>
</template>
