import React from 'react';
import { ResearchOverview } from '../types';
import { FileText, Award, Layers, Lightbulb, TrendingUp, Compass, BookOpen, CheckCircle2 } from 'lucide-react';

interface OverviewSectionProps {
  overview: ResearchOverview;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ overview }) => {
  const maxYearCount = Math.max(...overview.yearDistribution.map((d) => d.count));

  return (
    <section id="overview" className="scroll-mt-24 space-y-6">
      {/* Section Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#222]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf] text-black flex items-center justify-center font-bold text-sm font-mono shadow-sm shadow-[#2dd4bf]/20">
            01
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] font-sans">
              研究概览
            </h2>
            <p className="text-xs sm:text-sm text-[#888]">
              全域文献检索统计与学术数据库收录分布
            </p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded text-xs font-semibold bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/40">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#2dd4bf]" />
            分析完成 · {overview.timeRange}
          </span>
        </div>
      </div>

      {/* Main Topic Banner */}
      <div className="bg-[#111] rounded-2xl p-6 text-[#e0e0e0] shadow-xl border border-[#222]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#2dd4bf] text-xs font-bold tracking-wider uppercase mb-1.5">
              <Compass className="w-4 h-4 text-[#2dd4bf]" />
              <span>当前研究主题 / Target Domain</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-[#f0f0f0]">
              {overview.topic}
            </h3>
            <p className="text-xs sm:text-sm text-[#888] mt-1 max-w-2xl">
              聚焦近5年深度学习、图神经网络、时空注意机制与多模态数据驱动在充电桩及车网互动中的预测前沿。
            </p>
          </div>
          <div className="shrink-0 flex items-center space-x-2">
            <div className="bg-[#161616] border border-[#282828] rounded-xl px-4 py-3 text-center">
              <div className="text-[11px] text-[#888]">检索数据库</div>
              <div className="text-sm font-semibold text-[#f0f0f0] mt-0.5">IEEE / Elsevier / ACM</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: 分析论文 */}
        <div className="bg-[#111] rounded-xl border border-[#222] p-4 sm:p-5 shadow-sm hover:border-[#333] transition-all">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666]">分析论文</span>
            <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-[#aaa] flex items-center justify-center border border-[#282828]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#f0f0f0] font-mono tracking-tight">
            {overview.totalPapers.toLocaleString()}
            <span className="text-xs font-normal text-[#666] ml-1">篇</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-[#888]">
            <span className="text-[#2dd4bf] font-medium mr-1">全网全库</span> 原始粗筛池
          </div>
        </div>

        {/* Card 2: 高相关论文 */}
        <div className="bg-[#111] rounded-xl border border-[#222] p-4 sm:p-5 shadow-sm hover:border-[#333] transition-all">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666]">高相关论文</span>
            <div className="w-7 h-7 rounded-lg bg-[#1a2d2a] text-[#2dd4bf] flex items-center justify-center border border-[#2dd4bf]/30">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2dd4bf] font-mono tracking-tight">
            {overview.highRelevancePapers.toLocaleString()}
            <span className="text-xs font-normal text-[#666] ml-1">篇</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-[#888]">
            <span className="text-[#2dd4bf] font-medium mr-1">Top 14.7%</span> 语义强相关
          </div>
        </div>

        {/* Card 3: 重点论文 */}
        <div className="bg-[#111] rounded-xl border border-[#222] p-4 sm:p-5 shadow-sm hover:border-[#333] transition-all">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666]">重点论文</span>
            <div className="w-7 h-7 rounded-lg bg-[#1f1a2e] text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono tracking-tight">
            {overview.keyPapers}
            <span className="text-xs font-normal text-[#666] ml-1">篇</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-[#888]">
            <span className="text-purple-400 font-medium mr-1">高被引/里程碑</span> 核心精读
          </div>
        </div>

        {/* Card 4: 主要研究方向 */}
        <div className="bg-[#111] rounded-xl border border-[#222] p-4 sm:p-5 shadow-sm hover:border-[#333] transition-all">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666]">主要研究方向</span>
            <div className="w-7 h-7 rounded-lg bg-[#1a2d2a] text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {overview.mainDirectionsCount}
            <span className="text-xs font-normal text-[#666] ml-1">个</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-[#888]">
            <span className="text-emerald-400 font-medium mr-1">方法簇聚类</span> 涵盖主流范式
          </div>
        </div>

        {/* Card 5: 潜在研究机会 */}
        <div className="bg-[#111] rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 sm:p-5 shadow-sm hover:border-amber-500 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">潜在研究机会</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
            {overview.potentialOpportunitiesCount}
            <span className="text-xs font-normal text-[#666] ml-1">个</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-amber-300/80 font-medium">
            <span>AI 精准挖掘</span>
            <span className="ml-1 text-amber-400">★ 关键创新点</span>
          </div>
        </div>
      </div>

      {/* Auxiliary Analysis: Publication Trend & Top Venues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trend Bar Chart */}
        <div className="md:col-span-2 bg-[#111] rounded-xl border border-[#222] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#2dd4bf]" />
              <h4 className="text-sm font-bold text-[#f0f0f0]">近5年相关文献发文量增长趋势</h4>
            </div>
            <span className="text-xs text-[#666] font-mono">CAGR ~28.4%</span>
          </div>
          <div className="grid grid-cols-5 gap-3 items-end h-28 pt-2">
            {overview.yearDistribution.map((item) => {
              const heightPercent = Math.round((item.count / maxYearCount) * 100);
              return (
                <div key={item.year} className="flex flex-col items-center group">
                  <span className="text-[11px] font-mono font-semibold text-[#2dd4bf] mb-1 opacity-90 group-hover:scale-110 transition-transform">
                    {item.count}
                  </span>
                  <div className="w-full bg-[#1a1a1a] rounded-t-md h-20 flex items-end overflow-hidden border-b border-[#333]">
                    <div
                      className="w-full bg-[#2dd4bf] group-hover:bg-[#20b8a4] transition-all rounded-t-md opacity-90"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono text-[#888] mt-2">{item.year}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Venues List */}
        <div className="bg-[#111] rounded-xl border border-[#222] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="w-4 h-4 text-[#2dd4bf]" />
              <h4 className="text-sm font-bold text-[#f0f0f0]">主要文献来源与期刊</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {overview.topJournals.map((journal, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded bg-[#181818] text-[#ccc] border border-[#282828] font-medium"
                >
                  {journal}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#222] text-[11px] text-[#666] flex items-center justify-between">
            <span>电力系统 / 智能交通 / 人工智能</span>
            <span className="font-mono text-[#2dd4bf] font-semibold">JCR Q1 / CCF</span>
          </div>
        </div>
      </div>
    </section>
  );
};
