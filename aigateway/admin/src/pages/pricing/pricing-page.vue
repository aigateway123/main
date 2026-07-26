<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listPricing, updatePricing, getPricingTemplates, type PricingResponse, type PricingTemplate } from '@/api/pricing'

const pricingList = ref<PricingResponse[]>([])
const loading = ref(false)

const showEdit = ref(false)
const editItem = ref<PricingResponse | null>(null)
const editForm = ref({
  pricingType: 'flat',
  pricePerInputToken: 0,
  pricePerOutputToken: 0,
  peakStart: '08:00',
  peakEnd: '23:00',
  peakPricePerInputToken: 0,
  peakPricePerOutputToken: 0,
  offPeakPricePerInputToken: 0,
  offPeakPricePerOutputToken: 0,
})
const saving = ref(false)

const showTemplates = ref(false)
const templates = ref<PricingTemplate[]>([])

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
  editForm.value = {
    pricingType: item.pricingType || 'flat',
    pricePerInputToken: item.pricePerInputToken ?? 0,
    pricePerOutputToken: item.pricePerOutputToken ?? 0,
    peakStart: item.peakStart ?? '08:00',
    peakEnd: item.peakEnd ?? '23:00',
    peakPricePerInputToken: item.peakPricePerInputToken ?? 0,
    peakPricePerOutputToken: item.peakPricePerOutputToken ?? 0,
    offPeakPricePerInputToken: item.offPeakPricePerInputToken ?? 0,
    offPeakPricePerOutputToken: item.offPeakPricePerOutputToken ?? 0,
  }
  showEdit.value = true
}

async function handleSave() {
  if (!editItem.value) return
  saving.value = true
  try {
    const data: Record<string, any> = { pricingType: editForm.value.pricingType, currency: 'USD' }
    if (editForm.value.pricingType === 'flat') {
      data.pricePerInputToken = editForm.value.pricePerInputToken
      data.pricePerOutputToken = editForm.value.pricePerOutputToken
    } else {
      data.peakStart = editForm.value.peakStart
      data.peakEnd = editForm.value.peakEnd
      data.peakPricePerInputToken = editForm.value.peakPricePerInputToken
      data.peakPricePerOutputToken = editForm.value.peakPricePerOutputToken
      data.offPeakPricePerInputToken = editForm.value.offPeakPricePerInputToken
      data.offPeakPricePerOutputToken = editForm.value.offPeakPricePerOutputToken
    }
    // Auto-detect pricing status: active if prices are configured
    const hasPrices = editForm.value.pricingType === 'flat'
      ? (editForm.value.pricePerInputToken > 0 || editForm.value.pricePerOutputToken > 0)
      : true // time_based always has some config
    data.pricingStatus = hasPrices ? 'active' : 'pending'
    await updatePricing(editItem.value.modelId, data)
    alert('定价已更新')
    showEdit.value = false
    await loadPricing()
  } catch (e: any) {
    alert(e?.response?.data?.message ?? '保存失败')
  } finally { saving.value = false }
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
        <p class="text-xs text-text-secondary mt-0.5">设定千 Token 吞吐单价，支持高峰期与低谷期分时段阶梯计费策略</p>
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
              <th class="px-4 py-2">模型名称</th><th class="px-4 py-2">模型代码</th><th class="px-4 py-2">定价类型</th>
              <th class="px-4 py-2">定价状态</th><th class="px-4 py-2">Input 价格</th><th class="px-4 py-2">Output 价格</th><th class="px-4 py-2 text-right">操作</th>
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
                  <template v-if="item.pricingType === 'flat'">
                    ¥{{ item.pricePerInputToken?.toFixed(8) }}
                  </template>
                  <template v-else>
                    <div class="text-[11px] leading-tight space-y-0.5">
                      <div class="text-text-primary">Peak: ¥{{ item.peakPricePerInputToken?.toFixed(8) }}</div>
                      <div class="text-text-secondary">OffPeak: ¥{{ item.offPeakPricePerInputToken?.toFixed(8) }}</div>
                    </div>
                  </template>
                </template>
                <span v-else class="text-text-secondary">—</span>
              </td>
              <td class="px-4 py-2 font-mono text-text-primary">
                <template v-if="item.pricingStatus === 'active'">
                  <template v-if="item.pricingType === 'flat'">
                    ¥{{ item.pricePerOutputToken?.toFixed(8) }}
                  </template>
                  <template v-else>
                    <div class="text-[11px] leading-tight space-y-0.5">
                      <div class="text-text-primary">Peak: ¥{{ item.peakPricePerOutputToken?.toFixed(8) }}</div>
                      <div class="text-text-secondary">OffPeak: ¥{{ item.offPeakPricePerOutputToken?.toFixed(8) }}</div>
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

            <!-- Unified -->
            <div v-if="editForm.pricingType === 'flat'" class="grid grid-cols-2 gap-3 p-3 bg-[#f8f9fa] rounded border border-border">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-text-primary">Input 单价 (per token)</label>
                <input v-model.number="editForm.pricePerInputToken" type="number" step="1e-8"
                  class="w-full h-9 px-3 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
                <div class="text-[10px] text-text-secondary mt-0.5">USD / token</div>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-text-primary">Output 单价 (per token)</label>
                <input v-model.number="editForm.pricePerOutputToken" type="number" step="1e-8"
                  class="w-full h-9 px-3 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
                <div class="text-[10px] text-text-secondary mt-0.5">USD / token</div>
              </div>
            </div>

            <!-- Time Based -->
            <div v-else class="space-y-3 p-3 bg-[#f8f9fa] rounded border border-border">
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    高峰开始
                  </label>
                  <input v-model="editForm.peakStart" type="time"
                    class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    高峰结束
                  </label>
                  <input v-model="editForm.peakEnd" type="time"
                    class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 pt-2">
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary">Peak Input 价</label>
                  <input v-model.number="editForm.peakPricePerInputToken" type="number" step="1e-8"
                    class="w-full h-8 px-2.5 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary">Peak Output 价</label>
                  <input v-model.number="editForm.peakPricePerOutputToken" type="number" step="1e-8"
                    class="w-full h-8 px-2.5 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary">OffPeak Input 价</label>
                  <input v-model.number="editForm.offPeakPricePerInputToken" type="number" step="1e-8"
                    class="w-full h-8 px-2.5 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-text-primary">OffPeak Output 价</label>
                  <input v-model.number="editForm.offPeakPricePerOutputToken" type="number" step="1e-8"
                    class="w-full h-8 px-2.5 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>

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
