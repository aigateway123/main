import React from 'react';
import { X, Terminal, CheckCircle2, Clock, ShieldCheck, BookOpen, LineChart, Code2, Cpu } from 'lucide-react';
import { AgentInfo, AgentRole } from '../types';

interface AgentLogDrawerProps {
  agent: AgentInfo | null;
  onClose: () => void;
}

export const AgentLogDrawer: React.FC<AgentLogDrawerProps> = ({ agent, onClose }) => {
  if (!agent) return null;

  const getAgentIcon = (id: AgentRole) => {
    switch (id) {
      case 'literature':
        return <BookOpen className="h-5 w-5" />;
      case 'analysis':
        return <LineChart className="h-5 w-5" />;
      case 'coding':
        return <Code2 className="h-5 w-5" />;
      case 'reviewer':
        return <ShieldCheck className="h-5 w-5" />;
      case 'orchestrator':
      default:
        return <Cpu className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-900 text-white shadow-2xl border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            {getAgentIcon(agent.id)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {agent.name}
              <span className="text-xs font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                {agent.enName}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{agent.role}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs font-mono">
        {/* Status & Current Task Box */}
        <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Agent 运行状态:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                agent.status === 'completed'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : agent.status === 'running'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {agent.status.toUpperCase()}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">正在执行的任务:</span>
            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 text-xs border border-slate-800">
              {agent.currentTask}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>任务执行度</span>
              <span className="text-white font-bold">{agent.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${agent.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Completed Artifacts */}
        <div>
          <span className="text-xs font-bold text-slate-300 block mb-2">
            已产出交付物 (Artifacts):
          </span>
          <div className="space-y-1.5">
            {agent.completedTasks.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-emerald-300 text-[11px]"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Log stream */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-indigo-400" />
              执行日志流 (Execution Trace):
            </span>
            <span className="text-[10px] text-slate-500">Live Buffer</span>
          </div>

          <div className="space-y-2 rounded-2xl bg-slate-950 p-3.5 border border-slate-800 max-h-72 overflow-y-auto">
            {agent.logs.map((log, idx) => (
              <div key={idx} className="text-[11px] leading-relaxed">
                <span className="text-slate-500 select-none mr-2">[{log.timestamp}]</span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-emerald-400 font-semibold'
                      : log.type === 'process'
                      ? 'text-amber-300'
                      : log.type === 'warning'
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
        <span>Nova Multi-Agent Engine v3.7</span>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
        >
          关闭抽屉
        </button>
      </div>
    </div>
  );
};
