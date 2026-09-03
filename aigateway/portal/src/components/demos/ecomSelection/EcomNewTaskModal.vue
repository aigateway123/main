<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 —— 发起全新 AI 选品调研任务弹窗
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/modals/NewTaskModal.tsx
// props: open / defaultInput —— emits: close / submit(input: TaskInput)
// （选项收敛自 DEFAULT_TASK_INPUT 域；打开时以 defaultInput 重置表单）
// ============================================================================
import { ref, watch } from 'vue'
import { X, Sparkles, Globe, DollarSign, Percent } from 'lucide-vue-next'
import type { TargetMarket, PlatformType, SellerType, TaskInput } from '@/data/ecomIntelData'
import { PLATFORMS, SELLER_TYPES } from '@/data/ecomIntelData'

const props = defineProps<{
  open: boolean
  defaultInput: TaskInput
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', input: TaskInput): void
}>()

const targetMarket = ref<TargetMarket>('美国')
const platform = ref<PlatformType>('Amazon')
const category = ref('宠物用品 (Pet Supplies)')
const budget = ref(100000)
const targetMargin = ref(35)
const sellerType = ref<SellerType>('贸易型卖家')
const additionalRequirements = ref('')

const MARKET_OPTIONS: { value: TargetMarket; label: string }[] = [
  { value: '美国', label: '美国 (Amazon US)' },
  { value: '加拿大', label: '加拿大 (Amazon CA)' },
  { value: '英国', label: '英国 (Amazon UK)' },
  { value: '德国', label: '德国 (Amazon DE)' },
  { value: '澳大利亚', label: '澳大利亚 (Amazon AU)' },
  { value: '日本', label: '日本 (Amazon JP)' },
  { value: '新加坡', label: '新加坡 (Amazon SG)' },
]

// 打开时用 defaultInput 重置本地表单
watch(
  () => props.open,
  (v) => {
    if (!v) return
    const d = props.defaultInput
    targetMarket.value = d.targetMarket
    platform.value = d.platform
    category.value = d.category
    budget.value = d.budget
    targetMargin.value = d.targetMargin
    sellerType.value = d.sellerType ?? '贸易型卖家'
    additionalRequirements.value = d.additionalRequirements ?? d.requirements ?? ''
  },
)

const submitForm = () => {
  emit('submit', {
    targetMarket: targetMarket.value,
    platform: platform.value,
    category: category.value,
    budget: budget.value,
    targetMargin: targetMargin.value,
    sellerType: sellerType.value,
    additionalRequirements: additionalRequirements.value.trim() || undefined,
  })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-xs flex flex-col max-h-[92vh]">
        <!-- Header -->
        <div class="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div class="flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-indigo-400" />
            <h3 class="text-base font-bold text-white">发起全新 AI 选品调研任务</h3>
          </div>
          <button
            type="button"
            class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
            @click="emit('close')"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Form -->
        <form class="flex flex-col min-h-0" @submit.prevent="submitForm">
          <div class="p-6 space-y-4 overflow-y-auto">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-slate-300 font-bold flex items-center gap-1">
                  <Globe class="w-3 h-3 text-indigo-400" />
                  目标国家/站点
                </label>
                <select
                  v-model="targetMarket"
                  class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500"
                >
                  <option v-for="m in MARKET_OPTIONS" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-slate-300 font-bold">电商平台</label>
                <select
                  v-model="platform"
                  class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500"
                >
                  <option v-for="p in PLATFORMS" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-slate-300 font-bold">目标品类方向</label>
              <input
                v-model="category"
                type="text"
                placeholder="例如：宠物用品 (Pet Supplies)"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-indigo-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5 bg-slate-950 border border-slate-800 rounded-xl p-3">
                <label class="text-slate-300 font-bold flex items-center gap-1">
                  <DollarSign class="w-3 h-3 text-emerald-400" />
                  启动资金预算 (¥)
                </label>
                <div class="flex items-baseline justify-between">
                  <span class="font-mono font-bold text-white text-sm">¥{{ budget.toLocaleString() }}</span>
                  <span class="text-[10px] text-slate-400 font-mono">~${{ Math.round(budget / 7.2).toLocaleString() }}</span>
                </div>
                <input
                  v-model.number="budget"
                  type="range"
                  min="30000"
                  max="500000"
                  step="10000"
                  class="w-full accent-indigo-500 h-1.5 cursor-pointer"
                />
              </div>

              <div class="space-y-1.5 bg-slate-950 border border-slate-800 rounded-xl p-3">
                <label class="text-slate-300 font-bold flex items-center gap-1">
                  <Percent class="w-3 h-3 text-cyan-400" />
                  期望最低毛利率
                </label>
                <div class="flex items-baseline justify-between">
                  <span class="font-mono font-bold text-cyan-400 text-sm">≥ {{ targetMargin }}%</span>
                  <span class="text-[10px] text-slate-400">红线门槛</span>
                </div>
                <input
                  v-model.number="targetMargin"
                  type="range"
                  min="20"
                  max="60"
                  step="1"
                  class="w-full accent-cyan-500 h-1.5 cursor-pointer"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-slate-300 font-bold">卖家类型</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="s in SELLER_TYPES"
                  :key="s"
                  type="button"
                  class="px-2 py-1.5 rounded-lg border text-center transition cursor-pointer"
                  :class="
                    sellerType === s
                      ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  "
                  @click="sellerType = s"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-slate-300 font-bold">补充需求与约束（可选）</label>
              <textarea
                v-model="additionalRequirements"
                rows="2"
                placeholder="例如：希望寻找高需求、痛点明确、具备差异化空间且避开公模价格战的蓝海出行产品。"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <div class="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold cursor-pointer"
              @click="emit('close')"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles class="w-3.5 h-3.5" />
              <span>立即让 AI 启动调研</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
