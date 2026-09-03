<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/ReportView.tsx -->
<script setup lang="ts">
import { ref } from 'vue'
import { Check, CheckCircle2, Copy, FileDown, Share2 } from 'lucide-vue-next'
import type { AnalysisInput } from '@/data/ipIntelData'
import { MOCK_PYRAMID_TIERS, MOCK_RISK_ITEMS } from '@/data/ipMockData'
import IpConfettiLayer from './IpConfettiLayer.vue'
import IpDisclaimerBanner from './IpDisclaimerBanner.vue'

const props = defineProps<{ analysisInput: AnalysisInput }>()

// ---- 顶部操作状态 ----
const exported = ref(false) // 「导出Markdown」按钮短暂成功态
const showToast = ref(false) // 导出成功 toast
const confettiOpen = ref(false) // 礼花层触发器（导出自定义组件 IpConfettiLayer）
let resetTimer: ReturnType<typeof setTimeout> | null = null

// 报告正文使用的高风险事项（前 4 条，照原型）
const topRisks = MOCK_RISK_ITEMS.slice(0, 4)

// 聚合金字塔某层「已有 / 建议增报」件数
const tierTotals = (items: { existingCount: number; recommendedCount: number }[]): { exist: number; rec: number } => {
  let exist = 0
  let rec = 0
  items.forEach((i) => {
    exist += i.existingCount
    rec += i.recommendedCount
  })
  return { exist, rec }
}

// HTML 文本转义（用于打印窗口注入，防止特殊字符破坏结构）
const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ---- 生成完整 Markdown 报告内容（动态注入企业 / 产品 / 市场 / 竞对） ----
const buildMarkdown = (): string => {
  const input = props.analysisInput
  const markets = input.targetMarkets.join(' / ')
  const competitors = input.competitors.join('、')
  const riskLines = topRisks
    .map(
      (r) =>
        `- ${r.title}（涉案专利 ${r.relatedPatentId}，权利人 ${r.patentApplicant}，重合度 ${r.claimOverlap}%）→ 建议：${r.recommendation}`,
    )
    .join('\n')
  const pyramidLines = MOCK_PYRAMID_TIERS.map((t) => {
    const { exist, rec } = tierTotals(t.items)
    return `- L${t.level} ${t.title}：已有 ${exist} 件 / 建议增报 ${rec} 件（重点方向：${t.items.map((i) => i.name).join(' · ')}）`
  }).join('\n')

  return `# 企业知识产权战略分析报告
**报告类型**：知识产权风险排查与专利布局战略报告
**委托评估企业**：新能源储能科技集团
**所属行业**：${input.industry}
**评估分析产品**：${input.product}
**评估目标地域**：${markets}
**重点竞对**：${competitors}
**报告编号**：IP-STRAT-2026-0903 | **生成时间**：2026年09月03日

## 一、项目背景与分析范围
针对企业研发的「${input.product}」，AI顾问系统检索了全球 12,846 件公开专利，筛选出核心相关专利 1,286 件，并完成深入对比。重点针对中国（CNIPA）、美国（USPTO）、欧洲（EPO）的核心专利壁垒展开白盒侵权比对与FTO自由度验证。

## 二、全球相关专利态势
全球储能液冷领域专利自2020年起呈现指数级增长态势。中国申请人占据国内公开量的 68%，而在欧美海外市场，Tesla 与 LG Energy Solution 在电池托盘与热失控防火联动方面拥有大量早期核心授权专利。检索公开文献 12,846 件 / 核心相关专利 1,286 件 / 涉案竞争主体 23 家。

## 三、竞争对手专利布局
- **CATL (宁德时代)**：专利总量达 14,200+，在液冷板及Pack结构上筑起双层专利墙，尤其在多歧管均流结构上构筑了密集外围专利。
- **BYD (比亚迪)**：重点依托刀片电池特性，深耕直冷直热与冷媒相变集成，在阻燃隔热板与快换接头领域申请量激增。
- **Tesla (特斯拉)**：专利偏向系统级软件控制与消防联动，海外布局比重高达72%，在北美和欧洲市场拥有极强的诉讼攻防能力。

## 四、核心专利风险清单 (侵权隐患重点)
${riskLines}

## 五、技术特征对比与侵权评估 (全面覆盖判定)
以重点涉案专利 CN114567890A (液冷管路结构) 为例，主要争议点在于「多通道交错管路」与「分流稳压阀门」的布置方式。建议将管路几何结构由「并联交错式」修改为「环形对称拓扑」，并在进出液口取消集中式单腔稳压阀，改为利用模块化冷板内阻均衡压降，可有效排除字面侵权并阻断等同原则适用。

## 六、专利布局机会与建议 (四层金字塔)
${pyramidLines}

## 七、落地建议与行动清单 (优先级规划)
- **P0 紧急**：歧管分流与底部导热板技术方案紧急工程规避 —— 研发团队需在2周内确认环形对称拓扑替代结构图纸，并由外部资深专利代理师出具FTO不侵权书面意见。
- **P1 优先**：抢先申请「自适应流量分配拓扑」核心发明专利 —— 在目标空白点提交第一件核心发明专利（含实用新型同日申请），并在12个月内通过PCT途径进入美欧两地。
- **P2 常态**：建立常态化竞品公开专利周度监测雷达 —— 针对宁德时代、比亚迪储能液冷相关IPC分类号开展自动化法律状态监听。

---
*免责声明：本报告由 XX AI 企业知识产权智能顾问引擎基于公开数据库（CNIPA、USPTO、EPO等）生成，仅供技术检索与决策辅助，不构成法律意见或侵权定论。*`
}

