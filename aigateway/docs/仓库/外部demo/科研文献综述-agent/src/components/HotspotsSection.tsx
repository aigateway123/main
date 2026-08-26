import React, { useState } from 'react';
import { ResearchHotspot } from '../types';
import { ChevronDown, ChevronUp, Star, Flame, BookOpen, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { HotspotDetailModal } from './HotspotDetailModal';

interface HotspotsSectionProps {
  hotspots: ResearchHotspot[];
}

export const HotspotsSection: React.FC<HotspotsSectionProps> = ({ hotspots }) => {
  const [expandedId, setExpandedId] = useState<string | null>('transformer');
  const [selectedHotspot, setSelectedHotspot] = useState<ResearchHotspot | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < count
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-[#333] fill-[#222]'
        }`}
      />
    ));
  };

  return (
    <section id="hotspots" className="scroll-mt-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#222]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf] text-black flex items-center justify-center font-bold text-sm font-mono shadow-sm shadow-[#2dd4bf]/20">
            02
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] font-sans">
              研究热点
            </h2>
            <p className="text-xs sm:text-sm text-[#888]">
              主流技术范式评级与研究热度（点击卡片展开详细方法与文献）
            </p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 text-xs text-[#888]">
          <span className="font-semibold text-[#2dd4bf]">5 项核心技术范式</span> 综合评级
        </div>
      </div>

      {/* Hotspots Grid / Accordion */}
      <div className="grid grid-cols-1 gap-4">
        {hotspots.map((hotspot) => {
          const isExpanded = expandedId === hotspot.id;

          return (
            <div
              key={hotspot.id}
              className={`bg-[#111] rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                isExpanded
                  ? 'border-[#333] ring-1 ring-[#2dd4bf]/20 shadow-md'
                  : 'border-[#222] hover:border-[#333]'
              }`}
            >
              {/* Card Header clickable */}
              <div
                onClick={() => toggleExpand(hotspot.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-[#151515] transition-colors"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg font-mono shrink-0 transition-colors ${
                      hotspot.stars === 5
                        ? 'bg-[#2a2210] text-amber-400 border border-amber-500/30'
                        : hotspot.stars === 4
                        ? 'bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/30'
                        : 'bg-[#1a1a1a] text-[#aaa] border border-[#282828]'
                    }`}
                  >
                    <Flame
                      className={`w-6 h-6 ${
                        hotspot.trend === 'hot'
                          ? 'text-amber-400 fill-amber-400 animate-pulse'
                          : hotspot.trend === 'up'
                          ? 'text-[#2dd4bf]'
                          : 'text-[#666]'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg sm:text-xl font-bold text-[#f0f0f0] font-sans">
                        {hotspot.name}
                      </h3>
                      <div className="flex items-center space-x-1" title={`${hotspot.stars} 星评级`}>
                        {renderStars(hotspot.stars)}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#888] hidden sm:inline">
                        {hotspot.ratingText}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#888] mt-1 line-clamp-1">
                      {hotspot.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1f1f1f]">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-[#666]">领域热度</div>
                    <div className="text-sm font-bold text-[#f0f0f0] font-mono">
                      {hotspot.heatScore}
                      <span className="text-xs font-normal text-[#666]">/100</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotspot(hotspot);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#2dd4bf] bg-[#1a2d2a] hover:bg-[#223d38] border border-[#2dd4bf]/30 transition-colors flex items-center space-x-1 cursor-pointer"
                      title="打开大图弹窗浏览"
                    >
                      <span>全景视窗</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <div className="p-1 rounded-full text-[#666] hover:text-white transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#2dd4bf]" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-[#222] bg-[#0c0c0c] space-y-4 animate-in fade-in duration-200">
                  {/* 1. 研究简介 */}
                  <div className="bg-[#141414] rounded-xl border border-[#222] p-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666] mb-2 flex items-center">
                      <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#2dd4bf]" />
                      研究简介
                    </h4>
                    <p className="text-xs sm:text-sm text-[#ccc] leading-relaxed">
                      {hotspot.summary}
                    </p>
                  </div>

                  {/* 2. 常见方法 & 常见数据集 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#141414] rounded-xl border border-[#222] p-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666] mb-2.5 flex items-center">
                        <Layers className="w-3.5 h-3.5 mr-1.5 text-[#2dd4bf]" />
                        常见方法与模型
                      </h4>
                      <ul className="space-y-1.5">
                        {hotspot.commonMethods.map((method, idx) => (
                          <li key={idx} className="text-xs text-[#ddd] flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></span>
                            <span className="font-medium">{method}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#141414] rounded-xl border border-[#222] p-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666] mb-2.5 flex items-center">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                        常见公开数据集
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {hotspot.commonDatasets.map((ds, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded bg-[#1e1c12] text-amber-300 border border-amber-500/30 font-medium font-mono"
                          >
                            {ds}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. 代表性研究 */}
                  <div className="bg-[#141414] rounded-xl border border-[#222] p-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666] mb-3 flex items-center justify-between">
                      <span className="flex items-center">
                        <Star className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                        代表性研究与论文
                      </span>
                      <span className="text-[11px] font-normal text-[#666]">领域高被引基准文献</span>
                    </h4>
                    <div className="space-y-2.5">
                      {hotspot.representativeStudies.map((study, idx) => (
                        <div
                          key={idx}
                          className="bg-[#191919] border border-[#282828] rounded-lg p-3 text-xs"
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-[#f0f0f0]">{study.title}</span>
                            <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#2a1c36] text-purple-300 border border-purple-500/30 shrink-0">
                              引用 {study.citations}+
                            </span>
                          </div>
                          <div className="text-[#888] mt-1 font-mono text-[11px]">
                            {study.authors} · <strong className="text-[#ccc]">{study.venue}</strong> ({study.year})
                          </div>
                          <div className="mt-1.5 text-[#ccc] text-xs bg-[#111] p-2.5 rounded border border-[#222]">
                            <span className="font-semibold text-[#2dd4bf]">核心发现：</span>
                            {study.contribution}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. 当前发展趋势 */}
                  <div className="bg-[#141414] rounded-xl border border-[#222] p-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666] mb-2 flex items-center">
                      <Flame className="w-3.5 h-3.5 mr-1.5 text-[#2dd4bf]" />
                      当前发展趋势
                    </h4>
                    <div className="space-y-1.5">
                      {hotspot.currentTrends.map((trend, idx) => (
                        <div key={idx} className="text-xs text-[#ccc] flex items-start space-x-2">
                          <span className="text-[#2dd4bf] font-bold">➔</span>
                          <span>{trend}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal View */}
      <HotspotDetailModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
      />
    </section>
  );
};
