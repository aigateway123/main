import React from 'react';
import { ResearchHotspot } from '../types';
import { X, Star, BookOpen, Cpu, TrendingUp, Database, Award, ExternalLink, Sparkles } from 'lucide-react';

interface HotspotDetailModalProps {
  hotspot: ResearchHotspot | null;
  onClose: () => void;
}

export const HotspotDetailModal: React.FC<HotspotDetailModalProps> = ({ hotspot, onClose }) => {
  if (!hotspot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#111] rounded-2xl border border-[#222] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#161616] text-[#e0e0e0] p-6 border-b border-[#222] flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#2dd4bf] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#2dd4bf]" />
              <span>研究热点方向深度解析</span>
            </div>
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-bold font-sans text-[#f0f0f0]">{hotspot.name}</h3>
              <div className="flex items-center text-amber-400 text-base font-mono">
                {hotspot.ratingText}
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-2 text-xs text-[#888]">
              <span>热度指数: <strong className="text-[#2dd4bf]">{hotspot.heatScore}/100</strong></span>
              <span>•</span>
              <span>核心总被引: <strong className="text-[#f0f0f0]">{hotspot.citationCount.toLocaleString()}+ 次</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#222] text-[#888] hover:text-white hover:bg-[#333] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#ccc] text-sm font-sans">
          {/* 1. 研究简介 */}
          <div>
            <div className="flex items-center space-x-2 text-[#f0f0f0] font-bold mb-2 text-base font-sans">
              <div className="w-6 h-6 rounded-md bg-[#1a2d2a] text-[#2dd4bf] flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <h4>研究简介</h4>
            </div>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-4 text-[#ccc] leading-relaxed">
              {hotspot.summary}
            </div>
          </div>

          {/* 2. 常见方法 */}
          <div>
            <div className="flex items-center space-x-2 text-[#f0f0f0] font-bold mb-2 text-base font-sans">
              <div className="w-6 h-6 rounded-md bg-[#1a2d2a] text-[#2dd4bf] flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <h4>常见方法与经典算法</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hotspot.commonMethods.map((method, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 bg-[#161616] border border-[#262626] rounded-lg px-3.5 py-2.5 shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></span>
                  <span className="font-medium text-[#e0e0e0]">{method}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 代表性研究 */}
          <div>
            <div className="flex items-center space-x-2 text-[#f0f0f0] font-bold mb-2 text-base font-sans">
              <div className="w-6 h-6 rounded-md bg-[#1e1526] text-purple-400 flex items-center justify-center">
                <Award className="w-3.5 h-3.5" />
              </div>
              <h4>代表性研究与奠基论文</h4>
            </div>
            <div className="space-y-3">
              {hotspot.representativeStudies.map((study, idx) => (
                <div
                  key={idx}
                  className="bg-[#1e1526] border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <h5 className="font-bold text-[#f0f0f0] font-sans leading-snug">
                      {study.title}
                    </h5>
                    <span className="shrink-0 ml-2 text-xs font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-400/30 font-medium">
                      引用 {study.citations}+
                    </span>
                  </div>
                  <p className="text-xs text-[#888] mt-1">
                    {study.authors} · <span className="font-semibold text-[#ccc]">{study.venue}</span> ({study.year})
                  </p>
                  <div className="mt-2 text-xs text-[#ddd] bg-[#111] p-2.5 rounded-lg border border-[#262626]">
                    <strong className="text-purple-300">核心贡献：</strong>
                    {study.contribution}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 当前发展趋势 */}
          <div>
            <div className="flex items-center space-x-2 text-[#f0f0f0] font-bold mb-2 text-base font-sans">
              <div className="w-6 h-6 rounded-md bg-[#121f1a] text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <h4>当前发展趋势</h4>
            </div>
            <div className="space-y-2">
              {hotspot.currentTrends.map((trend, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-[#ccc]">
                  <span className="w-5 h-5 rounded-full bg-[#121f1a] text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{trend}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. 常见数据集 */}
          <div>
            <div className="flex items-center space-x-2 text-[#f0f0f0] font-bold mb-2 text-base font-sans">
              <div className="w-6 h-6 rounded-md bg-[#1e1c12] text-amber-400 flex items-center justify-center">
                <Database className="w-3.5 h-3.5" />
              </div>
              <h4>常见公开基准数据集</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {hotspot.commonDatasets.map((ds, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#1e1c12] text-amber-300 border border-amber-500/30 font-medium"
                >
                  {ds}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#161616] px-6 py-4 border-t border-[#222] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#20b8a4] text-black font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            关闭详情
          </button>
        </div>
      </div>
    </div>
  );
};
