<!-- ============================================================================
     AI 法务员工 · 《合同AI审查报告》汇总弹窗（8 大章节）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/review/ReportModal.tsx
     props: { isOpen; data: ContractReviewData; addedRiskIds? } —— emits: close
     导出适配（spec §7.3，原型 window.print 假下载已改造为真实能力）：
       - 「导出 Markdown」：Blob 真实生成 .md 下载（结构化，含审查结论/风险条目/示范条款）
       - 「导出 PDF / 打印」：新开窗口写入 A4 白底深字纯 HTML 并自动调用打印引擎
       - 「分享报告」：复制分享文案（剪贴板）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { Check, Download, FileText, Printer, Share2, X } from 'lucide-vue-next'
import type { ContractReviewData } from '@/data/legalIntelData'
import { LEGAL_DISCLAIMER_TEXT } from '@/data/legalMockData'

const props = defineProps<{
  isOpen: boolean
  data: ContractReviewData
  addedRiskIds?: string[]
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

// ---- 分享复制状态 ----
const copiedShare = ref(false)
const downloadToast = ref<string | null>(null)
let shareTimer: ReturnType<typeof setTimeout> | undefined
let toastTimer: ReturnType<typeof setTimeout> | undefined

// ---- 已加入报告的风险条目（供「已加入报告风险事项」节展示） ----
const addedRisks = computed(() => {
  const ids = props.addedRiskIds ?? []
  if (ids.length === 0) return []
  return props.data.risks.filter((r) => ids.includes(r.id))
})

const showToast = (msg: string, duration = 2600) => {
  downloadToast.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    downloadToast.value = null
  }, duration)
}

// ---- 分享报告：复制分享文案 ----
const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(
      `【XX AI · AI法务员工】《合同AI审查报告》已生成\n合同名称：${props.data.contractTitle}\n综合风险评分：${props.data.overallScore}/100（${props.data.overallRiskLevel}）\n审查结论：${props.data.reviewConclusion.overallVerdict}\n点击进入企业法律风险平台查看全文与示范条款。`,
    )
    copiedShare.value = true
    window.clearTimeout(shareTimer)
    shareTimer = setTimeout(() => {
      copiedShare.value = false
    }, 2500)
  } catch {
    // 剪贴板不可用时静默降级
  }
}

const reportFileName = () =>
  `${props.data.contractTitle.replace(/[《》\s]/g, '')}-AI审查报告.md`

