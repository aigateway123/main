<!-- ============================================================================
     AI 法务员工 · 企业法律审查与合规报告库（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/reports/LegalReportsView.tsx
     报告卡片：照原型硬编码 4 份归档（原型即组件内静态数组）
     调阅/导出弹层：照原型 ReportModal 主体（数据 DEFAULT_EQUIPMENT_REVIEW_DATA），
     内嵌实现以遵守“仅新建 8 个文件”约束；导出/分享为前端态模拟（无真实下载副作用）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Check, Download, Eye, FileText, Printer, Share2, X } from 'lucide-vue-next'
import { DEFAULT_EQUIPMENT_REVIEW_DATA, LEGAL_DISCLAIMER_TEXT } from '@/data/legalMockData'

// 报告归档清单（照原型字段与文案逐字）
interface ReportArchive {
  id: string
  title: string
  target: string
  type: string
  date: string
  riskScore: number
  riskLevel: string
  size: string
  author: string
}

const REPORTS: ReportArchive[] = [
  {
    id: 'rep-01',
    title: '《设备采购合同AI审查报告》',
    target: '昆山创捷精工智能装备科技有限公司',
    type: '合同审查报告',
    date: '2026-09-03 09:12',
    riskScore: 68,
    riskLevel: '中高风险',
    size: '2.8 MB',
    author: 'AI法务员工 v3.2',
  },
  {
    id: 'rep-02',
    title: '《企业出海及关税合规全景专项报告》',
    target: '新能源与海外事业部',
    type: '合规专项诊断',
    date: '2026-09-02 16:40',
    riskScore: 74,
    riskLevel: '中风险',
    size: '4.1 MB',
    author: 'AI合规助手',
  },
  {
    id: 'rep-03',
    title: '《高端销售协议履约异议法律意见备忘录》',
    target: '某海外分销商集团',
    type: '争议备忘录',
    date: '2026-08-30 11:15',
    riskScore: 52,
    riskLevel: '中风险',
    size: '1.9 MB',
    author: 'AI法务员工 v3.2',
  },
  {
    id: 'rep-04',
    title: '《核心员工竞业限制与知识产权合规排查清单》',
    target: '人力资源与技术研发中心',
    type: '人事合规报告',
    date: '2026-08-28 14:20',
    riskScore: 62,
    riskLevel: '中风险',
    size: '3.2 MB',
    author: 'AI合规助手',
  },
]

const modalOpen = ref(false)
const copiedShare = ref(false)
const downloadToast = ref<string | null>(null)
const shareTimer = ref<ReturnType<typeof setTimeout> | null>(null)
let toastTimer1: ReturnType<typeof setTimeout> | null = null
let toastTimer2: ReturnType<typeof setTimeout> | null = null

const openModal = () => {
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  if (toastTimer1) clearTimeout(toastTimer1)
  if (toastTimer2) clearTimeout(toastTimer2)
  downloadToast.value = null
}

const handleShare = () => {
  const d = DEFAULT_EQUIPMENT_REVIEW_DATA
  navigator.clipboard.writeText(
    `【XX AI · AI法务员工】《合同AI审查报告》已生成\n合同名称：${d.contractTitle}\n综合风险评分：${d.overallScore}/100（${d.overallRiskLevel}）\n审查结论：${d.reviewConclusion.overallVerdict}\n点击进入企业法律风险平台查看全文与示范条款。`,
  )
  copiedShare.value = true
  if (shareTimer.value) clearTimeout(shareTimer.value)
  shareTimer.value = setTimeout(() => {
    copiedShare.value = false
  }, 2500)
}

const handleExportWord = () => {
  downloadToast.value = '正在打包《合同AI审查报告.docx》，已启动模拟下载...'
  if (toastTimer1) clearTimeout(toastTimer1)
  toastTimer1 = setTimeout(() => {
    downloadToast.value = '下载完成！已保存为《设备采购合同AI审查报告-XX-AI.docx》'
    if (toastTimer2) clearTimeout(toastTimer2)
    toastTimer2 = setTimeout(() => {
      downloadToast.value = null
    }, 3000)
  }, 1500)
}

const handlePrintOrPdf = () => {
  downloadToast.value = '已生成PDF报告排版，正在调用系统打印/导出PDF引擎...'
  if (toastTimer1) clearTimeout(toastTimer1)
  toastTimer1 = setTimeout(() => {
    downloadToast.value = null
  }, 1500)
}

