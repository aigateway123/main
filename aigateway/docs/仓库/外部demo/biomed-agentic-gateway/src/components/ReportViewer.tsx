import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Bookmark, 
  Microscope,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AnalysisReport, StatGroupResult, OutlierItem, HypothesisTestResult, BiomedicalDataset } from '../types';

interface ReportViewerProps {
  report: AnalysisReport | null;
  dataset: BiomedicalDataset;
  groupStats: StatGroupResult[];
  outliers: OutlierItem[];
  hypothesisTests: HypothesisTestResult[];
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  dataset,
  groupStats,
  outliers,
  hypothesisTests,
}) => {
  if (!report) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
        <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
        <p>正在生成科研分析报告，请稍候...</p>
      </div>
    );
  }

  const primaryTest = hypothesisTests[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Report Header Bar */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-blue-600/30 border border-blue-500/40 text-blue-400">
              <Microscope className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-bold">
              Peer-Review Statistical Report
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <span>生成时间: {new Date(report.generatedAt).toLocaleString()}</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Award className="w-3.5 h-3.5" /> 可复现性评分: {report.reproducibilityScore}%
            </span>
          </div>
        </div>

        {/* Executive Headline Highlight */}
        <h2 className="text-base sm:text-lg font-bold text-white leading-snug tracking-tight">
          {report.executiveSummary}
        </h2>
      </div>

      {/* Main Report Body */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Sleek Analytical Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Primary Finding */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Bookmark className="w-3 h-3 text-blue-600" />
                Primary Finding
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-1">
                {report.primaryFinding.groupA} 相比 {report.primaryFinding.groupB} 表现出{' '}
                <span className="text-blue-600 font-bold">
                  {report.primaryFinding.percentChange >= 0 ? `+${report.primaryFinding.percentChange}%` : `${report.primaryFinding.percentChange}%`}
                </span>{' '}
                的平均响应变化。
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between">
              <span>显著性检验:</span>
              <span className="font-bold text-blue-700">{report.primaryFinding.pValueText}</span>
            </div>
          </div>

          {/* Card 2: Anomaly Alert */}
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Anomaly Alert
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-1">
                {outliers.length > 0
                  ? `检出 ${outliers.length} 个显著偏离样本点，疑似移液/蒸发等非系统误差`
                  : '未检出超出 3σ 置信区间的异常离群样本'}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-3 pt-2 border-t border-amber-200/60 truncate">
              {outliers.length > 0 ? `样本 ID: ${outliers.slice(0, 3).map((o) => o.id).join(', ')}` : '数据分布均匀且稳定'}
            </div>
          </div>

          {/* Card 3: Traceability & Model */}
          <div className="p-4 border border-slate-200 bg-slate-50 rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mb-1 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-slate-500" />
                Statistical Traceability
              </div>
              <div className="text-xs text-slate-700 mt-2 flex flex-col gap-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-semibold text-slate-800">{primaryTest ? primaryTest.testMethod : "Welch's ANOVA"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence:</span>
                  <span className="font-semibold text-slate-800">95% CI (α=0.05)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Effect Size:</span>
                  <span className="font-semibold text-blue-600">{primaryTest ? `${primaryTest.effectSizeName} = ${primaryTest.effectSizeValue}` : "d = 1.42"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Anomaly Diagnostics & Outlier Flag Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-3.5 bg-amber-500 rounded-xs inline-block" />
              <h3 className="text-sm font-bold text-slate-800">
                异常样本检测与实验溯源 (Outlier & Anomaly Isolation)
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              共检出 <span className="font-bold text-rose-600">{outliers.length}</span> 个显著偏离样本
            </span>
          </div>

          {outliers.length > 0 ? (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">样本编码 (Sample ID)</th>
                    <th className="py-2.5 px-3">所属实验组</th>
                    <th className="py-2.5 px-3">检测实测值</th>
                    <th className="py-2.5 px-3">Z-Score 偏离度</th>
                    <th className="py-2.5 px-3">严重级别</th>
                    <th className="py-2.5 px-3">AI 判定疑似实验室成因</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outliers.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{o.id}</td>
                      <td className="py-2.5 px-3 text-slate-600">{o.group}</td>
                      <td className="py-2.5 px-3 font-semibold text-rose-600">{o.value}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {o.zScore > 0 ? `+${o.zScore}` : o.zScore}σ
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.severity === 'high'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {o.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{o.suspectedCause}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-amber-50/50 border-t border-slate-200 text-xs text-amber-900">
                <span className="font-semibold">💡 实验复核建议: </span>
                {report.anomalySummary.actionableAdvice}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>所有样本数据均分布在正常 3σ 概率置信区间内，未发现显著技术性离群点。</span>
            </div>
          )}
        </div>

        {/* Section 2: Summary Statistics Table */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-xs inline-block" />
            <h3 className="text-sm font-bold text-slate-800">
              各实验组描述性统计汇总表 (Group Summary Statistics)
            </h3>
          </div>
          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">实验组别 (Condition)</th>
                  <th className="py-2.5 px-3 text-right">样本量 (N)</th>
                  <th className="py-2.5 px-3 text-right">均值 (Mean)</th>
                  <th className="py-2.5 px-3 text-right">标准差 (SD)</th>
                  <th className="py-2.5 px-3 text-right">均值标准误 (SEM)</th>
                  <th className="py-2.5 px-3 text-right">中位数 (Median)</th>
                  <th className="py-2.5 px-3 text-right">95% 置信区间 (95% CI)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupStats.map((grp) => (
                  <tr key={grp.groupName} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-800">{grp.groupName}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">{grp.count}</td>
                    <td className="py-2 px-3 text-right font-bold text-blue-900">{grp.mean}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">±{grp.std}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">±{grp.sem}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">{grp.median}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">
                      [{grp.ci95[0]}, {grp.ci95[1]}]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Hypothesis Testing & Statistical Significance */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-1.5 h-3.5 bg-emerald-600 rounded-xs inline-block" />
            <h3 className="text-sm font-bold text-slate-800">
              假设检验与推断统计学指标 (Hypothesis Testing & Significance)
            </h3>
          </div>
          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">检验对比</th>
                  <th className="py-2.5 px-3">统计检验方法</th>
                  <th className="py-2.5 px-3 text-right">检验统计量</th>
                  <th className="py-2.5 px-3 text-right">P 值 (P-value)</th>
                  <th className="py-2.5 px-3 text-right">效应量 (Effect Size)</th>
                  <th className="py-2.5 px-3 text-center">显著性等级</th>
                  <th className="py-2.5 px-3">统计结论</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hypothesisTests.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{t.comparison}</td>
                    <td className="py-2.5 px-3 text-slate-600">{t.testMethod}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {t.statisticName} = {t.statisticValue}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                      {t.pValue < 0.0001 ? '< 0.0001' : t.pValue}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {t.effectSizeName}: {t.effectSizeValue}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.significanceLevel !== 'ns'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {t.significanceLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate" title={t.conclusion}>
                      {t.conclusion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Detailed Biological Interpretation & Methodology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Microscope className="w-3.5 h-3.5 text-blue-600" />
              生物学机制与科研转化解读
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {report.biologicalInterpretation}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              方法学与统计严谨性质控说明
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {report.methodologyNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
