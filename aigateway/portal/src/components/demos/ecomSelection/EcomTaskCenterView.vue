<!-- 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/tasks/TaskCenterView.tsx -->
<!-- 移植：任务数据改用数据层 ECOM_TASK_LOGS（原型硬编码 3 条），增加耗时/状态/推荐结论列 -->
<script setup lang="ts">
import { Clock, FileSearch, ListTodo, Sparkles, TrendingUp } from 'lucide-vue-next'
import type { AgentTaskLog } from '@/data/ecomIntelData'
import { ECOM_TASK_LOGS } from '@/data/ecomIntelData'

const emit = defineEmits<{
  (e: 'view-report'): void
  (e: 'open-new-task'): void
}>()

const tasks: AgentTaskLog[] = ECOM_TASK_LOGS

const viewReport = () => emit('view-report')
const openNewTask = () => emit('open-new-task')

// 从推荐结论文案中提取分数，如 "便携防漏大容量宠物随行水杯 (92分)" → 92
const extractScore = (text: string): number | null => {
  const matched = text.match(/\((\d+)\s*分\)/)
  return matched ? Number(matched[1]) : null
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8 min-h-full">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div
          class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2"
        >
          <Clock class="w-3.5 h-3.5" />
          <span>AI 异步调研任务执行历史与归档</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          任务中心 (AI Intelligence Task Center)
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          查看所有历史派发给 AI 选品情报员的调研工单、生成报告及机会池
        </p>
      </div>

      <button
        type="button"
        class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
        @click="openNewTask"
      >
        <Sparkles class="w-4 h-4" />
        <span>新建选品调研任务</span>
      </button>
    </div>

    <!-- Task List -->
    <div v-if="tasks.length > 0" class="space-y-4">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition"
      >
        <div class="p-5 space-y-4">
          <!-- Title Row -->
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
            <div class="flex items-start gap-3 min-w-0">
              <div
                class="w-9 h-9 rounded-lg bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center shrink-0"
              >
                <ListTodo class="w-5 h-5 text-indigo-400" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-bold text-white text-sm">{{ task.taskName }}</h3>
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  >
                    <Sparkles class="w-2.5 h-2.5" />
                    已完成
                  </span>
                </div>
                <p class="text-[11px] text-slate-400 mt-1 font-mono">
                  {{ task.targetMarket }} · {{ task.platform }} · {{ task.category }} ·
                  耗时 {{ task.duration }}
                </p>
              </div>
            </div>

            <div class="text-[11px] text-slate-500 font-mono shrink-0">
              创建时间: {{ task.timestamp }}
            </div>
          </div>

          <!-- Stats Row -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div class="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div class="text-[10px] text-slate-500">预算规模</div>
              <div class="mt-0.5 font-mono font-bold text-emerald-400">{{ task.budget }}</div>
            </div>
            <div class="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div class="text-[10px] text-slate-500">扫描产品</div>
              <div class="mt-0.5 font-mono font-bold text-slate-200">
                {{ task.productsFound.toLocaleString() }} 款
              </div>
            </div>
            <div class="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div class="text-[10px] text-slate-500">发现机会</div>
              <div class="mt-0.5 font-mono font-bold text-cyan-400">
                {{ task.opportunitiesFound }} 个
              </div>
            </div>
            <div class="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div class="text-[10px] text-slate-500">最高机会分</div>
              <div class="mt-0.5 font-mono font-bold text-amber-400">
                {{ extractScore(task.topRecommendation) ?? '--' }} / 100
              </div>
            </div>
          </div>

          <!-- Recommendation & Action Row -->
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1"
          >
            <div class="flex items-center gap-2 text-xs min-w-0">
              <TrendingUp class="w-4 h-4 text-indigo-400 shrink-0" />
              <span class="text-slate-400 shrink-0">AI 推荐结论:</span>
              <span class="text-slate-200 font-medium truncate">{{ task.topRecommendation }}</span>
            </div>

            <button
              type="button"
              class="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-semibold transition cursor-pointer shrink-0"
              @click="viewReport"
            >
              <FileSearch class="w-3.5 h-3.5" />
              <span>查看选品报告</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Fallback -->
    <div
      v-else
      class="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl py-16 text-center text-sm text-slate-400"
    >
      暂无历史任务，点击右上角「新建选品调研任务」开始第一次 AI 选品。
    </div>
  </div>
</template>
