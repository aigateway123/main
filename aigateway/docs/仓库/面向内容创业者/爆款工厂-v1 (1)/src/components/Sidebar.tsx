import React from "react";
import { AppView } from "../types";
import {
  LayoutDashboard,
  Radar,
  Sparkles,
  Lightbulb,
  PenTool,
  MessageSquareCode,
  TrendingUp,
  FolderHeart,
  Cpu,
  Settings,
  Flame
} from "lucide-react";

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: AppView.DASHBOARD, label: "首页 Dashboard", icon: LayoutDashboard },
    { id: AppView.RADAR, label: "爆款雷达", icon: Radar, badge: "实时" },
    { id: AppView.DISSECT, label: "爆文拆解", icon: Sparkles },
    { id: AppView.TOPICS, label: "AI选题工厂", icon: Lightbulb },
    { id: AppView.GENERATION, label: "内容生成中心", icon: PenTool },
    { id: AppView.REPLIES, label: "评论成交Agent", icon: MessageSquareCode },
    { id: AppView.DIAGNOSTICS, label: "数据诊断中心", icon: TrendingUp },
    { id: AppView.ASSETS, label: "内容资产库", icon: FolderHeart },
    { id: AppView.AGENT_HUB, label: "AI Agent中心", icon: Cpu, badge: "工作流" },
    { id: AppView.SETTINGS, label: "系统设置", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[#1f1f1f] bg-[#0c0c0c] flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1f1f1f] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_15px_rgba(242,125,38,0.3)] animate-pulse">
          <Flame className="w-5 h-5 text-black font-bold" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent flex items-center">
            爆款工厂 <span className="text-[10px] bg-[#222] px-1.5 py-0.5 rounded text-[#888] ml-1.5 font-mono">V1.0</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">System Agent Console</p>
        </div>
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-left cursor-pointer ${
                isActive
                  ? "bg-[#1a1a1a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-zinc-800/60"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#151515] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? "text-brand" : "text-zinc-400 group-hover:text-zinc-300"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono scale-90 ${
                    item.badge === "实时"
                      ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40"
                      : "bg-brand/10 text-brand border border-brand/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Card footer */}
      <div className="p-4 border-t border-[#1f1f1f] bg-[#161616] flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-[#262626] flex items-center justify-center font-display font-semibold text-brand">
            MCN
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#161616]"></span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-zinc-200 truncate">增长负责人 - 陈立明</h4>
          <p className="text-[11px] text-zinc-500 truncate font-mono">Pro Account</p>
        </div>
      </div>
    </aside>
  );
}
