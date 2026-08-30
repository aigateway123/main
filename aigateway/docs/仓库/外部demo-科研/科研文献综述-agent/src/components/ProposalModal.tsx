import React, { useState } from 'react';
import { ProposalOutline } from '../types';
import { X, FileText, Download, Copy, Check, Sparkles, BookOpen, Award, Layers } from 'lucide-react';

interface ProposalModalProps {
  proposal: ProposalOutline;
  onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ proposal, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const text = `# ${proposal.title}\n\n## 一、立项依据与研究背景\n${proposal.background.join('\n\n')}\n\n## 二、拟解决的关键科学问题\n${proposal.keyScientificProblems.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n## 三、拟采取的技术路线与实施方案\n${proposal.technicalRoute.join('\n')}\n\n## 四、主要学术创新点\n${proposal.majorInnovations.join('\n')}\n\n## 五、预期研究进展与考核指标\n${proposal.expectedMilestones.map((m) => `- ${m.phase}: ${m.goal}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#111] rounded-2xl border border-[#222] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#161616] text-[#e0e0e0] p-6 border-b border-[#222] flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#2dd4bf] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#2dd4bf]" />
              <span>国家基金/学术科研申报书框架</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#f0f0f0] leading-tight">
              {proposal.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#222] text-[#888] hover:text-white hover:bg-[#333] transition-all cursor-pointer shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Proposal Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#ccc] text-sm font-sans">
          {/* 1. 立项依据与背景 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#f0f0f0] font-sans flex items-center border-b border-[#222] pb-1.5">
              <BookOpen className="w-4 h-4 mr-2 text-[#2dd4bf]" />
              一、立项依据与研究背景
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-[#ccc] leading-relaxed bg-[#161616] p-4 rounded-xl border border-[#262626]">
              {proposal.background.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>
          </div>

          {/* 2. 拟解决的关键科学问题 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#f0f0f0] font-sans flex items-center border-b border-[#222] pb-1.5">
              <Award className="w-4 h-4 mr-2 text-purple-400" />
              二、拟解决的核心科学问题
            </h4>
            <div className="space-y-2">
              {proposal.keyScientificProblems.map((prob, idx) => (
                <div
                  key={idx}
                  className="bg-[#1e1526] border border-purple-500/20 rounded-xl p-3.5 text-xs sm:text-sm text-purple-200 font-medium flex items-start space-x-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-400/30 flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <span>{prob}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 拟采取的技术路线 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#f0f0f0] font-sans flex items-center border-b border-[#222] pb-1.5">
              <Layers className="w-4 h-4 mr-2 text-[#2dd4bf]" />
              三、拟采取的技术路线与实施方案
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              {proposal.technicalRoute.map((route, idx) => (
                <div
                  key={idx}
                  className="bg-[#161616] border border-[#262626] rounded-xl p-3 shadow-2xs flex items-start space-x-2"
                >
                  <span className="text-[#2dd4bf] font-bold text-xs mt-0.5">➔</span>
                  <span className="text-[#ddd]">{route}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 主要学术创新点 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#f0f0f0] font-sans flex items-center border-b border-[#222] pb-1.5">
              <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
              四、主要学术创新点
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              {proposal.majorInnovations.map((inn, idx) => (
                <div
                  key={idx}
                  className="bg-[#1e1c12] border border-amber-500/30 rounded-xl p-3.5 text-amber-200 font-medium"
                >
                  {inn}
                </div>
              ))}
            </div>
          </div>

          {/* 5. 预期进度与产出指标 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#f0f0f0] font-sans flex items-center border-b border-[#222] pb-1.5">
              <FileText className="w-4 h-4 mr-2 text-emerald-400" />
              五、预期研究进度与产出成果
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {proposal.expectedMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-[#121f1a] border border-[#1e382f] rounded-xl p-3 flex flex-col justify-between"
                >
                  <span className="font-bold text-emerald-400 font-mono text-[11px] block mb-1">
                    {m.phase}
                  </span>
                  <p className="text-[#ccc] leading-relaxed">{m.goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-[#161616] px-6 py-4 border-t border-[#222] flex items-center justify-between">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[#222] border border-[#333] hover:border-[#2dd4bf] text-[#e0e0e0] hover:text-[#2dd4bf] transition-all cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">已复制 Markdown</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>复制 Markdown 大纲</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#20b8a4] text-black font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            完成研读
          </button>
        </div>
      </div>
    </div>
  );
};
