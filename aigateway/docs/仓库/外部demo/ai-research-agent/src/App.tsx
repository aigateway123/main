/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResearchInputSection } from './components/ResearchInputSection';
import { AgentWorkflowVisualizer } from './components/AgentWorkflowVisualizer';
import { ResearchOpportunities } from './components/ResearchOpportunities';
import { ResearchMap } from './components/ResearchMap';
import { RecommendedSchemeView } from './components/RecommendedSchemeView';
import { ResearchReportView } from './components/ResearchReportView';
import { InteractiveActionModal, ActionModalType } from './components/InteractiveActionModal';
import { AgentLogDrawer } from './components/AgentLogDrawer';
import {
  AgentInfo,
  AgentRole,
  InterAgentMessage,
  ResearchAnalysisData,
} from './types';
import { DEFAULT_EV_CHARGING_DATA } from './data/defaultResearchData';
import { Target, BookOpen, Code2, Calendar, Sparkles, ArrowUp } from 'lucide-react';

const INITIAL_AGENTS: Record<AgentRole, AgentInfo> = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Research Agent',
    enName: 'Lead Orchestrator',
    role: '顶层科学问题拆解、多智能体协同调度与报告综合定稿',
    iconName: 'Cpu',
    status: 'completed',
    currentTask: '全局任务协调已完成，生成 9 章节学术研究机会报告',
    progress: 100,
    completedTasks: [
      '科学问题降维与多模态变量抽取',
      '跨 Agent 任务分发与拓扑路由',
      '学术白皮书章节整合与最终定稿',
    ],
    logs: [
      { timestamp: '09:12:01', message: '收到课题输入，启动 Nova 认知推理内核', type: 'info' },
      { timestamp: '09:12:03', message: '拆解为 4 项子课题，向专业 Agent 分发调度指令', type: 'process' },
      { timestamp: '09:12:15', message: '汇总多智能体产出物，完成报告 9 大章节编排', type: 'success' },
    ],
  },
  literature: {
    id: 'literature',
    name: 'Literature Agent',
    enName: 'Literature Reviewer',
    role: 'ArXiv/IEEE/Nature 权威数据库检索、引用关联挖掘与文献树聚类',
    iconName: 'BookOpen',
    status: 'completed',
    currentTask: '已检索 142 篇高水平文献，提取三大技术演进阶段',
    progress: 100,
    completedTasks: [
      'ArXiv/IEEE 142 篇相关文献语义检索与过滤',
      '时空图神经网络 (ST-GNN) 演进路线图谱提取',
      '文献引用网络与 BibTeX 数据集构建',
    ],
    logs: [
      { timestamp: '09:12:04', message: '挂载 IEEE Xplore 与 ArXiv API 数据源', type: 'info' },
      { timestamp: '09:12:06', message: '检索关键词: EV Load Forecasting, Weather Resilience, Spatio-Temporal', type: 'process' },
      { timestamp: '09:12:09', message: '筛选出 4 篇顶级精读论文，打包传递给 Analysis Agent', type: 'success' },
    ],
  },
  analysis: {
    id: 'analysis',
    name: 'Analysis Agent',
    enName: 'Gap & Trend Analyst',
    role: '前沿研究热点聚类、传统模型局限性诊断与 3 大研究空白识别',
    iconName: 'LineChart',
    status: 'completed',
    currentTask: '完成 3 大关键科研空白 (Research Gaps) 形式化识别',
    progress: 100,
    completedTasks: [
      '传统时序模型三大局限性诊断',
      '极端天气与动态电价双向反馈热点图谱分析',
      '提炼 3 个高价值 Research Opportunity 矩阵',
    ],
    logs: [
      { timestamp: '09:12:08', message: '接收文献包，执行潜在狄利克雷分布 (LDA) 聚类', type: 'info' },
      { timestamp: '09:12:11', message: '定位核心空白：极端天气物理降额机制断裂、电价因果内生性缺失', type: 'process' },
      { timestamp: '09:12:13', message: '完成 3 大方向 5 星级价值与可行性打分', type: 'success' },
    ],
  },
  coding: {
    id: 'coding',
    name: 'Coding Agent',
    enName: 'Experimental Architect',
    role: '5 大基准模型构建、PyTorch 核心创新网络编写与消融实验设计',
    iconName: 'Code2',
    status: 'completed',
    currentTask: '完成 WeatherCausalSTGNN 模型编写与消融实验矩阵设计',
    progress: 100,
    completedTasks: [
      '5 大基线模型 (LSTM, GRU, Transformer, GNN, ST-GCN) 架构配置',
      'Arrhenius 动力电池物理机理损失函数实现',
      '端到端 PyTorch 数据流水线与学术评估脚本编写',
    ],
    logs: [
      { timestamp: '09:12:10', message: '构建 PyTorch 实验环境脚手架', type: 'info' },
      { timestamp: '09:12:12', message: '编写自适应图拓扑与物理信息损失算子', type: 'process' },
      { timestamp: '09:12:14', message: '完成 3 项消融对照实验 (Ablation Matrix) 规格定义', type: 'success' },
    ],
  },
  reviewer: {
    id: 'reviewer',
    name: 'Reviewer Agent',
    enName: 'Peer Review & Feasibility Auditor',
    role: '审稿人视角同行评议、数据可获得性审查与 12 周科研计划排期',
    iconName: 'ShieldCheck',
    status: 'completed',
    currentTask: '完成可行性风险审查与 12 周博士级科研排期规划',
    progress: 100,
    completedTasks: [
      '气象空间分辨率失配与长尾不平衡风险预警',
      '方案可行性审查评级: 96/100 (顶会立项推荐)',
      '12 周 4 阶段科研甘特图与可交付成果规划',
    ],
    logs: [
      { timestamp: '09:12:11', message: '以 IEEE Transactions 审稿标准审查技术路线', type: 'info' },
      { timestamp: '09:12:13', message: '提示长尾极端天气样本不平衡风险，提出 Focal Loss 解决方案', type: 'warning' },
      { timestamp: '09:12:15', message: '综合评分 96 分，通过可行性把关', type: 'success' },
    ],
  },
};

