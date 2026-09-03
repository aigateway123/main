<script setup lang="ts">
// ============================================================================
// 知识产权 · AI 知识产权顾问 —— 风险白盒比对详情弹窗
// 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/RiskDetailModal.tsx
// props: { risk: RiskItem } —— emits: close
// 内容：AI 侵权风险综述（企业方案 vs 专利方案）+ 技术特征白盒对比表 +
//       AI 建议应对策略与工程规避路径
// ============================================================================
import { onBeforeUnmount, ref } from 'vue'
import { AlertTriangle, Check, Copy, Scale, ShieldCheck, Sparkles, X } from 'lucide-vue-next'
import type { RiskLevel, RiskItem, TechnicalFeatureComparison } from '@/data/ipIntelData'

const props = defineProps<{
  risk: RiskItem
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

// ---- 复制建议状态 ----
const copied = ref(false)
let copyTimer: number | undefined

const copyAdvice = async () => {
  try {
    await navigator.clipboard.writeText(`${props.risk.title}\nAI分析建议：${props.risk.detailedAction}`)
    copied.value = true
    window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // 剪贴板不可用（非安全上下文等）时静默降级
  }
}

onBeforeUnmount(() => {
  window.clearTimeout(copyTimer)
})

// ---- 风险等级徽章（弹窗头，🔴/🟠/🟢） ----
const riskBadgeMeta: Record<RiskLevel, { label: string; className: string }> = {
  high: { label: '🔴 高风险', className: 'bg-rose-100 text-rose-800 border-rose-200' },
  medium: { label: '🟠 中风险', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  low: { label: '🟢 低风险', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
}

// ---- 综述头部「风险判断」文案 ----
const riskLevelMeta: Record<RiskLevel, { text: string; className: string }> = {
  high: { text: '高', className: 'text-rose-600' },
  medium: { text: '中', className: 'text-amber-600' },
  low: { text: '低', className: 'text-slate-600' },
}

// ---- 相似度文字配色（≥85 高/≥70 中/其余低） ----
const similarityTextClass = (similarity: number) => {
  if (similarity >= 85) return 'text-rose-600'
  if (similarity >= 70) return 'text-amber-600'
  return 'text-slate-600'
}

// ---- 单特征侵权风险徽章 ----
const featureRiskMeta: Record<RiskLevel, { text: string; className: string }> = {
  high: { text: '高度疑似', className: 'bg-rose-100 text-rose-700' },
  medium: { text: '等同可能', className: 'bg-amber-100 text-amber-700' },
  low: { text: '差异显著', className: 'bg-emerald-100 text-emerald-700' },
}

const featureRiskOf = (fc: TechnicalFeatureComparison) => featureRiskMeta[fc.infringementRisk]

// ---- 加入 FTO 规避清单（原型 alert 占位） ----
const addToFtoList = () => {
  window.alert(`已为 ${props.risk.relatedPatentId} 启动深入规避设计检索任务，并生成技术交底比对记录。`)
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto">
        <!-- 弹窗头部 -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-start justify-between bg-slate-50/70 rounded-t-2xl">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                :class="riskBadgeMeta[risk.riskLevel].className"
              >
                {{ riskBadgeMeta[risk.riskLevel].label }}
              </span>
              <span class="text-xs text-slate-500 font-medium">所属领域：{{ risk.technicalField }}</span>
              <span class="text-xs text-slate-400">|</span>
              <span class="text-xs text-slate-500 font-mono">专利号：{{ risk.relatedPatentId }}</span>
            </div>
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">{{ risk.title }}</h2>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-[11px] text-slate-400 font-semibold block">AI风险评分</span>
              <span class="text-xl font-extrabold font-mono text-rose-600">
                {{ risk.riskScore }} <span class="text-xs font-normal text-slate-400">/ 100</span>
              </span>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors ml-2 cursor-pointer"
              @click="emit('close')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- 弹窗主体 -->
        <div class="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          <!-- 合规免责声明 -->
          <div class="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold text-amber-950">
                合规免责声明：本分析仅用于技术特征比对与决策辅助，不构成法律意见或侵权结论。
              </p>
              <p class="text-amber-800/80 mt-0.5">
                请由具备执业资质的专利代理师进一步核实涉案专利的权利要求书、审查历史档案(File Wrapper)及有效性状态。
              </p>
            </div>
          </div>

          <!-- AI 侵权风险综述：企业方案 vs 专利方案 -->
          <div class="bg-slate-50/80 rounded-xl p-5 border border-slate-200/80 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles class="w-4 h-4 text-blue-600" />
                <span>AI智能侵权风险综述</span>
              </h3>
              <div class="flex items-center gap-4 text-xs">
                <span class="text-slate-500">
                  技术相关度：<strong class="text-slate-900 font-mono">{{ risk.techSimilarity }}%</strong>
                </span>
                <span class="text-slate-500">
                  权利要求重合度：<strong class="text-rose-600 font-mono">{{ risk.claimOverlap }}%</strong>
                </span>
                <span class="text-slate-500">
                  风险判断：<strong class="font-bold" :class="riskLevelMeta[risk.riskLevel].className">{{ riskLevelMeta[risk.riskLevel].text }}</strong>
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 企业当前技术方案 -->
              <div class="p-4 bg-white rounded-xl border border-slate-200/80">
                <span class="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  企业当前技术方案
                </span>
                <p class="text-xs text-slate-800 leading-relaxed font-medium">
                  {{ risk.enterpriseScheme }}
                </p>
              </div>

              <!-- 涉案专利方案 -->
              <div class="p-4 bg-white rounded-xl border border-slate-200/80">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                    涉案专利方案 ({{ risk.relatedPatentId }})
                  </span>
                  <span class="text-[11px] text-slate-400 font-medium">{{ risk.patentApplicant }}</span>
                </div>
                <p class="text-xs text-slate-800 leading-relaxed font-medium">
                  {{ risk.patentScheme }}
                </p>
              </div>
            </div>
          </div>

          <!-- 技术特征白盒对比表 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <Scale class="w-4 h-4 text-blue-600" />
                <span>技术特征白盒对比表 (全面覆盖原则判定)</span>
              </h3>
              <span class="text-xs text-slate-500 font-medium">以字面侵权与等同原则为基准</span>
            </div>

            <div v-if="risk.featureComparisons.length > 0" class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                    <th class="py-3 px-3 w-28">技术特征</th>
                    <th class="py-3 px-3 w-48">企业方案</th>
                    <th class="py-3 px-3 w-48">涉案专利方案</th>
                    <th class="py-3 px-3 w-24 text-center">相似程度</th>
                    <th class="py-3 px-3">关键差异及等同性分析</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="(fc, idx) in risk.featureComparisons" :key="idx" class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3 px-3 font-semibold text-slate-900 align-top">
                      {{ fc.featureName }}
                    </td>
                    <td class="py-3 px-3 text-slate-700 align-top bg-blue-50/20">
                      {{ fc.enterpriseSolution }}
                    </td>
                    <td class="py-3 px-3 text-slate-700 align-top bg-rose-50/20">
                      {{ fc.patentSolution }}
                    </td>
                    <td class="py-3 px-3 text-center align-top">
                      <div class="inline-flex flex-col items-center">
                        <span class="font-mono font-bold text-sm" :class="similarityTextClass(fc.similarity)">
                          {{ fc.similarity }}%
                        </span>
                        <span
                          class="text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5"
                          :class="featureRiskOf(fc).className"
                        >
                          {{ featureRiskOf(fc).text }}
                        </span>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-slate-600 align-top leading-relaxed">
                      {{ fc.keyDifference }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              本项风险技术特征已完成初筛比对，正在等待深度独立权利要求拆解。
            </div>
          </div>

          <!-- AI 可执行建议 -->
          <div class="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-blue-700" />
                <span>AI建议应对策略与工程规避路径</span>
              </span>
              <button
                type="button"
                class="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 cursor-pointer"
                @click="copyAdvice"
              >
                <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copied ? '已复制' : '复制建议' }}</span>
              </button>
            </div>
            <p class="text-xs text-slate-800 leading-relaxed font-medium">
              {{ risk.detailedAction }}
            </p>
          </div>
        </div>

        <!-- 弹窗底部 -->
        <div class="px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 rounded-b-2xl flex items-center justify-between">
          <div class="text-xs text-slate-500 flex items-center gap-2">
            <span>法律状态：{{ risk.legalStatus }}</span>
            <span>·</span>
            <span>有效期至：{{ risk.validUntil }}</span>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              @click="emit('close')"
            >
              关闭
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              @click="addToFtoList"
            >
              加入FTO规避清单
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
