<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  getMyUsageSummary,
  getMyUsageTrend,
  getMyUsageDetail,
  type MyUsageSummary,
  type MyDailyUsage,
  type UsageDetailItem,
  type UsageDetailResponse,
} from '@/api/report'
import StatCard from '@/components/common/StatCard.vue'

/* ========== State ========== */

const summary = ref<MyUsageSummary | null>(null)
const trendData = ref<MyDailyUsage[]>([])
const detailItems = ref<UsageDetailItem[]>([])
const pagination = ref({ page: 1, pageSize: 10, total: 0, totalPages: 0 })

const loading = ref(false)
const trendLoading = ref(false)
const detailLoading = ref(false)

const filterStartDate = ref('')
const filterEndDate = ref('')

/* ========== 数据加载 ========== */

async function loadSummary() {
  try {
    summary.value = await getMyUsageSummary()
  } catch (e) {
    console.error('加载消费总览失败', e)
  }
}

async function loadTrend() {
  trendLoading.value = true
  try {
    trendData.value = await getMyUsageTrend(7)
  } catch (e) {
    console.error('加载消费趋势失败', e)
  } finally {
    trendLoading.value = false
  }
}

async function loadDetail() {
  detailLoading.value = true
  try {
    const params: {
      page?: number
      pageSize?: number
      startDate?: string
      endDate?: string
    } = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }
    if (filterStartDate.value) params.startDate = filterStartDate.value
    if (filterEndDate.value) params.endDate = filterEndDate.value

    const resp: UsageDetailResponse = await getMyUsageDetail(params)
    detailItems.value = resp.items
    pagination.value = resp.pagination
  } catch (e) {
    console.error('加载消费明细失败', e)
  } finally {
    detailLoading.value = false
  }
}

async function loadAll() {
  loading.value = true
  try {
    await Promise.all([loadSummary(), loadTrend(), loadDetail()])
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.value.page = 1
  loadDetail()
}

function prevPage() {
  if (pagination.value.page <= 1) return
  pagination.value.page--
  loadDetail()
}

function nextPage() {
  if (pagination.value.page >= pagination.value.totalPages) return
  pagination.value.page++
  loadDetail()
}

onMounted(loadAll)

/* ========== 工具函数 ========== */

function formatCurrency(val: number): string {
  return `¥${val.toFixed(2)}`
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

function formatNumber(val: number): string {
  return val.toLocaleString()
}

function getMaxRevenue(data: MyDailyUsage[]): number {
  if (!data.length) return 1
  return Math.max(...data.map(d => d.revenue), 1)
}
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Loading -->
    <div v-if="loading" class="py-20 text-center text-text-secondary text-xs">
      加载中...
    </div>

    <template v-else>
      <!-- ===== 个人消费总览 ===== -->
      <div v-if="summary" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="今日消费" :value="formatCurrency(summary.todayRevenue)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </template>
        </StatCard>
        <StatCard title="本月消费" :value="formatCurrency(summary.monthRevenue)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </template>
        </StatCard>
        <StatCard title="总消费" :value="formatCurrency(summary.totalRevenue)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </template>
        </StatCard>
      </div>

      <!-- ===== 近7天消费趋势 ===== -->
      <div class="bg-white rounded-lg border border-border p-5">
        <h3 class="text-sm font-semibold text-text-primary mb-4">近7天消费趋势</h3>
        <div v-if="trendLoading" class="py-10 text-center text-text-secondary text-xs">
          加载中...
        </div>
        <div v-else-if="trendData.length > 0">
          <!-- 柱状图 -->
          <div class="flex items-end justify-around gap-2 h-48 mb-2 px-2">
            <div
              v-for="(d, i) in trendData"
              :key="d.date"
              class="flex-1 flex flex-col items-center justify-end h-full gap-1"
            >
              <span class="text-[10px] font-mono text-text-secondary font-medium">{{ formatCurrency(d.revenue) }}</span>
              <div
                :style="{ height: `${(d.revenue / getMaxRevenue(trendData)) * 100}%` }"
                class="w-full max-w-[40px] bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all cursor-pointer min-h-[4px]"
                :title="`${d.date}: ${formatCurrency(d.revenue)}`"
              />
              <span class="text-[10px] text-text-secondary mt-1">{{ d.date.slice(5) }}</span>
            </div>
          </div>
          <!-- 统计行 -->
          <div class="flex justify-between text-[11px] text-text-secondary px-2 mt-2">
            <span>总计: {{ formatCurrency(trendData.reduce((s, d) => s + d.revenue, 0)) }}</span>
            <span>{{ trendData.length }} 天数据</span>
          </div>
        </div>
        <div v-else class="py-10 text-center text-text-secondary text-xs">
          暂无消费趋势数据
        </div>
      </div>

      <!-- ===== 消费明细 ===== -->
      <div class="bg-white rounded-lg border border-border p-5 space-y-4">
        <!-- 筛选栏 -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-text-secondary">日期范围:</span>
          <input
            v-model="filterStartDate"
            type="date"
            class="w-36 h-8 px-2.5 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary"
          />
          <span class="text-text-secondary text-xs">—</span>
          <input
            v-model="filterEndDate"
            type="date"
            class="w-36 h-8 px-2.5 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary"
          />
          <button
            class="h-8 px-3 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-btn transition-colors cursor-pointer"
            @click="handleSearch"
          >
            筛选
          </button>
        </div>

        <!-- 表格 -->
        <div class="overflow-x-auto rounded border border-border">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
                <th class="px-4 py-2">时间</th>
                <th class="px-4 py-2">模型</th>
                <th class="px-4 py-2">Input Tokens</th>
                <th class="px-4 py-2">Output Tokens</th>
                <th class="px-4 py-2">费用</th>
              </tr>
            </thead>
            <tbody v-if="!detailLoading && detailItems.length > 0" class="divide-y divide-border">
              <tr
                v-for="(item, idx) in detailItems"
                :key="item.id"
                :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
              >
                <td class="px-4 py-2 text-text-secondary text-[11px] font-mono">{{ formatDateTime(item.createdAt) }}</td>
                <td class="px-4 py-2">
                  <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px] font-mono">{{ item.modelCode }}</code>
                </td>
                <td class="px-4 py-2 text-text-secondary font-mono">{{ formatNumber(item.inputTokens) }}</td>
                <td class="px-4 py-2 text-text-secondary font-mono">{{ formatNumber(item.outputTokens) }}</td>
                <td class="px-4 py-2 font-mono font-medium text-text-primary">¥{{ item.costAmount.toFixed(6) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="detailLoading" class="py-10 text-center text-text-secondary text-xs">加载中...</div>
          <div v-else-if="detailItems.length === 0" class="py-10 text-center text-text-secondary text-xs">暂无消费明细</div>
        </div>

        <!-- 分页 -->
        <div
          v-if="pagination.totalPages > 1"
          class="flex items-center gap-3 text-xs text-text-secondary mt-4"
        >
          <span>共 {{ pagination.total }} 条</span>
          <button
            class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="pagination.page <= 1"
            @click="prevPage"
          >
            上一页
          </button>
          <span>第 {{ pagination.page }} / {{ pagination.totalPages }} 页</span>
          <button
            class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="pagination.page >= pagination.totalPages"
            @click="nextPage"
          >
            下一页
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
