<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAdminBillingSummary, getAdminBillingUsage, type AdminBillingSummary, type UsageRecord } from '@/api/billing'
import EmptyState from '@/components/common/EmptyState.vue'

const summary = ref<AdminBillingSummary | null>(null)
const records = ref<UsageRecord[]>([])
const total = ref(0)
const loading = ref(true)

const filterUserId = ref<number | undefined>(undefined)
const filterStartDate = ref('')
const filterEndDate = ref('')
const filterStatus = ref('')
const page = ref(1)
const pageSize = ref(10)

async function loadData() {
  loading.value = true
  try {
    const [s, usageResult] = await Promise.all([
      getAdminBillingSummary(),
      getAdminBillingUsage({
        userId: filterUserId.value,
        startDate: filterStartDate.value || undefined,
        endDate: filterEndDate.value || undefined,
        status: filterStatus.value || undefined,
        page: page.value,
        pageSize: pageSize.value,
      }),
    ])
    summary.value = s
    records.value = usageResult.items
    total.value = usageResult.total
  } catch {
    alert('加载数据失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  loadData()
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return dateStr.slice(0, 19).replace('T', ' ')
}

onMounted(loadData)
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Stats -->
    <div v-if="summary" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="bg-white rounded-lg border border-border p-4">
        <span class="text-xs font-semibold text-text-secondary block mb-1">总用户</span>
        <strong class="text-xl font-bold text-text-primary">{{ summary.totalUsers }}</strong>
      </div>
      <div class="bg-white rounded-lg border border-border p-4">
        <span class="text-xs font-semibold text-text-secondary block mb-1">活跃用户</span>
        <strong class="text-xl font-bold text-text-primary">{{ summary.activeUsers }}</strong>
      </div>
      <div class="bg-white rounded-lg border border-border p-4">
        <span class="text-xs font-semibold text-text-secondary block mb-1">今日请求数</span>
        <strong class="text-xl font-bold text-text-primary">{{ summary.todayRequests }}</strong>
      </div>
      <div class="bg-white rounded-lg border border-border p-4">
        <span class="text-xs font-semibold text-text-secondary block mb-1">今日费用</span>
        <strong class="text-xl font-bold text-text-primary">¥{{ summary.todayCost.toFixed(4) }}</strong>
      </div>
      <div class="bg-white rounded-lg border border-border p-4">
        <span class="text-xs font-semibold text-text-secondary block mb-1">总费用</span>
        <strong class="text-xl font-bold text-text-primary">¥{{ summary.totalCost.toFixed(4) }}</strong>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg border border-border">
      <div class="flex flex-wrap items-center gap-2">
        <input v-model.number="filterUserId" type="number" placeholder="用户 ID"
          class="w-28 h-8 px-2.5 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
        <input v-model="filterStartDate" type="date"
          class="w-36 h-8 px-2.5 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
        <input v-model="filterEndDate" type="date"
          class="w-36 h-8 px-2.5 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
        <select v-model="filterStatus"
          class="h-8 px-2.5 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary">
          <option value="">全部状态</option>
          <option value="success">成功</option>
          <option value="failed">失败</option>
        </select>
        <button
          class="h-8 px-3 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-btn transition-colors cursor-pointer"
          @click="handleSearch"
        >
          搜索
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="overflow-x-auto rounded border border-border">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
              <th class="px-4 py-2">邮箱</th>
              <th class="px-4 py-2">模型</th>
              <th class="px-4 py-2">Input Tokens</th>
              <th class="px-4 py-2">Output Tokens</th>
              <th class="px-4 py-2">费用</th>
              <th class="px-4 py-2">状态</th>
              <th class="px-4 py-2">时间</th>
            </tr>
          </thead>
          <tbody v-if="!loading && records.length > 0" class="divide-y divide-border">
            <tr
              v-for="(r, index) in records"
              :key="r.id"
              :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
            >
              <td class="px-4 py-2 font-medium text-text-primary">{{ r.email }}</td>
              <td class="px-4 py-2">
                <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px]">{{ r.modelCode }}</code>
              </td>
              <td class="px-4 py-2 text-text-secondary">{{ r.inputTokens.toLocaleString() }}</td>
              <td class="px-4 py-2 text-text-secondary">{{ r.outputTokens.toLocaleString() }}</td>
              <td class="px-4 py-2 font-mono font-medium text-text-primary">¥{{ r.costAmount.toFixed(6) }}</td>
              <td class="px-4 py-2">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                    r.requestStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border-rose-200/60',
                  ]"
                >
                  {{ r.requestStatus === 'success' ? '成功' : '失败' }}
                </span>
              </td>
              <td class="px-4 py-2 text-text-secondary text-[11px] font-mono">{{ formatDate(r.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="py-10 text-center text-text-secondary text-xs">加载中...</div>
        <EmptyState v-else-if="records.length === 0" message="暂无用量记录" />
      </div>

      <!-- Pagination -->
      <div v-if="total > pageSize" class="flex items-center gap-3 text-xs text-text-secondary mt-4">
        <span>共 {{ total }} 条</span>
        <button
          class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
          :disabled="page <= 1"
          @click="page--; loadData()"
        >
          上一页
        </button>
        <span>第 {{ page }} / {{ Math.ceil(total / pageSize) }} 页</span>
        <button
          class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
          :disabled="page * pageSize >= total"
          @click="page++; loadData()"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
