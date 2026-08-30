import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Terminal, 
  Activity, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { TrainingEpochLog, ConsoleLogMessage, ResearchPaper } from '../types';

interface ExperimentRunnerViewProps {
  currentPaper: ResearchPaper;
  trainingLogs: TrainingEpochLog[];
  consoleLogs: ConsoleLogMessage[];
  currentEpoch: number;
  maxEpochs: number;
  isRunning: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFastForward: () => void;
  onProceedToCompare: () => void;
}

export const ExperimentRunnerView: React.FC<ExperimentRunnerViewProps> = ({
  currentPaper,
  trainingLogs,
  consoleLogs,
  currentEpoch,
  maxEpochs,
  isRunning,
  isCompleted,
  onStart,
  onPause,
  onReset,
  onFastForward,
  onProceedToCompare
}) => {
  const latestLog = trainingLogs[trainingLogs.length - 1] || {
    train_loss: 0.482,
    val_loss: 0.495,
    test_mse: 0.151,
    test_mae: 0.199,
    gpu_mem_mb: 1840,
    learning_rate: 0.0005
  };

  const progressPct = Math.min(100, Math.round((currentEpoch / maxEpochs) * 100));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-300">
      
      {/* Top Execution Dashboard Header */}
      <div className="bg-[#161923] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className={`w-3 h-3 rounded-full ${
              isRunning ? 'bg-cyan-400 animate-ping' : isCompleted ? 'bg-emerald-400' : 'bg-slate-600'
            }`} />
            <h1 className="text-base font-bold text-white tracking-tight">
              实验拟合与模型训练执行器 (Sandbox Experiment Runner)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            执行指令: <span className="font-mono text-cyan-300">python train.py --data Weather --seq_len 336 --pred_len 96</span>
          </p>
        </div>

        {/* Execution Control Buttons */}
        <div className="flex items-center space-x-2">
          {!isRunning && !isCompleted && (
            <button
              onClick={onStart}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>开始训练</span>
            </button>
          )}

          {isRunning && (
            <button
              onClick={onPause}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>暂停</span>
            </button>
          )}

          <button
            onClick={onFastForward}
            disabled={isCompleted}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center space-x-1 ${
              isCompleted
                ? 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            }`}
            title="直接加速至 50 Epochs 最终收敛状态"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>极速完成</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="重置实验"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-[#161923] border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>训练轮次 (Epoch)</span>
            <span className="font-mono text-cyan-400 font-bold">{progressPct}%</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            {currentEpoch} <span className="text-xs text-slate-500 font-normal">/ {maxEpochs}</span>
          </div>
          <div className="w-full bg-black/40 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="bg-[#161923] border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>当前 Train / Val MSE</span>
            <TrendingDown className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-bold text-emerald-400">
            {latestLog.val_loss?.toFixed(4) || '0.1512'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Train Loss: {latestLog.train_loss?.toFixed(4) || '0.1485'}
          </div>
        </div>

        <div className="bg-[#161923] border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>测试集 Test MSE (H=96)</span>
            <Activity className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-xl font-mono font-bold text-cyan-300">
            {latestLog.test_mse?.toFixed(3) || '0.151'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            原论文目标: <span className="font-mono text-slate-300">0.149</span>
          </div>
        </div>

        <div className="bg-[#161923] border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>GPU 显存 / 学习率</span>
            <Cpu className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-200">
            {(latestLog.gpu_mem_mb / 1024).toFixed(2)} <span className="text-xs text-slate-500 font-normal">GB</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            LR: {latestLog.learning_rate || '5e-4'}
          </div>
        </div>

      </div>

      {/* Completion Banner if completed */}
      {isCompleted && (
        <div className="bg-[#161923] border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl shadow-emerald-950/20 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300">
                实验已顺利完成收敛！(Table 2 全部多步长复现就绪)
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                测试集指标 H=96 MSE 达到 0.151（与论文 0.149 偏差在 ±1.3% 容差区间内）。
              </div>
            </div>
          </div>

          <button
            onClick={onProceedToCompare}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>进入结果对比与归因分析</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chart & Live Terminal Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Loss Curve Chart */}
        <div className="bg-[#161923] border border-white/10 rounded-xl p-4 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-cyan-400" />
              <span>训练损失与验证损失曲线 (Loss Convergence Curve)</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">MSE Loss</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingLogs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1C24" />
                <XAxis 
                  dataKey="epoch" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false}
                  label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5, fill: '#94a3b8', fontSize: 10 }}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  domain={['dataMin - 0.05', 'dataMax + 0.05']}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161923', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line 
                  type="monotone" 
                  dataKey="train_loss" 
                  name="Train MSE Loss" 
                  stroke="#22d3ee" 
                  strokeWidth={2} 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="val_loss" 
                  name="Val MSE Loss" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="test_mse" 
                  name="Test MSE (Horizon 96)" 
                  stroke="#a78bfa" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4"
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Live Terminal Console Output */}
        <div className="bg-[#161923] border border-white/10 rounded-xl p-4 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white">终端实时运行日志 (STDOUT Console)</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-white/5 font-mono">
              PyTorch 2.2 · CUDA 12.1
            </span>
          </div>

          <div className="flex-1 bg-black/50 rounded-lg p-3 font-mono text-[11px] text-slate-300 h-64 overflow-y-auto space-y-1 border border-white/5">
            {consoleLogs.map((log, idx) => {
              const color = 
                log.level === 'ERROR' ? 'text-rose-400' :
                log.level === 'WARN' ? 'text-amber-300' :
                log.level === 'METRIC' ? 'text-emerald-300' :
                log.level === 'DEBUG' ? 'text-slate-500' :
                'text-cyan-300';

              return (
                <div key={log.id || `console-log-${idx}-${log.timestamp}`} className="leading-tight">
                  <span className="text-slate-600 select-none">[{log.timestamp}] </span>
                  <span className={`font-semibold ${color}`}>[{log.level}] </span>
                  <span className="text-slate-200">{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
