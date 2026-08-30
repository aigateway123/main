import React, { useState } from 'react';
import { AiRecommendation, ProposalOutline, ExperimentSetup, CorePaper } from '../types';
import { Sparkles, Layers, Sliders, BarChart3, FileCheck, Code2, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProposalModal } from './ProposalModal';
import { ExperimentModal } from './ExperimentModal';
import { CorePapersModal } from './CorePapersModal';

interface AiRecommendationsSectionProps {
  recommendation: AiRecommendation;
  proposal: ProposalOutline;
  experiment: ExperimentSetup;
  corePapers: CorePaper[];
}

export const AiRecommendationsSection: React.FC<AiRecommendationsSectionProps> = ({
  recommendation,
  proposal,
  experiment,
  corePapers,
}) => {
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showExperimentModal, setShowExperimentModal] = useState(false);
  const [showCorePapersModal, setShowCorePapersModal] = useState(false);

  return (
    <section id="recommendation" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#222]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf] text-black flex items-center justify-center font-bold text-sm font-mono shadow-sm shadow-[#2dd4bf]/20">
            05
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] font-sans">
              AI 研究建议
            </h2>
            <p className="text-xs sm:text-sm text-[#888]">
              如果你准备继续研究这个方向，AI 建议：
            </p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center text-xs font-semibold text-[#2dd4bf] bg-[#1a2d2a] px-3 py-1 rounded-full border border-[#2dd4bf]/30">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-[#2dd4bf]" />
          <span>系统级科研落地指南</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#111] rounded-2xl border border-[#222] shadow-xl overflow-hidden">
        {/* Recommended Research Topic (Hero Title Box) */}
        <div className="bg-[#151515] text-white p-6 sm:p-8 border-b border-[#222]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#1a2d2a] text-[#2dd4bf] text-xs font-bold uppercase tracking-wider mb-3 border border-[#2dd4bf]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#2dd4bf]" />
              <span>推荐研究问题 / Recommended Research Title</span>
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans text-[#f0f0f0] leading-snug">
              “{recommendation.recommendedTitle}”
            </h3>
            <p className="text-xs sm:text-sm text-[#aaa] mt-3 leading-relaxed">
              {recommendation.backgroundSummary}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* 推荐实验: Baseline vs 新增变量 */}
          <div>
            <div className="flex items-center space-x-2 text-[#f0f0f0] font-bold text-base mb-4 font-sans">
              <Layers className="w-5 h-5 text-[#2dd4bf]" />
              <h4>推荐实验设计 (Recommended Experiments)</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Baseline Models (4 cols) */}
              <div className="md:col-span-5 bg-[#161616] rounded-2xl p-5 border border-[#262626]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#888]">
                    对比基准 (Baseline)：
                  </span>
                  <span className="text-[11px] font-mono text-[#666]">4 类标准算法</span>
                </div>
                <div className="space-y-2">
                  {recommendation.baselines.map((base, idx) => (
                    <div
                      key={idx}
                      className="bg-[#111] border border-[#222] rounded-xl px-3.5 py-2.5 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#666]"></span>
                        <span className="font-bold text-[#e0e0e0] text-xs sm:text-sm font-mono">
                          {base}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-[#666]">经典对比</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新增变量 (7 cols) */}
              <div className="md:col-span-7 bg-[#161616] rounded-2xl p-5 border border-[#262626]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2dd4bf] flex items-center">
                    <Sliders className="w-3.5 h-3.5 mr-1 text-[#2dd4bf]" />
                    建议引入的新增变量 (New Feature Variables)：
                  </span>
                  <span className="text-[11px] font-mono text-[#2dd4bf] font-bold">5 大关键维度</span>
                </div>
                <div className="space-y-2">
                  {recommendation.newVariables.map((v, idx) => (
                    <div
                      key={idx}
                      className="bg-[#111] border border-[#222] rounded-xl p-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></span>
                          <span className="font-bold text-[#f0f0f0] text-xs sm:text-sm">
                            {v.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/30">
                          {v.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#888] mt-1 leading-normal pl-3.5">
                        {v.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 推荐评价指标 */}
          <div>
            <div className="flex items-center space-x-2 text-[#f0f0f0] font-bold text-base mb-4 font-sans">
              <BarChart3 className="w-5 h-5 text-[#2dd4bf]" />
              <h4>推荐评价指标 (Evaluation Metrics)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendation.evaluationMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-[#161616] rounded-2xl p-5 border border-[#262626] hover:border-[#333] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-bold text-[#f0f0f0] font-mono text-sm sm:text-base">
                        {m.name}
                      </h5>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/30">
                        {m.targetValue}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-[#2dd4bf] bg-[#111] p-2 rounded-lg border border-[#222] my-2">
                      {m.formula}
                    </div>
                    <p className="text-xs text-[#888] leading-relaxed mt-2">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部三大行动按钮 */}
          <div className="pt-6 border-t border-[#222]">
            <div className="text-center mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#666]">
                一键生成完整学术工程交付物
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Button 1: 生成研究方案 */}
              <button
                onClick={() => setShowProposalModal(true)}
                className="py-3.5 px-5 rounded-xl font-bold text-black bg-[#2dd4bf] hover:bg-[#20b8a4] shadow-md shadow-[#2dd4bf]/10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
              >
                <FileCheck className="w-5 h-5 text-black" />
                <span>生成研究方案</span>
              </button>

              {/* Button 2: 生成实验方案 */}
              <button
                onClick={() => setShowExperimentModal(true)}
                className="py-3.5 px-5 rounded-xl font-bold text-[#e0e0e0] bg-[#1d1d1d] hover:bg-[#252525] border border-[#333] shadow-md active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
              >
                <Code2 className="w-5 h-5 text-[#2dd4bf]" />
                <span>生成实验方案</span>
              </button>

              {/* Button 3: 查看核心论文 */}
              <button
                onClick={() => setShowCorePapersModal(true)}
                className="py-3.5 px-5 rounded-xl font-bold text-[#e0e0e0] bg-[#161616] hover:bg-[#202020] border border-[#2a2a2a] shadow-md active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-[#888]" />
                <span>查看核心论文</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {showProposalModal && (
        <ProposalModal
          proposal={proposal}
          onClose={() => setShowProposalModal(false)}
        />
      )}

      {showExperimentModal && (
        <ExperimentModal
          experiment={experiment}
          onClose={() => setShowExperimentModal(false)}
        />
      )}

      {showCorePapersModal && (
        <CorePapersModal
          papers={corePapers}
          onClose={() => setShowCorePapersModal(false)}
        />
      )}
    </section>
  );
};
