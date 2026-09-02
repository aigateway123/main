import React from 'react';
import { 
  Globe, 
  Users, 
  Factory, 
  TrendingUp, 
  ShieldAlert, 
  Radar, 
  CheckSquare, 
  Star, 
  History, 
  Settings, 
  Sparkles,
  Bot,
  Zap,
  HelpCircle
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenNewTask: () => void;
  onOpenPitchGuide: () => void;
  favoriteCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTask,
  onOpenPitchGuide,
  favoriteCount,
}) => {
  const mainNavItems = [
    { id: 'home' as TabType, label: '平台首页', icon: Globe, badge: '核心' },
    { id: 'customers' as TabType, label: '客户情报', icon: Users, badge: '237' },
    { id: 'suppliers' as TabType, label: '供应商情报', icon: Factory, badge: '328' },
    { id: 'market' as TabType, label: '市场情报', icon: TrendingUp, badge: '热门' },
    { id: 'competitors' as TabType, label: '竞争对手', icon: ShieldAlert },
    { id: 'radar' as TabType, label: '商机监控', icon: Radar, badge: 'LIVE', badgeColor: 'bg-rose-500 text-white animate-pulse' },
  ];

  const secondaryNavItems = [
    { id: 'tasks' as TabType, label: '任务中心', icon: CheckSquare },
    { id: 'favorites' as TabType, label: '我的收藏', icon: Star, count: favoriteCount },
    { id: 'history' as TabType, label: '历史任务', icon: History },
  ];

  return (
    <nav className="w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 z-30 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
            AI
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight block leading-tight">
              XX AI · 贸易情报员
            </span>
            <span className="text-[10px] text-blue-400 font-mono font-medium">B2B ENTERPRISE</span>
          </div>
        </div>
      </div>

      {/* Quick Launch Button */}
      <div className="px-4 pt-3.5 pb-1">
        <button
          onClick={onOpenNewTask}
          className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>新建情报采集任务</span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 no-scrollbar">
        {/* Main Intelligence Category */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">
            <span>核心业务情报</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">LIVE</span>
          </div>
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/80 text-white border-l-[3px] border-blue-500 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-[3px] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                        item.badgeColor || (isActive ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-800 text-slate-400')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Category */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            数据资产与工作台
          </div>
          <div className="space-y-0.5">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/80 text-white border-l-[3px] border-blue-500 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-[3px] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* System Settings */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            系统管理
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-800/80 text-white border-l-[3px] border-blue-500 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-[3px] border-transparent'
            }`}
          >
            <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-400'}`} />
            <span>数据源与规则配置</span>
          </button>
        </div>
      </div>

      {/* Demo Tour Pitch Guide Footer Card */}
      <div className="p-3 border-t border-slate-800/90 bg-[#0B1120]">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>3分钟客户路演向导</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            给传统外贸企业老板演示时，一键打开标准话术与操作流。
          </p>
          <button
            onClick={onOpenPitchGuide}
            className="w-full py-1.5 px-2 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>打开路演讲解卡</span>
          </button>
        </div>

        {/* Demo status watermark */}
        <div className="mt-2 text-center">
          <span className="text-[10px] text-slate-400 font-mono">演示账号 · High Density Pro</span>
        </div>
      </div>
    </nav>
  );
};
