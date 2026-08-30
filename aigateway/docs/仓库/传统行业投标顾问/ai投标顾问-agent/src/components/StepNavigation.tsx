import React from 'react';
import { 
  FileText, 
  UserCheck, 
  AlertTriangle, 
  Calculator, 
  TrendingUp, 
  GitCompare, 
  CheckSquare, 
  FolderTree, 
  Activity, 
  Award 
} from 'lucide-react';
import { StepKey, TenderAnalysisResult } from '../types';

interface StepNavigationProps {
  activeStep: StepKey;
  onSelectStep: (step: StepKey) => void;
  tenderData: TenderAnalysisResult;
}

interface StepItem {
  key: StepKey;
  stepNum: string;
  label: string;
  icon: React.ElementType;
  badge?: {
    text: string;
    variant: 'danger' | 'warning' | 'success' | 'info';
  };
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  activeStep,
  onSelectStep,
  tenderData
}) => {
  const highRiskCount = tenderData?.risks?.filter(r => r.riskLevel === 'high')?.length || 0;
  const pendingQualCount = tenderData?.qualifications?.filter(q => q.status === '待确认')?.length || 0;

  const steps: StepItem[] = [
    {
      key: 'overview',
      stepNum: '01',
      label: '项目概览',
      icon: FileText
    },
    {
      key: 'qualification',
      stepNum: '02',
      label: '资格审查',
      icon: UserCheck,
      badge: pendingQualCount > 0 ? { text: `${pendingQualCount}项待确认`, variant: 'warning' } : undefined
    },
    {
      key: 'risks',
      stepNum: '03',
      label: '⚠️ 废标风险',
      icon: AlertTriangle,
      badge: highRiskCount > 0 ? { text: `${highRiskCount}项高危`, variant: 'danger' } : undefined
    },
    {
      key: 'evaluation',
      stepNum: '04',
      label: '评分拆解',
      icon: Calculator
    },
    {
      key: 'strategy',
      stepNum: '05',
      label: '提分机会',
      icon: TrendingUp,
      badge: { text: '+8.5分抓手', variant: 'success' }
    },
    {
      key: 'matrix',
      stepNum: '06',
      label: '能力匹配',
      icon: GitCompare
    },
    {
      key: 'tasks',
      stepNum: '07',
      label: '作战清单',
      icon: CheckSquare
    },
    {
      key: 'proposal',
      stepNum: '08',
      label: '方案框架',
      icon: FolderTree
    },
    {
      key: 'healthCheck',
      stepNum: '09',
      label: '标书体检',
      icon: Activity,
      badge: { text: `${tenderData.healthCheck?.healthScore || 84}分`, variant: 'info' }
    },
    {
      key: 'report',
      stepNum: '10',
      label: '作战报告',
      icon: Award
    }
  ];

  return (
    <div className="w-full bg-white/90 border-b border-slate-200 backdrop-blur-sm sticky top-16 z-20 overflow-x-auto no-scrollbar shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-1.5 sm:space-x-2 py-2.5 min-w-max">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.key;

            return (
              <button
                key={step.key}
                onClick={() => onSelectStep(step.key)}
                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    {step.stepNum}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span>{step.label}</span>
                </div>

                {step.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    step.badge.variant === 'danger'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : step.badge.variant === 'warning'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : step.badge.variant === 'success'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {step.badge.text}
                  </span>
                )}

                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
