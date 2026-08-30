import React, { useState } from 'react';
import {
  BookOpen,
  LineChart,
  Code2,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Loader2,
  Circle,
  Radio,
  Network,
  GitCommit,
  Terminal,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { AgentInfo, AgentRole, InterAgentMessage } from '../types';

interface AgentWorkflowVisualizerProps {
  agents: Record<AgentRole, AgentInfo>;
  activeMessages: InterAgentMessage[];
  onOpenAgentLogs: (agentId: AgentRole) => void;
  isRunning: boolean;
}

export const AgentWorkflowVisualizer: React.FC<AgentWorkflowVisualizerProps> = ({
  agents,
  activeMessages,
  onOpenAgentLogs,
  isRunning,
}) => {
  const [viewMode, setViewMode] = useState<'topology' | 'pipeline'>('topology');
  const [selectedAgent, setSelectedAgent] = useState<AgentRole>('orchestrator');

  const getStatusBadge = (status: AgentInfo['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            已完成
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            正在分析
          </span>
        );
      case 'waiting':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <Circle className="h-3 w-3 text-slate-400" />
            等待中
          </span>
        );
    }
  };

  const getAgentIcon = (id: AgentRole, className = 'h-5 w-5') => {
    switch (id) {
      case 'literature':
        return <BookOpen className={className} />;
      case 'analysis':
        return <LineChart className={className} />;
      case 'coding':
        return <Code2 className={className} />;
      case 'reviewer':
        return <ShieldCheck className={className} />;
      case 'orchestrator':
      default:
        return <Cpu className={className} />;
    }
  };

  const renderAgentCard = (agent: AgentInfo, positionClass: string, isCenter = false) => {
    const isRunningSelf = agent.status === 'running';
    const isCompletedSelf = agent.status === 'completed';

    return (
      <div
        key={agent.id}
        onClick={() => {
          setSelectedAgent(agent.id);
          onOpenAgentLogs(agent.id);
        }}
        className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-300 backdrop-blur-md shadow-sm hover:shadow-xl ${
          isCenter
            ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-500/50 ring-2 ring-indigo-500/30'
            : isRunningSelf
            ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/40 shadow-amber-500/10'
            : isCompletedSelf
            ? 'bg-white/95 border-emerald-300/80 hover:border-emerald-500'
            : 'bg-slate-50/80 border-slate-200/80 opacity-90 hover:opacity-100'
        } ${positionClass}`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                isCenter
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40'
                  : isRunningSelf
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                  : isCompletedSelf
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {getAgentIcon(agent.id)}
            </div>
            <div>
              <h3 className={`text-sm font-bold tracking-tight ${isCenter ? 'text-white' : 'text-slate-900'}`}>
                {agent.name}
              </h3>
              <p className={`text-[11px] font-mono ${isCenter ? 'text-indigo-200' : 'text-slate-500'}`}>
                {agent.enName}
              </p>
            </div>
          </div>
          <div>{getStatusBadge(agent.status)}</div>
        </div>

        {/* Task description */}
        <div className="mt-2.5 rounded-lg px-2.5 py-1.5 text-xs bg-black/5 dark:bg-white/5 border border-black/5">
          <span className={`font-medium block text-[11px] mb-0.5 ${isCenter ? 'text-indigo-300' : 'text-slate-500'}`}>
            当前动作 / 职责：
          </span>
          <span className={`line-clamp-2 font-mono text-xs ${isCenter ? 'text-slate-200' : 'text-slate-800'}`}>
            {agent.currentTask}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
            <span className={isCenter ? 'text-indigo-200' : 'text-slate-500'}>任务进度</span>
            <span className={`font-semibold ${isCenter ? 'text-white' : 'text-slate-800'}`}>
              {agent.progress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCenter
                  ? 'bg-indigo-400'
                  : isRunningSelf
                  ? 'bg-amber-500 animate-pulse'
                  : isCompletedSelf
                  ? 'bg-emerald-500'
                  : 'bg-slate-300'
              }`}
              style={{ width: `${agent.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] pt-1">
          <span className={`text-[11px] ${isCenter ? 'text-indigo-300' : 'text-slate-400'}`}>
            已产出 {agent.completedTasks.length} 项成果
          </span>
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isCenter ? 'text-indigo-300' : 'text-indigo-600'} group-hover:translate-x-0.5 transition-transform`}>
            日志 & 详情 <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <section id="agent-workflow-section" className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl">
        {/* Section Header with View Toggles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Agent 工作流可视化
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              以 Research Agent 为调度中枢，4 大专业智能体分布式并发与递进推演
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs">
            <button
              onClick={() => setViewMode('topology')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                viewMode === 'topology'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              星型协同拓扑 (Topology)
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                viewMode === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitCommit className="h-3.5 w-3.5" />
              递进流水线 (Pipeline)
            </button>
          </div>
        </div>

        {/* View Mode 1: Topology Star Layout */}
        {viewMode === 'topology' ? (
          <div className="relative rounded-3xl bg-gradient-to-b from-white to-slate-100/80 border border-slate-200/90 p-6 sm:p-10 shadow-sm overflow-hidden min-h-[580px] flex flex-col justify-between">
            {/* Ambient Background Glow & Circuit Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-60" />

            {/* Top: Literature Agent */}
            <div className="w-full flex justify-center z-10">
              <div className="w-full max-w-sm">
                {renderAgentCard(agents.literature, 'w-full')}
              </div>
            </div>

            {/* Middle Row: Analysis Agent <- Research Agent -> Coding Agent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center my-6 z-10">
              {/* Left: Analysis Agent */}
              <div className="w-full">
                {renderAgentCard(agents.analysis, 'w-full')}
              </div>

              {/* Center: Research Agent (Orchestrator) */}
              <div className="w-full">
                {renderAgentCard(agents.orchestrator, 'w-full scale-105', true)}
              </div>

              {/* Right: Coding Agent */}
              <div className="w-full">
                {renderAgentCard(agents.coding, 'w-full')}
              </div>
            </div>

            {/* Bottom: Reviewer Agent */}
            <div className="w-full flex justify-center z-10">
              <div className="w-full max-w-sm">
                {renderAgentCard(agents.reviewer, 'w-full')}
              </div>
            </div>
          </div>
        ) : (
          /* View Mode 2: Sequential Pipeline Layout */
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderAgentCard(agents.literature, 'w-full')}
              {renderAgentCard(agents.analysis, 'w-full')}
              {renderAgentCard(agents.coding, 'w-full')}
              {renderAgentCard(agents.reviewer, 'w-full')}
            </div>
          </div>
        )}

        {/* Live Inter-Agent Communication Bus Log */}
        <div className="mt-6 rounded-2xl bg-slate-900 text-slate-100 p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="font-mono font-semibold text-slate-200">
                Agent 实时通讯总线 (Inter-Agent Data Stream)
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <span className="font-mono text-slate-400 text-[11px]">
              Protocol: Nova-RPC / JSON-L Interop
            </span>
          </div>

          <div className="mt-3 space-y-2 max-h-36 overflow-y-auto font-mono text-xs pr-2">
            {activeMessages.length === 0 ? (
              <div className="text-slate-500 italic py-2 text-center">
                智能体总线就绪，点击“开始研究”即可捕获多 Agent 实时数据交换数据包...
              </div>
            ) : (
              activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-2 text-slate-300 hover:bg-slate-800/50 p-1.5 rounded transition-colors"
                >
                  <span className="text-slate-500 text-[10px] select-none">[{msg.timestamp}]</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-300 font-semibold text-[11px] border border-indigo-700/50">
                    {msg.from.toUpperCase()} → {msg.to.toUpperCase()}
                  </span>
                  <span className="text-slate-200 flex-1">{msg.content}</span>
                  {msg.artifactType && (
                    <span className="text-[10px] bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded border border-slate-700">
                      📦 {msg.artifactType}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
