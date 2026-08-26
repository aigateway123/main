import React from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Lightbulb, 
  Table, 
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { ResearchPaper } from '../types';

interface ResultComparisonViewProps {
  currentPaper: ResearchPaper;
  onProceedToCharts: () => void;
  onAskSupervisor: (query: string) => void;
}

export const ResultComparisonView: React.FC<ResultComparisonViewProps> = ({
  currentPaper,
  onProceedToCharts,
  onAskSupervisor
}) => {
  const analysis = currentPaper.discrepancyAnalysis;
  const paperTable = currentPaper.paperTable2;
  const reproRow = currentPaper.reproducedTable2[0];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-300">
      
      {/* Top Banner: Scientific Reproduction Score */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-[#161923] to-[#161923] border border-cyan-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                科研实验复现对比与归因分析报告 (Table 2 vs Reproduced)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                可复现性评分: {analysis.overallMatchScore}%
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
              {analysis.summary}
            </p>
          </div>
        </div>

        <button
          onClick={onProceedToCharts}
          className="self-start md:self-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all hover:scale-105"
        >
          <span>生成论文图表 & LaTeX</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Benchmark Comparison Table (Table 2 in Paper) */}
      <div className="bg-[#161923] border border-white/10 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              {currentPaper.experimentPlan.targetTable} 对比总览
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            * 绿色高亮行表示本次 Agent 自动复现结果
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#0E1018] text-slate-300 border-b border-white/10 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Model / Method</th>
                <th colSpan={2} className="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-cyan-300">
                  Horizon 96
                </th>
                <th colSpan={2} className="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-cyan-300">
                  Horizon 192
                </th>
                <th colSpan={2} className="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-cyan-300">
                  Horizon 336
                </th>
                <th colSpan={2} className="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-cyan-300">
                  Horizon 720
                </th>
                <th colSpan={2} className="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-emerald-400">
                  Average
                </th>
              </tr>
              <tr className="bg-[#0A0B10] text-slate-400 border-b border-white/10 text-[10px] font-mono">
                <th className="py-1 px-3"></th>
                <th className="py-1 px-2 text-center border-l border-white/10">MSE</th>
                <th className="py-1 px-2 text-center">MAE</th>
                <th className="py-1 px-2 text-center border-l border-white/10">MSE</th>
                <th className="py-1 px-2 text-center">MAE</th>
                <th className="py-1 px-2 text-center border-l border-white/10">MSE</th>
                <th className="py-1 px-2 text-center">MAE</th>
                <th className="py-1 px-2 text-center border-l border-white/10">MSE</th>
                <th className="py-1 px-2 text-center">MAE</th>
                <th className="py-1 px-2 text-center border-l border-white/10 font-bold text-slate-300">MSE</th>
                <th className="py-1 px-2 text-center font-bold text-slate-300">MAE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {paperTable.map((row, idx) => {
                const isPaperOurs = row.isOurs;
                return (
                  <tr 
                    key={idx} 
                    className={`hover:bg-white/5 transition-colors ${
                      isPaperOurs ? 'bg-indigo-950/30 font-semibold text-indigo-200' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 font-sans font-medium text-white flex items-center gap-1.5">
                      {isPaperOurs && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      {row.model}
                    </td>
                    <td className="py-2 px-2 text-center border-l border-white/5">{row.h96_mse.toFixed(3)}</td>
                    <td className="py-2 px-2 text-center">{row.h96_mae.toFixed(3)}</td>
                    <td className="py-2 px-2 text-center border-l border-white/5">{row.h192_mse.toFixed(3)}</td>
                    <td className="py-2 px-2 text-center">{row.h192_mae.toFixed(3)}</td>
                    <td className="py-2 px-2 text-center border-l border-white/5">{row.h336_mse.toFixed(3)}</td>
                    <td className="py-2 px-2 text-center">{row.h336_mae.toFixed(3)}</td>
                    <td className="py-2 px-2 text-center border-l border-white/5">{row.h720_mse.toFixed(3)}</td>
                    <td className="py-2 px-2 text-center">{row.h720_mae.toFixed(3)}</td>
                    <td className="py-2 px-2 text-center border-l border-white/5 font-bold text-white">{row.avg_mse.toFixed(3)}</td>
                    <td className="py-2 px-2 text-center font-bold text-white">{row.avg_mae.toFixed(3)}</td>
                  </tr>
                );
              })}

              {/* Reproduced Ours Row (Highlighted) */}
              {reproRow && (
                <tr className="bg-cyan-950/30 border-t-2 border-cyan-400 font-semibold text-cyan-200">
                  <td className="py-2.5 px-3 font-sans font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    {reproRow.model}
                  </td>
                  <td className="py-2.5 px-2 text-center border-l border-white/5 text-cyan-300 font-bold">{reproRow.h96_mse.toFixed(3)}</td>
                  <td className="py-2.5 px-2 text-center text-cyan-300">{reproRow.h96_mae.toFixed(3)}</td>
                  <td className="py-2.5 px-2 text-center border-l border-white/5 text-cyan-300">{reproRow.h192_mse.toFixed(3)}</td>
                  <td className="py-2.5 px-2 text-center text-cyan-300">{reproRow.h192_mae.toFixed(3)}</td>
                  <td className="py-2.5 px-2 text-center border-l border-white/5 text-cyan-300">{reproRow.h336_mse.toFixed(3)}</td>
                  <td className="py-2.5 px-2 text-center text-cyan-300">{reproRow.h336_mae.toFixed(3)}</td>
                  <td className="py-2.5 px-2 text-center border-l border-white/5 text-cyan-300">{reproRow.h720_mse.toFixed(3)}</td>
                  <td className="py-2.5 px-2 text-center text-cyan-300">{reproRow.h720_mae.toFixed(3)}</td>
                  <td className="py-2.5 px-2 text-center border-l border-white/5 font-bold text-cyan-300">{reproRow.avg_mse.toFixed(3)}</td>
                  <td className="py-2.5 px-2 text-center font-bold text-cyan-300">{reproRow.avg_mae.toFixed(3)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Metric Horizon Delta Breakdown & Deep Discrepancy Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Per-Metric Delta Tolerances */}
        <div className="space-y-4">
          <div className="bg-[#161923] border border-white/10 rounded-xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>细分步长误差偏差容限 (Delta Analysis)</span>
            </h3>
            
            <div className="space-y-2 text-xs">
              {analysis.metricsComparison.map((m, i) => (
                <div 
                  key={i} 
                  className="bg-[#0A0B10] p-2.5 rounded-lg border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{m.metric}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      原论文: {m.paperVal} | 复现: {m.reproVal}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      +{m.deltaPercent}%
                    </span>
                    <div className="text-[9px] text-emerald-400/80 mt-0.5">置信区间内</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Deep Scientific Root-Cause Discrepancy Diagnostics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#161923] border border-white/10 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  差异成因深度归因 (Root-Cause Discrepancy Diagnostics)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                AI 科研诊断结论
              </span>
            </div>

            <div className="space-y-3">
              {analysis.reasons.map((reason, idx) => (
                <div 
                  key={idx}
                  className="bg-[#0A0B10] border border-white/5 hover:border-cyan-400/30 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {reason.factor}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      reason.probability === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}>
                      相关度: {reason.probability}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-2.5">
                    {reason.explanation}
                  </p>

                  <div className="bg-[#161923] border border-white/10 rounded-lg p-2.5 text-[11px] text-cyan-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">优化与收敛建议: </span>
                      {reason.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Supervisor Call */}
            <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <span className="text-slate-300">
                需要针对上述成因调整实验参数或运行消融实验？
              </span>
              <button
                onClick={() => onAskSupervisor('按照诊断建议，帮我优化 config.yaml 消除这 1.3% 的微小偏差')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all hover:scale-105"
              >
                智能优化超参
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
