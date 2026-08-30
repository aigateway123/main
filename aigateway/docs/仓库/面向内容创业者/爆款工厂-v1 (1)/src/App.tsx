import React, { useState } from "react";
import { AppView, Asset } from "./types";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import RadarView from "./components/RadarView";
import DissectView from "./components/DissectView";
import TopicView from "./components/TopicView";
import GenerationView from "./components/GenerationView";
import ReplyAgentView from "./components/ReplyAgentView";
import DiagnosticsView from "./components/DiagnosticsView";
import AssetLibraryView from "./components/AssetLibraryView";
import AgentHubView from "./components/AgentHubView";
import SettingsView from "./components/SettingsView";
import { Sparkles, Terminal, Bell, Cpu, Sun } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  // Sharing states for moving Topic Ideas -> Topic Generator Center
  const [selectedTopicTitle, setSelectedTopicTitle] = useState("");
  const [selectedTopicIndustry, setSelectedTopicIndustry] = useState("");

  // Sharing state for URL analytics dissection
  const [selectedUrl, setSelectedUrl] = useState("");

  // Global Content Assets Vault
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "ast-1",
      title: "【爆款图文】如何用一根眼线画出高冷清冷中式妆？",
      content: "【核心观点】打破西方浓妆框架，利用新中式大白、柔焦、以及下垂猫挂画，快速突出清冷叛逆的高级质感！\n\n【黄金前3秒开头】：“别画大粗双眼皮长眼线了！今年爆款的清冷清浅小媚眼，其实只需三笔，连手残党5秒钟就能一学即会...”\n\n【爆赞参考大纲】\n1. 中式眼线底层折角规律\n2. 面部五官留白，打造骨相呼吸感\n3. 早八打卡极速成妆指南。\n\n#爆款眼线 #新中式清冷妆容 #早八快速成妆化法",
      type: "copy",
      category: "美妆护肤",
      tags: ["#美妆教程", "#新中式妆面", "#起号大赞粉"],
      createdAt: "2026-06-07"
    },
    {
      id: "ast-2",
      title: "【黄金选题大纲】为什么我劝你立即停止无脑日更图文？",
      content: "【核心痛点切入点】: 很多新手陷入每天熬夜作图、胡乱产出、结果粉丝没涨，反而把内容权重拉爆，沦落到均温200的焦虑陷阱中。深度探寻质感输出和多账号批量排布因果机制。\n\n【建议前3秒痛点句】: “你是不是也每天累死累活作图，结果篇篇大批二百纯属自娱自乐？今天告诉你一个血淋淋的小红书事实：没有权重卡点，你所谓的勤奋纯属垃圾输出...”\n\n【爆款潜力值】：98%\n【竞争难度比】：30%\n【预期转化漏斗】：94%",
      type: "topic",
      category: "创作者运营",
      tags: ["#起号干货", "#运营方法论", "#爆款选题"],
      createdAt: "2026-06-06"
    }
  ]);

  // Callback to add generative results to assets
  const handleSaveToAssets = (
    title: string,
    content: string,
    category: string,
    type: "copy" | "topic" | "script" | "image" | "preset"
  ) => {
    const newAsset: Asset = {
      id: `ast-${Date.now()}`,
      title,
      content,
      type: type as any,
      category,
      tags: ["#智能收录", `#${category}`],
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleAddManualAsset = (assetData: Omit<Asset, "id" | "createdAt">) => {
    const newAsset: Asset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(prev => prev.filter(ast => ast.id !== id));
  };

  // Callback from Topics factory -> Auto route into copywriter
  const handleSelectTopicForGeneration = (title: string, industry: string) => {
    setSelectedTopicTitle(title);
    setSelectedTopicIndustry(industry);
    setCurrentView(AppView.GENERATION);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#E0E0E0] font-sans flex select-none overflow-hidden">
      
      {/* LEFT STATIC SIDEBAR NAVIGATION */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* RIGHT MAIN VIEW WORKSPACE */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
        
        {/* TOP STATUS CONTROL BAR */}
        <header className="h-16 px-6 md:px-8 border-b border-[#1f1f1f] bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase font-mono">工作台概览 Workspace</h2>
            <div className="h-4 w-px bg-[#262626]"></div>
            <div className="flex items-center gap-2 text-xs text-[#888] font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              8个活跃 Agent 正在为您工作
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-2 text-zinc-500">
              <Sun className="w-3.5 h-3.5 text-brand" />
              <span>系统时间: 2026-06-07 UTC</span>
            </div>

            <button
              id="top-notification-bell"
              className="p-1.5 rounded bg-[#161616] border border-[#262626] text-zinc-400 hover:text-brand cursor-pointer relative"
              title="大盘消息盒"
              onClick={() => alert("系统提示: 您目前已挂载1个对练模拟、2次小红书大盘热点追踪任务。运行极度健康。")}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-brand rounded-full"></span>
            </button>
          </div>
        </header>

        {/* WORKSPACE INNER VIEWS */}
        <main className="flex-1 overflow-y-auto px-6 md:px-8 py-6 pb-20">
          {currentView === AppView.DASHBOARD && (
            <DashboardView
              onNavigate={setCurrentView}
            />
          )}

          {currentView === AppView.RADAR && (
            <RadarView
              onAnalyzeUrl={(url) => {
                setSelectedUrl(url);
                setCurrentView(AppView.DISSECT);
              }}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === AppView.DISSECT && (
            <DissectView
              initialUrl={selectedUrl}
              onSaveToAssets={handleSaveToAssets}
            />
          )}

          {currentView === AppView.TOPICS && (
            <TopicView
              onSelectTopicForGeneration={handleSelectTopicForGeneration}
              onSaveToAssets={handleSaveToAssets}
            />
          )}

          {currentView === AppView.GENERATION && (
            <GenerationView
              initialTitle={selectedTopicTitle}
              initialIndustry={selectedTopicIndustry}
              onSaveToAssets={handleSaveToAssets}
            />
          )}

          {currentView === AppView.REPLIES && (
            <ReplyAgentView
              onSaveToAssets={handleSaveToAssets}
            />
          )}

          {currentView === AppView.DIAGNOSTICS && (
            <DiagnosticsView
              onSaveToAssets={handleSaveToAssets}
            />
          )}

          {currentView === AppView.ASSETS && (
            <AssetLibraryView
              assets={assets}
              onRemoveAsset={handleRemoveAsset}
              onAddAsset={handleAddManualAsset}
            />
          )}

          {currentView === AppView.AGENT_HUB && (
            <AgentHubView />
          )}

          {currentView === AppView.SETTINGS && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}
