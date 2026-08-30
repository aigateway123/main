import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  Coins, 
  ArrowLeft,
  Share2,
  FileCheck2
} from 'lucide-react';
import { FinalCombatReport, ProjectOverview } from '../types';
import { copyToClipboard, downloadTextAsFile } from '../lib/utils';

interface StepFinalReportProps {
  report: FinalCombatReport;
  overview: ProjectOverview;
  onPrev: () => void;
}

export const StepFinalReport: React.FC<StepFinalReportProps> = ({
  report,
  overview,
  onPrev
}) => {
  const [copied, setCopied] = useState(false);

  const getVerdictDetails = (rec: 'recommend' | 'caution' | 'not_recommend') => {
    switch (rec) {
      case 'recommend':
        return {
          title: '建议全力参与投标',
          subtitle: '资质硬条件全满足，核心技术与业绩具备显著竞争力，具备冲刺中标实力',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          cardClass: 'bg-emerald-50/40 border-emerald-200'
        };
      case 'caution':
        return {
          title: '谨慎参与（需专项攻关）',
          subtitle: '存在部分资质业绩缺口或中度废标风险，需调配资源补齐关键短板方可决胜',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          cardClass: 'bg-amber-50/40 border-amber-200'
        };
      case 'not_recommend':
        return {
          title: '不建议参与（弃标止损）',
          subtitle: '存在不可逆的一票否决实质性资质缺口或商务硬伤，投标成本高且中标概率极低',
          badgeClass: 'bg-red-50 text-red-700 border-red-300',
          icon: XCircle,
          iconColor: 'text-red-600',
          cardClass: 'bg-red-50/40 border-red-200'
        };
    }
  };

  const verdict = getVerdictDetails(report.recommendation);
  const VerdictIcon = verdict.icon;

  const markdownContent = `# AI 投标作战报告

**项目名称**：${overview.projectName}
**项目预算**：${overview.budget}
**评标方式**：${overview.evaluationMethod}
**投标结论**：【${verdict.title}】
**生成时间**：${report.timestamp || new Date().toLocaleString('zh-CN')}

---

## 核心研判依据（7大维度）：
1. **资质匹配度**：${report.coreReasons.qualificationMatchRate}
2. **业绩匹配度**：${report.coreReasons.experienceMatchRate}
3. **预计综合得分**：${report.coreReasons.expectedScore} 分 / 满分 ${report.coreReasons.maxScore} 分
4. **核心优势项**：${report.coreReasons.primaryStrength}
5. **主要劣势项**：${report.coreReasons.primaryWeakness}
6. **核心废标风险**：${report.coreReasons.maxDisqualificationRisk}
7. **可冲刺提分空间**：${report.coreReasons.maxScoreOpportunity}

---

## 战略执行建议：
${report.strategicVerdict}
`;

  const handleCopy = () => {
    copyToClipboard(markdownContent).then(ok => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  const handleDownload = () => {
    downloadTextAsFile(`${overview.projectName}_AI投标作战报告.md`, markdownContent);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 print:m-0 print:p-0">
      {/* Top Action Bar Bento Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-bold text-slate-900">一页纸「AI投标作战决策报告」</span>
          <span className="text-xs text-slate-500 hidden sm:inline">| 高管决策专用</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? '已复制报告' : '复制 Markdown'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下载报告</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>打印 / 导出 PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable One-Page Combat Report Card (Bento Container) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 relative overflow-hidden print:border-none print:shadow-none print:p-2 print:bg-white print:text-black">
        {/* Report Header */}
        <div className="border-b border-slate-100 print:border-slate-300 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI 投标顾问作战指挥中心 • 决策报告</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {overview.projectName}
              </h1>
            </div>

            <div className="text-xs text-slate-500 print:text-slate-600 text-left sm:text-right shrink-0">
              <div>生成时间：{report.timestamp || new Date().toLocaleString('zh-CN')}</div>
              <div className="font-mono font-semibold mt-0.5">项目编号：{overview.projectCode}</div>
            </div>
          </div>
        </div>

        {/* Strategic Recommendation Stamp / Banner */}
        <div className={`p-6 rounded-2xl border ${verdict.cardClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs print:border-slate-400 print:bg-slate-100`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <VerdictIcon className={`w-8 h-8 ${verdict.iconColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-500 uppercase">AI 顾问决策建议：</span>
                <span className={`px-3 py-1 rounded-xl text-sm sm:text-base font-extrabold border ${verdict.badgeClass}`}>
                  {verdict.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                {verdict.subtitle}
              </p>
            </div>
          </div>

          <div className="text-right self-end sm:self-center shrink-0 bg-white print:bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 block font-medium">预计综合分</span>
            <span className="text-2xl font-black text-blue-700 font-mono">
              {report.coreReasons.expectedScore}
            </span>
            <span className="text-xs text-slate-500 font-medium"> / {report.coreReasons.maxScore} 分</span>
          </div>
        </div>

        {/* 7 Core Reasons Breakdown List (Bento Grid) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            <span>核心研判依据（7项关键维度）：</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-sm">
            {/* 1. 资质匹配度 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">企业资质匹配度</span>
                <span className="font-bold text-slate-900">{report.coreReasons.qualificationMatchRate}%</span>
              </div>
            </div>

            {/* 2. 业绩匹配度 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">同类业绩匹配度</span>
                <span className="font-bold text-slate-900">{report.coreReasons.experienceMatchRate}%</span>
              </div>
            </div>

            {/* 3. 预计得分 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">专家预计综合得分</span>
                <span className="font-bold text-blue-700 font-mono">{report.coreReasons.expectedScore} 分 (满分 {report.coreReasons.maxScore} 分)</span>
              </div>
            </div>

            {/* 4. 优势项 */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-start gap-3 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <span className="font-semibold text-emerald-800 block mb-0.5">核心竞争优势项</span>
                <span className="font-medium text-slate-900">{report.coreReasons.primaryStrength}</span>
              </div>
            </div>

            {/* 5. 劣势项 */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex items-start gap-3 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                5
              </span>
              <div>
                <span className="font-semibold text-amber-800 block mb-0.5">主要劣势与短板</span>
                <span className="font-medium text-slate-900">{report.coreReasons.primaryWeakness}</span>
              </div>
            </div>

            {/* 6. 废标风险 */}
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 flex items-start gap-3 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                6
              </span>
              <div>
                <span className="font-semibold text-red-700 block mb-0.5">一票否决/废标核心隐患</span>
                <span className="font-medium text-slate-900">{report.coreReasons.maxDisqualificationRisk}</span>
              </div>
            </div>
          </div>

          {/* 7. 提分空间 */}
          <div className="mt-3.5 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
              7
            </span>
            <div>
              <span className="font-semibold text-blue-900 block mb-0.5">最大提分抓手与可冲刺空间</span>
              <span className="font-bold text-blue-950 text-sm">{report.coreReasons.maxScoreOpportunity}</span>
            </div>
          </div>
        </div>

        {/* Strategic Verdict Note */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-600 block mb-1.5 uppercase">
            【AI 首席顾问战略执导与攻坚指令】：
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {report.strategicVerdict}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 print:hidden">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回：标书体检</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>打印 / 导出 PDF 作战报告</span>
        </button>
      </div>
    </div>
  );
};

