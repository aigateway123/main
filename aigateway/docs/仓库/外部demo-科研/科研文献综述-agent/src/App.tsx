import React, { useState } from 'react';
import { DEFAULT_EV_RESEARCH_DATA, PRESET_TOPIC_EXAMPLES } from './data/mockResearchData';
import { ResearchTopicData } from './types';
import { Header } from './components/Header';
import { ResearchInput } from './components/ResearchInput';
import { AgentWorkingModal } from './components/AgentWorkingModal';
import { OverviewSection } from './components/OverviewSection';
import { HotspotsSection } from './components/HotspotsSection';
import { LiteratureMapSection } from './components/LiteratureMapSection';
import { ResearchGapsSection } from './components/ResearchGapsSection';
import { AiRecommendationsSection } from './components/AiRecommendationsSection';
import { Sparkles, ArrowUp, RefreshCw, FileDown, Check } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState<string>(DEFAULT_EV_RESEARCH_DATA.topic);
  const [question, setQuestion] = useState<string>(DEFAULT_EV_RESEARCH_DATA.question);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [researchData, setResearchData] = useState<ResearchTopicData>(DEFAULT_EV_RESEARCH_DATA);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const handleStartResearch = () => {
    setIsWorking(true);
    // If user edited topic, adapt the topic in research data overview
    setResearchData((prev) => ({
      ...prev,
      topic: topic.trim() || prev.topic,
      question: question.trim() || prev.question,
      overview: {
        ...prev.overview,
        topic: topic.trim() || prev.topic,
      },
    }));
  };

  const handleAgentComplete = () => {
    setIsWorking(false);
    setHasResults(true);
    // Scroll to top of results smoothly
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setHasResults(false);
    setIsWorking(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyFullSummary = () => {
    const summaryText = `# 科研文献综述报告: ${researchData.topic}

## 01｜研究概览
- 分析论文: ${researchData.overview.totalPapers} 篇
- 高相关论文: ${researchData.overview.highRelevancePapers} 篇
- 重点论文: ${researchData.overview.keyPapers} 篇
- 主要研究方向: ${researchData.overview.mainDirectionsCount} 个
- 潜在研究机会: ${researchData.overview.potentialOpportunitiesCount} 个

## 02｜研究热点
${researchData.hotspots.map((h) => `- ${h.name} ${h.ratingText} (热度: ${h.heatScore}/100)`).join('\n')}

## 03｜论文地图演进路径
传统机器学习 ➔ LSTM/GRU ➔ Transformer ➔ GNN ➔ 时空预测 ➔ 多模态与大模型

## 04｜AI 发现的潜在研究空白
${researchData.gaps.map((g) => `### ${g.opportunityNumber}: ${g.title}\n- 现状: ${g.currentStatus}\n- 潜在创新: ${g.potentialInnovation}`).join('\n\n')}

## 05｜AI 研究建议
- 推荐研究问题: “${researchData.recommendation.recommendedTitle}”
- Baseline: ${researchData.recommendation.baselines.join(', ')}
- 评价指标: ${researchData.recommendation.evaluationMetrics.map((m) => m.name).join(', ')}
`;
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans selection:bg-[#2dd4bf] selection:text-black antialiased">
      {/* Top Academic Header */}
      <Header
        hasResults={hasResults}
        onReset={handleReset}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!hasResults ? (
          /* Initial Input & Scenario Selection View */
          <ResearchInput
            topic={topic}
            setTopic={setTopic}
            question={question}
            setQuestion={setQuestion}
            onStartResearch={handleStartResearch}
            isWorking={isWorking}
          />
        ) : (
          /* Results View with 5 Structured Sections */
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Top Results Control Ribbon */}
            <div className="bg-[#111] rounded-2xl border border-[#222] p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#888]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] animate-pulse"></span>
                <span className="font-semibold text-[#f0f0f0]">文献综述生成完毕：</span>
                <span className="text-[#2dd4bf] truncate max-w-xs sm:max-w-md font-medium">
                  {researchData.topic}
                </span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handleCopyFullSummary}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#ccc] bg-[#1a1a1a] hover:bg-[#222] border border-[#333] transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2dd4bf]" />
                      <span className="text-[#2dd4bf]">已复制综述</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5 text-[#888]" />
                      <span>导出 Markdown 综述</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#2dd4bf] bg-[#1a2d2a] hover:bg-[#223d38] border border-[#2dd4bf]/40 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>换个新主题研究</span>
                </button>
              </div>
            </div>

            {/* 01｜研究概览 */}
            <OverviewSection overview={researchData.overview} />

            {/* 02｜研究热点 */}
            <HotspotsSection hotspots={researchData.hotspots} />

            {/* 03｜论文地图 */}
            <LiteratureMapSection topic={researchData.topic} nodes={researchData.mapNodes} />

            {/* 04｜研究空白 (Core Spotlight) */}
            <ResearchGapsSection gaps={researchData.gaps} />

            {/* 05｜AI研究建议 */}
            <AiRecommendationsSection
              recommendation={researchData.recommendation}
              proposal={researchData.proposalOutline}
              experiment={researchData.experimentSetup}
              corePapers={researchData.corePapers}
            />

            {/* Bottom Back-to-Top and Finish Banner */}
            <div className="text-center pt-8 pb-12 border-t border-[#222]">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#111] border border-[#333] text-[#ccc] text-xs font-semibold hover:border-[#2dd4bf] hover:text-[#2dd4bf] shadow-md transition-all cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
                <span>返回顶部综述概览</span>
              </button>
              <p className="text-xs text-[#555] mt-3 font-mono">
                科研文献综述 Agent · 严谨学术研究与智能体洞察
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Simulated 5~8s Agent Working Process Modal */}
      {isWorking && (
        <AgentWorkingModal topic={topic} onComplete={handleAgentComplete} />
      )}
    </div>
  );
}