const INITIAL_MESSAGES: InterAgentMessage[] = [
  {
    id: 'm1',
    from: 'orchestrator',
    to: 'literature',
    content: '指令分发：启动全网 IEEE/ArXiv 文献挖掘，重点提取时空建模与气象敏感性文献。',
    timestamp: '09:12:03',
  },
  {
    id: 'm2',
    from: 'literature',
    to: 'analysis',
    content: '文献检索完成：共清洗对齐 142 篇核心成果，已打包传输文献演化树。',
    timestamp: '09:12:08',
    artifactType: 'literature_packet',
  },
  {
    id: 'm3',
    from: 'analysis',
    to: 'coding',
    content: '空白识别确认：确立“极端天气物理降额 + 动态电价因果解耦”为突破主攻方向。',
    timestamp: '09:12:11',
    artifactType: 'gap_matrix',
  },
  {
    id: 'm4',
    from: 'coding',
    to: 'reviewer',
    content: '实验平台就绪：已配置 5 类 Baseline 对照组，并完成 WeatherCausalSTGNN 架构定义。',
    timestamp: '09:12:14',
    artifactType: 'baseline_code',
  },
  {
    id: 'm5',
    from: 'reviewer',
    to: 'orchestrator',
    content: '可行性审查通过：评分 96/100，提出极端样本长尾损失加权建议，输出 12 周科研排期。',
    timestamp: '09:12:15',
    artifactType: 'review_score',
  },
];