onBeforeUnmount(() => {
  if (shareTimer.value) clearTimeout(shareTimer.value)
  if (toastTimer1) clearTimeout(toastTimer1)
  if (toastTimer2) clearTimeout(toastTimer2)
})
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="border-b border-slate-800 pb-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-500" />
        <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          法务文档输出中心
        </span>
      </div>
      <h1 class="text-2xl font-bold text-slate-100 tracking-tight mt-1">
        企业法律审查与合规报告库
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">
        全量留存AI出具的合同初审报告、合规白皮书及涉法备忘录，支持随时在线调阅与PDF/Word导出
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="rep in REPORTS"
        :key="rep.id"
        class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs px-2.5 py-0.5 rounded bg-blue-950/60 text-blue-300 font-semibold border border-blue-800/60">
              {{ rep.type }}
            </span>
            <span
              class="text-[11px] px-2 py-0.5 rounded font-bold"
              :class="rep.riskScore > 70 ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50' : 'bg-amber-950/60 text-amber-300 border border-amber-800/50'"
            >
              {{ rep.riskLevel }} · 评分 {{ rep.riskScore }}/100
            </span>
          </div>
          <h3 class="text-base font-bold text-slate-100">{{ rep.title }}</h3>
          <p class="text-xs text-slate-400 mt-1">
            审查对象 / 部门：{{ rep.target }}
          </p>
          <div class="text-[11px] text-slate-500 font-mono mt-1">
            生成时间：{{ rep.date }} · 审查执行：{{ rep.author }}
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span class="text-xs text-slate-400 font-mono">{{ rep.size }}</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openModal"
              class="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Eye class="w-3.5 h-3.5" />
              <span>调阅全文</span>
            </button>
            <button
              type="button"
              @click="openModal"
              class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Download class="w-3.5 h-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 调阅全文弹层（数据：DEFAULT_EQUIPMENT_REVIEW_DATA） -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-[2px] animate-in fade-in duration-200"
    >
      <div class="bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-800 max-h-[92vh] flex flex-col overflow-hidden">
        <!-- Modal Top Bar -->
        <div class="px-6 py-4 bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileText class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-base font-bold tracking-tight text-slate-100">
                《合同AI审查报告》
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                企业法务智能审查标准格式 · 编号：AR-2026-0903-EQ88
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="handleShare"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
            >
              <template v-if="copiedShare">
                <Check class="w-3.5 h-3.5 text-emerald-400" />
                <span class="text-emerald-300">已复制分享链接</span>
              </template>
              <template v-else>
                <Share2 class="w-3.5 h-3.5 text-slate-400" />
                <span>分享报告</span>
              </template>
            </button>

            <button
              type="button"
              @click="handleExportWord"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
            >
              <Download class="w-3.5 h-3.5 text-slate-400" />
              <span>导出 Word</span>
            </button>

            <button
              type="button"
              @click="handlePrintOrPdf"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>导出 PDF / 打印</span>
            </button>

            <button
              type="button"
              @click="closeModal"
              class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Toast alert banner -->
        <div
          v-if="downloadToast"
          class="bg-blue-600 text-white px-6 py-2 text-xs font-medium flex items-center justify-between shrink-0 animate-in fade-in"
        >
          <span>{{ downloadToast }}</span>
          <button type="button" class="text-white/80 hover:text-white cursor-pointer" @click="downloadToast = null">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Printable Report Document Body -->
        <div class="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-950/70 legal-custom-scrollbar">
          <div class="bg-slate-900 max-w-3xl mx-auto p-8 sm:p-12 rounded-xl shadow-xl border border-slate-800 space-y-8 text-slate-200">
            <!-- Report Header -->
            <div class="border-b-2 border-slate-800 pb-6 space-y-2">
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span class="font-semibold text-slate-300">XX AI · 企业法律风险智能管理平台</span>
                <span>报告生成日期：2026年09月03日</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight text-center pt-2">
                《合同AI审查报告》
              </h1>
              <p class="text-xs text-center text-slate-400">
                标的合同：{{ DEFAULT_EQUIPMENT_REVIEW_DATA.contractTitle }}
              </p>
            </div>

            <!-- Legal Notice -->
            <div class="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 leading-relaxed">
              <span class="font-bold">特别提示：</span>
              {{ LEGAL_DISCLAIMER_TEXT }}
            </div>

            <!-- Chapter 1: 合同基本信息 -->
            <section class="space-y-3">
              <h2 class="text-base font-bold text-slate-100 border-l-4 border-blue-500 pl-2.5">
                一、合同基本信息
              </h2>
              <div class="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                <div>
                  <span class="text-slate-400">甲方（买方）：</span>
                  <span class="font-semibold text-slate-200">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.partyA }}</span>
                </div>
                <div>
                  <span class="text-slate-400">乙方（卖方）：</span>
                  <span class="font-semibold text-slate-200">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.partyB }}</span>
                </div>
                <div>
                  <span class="text-slate-400">合同类型：</span>
                  <span class="font-semibold text-slate-200">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.contractType }}</span>
                </div>
                <div>
                  <span class="text-slate-400">标的总金额：</span>
                  <span class="font-bold text-blue-400">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.contractAmount }}</span>
                </div>
                <div>
                  <span class="text-slate-400">履约期限：</span>
                  <span class="font-semibold text-slate-200">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.contractDuration }}</span>
                </div>
                <div>
                  <span class="text-slate-400">审查时间：</span>
                  <span class="font-semibold text-slate-200">2026-09-03 09:12（耗时 2分18秒）</span>
                </div>
              </div>
            </section>

            <!-- Chapter 2: 合同核心条款摘要 -->
            <section class="space-y-3">
              <h2 class="text-base font-bold text-slate-100 border-l-4 border-blue-500 pl-2.5">
                二、合同核心条款摘要
              </h2>
              <div class="border border-slate-800 rounded-lg overflow-hidden text-xs">
                <div class="divide-y divide-slate-800">
                  <div class="bg-slate-950/40 px-4 py-2.5">
                    <span class="font-semibold text-slate-400 w-32 inline-block">付款方式</span>
                    <span class="text-slate-200">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.paymentMethod }}</span>
                  </div>
                  <div class="px-4 py-2.5">
                    <span class="font-semibold text-slate-400 w-32 inline-block">交付周期</span>
                    <span class="text-slate-200">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.deliveryPeriod }}</span>
                  </div>
                  <div class="bg-slate-950/40 px-4 py-2.5">
                    <span class="font-semibold text-slate-400 w-32 inline-block">违约责任约定</span>
                    <span class="text-slate-200">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.breachPenalty }}</span>
                  </div>
                  <div class="px-4 py-2.5">
                    <span class="font-semibold text-slate-400 w-32 inline-block">争议解决方式</span>
                    <span class="text-slate-200">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.disputeResolution }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Chapter 3: 风险总览 -->
            <section class="space-y-3">
              <h2 class="text-base font-bold text-slate-100 border-l-4 border-blue-500 pl-2.5">
                三、风险总览与评分
              </h2>
              <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div class="text-xs text-slate-400">AI 合同法律风险综合评分</div>
                  <div class="flex items-baseline gap-2 mt-1">
                    <span class="text-3xl font-black text-rose-500 font-mono">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.overallScore }}</span>
                    <span class="text-sm font-semibold text-slate-500">/ 100</span>
                    <span class="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold ml-2 border border-rose-500/30">
                      {{ DEFAULT_EQUIPMENT_REVIEW_DATA.overallRiskLevel }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-4 text-center">
                  <div class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div class="text-[11px] text-slate-400">总识别条款</div>
                    <div class="text-sm font-bold text-slate-200 font-mono">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.totalClauses }} 条</div>
                  </div>
                  <div class="px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/40">
                    <div class="text-[11px] text-rose-300">高风险</div>
                    <div class="text-sm font-bold text-rose-400 font-mono">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.highRiskCount }} 项</div>
                  </div>
                  <div class="px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
                    <div class="text-[11px] text-amber-300">中风险</div>
                    <div class="text-sm font-bold text-amber-400 font-mono">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.mediumRiskCount }} 项</div>
                  </div>
                  <div class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div class="text-[11px] text-slate-400">低风险</div>
                    <div class="text-sm font-bold text-slate-300 font-mono">{{ DEFAULT_EQUIPMENT_REVIEW_DATA.lowRiskCount }} 项</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Chapter 4: 高风险事项 -->
            <section class="space-y-3">
              <h2 class="text-base font-bold text-slate-100 border-l-4 border-rose-500 pl-2.5">
                四、高风险事项详析（P0级 重点突破）
              </h2>
              <div class="space-y-3">
                <div
                  v-for="r in DEFAULT_EQUIPMENT_REVIEW_DATA.risks.filter((risk) => risk.riskLevel === 'high')"
                  :key="r.id"
                  class="p-4 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-2 text-xs"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-rose-300 text-sm">
                      🔴 {{ r.clauseIndex }} · {{ r.title }}
                    </span>
                    <span class="font-semibold text-rose-400 font-mono">风险评分：{{ r.score }}/100</span>
                  </div>
                  <p class="text-slate-300 leading-relaxed">
                    <strong class="text-slate-100">原条款问题：</strong>
                    {{ r.originalClause }}
                  </p>
                  <p class="text-rose-200 leading-relaxed font-medium">
                    <strong class="text-rose-300">AI 法律风险分析：</strong>
                    {{ r.aiAnalysis }}
                  </p>
                </div>
              </div>
            </section>

            <!-- Chapter 8: 法务最终审核建议 -->
            <section class="space-y-3 border-t-2 border-slate-800 pt-6">
              <h2 class="text-base font-bold text-slate-100 border-l-4 border-slate-700 pl-2.5">
                八、法务最终审核建议
              </h2>
              <div class="p-4 rounded-xl bg-slate-950 text-white space-y-2 text-xs border border-slate-800">
                <div class="text-sm font-bold text-amber-400">
                  审查结论：{{ DEFAULT_EQUIPMENT_REVIEW_DATA.reviewConclusion.overallVerdict }}
                </div>
                <p class="text-slate-300 leading-relaxed">
                  {{ DEFAULT_EQUIPMENT_REVIEW_DATA.reviewConclusion.actionAdvice }}
                </p>
                <div class="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                  <span>初审人：XX AI · AI法务员工 v3.2</span>
                  <span>主办律师 / 法务总监复核签名：___________________</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
