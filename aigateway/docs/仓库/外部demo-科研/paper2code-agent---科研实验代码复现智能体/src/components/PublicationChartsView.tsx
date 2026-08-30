import React, { useState } from 'react';
import { 
  LineChart as LucideLineChart, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  FileCode, 
  Table, 
  BarChart3,
  ExternalLink,
  Code2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { ResearchPaper } from '../types';

interface PublicationChartsViewProps {
  currentPaper: ResearchPaper;
}

export const PublicationChartsView: React.FC<PublicationChartsViewProps> = ({
  currentPaper
}) => {
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'latex' | 'python'>('latex');

  const analysis = currentPaper.discrepancyAnalysis;

  // Chart data preparing multi-horizon comparison
  const horizonChartData = [
    { horizon: 'H=96', Informer: 0.300, Autoformer: 0.266, FedFormer: 0.217, DLinear: 0.176, 'PatchTST (Paper)': 0.149, 'PatchTST (Ours)': 0.151 },
    { horizon: 'H=192', Informer: 0.598, Autoformer: 0.307, FedFormer: 0.276, DLinear: 0.220, 'PatchTST (Paper)': 0.194, 'PatchTST (Ours)': 0.196 },
    { horizon: 'H=336', Informer: 0.578, Autoformer: 0.359, FedFormer: 0.339, DLinear: 0.265, 'PatchTST (Paper)': 0.245, 'PatchTST (Ours)': 0.247 },
    { horizon: 'H=720', Informer: 1.059, Autoformer: 0.419, FedFormer: 0.403, DLinear: 0.323, 'PatchTST (Paper)': 0.314, 'PatchTST (Ours)': 0.318 },
  ];

  const pythonPlotScript = `"""
Publication Figure Generator for Paper Reproduction
Generates IEEE / NeurIPS / ICLR style vector PDF & PNG plots.
"""
import matplotlib.pyplot as plt
import numpy as np

# Set publication style
plt.style.use('seaborn-v0_8-paper' if 'seaborn-v0_8-paper' in plt.style.available else 'default')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 11

horizons = ['H=96', 'H=192', 'H=336', 'H=720']
informer = [0.300, 0.598, 0.578, 1.059]
autoformer = [0.266, 0.307, 0.359, 0.419]
fedformer = [0.217, 0.276, 0.339, 0.403]
dlinear = [0.176, 0.220, 0.265, 0.323]
patchtst_paper = [0.149, 0.194, 0.245, 0.314]
patchtst_repro = [0.151, 0.196, 0.247, 0.318]

x = np.arange(len(horizons))
width = 0.13

fig, ax = plt.subplots(figsize=(8, 4.5), dpi=300)
ax.bar(x - 2.5*width, informer, width, label='Informer (AAAI 21)', color='#94a3b8')
ax.bar(x - 1.5*width, autoformer, width, label='Autoformer (NeurIPS 21)', color='#64748b')
ax.bar(x - 0.5*width, fedformer, width, label='FedFormer (ICML 22)', color='#475569')
ax.bar(x + 0.5*width, dlinear, width, label='DLinear (AAAI 23)', color='#f59e0b')
ax.bar(x + 1.5*width, patchtst_paper, width, label='PatchTST (Reported)', color='#3b82f6')
ax.bar(x + 2.5*width, patchtst_repro, width, label='PatchTST (Reproduced Ours)', color='#10b981', hatch='//')

ax.set_ylabel('Multivariate MSE Loss (Lower is Better)')
ax.set_title('Weather Benchmark: Paper Reported vs. Reproduced Comparison across Horizons')
ax.set_xticks(x)
ax.set_xticklabels(horizons)
ax.legend(frameon=True, facecolor='white', framealpha=0.9, loc='upper left')
ax.grid(axis='y', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.savefig('results/figure_reproduction_comparison.pdf', bbox_inches='tight')
plt.savefig('results/figure_reproduction_comparison.png', bbox_inches='tight', dpi=300)
print("[✓] High-res publication plots saved to results/figure_reproduction_comparison.pdf")
`;

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(analysis.latexTableCode);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(pythonPlotScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-300">
      
      {/* Top Banner */}
      <div className="bg-[#161923] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">
              出版级科研图表与 Overleaf LaTeX 代码生成
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            自动将复现数据格式化为顶级会议 (NeurIPS/ICLR/CVPR/IEEE) 标准矢量图与 Booktabs 表格代码。
          </p>
        </div>

        <button
          onClick={handleCopyLatex}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5 transition-all hover:scale-105"
        >
          {copiedLatex ? <Check className="w-3.5 h-3.5 text-cyan-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedLatex ? '已复制 LaTeX 代码' : '一键复制 LaTeX 表格 (Overleaf)'}</span>
        </button>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-[#161923] border border-white/10 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <LucideLineChart className="w-4 h-4 text-cyan-400" />
              <span>多预测步长 MSE 对比柱状图 (Multivariate Long-term Forecasting Benchmark)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              对比基准方法与原论文指标，数值越低（MSE 越小）代表预测精度越高。
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
            Weather Dataset
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={horizonChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1C24" />
              <XAxis dataKey="horizon" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161923', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Informer" fill="#475569" />
              <Bar dataKey="Autoformer" fill="#64748b" />
              <Bar dataKey="FedFormer" fill="#0ea5e9" />
              <Bar dataKey="DLinear" fill="#f59e0b" />
              <Bar dataKey="PatchTST (Paper)" fill="#818cf8" />
              <Bar dataKey="PatchTST (Ours)" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Code Export: LaTeX vs Matplotlib Python Script */}
      <div className="bg-[#161923] border border-white/10 rounded-xl overflow-hidden shadow-sm">
        
        {/* Tab switcher */}
        <div className="bg-[#0E1018] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('latex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'latex'
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>LaTeX Table Code (Overleaf)</span>
            </button>

            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'python'
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Matplotlib 出图脚本 (Python)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'latex' ? (
              <button
                onClick={handleCopyLatex}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs transition-colors"
              >
                {copiedLatex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>{copiedLatex ? '已复制' : '复制 LaTeX'}</span>
              </button>
            ) : (
              <button
                onClick={handleCopyScript}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs transition-colors"
              >
                {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>{copiedScript ? '已复制' : '复制 Python 脚本'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-[#0A0B10] font-mono text-xs text-slate-300 overflow-x-auto max-h-96">
          <pre className="whitespace-pre">
            {activeTab === 'latex' ? analysis.latexTableCode : pythonPlotScript}
          </pre>
        </div>

      </div>

    </div>
  );
};
