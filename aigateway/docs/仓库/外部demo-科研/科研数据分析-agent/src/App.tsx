import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { DataUploader } from './components/DataUploader';
import { AgentWorkflow } from './components/AgentWorkflow';
import { DataOverviewCards } from './components/DataOverviewCards';
import { GroupComparison } from './components/GroupComparison';
import { AnomalyDetection } from './components/AnomalyDetection';
import { AiInsights } from './components/AiInsights';
import { ScientificChartsGrid } from './components/ScientificChartsGrid';
import { AnalysisReport } from './components/AnalysisReport';
import { PaperWritingModal } from './components/PaperWritingModal';
import { DEFAULT_DATASET, AGENT_STEPS } from './data/mockData';
import { DatasetMeta, AgentStep } from './types';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [currentDataset, setCurrentDataset] = useState<DatasetMeta>(DEFAULT_DATASET);
  const [analysisGoal, setAnalysisGoal] = useState<string>(
    '比较实验组 A、B、C 的性能差异，寻找异常样本，并生成适合论文使用的分析图表。'
  );
  const [steps, setSteps] = useState<AgentStep[]>(
    AGENT_STEPS.map((s) => ({ ...s, status: 'pending' }))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(true); // initially shown complete or can be rerun
  const [isPaperModalOpen, setIsPaperModalOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Reference to results section for smooth auto-scrolling
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize steps as completed on mount for instant gratification, but user can re-trigger
  useEffect(() => {
    setSteps(AGENT_STEPS.map((s) => ({ ...s, status: 'completed' })));
  }, []);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setHasAnalyzed(false);

    // Reset steps to pending
    const initialSteps = AGENT_STEPS.map((s) => ({ ...s, status: 'pending' as const }));
    setSteps(initialSteps);
    setCurrentStepIndex(0);

    // Smoothly step through the 9 Agent stages
    const stepDuration = 350; // ms per step
    let stepIdx = 0;

    const interval = setInterval(() => {
      if (stepIdx < initialSteps.length) {
        const currentIdx = stepIdx;
        setCurrentStepIndex(currentIdx);
        setSteps((prev) =>
          prev.map((s, idx) => {
            if (idx < currentIdx) return { ...s, status: 'completed' };
            if (idx === currentIdx) return { ...s, status: 'running' };
            return { ...s, status: 'pending' };
          })
        );
        stepIdx++;
      } else {
        clearInterval(interval);
        // Mark all completed
        setSteps(AGENT_STEPS.map((s) => ({ ...s, status: 'completed' })));
        setIsAnalyzing(false);
        setHasAnalyzed(true);

        // Smooth scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }, stepDuration);
  };

  const handleReset = () => {
    setSteps(AGENT_STEPS.map((s) => ({ ...s, status: 'pending' })));
    setHasAnalyzed(false);
    setIsAnalyzing(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
      {/* Top Header */}
      <Header
        currentDatasetName={currentDataset.fileName}
        isAnalyzing={isAnalyzing}
        hasAnalyzed={hasAnalyzed}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* 1. Uploader & Goal Input Section */}
        <DataUploader
          currentDataset={currentDataset}
          onSelectDataset={(ds) => {
            setCurrentDataset(ds);
            handleStartAnalysis();
          }}
          analysisGoal={analysisGoal}
          onGoalChange={setAnalysisGoal}
          onStartAnalysis={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
          hasAnalyzed={hasAnalyzed}
        />

        {/* 2. AI Working Process: Data Agent Dynamic Progression */}
        <AgentWorkflow
          steps={steps}
          currentStepIndex={currentStepIndex}
          isAnalyzing={isAnalyzing}
          hasAnalyzed={hasAnalyzed}
        />

        {/* Results Container (Rendered when analyzed or analyzing) */}
        {(hasAnalyzed || isAnalyzing) && (
          <div ref={resultsRef} className="space-y-8 transition-opacity duration-300">
            {/* 3. Data Overview Cards */}
            <DataOverviewCards dataset={currentDataset} />

            {/* 4. Group Comparison Bar Chart & Table */}
            <GroupComparison />

            {/* 5. Anomaly Detection Cards & Diagnosis */}
            <AnomalyDetection />

            {/* 6. AI Insights Natural Language */}
            <AiInsights />

            {/* 7. Publication Scientific Charts Grid */}
            <ScientificChartsGrid
              onInsertToPaper={() => {
                setIsPaperModalOpen(true);
              }}
            />

            {/* 8. Full 6-Section Academic Analysis Report */}
            <AnalysisReport
              onOpenPaperWriting={() => setIsPaperModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#1e293b] bg-[#050505] py-6 text-center text-xs text-[#64748b]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>科研数据分析 Agent · 自动化科研数据流与学术制图系统</span>
          <span className="font-mono text-[#94a3b8]">
            Excel → Clean → Anomaly Detection → Publication Charts → Results
          </span>
        </div>
      </footer>

      {/* Paper Writing Results Demo Modal */}
      <PaperWritingModal
        isOpen={isPaperModalOpen}
        onClose={() => setIsPaperModalOpen(false)}
        datasetName={currentDataset.fileName}
      />

      {/* Floating Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-blue-400 border border-[#1e293b] shadow-xl transition-all hover:scale-110 cursor-pointer"
          title="返回顶部"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
