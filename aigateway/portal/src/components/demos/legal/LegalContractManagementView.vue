<!-- ============================================================================
     AI 法务员工 · 合同全生命周期台账与管理
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/contracts/ContractManagementView.tsx
     数据源：MOCK_ALL_CONTRACTS（别名 MOCK_CONTRACTS_REPOSITORY，ContractItem[]）
     emits: { (e:'select-contract-for-review', name: string) }
       行内「AI审查」按钮 / 详情弹窗「进入AI全条款深度审查」均以合同名称上抛，
       容器收到后进入 contract-review 并重挂载该视图（带范本）
     筛选：关键字（名称/编号/相对方）+ 履行状态 + 风险等级 + 合同类型（照原型文案）
     续约提醒条：status=expiring 或 剩余天数≤30 的台账常驻置顶（剩 N 天 / 已到期）
     顶部渲染 LegalDisclaimer banner（全局 footer 由容器渲染）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight, ClockAlert, Plus, Search, X } from 'lucide-vue-next'
import type { ContractItem } from '@/data/legalIntelData'
import { MOCK_ALL_CONTRACTS } from '@/data/legalMockData'
import LegalDisclaimer from './LegalDisclaimer.vue'

const emit = defineEmits<{
  (e: 'select-contract-for-review', name: string): void
}>()

// ---- 筛选状态（照原型：默认 all / 空关键字） ----
const searchQuery = ref('')
const selectedStatus = ref<string>('all')
const selectedRisk = ref<string>('all')
const selectedType = ref<string>('all')
const selectedContractDetail = ref<ContractItem | null>(null)

const hasActiveFilters = computed(
  () =>
    selectedStatus.value !== 'all' ||
    selectedRisk.value !== 'all' ||
    selectedType.value !== 'all' ||
    searchQuery.value !== '',
)

const resetFilters = () => {
  selectedStatus.value = 'all'
  selectedRisk.value = 'all'
  selectedType.value = 'all'
  searchQuery.value = ''
}

// ---- 过滤后的台账列表（照原型 filtered 逻辑） ----
const filtered = computed(() =>
  MOCK_ALL_CONTRACTS.filter((c) => {
    const q = searchQuery.value.trim().toLowerCase()
    const matchesSearch =
      q === '' ||
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.partyB.toLowerCase().includes(q)
    const matchesStatus = selectedStatus.value === 'all' || c.status === selectedStatus.value
    const matchesRisk = selectedRisk.value === 'all' || c.riskLevel === selectedRisk.value
    const matchesType = selectedType.value === 'all' || c.type === selectedType.value
    return matchesSearch && matchesStatus && matchesRisk && matchesType
  }),
)

// ---- 续约提醒：即将到期（status=expiring）或 30 天内到期 ----
const renewalContracts = computed(() =>
  MOCK_ALL_CONTRACTS.filter((c) => c.status === 'expiring' || c.remainingDays <= 30),
)

const handleReview = (contractTitle: string) => {
  emit('select-contract-for-review', contractTitle)
}

// ---- 详情弹窗：行点击打开 / 关闭 / 进入审查 ----
const openDetail = (contract: ContractItem) => {
  selectedContractDetail.value = contract
}

const closeDetail = () => {
  selectedContractDetail.value = null
}

const reviewFromDetail = () => {
  const target = selectedContractDetail.value
  if (!target) return
  selectedContractDetail.value = null
  emit('select-contract-for-review', target.title)
}

// ---- 状态徽章配色（照原型） ----
const statusBadgeClass = (status: string): string[] => {
  if (status === 'normal') return ['bg-emerald-950/60', 'text-emerald-300', 'border', 'border-emerald-800/50']
  if (status === 'pending') return ['bg-blue-950/60', 'text-blue-300', 'border', 'border-blue-800/50']
  if (status === 'expiring') return ['bg-amber-950/60', 'text-amber-300', 'border', 'border-amber-800/50']
  if (status === 'breach') return ['bg-rose-950/60', 'text-rose-300', 'border', 'border-rose-800/50']
  return ['bg-slate-800', 'text-slate-300', 'border', 'border-slate-700']
}