// ---- 导出 Markdown：Blob 真实生成 .md 下载 ----
const buildMarkdown = (): string => {
  const d = props.data
  const lines: string[] = []
  lines.push(`# 《合同AI审查报告》`)
  lines.push(``)
  lines.push(`> **XX AI · 企业法律风险智能管理平台** · 报告生成日期：2026年09月03日`)
  lines.push(`> 标的合同：${d.contractTitle}`)
  lines.push(``)
  lines.push(`> ⚠️ 特别提示：${LEGAL_DISCLAIMER_TEXT}`)
  lines.push(``)
  lines.push(`## 一、合同基本信息`)
  lines.push(``)
  lines.push(`- 甲方（买方）：${d.partyA}`)
  lines.push(`- 乙方（卖方）：${d.partyB}`)
  lines.push(`- 合同类型：${d.contractType}`)
  lines.push(`- 标的总金额：${d.contractAmount}`)
  lines.push(`- 履约期限：${d.contractDuration}`)
  lines.push(`- 付款方式约定：${d.paymentMethod}`)
  lines.push(`- 交付周期：${d.deliveryPeriod}`)
  lines.push(`- 违约责任比例：${d.breachPenalty}`)
  lines.push(`- 争议解决管辖：${d.disputeResolution}`)
  lines.push(``)
  lines.push(`## 二、合同核心条款摘要`)
  lines.push(``)
  lines.push(`| 项目 | 约定内容 |`)
  lines.push(`| --- | --- |`)
  lines.push(`| 付款方式 | ${d.paymentMethod} |`)
  lines.push(`| 交付周期 | ${d.deliveryPeriod} |`)
  lines.push(`| 违约责任约定 | ${d.breachPenalty} |`)
  lines.push(`| 争议解决方式 | ${d.disputeResolution} |`)
  lines.push(``)
  lines.push(`## 三、风险总览与评分`)
  lines.push(``)
  lines.push(`- AI 合同法律风险综合评分：**${d.overallScore} / 100（${d.overallRiskLevel}）**`)
  lines.push(`- 总识别条款：${d.totalClauses} 条；风险事项共 ${d.totalRisks} 项`)
  lines.push(`- 高风险 ${d.highRiskCount} 项 / 中风险 ${d.mediumRiskCount} 项 / 低风险 ${d.lowRiskCount} 项`)
  lines.push(``)
  if (addedRisks.value.length > 0) {
    lines.push(`## ★ 已加入报告风险事项（重点跟进）`)
    lines.push(``)
    addedRisks.value.forEach((r) => {
      lines.push(`- **${r.clauseIndex} · ${r.title}**（${r.riskLevel === 'high' ? '高' : r.riskLevel === 'medium' ? '中' : '低'}风险，评分 ${r.score}/100，优先级 ${r.priority}）`)
    })
    lines.push(``)
  }
  lines.push(`## 四、高风险事项详析（P0级 重点突破）`)
  lines.push(``)
  d.risks
    .filter((r) => r.riskLevel === 'high')
    .forEach((r) => {
      lines.push(`### 🔴 ${r.clauseIndex} · ${r.title}（风险评分：${r.score}/100）`)
      lines.push(``)
      lines.push(`**原条款问题：** ${r.originalClause}`)
      lines.push(``)
      lines.push(`**AI 法律风险分析：** ${r.aiAnalysis}`)
      lines.push(``)
      lines.push(`**AI 建议示范条款：** ${r.recommendedClause}`)
      lines.push(``)
    })
  lines.push(`## 五、中风险事项清单`)
  lines.push(``)
  lines.push(`| 条款编号 | 风险事项 | 分类 | 应对策略建议 |`)
  lines.push(`| --- | --- | --- | --- |`)
  d.risks
    .filter((r) => r.riskLevel === 'medium')
    .forEach((r) => {
      lines.push(`| ${r.clauseIndex} | ${r.title} | ${r.category} | ${r.suggestionType} |`)
    })
  lines.push(``)
  lines.push(`## 六、核心条款修改示范版本`)
  lines.push(``)
  d.comparisons.slice(0, 3).forEach((comp) => {
    lines.push(`### ${comp.clauseNumber} · ${comp.title}（${comp.category}）`)
    lines.push(``)
    lines.push(`**【原条款文本】** ${comp.originalClause}`)
    lines.push(``)
    lines.push(`**【AI 建议示范条款】** ${comp.proposedClause}`)
    lines.push(``)
  })
  lines.push(`## 七、法务向商务团队提示之重点谈判事项`)
  lines.push(``)
  lines.push(`1. **付款梯度谈判：**务必坚守 30% 首付款红线，严禁在无保函前提下支付 70% 预付款；`)
  lines.push(`2. **违约责任对等：**要求卖方同意日千分之零点五的违约赔偿标准，取消 2% 的单边低封顶；`)
  lines.push(`3. **验收异议期：**将 7 日默示合格更改为“连续 30 日带载试运行达标并双方盖章确认”；`)
  lines.push(`4. **严禁后门与锁机：**必须在补充协议中增加反恶意锁机与 30% 惩罚性赔偿条款。`)
  lines.push(``)
  lines.push(`## 八、法务最终审核建议`)
  lines.push(``)
  lines.push(`**审查结论：${d.reviewConclusion.overallVerdict}**`)
  lines.push(``)
  lines.push(d.reviewConclusion.actionAdvice)
  lines.push(``)
  lines.push(`---`)
  lines.push(`初审人：XX AI · AI法务员工 v3.2 · 主办律师 / 法务总监复核签名：___________________`)
  return lines.join('\n')
}

