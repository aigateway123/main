<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { listPricing, updatePricing, getPricingTemplates, type PricingResponse, type PricingTemplate, type TimeRange } from '@/api/pricing'

const pricingList = ref<PricingResponse[]>([])
const loading = ref(false)

const showEdit = ref(false)
const editItem = ref<PricingResponse | null>(null)
const editForm = ref({
  pricingType: 'flat',
  pricingUnit: 'token',
  pricePerInputToken: 0,
  pricePerOutputToken: 0,
  perImagePrice: 0,
  resolutions: [] as { size: string; price: number }[],
  peakRanges: [] as TimeRange[],
  peakPricePerInputToken: 0,
  peakPricePerOutputToken: 0,
  offPeakPricePerInputToken: 0,
  offPeakPricePerOutputToken: 0,
})
const saving = ref(false)

const showTemplates = ref(false)
const templates = ref<PricingTemplate[]>([])

// 可用分辨率选项
const resolutionOptions = ['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024']

const usedResolutions = computed(() => editForm.value.resolutions.map(r => r.size))
const availableResolutions = computed(() => resolutionOptions.filter(s => !usedResolutions.value.includes(s)))

async function loadTemplates() {
  try {
    templates.value = await getPricingTemplates()
    showTemplates.value = true
  } catch { /* ignore */ }
}

function applyTemplate(tpl: PricingTemplate) {
  const item = pricingList.value.find(i => i.modelCode === tpl.modelCode)
  if (item) {
    openEdit(item)
    editForm.value.pricingType = tpl.pricingType || 'flat'
    editForm.value.pricePerInputToken = tpl.suggestedInputPrice
    editForm.value.pricePerOutputToken = tpl.suggestedOutputPrice
  }
}

async function loadPricing() {
  loading.value = true
  try { pricingList.value = await listPricing() } finally { loading.value = false }
}

function openEdit(item: PricingResponse) {
  editItem.value = item
  // 解析已有定价数据
  const unitPrice = item.unitPrice
  const resolutions: { size: string; price: number }[] = []
  if (unitPrice?.resolutions) {
    for (const [size, price] of Object.entries(unitPrice.resolutions)) {
      resolutions.push({ size, price: Number(price) })
    }
  }
  // 解析高峰时段（兼容新旧数据：优先 peakRanges，旧数据兜底 peakStart/peakEnd；两者皆无 → 0 组 = 全天低谷价）
  const ranges = item.peakRanges?.length
    ? item.peakRanges.map(r => ({ start: r.start.slice(0, 5), end: r.end.slice(0, 5) }))
    : (item.peakStart && item.peakEnd
        ? [{ start: item.peakStart.slice(0, 5), end: item.peakEnd.slice(0, 5) }]
        : [])
  editForm.value = {
    pricingType: item.pricingType || 'flat',
    pricingUnit: item.pricingUnit || 'token',
    pricePerInputToken: item.pricePerInputToken ?? 0,
    pricePerOutputToken: item.pricePerOutputToken ?? 0,
    perImagePrice: (unitPrice?.per_image as number) ?? 0,
    resolutions,
    peakRanges: ranges,
    peakPricePerInputToken: item.peakPricePerInputToken ?? 0,
    peakPricePerOutputToken: item.peakPricePerOutputToken ?? 0,
    offPeakPricePerInputToken: item.offPeakPricePerInputToken ?? 0,
    offPeakPricePerOutputToken: item.offPeakPricePerOutputToken ?? 0,
  }
  // 存量 start === end 提示（旧语义 = 全天高峰，不允许直接保存）
  if (ranges.some(r => r.start === r.end)) {
    alert('检测到存量"全天高峰"时段（开始 = 结束）：该时段为全天高峰，请先修改为有效时段再保存')
  }
  showEdit.value = true
}

function addResolution() {
  if (availableResolutions.value.length > 0) {
    editForm.value.resolutions.push({ size: availableResolutions.value[0], price: 0 })
  }
}

function removeResolution(index: number) {
  editForm.value.resolutions.splice(index, 1)
}

// 高峰时段增删/排序（MVP 不做拖拽，用上移/下移）
function addRange() {
  if (editForm.value.peakRanges.length < 8) {
    editForm.value.peakRanges.push({ start: '09:00', end: '12:00' })
  }
}

