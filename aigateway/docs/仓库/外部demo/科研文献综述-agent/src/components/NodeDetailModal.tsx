import React from 'react';
import { MapNode } from '../types';
import { X, Network, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

interface NodeDetailModalProps {
  node: MapNode | null;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#111] rounded-2xl border border-[#222] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#161616] text-[#e0e0e0] p-6 border-b border-[#222] flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider mb-1">
              <span
                className="px-2 py-0.5 rounded text-black font-bold font-mono text-[10px]"
                style={{ backgroundColor: node.color }}
              >
                {node.stage}
              </span>
              <span className="text-[#888]">• {node.era}</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-[#f0f0f0]">{node.title}</h3>
            <p className="text-xs text-[#888] mt-0.5">{node.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#222] text-[#888] hover:text-white hover:bg-[#333] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#888] mb-2 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1 text-[#2dd4bf]" />
              研究简介与技术定位
            </h4>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-4 text-[#ccc] leading-relaxed">
              {node.description}
            </div>
          </div>

          {/* Key Algorithms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#888] mb-2 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-[#2dd4bf]" />
              核心代表算法
            </h4>
            <div className="flex flex-wrap gap-2">
              {node.keyAlgorithms.map((algo, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/30 font-medium text-xs"
                >
                  {algo}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths vs Bottlenecks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#121f1a] border border-[#1e382f] rounded-xl p-4">
              <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                技术优势 (Strengths)
              </h5>
              <ul className="space-y-1.5 text-xs text-[#ccc]">
                {node.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#241315] border border-[#421d23] rounded-xl p-4">
              <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-400" />
                固有瓶颈 (Bottlenecks)
              </h5>
              <ul className="space-y-1.5 text-xs text-[#ccc]">
                {node.bottlenecks.map((btn, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{btn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Classic Benchmark Paper */}
          <div className="bg-[#161616] border border-[#262626] rounded-xl p-4 text-xs">
            <span className="font-bold text-[#f0f0f0] uppercase tracking-wider text-[11px] block mb-1">
              经典代表文献 (Benchmark Paper)
            </span>
            <div className="font-semibold text-[#2dd4bf] font-sans">{node.classicPaper.title}</div>
            <div className="text-[#888] mt-0.5">
              {node.classicPaper.venue} ({node.classicPaper.year})
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#161616] px-6 py-3.5 border-t border-[#222] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-black text-xs font-bold hover:bg-[#20b8a4] transition-all cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
