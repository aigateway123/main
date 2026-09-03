<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/Header.tsx -->
<!-- 白底白卡风格：标题取 IP_VIEW_META[currentView]；资产健康度 78/100；6 步演示 stepper 点击 emit navigate -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bell, ChevronRight, ExternalLink, FileDown, PlusCircle } from 'lucide-vue-next'
import type { AnalysisInput, IpView } from '@/data/ipIntelData'
import { IP_DEMO_STEPS, IP_VIEW_META } from '@/data/ipIntelData'
import { MOCK_INTELLIGENCE } from '@/data/ipMockData'

const props = defineProps<{
  currentView: IpView
  analysisInput: AnalysisInput
}>()

const emit = defineEmits<{
  (e: 'navigate', view: IpView): void
  (e: 'export-report'): void
  (e: 'open-new-analysis'): void
}>()

// 通知下拉开关（本地状态）
const notificationsOpen = ref(false)

// 当前视图标题/副题
const meta = computed(() => IP_VIEW_META[props.currentView])

// 标的 pill：仅非 home / workflow / overview 视图展示
const showTargetPill = computed(
  () => props.currentView !== 'home' && props.currentView !== 'workflow' && props.currentView !== 'overview',
)

// 副题：overview 视图展示当前分析标的摘要，其余展示视图副题
const subtitleText = computed(() =>
  props.currentView === 'overview'
    ? `目标市场：${props.analysisInput.targetMarkets.join('、')} | 核心竞品：${props.analysisInput.competitors.join(', ')}`
    : meta.value.subtitle,
)

const navigate = (view: IpView) => emit('navigate', view)
const exportReport = () => emit('export-report')
const openNewAnalysis = () => emit('open-new-analysis')

// 点击通知条目 → 跳转实时雷达视图并关闭下拉
const jumpToRadar = () => {
  notificationsOpen.value = false
  navigate('radar')
}
</script>

<template>
  <header
    class="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-sm shrink-0 min-w-0"
  >
    <div class="flex items-center justify-between w-full gap-3">
      <!-- 左侧：标题 + AI Agent pill + 标的 pill -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none truncate">
              {{ meta.title }}
            </h1>
            <span
              class="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded shrink-0"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              AI Agent 在线
            </span>
          </div>
          <p class="text-[11px] text-slate-500 truncate mt-1">{{ subtitleText }}</p>
        </div>

        <!-- 当前分析标的 pill（industry · product） -->
        <div
          v-if="showTargetPill"
          class="hidden 2xl:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-600 shrink-0"
        >
          <span class="text-slate-400 text-[11px]">标的:</span>
          <span class="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80 text-[11px]">
            {{ analysisInput.industry }} · {{ analysisInput.product }}
          </span>
        </div>
      </div>

      <!-- 右侧：健康度 / stepper / 通知 / CTA -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- 资产健康度指标卡 -->
        <div class="hidden md:flex flex-col items-end pr-3 border-r border-slate-200">
          <span class="text-[10px] text-slate-400 font-medium leading-tight">资产健康度</span>
          <span class="text-base font-black text-amber-500 leading-tight">
            78 <small class="text-[10px] font-normal text-slate-400">/ 100</small>
          </span>
        </div>

        <!-- 6 步演示闭环 stepper（点击跳转对应视图） -->
        <div class="hidden xl:flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/70 text-[11px]">
          <button
            v-for="(step, idx) in IP_DEMO_STEPS"
            :key="step.view"
            type="button"
            class="px-2 py-1 rounded transition-all font-medium flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
            :class="
              currentView === step.view
                ? 'bg-white text-blue-700 font-bold shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            "
            @click="navigate(step.view)"
          >
            {{ step.label }}
            <ChevronRight
              v-if="idx < IP_DEMO_STEPS.length - 1"
              class="w-2.5 h-2.5 text-slate-400 ml-0.5"
            />
          </button>
        </div>

        <!-- 通知铃铛下拉（今日情报预警，前 4 条） -->
        <div class="relative">
          <button
            type="button"
            class="relative p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="今日情报与预警"
            @click="notificationsOpen = !notificationsOpen"
          >
            <Bell class="w-4 h-4" />
            <span class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          </button>

          <div
            v-if="notificationsOpen"
            class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50"
          >
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Bell class="w-4 h-4 text-blue-600" />
                <span>今日知识产权情报通知</span>
              </div>
              <span class="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                3 条高优预警
              </span>
            </div>

            <div class="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
              <div
                v-for="item in MOCK_INTELLIGENCE.slice(0, 4)"
                :key="item.id"
                class="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-200 cursor-pointer transition-all text-xs"
                @click="jumpToRadar"
              >
                <div class="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span class="font-semibold text-slate-700">{{ item.competitor }}</span>
                  <span>{{ item.time }}</span>
                </div>
                <p class="font-medium text-slate-900">{{ item.title }}</p>
                <p class="text-slate-500 text-[11px] mt-1 line-clamp-1">{{ item.recommendation }}</p>
              </div>
            </div>

            <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                @click="jumpToRadar"
              >
                <span>查看完整情报雷达</span>
                <ExternalLink class="w-3 h-3" />
              </button>
              <button
                type="button"
                class="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                @click="notificationsOpen = false"
              >
                关闭
              </button>
            </div>
          </div>
        </div>

        <!-- 导出报告 CTA -->
        <button
          type="button"
          id="export-report-btn"
          class="flex items-center gap-1 px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-300 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
          title="生成并下载知识产权报告"
          @click="exportReport"
        >
          <FileDown class="w-3.5 h-3.5 text-slate-500" />
          <span class="hidden sm:inline">导出报告</span>
        </button>

        <!-- 生成战略报告主 CTA -->
        <button
          type="button"
          id="generate-strategy-report-btn"
          class="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-blue-200/60 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          @click="navigate('report')"
        >
          <span>生成战略报告</span>
        </button>

        <!-- 新建分析 CTA -->
        <button
          type="button"
          id="new-analysis-btn"
          class="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
          title="新建知识产权分析项目"
          @click="openNewAnalysis"
        >
          <PlusCircle class="w-3.5 h-3.5 text-slate-500" />
          <span>新建分析</span>
        </button>
      </div>
    </div>
  </header>
</template>