function removeRange(index: number) {
  editForm.value.peakRanges.splice(index, 1)
}

function swapRanges(a: number, b: number) {
  if (b < 0 || b >= editForm.value.peakRanges.length) return
  const tmp = editForm.value.peakRanges[a]
  editForm.value.peakRanges[a] = editForm.value.peakRanges[b]
  editForm.value.peakRanges[b] = tmp
}

async function handleSave() {
  if (!editItem.value) return
  saving.value = true
  try {
    const data: Record<string, any> = { pricingType: editForm.value.pricingType, pricingUnit: editForm.value.pricingUnit, currency: 'USD' }

    if (editForm.value.pricingUnit === 'image_count') {
      // 按张计费
      const unitPrice: Record<string, any> = { per_image: editForm.value.perImagePrice }
      if (editForm.value.resolutions.length > 0) {
        unitPrice.resolutions = {} as Record<string, number>
        for (const r of editForm.value.resolutions) {
          unitPrice.resolutions[r.size] = r.price
        }
      }
      data.unitPrice = unitPrice
      data.pricePerInputToken = 0
      data.pricePerOutputToken = 0
    } else {
      // 按 token 计费
      if (editForm.value.pricingType === 'flat') {
        data.pricePerInputToken = editForm.value.pricePerInputToken
        data.pricePerOutputToken = editForm.value.pricePerOutputToken
      } else {
        const ranges = editForm.value.peakRanges.filter(r => r.start && r.end)
        // start >= end 拒绝（与后端 400 校验一致）
        if (ranges.some(r => r.start >= r.end)) { alert('高峰时段的开始时间必须早于结束时间'); return }
        data.peakRanges = ranges   // 允许空数组（0 组 = 全天低谷价）
        data.peakStart = undefined
        data.peakEnd = undefined
        data.peakPricePerInputToken = editForm.value.peakPricePerInputToken
        data.peakPricePerOutputToken = editForm.value.peakPricePerOutputToken
        data.offPeakPricePerInputToken = editForm.value.offPeakPricePerInputToken
        data.offPeakPricePerOutputToken = editForm.value.offPeakPricePerOutputToken
      }
    }

    // Auto-detect pricing status: active if prices are configured
    const hasPrices = editForm.value.pricingUnit === 'image_count'
      ? editForm.value.perImagePrice > 0
      : editForm.value.pricingType === 'flat'
        ? (editForm.value.pricePerInputToken > 0 || editForm.value.pricePerOutputToken > 0)
        : true // time_based always has some config
    data.pricingStatus = hasPrices ? 'active' : 'pending'
    await updatePricing(editItem.value.modelId, data)
    alert('定价已更新')
    showEdit.value = false
    await loadPricing()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    alert(err?.response?.data?.message ?? '保存失败')
  } finally { saving.value = false }
}

function formatPricingUnit(unit?: string) {
  switch (unit) {
    case 'image_count': return '按张'
    case 'request': return '按次'
    case 'per_million_tokens': return '按百万 Token'
    default: return '按 Token'
  }
}

function formatRanges(ranges?: TimeRange[], peakStart?: string, peakEnd?: string) {
  if (ranges?.length) return ranges.map(r => `${r.start.slice(0, 5)}-${r.end.slice(0, 5)}`).join(', ')
  if (peakStart && peakEnd) return `${peakStart.slice(0, 5)}-${peakEnd.slice(0, 5)}`
  return '未配置（全天低谷价）'
}

