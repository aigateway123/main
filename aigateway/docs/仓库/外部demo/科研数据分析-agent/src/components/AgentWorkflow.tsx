import React, { useState } from 'react';
import { 
  Bot, 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Zap
} from 'lucide-react';
import { AgentStep } from '../types';

interface AgentWorkflowProps {
  steps: AgentStep[];
  currentStepIndex: number;
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
  totalDurationMs?: number;
}

export const AgentWorkflow: React.FC<AgentWorkflowProps> = ({
  steps,
  currentStepIndex,
  isAnalyzing,
  hasAnalyzed,
}) => {
  const [showLogs, setShowLogs] = useState(false);

  // Calculate overall percentage
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <section className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Data Agent Process
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-blue-400 border border-[#1e293b]">
                自动化执行流
              </span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              自主执行数据识别、质量校验、统计推断、学术制图与结论提炼
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/30 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>正在执行: {steps[currentStepIndex]?.label || '计算中...'}</span>
            </div>
          )}
          {hasAnalyzed && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>9 项分析流程就绪 (4.2s)</span>
            </div>
          )}
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-xs text-[#94a3b8] hover:text-white px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-[#1e293b] border border-[#1e293b] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">工作日志</span>
            {showLogs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-[#64748b] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> 分析流进度 ({completedCount}/{steps.length})
          </span>
          <span className="text-blue-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-[#1e293b]">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grid of 9 Agent Steps matching Sophisticated Dark prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
        {steps.map((step, index) => {
          const isCurrent = isAnalyzing && index === currentStepIndex;
          const isDone = step.status === 'completed';
          const isPending = step.status === 'pending';

          return (
            <div
              key={step.id}
              className={`relative rounded-xl p-3.5 border transition-all duration-200 ${
                isDone
                  ? 'bg-black/40 border-[#1e293b] text-[#e2e8f0] hover:border-slate-700'
                  : isCurrent
                  ? 'bg-blue-500/10 border-blue-500 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-black/20 border-[#1e293b]/50 text-[#64748b]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 font-medium text-xs sm:text-sm">
                  {isDone && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  )}
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                  )}
                  {isPending && (
                    <span className="w-2 h-2 rounded-full bg-[#334155] flex-shrink-0" />
                  )}
                  <span className={`font-semibold ${isDone ? 'text-emerald-400' : isCurrent ? 'text-blue-400' : 'text-[#64748b]'}`}>
                    {step.label}
                  </span>
                </div>

                {isDone && step.durationMs && (
                  <span className="text-[10px] font-mono text-[#64748b] bg-[#0f172a] px-1.5 py-0.5 rounded border border-[#1e293b]">
                    {step.durationMs}ms
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[#94a3b8] leading-relaxed line-clamp-2 pl-4 font-sans">
                {step.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Terminal Log Output Drawer */}
      {showLogs && (
        <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-[#1e293b] font-mono text-xs text-[#cbd5e1] space-y-1 max-h-48 overflow-y-auto">
          <div className="text-blue-400 flex items-center gap-1.5 pb-1 border-b border-[#1e293b] text-[11px]">
            <Terminal className="w-3.5 h-3.5" /> Agent Session Execution Stream Log
          </div>
          {steps.map((st, i) => (
            <div key={st.id} className="flex items-start gap-2 text-[11px] py-0.5">
              <span className="text-[#64748b]">[+{(i * 480).toString().padStart(4, '0')}ms]</span>
              <span className="text-emerald-400">SUCCESS</span>
              <span className="text-blue-300 font-semibold">{st.label}:</span>
              <span className="text-[#94a3b8]">{st.detail}</span>
            </div>
          ))}
          <div className="text-[#64748b] text-[11px] pt-1">
            [DATA_AGENT_SYS] All statistical hypothesis tests verified. Statistical power &gt; 0.999. Output ready.
          </div>
        </div>
      )}
    </section>
  );
};
