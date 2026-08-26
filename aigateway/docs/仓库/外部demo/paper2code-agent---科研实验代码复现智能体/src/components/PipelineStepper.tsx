import React from 'react';
import { 
  FileText, 
  CalendarCheck, 
  Code2, 
  PlaySquare, 
  Scale, 
  LineChart,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { PipelineStage } from '../types';

interface PipelineStepperProps {
  activeStage: PipelineStage;
  onSelectStage: (stage: PipelineStage) => void;
  isExecuted: boolean;
}

interface StepConfig {
  id: PipelineStage;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    id: 'extract',
    title: '1. 论文解析',
    subtitle: '提取方法与公式',
    icon: FileText
  },
  {
    id: 'plan',
    title: '2. 实验规划',
    subtitle: '设定基准与指标',
    icon: CalendarCheck
  },
  {
    id: 'code',
    title: '3. 代码工程',
    subtitle: '生成完整Python项目',
    icon: Code2
  },
  {
    id: 'execute',
    title: '4. 实验运行',
    subtitle: '训练与损失拟合',
    icon: PlaySquare
  },
  {
    id: 'compare',
    title: '5. 结果对比与归因',
    subtitle: '对比原论文差异',
    icon: Scale
  },
  {
    id: 'charts',
    title: '6. 图表与 LaTeX',
    subtitle: '出版级图表与表格',
    icon: LineChart
  }
];

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  activeStage,
  onSelectStage,
  isExecuted
}) => {
  const getStageIndex = (stage: PipelineStage) => STEPS.findIndex(s => s.id === stage);
  const activeIdx = getStageIndex(activeStage);

  return (
    <div className="bg-[#0E1018] border-b border-white/5 px-4 py-2.5 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = step.id === activeStage;
          const isDone = idx < activeIdx || (idx === 3 && isExecuted) || (idx <= 4 && isExecuted);

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onSelectStage(step.id)}
                className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-left transition-all whitespace-nowrap group ${
                  isActive
                    ? 'bg-indigo-950/40 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 ring-1 ring-cyan-500/20'
                    : isDone
                    ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#161923] text-slate-400 border border-white/5'
                  }`}
                >
                  {isDone && !isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className={`text-xs font-semibold ${isActive ? 'text-cyan-200' : 'text-slate-200'}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {step.subtitle}
                  </span>
                </div>
              </button>

              {idx < STEPS.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
