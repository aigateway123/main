import React from 'react';
import { Sparkles, Brain, Cpu, ShieldCheck, BookOpen, Activity } from 'lucide-react';

interface HeaderProps {
  isRunning: boolean;
  activeAgentsCount: number;
  totalTokensProcessed?: number;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  activeAgentsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-500/20">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-900 text-lg">
                Nova AI Research Agent
              </span>
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                Flagship v3.7
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              多智能体自主科研探索系统 · Multi-Agent Autonomous Academic Engine
            </p>
          </div>
        </div>

        {/* Right Status & Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-600">
            <Activity className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
            <span>4-Agent 协同总线</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-slate-700">IEEE / ArXiv 检索源已挂载</span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                isRunning
                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                  : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isRunning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
                }`}
              />
              <span>{isRunning ? `研究推进中 (${activeAgentsCount} Agents)` : '系统就绪'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
