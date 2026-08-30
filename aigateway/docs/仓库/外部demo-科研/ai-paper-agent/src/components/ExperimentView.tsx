import React, { useState } from 'react';
import { ExperimentProject } from '../types';
import { Figure1Plot, Figure2Heatmap } from './ScientificFigures';
import { 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Database, 
  Cpu, 
  TrendingUp, 
  BarChart3, 
  Table as TableIcon, 
  FileText,
  Sliders,
  ChevronRight,
  Info,
  Clock,
  Zap,
  Flame
} from 'lucide-react';

interface ExperimentViewProps {
  experiment: ExperimentProject;
  onGeneratePaper: () => void;
  isGenerating: boolean;
  hasGeneratedPaper: boolean;
  onViewPaper: () => void;
}

export const ExperimentView: React.FC<ExperimentViewProps> = ({
  experiment,
  onGeneratePaper,
  isGenerating,
  hasGeneratedPaper,
  onViewPaper,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'figures' | 'baselines' | 'parameters'>('overview');

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Card: Project Identity */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100 relative overflow-hidden">
        {/* Background decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>预置科研实验项目</span>
              </span>
              <span className="px-2.5 py-1 text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 rounded-lg">
                {experiment.domain}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {experiment.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {experiment.objective}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-slate-400 font-mono">
              <span>数据规模: {experiment.datasetSize}</span>
              <span>•</span>
              <span>基准数据集: {experiment.datasetName}</span>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
            <button
              onClick={onGeneratePaper}
              disabled={isGenerating}
              className="w-full px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>{hasGeneratedPaper ? '重新生成论文' : '生成论文 (Generate Paper)'}</span>
            </button>

            {hasGeneratedPaper && (
              <button
                onClick={onViewPaper}
                className="w-full px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center space-x-2 transition"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>进入论文正文查看</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Ready Assets Checklist bar from Prompt */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>已就绪实验资产 (准备用于 AI 论文生成)</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {[
              { label: '实验结果', sub: 'MAE 14.28 kW (提升 21.4%)' },
              { label: 'Figure 1', sub: '24小时负荷预测拟合曲线' },
              { label: 'Figure 2', sub: '时空交叉注意力热力图' },
              { label: 'Table 1', sub: '数据集特征与超参数表' },
              { label: 'Table 2', sub: '基准算法对比性能评测' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-2.5 flex items-start space-x-2 shadow-inner"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {experiment.metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md text-slate-100 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="truncate">{metric.name}</span>
              {metric.improvement && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  {metric.improvement}
                </span>
              )}
            </div>
            <div className="flex items-baseline space-x-1.5 my-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {metric.value}
              </span>
              {metric.unit && (
                <span className="text-xs font-medium text-slate-400 font-mono">
                  {metric.unit}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs for Deep Data Exploration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Navigation Tab Bar */}
        <div className="flex items-center space-x-1 p-2 bg-slate-950/70 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>核心结论与发现</span>
          </button>

          <button
            onClick={() => setActiveTab('figures')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'figures'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>实验图表 (Figure 1 & 2)</span>
          </button>

          <button
            onClick={() => setActiveTab('baselines')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'baselines'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>基准模型对比 (Table 2)</span>
          </button>

          <button
            onClick={() => setActiveTab('parameters')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'parameters'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>模型与实验参数 (Table 1)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>AI 提炼的核心实验结论与科研发现</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {experiment.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed flex items-start space-x-3 hover:border-slate-700 transition"
                    >
                      <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center font-mono font-bold flex-shrink-0 text-[11px]">
                        0{idx + 1}
                      </span>
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Peek of Figure 1 */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>实验结果拟合效果预览 (Figure 1 24小时负荷曲线)</span>
                </h3>
                <Figure1Plot showConfidenceInterval={true} />
              </div>
            </div>
          )}

          {activeTab === 'figures' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Figure1Plot showConfidenceInterval={true} />
                <p className="mt-2 text-xs text-slate-400 italic">
                  {experiment.figures[0]?.caption}
                </p>
              </div>

              <div>
                <Figure2Heatmap />
                <p className="mt-2 text-xs text-slate-400 italic">
                  {experiment.figures[1]?.caption}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'baselines' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">
                  Table 2. UrbanEV-ChargeBench 上的定量基准模型评测
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  评测机制: 5折交叉验证 (5-Fold Cross Validation)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">模型架构 (Model)</th>
                      <th className="px-4 py-3">MAE (kW) ↓</th>
                      <th className="px-4 py-3">RMSE (kW) ↓</th>
                      <th className="px-4 py-3">MAPE (%) ↓</th>
                      <th className="px-4 py-3">推理时延 (ms)</th>
                      <th className="px-4 py-3">统计显著性 (p-value)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {experiment.baselines.map((b, idx) => (
                      <tr 
                        key={idx}
                        className={b.isOurs ? 'bg-blue-950/40 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800/40'}
                      >
                        <td className="px-4 py-3 font-sans flex items-center space-x-2">
                          <span>{b.model}</span>
                          {b.isOurs && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded">
                              本文提出 (Ours)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">{b.mae.toFixed(2)}</td>
                        <td className="px-4 py-3">{b.rmse.toFixed(2)}</td>
                        <td className="px-4 py-3">{b.mape.toFixed(2)}%</td>
                        <td className="px-4 py-3">{b.inferenceTimeMs.toFixed(1)} ms</td>
                        <td className="px-4 py-3 text-slate-400">{b.pValVsOurs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300 font-semibold">
                Table 1. 实验配置与网络超参数表
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {experiment.parameters.map((param, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs flex flex-col justify-between"
                  >
                    <span className="text-slate-400 font-mono text-[11px] mb-1">{param.key}</span>
                    <span className="text-slate-100 font-medium">{param.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
