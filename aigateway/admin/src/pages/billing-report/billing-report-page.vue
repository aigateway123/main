<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  getReportSummary,
  getRevenueTrend,
  getReportByModel,
  getReportByUser,
  exportReportCsv,
  type ReportSummary,
  type DailyRevenue,
  type ModelRevenue,
  type UserRevenue,
  type ReportRange,
} from '@/api/report'
import StatCard from '@/components/common/StatCard.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import EmptyState from '@/components/common/EmptyState.vue'

/* ========== State ========== */

const selectedRange = ref<ReportRange>('today')

const summary = ref<ReportSummary | null>(null)
const trendData = ref<DailyRevenue[]>([])
const modelData = ref<ModelRevenue[]>([])
const userRanking = ref<UserRevenue[]>([])

const loading = ref(false)
const csvExporting = ref(false)

// 模型表格按收入降序排列
const sortedModelData = ref<ModelRevenue[]>([])

// 自定义日期范围（仅用于导出）
const exportStartDate = ref('')
const exportEndDate = ref('')

/* ========== 时间范围标签 ========== */

const rangeOptions: { value: ReportRange; label: string }[] = [
  { value: 'today', label: '今日' },
  { value: 'yesterday', label: '昨日' },
  { value: '7d', label: '近7天' },
  { value: 'month', label: '本月' },
]

/* ========== 数据加载 ========== */

async function loadAll() {
  loading.value = true
  try {
    const range = selectedRange.value
    const [s, trend, models, users] = await Promise.all([
      getReportSummary(range),
      getRevenueTrend(range),
      getReportByModel(range),
      getReportByUser(range),
    ])
    summary.value = s
    trendData.value = trend
    modelData.value = models
    userRanking.value = users
    // 按收入降序排列
    sortedModelData.value = [...models].sort((a, b) => b.totalRevenue - a.totalRevenue)
  } catch (e) {
    console.error('加载报表数据失败', e)
  } finally {
    loading.value = false
  }
}

watch(selectedRange, () => {
  loadAll()
})

onMounted(loadAll)

/* ========== 导出 CSV ========== */

async function handleExport() {
  if (csvExporting.value) return
  csvExporting.value = true
  try {
    const range = selectedRange.value
    // 根据时间范围确定起止日期
    const now = new Date()
    let start: string
    let end: string = now.toISOString().slice(0, 10)

    if (exportStartDate.value && exportEndDate.value) {
      start = exportStartDate.value
      end = exportEndDate.value
    } else if (range === 'today') {
      start = end
    } else if (range === 'yesterday') {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      start = yesterday.toISOString().slice(0, 10)
      end = start
    } else if (range === '7d') {
      const d = new Date(now)
      d.setDate(d.getDate() - 7)
      start = d.toISOString().slice(0, 10)
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    }

    await exportReportCsv(start, end)
  } catch (e) {
    console.error('导出失败', e)
    alert('导出失败，请稍后重试')
  } finally {
    csvExporting.value = false
  }
}

/* ========== 工具函数 ========== */

function formatCurrency(val: number): string {
  return `¥${val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatNumber(val: number): string {
  return val.toLocaleString()
}

function formatTokens(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`
  return val.toLocaleString()
}

// 为柱状图计算最大值
function getMaxRevenue(data: DailyRevenue[]): number {
  if (!data.length) return 1
  return Math.max(...data.map(d => d.revenue), 1)
}

// SVG 折线图
function buildTrendPath(data: DailyRevenue[]): string {
  if (!data.length) return ''
  const w = 400
  const h = 180
  const maxRev = getMaxRevenue(data)
  const padding = { top: 20, bottom: 30, left: 10, right: 10 }
  const chartW = w - padding.left - padding.right
  const chartH = h - padding.top - padding.bottom

  return data
    .map((d, i) => {
      const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW
      const y = padding.top + chartH - (d.revenue / maxRev) * chartH
      return i === 0 ? `M${x},${y}` : `L${x},${y}`
    })
    .join(' ')
}

// SVG 柱状图
function buildBarChart(data: UserRevenue[]): { name: string; width: string; color: string }[] {
  if (!data.length) return []
  const maxRev = Math.max(...data.map(d => d.totalRevenue), 1)
  const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef']
  return data.slice(0, 5).map((d, i) => ({
    name: d.email,
    width: `${(d.totalRevenue / maxRev) * 100}%`,
    color: colors[i % colors.length],
  }))
}

