import React, { useState } from 'react';
import { ResearchGap } from '../types';
import { Sparkles, Lightbulb, TrendingUp, Compass, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface ResearchGapsSectionProps {
  gaps: ResearchGap[];
  onSelectGapForProposal?: (gap: ResearchGap) => void;
}

export const ResearchGapsSection: React.FC<ResearchGapsSectionProps> = ({
  gaps,
  onSelectGapForProposal,
}) => {
  return (
    <section id="gaps" className="scroll-mt-24 space-y-6">
      {/* Section Header with High-Impact Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#222]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf] text-black flex items-center justify-center font-bold text-sm font-mono shadow-sm shadow-[#2dd4bf]/20">
            04
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] font-sans">
                AI 发现的潜在研究空白
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/30">
                <Sparkles className="w-3 h-3 mr-1 text-[#2dd4bf]" />
                核心学术创新突破口
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#888] mt-0.5">
              通过跨越 1,263 篇文献的矩阵交叉对比，识别出尚未被充分探索的高价值科学问题
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center text-xs font-semibold text-amber-300 bg-[#1e1c12] px-3 py-1.5 rounded-xl border border-amber-500/30">
          <Lightbulb className="w-4 h-4 text-amber-400 mr-1.5" />
          <span>具备极高国家基金与顶刊申报潜力</span>
        </div>
      </div>

      {/* 3 Opportunities List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {gaps.map((gap, index) => {
          const isPrimary = index === 0;

          return (
            <div
              key={gap.id}
              className={`rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden group ${
                isPrimary
                  ? 'bg-[#111] border-[#2dd4bf]/50 shadow-xl shadow-[#2dd4bf]/5 ring-1 ring-[#2dd4bf]/30'
                  : 'bg-[#111] border-[#222] hover:border-[#333] hover:shadow-lg'
              }`}
            >
              {/* Top Accent Tag */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded bg-[#2dd4bf] text-black tracking-wider">
                    {gap.opportunityNumber}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400 text-xs font-bold">
                    {'★'.repeat(gap.recommendationStars)}
                  </div>
                </div>

                <h3 className="text-lg font-bold font-sans text-[#f0f0f0] leading-snug group-hover:text-[#2dd4bf] transition-colors">
                  {gap.title}
                </h3>

                {/* Status vs Innovation Comparison */}
                <div className="mt-4 space-y-3">
                  {/* 研究现状 */}
                  <div className="bg-[#161616] rounded-xl p-3.5 border border-[#262626]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#888] mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#666] mr-1.5"></span>
                      研究现状 (Current Gap)
                    </div>
                    <p className="text-xs text-[#aaa] leading-relaxed">
                      {gap.currentStatus}
                    </p>
                  </div>

                  {/* 潜在创新 */}
                  <div className="bg-[#1a2d2a]/40 rounded-xl p-3.5 border border-[#2dd4bf]/30">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf] mb-1 flex items-center">
                      <Zap className="w-3.5 h-3.5 text-[#2dd4bf] mr-1" />
                      潜在创新 (Potential Innovation)
                    </div>
                    <p className="text-xs font-medium text-[#e0e0e0] leading-relaxed">
                      {gap.potentialInnovation}
                    </p>
                  </div>
                </div>

                {/* Suggested Technical Methods */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-[#666] uppercase tracking-wider block mb-1.5">
                    推荐切入技术路线：
                  </span>
                  <div className="space-y-1">
                    {gap.suggestedMethods.map((method, mIdx) => (
                      <div key={mIdx} className="text-xs text-[#ccc] flex items-start space-x-1.5">
                        <span className="text-[#2dd4bf] font-bold text-[10px] mt-0.5">●</span>
                        <span className="leading-tight">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Scores & Feasibility Metrics */}
              <div className="mt-6 pt-4 border-t border-[#222]">
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-[#161616] rounded-lg p-2 text-center border border-[#262626]">
                    <span className="text-[10px] text-[#666] block">理论创新度</span>
                    <span className="text-sm font-bold font-mono text-amber-400">
                      {gap.innovationScore}%
                    </span>
                  </div>
                  <div className="bg-[#161616] rounded-lg p-2 text-center border border-[#262626]">
                    <span className="text-[10px] text-[#666] block">实验可行性</span>
                    <span className="text-sm font-bold font-mono text-[#2dd4bf]">
                      {gap.feasibilityScore}%
                    </span>
                  </div>
                </div>

                {onSelectGapForProposal && (
                  <button
                    onClick={() => onSelectGapForProposal(gap)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-black bg-[#2dd4bf] hover:bg-[#20b8a4] transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>以此方向生成研究方案</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
