/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WorkflowStep, ExperimentProject, PaperData, ReviewReport } from './types';
import { PRESET_EXPERIMENT, INITIAL_PAPER_DATA, INITIAL_REVIEW_REPORT } from './data/presetExperiment';
import { Header } from './components/Header';
import { ExperimentView } from './components/ExperimentView';
import { PaperView } from './components/PaperView';
import { ReviewerAgentView } from './components/ReviewerAgentView';
import { PaperAgentProgressModal } from './components/PaperAgentProgressModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('experiment');
  const [experiment, setExperiment] = useState<ExperimentProject>(PRESET_EXPERIMENT);
  const [paperData, setPaperData] = useState<PaperData>(INITIAL_PAPER_DATA);
  const [reviewReport, setReviewReport] = useState<ReviewReport>(INITIAL_REVIEW_REPORT);

  // Workflow progress flags
  const [hasGeneratedPaper, setHasGeneratedPaper] = useState<boolean>(false);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [hasAppliedAblation, setHasAppliedAblation] = useState<boolean>(false);
  const [hasAppliedStats, setHasAppliedStats] = useState<boolean>(false);
  const [hasAppliedUnits, setHasAppliedUnits] = useState<boolean>(false);
  const [hasAppliedReferences, setHasAppliedReferences] = useState<boolean>(false);

  // Modals & UI States
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState<boolean>(false);
  const [isReviewingInProgress, setIsReviewingInProgress] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [serifMode, setSerifMode] = useState<boolean>(false);

  // Start Paper Generation Workflow
  const handleStartGeneration = () => {
    setIsGeneratingModalOpen(true);
  };

  const handleGenerationComplete = () => {
    setIsGeneratingModalOpen(false);
    setHasGeneratedPaper(true);
    setCurrentStep('paper');
  };

  // Start Reviewer Agent Workflow
  const handleStartReview = () => {
    setCurrentStep('reviewer');
    setIsReviewingInProgress(true);
    setHasReviewed(true);
    setTimeout(() => {
      setIsReviewingInProgress(false);
    }, 2800);
  };

  // Revision Actions
  const handleApplyAblation = () => {
    setHasAppliedAblation(true);
    setPaperData(prev => ({
      ...prev,
      version: 'v1.1.0 (With Ablation Study)',
    }));
  };

  const handleApplyStats = () => {
    setHasAppliedStats(true);
  };

  const handleApplyUnits = () => {
    setHasAppliedUnits(true);
  };

  const handleApplyReferences = () => {
    setHasAppliedReferences(true);
    setPaperData(prev => ({
      ...prev,
      references: prev.references.map(r => ({
        ...r,
        text: r.text.includes('doi:') ? r.text : `${r.text} doi: 10.1109/TSG.2026.${1000000 + r.id}`,
      })),
    }));
  };

  const handleApplyAllRevisions = () => {
    handleApplyAblation();
    handleApplyStats();
    handleApplyUnits();
    handleApplyReferences();
  };

  const handleReset = () => {
    setPaperData(INITIAL_PAPER_DATA);
    setReviewReport(INITIAL_REVIEW_REPORT);
    setHasGeneratedPaper(false);
    setHasReviewed(false);
    setHasAppliedAblation(false);
    setHasAppliedStats(false);
    setHasAppliedUnits(false);
    setHasAppliedReferences(false);
    setCurrentStep('experiment');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header & Closed-Loop Workflow Navigation */}
      <Header
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        hasGeneratedPaper={hasGeneratedPaper}
        hasReviewed={hasReviewed}
        hasAppliedAblation={hasAppliedAblation}
        onOpenExport={() => setIsExportModalOpen(true)}
        onReset={handleReset}
        serifMode={serifMode}
        onToggleSerif={() => setSerifMode(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentStep === 'experiment' && (
          <ExperimentView
            experiment={experiment}
            onGeneratePaper={handleStartGeneration}
            isGenerating={isGeneratingModalOpen}
            hasGeneratedPaper={hasGeneratedPaper}
            onViewPaper={() => setCurrentStep('paper')}
          />
        )}

        {currentStep === 'paper' && (
          <PaperView
            paperData={paperData}
            experiment={experiment}
            onStartReview={handleStartReview}
            onOpenExport={() => setIsExportModalOpen(true)}
            serifMode={serifMode}
            hasAppliedAblation={hasAppliedAblation}
            hasAppliedStats={hasAppliedStats}
            hasAppliedUnits={hasAppliedUnits}
            hasAppliedReferences={hasAppliedReferences}
          />
        )}

        {(currentStep === 'reviewer' || currentStep === 'revision') && (
          <ReviewerAgentView
            reviewReport={reviewReport}
            isReviewing={isReviewingInProgress}
            onApplyAblation={handleApplyAblation}
            onApplyStats={handleApplyStats}
            onApplyUnits={handleApplyUnits}
            onApplyReferences={handleApplyReferences}
            onApplyAllRevisions={handleApplyAllRevisions}
            onGoToPaper={() => setCurrentStep('paper')}
            hasAppliedAblation={hasAppliedAblation}
            hasAppliedStats={hasAppliedStats}
            hasAppliedUnits={hasAppliedUnits}
            hasAppliedReferences={hasAppliedReferences}
          />
        )}
      </main>

      {/* 8-Step Paper Agent Generation Modal */}
      <PaperAgentProgressModal
        isOpen={isGeneratingModalOpen}
        onComplete={handleGenerationComplete}
      />

      {/* Export Paper Modal (LaTeX, Markdown, BibTeX, Print PDF) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        paperData={paperData}
        experiment={experiment}
        hasAppliedAblation={hasAppliedAblation}
      />
    </div>
  );
}
