import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  TableProperties, 
  FileSearch, 
  AlertOctagon, 
  Calculator, 
  Scale, 
  Code2, 
  BarChart3, 
  FileText 
} from 'lucide-react';
import { AgentStep } from '../types';

interface AgentWorkflowProgressProps {
  steps: AgentStep[];
  activeStepId: number | null;
  onSelectStep: (stepId: number) => void;
  isAnalyzing: boolean;
}

const STEP_ICONS = [
  TableProperties, // 1. 自动识别字段
  FileSearch,      // 2. 检查缺失值
  AlertOctagon,    // 3. 检查异常值
  Calculator,      // 4. 自动统计
  Scale,           // 5. 选择合适分析方法
  Code2,           // 6. 生成 Python / R 代码
  BarChart3,       // 7. 生成可视化
  FileText,        // 8. 输出分析报告
];

export const AgentWorkflowProgress: React.FC<AgentWorkflowProgressProps> = ({
  steps,
  activeStepId,
  onSelectStep,
  isAnalyzing,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-4 bg-blue-600 rounded-xs inline-block" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Agent Thinking & Workflow Pipeline
          </h2>
          <span className="text-xs text-slate-500 font-normal">
            {isAnalyzing ? '(自动化统计推断执行中...)' : '(8 阶段执行闭环 · 点击各阶段查看推断与执行代码)'}
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
          <span>PID: 8829</span>
          <span>·</span>
          <span className="text-blue-600 font-medium">Model: Gemini 3.7 Flash</span>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {steps.map((step, idx) => {
          const Icon = STEP_ICONS[idx] || CheckCircle2;
          const isSelected = activeStepId === step.id;
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isWarning = step.status === 'warning';

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 shadow-xs ring-1 ring-blue-500/30'
                  : isRunning
                  ? 'bg-blue-50/70 border-blue-400 animate-pulse ring-1 ring-blue-400/20'
                  : isCompleted
                  ? 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  : 'bg-slate-50/30 border-slate-100 opacity-60'
              }`}
            >
              {/* Top Row: Index & Status Icon */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  0{step.id}
                </span>
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : isWarning ? (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-slate-300" />
                )}
              </div>

              {/* Icon & Title */}
              <div className="flex items-center space-x-1.5 my-1">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                <span className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-950 font-bold' : 'text-slate-800'}`}>
                  {step.title}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {step.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
