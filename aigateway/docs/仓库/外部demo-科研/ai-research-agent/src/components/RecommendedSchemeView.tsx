import React, { useState } from 'react';
import { Target, Cpu, CheckSquare, BarChart3, Layers, Sparkles, BookOpen, GitBranch, ArrowRight } from 'lucide-react';
import { RecommendedScheme } from '../types';

interface RecommendedSchemeViewProps {
  scheme: RecommendedScheme;
  onExploreAction?: (actionType: 'experiment' | 'literature' | 'coding' | 'plan') => void;
}

export const RecommendedSchemeView: React.FC<RecommendedSchemeViewProps> = ({
  scheme,
  onExploreAction,
}) => {
  const [activeBaselineTab, setActiveBaselineTab] = useState<string>(scheme.baselineModels[0]?.name || 'LSTM');

  return (
    <section id="recommended-scheme-section" className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <Target className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                AI Formulated Research Blueprint
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              推荐研究方案 (Recommended Research Scheme)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              AI 自动提炼的科学假说、基准架构对比矩阵、多模态新增变量与量化评估体系
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExploreAction?.('experiment')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <Cpu className="h-3.5 w-3.5" />
              生成深度实验方案
            </button>
          </div>
        </div>

        {/* Core Research Question Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Research Question (核心科学问题)</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-4">
              “{scheme.researchQuestion}”
            </h3>
            
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-indigo-300">科学假说 (Hypothesis)：</span>
                <span className="text-slate-300 line-clamp-2">{scheme.hypothesis}</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono whitespace-nowrap">
                Reviewer 评级: 96/100 (顶会立项标准)
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid: Baseline | Added Variables | Evaluation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pillar 1: Baselines */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">
                    01
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    Baseline (基准模型)
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">5 大对照体系</span>
              </div>

              {/* Baseline Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {scheme.baselineModels.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => setActiveBaselineTab(b.name)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeBaselineTab === b.name
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {/* Active Baseline Details */}
              {(() => {
                const current =
                  scheme.baselineModels.find((b) => b.name === activeBaselineTab) ||
                  scheme.baselineModels[0];
                if (!current) return null;
                return (
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        {current.name}
                      </span>
                      <span className="text-[11px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {current.category}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700 block mb-0.5">
                        ✓ 核心优势 (Strength)：
                      </span>
                      <p className="text-slate-600 leading-relaxed">{current.strength}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-rose-700 block mb-0.5">
                        ✗ 固有局限 (Weakness)：
                      </span>
                      <p className="text-slate-600 leading-relaxed">{current.weakness}</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>基线涵盖 RNN / GNN / Transformer</span>
              <span className="text-blue-600 font-semibold font-mono">已就绪</span>
            </div>
          </div>

          {/* Pillar 2: Added Variables */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-xs">
                    02
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    新增变量 (Added Variables)
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">5 维多模态输入</span>
              </div>

              <div className="space-y-2.5">
                {scheme.addedVariables.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs">
                        {v.name}
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded">
                        {v.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{v.importance}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>包含气象、电价与地理拓扑</span>
              <span className="text-amber-600 font-semibold font-mono">时空张量对齐</span>
            </div>
          </div>

          {/* Pillar 3: Evaluation Metrics */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs">
                    03
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    Evaluation (评估指标)
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">学术顶刊标准</span>
              </div>

              <div className="space-y-2.5">
                {scheme.evaluations.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {ev.metric}
                        </span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">
                          {ev.fullName}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {ev.description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono text-xs font-bold">
                        {ev.targetValue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>覆盖全网平均与极端尖峰误差</span>
              <span className="text-emerald-600 font-semibold font-mono">全面评估</span>
            </div>
          </div>
        </div>

        {/* Technical Roadmap Stepper */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-indigo-600" />
              <h4 className="text-base font-bold text-slate-900">
                技术路线图 (Technical Roadmap)
              </h4>
            </div>
            <span className="text-xs text-slate-500 font-mono">4-Stage Pipeline</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {scheme.technicalRoadmap.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl bg-slate-50 p-4 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                    {item.step}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-2">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.methods}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
