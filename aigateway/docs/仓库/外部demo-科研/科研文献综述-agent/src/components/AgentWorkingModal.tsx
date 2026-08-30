import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, Database, Network, Search, Cpu, Terminal, Zap, FastForward } from 'lucide-react';

interface AgentWorkingModalProps {
  topic: string;
  onComplete: () => void;
}

interface StepItem {
  id: number;
  label: string;
  detail: string;
  icon: React.ReactNode;
}

const AGENT_STEPS: StepItem[] = [
  {
    id: 1,
    label: '正在理解研究问题',
    detail: '语义解析研究目标、时间边界（近5年）与关键技术实体（Transformer, GNN, 时序）...',
    icon: <Sparkles className="w-4 h-4 text-[#2dd4bf]" />,
  },
  {
    id: 2,
    label: '正在检索相关论文',
    detail: '跨库检索 IEEE Xplore, ScienceDirect, ArXiv, Springer, ACM DL 学术文献库...',
    icon: <Search className="w-4 h-4 text-[#2dd4bf]" />,
  },
  {
    id: 3,
    label: '正在筛选高相关文献',
    detail: '计算文献相关度得分、期刊影响因子（JCR Q1/Top）与引用影响力过滤...',
    icon: <Database className="w-4 h-4 text-[#2dd4bf]" />,
  },
  {
    id: 4,
    label: '正在分析研究主题',
    detail: '运行 LDA 主题模型与 BERTopic 深度聚类，提取核心研究范式...',
    icon: <Cpu className="w-4 h-4 text-[#2dd4bf]" />,
  },
  {
    id: 5,
    label: '正在聚类研究方向',
    detail: '构建技术演进图谱：统计学基线 ➔ 循环网络 ➔ 自注意力 ➔ 时空图卷积...',
    icon: <Network className="w-4 h-4 text-[#2dd4bf]" />,
  },
  {
    id: 6,
    label: '正在识别研究空白',
    detail: '对比研究现状与前沿瓶颈，交叉挖掘极端天气、动态电价及跨域迁移创新机会...',
    icon: <Zap className="w-4 h-4 text-amber-400" />,
  },
  {
    id: 7,
    label: '正在生成研究综述',
    detail: '汇总结构化研究概览、前沿热点评级、演进图谱与可落地实验方案...',
    icon: <CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" />,
  },
];

export const AgentWorkingModal: React.FC<AgentWorkingModalProps> = ({ topic, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [scannedPapers, setScannedPapers] = useState<number>(0);
  const [progress, setProgress] = useState<number>(5);

  useEffect(() => {
    // Total animation time: ~6.5 seconds divided across 7 steps
    const stepDuration = 900; // ms per step
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < AGENT_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 800);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Paper counter animation
  useEffect(() => {
    const totalTarget = 1263;
    const counterInterval = setInterval(() => {
      setScannedPapers((prev) => {
        if (prev < totalTarget) {
          const step = Math.ceil((totalTarget - prev) / 8);
          return Math.min(totalTarget, prev + Math.max(step, 14));
        }
        return totalTarget;
      });
    }, 60);

    return () => clearInterval(counterInterval);
  }, []);

  // Update progress percentage
  useEffect(() => {
    const calcProgress = Math.min(100, Math.round(((currentStepIndex + 1) / AGENT_STEPS.length) * 100));
    setProgress(calcProgress);
  }, [currentStepIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-all duration-300">
      <div className="bg-[#111] rounded-2xl border border-[#222] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col">
        {/* Modal Top Academic Status Banner */}
        <div className="bg-[#161616] text-[#f0f0f0] p-5 sm:p-6 border-b border-[#222]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a2d2a] border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
                <Terminal className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#f0f0f0] tracking-tight flex items-center">
                  Research Agent 正在工作
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-ping mr-1.5"></span>
                    Live Execution
                  </span>
                </h3>
                <p className="text-xs text-[#888] mt-0.5">
                  目标主题：<span className="text-[#e0e0e0] font-medium">{topic}</span>
                </p>
              </div>
            </div>

            {/* Quick Skip button */}
            <button
              onClick={onComplete}
              className="text-xs text-[#888] hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded bg-[#222] hover:bg-[#333] transition-all cursor-pointer border border-[#333]"
              title="跳过动画直接查看结果"
            >
              <FastForward className="w-3 h-3" />
              <span className="hidden sm:inline">跳过动画</span>
            </button>
          </div>

          {/* Telemetry Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#262626] text-xs">
            <div className="bg-[#0e0e0e] rounded-lg p-2.5 text-center border border-[#222]">
              <div className="text-[10px] text-[#666] uppercase font-bold">已检索文献</div>
              <div className="text-sm font-bold text-[#f0f0f0] font-mono mt-0.5">
                {scannedPapers.toLocaleString()} <span className="text-[10px] font-normal text-[#666]">篇</span>
              </div>
            </div>
            <div className="bg-[#0e0e0e] rounded-lg p-2.5 text-center border border-[#222]">
              <div className="text-[10px] text-[#666] uppercase font-bold">分析进度</div>
              <div className="text-sm font-bold text-[#2dd4bf] font-mono mt-0.5">{progress}%</div>
            </div>
            <div className="bg-[#0e0e0e] rounded-lg p-2.5 text-center border border-[#222]">
              <div className="text-[10px] text-[#666] uppercase font-bold">执行阶段</div>
              <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                0{currentStepIndex + 1} / 0{AGENT_STEPS.length}
              </div>
            </div>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-[#222] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#2dd4bf] h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Steps List Area */}
        <div className="p-6 space-y-3 bg-[#0c0c0c] max-h-[380px] overflow-y-auto">
          {AGENT_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-start space-x-3.5 p-3 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#1a2d2a] border-[#2dd4bf]/40 shadow-sm'
                    : isCompleted
                    ? 'bg-[#141414] border-[#222] text-[#ccc]'
                    : 'bg-[#0f0f0f] border-transparent text-[#555] opacity-50'
                }`}
              >
                {/* Step State Icon */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/40 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-[#2dd4bf] text-black flex items-center justify-center animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#222] text-[#666] flex items-center justify-center text-[10px] font-bold font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold flex items-center ${
                        isCurrent
                          ? 'text-[#2dd4bf]'
                          : isCompleted
                          ? 'text-[#f0f0f0]'
                          : 'text-[#666]'
                      }`}
                    >
                      {isCompleted && <span className="text-[#2dd4bf] mr-1.5 font-bold">✓</span>}
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf] animate-pulse bg-[#1a2d2a] px-2 py-0.5 rounded border border-[#2dd4bf]/30">
                        正在执行...
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-semibold text-[#888]">已完成</span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isCurrent
                        ? 'text-[#a0e6dc]'
                        : isCompleted
                        ? 'text-[#777]'
                        : 'text-[#555]'
                    }`}
                  >
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#111] border-t border-[#222] flex items-center justify-between text-xs text-[#666]">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-ping"></span>
            <span>Agent 正在综合语义推理与拓扑分析...</span>
          </div>
          <span className="font-mono text-[#555]">Deep Literature Synthesizer v2.4</span>
        </div>
      </div>
    </div>
  );
};
