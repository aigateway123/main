import React from 'react';
import { Database, FileSpreadsheet, Sparkles, Beaker, CheckCircle2, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentDatasetName: string;
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDatasetName,
  isAnalyzing,
  hasAnalyzed,
  onReset,
}) => {
  return (
    <header className="border-b border-[#1e293b] bg-[#050505] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              科研数据分析 <span className="text-blue-500">Agent</span>
            </h1>
          </div>
          <p className="text-[#94a3b8] text-xs sm:text-sm">
            从原始实验数据到科研洞察，让 AI 自动完成数据分析
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">System Status</p>
            <p className="text-xs font-mono text-slate-300">Analysis Engine v2.4.0</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-xs text-slate-300">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-xs text-white">{currentDatasetName}</span>
              {hasAnalyzed && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> 就绪
                </span>
              )}
              {isAnalyzing && (
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> 计算中
                </span>
              )}
            </div>

            {hasAnalyzed && (
              <button
                onClick={onReset}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-slate-400 hover:text-white border border-[#1e293b] transition-colors cursor-pointer"
              >
                重置
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
