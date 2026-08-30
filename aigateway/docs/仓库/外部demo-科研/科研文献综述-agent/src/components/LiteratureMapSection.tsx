import React, { useState } from 'react';
import { MapNode } from '../types';
import { Network, ArrowDown, ChevronRight, BookOpen, Layers, Sparkles, Zap, Compass, Info } from 'lucide-react';
import { NodeDetailModal } from './NodeDetailModal';

interface LiteratureMapSectionProps {
  topic: string;
  nodes: MapNode[];
}

export const LiteratureMapSection: React.FC<LiteratureMapSectionProps> = ({ topic, nodes }) => {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [activeInlineNodeId, setActiveInlineNodeId] = useState<string>(nodes[2]?.id || 'node-3'); // default Transformer
  const [viewMode, setViewMode] = useState<'timeline' | 'graph'>('timeline');

  const activeInlineNode = nodes.find((n) => n.id === activeInlineNodeId) || nodes[0];

  return (
    <section id="map" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#222]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf] text-black flex items-center justify-center font-bold text-sm font-mono shadow-sm shadow-[#2dd4bf]/20">
            03
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] font-sans">
              论文地图
            </h2>
            <p className="text-xs sm:text-sm text-[#888]">
              方法学技术演进脉络与时空知识图谱（点击节点展开研究简介）
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="mt-3 sm:mt-0 flex items-center bg-[#111] p-1 rounded-xl border border-[#222] text-xs">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-[#222] text-[#2dd4bf] shadow-xs'
                : 'text-[#888] hover:text-[#ccc]'
            }`}
          >
            演进时间轴模式
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'graph'
                ? 'bg-[#222] text-[#2dd4bf] shadow-xs'
                : 'text-[#888] hover:text-[#ccc]'
            }`}
          >
            中心拓扑图谱模式
          </button>
        </div>
      </div>

      {/* Central Hub Summary Banner */}
      <div className="bg-[#111] rounded-2xl p-5 text-[#e0e0e0] shadow-xl border border-[#222] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#1a2d2a] border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf] shadow-inner">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-[#2dd4bf] font-bold uppercase tracking-wider flex items-center">
              <span>图谱中心核心枢纽 / Central Research Topic</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#f0f0f0] mt-0.5">
              {topic}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#888] bg-[#161616] px-3.5 py-2 rounded-xl border border-[#262626]">
          <Info className="w-4 h-4 text-[#2dd4bf] shrink-0" />
          <span>点击下方各阶段卡片，可即时切换右侧技术机理与瓶颈研读</span>
        </div>
      </div>

      {/* Main Interactive Map Layout */}
      {viewMode === 'timeline' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Chronological Arrow Flow (Nodes 1 to 6) */}
          <div className="lg:col-span-5 space-y-3">
            {nodes.map((node, index) => {
              const isSelected = activeInlineNodeId === node.id;
              const isLast = index === nodes.length - 1;

              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => setActiveInlineNodeId(node.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#1a2d2a]/30 border-[#2dd4bf] ring-1 ring-[#2dd4bf]/40 shadow-md translate-x-1'
                        : 'bg-[#111] border-[#222] hover:border-[#333] hover:bg-[#151515]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: node.color }}
                        ></span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-[#f0f0f0] font-sans text-base">
                              {node.title}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#1a1a1a] text-[#888] border border-[#2a2a2a]">
                              {node.stage.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-xs text-[#888] mt-0.5 font-medium">
                            {node.subtitle}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(node);
                        }}
                        className="text-xs text-[#2dd4bf] hover:text-white p-1 rounded-md hover:bg-[#222] transition-colors"
                        title="打开完整详情"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {node.keyAlgorithms.slice(0, 3).map((algo, aIdx) => (
                        <span
                          key={aIdx}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#181818] text-[#ccc] font-mono border border-[#262626]"
                        >
                          {algo}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Flow Arrow ↓ */}
                  {!isLast && (
                    <div className="flex justify-center py-0.5">
                      <div className="w-6 h-6 rounded-full bg-[#111] border border-[#222] text-[#888] flex items-center justify-center shadow-xs">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Right Column: Active Node Inspector Box */}
          <div className="lg:col-span-7 sticky top-24">
            <div className="bg-[#111] rounded-2xl border border-[#222] shadow-xl p-6 space-y-5">
              {/* Active Node Header */}
              <div className="flex items-start justify-between border-b border-[#222] pb-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider mb-1">
                    <span
                      className="px-2.5 py-0.5 rounded text-white text-[10px] font-mono"
                      style={{ backgroundColor: activeInlineNode.color }}
                    >
                      {activeInlineNode.stage}
                    </span>
                    <span className="text-[#888]">• {activeInlineNode.era}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-sans text-[#f0f0f0]">
                    {activeInlineNode.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#888] font-medium mt-0.5">
                    {activeInlineNode.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedNode(activeInlineNode)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-[#2dd4bf] hover:bg-[#20b8a4] transition-colors shadow-sm cursor-pointer"
                >
                  全屏精读
                </button>
              </div>

              {/* Research Brief */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666] mb-2 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#2dd4bf]" />
                  研究简介
                </h4>
                <p className="text-xs sm:text-sm text-[#ccc] leading-relaxed bg-[#161616] rounded-xl p-4 border border-[#262626]">
                  {activeInlineNode.description}
                </p>
              </div>

              {/* Key Algorithms */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#666] mb-2 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                  主流代表算法与架构
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeInlineNode.keyAlgorithms.map((algo, idx) => (
                    <div
                      key={idx}
                      className="text-xs px-3 py-2 rounded-lg bg-[#181818] border border-[#262626] text-[#eee] font-mono flex items-center space-x-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></span>
                      <span>{algo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Bottlenecks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#121f1a] border border-[#1e382f] rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                    ✓ 技术优势
                  </span>
                  <ul className="space-y-1 text-xs text-[#ccc]">
                    {activeInlineNode.strengths.map((str, idx) => (
                      <li key={idx} className="leading-snug">• {str}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#241416] border border-[#3b1e22] rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1.5">
                    ✗ 固有局限与瓶颈
                  </span>
                  <ul className="space-y-1 text-xs text-[#ccc]">
                    {activeInlineNode.bottlenecks.map((btn, idx) => (
                      <li key={idx} className="leading-snug">• {btn}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Landmark Paper */}
              <div className="bg-[#161616] text-[#eee] rounded-xl p-4 flex items-center justify-between text-xs border border-[#262626]">
                <div>
                  <span className="text-[10px] text-[#2dd4bf] uppercase tracking-wider block font-bold">
                    领域里程碑奠基文献
                  </span>
                  <div className="font-bold text-[#f0f0f0] mt-0.5">
                    {activeInlineNode.classicPaper.title}
                  </div>
                  <div className="text-[#888] font-mono text-[11px] mt-0.5">
                    {activeInlineNode.classicPaper.venue} · {activeInlineNode.classicPaper.year}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Graph Topology Mode */
        <div className="bg-[#111] rounded-2xl border border-[#222] p-6 sm:p-8 text-[#e0e0e0] relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-[#2dd4bf] uppercase tracking-widest block mb-1">
              Topological Knowledge Map
            </span>
            <h3 className="text-xl font-bold font-sans text-[#f0f0f0]">
              研究问题空间与方法簇放射拓扑
            </h3>
          </div>

          {/* Central Orbit Layout */}
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {/* Center Node */}
            <div className="relative z-10 bg-[#162220] rounded-2xl p-6 text-center border-2 border-[#2dd4bf] shadow-2xl shadow-[#2dd4bf]/20 max-w-md w-full mb-8">
              <span className="text-[10px] uppercase tracking-wider text-[#2dd4bf] font-bold block mb-1">
                Knowledge Center
              </span>
              <h4 className="text-xl sm:text-2xl font-bold font-sans text-white">
                {topic}
              </h4>
              <p className="text-xs text-[#a0e6dc] mt-1">
                以高维非线性时序、路网空间拓扑与外部环境协同为核心的科学问题空间
              </p>
            </div>

            {/* Orbiting Satellite Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="bg-[#161616] hover:bg-[#1a1a1a] border border-[#262626] hover:border-[#2dd4bf]/60 rounded-xl p-4 cursor-pointer transition-all duration-200 group shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: node.color }}
                    ></span>
                    <span className="text-[10px] font-mono text-[#888]">
                      {node.stage.split(' ')[0]}
                    </span>
                  </div>
                  <h5 className="font-bold text-[#f0f0f0] group-hover:text-[#2dd4bf] transition-colors">
                    {node.title}
                  </h5>
                  <p className="text-xs text-[#888] mt-1 line-clamp-2">
                    {node.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-[#222] flex items-center justify-between text-[11px] text-[#2dd4bf] font-medium">
                    <span>查看深度机理</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Inspector */}
      <NodeDetailModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </section>
  );
};
