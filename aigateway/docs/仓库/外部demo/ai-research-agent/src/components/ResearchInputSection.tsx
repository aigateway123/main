import React, { useState } from 'react';
import { Play, Sparkles, ArrowDown, CheckCircle2, RotateCcw, Lightbulb, Compass } from 'lucide-react';
import { PRESET_TOPICS } from '../data/defaultResearchData';

interface ResearchInputSectionProps {
  topic: string;
  onTopicChange: (newTopic: string) => void;
  onStartResearch: (customTopic?: string) => void;
  isRunning: boolean;
  currentStepIndex: number;
}

const PIPELINE_STEPS = [
  { id: 'breakdown', label: '问题拆解', desc: '科学问题降维与变量抽取' },
  { id: 'literature', label: '文献研究', desc: 'ArXiv/IEEE 140+ 篇文献研读' },
  { id: 'hotspots', label: '研究热点分析', desc: '前沿聚类与演化图谱' },
  { id: 'gaps', label: '研究空白识别', desc: '现有方法三大局限性诊断' },
  { id: 'experiments', label: '实验方案设计', desc: '5基准模型与消融方案' },
  { id: 'feasibility', label: '可行性评估', desc: '审稿人视角把关与风险预警' },
  { id: 'report', label: '研究报告', desc: '自动生成 9 大章节学术白皮书' },
];

export const ResearchInputSection: React.FC<ResearchInputSectionProps> = ({
  topic,
  onTopicChange,
  onStartResearch,
  isRunning,
  currentStepIndex,
}) => {
  const [showPresets, setShowPresets] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isRunning) return;
    onStartResearch();
  };

  return (
    <section id="research-input-section" className="w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Title & Subtitle */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md mb-4 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Nova 科研 AI 旗舰平台 · 突破传统科研探索边界</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
          AI Research Agent
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
          从一个科研问题开始，AI 自动完成一轮研究
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-6">
          <div className="relative flex flex-col sm:flex-row items-stretch rounded-2xl bg-slate-800/90 p-2 border border-slate-700 shadow-2xl shadow-slate-950/60 backdrop-blur-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
            <div className="flex-1 flex items-center px-4 py-2 sm:py-1">
              <Compass className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
              <input
                id="research-topic-input"
                type="text"
                value={topic}
                onChange={(e) => onTopicChange(e.target.value)}
                placeholder="请输入您的前沿科研探索问题..."
                disabled={isRunning}
                className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none disabled:opacity-60"
              />
            </div>
            
            <div className="flex items-center gap-2 mt-2 sm:mt-0 p-1">
              <button
                id="start-research-btn"
                type="submit"
                disabled={isRunning || !topic.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-600 hover:to-blue-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin text-white" />
                    <span>智能体协同研究中...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current text-white" />
                    <span>开始研究</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Preset Topics Quick Chips */}
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 mb-10 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            推荐科研课题：
          </span>
          {PRESET_TOPICS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onTopicChange(preset);
                onStartResearch(preset);
              }}
              disabled={isRunning}
              className={`rounded-lg border px-2.5 py-1 transition-colors text-left cursor-pointer ${
                topic === preset
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
                  : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              {preset.length > 22 ? preset.slice(0, 22) + '...' : preset}
            </button>
          ))}
        </div>

        {/* Workflow Pipeline Line Visualizer */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl bg-slate-950/80 border border-slate-800 p-5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              AI 将自动完成全链路科研闭环：
            </span>
            <span className="text-xs text-slate-400">
              {isRunning ? `正在执行步骤 [${currentStepIndex + 1}/7]` : '7 阶段学术自动化流水线'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {PIPELINE_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex && isRunning;
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'border-indigo-400 bg-indigo-600/20 ring-1 ring-indigo-400 shadow-md shadow-indigo-500/10'
                      : isCompleted
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-slate-300'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
