import React from 'react';
import { 
  CalendarCheck, 
  Settings2, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  Code2, 
  Play, 
  FileSpreadsheet,
  Cpu,
  Zap
} from 'lucide-react';
import { ResearchPaper } from '../types';

interface ExperimentPlanViewProps {
  currentPaper: ResearchPaper;
  onProceedToCode: () => void;
  onRunExperiment: () => void;
}

export const ExperimentPlanView: React.FC<ExperimentPlanViewProps> = ({
  currentPaper,
  onProceedToCode,
  onRunExperiment
}) => {
  const hp = currentPaper.experimentPlan.hyperparameters;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-slate-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161923] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">实验计划与协议设计 (Experimental Plan & Protocol)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Agent 已根据论文 Section 4 结构化提取了完整基准协议、数据集划分、超参数矩阵及评测方案。
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onProceedToCode}
            className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>查看工程代码</span>
          </button>
          <button
            onClick={onRunExperiment}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all hover:scale-[1.02]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>执行实验拟合</span>
          </button>
        </div>
      </div>

      {/* Grid: Target Benchmark Table Schema & Hyperparameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Target Benchmark Table Spec */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#161923] border border-white/10 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white">
                  目标复现表格结构: {currentPaper.experimentPlan.targetTable}
                </h2>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                Multivariate Setting
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              在 Weather 数据集上，针对预测步长 H ∈ &#123;96, 192, 336, 720&#125; 进行多变量输入到多变量输出预测。评测指标为均方误差 (MSE) 与平均绝对误差 (MAE)。
            </p>

            {/* Protocol Matrix */}
            <div className="border border-white/10 rounded-lg overflow-hidden text-xs">
              <div className="bg-white/5 px-3.5 py-2.5 text-slate-200 font-bold text-[11px] uppercase tracking-wider border-b border-white/10 flex justify-between">
                <span>实验评测配置维度</span>
                <span>协议规范</span>
              </div>
              <div className="divide-y divide-white/5 bg-black/30">
                <div className="px-3.5 py-2.5 flex justify-between items-center">
                  <span className="text-slate-400">回看窗口 (Lookback Window L)</span>
                  <span className="font-mono text-cyan-300 font-semibold">336 steps</span>
                </div>
                <div className="px-3.5 py-2.5 flex justify-between items-center">
                  <span className="text-slate-400">预测步长集合 (Forecast Horizons H)</span>
                  <span className="font-mono text-emerald-400 font-semibold">[96, 192, 336, 720]</span>
                </div>
                <div className="px-3.5 py-2.5 flex justify-between items-center">
                  <span className="text-slate-400">基准对比方法 (Baselines)</span>
                  <span className="text-slate-200">DLinear, Autoformer, Informer, FedFormer</span>
                </div>
                <div className="px-3.5 py-2.5 flex justify-between items-center">
                  <span className="text-slate-400">随机种子检验 (Multiple Seeds)</span>
                  <span className="font-mono text-slate-200">Seeds = [2021, 2022, 2023] (3-Run Mean)</span>
                </div>
                <div className="px-3.5 py-2.5 flex justify-between items-center">
                  <span className="text-slate-400">硬件与早停标准</span>
                  <span className="text-slate-200">Patience = 10 epochs on Validation Loss</span>
                </div>
              </div>
            </div>

            {/* Workflow Pipeline Card */}
            <div className="bg-black/40 border border-white/5 rounded-lg p-3.5 text-xs text-slate-300">
              <div className="font-semibold text-cyan-300 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>自动执行脚本管线:</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 bg-black/60 p-3 rounded-lg border border-white/5 space-y-1">
                <div><span className="text-slate-500"># 1. 运行完整基准脚本</span></div>
                <div className="text-emerald-400">bash experiments/run_benchmark.sh</div>
                <div><span className="text-slate-500"># 2. 导出 Table 2 结果与 LaTeX</span></div>
                <div className="text-cyan-300">python results/generate_table.py --dataset Weather</div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Col: Hyperparameter Matrix GUI */}
        <div className="space-y-4">
          <div className="bg-[#161923] border border-white/10 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">模型与训练超参数 (config.yaml)</h2>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Patch Length (P) / Stride (S)</span>
                <span className="font-mono text-white font-semibold">16 / 8</span>
              </div>

              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Model Dim / Heads / Layers</span>
                <span className="font-mono text-cyan-300 font-semibold">{hp.d_model} / {hp.n_heads} / {hp.e_layers}</span>
              </div>

              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Learning Rate</span>
                <span className="font-mono text-emerald-400 font-semibold">{hp.learning_rate}</span>
              </div>

              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Batch Size / Epochs</span>
                <span className="font-mono text-white font-semibold">{hp.batch_size} / {hp.epochs}</span>
              </div>

              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Optimizer / Scheduler</span>
                <span className="font-mono text-slate-300 font-semibold">{hp.optimizer} ({hp.scheduler})</span>
              </div>

              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Dropout Rate</span>
                <span className="font-mono text-amber-300 font-semibold">{hp.dropout}</span>
              </div>

              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">RevIN Normalization</span>
                <span className="font-mono text-emerald-400 font-semibold">Enabled (Affine=True)</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              * 超参数可通过左侧科研监督智能体直接以自然语言修改（例如：“将初始学习率修改为 5e-4”）。
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
