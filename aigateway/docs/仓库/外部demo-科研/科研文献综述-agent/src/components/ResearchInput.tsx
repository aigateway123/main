import React from 'react';
import { Sparkles, Compass, Lightbulb, ArrowRight, BookOpenCheck, SlidersHorizontal } from 'lucide-react';
import { PRESET_TOPIC_EXAMPLES } from '../data/mockResearchData';

interface ResearchInputProps {
  topic: string;
  setTopic: (t: string) => void;
  question: string;
  setQuestion: (q: string) => void;
  onStartResearch: () => void;
  isWorking: boolean;
}

export const ResearchInput: React.FC<ResearchInputProps> = ({
  topic,
  setTopic,
  question,
  setQuestion,
  onStartResearch,
  isWorking,
}) => {
  const handleSelectPreset = (presetTopic: string, presetQuestion: string) => {
    setTopic(presetTopic);
    setQuestion(presetQuestion);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4">
      {/* Hero Banner Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1a2d2a] border border-[#2dd4bf]/40 text-[#2dd4bf] text-xs sm:text-sm font-medium mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#2dd4bf] animate-pulse" />
          <span>自主科研智能体 · 自动化文献研读与洞察生成</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f0f0f0] font-sans mb-3 flex items-center justify-center">
          <span className="w-10 h-10 bg-[#2dd4bf] rounded-lg mr-3 flex items-center justify-center text-black font-black text-xl">A</span>
          科研文献综述 Agent
        </h1>
        <p className="text-sm sm:text-base text-[#888] uppercase tracking-widest max-w-2xl mx-auto">
          从海量论文中发现研究热点、研究空白与潜在创新方向
        </p>
      </div>

      {/* Main Input Form Card */}
      <div className="bg-[#111] rounded-2xl border border-[#222] shadow-2xl p-6 sm:p-8 transition-all hover:border-[#333]">
        {/* Preset Topic Chips */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-[#555] uppercase tracking-wider flex items-center">
              <Lightbulb className="w-3.5 h-3.5 mr-1 text-[#2dd4bf]" />
              快速选用示例主题 / 预设场景：
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_TOPIC_EXAMPLES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(item.topic, item.question)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center space-x-1.5 ${
                  topic === item.topic
                    ? 'bg-[#2dd4bf] text-black border-[#2dd4bf] font-bold shadow-md shadow-[#2dd4bf]/10'
                    : 'bg-[#181818] text-[#ccc] border-[#2a2a2a] hover:bg-[#222] hover:border-[#444]'
                }`}
              >
                <span>{item.topic}</span>
                {item.tag && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      topic === item.topic ? 'bg-black/20 text-black font-semibold' : 'bg-[#262626] text-[#888]'
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (topic.trim() && !isWorking) {
              onStartResearch();
            }
          }}
          className="space-y-6"
        >
          {/* Research Topic */}
          <div>
            <label className="block text-sm font-semibold text-[#f0f0f0] mb-2 flex items-center justify-between">
              <span className="flex items-center">
                <Compass className="w-4 h-4 mr-1.5 text-[#2dd4bf]" />
                研究主题
              </span>
              <span className="text-xs font-normal text-[#666]">领域 / 关键词 / 核心对象</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：新能源汽车充电负荷预测"
              required
              className="w-full px-4 py-3 text-sm text-[#f0f0f0] bg-[#0a0a0a] border border-[#282828] rounded-xl focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] focus:outline-none transition-all font-medium placeholder:text-[#555]"
            />
          </div>

          {/* Research Question / Deep Prompt */}
          <div>
            <label className="block text-sm font-semibold text-[#f0f0f0] mb-2 flex items-center justify-between">
              <span className="flex items-center">
                <BookOpenCheck className="w-4 h-4 mr-1.5 text-[#2dd4bf]" />
                研究问题与具体诉求
              </span>
              <span className="text-xs font-normal text-[#666]">可指定方法、时间跨度与分析侧重点</span>
            </label>
            <textarea
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="请输入您希望 Agent 深入分析的具体研究问题..."
              required
              className="w-full px-4 py-3 text-sm text-[#e0e0e0] bg-[#0a0a0a] border border-[#282828] rounded-xl focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] focus:outline-none transition-all leading-relaxed placeholder:text-[#555]"
            />
          </div>

          {/* Configuration Hint Banner */}
          <div className="flex items-start space-x-3 p-3.5 bg-[#161616] rounded-xl border border-[#262626] text-xs text-[#888]">
            <SlidersHorizontal className="w-4 h-4 text-[#2dd4bf] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#e0e0e0]">AI 文献研读流水线准备就绪：</span>
              <span> 将自动执行 7 个阶段的文献检索、图谱聚类、时空演进脉络梳理及高价值未解科研空白挖掘。</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isWorking || !topic.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-black bg-[#2dd4bf] hover:bg-[#20b8a4] active:scale-[0.99] shadow-lg shadow-[#2dd4bf]/20 transition-all duration-200 flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>开始文献研究</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      </div>

      {/* Academic Highlights Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold text-[#555] uppercase tracking-wider mb-1">权威文献覆盖</div>
          <div className="text-sm font-semibold text-[#e0e0e0]">IEEE / Elsevier / Springer / Top AI</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold text-[#555] uppercase tracking-wider mb-1">自动方法演化图谱</div>
          <div className="text-sm font-semibold text-[#e0e0e0]">传统机器学习 ➔ 时空大模型</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4 text-center">
          <div className="text-[10px] font-bold text-[#555] uppercase tracking-wider mb-1">精准科研空白捕捉</div>
          <div className="text-sm font-semibold text-[#e0e0e0]">直接定位国自然 / 顶会创新点</div>
        </div>
      </div>
    </div>
  );
};
