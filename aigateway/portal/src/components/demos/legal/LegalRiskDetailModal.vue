<!-- ============================================================================
     AI 法务员工 · 风险白盒详情弹窗（单条风险）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/review/RiskDetailModal.tsx
     props: { open; risk: RiskItem | null; isAddedToReport? } —— emits: close / add-to-report
     内容：原条款文本 / AI 法律风险分析与判断（含严重法律后果）/ AI 谈判修改策略 /
           AI 建议示范条款（可直接复制加入补充协议）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import {
  Check,
  CheckCircle2,
  Copy,
  FileEdit,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-vue-next'
import type { RiskItem, RiskLevel } from '@/data/legalIntelData'

const props = defineProps<{
  open: boolean
  risk: RiskItem | null
  isAddedToReport?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-to-report', riskId: string): void
}>()

// ---- 复制状态（2s 后还原） ----
const copied = ref(false)
const added = ref(!!props.isAddedToReport)
let copyTimer: ReturnType<typeof setTimeout> | undefined

// 打开时以「父级是否已加入报告」为准重置本地产按钮态
watch(
  () => props.open,
  (v) => {
    if (v) added.value = !!props.isAddedToReport
  },
)

const handleCopy = async () => {
  if (!props.risk) return
  try {
    await navigator.clipboard.writeText(
      `【原条款】\n${props.risk.originalClause}\n\n【AI修改建议】\n${props.risk.suggestion}\n\n【AI建议示范条款】\n${props.risk.recommendedClause}`,
    )
    copied.value = true
    window.clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // 剪贴板不可用（非安全上下文）时静默降级
  }
}

const handleAdd = () => {
  if (!props.risk) return
  added.value = true
  emit('add-to-report', props.risk.id)
}

onBeforeUnmount(() => {
  window.clearTimeout(copyTimer)
})

// ---- 风险等级样式映射（照原型） ----
const levelDotClass = (lvl: RiskLevel): string => {
  if (lvl === 'high') return 'bg-rose-500 ring-4 ring-rose-500/20'
  if (lvl === 'medium') return 'bg-amber-500 ring-4 ring-amber-500/20'
  return 'bg-emerald-500 ring-4 ring-emerald-500/20'
}

const levelBadgeClass = (lvl: RiskLevel): string => {
  if (lvl === 'high') return 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
  if (lvl === 'medium') return 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
  return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
}

const levelLabel = (lvl: RiskLevel): string => {
  if (lvl === 'high') return '高风险'
  if (lvl === 'medium') return '中风险'
  return '低风险'
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && risk"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-[2px] animate-in fade-in duration-200"
      @click.self="emit('close')"
    >
      <div
        class="bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-800 max-h-[90vh] flex flex-col overflow-hidden"
      >
        <!-- 弹窗头部 -->
        <div
          class="px-6 py-4 bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800"
        >
          <div class="flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full shrink-0" :class="levelDotClass(risk.riskLevel)" />
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-base font-bold tracking-tight text-slate-100">
                  {{ risk.clauseIndex }} · {{ risk.title }}
                </h2>
                <span
                  class="text-[11px] px-2 py-0.5 rounded-full font-bold"
                  :class="levelBadgeClass(risk.riskLevel)"
                >
                  {{ levelLabel(risk.riskLevel) }} · 评分 {{ risk.score }}/100
                </span>
                <span
                  class="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                >
                  优先级 {{ risk.priority }}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                所属分类：{{ risk.category }} · 条款标题：{{ risk.clauseTitle }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            @click="emit('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- 可滚动内容 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 legal-custom-scrollbar bg-slate-900">
          <!-- 1. 原合同条款 -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-slate-500" />
                原合同条款文本
              </span>
              <span class="text-[11px] text-slate-500 font-mono">{{ risk.clauseIndex }}</span>
            </div>
            <div
              class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap"
            >
              {{ risk.originalClause }}
            </div>
          </div>

          <!-- 2. AI 法律风险分析 -->
          <div class="space-y-3 p-4 rounded-xl bg-rose-950/25 border border-rose-800/40">
            <div class="flex items-center gap-2 text-xs font-bold text-rose-300">
              <ShieldAlert class="w-4 h-4 text-rose-400" />
              <span>AI 法律风险分析与判断</span>
            </div>
            <div class="text-xs sm:text-sm text-rose-200 leading-relaxed font-medium">
              {{ risk.aiAnalysis }}
            </div>

            <div v-if="risk.impactPoints && risk.impactPoints.length > 0" class="pt-2 border-t border-rose-800/40 space-y-1.5">
              <div class="text-xs font-bold text-rose-300">可能导致的严重法律后果：</div>
              <div class="space-y-1">
                <div
                  v-for="(pt, i) in risk.impactPoints"
                  :key="i"
                  class="flex items-start gap-2 text-xs text-rose-200/90"
                >
                  <span class="font-bold text-rose-400 shrink-0">{{ i + 1 }}.</span>
                  <span>{{ pt }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. AI 谈判修改策略 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-xs font-bold text-blue-300">
              <Sparkles class="w-4 h-4 text-blue-400" />
              <span>AI 谈判修改策略建议</span>
            </div>
            <div
              class="p-3.5 rounded-xl bg-blue-950/25 border border-blue-800/40 text-xs sm:text-sm text-blue-200 font-medium leading-relaxed"
            >
              {{ risk.suggestion }}
            </div>
          </div>

          <!-- 4. AI 建议示范条款 -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <FileEdit class="w-4 h-4 text-emerald-400" />
                AI 建议示范条款（可直接复制加入补充协议）
              </span>
              <span
                class="text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded font-medium"
              >
                买方权益平衡版本
              </span>
            </div>
            <div
              class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs sm:text-sm text-emerald-100 font-mono leading-relaxed whitespace-pre-wrap"
            >
              {{ risk.recommendedClause }}
            </div>
          </div>
        </div>

        <!-- 底部操作 -->
        <div
          class="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0"
        >
          <div class="text-[11px] text-slate-400">
            建议由企业法务部或主办律师结合谈判地位进一步复核
          </div>
          <div class="flex items-center gap-2.5">
            <button
              type="button"
              @click="handleCopy"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-700/80 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5 text-slate-400" />
              <span v-if="copied" class="text-emerald-400">已复制到剪贴板</span>
              <span v-else>复制修改建议</span>
            </button>

            <button
              type="button"
              :disabled="added"
              @click="handleAdd"
              :class="[
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer',
                added
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                  : 'bg-blue-600 hover:bg-blue-500 text-white',
              ]"
            >
              <CheckCircle2 v-if="added" class="w-3.5 h-3.5 text-emerald-400" />
              <PlusCircle v-else class="w-3.5 h-3.5" />
              <span>{{ added ? '已加入审查报告' : '加入审查报告' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
