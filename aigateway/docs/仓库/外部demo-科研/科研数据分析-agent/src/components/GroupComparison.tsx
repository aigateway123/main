import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  ErrorBar
} from 'recharts';
import { BarChart3, Copy, Check, Table2, Info } from 'lucide-react';
import { GroupStat } from '../types';
import { GROUP_STATS } from '../data/mockData';

interface GroupComparisonProps {
  stats?: GroupStat[];
  onInsertFigure?: (figName: string) => void;
}

export const GroupComparison: React.FC<GroupComparisonProps> = ({
  stats = GROUP_STATS,
}) => {
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [showTable, setShowTable] = useState(true);

  // Formatted data for Recharts Bar with error bar values
  const chartData = stats.map((item) => ({
    groupKey: `Group ${item.group}`,
    groupLetter: item.group,
    fullName: item.name,
    score: item.score,
    error: [item.stdDev, item.stdDev], // error bar ±SD
    ci95Text: `[${item.ci95[0]}, ${item.ci95[1]}]`,
    sampleCount: item.sampleCount.toLocaleString(),
  }));

  const copyLatexTable = () => {
    const latex = `\\begin{table}[htbp]
\\centering
\\caption{Performance comparison among experimental groups A, B, and C (Mean $\\pm$ SD, 95\\% CI)}
\\label{tab:group-performance}
\\begin{tabular}{lcccc}
\\hline
\\textbf{Group} & \\textbf{Sample Size (n)} & \\textbf{Performance Mean $\\pm$ SD} & \\textbf{95\\% CI} & \\textbf{Relative Gain} \\\\
\\hline
Group A (Baseline) & 62,140 & $78.4 \\pm 4.8$ & $[77.2, 79.6]$ & Ref. (0.0\\%) \\\\
Group B (Optimized) & 62,140 & $84.7 \\pm 3.9$ & $[83.8, 85.6]$ & $+8.04\\%^{***}$ \\\\
Group C (Enhanced) & 62,140 & $91.2 \\pm 3.1$ & $[90.5, 91.9]$ & $+16.33\\%^{***}$ \\\\
\\hline
\\multicolumn{5}{l}{\\footnotesize $^{***} p < 0.001$ versus baseline, one-way ANOVA with Tukey's HSD test.}
\\end{tabular}
\\end{table}`;
    navigator.clipboard.writeText(latex);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  return (
    <section className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">
            实验组性能对比 (Average Score)
          </h3>
          <p className="text-xs text-[#94a3b8] mt-0.5 pl-3">
            单因素方差分析 F(2, 186417) = 428.6，组间均值呈梯次显著上升 (p &lt; 0.001)
          </p>
        </div>

        {/* Quick Highlights Summary Badges */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded bg-black/40 border border-[#1e293b] text-xs text-blue-400 font-mono">
            A: 78.4 | B: 84.7 | <span className="font-bold text-white">C: 91.2</span>
          </div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="px-2.5 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-slate-300 hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Table2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{showTable ? '收起参数表' : '统计参数表'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Left / Chart Area */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-black/40 rounded-xl border border-[#1e293b] p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-400" /> 组间性能均值对比 (Mean ± SD)
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded border border-[#334155] bg-black/30 font-mono text-[#94a3b8]">PDF</span>
                <span className="px-2 py-0.5 rounded border border-[#334155] bg-black/30 font-mono text-[#94a3b8]">SVG</span>
                <span className="text-[#64748b] font-mono">N = 186,420</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="groupKey" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    domain={[60, 100]} 
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#0f172a] border border-[#1e293b] p-3 rounded-lg shadow-xl text-xs font-mono text-white space-y-1">
                            <div className="font-bold text-blue-400">{data.fullName}</div>
                            <div>均值 (Score): <span className="text-white font-bold">{data.score}</span></div>
                            <div>标准差 (±SD): <span className="text-[#94a3b8]">±{data.error[0]}</span></div>
                            <div>95% 置信区间: <span className="text-[#94a3b8]">{data.ci95Text}</span></div>
                            <div className="text-[10px] text-[#64748b] pt-1">样本量: {data.sampleCount}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={48}>
                    <Cell fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.6)" />
                    <Cell fill="rgba(59, 130, 246, 0.6)" stroke="rgba(59, 130, 246, 0.8)" />
                    <Cell fill="#3b82f6" stroke="#60a5fa" />
                    <ErrorBar dataKey="error" width={10} strokeWidth={2} stroke="#94a3b8" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* In-chart Score Labels */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#1e293b]">
              <div className="p-1.5 rounded bg-black/40 border border-[#1e293b]">
                <div className="text-[10px] text-[#64748b]">Group A</div>
                <div className="text-sm font-mono font-bold text-white">78.4 <span className="text-[10px] text-[#64748b]">±4.8</span></div>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-[#1e293b]">
                <div className="text-[10px] text-[#64748b]">Group B</div>
                <div className="text-sm font-mono font-bold text-blue-400">84.7 <span className="text-[10px] text-[#64748b]">±3.9</span></div>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-[#1e293b]">
                <div className="text-[10px] text-[#64748b]">Group C</div>
                <div className="text-sm font-mono font-bold text-emerald-400">91.2 <span className="text-[10px] text-[#64748b]">±3.1</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Statistical Analysis & Parameters */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div className="bg-black/40 rounded-xl border border-[#1e293b] p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> 组间统计检验指标 (ANOVA)
              </span>
              <button
                onClick={copyLatexTable}
                className="text-[10px] text-[#94a3b8] hover:text-white flex items-center gap-1 bg-[#0f172a] px-2 py-1 rounded border border-[#1e293b] transition-colors cursor-pointer"
                title="一键复制 LaTeX 表格代码"
              >
                {copiedLatex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLatex ? '已复制 LaTeX' : '复制 LaTeX 表格'}</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-between">
                <span className="text-[#94a3b8]">组 C 相对提升 (Gain vs A):</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">+16.3% (p &lt; 0.001)</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-between">
                <span className="text-[#94a3b8]">效应量 (Cohen's d):</span>
                <span className="font-mono font-bold text-white">d = 3.18 (极高效应量)</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-between">
                <span className="text-[#94a3b8]">方差齐性检验 (Levene):</span>
                <span className="font-mono text-slate-300">W = 1.12 (p = 0.326, 齐性满足)</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-between">
                <span className="text-[#94a3b8]">事后多重比较 (Tukey HSD):</span>
                <span className="font-mono text-blue-400">A vs B (p&lt;0.001), B vs C (p&lt;0.001)</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-[11px] text-[#cbd5e1] leading-relaxed">
              <span className="text-blue-400 font-semibold">推断结论：</span> 实验组 C 的均值置信区间无重叠，证实强化体系相较于传统优化（组 B）具有质的跃升，而非单一调参的线性外推。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
