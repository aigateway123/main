import React, { useState } from 'react';
import { CorePaper } from '../types';
import { X, BookOpen, ExternalLink, Copy, Check, Award, Star, Search } from 'lucide-react';

interface CorePapersModalProps {
  papers: CorePaper[];
  onClose: () => void;
}

export const CorePapersModal: React.FC<CorePapersModalProps> = ({ papers, onClose }) => {
  const [copiedBibId, setCopiedBibId] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>('all');

  const handleCopyBibtex = (paper: CorePaper) => {
    navigator.clipboard.writeText(paper.bibtex);
    setCopiedBibId(paper.id);
    setTimeout(() => setCopiedBibId(null), 2000);
  };

  const allTags = ['all', ...Array.from(new Set(papers.flatMap((p) => p.tags)))];

  const filteredPapers =
    filterTag === 'all' ? papers : papers.filter((p) => p.tags.includes(filterTag));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#111] rounded-2xl border border-[#222] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#161616] text-[#e0e0e0] p-6 border-b border-[#222] flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#2dd4bf] text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-[#2dd4bf]" />
              <span>领域高被引精读与奠基文献库</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#f0f0f0] leading-tight">
              精选核心代表性论文清单 ({papers.length} 篇重点精读)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#222] text-[#888] hover:text-white hover:bg-[#333] transition-all cursor-pointer shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter tags bar */}
        <div className="bg-[#161616] px-6 py-3 border-b border-[#222] flex items-center space-x-2 overflow-x-auto">
          <span className="text-xs font-semibold text-[#888] shrink-0">标签筛选：</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`text-xs px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filterTag === tag
                  ? 'bg-[#2dd4bf] text-black font-bold shadow-2xs'
                  : 'bg-[#1e1e1e] text-[#aaa] border border-[#2c2c2c] hover:bg-[#252525] hover:text-white'
              }`}
            >
              {tag === 'all' ? '全部文献' : tag}
            </button>
          ))}
        </div>

        {/* Papers List */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-[#ccc] text-sm">
          {filteredPapers.map((paper, idx) => (
            <div
              key={paper.id}
              className="bg-[#161616] border border-[#262626] rounded-2xl p-5 shadow-xs hover:border-[#333] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/30">
                      #{idx + 1}
                    </span>
                    {paper.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#222] text-[#aaa] font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold font-sans text-[#f0f0f0] leading-snug">
                    {paper.title}
                  </h4>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#1e1c12] text-amber-300 border border-amber-500/30">
                    被引 {paper.citations.toLocaleString()}+
                  </span>
                </div>
              </div>

              {/* Authors & Venue */}
              <div className="text-xs text-[#888] font-medium">
                <span>{paper.authors}</span>
                <span className="mx-1.5">•</span>
                <strong className="text-[#2dd4bf] font-sans">{paper.venue}</strong> ({paper.year})
                {paper.doi && (
                  <>
                    <span className="mx-1.5">•</span>
                    <span className="font-mono text-[11px] text-[#666]">DOI: {paper.doi}</span>
                  </>
                )}
              </div>

              {/* Abstract & Key Contribution */}
              <div className="space-y-2 text-xs">
                <p className="text-[#aaa] bg-[#111] p-3 rounded-xl border border-[#222] leading-relaxed">
                  <strong className="text-[#e0e0e0]">摘要要点：</strong>
                  {paper.abstract}
                </p>
                <div className="p-3 bg-[#1e1526] rounded-xl border border-purple-500/20 text-purple-200">
                  <strong className="text-purple-300">学术贡献：</strong>
                  {paper.keyContribution}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#666] font-mono">CCF / SCI Q1 权威收录</span>
                <button
                  onClick={() => handleCopyBibtex(paper)}
                  className="inline-flex items-center space-x-1.5 text-[#2dd4bf] hover:text-white bg-[#1a2d2a] hover:bg-[#203a36] border border-[#2dd4bf]/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
                >
                  {copiedBibId === paper.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">已复制 BibTeX</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制 BibTeX 引用</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#161616] px-6 py-4 border-t border-[#222] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#20b8a4] text-black font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            完成精读
          </button>
        </div>
      </div>
    </div>
  );
};