onMounted(() => { loadPricing(); loadTemplates() })
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-border">
      <div>
        <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          模型计费与定价规则
        </h2>
        <p class="text-xs text-text-secondary mt-0.5">支持按 Token / 按百万 Token / 按张数计费，高峰期与低谷期分时段阶梯计费策略</p>
      </div>
      <button class="px-3 py-1.5 border border-primary text-primary bg-white hover:bg-blue-50 rounded text-xs font-medium transition-colors cursor-pointer" @click="showTemplates = !showTemplates">
        定价模板
      </button>
    </div>

    <!-- Pricing Templates -->
    <div v-if="showTemplates" class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-text-primary">快速定价模板</h3>
        <button class="text-xs text-primary hover:underline cursor-pointer" @click="showTemplates = false">收起</button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div v-for="tpl in templates" :key="tpl.modelCode"
          class="border border-border rounded-lg p-3 space-y-2 hover:border-primary cursor-pointer transition-colors"
          @click="applyTemplate(tpl)">
          <div class="text-xs font-bold text-text-primary">{{ tpl.providerName }}</div>
          <div class="text-[10px] font-mono text-text-secondary">{{ tpl.modelCode }}</div>
          <div class="text-[10px] text-text-secondary">
            Input: ¥{{ tpl.suggestedInputPrice.toFixed(8) }}<br>
            Output: ¥{{ tpl.suggestedOutputPrice.toFixed(8) }}
          </div>
          <div class="text-[10px] text-primary">点击应用</div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="overflow-x-auto rounded border border-border">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
              <th class="px-4 py-2">模型名称</th><th class="px-4 py-2">模型代码</th><th class="px-4 py-2">计价单位</th>
              <th class="px-4 py-2">定价类型</th><th class="px-4 py-2">定价状态</th><th class="px-4 py-2">价格详情</th><th class="px-4 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody v-if="!loading && pricingList.length > 0" class="divide-y divide-border">
            <tr
              v-for="(item, index) in pricingList"
              :key="item.modelId"
              :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
            >
              <td class="px-4 py-2 font-bold text-text-primary">{{ item.modelName }}</td>
              <td class="px-4 py-2">
                <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px]">{{ item.modelCode }}</code>
              </td>
              <td class="px-4 py-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-gray-50 text-gray-700 border-gray-200/60">
                  {{ formatPricingUnit(item.pricingUnit) }}
                </span>
              </td>
              <td class="px-4 py-2">
                <span v-if="item.pricingStatus === 'active'"
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                    item.pricingType === 'flat'
                      ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                      : 'bg-purple-50 text-purple-700 border-purple-200/60',
                  ]"
                >
                  {{ item.pricingType === 'flat' ? '统一定价' : '分时段' }}
                </span>
                <span v-else class="text-text-secondary">—</span>
              </td>
              <td class="px-4 py-2">
                <span v-if="item.pricingStatus === 'active'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-green-50 text-green-700 border-green-200/60">
                  ✅ 已配置
                </span>
                <span v-else
                  class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-yellow-50 text-yellow-700 border-yellow-200/60">
                  ⏳ 待配置
                </span>
              </td>
              <td class="px-4 py-2 font-mono text-text-primary">
                <template v-if="item.pricingStatus === 'active'">
                  <template v-if="item.pricingUnit === 'image_count'">
                    <div class="text-[11px] leading-tight space-y-0.5">
                      <div class="text-text-primary">每张: ¥{{ (item.unitPrice?.per_image as number)?.toFixed(4) }}</div>
                      <div v-if="item.unitPrice?.resolutions" class="text-text-secondary">
                        分辨率阶梯定价可用
                      </div>
                    </div>
                  </template>
                  <template v-else-if="item.pricingType === 'flat'">
                    <template v-if="item.pricePerInputToken != null && item.pricePerOutputToken != null">
                      In: ¥{{ item.pricePerInputToken.toFixed(8) }}<span v-if="item.pricingUnit === 'per_million_tokens'" class="text-text-secondary">/M</span><br>
                      Out: ¥{{ item.pricePerOutputToken.toFixed(8) }}<span v-if="item.pricingUnit === 'per_million_tokens'" class="text-text-secondary">/M</span>
                    </template>
                    <span v-else class="text-text-secondary">—</span>
                  </template>
                  <template v-else>
                    <div class="text-[11px] leading-tight space-y-0.5">
                      <div class="text-text-primary">高峰: ¥{{ item.peakPricePerInputToken?.toFixed(8) }} / ¥{{ item.peakPricePerOutputToken?.toFixed(8) }}<span v-if="item.pricingUnit === 'per_million_tokens'" class="text-text-secondary">/M</span></div>
                      <div class="text-text-secondary">低谷: ¥{{ item.offPeakPricePerInputToken?.toFixed(8) }} / ¥{{ item.offPeakPricePerOutputToken?.toFixed(8) }}<span v-if="item.pricingUnit === 'per_million_tokens'" class="text-text-secondary">/M</span></div>
                      <div class="text-[10px] text-text-secondary">
                        高峰时段: {{ formatRanges(item.peakRanges, item.peakStart, item.peakEnd) }}
                      </div>
                    </div>
                  </template>
                </template>
                <span v-else class="text-text-secondary">—</span>
              </td>
              <td class="px-4 py-2 text-right">
                <button
                  class="px-2.5 py-1 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="openEdit(item)"
                >
                  编辑
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="py-10 text-center text-text-secondary text-xs">加载中...</div>
        <div v-else-if="pricingList.length === 0" class="py-10 text-center text-text-secondary text-xs">暂无定价数据</div>
      </div>
    </div>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div v-if="showEdit && editItem" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showEdit = false">
        <div class="bg-white w-full max-w-lg rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-border pb-3">
            <div>
              <h3 class="text-xl font-bold text-text-primary">编辑定价 - {{ editItem.modelName }}</h3>
              <p class="text-xs font-mono text-text-secondary mt-0.5">模型代码: {{ editItem.modelCode }}</p>
            </div>
            <button class="text-text-secondary hover:text-text-primary p-1 rounded cursor-pointer" @click="showEdit = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">定价类型</label>
              <select v-model="editForm.pricingType"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary">
                <option value="flat">统一定价 (全天固定单价)</option>
                <option value="time_based">分时段 (高峰与低谷动态调价)</option>
              </select>
            </div>

            <!-- 计价单位 -->
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">计价单位</label>
              <select v-model="editForm.pricingUnit"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary">
                <option value="token">按 Token</option>
                <option value="per_million_tokens">按百万 Token</option>
                <option value="image_count">按张数</option>
                <option value="request">按次</option>
              </select>
            </div>

            <!-- Token 计费 -->
            <template v-if="editForm.pricingUnit === 'token' || editForm.pricingUnit === 'per_million_tokens'">
              <!-- 统一定价 - Token -->
              <div v-if="editForm.pricingType === 'flat'" class="grid grid-cols-2 gap-3 p-3 bg-[#f8f9fa] rounded border border-border">
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary">Input 单价 {{ editForm.pricingUnit === 'per_million_tokens' ? '(per million tokens)' : '(per token)' }}</label>
                  <input v-model.number="editForm.pricePerInputToken" type="number" step="1e-8"
                    class="w-full h-9 px-3 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
                  <div class="text-[10px] text-text-secondary mt-0.5">USD / {{ editForm.pricingUnit === 'per_million_tokens' ? 'million tokens' : 'token' }}</div>
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary">Output 单价 {{ editForm.pricingUnit === 'per_million_tokens' ? '(per million tokens)' : '(per token)' }}</label>
                  <input v-model.number="editForm.pricePerOutputToken" type="number" step="1e-8"
                    class="w-full h-9 px-3 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
                  <div class="text-[10px] text-text-secondary mt-0.5">USD / {{ editForm.pricingUnit === 'per_million_tokens' ? 'million tokens' : 'token' }}</div>
                </div>
              </div>

              <!-- 分时段 - Token -->
              <div v-else class="space-y-3 p-3 bg-[#f8f9fa] rounded border border-border">
                <!-- 高峰时段列表（多组，可增删、可排序，最多 8 组） -->
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-text-primary flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    高峰时段
                  </label>
                  <div v-if="editForm.peakRanges.length === 0" class="text-[10px] text-text-secondary py-1">
                    未配置高峰时段，全天按低谷价计费
                  </div>
                  <div v-for="(r, idx) in editForm.peakRanges" :key="idx" class="space-y-1">
                    <div class="flex items-center gap-2">
                      <input v-model="r.start" type="time"
                        class="h-8 flex-1 px-2 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                      <span class="text-text-secondary text-xs">至</span>
                      <input v-model="r.end" type="time"
                        class="h-8 flex-1 px-2 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                      <button type="button"
                        class="text-text-secondary hover:text-text-primary text-xs cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        :disabled="idx === 0"
                        @click="swapRanges(idx, idx - 1)">↑</button>
                      <button type="button"
                        class="text-text-secondary hover:text-text-primary text-xs cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        :disabled="idx === editForm.peakRanges.length - 1"
                        @click="swapRanges(idx, idx + 1)">↓</button>
                      <button type="button" class="text-red-500 hover:text-red-700 text-xs cursor-pointer" @click="removeRange(idx)">删除</button>
                    </div>
                    <div v-if="r.start && r.end && r.start >= r.end" class="text-[10px] text-red-500">
                      高峰时段的开始时间必须早于结束时间
                    </div>
                  </div>
                  <div class="flex items-center justify-between pt-0.5">
                    <button type="button"
                      class="text-xs text-primary hover:underline cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      :disabled="editForm.peakRanges.length >= 8"
                      @click="addRange">+ 添加高峰时段</button>
                    <span v-if="editForm.peakRanges.length >= 8" class="text-[10px] text-text-secondary">最多配置 8 组高峰时段</span>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-2">
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-text-primary">高峰 Input 价{{ editForm.pricingUnit === 'per_million_tokens' ? ' (per million tokens)' : '' }}</label>
                    <input v-model.number="editForm.peakPricePerInputToken" type="number" step="1e-8"
                      class="w-full h-8 px-2.5 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-text-primary">高峰 Output 价{{ editForm.pricingUnit === 'per_million_tokens' ? ' (per million tokens)' : '' }}</label>
                    <input v-model.number="editForm.peakPricePerOutputToken" type="number" step="1e-8"
                      class="w-full h-8 px-2.5 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-text-primary">低谷 Input 价{{ editForm.pricingUnit === 'per_million_tokens' ? ' (per million tokens)' : '' }}</label>
                    <input v-model.number="editForm.offPeakPricePerInputToken" type="number" step="1e-8"
                      class="w-full h-8 px-2.5 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-text-primary">低谷 Output 价{{ editForm.pricingUnit === 'per_million_tokens' ? ' (per million tokens)' : '' }}</label>
                    <input v-model.number="editForm.offPeakPricePerOutputToken" type="number" step="1e-8"
                      class="w-full h-8 px-2.5 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>
            </template>

            <!-- 按张数计费 -->
            <template v-if="editForm.pricingUnit === 'image_count'">
              <div class="p-3 bg-[#f8f9fa] rounded border border-border space-y-3">
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary">每张图片单价</label>
                  <input v-model.number="editForm.perImagePrice" type="number" step="0.0001"
                    class="w-full h-9 px-3 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
                  <div class="text-[10px] text-text-secondary mt-0.5">基础单价，如 0.10 (USD/张)</div>
                </div>

                <!-- 分辨率阶梯定价 -->
                <div class="border-t border-border pt-3">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-xs font-semibold text-text-primary">分辨率阶梯定价 <span class="text-text-secondary font-normal">(可选)</span></label>
                    <button type="button"
                      class="text-xs text-primary hover:underline cursor-pointer"
                      :disabled="availableResolutions.length === 0"
                      @click="addResolution">+ 添加分辨率</button>
                  </div>
                  <div v-if="editForm.resolutions.length === 0" class="text-[10px] text-text-secondary py-1">
                    未配置分辨率阶梯定价，所有尺寸将使用基础单价
                  </div>
                  <div v-for="(res, idx) in editForm.resolutions" :key="idx" class="flex items-center gap-2 mb-2">
                    <select v-model="res.size"
                      class="h-8 px-2 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary flex-1">
                      <option v-for="opt in resolutionOptions" :key="opt" :value="opt" :disabled="opt !== res.size && usedResolutions.includes(opt)">{{ opt }}</option>
                    </select>
                    <input v-model.number="res.price" type="number" step="0.0001" placeholder="单价"
                      class="h-8 w-24 px-2 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                    <button type="button" class="text-red-500 hover:text-red-700 text-xs cursor-pointer" @click="removeResolution(idx)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- 按次计费 -->
            <template v-if="editForm.pricingUnit === 'request'">
              <div class="p-3 bg-[#f8f9fa] rounded border border-border space-y-1">
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary">每次请求单价</label>
                  <input v-model.number="editForm.perImagePrice" type="number" step="0.0001"
                    class="w-full h-9 px-3 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                  <div class="text-[10px] text-text-secondary mt-0.5">每次请求的固定单价 (USD/次)</div>
                </div>
              </div>
            </template>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button type="button"
                class="h-9 px-4 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 font-medium text-xs rounded-btn transition-colors cursor-pointer"
                @click="showEdit = false">取消</button>
              <button type="submit"
                class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn shadow-xs transition-colors cursor-pointer"
                :disabled="saving">{{ saving ? '保存中...' : '保存费率配置' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
