<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/NewAnalysisModal.tsx -->
<!-- 新建知识产权分析任务弹窗：props open / currentInput —— emits close / submit(input)
     打开时以 currentInput 重置表单；预置场景 3 个 pill（IP_PRESET_TASKS）一键快速填充；
     提交后 emit submit 并自行 emit close；Teleport + 遮罩 z-[80] -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowRight, Sparkles, X } from 'lucide-vue-next'
import type { AnalysisInput } from '@/data/ipIntelData'
import { IP_PRESET_TASKS } from '@/data/ipIntelData'

const props = defineProps<{
  open: boolean
  currentInput: AnalysisInput
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', input: AnalysisInput): void
}>()

const industry = ref('')
const product = ref('')
const targetMarkets = ref<string[]>([])
const competitorsText = ref('')
const requirement = ref('')

// 可多选的目标国家/出海市场 chips（至少保留 1 个）
const AVAILABLE_MARKETS = ['中国', '美国', '欧洲', '日本', '韩国', '东南亚']

// 打开时以 currentInput 重置表单
watch(
  () => props.open,
  (v) => {
    if (!v) return
    const d = props.currentInput
    industry.value = d.industry
    product.value = d.product
    targetMarkets.value = [...d.targetMarkets]
    competitorsText.value = d.competitors.join('、')
    requirement.value = d.requirement
  },
)

// 切换目标市场（保证至少选中一个）
const toggleMarket = (market: string) => {
  if (targetMarkets.value.includes(market)) {
    if (targetMarkets.value.length > 1) {
      targetMarkets.value = targetMarkets.value.filter((m) => m !== market)
    }
  } else {
    targetMarkets.value = [...targetMarkets.value, market]
  }
}

// 预置场景快速填充（IP_PRESET_TASKS 前 3 个 pill）
const applyPreset = (preset: AnalysisInput) => {
  industry.value = preset.industry
  product.value = preset.product
  targetMarkets.value = [...preset.targetMarkets]
  competitorsText.value = preset.competitors.join('、')
  requirement.value = preset.requirement
}

// 提交：竞对输入按 逗号/顿号/空格 拆分为数组，空则回落默认三巨头
const submitForm = () => {
  const compArray = competitorsText.value.split(/[,，、\s]+/).filter(Boolean)
  emit('submit', {
    industry: industry.value,
    product: product.value,
    targetMarkets: targetMarkets.value,
    competitors: compArray.length > 0 ? compArray : ['CATL', 'BYD', 'Tesla'],
    requirement: requirement.value,
  })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 my-auto max-h-[92vh]"
      >
        <!-- 弹窗头部 -->
        <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 rounded-t-xl shrink-0">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <Sparkles class="w-3.5 h-3.5" />
            </div>
            <div class="min-w-0">
              <h2 class="text-sm font-bold text-slate-900">新建知识产权分析任务</h2>
              <p class="text-[10px] text-slate-500 truncate">输入企业产品与目标市场，启动AI智能专利攻防分析</p>
            </div>
          </div>

          <button
            type="button"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer shrink-0"
            @click="emit('close')"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- 表单主体 -->
        <form class="p-4 space-y-3 text-xs overflow-y-auto" @submit.prevent="submitForm">
          <!-- 预置分析场景：一键快速填充 -->
          <div>
            <label class="font-semibold text-slate-700 block mb-1 text-[11px]">预置分析场景（点击快速填充）</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(preset, idx) in IP_PRESET_TASKS"
                :key="idx"
                type="button"
                class="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all cursor-pointer flex items-center gap-1"
                @click="applyPreset(preset)"
              >
                <Sparkles class="w-3 h-3" />
                <span>{{ preset.industry }} · {{ preset.product }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label class="font-semibold text-slate-700 block mb-1 text-[11px]">所属行业领域</label>
              <input
                v-model="industry"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
                placeholder="例如：新能源储能、动力电池"
              />
            </div>

            <div>
              <label class="font-semibold text-slate-700 block mb-1 text-[11px]">研发产品标的</label>
              <input
                v-model="product"
                type="text"
                required
                class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
                placeholder="例如：液冷储能系统、固态电芯"
              />
            </div>
          </div>

          <div>
            <label class="font-semibold text-slate-700 block mb-1 text-[11px]">目标国家 / 出海市场</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="market in AVAILABLE_MARKETS"
                :key="market"
                type="button"
                class="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer"
                :class="
                  targetMarkets.includes(market)
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                "
                @click="toggleMarket(market)"
              >
                {{ market }}
              </button>
            </div>
          </div>

          <div>
            <label class="font-semibold text-slate-700 block mb-1 text-[11px]">重点竞争对手（以逗号或顿号隔开）</label>
            <input
              v-model="competitorsText"
              type="text"
              required
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
              placeholder="CATL、BYD、Tesla、LG Energy Solution"
            />
          </div>

          <div>
            <label class="font-semibold text-slate-700 block mb-1 text-[11px]">技术描述与排查诉求</label>
            <textarea
              v-model="requirement"
              rows="3"
              class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white resize-none leading-relaxed"
              placeholder="简述关键技术特征，如流道结构、密封方式、温控策略等..."
            ></textarea>
          </div>

          <!-- 表单底部 -->
          <div class="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <span class="text-[10px] text-slate-400 hidden sm:inline">
              数据源自动关联 CNIPA / USPTO / EPO 数据库
            </span>

            <div class="flex items-center gap-2 ml-auto">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                @click="emit('close')"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>立即启动AI分析</span>
                <ArrowRight class="w-3 h-3" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
