import React from 'react';
import { 
  FileCode2, 
  Download, 
  Play, 
  Sparkles, 
  BookOpen, 
  GitBranch,
  FilePlus2,
  CheckCircle2
} from 'lucide-react';
import { ResearchPaper } from '../types';

interface HeaderProps {
  currentPaper: ResearchPaper;
  allPapers: ResearchPaper[];
  onSelectPaper: (paper: ResearchPaper) => void;
  onOpenUploadModal: () => void;
  onQuickReproduce: () => void;
  onDownloadZip: () => void;
  onRunExperiment: () => void;
  isExecuting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPaper,
  allPapers,
  onSelectPaper,
  onOpenUploadModal,
  onQuickReproduce,
  onDownloadZip,
  onRunExperiment,
  isExecuting
}) => {
  return (
    <header className="bg-[#0E1018] border-b border-white/5 text-slate-300 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">
                  Paper2Code <span className="text-cyan-400">Agent</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PhD Copilot
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                论文实验代码复现智能体 · 科研全流程闭环
              </p>
            </div>
          </div>

          {/* Active Session Pill */}
          <div className="hidden lg:flex items-center bg-[#161923] rounded-full px-4 py-1.5 border border-white/10 shadow-inner">
            <span className="text-xs font-mono text-cyan-400 mr-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              ACTIVE SESSION:
            </span>
            <div className="flex items-center space-x-2">
              <select
                value={currentPaper.id}
                onChange={(e) => {
                  const found = allPapers.find(p => p.id === e.target.value);
                  if (found) onSelectPaper(found);
                }}
                className="bg-transparent text-xs font-medium text-slate-100 uppercase tracking-wide outline-none cursor-pointer pr-1"
              >
                {allPapers.map((paper) => (
                  <option key={paper.id} value={paper.id} className="bg-[#161923] text-slate-200">
                    {paper.shortName}
                  </option>
                ))}
              </select>
              <button
                onClick={onOpenUploadModal}
                title="导入新论文进行复现"
                className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <FilePlus2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onQuickReproduce}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>一键复现 Table 2</span>
            </button>

            <button
              onClick={onRunExperiment}
              disabled={isExecuting}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isExecuting
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
              }`}
            >
              {isExecuting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>实验拟合中...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>运行实验</span>
                </>
              )}
            </button>

            <button
              onClick={onDownloadZip}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
              title="打包导出包含 /data, /models, train.py 的完整 Python 项目"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">导出代码</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300 shadow-inner">
              PHD
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