// ---- ① 导出 Markdown：Blob 真实下载（文件名含 product）→ 礼花 + 成功 toast ----
const handleExportMarkdown = () => {
  const md = buildMarkdown()
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `AI知识产权战略报告-${props.analysisInput.product}.md`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)

  // 成功反馈：本地礼花层 + toast + 按钮短暂成功态
  confettiOpen.value = true
  exported.value = true
  showToast.value = true
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    exported.value = false
    showToast.value = false
  }, 2500)
}

// ---- ② 下载 PDF：新窗口写入精简 HTML 报告并触发打印 ----
const handleDownloadPDF = () => {
  const win = window.open('', '_blank')
  if (!win) {
    window.alert('浏览器已拦截新窗口，请允许本站弹出窗口后重试。')
    return
  }
  win.document.write(buildPrintHtml())
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 600)
}

// 分享报告（复制当前链接）
const handleShare = () => {
  navigator.clipboard?.writeText(window.location.href)
  window.alert('报告公开审阅链接已成功复制到剪贴板！')
}

// ---- 打印窗口精简 HTML 报告 ----
const buildPrintHtml = (): string => {
  const input = props.analysisInput
  const markets = input.targetMarkets.join(' / ')
  const competitors = input.competitors.map(esc).join('、')
  const riskRows = topRisks
    .map(
      (r) =>
        `<tr><td>${esc(r.title)}</td><td>${esc(r.relatedPatentId)}</td><td>${esc(r.patentApplicant)}</td><td style="text-align:center;color:#e11d48;font-weight:700">${r.claimOverlap}%</td><td>${esc(r.recommendation)}</td></tr>`,
    )
    .join('')
  const pyramidRows = MOCK_PYRAMID_TIERS.map((t) => {
    const { exist, rec } = tierTotals(t.items)
    return `<li><strong>L${t.level} ${esc(t.title)}</strong>：已有 ${exist} 件 / 建议增报 ${rec} 件（重点方向：${esc(t.items.map((i) => i.name).join(' · '))}）</li>`
  }).join('')

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>${esc(input.industry)} · ${esc(input.product)} 知识产权战略报告</title>
<style>
  body { font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #1e293b; margin: 40px auto; max-width: 720px; padding: 0 24px; line-height: 1.7; }
  h1 { font-size: 22px; margin: 12px 0 4px; }
  h2 { font-size: 15px; margin: 22px 0 8px; border-left: 3px solid #2563eb; padding-left: 10px; }
  .meta { width: 100%; border-collapse: collapse; font-size: 12px; margin: 14px 0; }
  .meta td { padding: 3px 0; }
  .muted { color: #94a3b8; font-size: 12px; }
  .conf { border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 10px; }
  p, li { font-size: 12.5px; color: #334155; }
  table.risk { width: 100%; border-collapse: collapse; font-size: 11.5px; margin: 8px 0; }
  table.risk th, table.risk td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; vertical-align: top; }
  table.risk th { background: #f1f5f9; }
  .stats td { border: 1px solid #e2e8f0; background: #f8fafc; text-align: center; padding: 8px; font-size: 12px; }
  .stats .num { font-size: 17px; font-weight: 800; }
  .foot { border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 10px; font-size: 10px; color: #94a3b8; }
</style>
</head>
<body>
  <div class="conf">
    <div class="muted" style="display:flex;justify-content:space-between">
      <strong style="color:#334155">CONFIDENTIAL · 企业内部机密</strong>
      <span>版本：V1.0-RELEASE</span>
    </div>
    <h1>${esc(input.industry)} · ${esc(input.product)}<br/>知识产权风险排查与专利布局战略报告</h1>
    <table class="meta">
      <tr>
        <td class="muted">委托评估企业</td><td><strong>新能源储能科技集团</strong></td>
        <td class="muted">评估分析产品</td><td><strong style="color:#2563eb">${esc(input.product)}</strong></td>
      </tr>
      <tr>
        <td class="muted">评估目标地域</td><td><strong>${esc(markets)}</strong></td>
        <td class="muted">完成基准日期</td><td><strong>2026年09月03日</strong></td>
      </tr>
    </table>
  </div>

  <h2>一、项目背景与分析范围</h2>
  <p>随着工商业及源网侧储能系统的单体容量突破MWh级别，电池产热密度大幅跃升。本报告针对企业自主开发的<strong>「${esc(input.product)}」</strong>进行全球知识产权排查，重点针对中国（CNIPA）、美国（USPTO）、欧洲（EPO）的核心专利壁垒展开白盒侵权比对与FTO自由度验证。</p>

  <h2>二、全球相关专利态势</h2>
  <p>全球储能液冷领域专利自2020年起呈现指数级增长态势。全球检索命中专利总量为 <strong>12,846</strong> 件，高技术相关专利达 <strong>1,286</strong> 件。</p>
  <table class="stats"><tr>
    <td>检索公开文献<br/><span class="num">12,846</span></td>
    <td>核心相关专利<br/><span class="num" style="color:#2563eb">1,286</span></td>
    <td>涉案竞争主体<br/><span class="num" style="color:#9333ea">23 家</span></td>
  </tr></table>

  <h2>三、竞争对手专利布局</h2>
  <ul>
    <li><strong style="color:#1d4ed8">CATL (宁德时代)</strong>：专利总量达 14,200+，在液冷板（强度92%）及Pack结构（强度94%）筑起双层专利墙。</li>
    <li><strong style="color:#047857">BYD (比亚迪)</strong>：深耕直冷直热与冷媒相变集成，在阻燃隔热板与快换接头领域申请量激增。</li>
    <li><strong style="color:#be123c">Tesla (特斯拉)</strong>：专利偏向系统级软件控制与消防联动，海外布局比重高达72%。</li>
  </ul>

  <h2 style="border-color:#e11d48">四、核心专利风险清单 (侵权隐患重点)</h2>
  <p>AI系统累计识别出 <strong>8项高风险</strong> 专利事项，需重点规避：</p>
  <table class="risk">
    <thead><tr><th>风险事项</th><th>涉案专利号</th><th>权利人</th><th style="text-align:center">重合度</th><th>建议对策</th></tr></thead>
    <tbody>${riskRows}</tbody>
  </table>

  <h2>五、技术特征对比与侵权评估</h2>
  <p>以重点涉案专利 <strong>CN114567890A (液冷管路结构)</strong> 为例，主要争议点在于「多通道交错管路」与「分流稳压阀门」的布置方式。建议改为「环形对称拓扑」并取消集中式单腔稳压阀，可有效排除字面侵权并阻断等同原则适用。</p>

  <h2 style="border-color:#059669">六、专利布局机会与建议 (四层金字塔)</h2>
  <ul>${pyramidRows}</ul>

  <h2>七、落地建议与行动清单</h2>
  <ul>
    <li><strong>P0 紧急</strong>：歧管分流与底部导热板技术方案紧急工程规避（2周内确认环形对称拓扑替代结构图纸并取得FTO书面意见）。</li>
    <li><strong>P1 优先</strong>：抢先申请「自适应流量分配拓扑」核心发明专利，12个月内通过PCT进入美欧两地。</li>
    <li><strong>P2 常态</strong>：建立常态化竞品公开专利周度监测雷达（H01M 10/613 等IPC分类号法律状态监听）。</li>
  </ul>

  <div class="foot">
    <p style="margin:0"><strong style="color:#475569">合规免责申明 (Legal Disclaimer)</strong></p>
    <p style="margin:4px 0 0">本知识产权报告系由 XX AI 自动化知识产权分析模型基于公开数据库（CNIPA、USPTO、EPO等）生成，仅供技术评估与决策参考，不作为正式的专利侵权司法鉴定意见或授权保证。企业在进行重大产品投产、出海销售或提起诉讼抗辩前，应当咨询合格的执业律师或专利代理师。</p>
  </div>
</body>
</html>`
}
</script>

<template>
  <div class="p-4 sm:p-5 space-y-4 pb-8">
    <!-- 合规免责横幅 -->
    <IpDisclaimerBanner />

    <!-- 顶部操作栏 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-1 h-4 bg-blue-600 rounded-full"></span>
          <h2 class="text-base font-bold text-slate-900 tracking-tight">
            企业知识产权战略分析报告
          </h2>
          <span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
            已就绪 · 可直接汇报高管层
          </span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5">
          报告编号：IP-STRAT-2026-0903 | 编制：XX AI 企业知识产权智能顾问引擎
        </p>
      </div>

      <!-- 3 个操作按钮：分享 / 导出 Markdown / 下载 PDF -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          @click="handleShare"
        >
          <Share2 class="w-3.5 h-3.5 text-slate-500" />
          <span>分享报告</span>
        </button>

        <button
          type="button"
          class="px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          @click="handleExportMarkdown"
        >
          <Check v-if="exported" class="w-3.5 h-3.5 text-emerald-600" />
          <Copy v-else class="w-3.5 h-3.5 text-slate-500" />
          <span>{{ exported ? '已导出MD' : '导出Markdown' }}</span>
        </button>

        <button
          type="button"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          @click="handleDownloadPDF"
        >
          <FileDown class="w-3.5 h-3.5" />
          <span>下载PDF报告</span>
        </button>
      </div>
    </div>

    <!-- A4 报告正文 -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-7 space-y-6 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
      <!-- 封面 / 文档头 -->
      <div class="border-b-2 border-slate-900 pb-5 space-y-2">
        <div class="flex items-center justify-between text-[11px] text-slate-500">
          <span class="font-bold tracking-wider text-slate-800 uppercase font-mono">
            CONFIDENTIAL · 企业内部机密
          </span>
          <span class="font-mono text-[10px]">版本：V1.0-RELEASE</span>
        </div>

        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {{ analysisInput.industry }} · {{ analysisInput.product }}<br />
          知识产权风险排查与专利布局战略报告
        </h1>

        <div class="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div>
            <span class="text-slate-400 block font-medium">委托评估企业</span>
            <span class="font-bold text-slate-800 mt-0.5 block">新能源储能科技集团</span>
          </div>
          <div>
            <span class="text-slate-400 block font-medium">评估分析产品</span>
            <span class="font-bold text-blue-600 mt-0.5 block">{{ analysisInput.product }}</span>
          </div>
          <div>
            <span class="text-slate-400 block font-medium">评估目标地域</span>
            <span class="font-bold text-slate-800 mt-0.5 block">{{ analysisInput.targetMarkets.join(' / ') }}</span>
          </div>
          <div>
            <span class="text-slate-400 block font-medium">完成基准日期</span>
            <span class="font-bold text-slate-800 font-mono mt-0.5 block">2026年09月03日</span>
          </div>
        </div>
      </div>

      <!-- 章节一：项目背景与分析范围 -->
      <section class="space-y-2">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-l-[3px] border-blue-600 pl-2.5">
          1. 项目背景与分析范围
        </h3>
        <p class="text-xs text-slate-700 leading-relaxed">
          随着工商业及源网侧储能系统的单体容量突破MWh级别，电池产热密度大幅跃升，传统的风冷散热方式已无法满足温度均匀性（极差≤2.5℃）与长循环寿命要求。本报告针对企业自主开发的
          <strong>「{{ analysisInput.product }}」</strong>
          进行全球知识产权排查，重点针对中国（CNIPA）、美国（USPTO）、欧洲（EPO）的核心专利壁垒展开白盒侵权比对与FTO自由度验证。
        </p>
        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
          <strong>检索参数边界：</strong>涵盖液冷板多通道冲压工艺、盲插快换接头防漏密封、主动双向流控循环阀门、绝缘阻燃导热界面垫、BMS温差预测算法等 12 个关键部件。
        </div>
      </section>

      <!-- 章节二：全球相关专利态势 -->
      <section class="space-y-2">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-l-[3px] border-blue-600 pl-2.5">
          2. 全球相关专利态势
        </h3>
        <p class="text-xs text-slate-700 leading-relaxed">
          全球储能液冷领域专利自2020年起呈现指数级增长态势。全球检索命中专利总量为 <strong>12,846</strong> 件，高技术相关专利达 <strong>1,286</strong> 件。其中中国申请人（CATL、BYD、阳光电源、亿纬锂能）占据国内公开量的 68%，而在欧美海外市场，Tesla 与 LG Energy Solution 在电池托盘与热失控防火联动方面拥有大量早期核心授权专利。
        </p>
        <div class="grid grid-cols-3 gap-2.5 text-center py-1">
          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span class="text-[10px] text-slate-500 block">检索公开文献</span>
            <span class="text-lg font-bold font-mono text-slate-900">12,846</span>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span class="text-[10px] text-slate-500 block">核心相关专利</span>
            <span class="text-lg font-bold font-mono text-blue-600">1,286</span>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span class="text-[10px] text-slate-500 block">涉案竞争主体</span>
            <span class="text-lg font-bold font-mono text-purple-600">23 家</span>
          </div>
        </div>
      </section>

      <!-- 章节三：竞争对手专利布局 -->
      <section class="space-y-2">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-l-[3px] border-blue-600 pl-2.5">
          3. 竞争对手专利布局
        </h3>
        <p class="text-xs text-slate-700 leading-relaxed">
          头部三强在技术分支上的策略差异显著：
        </p>
        <div class="space-y-1.5 text-xs">
          <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
            <strong class="text-blue-700">CATL (宁德时代)</strong>：专利总量达 14,200+，在液冷板（强度92%）及Pack结构（强度94%）筑起双层专利墙，尤其在多歧管均流结构上构筑了密集外围专利。
          </div>
          <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
            <strong class="text-emerald-700">BYD (比亚迪)</strong>：重点依托刀片电池特性，深耕直冷直热与冷媒相变集成，在阻燃隔热板与快换接头领域申请量激增。
          </div>
          <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
            <strong class="text-rose-700">Tesla (特斯拉)</strong>：专利偏向系统级软件控制与消防联动，海外布局比重高达72%，在北美和欧洲市场拥有极强的诉讼攻防能力。
          </div>
        </div>
      </section>

      <!-- 章节四：核心专利风险清单 -->
      <section class="space-y-2">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-l-[3px] border-rose-600 pl-2.5 text-rose-950">
          4. 核心专利风险清单 (侵权隐患重点)
        </h3>
        <p class="text-xs text-slate-700 leading-relaxed">
          AI系统累计识别出 <strong>8项高风险</strong> 专利事项，需重点规避：
        </p>
        <div class="border border-slate-200 rounded-lg overflow-hidden text-xs">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th class="py-2 px-2.5">风险事项</th>
                <th class="py-2 px-2.5">涉案专利号</th>
                <th class="py-2 px-2.5">权利人</th>
                <th class="py-2 px-2.5 text-center">重合度</th>
                <th class="py-2 px-2.5">建议对策</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-[11px]">
              <tr v-for="r in topRisks" :key="r.id">
                <td class="py-2 px-2.5 font-semibold text-slate-900">{{ r.title }}</td>
                <td class="py-2 px-2.5 font-mono text-blue-600 font-bold">{{ r.relatedPatentId }}</td>
                <td class="py-2 px-2.5 text-slate-600">{{ r.patentApplicant }}</td>
                <td class="py-2 px-2.5 text-center font-bold text-rose-600">{{ r.claimOverlap }}%</td>
                <td class="py-2 px-2.5 text-slate-700">{{ r.recommendation }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 章节五：技术特征对比与侵权评估 -->
      <section class="space-y-2">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-l-[3px] border-blue-600 pl-2.5">
          5. 技术特征对比与侵权评估 (全面覆盖判定)
        </h3>
        <p class="text-xs text-slate-700 leading-relaxed">
          以重点涉案专利 <strong>CN114567890A (液冷管路结构)</strong> 为例，企业方案与专利权利要求1对比结果显示，主要争议点在于「多通道交错管路」与「分流稳压阀门」的布置方式。
        </p>
        <div class="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
          <strong>规避设计意见：</strong>
          <p class="text-[11px] leading-relaxed">
            建议将管路几何结构由「并联交错式」修改为「环形对称拓扑」，并在进出液口取消集中式单腔稳压阀，改为利用模块化冷板内阻均衡压降。该方案可有效排除字面侵权并阻断等同原则适用。
          </p>
        </div>
      </section>

      <!-- 章节六：专利布局机会与建议 (四层金字塔) -->
      <section class="space-y-2">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-l-[3px] border-emerald-600 pl-2.5">
          6. 专利布局机会与建议 (四层金字塔)
        </h3>
        <p class="text-xs text-slate-700 leading-relaxed">
          基于AI挖掘出的 <strong>17个技术空白点</strong>，建议企业在未来12个月内推进以下四层阶梯式申请：
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div v-for="t in MOCK_PYRAMID_TIERS" :key="t.level" class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <div class="flex items-center justify-between font-bold text-slate-900 mb-0.5 text-xs">
              <span>L{{ t.level }}: {{ t.title }}</span>
              <span class="text-emerald-700 font-mono font-bold text-[11px]">
                已有{{ tierTotals(t.items).exist }} / +{{ tierTotals(t.items).rec }}件
              </span>
            </div>
            <p class="text-slate-500 text-[10px] leading-relaxed">
              重点方向：{{ t.items.map((i) => i.name).join(' · ') }}
            </p>
          </div>
        </div>
      </section>

      <!-- 章节七：落地建议与行动清单 -->
      <section class="space-y-2">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-l-[3px] border-slate-900 pl-2.5">
          7. 落地建议与行动清单 (优先级规划)
        </h3>
        <div class="space-y-1.5 text-xs">
          <div class="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2">
            <span class="px-1.5 py-0.5 bg-rose-600 text-white font-bold rounded text-[9px] shrink-0 mt-0.5">P0 紧急</span>
            <div>
              <p class="font-bold text-rose-950 text-xs">歧管分流与底部导热板技术方案紧急工程规避</p>
              <p class="text-rose-800/80 mt-0.5 text-[11px] leading-snug">
                研发团队需在2周内确认环形对称拓扑替代结构图纸，并由外部资深专利代理师出具FTO不侵权书面意见。
              </p>
            </div>
          </div>

          <div class="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <span class="px-1.5 py-0.5 bg-blue-600 text-white font-bold rounded text-[9px] shrink-0 mt-0.5">P1 优先</span>
            <div>
              <p class="font-bold text-blue-950 text-xs">抢先申请「自适应流量分配拓扑」核心发明专利</p>
              <p class="text-blue-800/80 mt-0.5 text-[11px] leading-snug">
                在目标空白点提交第一件核心发明专利（含实用新型同日申请），并在12个月内通过PCT途径进入美欧两地。
              </p>
            </div>
          </div>

          <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
            <span class="px-1.5 py-0.5 bg-slate-600 text-white font-bold rounded text-[9px] shrink-0 mt-0.5">P2 常态</span>
            <div>
              <p class="font-bold text-slate-900 text-xs">建立常态化竞品公开专利周度监测雷达</p>
              <p class="text-slate-600 mt-0.5 text-[11px] leading-snug">
                针对宁德时代、比亚迪储能液冷相关IPC分类号（H01M 10/613等）开展自动化法律状态监听。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 文档内部合规免责 -->
      <div class="pt-5 border-t border-slate-200 text-[10px] text-slate-400 space-y-0.5">
        <p class="font-semibold text-slate-600">合规免责申明 (Legal Disclaimer)</p>
        <p>
          本知识产权报告系由 XX AI 自动化知识产权分析模型基于公开数据库（CNIPA、USPTO、EPO等）生成，仅供技术评估与决策参考，不作为正式的专利侵权司法鉴定意见或授权保证。企业在进行重大产品投产、出海销售或提起诉讼抗辩前，应当咨询合格的执业律师或专利代理师。
        </p>
      </div>
    </div>

    <!-- 导出成功礼花层 -->
    <IpConfettiLayer :trigger="confettiOpen" @done="confettiOpen = false" />

    <!-- 导出成功 toast -->
    <div
      v-if="showToast"
      class="fixed top-5 left-1/2 -translate-x-1/2 z-[95] flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold pl-2.5 pr-3.5 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2"
    >
      <CheckCircle2 class="w-4 h-4 text-emerald-400" />
      <span>Markdown 报告已导出（{{ analysisInput.product }}）</span>
    </div>
  </div>
</template>
