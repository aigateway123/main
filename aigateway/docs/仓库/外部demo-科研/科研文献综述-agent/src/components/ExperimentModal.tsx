import React, { useState } from 'react';
import { ExperimentSetup } from '../types';
import { X, Code, Terminal, Database, Cpu, Layers, Copy, Check, Sparkles } from 'lucide-react';

interface ExperimentModalProps {
  experiment: ExperimentSetup;
  onClose: () => void;
}

export const ExperimentModal: React.FC<ExperimentModalProps> = ({ experiment, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(experiment.pytorchSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#111] rounded-2xl border border-[#222] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#161616] text-[#e0e0e0] p-6 border-b border-[#222] flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#2dd4bf] text-xs font-bold uppercase tracking-wider mb-1">
              <Code className="w-4 h-4 text-[#2dd4bf]" />
              <span>实验验证方案与 PyTorch 模型设计</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#f0f0f0] leading-tight">
              多模态时空负荷预测基准实验管线 (Benchmark Pipeline)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#222] text-[#888] hover:text-white hover:bg-[#333] transition-all cursor-pointer shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Experiment Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#ccc] text-sm">
          {/* 1. 任务定义 */}
          <div className="bg-[#161616] border border-[#262626] rounded-xl p-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#888] mb-1 flex items-center">
              <Terminal className="w-3.5 h-3.5 mr-1.5 text-[#2dd4bf]" />
              严密数学任务形式化 (Task Formulation)
            </h4>
            <p className="text-xs sm:text-sm text-[#eee] font-mono leading-relaxed mt-1">
              {experiment.taskDefinition}
            </p>
          </div>

          {/* 2. 数据准备与清洗 */}
          <div>
            <h4 className="text-sm font-bold text-[#f0f0f0] font-sans flex items-center mb-2.5">
              <Database className="w-4 h-4 mr-2 text-[#2dd4bf]" />
              1. 权威公开数据集与特征工程
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {experiment.datasetPrep.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#161616] border border-[#262626] rounded-xl p-3 shadow-2xs text-[#ccc]"
                >
                  <span className="font-bold text-[#2dd4bf] mr-1.5">●</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* 3. 消融实验矩阵设计 */}
          <div>
            <h4 className="text-sm font-bold text-[#f0f0f0] font-sans flex items-center mb-2.5">
              <Layers className="w-4 h-4 mr-2 text-purple-400" />
              2. 严谨消融实验矩阵设计 (Ablation Matrix)
            </h4>
            <div className="overflow-x-auto border border-[#222] rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#181818] text-[#aaa] font-bold uppercase border-b border-[#222]">
                  <tr>
                    <th className="p-3">对照组别</th>
                    <th className="p-3">模型配置与输入变量</th>
                    <th className="p-3">验证核心目的</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {experiment.ablationStudies.map((ab, idx) => (
                    <tr key={idx} className="hover:bg-[#161616]">
                      <td className="p-3 font-semibold text-[#f0f0f0] whitespace-nowrap">{ab.group}</td>
                      <td className="p-3 font-mono text-[#2dd4bf]">{ab.configuration}</td>
                      <td className="p-3 text-[#aaa]">{ab.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. 推荐超参数设置 */}
          <div>
            <h4 className="text-sm font-bold text-[#f0f0f0] font-sans flex items-center mb-2.5">
              <Cpu className="w-4 h-4 mr-2 text-emerald-400" />
              3. 推荐训练超参数配置
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {experiment.hyperparameters.map((hp, idx) => (
                <div key={idx} className="bg-[#161616] border border-[#262626] rounded-xl p-2.5 text-center">
                  <div className="text-[10px] text-[#666] uppercase">{hp.param}</div>
                  <div className="text-sm font-bold font-mono text-[#f0f0f0] mt-0.5">{hp.value}</div>
                  <div className="text-[10px] text-[#888] mt-1">{hp.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. PyTorch Code snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#f0f0f0] font-sans flex items-center">
                <Code className="w-4 h-4 mr-2 text-[#2dd4bf]" />
                4. PyTorch 核心时空图融合网络实现代码
              </h4>
              <button
                onClick={handleCopyCode}
                className="text-xs flex items-center space-x-1 text-[#2dd4bf] hover:text-white font-medium cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">已复制源码</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制代码</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-[#0c0c0c] text-[#e0e0e0] rounded-xl p-4 overflow-x-auto text-xs font-mono border border-[#222] shadow-inner max-h-72">
              <pre>{experiment.pytorchSnippet}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#161616] px-6 py-4 border-t border-[#222] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#20b8a4] text-black font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            完成查看
          </button>
        </div>
      </div>
    </div>
  );
};
