import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StepNavigation } from './components/StepNavigation';
import { StepOverview } from './components/StepOverview';
import { StepQualification } from './components/StepQualification';
import { StepRisks } from './components/StepRisks';
import { StepEvaluation } from './components/StepEvaluation';
import { StepStrategy } from './components/StepStrategy';
import { StepCapabilityMatrix } from './components/StepCapabilityMatrix';
import { StepCombatTasks } from './components/StepCombatTasks';
import { StepProposalOutline } from './components/StepProposalOutline';
import { StepHealthCheck } from './components/StepHealthCheck';
import { StepFinalReport } from './components/StepFinalReport';
import { TenderInputModal } from './components/TenderInputModal';
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { AIConsultantDrawer } from './components/AIConsultantDrawer';
import { sampleTenders, sampleCompanyProfiles } from './data/sampleTenders';
import { StepKey, TenderAnalysisResult, CompanyProfile } from './types';

export function App() {
  const [allTenders, setAllTenders] = useState<Record<string, TenderAnalysisResult>>(sampleTenders);
  const [activeTenderId, setActiveTenderId] = useState<string>('smart-city-it');
  const [activeStep, setActiveStep] = useState<StepKey>('overview');
  
  const [activeCompany, setActiveCompany] = useState<CompanyProfile>(sampleCompanyProfiles[0]);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const currentTender = allTenders[activeTenderId] || sampleTenders['smart-city-it'] || Object.values(allTenders)[0] || Object.values(sampleTenders)[0];

  const stepOrder: StepKey[] = [
    'overview',
    'qualification',
    'risks',
    'evaluation',
    'strategy',
    'matrix',
    'tasks',
    'proposal',
    'healthCheck',
    'report'
  ];

  const handleNextStep = () => {
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex < stepOrder.length - 1) {
      setActiveStep(stepOrder[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(stepOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNewTenderAnalyzed = (newTender: TenderAnalysisResult) => {
    setAllTenders(prev => ({
      ...prev,
      [newTender.id]: newTender
    }));
    setActiveTenderId(newTender.id);
    setActiveStep('overview');
  };

  const handleSelectPreset = (id: string) => {
    setActiveTenderId(id);
    // Align company profile with tender type for realistic immersion
    if (id === 'hospital-medical' || id.includes('medical')) {
      setActiveCompany(sampleCompanyProfiles[1] || sampleCompanyProfiles[0]); // 医疗制造
    } else if (id.includes('construction')) {
      setActiveCompany(sampleCompanyProfiles[2] || sampleCompanyProfiles[0]); // 建筑工程
    } else {
      setActiveCompany(sampleCompanyProfiles[0]); // IT集成
    }
    setActiveStep('overview');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Navbar
        currentTender={currentTender}
        allTenders={allTenders}
        onSelectTender={handleSelectPreset}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        activeCompany={activeCompany}
      />

      {/* 10-Step Workflow Ribbon */}
      <div className="print:hidden">
        <StepNavigation
          activeStep={activeStep}
          onSelectStep={(step) => {
            setActiveStep(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          tenderData={currentTender}
        />
      </div>

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {activeStep === 'overview' && (
          <StepOverview
            overview={currentTender.overview}
            onNext={handleNextStep}
          />
        )}

        {activeStep === 'qualification' && (
          <StepQualification
            qualifications={currentTender.qualifications}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {activeStep === 'risks' && (
          <StepRisks
            risks={currentTender.risks}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {activeStep === 'evaluation' && (
          <StepEvaluation
            scores={currentTender.evaluationScores}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {activeStep === 'strategy' && (
          <StepStrategy
            strategy={currentTender.strategy}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {activeStep === 'matrix' && (
          <StepCapabilityMatrix
            matrix={currentTender.capabilityMatrix}
            activeCompany={activeCompany}
            onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {activeStep === 'tasks' && (
          <StepCombatTasks
            tasks={currentTender.combatTasks}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {activeStep === 'proposal' && (
          <StepProposalOutline
            outline={currentTender.proposalOutline}
            overview={currentTender.overview}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {activeStep === 'healthCheck' && (
          <StepHealthCheck
            healthCheck={currentTender.healthCheck}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        )}

        {activeStep === 'report' && (
          <StepFinalReport
            report={currentTender.finalReport}
            overview={currentTender.overview}
            onPrev={handlePrevStep}
          />
        )}
      </main>

      {/* Bento Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 print:hidden mt-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="font-semibold text-slate-700">AI 投标作战指挥中心</span>
            <span>• 中小企业招投标全流程实战决策与控险平台</span>
          </div>
          <span>严格对齐《中华人民共和国招标投标法》与《政府采购法》规范</span>
        </div>
      </footer>

      {/* Upload / Ingestion Modal */}
      <TenderInputModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAnalyzeSuccess={handleNewTenderAnalyzed}
        onSelectPreset={handleSelectPreset}
        activeCompany={activeCompany}
      />

      {/* Company Profile Modal */}
      <CompanyProfileModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        activeCompany={activeCompany}
        onSelectCompany={setActiveCompany}
      />

      {/* AI Consultant Chat Drawer */}
      <AIConsultantDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        tenderData={currentTender}
      />
    </div>
  );
}

export default App;