export default function App() {
  const [topic, setTopic] = useState<string>(DEFAULT_EV_CHARGING_DATA.topic);
  const [researchData, setResearchData] = useState<ResearchAnalysisData>(DEFAULT_EV_CHARGING_DATA);
  const [agents, setAgents] = useState<Record<AgentRole, AgentInfo>>(INITIAL_AGENTS);
  const [activeMessages, setActiveMessages] = useState<InterAgentMessage[]>(INITIAL_MESSAGES);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(6); // 0-6 completed
  const [inspectingAgent, setInspectingAgent] = useState<AgentInfo | null>(null);
  const [activeModal, setActiveModal] = useState<ActionModalType>(null);

  const startResearchWorkflow = async (customTopic?: string) => {
    const targetTopic = customTopic || topic;
    if (!targetTopic.trim() || isRunning) return;

    setIsRunning(true);
    setCurrentStepIndex(0);

    // Reset Agent States to simulating running sequence
    const resetAgents: Record<AgentRole, AgentInfo> = {
      orchestrator: {
        ...agents.orchestrator,
        status: 'running',
        progress: 15,
        currentTask: `正在对科研问题【${targetTopic}】进行形式化拆解与任务调度...`,
      },
      literature: {
        ...agents.literature,
        status: 'running',
        progress: 10,
        currentTask: '正在检索 ArXiv / IEEE Xplore / Nature 期刊知识库...',
      },
      analysis: {
        ...agents.analysis,
        status: 'waiting',
        progress: 0,
        currentTask: '等待 Literature Agent 交付文献特征包...',
      },
      coding: {
        ...agents.coding,
        status: 'waiting',
        progress: 0,
        currentTask: '等待核心科学问题与空白定义...',
      },
      reviewer: {
        ...agents.reviewer,
        status: 'waiting',
        progress: 0,
        currentTask: '等待实验方案与理论推导提交预审...',
      },
    };
    setAgents(resetAgents);

    const newMsgs: InterAgentMessage[] = [
      {
        id: `msg-${Date.now()}-1`,
        from: 'orchestrator',
        to: 'literature',
        content: `任务启动：对科研问题「${targetTopic}」展开多源知识挖掘。`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
    setActiveMessages(newMsgs);

    // Step 1: Literature finishes
    setTimeout(() => {
      setCurrentStepIndex(1);
      setAgents((prev) => ({
        ...prev,
        literature: {
          ...prev.literature,
          status: 'completed',
          progress: 100,
          currentTask: '文献知识库检索完毕，构建 140+ 篇文献关联图谱',
        },
        analysis: {
          ...prev.analysis,
          status: 'running',
          progress: 40,
          currentTask: '正在计算前沿演化聚类与三大 Research Gaps...',
        },
      }));
      setActiveMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-2`,
          from: 'literature',
          to: 'analysis',
          content: '文献知识抽取完成，已向 Analysis Agent 发送文献聚类张量。',
          timestamp: new Date().toLocaleTimeString(),
          artifactType: 'literature_packet',
        },
      ]);
    }, 1000);

    // Step 2: Analysis finishes, Coding starts
    setTimeout(() => {
      setCurrentStepIndex(3);
      setAgents((prev) => ({
        ...prev,
        analysis: {
          ...prev.analysis,
          status: 'completed',
          progress: 100,
          currentTask: '已识别三大创新空白，输出 3 项高价值研究机会矩阵',
        },
        coding: {
          ...prev.coding,
          status: 'running',
          progress: 50,
          currentTask: '正在构建 5 大 Baseline 与核心创新网络 PyTorch 架构...',
        },
      }));
      setActiveMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-3`,
          from: 'analysis',
          to: 'coding',
          content: '已确定突破方向：要求构建融合物理先验与时空图的神经网络。',
          timestamp: new Date().toLocaleTimeString(),
          artifactType: 'gap_matrix',
        },
      ]);
    }, 2000);

    // Step 3: Coding finishes, Reviewer starts
    setTimeout(() => {
      setCurrentStepIndex(4);
      setAgents((prev) => ({
        ...prev,
        coding: {
          ...prev.coding,
          status: 'completed',
          progress: 100,
          currentTask: '完成核心模型架构编写、损失函数与消融实验矩阵',
        },
        reviewer: {
          ...prev.reviewer,
          status: 'running',
          progress: 75,
          currentTask: '正在以顶刊同行评审标准审查技术方案与可行性风险...',
        },
      }));
      setActiveMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-4`,
          from: 'coding',
          to: 'reviewer',
          content: '已提交 PyTorch 代码模型与消融实验对照组，请求可行性审查。',
          timestamp: new Date().toLocaleTimeString(),
          artifactType: 'baseline_code',
        },
      ]);
    }, 3000);

    // Step 4: Reviewer & Orchestrator finish, fetch data from backend
    setTimeout(async () => {
      setCurrentStepIndex(6);
      try {
        const res = await fetch('/api/research/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: targetTopic }),
        });
        if (res.ok) {
          const result = await res.json();
          if (result.data) {
            setResearchData(result.data);
          }
        }
      } catch (err) {
        console.error('Fetch research error, using benchmark data:', err);
      }

      setAgents((prev) => ({
        ...prev,
        reviewer: {
          ...prev.reviewer,
          status: 'completed',
          progress: 100,
          currentTask: '评审通过 (96分)，生成可行性风控方案与 12 周科研排期',
        },
        orchestrator: {
          ...prev.orchestrator,
          status: 'completed',
          progress: 100,
          currentTask: '全链条闭环完成，9 大章节学术白皮书已生成',
        },
      }));

      setActiveMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-5`,
          from: 'reviewer',
          to: 'orchestrator',
          content: '可行性审查评级 96 分，完成 12 周科研排期，交付最终发布。',
          timestamp: new Date().toLocaleTimeString(),
          artifactType: 'review_score',
        },
      ]);

      setIsRunning(false);
    }, 4000);
  };

  const handleOpenAgentLogs = (agentId: AgentRole) => {
    setInspectingAgent(agents[agentId] || null);
  };

  const handleExploreAction = (
    actionType: 'experiment' | 'literature' | 'coding' | 'plan'
  ) => {
    setActiveModal(actionType);
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* 1. Header Banner */}
      <Header
        isRunning={isRunning}
        activeAgentsCount={
          (Object.values(agents) as AgentInfo[]).filter((a) => a.status === 'running').length
        }
      />

      {/* 2. User Input & Pipeline Visualizer */}
      <ResearchInputSection
        topic={topic}
        onTopicChange={setTopic}
        onStartResearch={startResearchWorkflow}
        isRunning={isRunning}
        currentStepIndex={currentStepIndex}
      />

      {/* 3. Agent Workflow Visualizer (Core Focus) */}
      <AgentWorkflowVisualizer
        agents={agents}
        activeMessages={activeMessages}
        onOpenAgentLogs={handleOpenAgentLogs}
        isRunning={isRunning}
      />

      {/* 4. Research Opportunity (Direction 01, 02, 03) */}
      <ResearchOpportunities
        opportunities={researchData.opportunities}
        onExploreAction={handleExploreAction}
      />

      {/* 5. Research Map (Knowledge Landscape & Gaps) */}
      <ResearchMap topic={researchData.topic} />

      {/* 6. Recommended Scheme (Research Question, Baselines, Added Variables, Evaluations) */}
      <RecommendedSchemeView
        scheme={researchData.recommendedScheme}
        onExploreAction={handleExploreAction}
      />

      {/* 7. Full 9-Section Academic Research Report */}
      <ResearchReportView
        report={researchData.report}
        onExploreAction={handleExploreAction}
      />

      {/* 8. Key Action Floating / Sticky Bar for continuous exploration */}
      <div className="sticky bottom-4 z-30 mx-auto max-w-4xl px-4 w-full">
        <div className="rounded-2xl bg-slate-900/95 text-white p-3 shadow-2xl border border-slate-700/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold px-2 text-slate-300">
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">科研闭环深入交互：</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExploreAction('experiment')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Target className="h-3.5 w-3.5" />
              <span>生成实验方案</span>
            </button>

            <button
              onClick={() => handleExploreAction('literature')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition-all active:scale-95 cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>开始文献综述</span>
            </button>

            <button
              onClick={() => handleExploreAction('coding')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>创建 Coding 实验</span>
            </button>

            <button
              onClick={() => handleExploreAction('plan')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>生成研究计划</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Sub-Module Modal */}
      <InteractiveActionModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        topic={researchData.topic}
        experimentDetail={researchData.experimentDetail}
        literatureList={researchData.literatureList}
        codingDetail={researchData.codingDetail}
        milestones={researchData.milestones}
      />

      {/* Agent Detail & Execution Trace Drawer */}
      <AgentLogDrawer
        agent={inspectingAgent}
        onClose={() => setInspectingAgent(null)}
      />

      {/* Footer */}
      <footer className="mt-16 w-full border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Nova AI Research Agent</span>
            <span>— 旗舰级多智能体科研探索系统</span>
          </div>
          <div>
            <span>基于分布式多 Agent 协同体系 · 遵守学术伦理与科研严谨性规范</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