// ---- 风险徽章配色（照原型） ----
const riskBadgeClass = (level: string): string[] => {
  if (level === 'high') return ['bg-rose-950/60', 'text-rose-300', 'border', 'border-rose-800/40']
  if (level === 'medium') return ['bg-amber-950/60', 'text-amber-300', 'border', 'border-amber-800/40']
  return ['bg-emerald-950/60', 'text-emerald-300', 'border', 'border-emerald-800/40']
}

const riskLabel = (level: string): string =>
  level === 'high' ? '高' : level === 'medium' ? '中' : '低'

const riskFullLabel = (level: string): string =>
  level === 'high' ? '高' : level === 'medium' ? '中' : '低'
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- 顶部法律免责提示 -->
    <LegalDisclaimer />

    <!-- 标题与统计 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-500" />
          <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            合同全生命周期资产管理
          </span>
        </div>
        <h1 class="text-2xl font-bold text-slate-100 tracking-tight mt-1">
          企业合同台账与管理
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          当前纳入监控台账合同共
          <span class="font-semibold text-slate-200">{{ MOCK_ALL_CONTRACTS.length }}</span>
          份，覆盖采购、销售、劳务、保密等全业务线
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          @click="emit('select-contract-for-review', '设备采购合同.pdf')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>发起新合同初审</span>
        </button>
      </div>
    </div>

    <!-- 续约提醒条（status=expiring / 剩余天数≤30） -->
    <div
      v-if="renewalContracts.length > 0"
      class="bg-amber-950/25 border border-amber-800/40 rounded-xl px-4 py-3 space-y-2 animate-in fade-in duration-200"
    >
      <div class="flex items-center gap-2 text-xs font-bold text-amber-300">
        <ClockAlert class="w-4 h-4 text-amber-400 shrink-0" />
        <span>续约提醒（{{ renewalContracts.length }} 份合同即将到期或已到期，请及时跟进续约/终止决策）</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in renewalContracts"
          :key="c.id"
          type="button"
          @click="openDetail(c)"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-amber-800/40 hover:border-amber-500/60 text-[11px] text-slate-300 transition-colors cursor-pointer text-left"
        >
          <span class="font-semibold text-slate-200 max-w-[220px] truncate">{{ c.title }}</span>
          <span class="font-mono text-slate-500">{{ c.code }}</span>
          <span
            :class="[
              'text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0',
              c.remainingDays <= 0
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
            ]"
          >
            {{ c.remainingDays <= 0 ? '已到期' : `剩 ${c.remainingDays} 天` }}
          </span>
        </button>
      </div>
    </div>

    <!-- 筛选条 -->
    <div class="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <!-- 搜索 -->
        <div class="relative lg:col-span-2">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索合同名称、编号、签约相对方..."
            class="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <!-- 履行状态筛选 -->
        <div>
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
          >
            <option value="all">全部履行状态</option>
            <option value="normal">正常履约中</option>
            <option value="pending">待法务复核</option>
            <option value="expiring">即将到期预警</option>
            <option value="breach">异常违约风险</option>
            <option value="archived">已归档</option>
          </select>
        </div>

        <!-- 风险等级筛选 -->
        <div>
          <select
            v-model="selectedRisk"
            class="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
          >
            <option value="all">全部风险等级</option>
            <option value="high">🔴 高风险</option>
            <option value="medium">🟠 中风险</option>
            <option value="low">🟢 低风险</option>
          </select>
        </div>

        <!-- 合同类型筛选 -->
        <div>
          <select
            v-model="selectedType"
            class="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
          >
            <option value="all">全部合同类型</option>
            <option value="设备采购">设备采购</option>
            <option value="产品销售">产品销售</option>
            <option value="技术服务">技术服务</option>
            <option value="软件采购">软件采购</option>
            <option value="房屋租赁">房屋租赁</option>
            <option value="保密协议">保密协议</option>
          </select>
        </div>
      </div>

      <div
        class="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/80"
      >
        <span>
          共筛选出 <strong class="text-slate-200">{{ filtered.length }}</strong> 份合同台账
        </span>
        <button
          v-if="hasActiveFilters"
          type="button"
          @click="resetFilters"
          class="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
        >
          重置所有筛选条件
        </button>
      </div>
    </div>

    <!-- 台账表格 -->
    <div class="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th class="px-4 py-3">合同名称 & 编号</th>
              <th class="px-4 py-3">类型</th>
              <th class="px-4 py-3">签约相对方</th>
              <th class="px-4 py-3 text-right">标的金额</th>
              <th class="px-4 py-3">履约状态</th>
              <th class="px-4 py-3">AI 风险</th>
              <th class="px-4 py-3">到期日期</th>
              <th class="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80">
            <tr
              v-for="contract in filtered"
              :key="contract.id"
              @click="openDetail(contract)"
              class="hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <td class="px-4 py-3.5">
                <div class="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                  {{ contract.title }}
                </div>
                <div class="text-[10px] text-slate-500 font-mono mt-0.5">
                  {{ contract.code }}
                </div>
              </td>

              <td class="px-4 py-3.5 text-slate-400">
                {{ contract.type }}
              </td>

              <td class="px-4 py-3.5 text-slate-300 font-medium">
                {{ contract.partyB }}
              </td>

              <td class="px-4 py-3.5 font-mono font-bold text-slate-100 text-right">
                {{ contract.amount }}
              </td>

              <td class="px-4 py-3.5">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                    ...statusBadgeClass(contract.status),
                  ]"
                >
                  {{ contract.statusText }}
                </span>
              </td>

              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1.5">
                  <span
                    :class="[
                      'text-[10px] px-1.5 py-0.5 rounded font-bold',
                      ...riskBadgeClass(contract.riskLevel),
                    ]"
                  >
                    {{ riskLabel(contract.riskLevel) }}风险
                  </span>
                  <span class="text-[11px] font-mono text-slate-400">{{ contract.riskScore }}分</span>
                </div>
              </td>

              <td class="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                {{ contract.expireDate }}
              </td>

              <td class="px-4 py-3.5 text-right">
                <button
                  type="button"
                  @click.stop="handleReview(contract.title)"
                  class="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 text-[11px] hover:underline cursor-pointer"
                >
                  <span>AI审查</span>
                  <ChevronRight class="w-3 h-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 合同详情弹窗 -->
    <Teleport to="body">
      <div
        v-if="selectedContractDetail"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-[2px] animate-in fade-in duration-200"
        @click.self="closeDetail"
      >
        <div
          class="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden"
        >
          <div class="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-100 truncate">{{ selectedContractDetail.title }}</h3>
              <p class="text-xs text-slate-400 font-mono mt-0.5">编号：{{ selectedContractDetail.code }}</p>
            </div>
            <button
              type="button"
              @click="closeDetail"
              class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <span class="text-slate-400">甲方（我方）：</span>
                <span class="font-semibold text-slate-200 ml-1">{{ selectedContractDetail.partyA }}</span>
              </div>
              <div>
                <span class="text-slate-400">乙方（相对方）：</span>
                <span class="font-semibold text-slate-200 ml-1">{{ selectedContractDetail.partyB }}</span>
              </div>
              <div>
                <span class="text-slate-400">合同金额：</span>
                <span class="font-bold text-blue-400 ml-1">{{ selectedContractDetail.amount }}</span>
              </div>
              <div>
                <span class="text-slate-400">履约状态：</span>
                <span class="font-semibold text-slate-200 ml-1">{{ selectedContractDetail.statusText }}</span>
              </div>
              <div>
                <span class="text-slate-400">生效日期：</span>
                <span class="font-mono text-slate-300 ml-1">{{ selectedContractDetail.signDate }}</span>
              </div>
              <div>
                <span class="text-slate-400">届满日期：</span>
                <span class="font-mono text-slate-300 ml-1">{{ selectedContractDetail.expireDate }}</span>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-amber-950/25 border border-amber-800/40 space-y-1">
              <div class="font-bold text-amber-300">AI 履约风险诊断备注：</div>
              <p class="text-amber-200/90 leading-relaxed">
                当前合同AI综合风险评分 {{ selectedContractDetail.riskScore }}/100
                （{{ riskFullLabel(selectedContractDetail.riskLevel) }}风险）。
                <template v-if="selectedContractDetail.riskLevel === 'high'">
                  涉及预付款比例过大或违约金极高条款，建议重新拟定补充协议。
                </template>
                <template v-else>
                  日常履约风险在受控范围，注意跟进交付节点验收盖章凭证。
                </template>
              </p>
            </div>
          </div>

          <div class="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              @click="closeDetail"
              class="text-slate-400 text-xs font-medium hover:text-slate-200 cursor-pointer"
            >
              关闭
            </button>
            <button
              type="button"
              @click="reviewFromDetail"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
            >
              进入AI全条款深度审查
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
