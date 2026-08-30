import React, { useState } from 'react';
import {
  X,
  Target,
  BookOpen,
  Code2,
  Calendar,
  Copy,
  Check,
  Download,
  Sparkles,
  Layers,
  Cpu,
  Terminal,
  Clock,
  Play,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import {
  ExperimentSchemeDetail,
  LiteratureItem,
  CodingExperimentDetail,
  MilestoneItem,
} from '../types';

export type ActionModalType = 'experiment' | 'literature' | 'coding' | 'plan' | null;

interface InteractiveActionModalProps {
  activeModal: ActionModalType;
  onClose: () => void;
  topic: string;
  experimentDetail: ExperimentSchemeDetail;
  literatureList: LiteratureItem[];
  codingDetail: CodingExperimentDetail;
  milestones: MilestoneItem[];
}

export const InteractiveActionModal: React.FC<InteractiveActionModalProps> = ({
  activeModal,
  onClose,
  topic,
  experimentDetail,
  literatureList,
  codingDetail,
  milestones,
}) => {
  if (!activeModal) return null;

  const [activeCodeFileIndex, setActiveCodeFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [simulatedRunning, setSimulatedRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCodeSimulation = () => {
    setSimulatedRunning(true);
    setConsoleOutput(['[Nova PyTorch Engine] 初始化 PyTorch Geometric 与 CUDA 设备...']);

    setTimeout(() => {
      setConsoleOutput((prev) => [
        ...prev,
        '[DataLoader] 加载城市 120,000 桩时空张量与 ERA5 气象网格: 15-min 窗口切分完成 (Batch=64).',
      ]);
    }, 600);

    setTimeout(() => {
      setConsoleOutput((prev) => [
        ...prev,
        '[Epoch 01/50] Train Loss: 0.0842 | Val MAE: 4.82 kW | Arrhenius Physics Penalty: 0.0124',
      ]);
    }, 1200);

    setTimeout(() => {
      setConsoleOutput((prev) => [
        ...prev,
        '[Epoch 15/50] 动态图自适应收敛 | Peak Error: 5.12% | 相对 LSTM 基线提升 26.4%',
        '>>> 训练收敛完成！Checkpoints 已存入 ./checkpoints/weather_causal_stgnn_best.pt',
      ]);
      setSimulatedRunning(false);
    }, 2000);
  };

  const getTitle = () => {
    switch (activeModal) {
      case 'experiment':
        return {
          title: '深度实验设计方案 (Experimental Design & Ablations)',
          subtitle: '包含多源数据预处理管线、消融对照实验矩阵与超参数配置网格',
          icon: <Target className="h-5 w-5 text-indigo-600" />,
        };
      case 'literature':
        return {
          title: '前沿文献研读看板 (Literature SOTA Matrix)',
          subtitle: 'ArXiv/IEEE 140+ 篇精选论文聚类、引用网络与 BibTeX 导出',
          icon: <BookOpen className="h-5 w-5 text-indigo-600" />,
        };
      case 'coding':
        return {
          title: 'Coding 实验工作台 (PyTorch Experiment Workbench)',
          subtitle: '端到端即用型核心模型实现、损失函数、训练管线与学术评估脚本',
          icon: <Code2 className="h-5 w-5 text-indigo-600" />,
        };
      case 'plan':
      default:
        return {
          title: '科研排期规划与甘特图 (Research Milestones & Roadmap)',
          subtitle: '12 周标准博士级研究排期与阶段可交付成果 (Deliverables)',
          icon: <Calendar className="h-5 w-5 text-indigo-600" />,
        };
    }
  };

  const meta = getTitle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
              {meta.icon}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {meta.title}
              </h3>
              <p className="text-xs text-slate-500 font-mono">{meta.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body with dynamic tabs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Experiment Design Modal */}
          {activeModal === 'experiment' && (
            <div className="space-y-6 text-xs">
              {/* Header Box */}
              <div className="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100">
                <span className="font-bold text-indigo-900 block mb-1">
                  方案名称：{experimentDetail.title}
                </span>
                <p className="text-slate-600">
                  面向科研课题：“{topic}”，由 Coding Agent 与 Reviewer Agent 联合评审拟定。
                </p>
              </div>

              {/* Data Preprocessing */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  1. 数据预处理与张量流水线 (Data Preprocessing Pipeline)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {experimentDetail.datasetPreprocessing.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700"
                    >
                      <span className="font-mono font-bold text-indigo-600 mr-1.5">
                        [Step {idx + 1}]
                      </span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ablation Studies Matrix */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-amber-600" />
                  2. 消融实验对照矩阵 (Ablation Studies Matrix)
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 text-[11px] font-bold">
                      <tr>
                        <th className="p-3">消融模块 (Component)</th>
                        <th className="p-3">Baseline 对照设置</th>
                        <th className="p-3">Proposed 创新设置</th>
                        <th className="p-3">预期提升与验证目标</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {experimentDetail.ablationStudies.map((ab, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="p-3 font-semibold text-slate-900">
                            {ab.component}
                          </td>
                          <td className="p-3 text-slate-500 font-mono">
                            {ab.baselineSetup}
                          </td>
                          <td className="p-3 text-indigo-700 font-mono font-semibold">
                            {ab.proposedSetup}
                          </td>
                          <td className="p-3 text-emerald-700 font-medium">
                            {ab.expectedOutcome}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hyperparameters Grid */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-blue-600" />
                  3. 超参数搜索空间 (Hyperparameter Search Space)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {experimentDetail.hyperparameters.map((hp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                    >
                      <div className="font-bold text-slate-800 text-[11px]">
                        {hp.param}
                      </div>
                      <div className="text-slate-500 text-[10px] mt-0.5">
                        范围: {hp.range}
                      </div>
                      <div className="mt-1 font-mono font-bold text-indigo-600 text-xs">
                        默认: {hp.defaultVal}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware */}
              <div className="rounded-2xl bg-slate-900 text-slate-200 p-4 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block text-xs">
                    硬件资源评估 (Hardware Requirements)
                  </span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {experimentDetail.hardwareRequirement}
                  </p>
                </div>
                <span className="text-emerald-400 font-mono text-xs font-semibold px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800">
                  GPU 适配就绪
                </span>
              </div>
            </div>
          )}

          {/* 2. Literature Review Modal */}
          {activeModal === 'literature' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500 font-mono">
                  共精选检索 142 篇顶会/顶刊论文，精读标杆成果：
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  IEEE / Nature / NeurIPS 来源
                </span>
              </div>

              <div className="space-y-3">
                {literatureList.map((lit) => (
                  <div
                    key={lit.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {lit.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                          被引: {lit.citations}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                          相关度: {lit.relevanceScore}%
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-[11px] font-mono mb-2">
                      {lit.authors} · <span className="font-semibold text-slate-700">{lit.venue}</span> ({lit.year})
                    </p>

                    <div className="space-y-1 text-slate-700 text-xs mb-3">
                      <div>
                        <span className="font-semibold text-emerald-700">✓ 核心学术贡献：</span>
                        {lit.coreContribution}
                      </div>
                      <div>
                        <span className="font-semibold text-rose-700">✗ 本文局限与留白：</span>
                        {lit.limitations}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <div className="flex flex-wrap gap-1">
                        {lit.tags.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleCopy(lit.bibtex)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        复制 BibTeX
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Coding Experiment Modal */}
          {activeModal === 'coding' && (
            <div className="space-y-4">
              {/* Code File Tabs & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {codingDetail.files.map((file, idx) => (
                    <button
                      key={file.filename}
                      onClick={() => setActiveCodeFileIndex(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer ${
                        activeCodeFileIndex === idx
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FileCode className="h-3.5 w-3.5" />
                      {file.filename}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(codingDetail.files[activeCodeFileIndex].code)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? '已复制代码' : '复制代码'}</span>
                  </button>
                  <button
                    onClick={handleRunCodeSimulation}
                    disabled={simulatedRunning}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{simulatedRunning ? '运行中...' : '测试运行模型'}</span>
                  </button>
                </div>
              </div>

              {/* Code Viewer */}
              {codingDetail.files[activeCodeFileIndex] && (
                <div>
                  <div className="text-xs text-slate-600 mb-2 font-mono flex items-center justify-between">
                    <span>{codingDetail.files[activeCodeFileIndex].description}</span>
                    <span className="text-slate-400">
                      Env: {codingDetail.framework} · {codingDetail.pythonVersion}
                    </span>
                  </div>

                  <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto max-h-[340px]">
                    <pre className="leading-relaxed">
                      <code>{codingDetail.files[activeCodeFileIndex].code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Interactive Console Output */}
              {consoleOutput.length > 0 && (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3 font-mono text-xs text-emerald-400 space-y-1">
                  <div className="text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                    Console Terminal Output:
                  </div>
                  {consoleOutput.map((line, lIdx) => (
                    <div key={lIdx}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Research Plan Modal */}
          {activeModal === 'plan' && (
            <div className="space-y-6 text-xs">
              <div className="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100">
                <span className="font-bold text-indigo-900 block mb-1">
                  12 周全周期科研排期规划 (Gantt & Milestones)
                </span>
                <p className="text-slate-600">
                  由 Reviewer Agent 依据国家自然科学基金与顶会审稿周期严格倒排。
                </p>
              </div>

              <div className="space-y-4">
                {milestones.map((m, idx) => {
                  const isDone = m.status === 'completed';
                  const isInProgress = m.status === 'in_progress';
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border transition-all ${
                        isInProgress
                          ? 'border-indigo-400 bg-indigo-50/30 ring-1 ring-indigo-400/30'
                          : isDone
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : isInProgress
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            0{idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {m.stage}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500 font-semibold">
                            {m.duration}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : isInProgress
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isDone ? '已完成' : isInProgress ? '推进中' : '计划中'}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-600 mb-3">{m.objective}</p>

                      <div className="pt-2 border-t border-slate-200/70">
                        <span className="font-semibold text-slate-800 block mb-1 text-[11px]">
                          阶段可交付成果 (Deliverables)：
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {m.deliverables.map((d, dIdx) => (
                            <span
                              key={dIdx}
                              className="bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-700 text-[11px]"
                            >
                              📦 {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-mono">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Nova Research Agent System</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer"
          >
            完成查看
          </button>
        </div>
      </div>
    </div>
  );
};