const trendPath = ref('')
watch(trendData, (val) => {
  trendPath.value = buildTrendPath(val)
}, { immediate: true })
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- ===== 时间范围选择器 ===== -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium text-text-secondary">时间范围:</span>
        <div class="flex bg-white border border-border rounded-lg p-0.5 gap-0.5">
          <button
            v-for="opt in rangeOptions"
            :key="opt.value"
            :class="[
              'px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer',
              selectedRange === opt.value
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50',
            ]"
            @click="selectedRange = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <!-- 自定义日期 / 导出 -->
      <div class="flex items-center gap-2">
        <input
          v-model="exportStartDate"
          type="date"
          class="w-32 h-8 px-2 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary"
          title="导出起始日期"
        />
        <span class="text-text-secondary text-xs">—</span>
        <input
          v-model="exportEndDate"
          type="date"
          class="w-32 h-8 px-2 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary"
          title="导出结束日期"
        />
        <button
          class="h-8 px-3 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-btn transition-colors cursor-pointer disabled:opacity-50"
          :disabled="csvExporting"
          @click="handleExport"
        >
          <svg v-if="csvExporting" class="animate-spin -ml-1 mr-1.5 h-3 w-3 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ csvExporting ? '导出中...' : '导出CSV' }}
        </button>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="py-20 text-center text-text-secondary text-xs">
      加载中...
    </div>

    <template v-else-if="summary">
      <!-- ===== 经营总览卡片 ===== -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="今日收入" :value="formatCurrency(summary.today.revenue)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </template>
        </StatCard>
        <StatCard title="今日请求数" :value="formatNumber(summary.today.requestCount)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </template>
        </StatCard>
        <StatCard title="本月收入" :value="formatCurrency(summary.currentMonth.revenue)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </template>
        </StatCard>
        <StatCard title="本月请求数" :value="formatNumber(summary.currentMonth.requestCount)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </template>
        </StatCard>
      </div>

      <!-- ===== 中间行：双栏布局 ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- 左栏：收入趋势 -->
        <div class="lg:col-span-3 bg-white rounded-lg border border-border p-5">
          <h3 class="text-sm font-semibold text-text-primary mb-4">收入趋势</h3>
          <div v-if="trendData.length > 0" class="w-full">
            <svg viewBox="0 0 400 200" class="w-full h-auto" preserveAspectRatio="xMidYMid meet">
              <!-- 网格线 -->
              <line v-for="i in 4" :key="'g'+i" x1="10" :y1="30 + (i-1)*40" x2="390" :y2="30 + (i-1)*40" stroke="#f0f0f0" stroke-width="1"/>
              <!-- 面积填充 -->
              <path :d="trendPath" fill="url(#trendGradient)" opacity="0.2"/>
              <!-- 折线 -->
              <path :d="trendPath" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
              <!-- 数据点 -->
              <circle
                v-for="(d, i) in trendData"
                :key="'dot'+i"
                :cx="10 + (i / Math.max(trendData.length - 1, 1)) * 380"
                :cy="30 + 140 - (d.revenue / getMaxRevenue(trendData)) * 140"
                r="3"
                fill="#3b82f6"
                class="hover:r-5"
              />
              <!-- 渐变定义 -->
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.4"/>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
                </linearGradient>
              </defs>
            </svg>
            <!-- X 轴标签 -->
            <div class="flex justify-between text-[10px] text-text-secondary mt-1 px-1">
              <span v-for="(d, i) in trendData" :key="'xl'+i" class="truncate max-w-[60px] text-center">
                {{ d.date.slice(5) }}
              </span>
            </div>
          </div>
          <EmptyState v-else message="暂无收入趋势数据" />
        </div>

        <!-- 右栏：用户消费排行 -->
        <div class="lg:col-span-2 bg-white rounded-lg border border-border p-5">
          <h3 class="text-sm font-semibold text-text-primary mb-4">用户消费排行 TOP5</h3>
          <div v-if="userRanking.length > 0" class="space-y-4">
            <div
              v-for="(u, i) in userRanking.slice(0, 5)"
              :key="u.userId"
              class="flex items-center gap-3"
            >
              <!-- 排名徽标 -->
              <div
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0',
                  i === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' :
                  i === 1 ? 'bg-gray-100 text-gray-600 ring-2 ring-gray-200' :
                  i === 2 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-200' :
                  'bg-blue-50 text-blue-600',
                ]"
              >
                {{ i + 1 }}
              </div>
              <!-- 信息 -->
              <div class="flex-1 min-w-0">
                <div class="text-xs font-medium text-text-primary truncate">{{ u.email }}</div>
                <div class="text-[11px] text-text-secondary">{{ formatNumber(u.requestCount) }} 次请求</div>
              </div>
              <div class="text-xs font-semibold text-text-primary font-mono">{{ formatCurrency(u.totalRevenue) }}</div>
            </div>
            <!-- 横向柱状图 -->
            <div class="pt-3 space-y-2.5">
              <div
                v-for="(bar, i) in buildBarChart(userRanking)"
                :key="i"
                class="flex items-center gap-2"
              >
                <span class="text-[10px] text-text-secondary w-16 truncate shrink-0 text-right">{{ bar.name.split('@')[0] }}</span>
                <div class="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    :style="{
                      width: bar.width,
                      backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'][i],
                    }"
                    class="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <EmptyState v-else message="暂无用户排行数据" />
        </div>
      </div>

      <!-- ===== 模型消费详情表格 ===== -->
      <BaseTable
        :loading="false"
        empty-text="暂无模型消费数据"
        :columns="[
          { key: 'model', label: '模型' },
          { key: 'requests', label: '请求次数' },
          { key: 'tokens', label: 'Token 用量' },
          { key: 'revenue', label: '总收入' },
        ]"
      >
        <template #rows>
          <tr
            v-for="(m, idx) in sortedModelData"
            :key="m.modelCode"
            :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
          >
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px] font-mono">{{ m.modelCode }}</code>
                <span class="text-xs text-text-primary">{{ m.modelName }}</span>
              </div>
            </td>
            <td class="px-4 py-2 text-text-secondary font-mono">{{ formatNumber(m.requestCount) }}</td>
            <td class="px-4 py-2 text-text-secondary font-mono">
              <span class="text-xs">Input: {{ formatTokens(m.inputTokens) }}</span>
              <span class="mx-1 text-[10px] text-text-secondary">/</span>
              <span class="text-xs">Output: {{ formatTokens(m.outputTokens) }}</span>
            </td>
            <td class="px-4 py-2 font-mono font-semibold text-text-primary">{{ formatCurrency(m.totalRevenue) }}</td>
          </tr>
        </template>
      </BaseTable>
    </template>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="bg-white rounded-lg border border-border">
      <EmptyState message="暂无经营数据" />
    </div>
  </div>
</template>
