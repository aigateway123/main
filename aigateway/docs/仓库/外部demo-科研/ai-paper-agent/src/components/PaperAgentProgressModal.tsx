import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Bot, Terminal } from 'lucide-react';

interface PaperAgentProgressModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const PaperAgentProgressModal: React.FC<PaperAgentProgressModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const steps = [
    { id: 1, text: '读取实验结果', en: '读取关键实验指标与拟合数据 (MAE: 14.28 kW)' },
    { id: 2, text: '分析实验数据', en: '分析 1,240 个快充枢纽的 525,600 个连续时间步' },
    { id: 3, text: '读取实验图表', en: '解析 Figure 1 负荷曲线与 Figure 2 空间交叉注意力矩阵' },
    { id: 4, text: '对比Baseline', en: '对齐对比 ARIMA, Random Forest, XGBoost, LSTM, STGCN' },
    { id: 5, text: '提取关键结论', en: '提炼核心结论: MAE 相对降低 21.4% 及分时动态电价负荷迁移规律' },
    { id: 6, text: '生成Results', en: '自动起草 Section 4.3 实验结果与对比分析章节' },
    { id: 7, text: '生成Discussion', en: '撰写 Section 5 讨论章节：电网韧性与削峰填谷调度' },
    { id: 8, text: '检查科研表达', en: '审查学术措辞、LaTeX 数学公式与交叉引用文献格式' },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      setLogs([]);
      return;
    }

    // Step progression timer
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        const activeStep = steps[step];
        setCompletedSteps(prev => [...prev, step]);
        setLogs(prev => [
          ...prev,
          `[智能体 ${new Date().toLocaleTimeString()}] ✓ ${activeStep.text}：${activeStep.en}`,
        ]);
        step++;
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((completedSteps.length / steps.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Paper Agent</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                  实验数据驱动生成
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                正在深度理解实验数据并自主撰写学术论文...
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-xs text-slate-400">生成进度</div>
            <div className="text-lg font-bold text-cyan-400">{progressPercent}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full my-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 8-Step Checklist from Prompt */}
        <div className="space-y-2 my-4">
          {steps.map((s, idx) => {
            const isDone = completedSteps.includes(idx);
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={s.id}
                className={`flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                  isDone
                    ? 'bg-slate-950/60 text-slate-200 border border-slate-800/80'
                    : isCurrent
                    ? 'bg-blue-950/40 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-500 opacity-40'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {isDone ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 text-slate-600 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </div>
                  )}
                  <span className="font-medium text-slate-100">{s.text}</span>
                </div>

                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  {isDone ? '已完成' : isCurrent ? '正在处理...' : '等待中'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Terminal log window */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-400 h-24 overflow-y-auto space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-500 pb-1 border-b border-slate-900">
            <Terminal className="w-3 h-3 text-cyan-500" />
            <span>AI Agent 实时执行流</span>
          </div>
          {logs.map((log, idx) => (
            <div key={idx} className="text-emerald-400/90 leading-tight">
              {log}
            </div>
          ))}
          {currentStepIndex < steps.length && (
            <div className="text-slate-500 animate-pulse">
              &gt; 正在将实验证据与图表结论转化为规范学术论文...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
