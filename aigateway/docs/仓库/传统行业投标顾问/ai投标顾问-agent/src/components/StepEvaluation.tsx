import React from 'react';
import { 
  Calculator, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  TrendingUp,
  Sparkles,
  BarChart3,
  Layers
} from 'lucide-react';
import { EvaluationScoreItem } from '../types';

interface StepEvaluationProps {
  scores: EvaluationScoreItem[];
  onNext: () => void;
  onPrev: () => void;
}

export const StepEvaluation: React.FC<StepEvaluationProps> = ({ scores, onNext, onPrev }) => {
  const totalMaxScore = scores.reduce((sum, item) => sum + item.maxScore, 0);
  const totalExpectedScore = scores.reduce((sum, item) => sum + item.expectedScore, 0);
  const totalPotential = scores.reduce((sum, item) => sum + item.improvementPotential, 0);

  const percentage = Math.round((totalExpectedScore / totalMaxScore) * 100) || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Score KPI Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                第四步：评标规则全维度拆解
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                将商务、技术、价格、团队及服务逐项打通，精确测算当前预计得分与可挖掘的提分空间。
              </p>
            </div>
          </div>

          {/* Big Bento Score Counter */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 self-stretch sm:self-auto">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">预计综合得分</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-mono">
                  {totalExpectedScore.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-slate-500">/ {totalMaxScore} 分</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div>
              <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">最大提分潜能</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5 font-mono">
                +{totalPotential.toFixed(1)} 分
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-700">得分率测算: <strong className="text-blue-700">{percentage}%</strong></span>
            <span className="text-emerald-700 font-bold">冲刺目标: {(totalExpectedScore + totalPotential).toFixed(1)} 分 (满分竞争力)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 flex gap-1 border border-slate-200">
            <div 
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${(totalExpectedScore / totalMaxScore) * 100}%` }}
            />
            <div 
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(totalPotential / totalMaxScore) * 100}%` }}
              title={`可挖掘提分空间: +${totalPotential}分`}
            />
          </div>
        </div>
      </div>

      {/* Main Scoring Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">评分细则与得分预测明细</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">共 {scores.length} 个评分项</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-4 w-[16%]">评分项</th>
                <th className="py-3.5 px-4 w-[8%] text-center">满分</th>
                <th className="py-3.5 px-4 w-[28%]">评分标准与扣分规则</th>
                <th className="py-3.5 px-4 w-[26%]">企业当前情况匹配</th>
                <th className="py-3.5 px-4 w-[10%] text-center">预计得分</th>
                <th className="py-3.5 px-4 w-[12%] text-center">提分空间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {scores.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name & Category */}
                  <td className="py-4 px-4 align-top">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {item.category}
                    </span>
                  </td>

                  {/* Max Score */}
                  <td className="py-4 px-4 align-top text-center">
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {item.maxScore}
                    </span>
                  </td>

                  {/* Criteria */}
                  <td className="py-4 px-4 align-top">
                    <p className="text-xs text-slate-700 leading-relaxed font-mono">
                      {item.criteria}
                    </p>
                  </td>

                  {/* Current Status */}
                  <td className="py-4 px-4 align-top">
                    <div className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {item.currentStatus}
                    </div>
                    {item.improvementTips && (
                      <p className="text-[11px] text-amber-700 font-medium mt-1.5 flex items-start gap-1">
                        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                        <span>{item.improvementTips}</span>
                      </p>
                    )}
                  </td>

                  {/* Expected Score */}
                  <td className="py-4 px-4 align-top text-center">
                    <span className="inline-block font-extrabold text-blue-700 text-base font-mono bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      {item.expectedScore}
                    </span>
                  </td>

                  {/* Improvement Potential */}
                  <td className="py-4 px-4 align-top text-center">
                    {item.improvementPotential > 0 ? (
                      <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-sm font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{item.improvementPotential}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-mono">已顶格(满分)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回：废标风险</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
        >
          <span>下一步：寻找得分机会</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

