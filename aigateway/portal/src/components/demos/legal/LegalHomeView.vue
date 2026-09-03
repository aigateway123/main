<!-- ============================================================================
     AI 法务员工 · 首页工作台（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/home/HomeView.tsx
     hero + 免责 banner + 4 能力卡 + AI 今日法务情报 5 指标（MOCK_AI_TODAY_STATS）+
     AI 工作记录时间轴（MOCK_AI_WORK_LOGS）+ 3 演示直达 + 待办快览
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import {
  Activity,
  ArrowRight,
  BookOpen,
  Bot,
  ChevronRight,
  Clock,
  FileCheck2,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-vue-next'
import type { LegalView } from '@/data/legalIntelData'
import { MOCK_AI_TODAY_STATS, MOCK_AI_WORK_LOGS } from '@/data/legalMockData'
import LegalDisclaimer from './LegalDisclaimer.vue'

const emit = defineEmits<{
  (e: 'navigate', view: LegalView): void
  (e: 'start-review', contract?: string): void
}>()

// 时间轴节点配色：risk rose / review blue / expire amber / 其余（compliance·regulation）emerald
const dotClass = (type: string): string => {
  if (type === 'risk') return 'bg-rose-500'
  if (type === 'review') return 'bg-blue-500'
  if (type === 'expire') return 'bg-amber-500'
  return 'bg-emerald-500'
}
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- 顶部法律免责提示 -->
    <LegalDisclaimer variant="banner" />

    <!-- Hero Banner -->
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-7 sm:p-9 shadow-lg border border-slate-700/60"
    >
      <div class="relative z-10 max-w-3xl space-y-4">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold"
        >
          <Sparkles class="w-3.5 h-3.5 text-blue-400" />
          <span>XX AI · AI法务员工 企业法律风险智能管理平台</span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
          让AI替企业法务完成第一轮法律工作
        </h1>

        <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          合同审查、风险识别、法规检索、企业合规，一个AI员工全部完成。以前法务需要30分钟甚至1小时阅读的合同，AI几分钟即可完成第一轮审查与示范条款改写。
        </p>

        <div class="pt-2 flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            @click="emit('start-review', '设备采购合同.pdf')"
          >
            <span>开始合同审查</span>
            <ArrowRight class="w-4 h-4" />
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-sm border border-white/20 transition-all cursor-pointer"
            @click="emit('start-review', '设备采购合同.pdf')"
          >
            <span>查看Demo演示（《设备采购合同》）</span>
          </button>
        </div>
      </div>

      <!-- 装饰光晕与 Bot 水印 -->
      <div class="absolute -right-12 -bottom-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
        <Bot class="w-64 h-64 text-white" />
      </div>
    </div>

    <!-- 4 核心能力卡片 -->
    <div>
      <div class="flex items-center justify-between mb-3.5">
        <div>
          <h2 class="text-base font-bold text-slate-100 tracking-tight">四项核心能力</h2>
          <p class="text-xs text-slate-400">专业、严谨、可信的企业级法律科技辅助体系</p>
        </div>
        <span
          class="text-xs text-blue-400 font-medium cursor-pointer hover:underline shrink-0"
          @click="emit('navigate', 'contract-management')"
        >
          查看全部业务模块 →
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 卡 1：合同审查 -->
        <div
          class="group p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between"
          @click="emit('navigate', 'contract-review')"
        >
          <div>
            <div
              class="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-500/25 text-blue-400 flex items-center justify-center mb-3.5 group-hover:bg-blue-600 group-hover:text-white transition-colors"
            >
              <FileCheck2 class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-slate-100 mb-1 group-hover:text-blue-400 transition-colors">
              合同审查
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              上传合同，AI自动识别主体、金额与条款，快速扫描潜在风险并生成修改示范条款。
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-400">
            <span>立即体验审查</span>
            <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <!-- 卡 2：法规检索 -->
        <div
          class="group p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between"
          @click="emit('navigate', 'regulation-search')"
        >
          <div>
            <div
              class="w-10 h-10 rounded-lg bg-cyan-600/15 border border-cyan-500/25 text-cyan-400 flex items-center justify-center mb-3.5 group-hover:bg-cyan-600 group-hover:text-white transition-colors"
            >
              <Search class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-slate-100 mb-1 group-hover:text-cyan-400 transition-colors">
              法规检索
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              输入具体业务痛点或涉外场景，AI快速定位相关法律条文并给出通俗法律合规解释。
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400">
            <span>检索业务法规</span>
            <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <!-- 卡 3：企业合规 -->
        <div
          class="group p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between"
          @click="emit('navigate', 'enterprise-compliance')"
        >
          <div>
            <div
              class="w-10 h-10 rounded-lg bg-indigo-600/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center mb-3.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
            >
              <ShieldCheck class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors">
              企业合规
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              输入企业行业与业务画像，自动生成8大合规维度风险地图及体系化P0/P1整改计划。
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-400">
            <span>生成合规地图</span>
            <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <!-- 卡 4：法律知识库 -->
        <div
          class="group p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between"
          @click="emit('navigate', 'knowledge-base')"
        >
          <div>
            <div
              class="w-10 h-10 rounded-lg bg-emerald-600/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mb-3.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors"
            >
              <BookOpen class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-slate-100 mb-1 group-hover:text-emerald-400 transition-colors">
              法律知识库
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              企业合同模板、规章制度、历史案例集中管理，支持AI基于企业专属知识库精准问答。
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>进入企业知识库</span>
            <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>

    <!-- AI 今日法务情报（5 指标，数据 MOCK_AI_TODAY_STATS） -->
    <div class="bg-slate-900/60 rounded-xl border border-slate-800 p-5 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <Activity class="w-4 h-4 text-blue-400" />
          <h2 class="text-sm font-bold text-slate-100">AI 今日法务情报</h2>
          <span
            class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium border border-slate-700/60"
          >
            数据实时更新中 · 2026-09-03
          </span>
        </div>
        <span class="text-xs text-slate-400">
          AI持续服务企业法务第 <span class="font-semibold text-slate-200">428</span> 天
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <!-- 今日处理合同 -->
        <div class="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div class="text-xs text-slate-400 mb-1">今日处理合同</div>
          <div class="text-2xl font-black text-slate-100 tracking-tight">
            {{ MOCK_AI_TODAY_STATS.todayProcessedContracts }}
            <span class="text-xs font-normal text-slate-400 ml-1">份</span>
          </div>
          <div class="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp class="w-3 h-3" />
            <span>较昨日 +4 份</span>
          </div>
        </div>

        <!-- 发现风险项 -->
        <div class="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div class="text-xs text-slate-400 mb-1">发现风险项</div>
          <div class="text-2xl font-black text-slate-100 tracking-tight">
            {{ MOCK_AI_TODAY_STATS.totalRisksFound }}
            <span class="text-xs font-normal text-slate-400 ml-1">项</span>
          </div>
          <div class="text-[10px] text-slate-500 mt-1">涵盖付款/违约/验收</div>
        </div>

        <!-- 高风险事项 -->
        <div class="p-3.5 rounded-lg bg-rose-950/25 border border-rose-800/40">
          <div class="text-xs text-rose-300 mb-1 font-medium">高风险事项</div>
          <div class="text-2xl font-black text-rose-400 tracking-tight">
            {{ MOCK_AI_TODAY_STATS.highRisksFound }}
            <span class="text-xs font-normal text-rose-300/80 ml-1">项</span>
          </div>
          <div class="text-[10px] text-rose-400 mt-1 font-medium">需法务重点重构</div>
        </div>

        <!-- 即将到期合同 -->
        <div class="p-3.5 rounded-lg bg-amber-950/25 border border-amber-800/40">
          <div class="text-xs text-amber-300 mb-1 font-medium">即将到期合同</div>
          <div class="text-2xl font-black text-amber-400 tracking-tight">
            {{ MOCK_AI_TODAY_STATS.expiringContractsCount }}
            <span class="text-xs font-normal text-amber-300/80 ml-1">份</span>
          </div>
          <div class="text-[10px] text-amber-400 mt-1 font-medium">30天内须续约/处理</div>
        </div>

        <!-- 新增法规情报 -->
        <div class="p-3.5 rounded-lg bg-blue-950/25 border border-blue-800/40 col-span-2 sm:col-span-1">
          <div class="text-xs text-blue-300 mb-1 font-medium">新增法规情报</div>
          <div class="text-2xl font-black text-blue-400 tracking-tight">
            {{ MOCK_AI_TODAY_STATS.newRegulationIntelCount }}
            <span class="text-xs font-normal text-blue-300/80 ml-1">条</span>
          </div>
          <div class="text-[10px] text-blue-400 mt-1 font-medium">涉外贸易与关税监管</div>
        </div>
      </div>
    </div>

    <!-- AI 工作记录 & 快捷直达 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左 2 列：AI 工作记录时间轴（MOCK_AI_WORK_LOGS） -->
      <div class="lg:col-span-2 bg-slate-900/60 rounded-xl border border-slate-800 p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-slate-400" />
            <h2 class="text-sm font-bold text-slate-100">AI 工作记录（实时流水）</h2>
          </div>
          <span class="text-xs text-slate-500">AI正在自动化执行法务工作</span>
        </div>

        <div
          class="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800"
        >
          <div v-for="log in MOCK_AI_WORK_LOGS" :key="log.id" class="relative group">
            <span
              class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-slate-900"
              :class="dotClass(log.type)"
            ></span>
            <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div class="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                {{ log.title }}
              </div>
              <div class="text-[11px] text-slate-500 font-mono shrink-0">{{ log.time }}</div>
            </div>
            <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {{ log.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- 右 1 列：演示直达 + 待办快览 -->
      <div class="bg-slate-900/60 rounded-xl border border-slate-800 p-5 shadow-sm space-y-5">
        <div>
          <h2 class="text-sm font-bold text-slate-100 mb-2">演示场景一键直达</h2>
          <div class="space-y-2">
            <button
              type="button"
              class="w-full text-left p-3 rounded-lg border border-blue-500/30 bg-blue-600/10 hover:bg-blue-600/20 text-xs font-medium text-blue-300 transition-colors flex items-center justify-between cursor-pointer"
              @click="emit('start-review', '设备采购合同.pdf')"
            >
              <div>
                <div class="font-bold text-blue-200">《设备采购合同》完整AI审查链路</div>
                <div class="text-[11px] text-blue-400/90 mt-0.5">包含原条款与建议示范条款对比</div>
              </div>
              <ArrowRight class="w-4 h-4 text-blue-400 shrink-0" />
            </button>

            <button
              type="button"
              class="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors flex items-center justify-between cursor-pointer"
              @click="emit('navigate', 'enterprise-compliance')"
            >
              <div>
                <div class="font-bold text-slate-200">新能源制造出海合规全景排查</div>
                <div class="text-[11px] text-slate-500 mt-0.5">8大合规维度地图与P0整改计划</div>
              </div>
              <ChevronRight class="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            <button
              type="button"
              class="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors flex items-center justify-between cursor-pointer"
              @click="emit('navigate', 'regulation-search')"
            >
              <div>
                <div class="font-bold text-slate-200">储能设备对美出口法律风险检索</div>
                <div class="text-[11px] text-slate-500 mt-0.5">UL标准/EAR管制/产品责任通俗解析</div>
              </div>
              <ChevronRight class="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>

        <!-- 待办任务快览 -->
        <div class="pt-3 border-t border-slate-800">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xs font-bold text-slate-200">待办任务快览</h3>
            <button
              type="button"
              class="text-[11px] text-blue-400 hover:underline cursor-pointer"
              @click="emit('navigate', 'my-tasks')"
            >
              查看全部 (10)
            </button>
          </div>
          <div class="space-y-1.5 text-xs text-slate-300">
            <div
              class="p-2 rounded bg-slate-950/50 border border-slate-800/80 flex items-center justify-between"
            >
              <span class="truncate pr-2">《设备采购合同》重点条款复核</span>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-medium shrink-0 border border-rose-500/30"
              >
                P0 紧急
              </span>
            </div>
            <div
              class="p-2 rounded bg-slate-950/50 border border-slate-800/80 flex items-center justify-between"
            >
              <span class="truncate pr-2">大储供货协议到期续约条款评估</span>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-medium shrink-0 border border-rose-500/30"
              >
                P0 紧急
              </span>
            </div>
            <div
              class="p-2 rounded bg-slate-950/50 border border-slate-800/80 flex items-center justify-between"
            >
              <span class="truncate pr-2">二期厂房租赁合同到期前书面通知</span>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium shrink-0 border border-amber-500/30"
              >
                P1 重要
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
