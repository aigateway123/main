import React, { useState, useEffect } from "react";
import { AppView, AgentStatus, AgentLog } from "../types";
import {
  Cpu,
  Terminal,
  Play,
  RotateCw,
  Activity,
  Award,
  Zap,
  CheckCircle,
  Database,
  Sliders,
  Server
} from "lucide-react";

export default function AgentHubView() {
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: "ag-trend",
      name: "热点探针 Agent (TrendSeeker)",
      role: "小红书全网大盘热点接口抓取、舆情峰值分析、起量风口监控",
      status: "active",
      tasksExecuted: 1420,
      successRate: "99.8%",
      logs: [
        "API Connection online.",
        "Scanned 840 categories in fashion niche.",
        "Identified 3 viral burst terms inside 'New Chinese style'."
      ]
    },
    {
      id: "ag-dissect",
      name: "心智透视 Agent (DissectCore)",
      role: "拆解博主首尾段落、痛点锚定机制、评论区利益诱导机制结构化分析",
      status: "active",
      tasksExecuted: 890,
      successRate: "98.5%",
      logs: [
        "Hook analysis engine ready.",
        "Processing URL feedback parser on RED.",
        "Segmented 6 core triggers on conversion models."
      ]
    },
    {
      id: "ag-topic",
      name: "选题创意 Agent (IdeaForge)",
      role: "基于爆款因子大盘推荐、受众痛点，全自动匹配并繁衍高带货选题",
      status: "active",
      tasksExecuted: 2310,
      successRate: "99.1%",
      logs: [
        "Niche prompt parameters synchronized.",
        "Created 50 potential titles for skin care tag.",
        "Ranked difficulty index by competition rate algorithms."
      ]
    },
    {
      id: "ag-writing",
      name: "神笔马良 Agent (CopyWizard)",
      role: "图文排版、视频多镜头台词、小红书高识别表情及带货尾钩书写",
      status: "active",
      tasksExecuted: 1845,
      successRate: "97.4%",
      logs: [
        "Vite environment verified successfully.",
        "Applying conversational style microtuning parameters.",
        "Writing detailed body copies for RED specifications."
      ]
    },
    {
      id: "ag-comment",
      name: "流量闭环 Agent (DealMaker)",
      role: "社交评论、高情商私信自适应分销答疑及引导成交对练会话代理",
      status: "idle",
      tasksExecuted: 450,
      successRate: "96.2%",
      logs: [
        "Dialog dataset refreshed.",
        "Preset objections scripts synchronized.",
        "Trained conversion weights."
      ]
    },
    {
      id: "ag-diagnose",
      name: "体检诊断 Agent (StatSurgeon)",
      role: "曝光点击漏斗转化率、降权风险预测及精细涨粉十五天指令编排",
      status: "active",
      tasksExecuted: 620,
      successRate: "98.9%",
      logs: [
        "Funnel analytics calculation completed.",
        "Flagged low click through rate (CTR) warning.",
        "Generated diagnostic growth plans."
      ]
    }
  ]);

  // Terminal Real-Time Logging State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM INFO] 2026-06-07 07:56:09 UTC -爆款工厂 V1 AI Agent 工作流内核状态：正常",
    "[DB LOG] PostgreSQL 向量通道 Milvus 已挂载健康运行",
    "[ORCHESTRATOR] 启动热点探针 Agent 成功，正在拉取 24 小时 Xiaohongshu Hotspot APIs...",
    "[SYSTEM INFO] 全局 Gemini 统一模型路由已连接，优先配比 gemini-3.5-flash",
    "[AGENT HUB] 选题创意 Agent 生成了关于【抗初老面霜】的5组起号风口...",
    "[USER MESSAGE] 用户触发了 爆文一键 AI 拆解 模块，目标 URL verified: OK"
  ]);

  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);

  // Auto roll more terminal logs to make it look highly alive!
  useEffect(() => {
    const logPool = [
      "[ORCHESTRATOR] 探针追踪成功：发现‘废土穿搭’在24h内上升了12%点击率",
      "[DB CACHE] 清理 Redis 热点缓存库 3.4 MB，释放资源完毕",
      "[MODEL INFERENCE] Gemini 3.5-flash 运算返回成功，解析用时 1240 ms",
      "[AGENT LOG] 心智透视 Agent: 已将该篇爆款正文特征提取至向量空间",
      "[SYSTEM NOTIFY] 矩阵账号增长趋势触发，粉丝数统计预估相比昨天增长18K",
      "[DEAL AGENT] 对抗练兵舱就绪，创作者 objection 转换路径匹配至 199 面霜 步骤",
      "[DIAGNOSTICS] StatSurgeon: 录入 62K 曝光。提醒点击率 4.03% 偏低，主推封面升级计划"
    ];

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const utcTime = new Date().toISOString().replace("T", " ").substring(0, 19);
      setTerminalLogs((prev) => [
        ...prev,
        `[${utcTime}] ${randomLog}`
      ].slice(-50)); // max 50 rows in memory
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleTriggerAgentWorkflow = (agentId: string) => {
    setActiveWorkflow(agentId);
    
    // Log start to terminal
    const targetAgent = agents.find(a => a.id === agentId);
    const utcTime = new Date().toISOString().replace("T", " ").substring(0, 19);

    setTerminalLogs((prev) => [
      ...prev,
      `[${utcTime}] [USER TRIGGER] 用户手动诱导激活了 [${targetAgent?.name}] 主动推演任务...`,
      `[${utcTime}] [ORCHESTRATOR] 正在打包 Drizzle ORM，并调拨 Milvus 向量相关数据集...`,
    ]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[${utcTime}] [ORCHESTRATOR] [${targetAgent?.name}] 结束对练。状态已变回 online。累计执行 +1`,
      ]);
      setAgents(prev => prev.map(a => {
        if (a.id === agentId) {
          return { ...a, tasksExecuted: a.tasksExecuted + 1, status: "active" };
        }
        return a;
      }));
      setActiveWorkflow(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-pink-500 animate-spin-slow" />
            AI Agent 协同编排中心
          </h2>
          <p className="text-xs text-zinc-400">
            统筹管理 6 大自主 Agent 节点，各 Agent 基于小红书特定的爆款因果链，承接从热点抓取、心智拆解、选题繁衍到闭环成交的数据对连。
          </p>
        </div>

        {/* Global Agent Status visual indicator */}
        <div className="flex items-center gap-3 bg-[#0c0c0e] px-4 py-2 rounded-lg border border-zinc-900 text-xs text-zinc-300 font-mono">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>全局并发Agent数: <span className="text-emerald-400 font-bold">6/6 在线</span></span>
        </div>
      </div>

      {/* Main split: Top 6 agents cards (Left 7 cols); Server Scrolling log terminal (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* AGENTS LIST CARDS BLOCK (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs pb-2 border-b border-zinc-900">
            <Sliders className="w-4 h-4 text-pink-500" />
            <h4>自主互咬 Agent 列阵 (Swarm Hierarchy)</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                id={`agent-card-${agent.id}`}
                className="p-4.5 rounded-xl bg-[#0c0c0e] border border-zinc-90 w-full hover:border-zinc-800 transition-all flex flex-col justify-between h-56 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-zinc-400 max-w-[170px] truncate">
                      {agent.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                        agent.status === "active"
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                          : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                      }`}
                    >
                      {agent.status === "active" ? "运行中" : "就绪"}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed min-h-[36px]">
                    {agent.role}
                  </p>

                  <div className="pt-2 border-t border-zinc-900/60 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                    <div className="bg-zinc-950 px-2 py-1.5 rounded border border-zinc-900">
                      <p className="text-zinc-600">累计调用任务</p>
                      <p className="text-xs font-bold text-white mt-0.5">{agent.tasksExecuted} 次</p>
                    </div>
                    <div className="bg-zinc-950 px-2 py-1.5 rounded border border-zinc-900">
                      <p className="text-zinc-600">指令成功率</p>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">{agent.successRate}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex">
                  <button
                    id={`trigger-agent-btn-${agent.id}`}
                    onClick={() => handleTriggerAgentWorkflow(agent.id)}
                    disabled={activeWorkflow !== null}
                    className="w-full text-center py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 hover:text-pink-400 border border-zinc-900 text-[10px] font-bold text-zinc-400 flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 text-pink-500 inline" />
                    <span>{activeWorkflow === agent.id ? "推演编排中..." : "手动诱起推理"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TERMINAL MONOSPACE MONITOR CONTAINER (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#030304] border border-zinc-800 border-l-2 border-l-pink-500 flex flex-col h-[560px] justify-between shadow-2xl relative">
          <div className="space-y-3 flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-pink-500 shrink-0" />
                <h4 className="text-xs font-bold text-zinc-300 font-mono tracking-wider">
                  爆款云大脑编排日志 (Agent Swarm Terminal)
                </h4>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-950"></span>
            </div>

            {/* scrolling log terminal body */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-[10px] text-zinc-400 leading-relaxed scrollbar-none">
              {terminalLogs.map((log, idx) => {
                let colorClass = "text-zinc-400";
                if (log.includes("[SYSTEM INFO]")) colorClass = "text-emerald-400";
                if (log.includes("[ORCHESTRATOR]")) colorClass = "text-pink-400 font-medium";
                if (log.includes("[USER TRIGGER]")) colorClass = "text-amber-400 font-bold";
                if (log.includes("[DB LOG]")) colorClass = "text-blue-400";

                return (
                  <div key={idx} className={`whitespace-pre-wrap select-text font-mono border-l border-zinc-900 pl-2 ${colorClass}`}>
                    {log}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Infrastructure footnote summary indicators */}
          <div className="pt-3 mt-2 border-t border-zinc-900 flex items-center justify-between font-mono text-[9px] text-zinc-600">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-blue-500" />
              drizzle-pg-connector: OK
            </span>
            <span className="flex items-center gap-1">
              <Server className="w-3 h-3 text-pink-500" />
              gemini-統一モデル・ルーティング: Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
