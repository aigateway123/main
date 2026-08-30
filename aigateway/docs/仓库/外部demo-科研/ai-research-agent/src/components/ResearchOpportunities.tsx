import React, { useState } from 'react';
import { Star, Flame, Sparkles, ChevronRight, Database, Cpu, Target, Layers, ArrowUpRight } from 'lucide-react';
import { ResearchOpportunity } from '../types';

interface ResearchOpportunitiesProps {
  opportunities: ResearchOpportunity[];
  onSelectOpportunity?: (opp: ResearchOpportunity) => void;
  onExploreAction?: (actionType: 'experiment' | 'literature' | 'coding' | 'plan', oppTitle: string) => void;
}

export const ResearchOpportunities: React.FC<ResearchOpportunitiesProps> = ({
  opportunities,
  onSelectOpportunity,
  onExploreAction,
}) => {
  const [selectedId, setSelectedId] = useState<string>(opportunities[0]?.id || 'opp-01');

  // Star rendering helper: 5 stars with solid yellow vs gray
  const renderStars = (score: number, max = 5) => {
    return (
      <div className="flex items-center gap-0.5" title={`${score}/${max} 分`}>
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < score
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="research-opportunity-section" className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Flame className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Opportunity Matrix
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Research Opportunity (研究机会矩阵)
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              经多智能体学术文献挖掘与空白识别，系统提炼出以下 3 项高学术价值突破方向
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>综合评审打分机制（5分制）</span>
          </div>
        </div>

        {/* 3 Directions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {opportunities.map((opp, idx) => {
            const isSelected = selectedId === opp.id;
            return (
              <div
                key={opp.id}
                onClick={() => {
                  setSelectedId(opp.id);
                  onSelectOpportunity?.(opp);
                }}
                className={`group relative rounded-3xl border p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 shadow-xl shadow-indigo-600/5'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                {/* Direction Badge */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center rounded-lg bg-indigo-100/80 px-2.5 py-1 text-xs font-bold text-indigo-900">
                      {opp.code}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Opportunity #{idx + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-1">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mb-4">
                    {opp.subtitle}
                  </p>

                  {/* Star Ratings Box */}
                  <div className="space-y-2.5 rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">研究价值</span>
                      {renderStars(opp.ratings.researchValue)}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">创新空间</span>
                      {renderStars(opp.ratings.innovationSpace)}
                    </div>
                    {opp.ratings.dataAvailability && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">数据可获得性</span>
                        {renderStars(opp.ratings.dataAvailability)}
                      </div>
                    )}
                    {opp.ratings.experimentDifficulty && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">实验难度</span>
                        {renderStars(opp.ratings.experimentDifficulty)}
                      </div>
                    )}
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {opp.description}
                  </p>
                </div>

                {/* Tags and Action */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {opp.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(opp.id);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{isSelected ? '已选为当前主攻方案' : '查看方案拆解'}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Panel for Selected Direction */}
        {(() => {
          const current = opportunities.find((o) => o.id === selectedId) || opportunities[0];
          if (!current) return null;

          return (
            <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/30 via-white to-slate-50 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      深度机会拆解
                    </span>
                    <span className="text-sm font-bold text-slate-900">{current.code}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {current.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{current.subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onExploreAction?.('experiment', current.title)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
                  >
                    <Target className="h-3.5 w-3.5" />
                    生成实验方案
                  </button>
                  <button
                    onClick={() => onExploreAction?.('coding', current.title)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-md hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Cpu className="h-3.5 w-3.5" />
                    创建 Coding 实验
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs">
                {/* Breakthrough */}
                <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>核心突破点 (Breakthrough)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{current.breakthroughPoint}</p>
                </div>

                {/* Challenges */}
                <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <Layers className="h-4 w-4 text-rose-500" />
                    <span>关键挑战 (Key Challenges)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                    {current.keyChallenges.map((ch, cIdx) => (
                      <li key={cIdx} className="line-clamp-2">
                        {ch}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dataset & Models */}
                <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <span>推荐数据集与模型</span>
                  </div>
                  <p className="text-slate-600 mb-2">
                    <span className="font-semibold text-slate-800">数据源：</span>
                    {current.recommendedDataset}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {current.recommendedModels.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};
