import React from 'react';
import { BookOpen, Sparkles, Network, FileSearch, ArrowRight } from 'lucide-react';

interface HeaderProps {
  hasResults: boolean;
  onReset: () => void;
  activeSection?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasResults,
  onReset,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#222] bg-[#050505]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
            <div className="w-8 h-8 rounded-md bg-[#2dd4bf] flex items-center justify-center text-black font-black font-mono shadow-md shadow-[#2dd4bf]/20">
              A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#f0f0f0] font-sans">
                  科研文献综述 Agent
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1a2d2a] text-[#2dd4bf] border border-[#2dd4bf]/30">
                  <Sparkles className="w-2.5 h-2.5 mr-1 text-[#2dd4bf]" />
                  Academic Agent
                </span>
              </div>
              <p className="text-xs text-[#888] hidden sm:block">
                从海量论文中发现研究热点、研究空白与潜在创新方向
              </p>
            </div>
          </div>

          {/* Quick Nav Anchors when results are present */}
          {hasResults && (
            <div className="hidden md:flex items-center space-x-1 text-xs font-medium text-[#888] bg-[#111] p-1 rounded-lg border border-[#222]">
              <button
                onClick={() => onScrollToSection?.('overview')}
                className="px-3 py-1.5 rounded hover:bg-[#222] hover:text-[#2dd4bf] transition-all cursor-pointer"
              >
                01 概览
              </button>
              <button
                onClick={() => onScrollToSection?.('hotspots')}
                className="px-3 py-1.5 rounded hover:bg-[#222] hover:text-[#2dd4bf] transition-all cursor-pointer"
              >
                02 热点
              </button>
              <button
                onClick={() => onScrollToSection?.('map')}
                className="px-3 py-1.5 rounded hover:bg-[#222] hover:text-[#2dd4bf] transition-all cursor-pointer"
              >
                03 论文地图
              </button>
              <button
                onClick={() => onScrollToSection?.('gaps')}
                className="px-3 py-1.5 rounded hover:bg-[#222] hover:text-amber-400 transition-all cursor-pointer text-amber-400 font-semibold"
              >
                04 研究空白
              </button>
              <button
                onClick={() => onScrollToSection?.('recommendation')}
                className="px-3 py-1.5 rounded hover:bg-[#222] hover:text-[#2dd4bf] transition-all cursor-pointer"
              >
                05 AI建议
              </button>
            </div>
          )}

          {/* Action Status */}
          <div className="flex items-center space-x-3">
            {hasResults ? (
              <button
                onClick={onReset}
                className="inline-flex items-center text-xs sm:text-sm font-medium text-[#ccc] hover:text-white bg-[#111] border border-[#222] hover:border-[#444] px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <FileSearch className="w-4 h-4 mr-1.5 text-[#888]" />
                修改研究主题
              </button>
            ) : (
              <div className="flex items-center space-x-2 text-xs text-[#888] bg-[#111] px-3.5 py-1.5 rounded-lg border border-[#222]">
                <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse"></span>
                <span>学术知识库已就绪</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
