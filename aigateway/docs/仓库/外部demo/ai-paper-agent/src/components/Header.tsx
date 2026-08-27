import React from 'react';
import { WorkflowStep } from '../types';
import { 
  FileText, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Download, 
  RotateCcw,
  BookOpen,
  Layers,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface HeaderProps {
  currentStep: WorkflowStep;
  onSelectStep: (step: WorkflowStep) => void;
  hasGeneratedPaper: boolean;
  hasReviewed: boolean;
  hasAppliedAblation: boolean;
  onOpenExport: () => void;
  onReset: () => void;
  serifMode: boolean;
  onToggleSerif: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  hasGeneratedPaper,
  hasReviewed,
  hasAppliedAblation,
  onOpenExport,
  onReset,
  serifMode,
  onToggleSerif,
}) => {
  const steps: { id: WorkflowStep; label: string; enLabel: string; isAvailable: boolean; isDone: boolean }[] = [
    { 
      id: 'experiment', 
      label: '1. 实验项目', 
      enLabel: '实验数据与图表', 
      isAvailable: true, 
      isDone: hasGeneratedPaper 
    },
    { 
      id: 'paper', 
      label: '2. 论文正文', 
      enLabel: '论文与实验结果', 
      isAvailable: hasGeneratedPaper, 
      isDone: hasReviewed 
    },
    { 
      id: 'reviewer', 
      label: '3. AI 审稿', 
      enLabel: '同行审稿专家', 
      isAvailable: hasGeneratedPaper, 
      isDone: hasAppliedAblation 
    },
    { 
      id: 'revision', 
      label: '4. 修改与消融', 
      enLabel: '修改建议与消融实验', 
      isAvailable: hasReviewed, 
      isDone: hasAppliedAblation 
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      {/* Top Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectStep('experiment')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  AI Paper Agent
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                  科研智能工作台
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal hidden sm:block">
                从实验结果到论文，让 AI 帮你完成科研写作与审稿
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Serif / Sans Typography Toggle */}
            <button
              onClick={onToggleSerif}
              title="切换排版字体 (LaTeX 衬线体 / 现代无衬线体)"
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center space-x-1.5 ${
                serifMode
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-inner'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{serifMode ? 'LaTeX 衬线体' : '无衬线体'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              title="重置工作流"
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">重置</span>
            </button>

            {/* Export Paper Button */}
            <button
              onClick={onOpenExport}
              disabled={!hasGeneratedPaper}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all shadow-md ${
                hasGeneratedPaper
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出论文</span>
            </button>
          </div>
        </div>
      </div>

      {/* Closed-Loop Workflow Stepper */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 py-2.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => step.isAvailable && onSelectStep(step.id)}
                  disabled={!step.isAvailable}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : step.isDone
                      ? 'bg-slate-800/90 text-emerald-400 hover:bg-slate-800 border border-emerald-500/30'
                      : step.isAvailable
                      ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                      : 'text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-blue-700'
                        : step.isDone
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {step.isDone ? '✓' : idx + 1}
                  </span>
                  <span>{step.label}</span>
                  <span className="text-[10px] opacity-70 hidden md:inline">({step.enLabel})</span>
                </button>

                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 mx-1 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
