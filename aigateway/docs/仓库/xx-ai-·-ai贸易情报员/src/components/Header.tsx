import React from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  Download, 
  HelpCircle,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';

interface HeaderProps {
  onOpenNewTask: () => void;
  onOpenPitchGuide: () => void;
  currentProduct: string;
  onChangePreset: (presetName: string) => void;
  onExportAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewTask,
  onOpenPitchGuide,
  currentProduct,
  onChangePreset,
  onExportAll,
}) => {
  const presets = [
    { label: '铝合金门窗 (默认 · 美国/加拿大)', value: 'aluminum_windows' },
    { label: '智能光伏支架 (欧洲/德国)', value: 'solar_brackets' },
    { label: '注塑模具与机械配件 (东南亚)', value: 'injection_molds' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Left Title & Status */}
      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>AI贸易情报员</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h1>
            <span className="text-xs text-slate-300 font-normal">|</span>
            <span className="text-xs text-blue-600 font-medium hidden sm:inline">全球商业信息智能采集与商机挖掘平台</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5 font-mono">
            <span className="flex items-center gap-1">
              <span className="text-emerald-500 font-bold">●</span> 实时海关网络: 142口岸连通
            </span>
            <span className="hidden md:inline text-slate-300">·</span>
            <span className="hidden md:inline">
              全球已索引企业: 1,840,000+
            </span>
          </div>
        </div>

        {/* Current Scenario Preset Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 font-medium">当前演示行业:</span>
          <select 
            className="bg-transparent text-slate-800 font-semibold text-xs focus:outline-none cursor-pointer"
            defaultValue="aluminum_windows"
            onChange={(e) => onChangePreset(e.target.value)}
          >
            {presets.map(p => (
              <option key={p.value} value={p.value} className="bg-white text-slate-800">
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Pitch Guide */}
        <button
          onClick={onOpenPitchGuide}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium transition-colors cursor-pointer"
          title="3分钟给客户演示的标准话术流程"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>演示路演向导</span>
        </button>

        {/* Export Data Simulation */}
        <button
          onClick={onExportAll}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium transition-colors cursor-pointer shadow-xs"
          title="一键导出全套情报分析报表"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>导出报告</span>
        </button>

        {/* Main CTA */}
        <button
          onClick={onOpenNewTask}
          className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>新建采集任务</span>
        </button>
      </div>
    </header>
  );
};