const handleExportMarkdown = () => {
  const blob = new Blob([buildMarkdown()], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = reportFileName()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showToast(`已生成《${props.data.contractTitle.replace(/[《》]/g, '')}AI审查报告.md》并开始下载`)
}

// ---- 导出 PDF / 打印：新开窗口写入 A4 白底深字 HTML 并自动调用打印 ----
const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br/>')

const buildPrintHtml = (): string => {
  const d = props.data
  const highRisks = d.risks
    .filter((r) => r.riskLevel === 'high')
    .map(
      (r) => `<div style="margin-bottom:14px;padding:12px;border:1px solid #fecaca;border-radius:6px;background:#fff7f7">
        <div style="font-weight:700;color:#991b1b;font-size:14px;margin-bottom:4px">🔴 ${escapeHtml(r.clauseIndex)} · ${escapeHtml(r.title)} <span style="float:right;font-family:monospace">风险评分：${r.score}/100</span></div>
        <p style="color:#1e293b;line-height:1.7;margin:6px 0"><strong>原条款问题：</strong>${escapeHtml(r.originalClause)}</p>
        <p style="color:#7f1d1d;line-height:1.7;margin:6px 0"><strong>AI 法律风险分析：</strong>${escapeHtml(r.aiAnalysis)}</p>
      </div>`,
    )
    .join('')
  const mediumRows = d.risks
    .filter((r) => r.riskLevel === 'medium')
    .map(
      (r) =>
        `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0;font-family:monospace">${escapeHtml(r.clauseIndex)}</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(r.title)}</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(r.category)}</td><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(r.suggestionType)}</td></tr>`,
    )
    .join('')
  const compBlocks = d.comparisons
    .slice(0, 3)
    .map(
      (comp) => `<div style="margin-bottom:14px;border:1px solid #cbd5e1;border-radius:6px;padding:12px">
        <div style="font-weight:700;color:#0f172a;font-size:14px;margin-bottom:6px">${escapeHtml(comp.clauseNumber)} · ${escapeHtml(comp.title)} <span style="color:#2563eb;font-weight:400;font-size:12px">（${escapeHtml(comp.category)}）</span></div>
        <div style="display:flex;gap:10px">
          <div style="flex:1;padding:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;font-family:monospace;font-size:12px;line-height:1.7"><strong style="color:#475569">【原条款文本】</strong><br/>${escapeHtml(comp.originalClause)}</div>
          <div style="flex:1;padding:8px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:4px;font-family:monospace;font-size:12px;line-height:1.7"><strong style="color:#065f46">【AI 建议示范条款】</strong><br/>${escapeHtml(comp.proposedClause)}</div>
        </div>
      </div>`,
    )
    .join('')
  const addedBlock =
    addedRisks.value.length > 0
      ? `<h2 style="font-size:16px;color:#0f172a;border-left:4px solid #059669;padding-left:10px;margin:22px 0 10px">★ 已加入报告风险事项（重点跟进）</h2>
         <div style="padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;line-height:1.8;font-size:13px;color:#14532d">
           ${addedRisks.value
             .map(
               (r) =>
                 `<div>• <strong>${escapeHtml(r.clauseIndex)} · ${escapeHtml(r.title)}</strong>（${r.riskLevel === 'high' ? '高' : r.riskLevel === 'medium' ? '中' : '低'}风险，评分 ${r.score}/100，优先级 ${r.priority}）</div>`,
             )
             .join('')}
         </div>`
      : ''
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<title>《合同AI审查报告》- ${escapeHtml(d.contractTitle)}</title>
<style>
  body { font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #0f172a; margin: 0; padding: 32px; background: #ffffff; }
  .report { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 26px; text-align: center; color: #0f172a; margin: 18px 0 6px; }
  .meta { text-align: center; color: #475569; font-size: 12px; margin-bottom: 22px; }
  .notice { padding: 10px 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; font-size: 12px; color: #78350f; line-height: 1.8; margin-bottom: 22px; }
  h2 { font-size: 16px; color: #0f172a; border-left: 4px solid #2563eb; padding-left: 10px; margin: 22px 0 10px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; font-size: 13px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; line-height: 1.9; }
  .score-line { font-size: 15px; font-weight: 700; color: #9f1239; }
  table { border-collapse: collapse; width: 100%; font-size: 12px; }
  th { background: #f1f5f9; color: #475569; padding: 6px 10px; border: 1px solid #e2e8f0; text-align: left; }
  @media print { body { padding: 0; } .report { max-width: none; } }
</style>
</head>
<body>
<div class="report">
  <div class="meta">XX AI · 企业法律风险智能管理平台 · 报告生成日期：2026年09月03日</div>
  <h1>《合同AI审查报告》</h1>
  <div class="meta">标的合同：${escapeHtml(d.contractTitle)} · 审查耗时 2分18秒</div>
  <div class="notice"><strong>特别提示：</strong>${escapeHtml(LEGAL_DISCLAIMER_TEXT)}</div>

  <h2>一、合同基本信息</h2>
  <div class="info-grid">
    <div>甲方（买方）：<strong>${escapeHtml(d.partyA)}</strong></div>
    <div>乙方（卖方）：<strong>${escapeHtml(d.partyB)}</strong></div>
    <div>合同类型：<strong>${escapeHtml(d.contractType)}</strong></div>
    <div>标的总金额：<strong style="color:#1d4ed8">${escapeHtml(d.contractAmount)}</strong></div>
    <div>履约期限：<strong>${escapeHtml(d.contractDuration)}</strong></div>
    <div>审查时间：<strong>2026-09-03 09:12</strong></div>
  </div>

  <h2>二、合同核心条款摘要</h2>
  <table>
    <tr><th style="width:130px">付款方式</th><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(d.paymentMethod)}</td></tr>
    <tr><th style="width:130px">交付周期</th><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(d.deliveryPeriod)}</td></tr>
    <tr><th style="width:130px">违约责任约定</th><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(d.breachPenalty)}</td></tr>
    <tr><th style="width:130px">争议解决方式</th><td style="padding:6px 10px;border:1px solid #e2e8f0">${escapeHtml(d.disputeResolution)}</td></tr>
  </table>

  <h2>三、风险总览与评分</h2>
  <div style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;line-height:2">
    <div class="score-line">AI 合同法律风险综合评分：${d.overallScore} / 100（${escapeHtml(d.overallRiskLevel)}）</div>
    <div>总识别条款 <strong>${d.totalClauses}</strong> 条 · 风险事项共 <strong>${d.totalRisks}</strong> 项：高风险 <strong style="color:#9f1239">${d.highRiskCount}</strong> 项 / 中风险 <strong style="color:#b45309">${d.mediumRiskCount}</strong> 项 / 低风险 <strong style="color:#475569">${d.lowRiskCount}</strong> 项</div>
  </div>
  ${addedBlock}

  <h2 style="border-left-color:#f43f5e">四、高风险事项详析（P0级 重点突破）</h2>
  ${highRisks}

  <h2 style="border-left-color:#f59e0b">五、中风险事项清单</h2>
  <table>
    <thead><tr><th>条款编号</th><th>风险事项</th><th>分类</th><th>应对策略建议</th></tr></thead>
    <tbody>${mediumRows}</tbody>
  </table>

  <h2>六、核心条款修改示范版本</h2>
  ${compBlocks}

  <h2 style="border-left-color:#6366f1">七、法务向商务团队提示之重点谈判事项</h2>
  <ul style="font-size:13px;line-height:2.1;color:#0f172a">
    <li><strong>付款梯度谈判：</strong>务必坚守 30% 首付款红线，严禁在无保函前提下支付 70% 预付款；</li>
    <li><strong>违约责任对等：</strong>要求卖方同意日千分之零点五的违约赔偿标准，取消 2% 的单边低封顶；</li>
    <li><strong>验收异议期：</strong>将 7 日默示合格更改为“连续 30 日带载试运行达标并双方盖章确认”；</li>
    <li><strong>严禁后门与锁机：</strong>必须在补充协议中增加反恶意锁机与 30% 惩罚性赔偿条款。</li>
  </ul>

  <h2 style="border-left-color:#334155">八、法务最终审核建议</h2>
  <div style="padding:14px 16px;background:#0f172a;color:#fff;border-radius:6px;font-size:13px;line-height:1.9">
    <div style="font-weight:700;color:#fbbf24;margin-bottom:4px">审查结论：${escapeHtml(d.reviewConclusion.overallVerdict)}</div>
    <p style="color:#cbd5e1;margin:6px 0">${escapeHtml(d.reviewConclusion.actionAdvice)}</p>
    <div style="border-top:1px solid #334155;margin-top:10px;padding-top:8px;font-size:11px;color:#94a3b8;display:flex;justify-content:space-between">
      <span>初审人：XX AI · AI法务员工 v3.2</span>
      <span>主办律师 / 法务总监复核签名：___________________</span>
    </div>
  </div>
</div>
</body>
</html>`
}

const handlePrintOrPdf = () => {
  const win = window.open('', '_blank', 'width=960,height=1200')
  if (!win) {
    showToast('浏览器拦截了新窗口，请允许弹出窗口后重试')
    return
  }
  win.document.write(buildPrintHtml())
  win.document.close()
  win.focus()
  // 等渲染完成后自动调起系统打印/导出 PDF 引擎
  win.setTimeout(() => {
    win.print()
  }, 350)
  showToast('已生成PDF报告排版，正在调用系统打印/导出PDF引擎...')
}

onBeforeUnmount(() => {
  window.clearTimeout(shareTimer)
  window.clearTimeout(toastTimer)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-[2px] animate-in fade-in duration-200"
      @click.self="emit('close')"
    >
      <div
        class="bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-800 max-h-[92vh] flex flex-col overflow-hidden"
      >
        <!-- 顶部操作条 -->
        <div
          class="px-6 py-4 bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800"
        >
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
              <Check v-if="copiedShare" class="w-3.5 h-3.5 text-emerald-400" />
              <Share2 v-else class="w-3.5 h-3.5 text-slate-400" />
              <span class="text-emerald-300" v-if="copiedShare">已复制分享链接</span>
              <span v-else>分享报告</span>
            </button>

            <button
              type="button"
              @click="handleExportMarkdown"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
            >
              <Download class="w-3.5 h-3.5 text-slate-400" />
              <span>导出 Markdown</span>
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
              class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
              @click="emit('close')"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Toast 提示条 -->
        <div
          v-if="downloadToast"
          class="bg-blue-600 text-white px-6 py-2 text-xs font-medium flex items-center justify-between shrink-0 animate-in fade-in"
        >
          <span>{{ downloadToast }}</span>
          <button
            type="button"
            class="text-white/80 hover:text-white cursor-pointer"
            @click="downloadToast = null"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- 报告正文（可滚动） -->
        <div class="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-950/70 legal-custom-scrollbar">
          <div
            class="bg-slate-900 max-w-3xl mx-auto p-8 sm:p-12 rounded-xl shadow-xl border border-slate-800 space-y-8 text-slate-200"
          >
            <!-- 报告抬头 -->
            <div class="border-b-2 border-slate-800 pb-6 space-y-2">
              <div
                class="flex items-center justify-between text-xs text-slate-400"
              >
                <span class="font-semibold text-slate-300">XX AI · 企业法律风险智能管理平台</span>
                <span>报告生成日期：2026年09月03日</span>
              </div>
              <h1
                class="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight text-center pt-2"
              >
                《合同AI审查报告》
              </h1>
              <p class="text-xs text-center text-slate-400">标的合同：{{ data.contractTitle }}</p>
            </div>

            <!-- 特别提示 -->
            <div
              class="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 leading-relaxed"
            >
              <span class="font-bold">特别提示：</span>
              {{ LEGAL_DISCLAIMER_TEXT }}
            </div>

            <!-- 一、合同基本信息 -->
            <section class="space-y-3">
              <h2
                class="text-base font-bold text-slate-100 border-l-4 border-blue-500 pl-2.5"
              >
                一、合同基本信息
              </h2>
              <div
                class="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-lg border border-slate-800"
              >
                <div>
                  <span class="text-slate-400">甲方（买方）：</span>
                  <span class="font-semibold text-slate-200">{{ data.partyA }}</span>
                </div>
                <div>
                  <span class="text-slate-400">乙方（卖方）：</span>
                  <span class="font-semibold text-slate-200">{{ data.partyB }}</span>
                </div>
                <div>
                  <span class="text-slate-400">合同类型：</span>
                  <span class="font-semibold text-slate-200">{{ data.contractType }}</span>
                </div>
                <div>
                  <span class="text-slate-400">标的总金额：</span>
                  <span class="font-bold text-blue-400">{{ data.contractAmount }}</span>
                </div>
                <div>
                  <span class="text-slate-400">履约期限：</span>
                  <span class="font-semibold text-slate-200">{{ data.contractDuration }}</span>
                </div>
                <div>
                  <span class="text-slate-400">审查时间：</span>
                  <span class="font-semibold text-slate-200">2026-09-03 09:12（耗时 2分18秒）</span>
                </div>
              </div>
            </section>

            <!-- 二、合同核心条款摘要 -->
            <section class="space-y-3">
              <h2
                class="text-base font-bold text-slate-100 border-l-4 border-blue-500 pl-2.5"
              >
                二、合同核心条款摘要
              </h2>
              <div class="border border-slate-800 rounded-lg overflow-hidden text-xs">
                <table class="w-full text-left divide-y divide-slate-800">
                  <tbody class="divide-y divide-slate-800">
                    <tr class="bg-slate-950/40">
                      <td class="px-4 py-2.5 font-semibold text-slate-400 w-32">付款方式</td>
                      <td class="px-4 py-2.5 text-slate-200">{{ data.paymentMethod }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2.5 font-semibold text-slate-400">交付周期</td>
                      <td class="px-4 py-2.5 text-slate-200">{{ data.deliveryPeriod }}</td>
                    </tr>
                    <tr class="bg-slate-950/40">
                      <td class="px-4 py-2.5 font-semibold text-slate-400">违约责任约定</td>
                      <td class="px-4 py-2.5 text-slate-200">{{ data.breachPenalty }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2.5 font-semibold text-slate-400">争议解决方式</td>
                      <td class="px-4 py-2.5 text-slate-200">{{ data.disputeResolution }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- 三、风险总览与评分 -->
            <section class="space-y-3">
              <h2
                class="text-base font-bold text-slate-100 border-l-4 border-blue-500 pl-2.5"
              >
                三、风险总览与评分
              </h2>
              <div
                class="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div>
                  <div class="text-xs text-slate-400">AI 合同法律风险综合评分</div>
                  <div class="flex items-baseline gap-2 mt-1">
                    <span class="text-3xl font-black text-rose-500 font-mono">{{ data.overallScore }}</span>
                    <span class="text-sm font-semibold text-slate-500">/ 100</span>
                    <span
                      class="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold ml-2 border border-rose-500/30"
                    >
                      {{ data.overallRiskLevel }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-4 text-center">
                  <div class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div class="text-[11px] text-slate-400">总识别条款</div>
                    <div class="text-sm font-bold text-slate-200 font-mono">{{ data.totalClauses }} 条</div>
                  </div>
                  <div class="px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/40">
                    <div class="text-[11px] text-rose-300">高风险</div>
                    <div class="text-sm font-bold text-rose-400 font-mono">{{ data.highRiskCount }} 项</div>
                  </div>
                  <div class="px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
                    <div class="text-[11px] text-amber-300">中风险</div>
                    <div class="text-sm font-bold text-amber-400 font-mono">{{ data.mediumRiskCount }} 项</div>
                  </div>
                  <div class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div class="text-[11px] text-slate-400">低风险</div>
                    <div class="text-sm font-bold text-slate-300 font-mono">{{ data.lowRiskCount }} 项</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- ★ 已加入报告风险事项（重点跟进，供报告引用） -->
            <section v-if="addedRisks.length > 0" class="space-y-2.5">
              <h2
                class="text-base font-bold text-slate-100 border-l-4 border-emerald-500 pl-2.5"
              >
                ★ 已加入报告风险事项（重点跟进）
              </h2>
              <div class="space-y-2">
                <div
                  v-for="r in addedRisks"
                  :key="r.id"
                  class="px-3.5 py-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs flex flex-wrap items-center justify-between gap-2"
                >
                  <span class="font-semibold text-slate-200">
                    {{ r.clauseIndex }} · {{ r.title }}
                  </span>
                  <span class="flex items-center gap-2 shrink-0">
                    <span
                      :class="[
                        'text-[10px] px-1.5 py-0.5 rounded font-bold border',
                        r.riskLevel === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : r.riskLevel === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700',
                      ]"
                    >
                      {{ r.riskLevel === 'high' ? '🔴 高' : r.riskLevel === 'medium' ? '🟠 中' : '🟡 低' }}风险
                    </span>
                    <span class="font-mono text-slate-400">评分 {{ r.score }}/100 · {{ r.priority }}</span>
                  </span>
                </div>
              </div>
            </section>

            <!-- 四、高风险事项详析 -->
            <section class="space-y-3">
              <h2
                class="text-base font-bold text-slate-100 border-l-4 border-rose-500 pl-2.5"
              >
                四、高风险事项详析（P0级 重点突破）
              </h2>
              <div class="space-y-3">
                <div
                  v-for="r in data.risks.filter((risk) => risk.riskLevel === 'high')"
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

            <!-- 五、中风险事项清单 -->
            <section class="space-y-3">
              <h2
                class="text-base font-bold text-slate-100 border-l-4 border-amber-500 pl-2.5"
              >
                五、中风险事项清单
              </h2>
              <div class="border border-slate-800 rounded-lg overflow-hidden text-xs">
                <table class="w-full text-left divide-y divide-slate-800">
                  <thead class="bg-slate-950/80 text-slate-400 font-semibold">
                    <tr>
                      <th class="px-3.5 py-2">条款编号</th>
                      <th class="px-3.5 py-2">风险事项</th>
                      <th class="px-3.5 py-2">分类</th>
                      <th class="px-3.5 py-2">应对策略建议</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800">
                    <tr
                      v-for="r in data.risks.filter((risk) => risk.riskLevel === 'medium')"
                      :key="r.id"
                      class="hover:bg-slate-800/40 transition-colors"
                    >
                      <td class="px-3.5 py-2 font-mono font-semibold text-slate-300">{{ r.clauseIndex }}</td>
                      <td class="px-3.5 py-2 font-medium text-slate-100">{{ r.title }}</td>
                      <td class="px-3.5 py-2 text-slate-400">{{ r.category }}</td>
                      <td class="px-3.5 py-2 text-slate-300">{{ r.suggestionType }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- 六、核心条款修改示范版本 -->
            <section class="space-y-3">
              <h2
                class="text-base font-bold text-slate-100 border-l-4 border-blue-500 pl-2.5"
              >
                六、核心条款修改示范版本
              </h2>
              <div class="space-y-4">
                <div
                  v-for="comp in data.comparisons.slice(0, 3)"
                  :key="comp.id"
                  class="border border-slate-800 rounded-lg p-4 space-y-2 text-xs"
                >
                  <div class="font-bold text-slate-100 text-sm flex items-center justify-between">
                    <span>{{ comp.clauseNumber }} · {{ comp.title }}</span>
                    <span class="text-blue-400 text-xs">{{ comp.category }}</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div class="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                      <div class="font-semibold text-slate-400 mb-1">【原条款文本】</div>
                      <div class="text-slate-300 leading-relaxed font-mono">{{ comp.originalClause }}</div>
                    </div>
                    <div class="p-2.5 rounded bg-emerald-950/20 border border-emerald-800/40">
                      <div class="font-semibold text-emerald-300 mb-1">【AI 建议示范条款】</div>
                      <div class="text-emerald-200 leading-relaxed font-mono whitespace-pre-wrap">
                        {{ comp.proposedClause }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 七、法务向商务团队提示之重点谈判事项 -->
            <section class="space-y-3">
              <h2
                class="text-base font-bold text-slate-100 border-l-4 border-indigo-500 pl-2.5"
              >
                七、法务向商务团队提示之重点谈判事项
              </h2>
              <ul
                class="list-disc pl-5 space-y-1.5 text-xs text-slate-300 leading-relaxed"
              >
                <li>
                  <strong class="text-slate-100">付款梯度谈判：</strong>务必坚守 30% 首付款红线，严禁在无保函前提下支付 70% 预付款；
                </li>
                <li>
                  <strong class="text-slate-100">违约责任对等：</strong>要求卖方同意日千分之零点五的违约赔偿标准，取消 2% 的单边低封顶；
                </li>
                <li>
                  <strong class="text-slate-100">验收异议期：</strong>将 7 日默示合格更改为“连续 30 日带载试运行达标并双方盖章确认”；
                </li>
                <li>
                  <strong class="text-slate-100">严禁后门与锁机：</strong>必须在补充协议中增加反恶意锁机与 30% 惩罚性赔偿条款。
                </li>
              </ul>
            </section>

            <!-- 八、法务最终审核建议 -->
            <section class="space-y-3 border-t-2 border-slate-800 pt-6">
              <h2
                class="text-base font-bold text-slate-100 border-l-4 border-slate-700 pl-2.5"
              >
                八、法务最终审核建议
              </h2>
              <div class="p-4 rounded-xl bg-slate-950 text-white space-y-2 text-xs border border-slate-800">
                <div class="text-sm font-bold text-amber-400">
                  审查结论：{{ data.reviewConclusion.overallVerdict }}
                </div>
                <p class="text-slate-300 leading-relaxed">
                  {{ data.reviewConclusion.actionAdvice }}
                </p>
                <div
                  class="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800"
                >
                  <span>初审人：XX AI · AI法务员工 v3.2</span>
                  <span>主办律师 / 法务总监复核签名：___________________</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
