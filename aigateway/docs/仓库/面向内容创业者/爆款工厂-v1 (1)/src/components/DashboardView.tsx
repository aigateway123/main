import React, { useState } from "react";
import { AppView, StatsBlock } from "../types";
import {
  Flame,
  ArrowUpRight,
  TrendingUp,
  FileText,
  UserCheck,
  Award,
  Hash,
  Sparkles,
  ArrowRight,
  PenTool,
  Zap,
  Globe,
  Share2
} from "lucide-react";

interface DashboardViewProps {
  onNavigate: (view: AppView) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [selectedQuickGenre, setSelectedQuickGenre] = useState("穿搭");

  // Mock data for Stats Units
  const stats: StatsBlock[] = [
    { title: "今日全网热点数", value: "3,842", change: "+14.8%", isPositive: true, icon: "Flame" },
    { title: "今日新增起号爆文", value: "1,248", change: "+8.3%", isPositive: true, icon: "Award" },
    { title: "已生成AI增长内容", value: "852 篇", change: "+24.5%", isPositive: true, icon: "FileText" },
    { title: "矩阵账号粉丝预估增长", value: "24.5 K", change: "+18.2%", isPositive: true, icon: "TrendingUp" },
  ];

  // Popular Industries Mock Data
  const hotIndustries = [
    { rank: 1, name: "时尚穿搭", heat: 98, trend: "up", keyword: "新中式 / 废土风 / 复古辣妹" },
    { rank: 2, name: "美妆护肤", heat: 92, trend: "up", keyword: "精简护肤 / 早C晚A / 以油养肤" },
    { rank: 3, name: "减肥健身", heat: 87, trend: "up", keyword: "暴汗低卡 / 空腹有氧 / 代餐测评" },
    { rank: 4, name: "母婴育儿", heat: 79, trend: "flat", keyword: "沉浸式带娃 / 辅食教程 / 科学育儿" },
    { rank: 5, name: "AI科技体验", heat: 74, trend: "up", keyword: "AI绘图 / 提效神器 / 智能家居" },
  ];

  // Hot Keywords Mock Data
  const hotKeywords = [
    { name: "新中式穿搭", volume: "125W+", tag: "穿搭", level: "🔥 极高" },
    { name: "减脂代餐", volume: "95W+", tag: "减肥", level: "🔥 极高" },
    { name: "抗老精华测评", volume: "84W+", tag: "护肤", level: "高" },
    { name: "自媒体涨粉公式", volume: "72W+", tag: "AI/干货", level: "高" },
    { name: "科学高效带娃", volume: "61W+", tag: "母婴", level: "中" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#121217] border border-[#1f1f1f] shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-brand/10 text-brand px-2.5 py-1 rounded-full border border-brand/20">
              SaaS DASHBOARD V1.0
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-zinc-400 font-mono">2026-06-07 08:05:23 UTC</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            爆款增长控制台 <span className="text-brand">⚙️</span>
          </h2>
          <p className="text-sm text-zinc-400">
            欢迎回来，陈立明。今日全网流量大盘数据已就绪，已为您锁定 5 个潜在起号风口。
          </p>
        </div>

        {/* Quick actions box */}
        <div className="flex items-center gap-3">
          <button
            id="quick-action-dissect"
            onClick={() => onNavigate(AppView.DISSECT)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-[#1f1f1f] text-zinc-100 text-xs font-semibold cursor-pointer transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            快速拆爆文
          </button>
          <button
            id="quick-action-generate"
            onClick={() => onNavigate(AppView.GENERATION)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-black text-xs font-bold shadow-lg shadow-brand/10 cursor-pointer transition-all duration-200"
          >
            <PenTool className="w-3.5 h-3.5" />
            一键写内容
          </button>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-[#111111] border border-[#1f1f1f] hover:border-zinc-700/80 transition-all duration-300 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition-all duration-300"></div>
            <div className="flex justify-between items-start">
              <span className="text-xs text-zinc-400 font-medium">{item.title}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded font-mono font-semibold">
                {item.change}
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-display font-extrabold text-white tracking-tight">
                {item.value}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500">
              <div className="w-5 h-5 rounded bg-zinc-900 border border-[#1f1f1f] flex items-center justify-center">
                {item.icon === "Flame" && <Flame className="w-3 h-3 text-brand" />}
                {item.icon === "Award" && <Award className="w-3 h-3 text-amber-400" />}
                {item.icon === "FileText" && <FileText className="w-3 h-3 text-blue-400" />}
                {item.icon === "TrendingUp" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
              </div>
              <span className="font-mono">相比昨日均值持续跑赢</span>
            </div>
          </div>
        ))}
      </div>

      {/* SVG Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area 1: 热点指数 & 爆文成长趋势 (Double charts) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#111111] border border-[#1f1f1f] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">流量盘整：全网爆文增长趋势</h3>
              <p className="text-xs text-zinc-500">过去 7 天内热点起号爆文数与流量大盘水位</p>
            </div>
            <div className="flex items-center gap-2 bg-[#080808] px-2 py-1 rounded border border-[#1f1f1f] text-[10px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand"></span>爆文数量</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>大盘热点指数</span>
            </div>
          </div>

          {/* Dual Interactive custom visual chart SVG */}
          <div className="h-56 w-full bg-[#080808] rounded-lg border border-[#1f1f1f] p-2 relative flex flex-col justify-between overflow-hidden">
            {/* Y Axes lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-b border-[#1f1f1f]/60"></div>
              ))}
            </div>

            {/* Custom SVG Drawing */}
            <svg className="w-full h-full absolute inset-0 text-zinc-700" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Blue Area - Trend Indicator */}
              <path
                d="M 0 160 Q 80 130 160 140 T 320 80 T 420 50 T 500 40 L 500 200 L 0 200 Z"
                fill="url(#gradient-blue)"
                opacity="0.15"
              />
              <path
                d="M 0 160 Q 80 130 160 140 T 320 80 T 420 50 T 500 40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Pink Area - Explosive content multiplier */}
              <path
                d="M 0 180 C 100 160, 150 70, 250 90 C 350 110, 400 30, 500 15 L 500 200 L 0 200 Z"
                fill="url(#gradient-brand)"
                opacity="0.25"
              />
              <path
                d="M 0 180 C 100 160, 150 70, 250 90 C 350 110, 400 30, 500 15"
                fill="none"
                stroke="#F27D26"
                strokeWidth="3.5"
              />

              {/* Glowing anchor dots */}
              <circle cx="250" cy="90" r="5" fill="#F27D26" stroke="#fff" strokeWidth="1.5" />
              <circle cx="500" cy="15" r="5" fill="#F27D26" stroke="#fff" strokeWidth="1.5" />

              {/* Definitions */}
              <defs>
                <linearGradient id="gradient-brand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F27D26" />
                  <stop offset="100%" stopColor="#F27D26" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Float HUD tips */}
            <div className="absolute top-10 left-[45%] bg-[#0f0f13] border border-[#1f1f1f] px-2 py-1 rounded text-[10px] space-y-0.5">
              <p className="text-zinc-500">6月4日 节点风口</p>
              <p className="font-semibold text-white">爆文释放: +224 篇</p>
            </div>

            {/* X Labels */}
            <div className="mt-auto flex justify-between text-[10px] text-zinc-500 font-mono px-2 pt-1 z-10">
              <span>06-01</span>
              <span>06-02</span>
              <span>06-03</span>
              <span>06-04 (爆点)</span>
              <span>06-05</span>
              <span>06-06</span>
              <span>今日 (06-07)</span>
            </div>
          </div>
        </div>

        {/* Trend Area 2: AI内容产出统计图 */}
        <div className="p-5 rounded-xl bg-[#111111] border border-[#1f1f1f] flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">生成中心产出效率 (按类别)</h3>
            <p className="text-xs text-zinc-500">本阶段各类AI创意内容的生产转化总量</p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-3.5">
            {/* Custom beautiful vertical progress stats */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-zinc-400">小红书图文文案</span>
                <span className="text-zinc-200 font-semibold">412 篇 (48.3%)</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden">
                <div className="h-full bg-brand rounded" style={{ width: "48.3%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-zinc-400">短视频脚本分镜</span>
                <span className="text-zinc-200 font-semibold">224 篇 (26.2%)</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden">
                <div className="h-full bg-violet-500 rounded" style={{ width: "26.2%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-zinc-400">评论区引流成交话术</span>
                <span className="text-zinc-200 font-semibold">134 套 (15.7%)</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded" style={{ width: "15.7%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-zinc-400">爆款大纲/爆文拆解报告</span>
                <span className="text-zinc-200 font-semibold font-bold">82 份 (9.8%)</span>
              </div>
              <div className="w-full h-2 rounded bg-zinc-900 overflow-hidden">
                <div className="h-full bg-amber-500 rounded" style={{ width: "9.8%" }}></div>
              </div>
            </div>
          </div>

          {/* Quick link button to writing station */}
          <button
            id="go-to-generation-btn"
            onClick={() => onNavigate(AppView.GENERATION)}
            className="w-full text-center py-2 rounded-lg bg-[#161616] border border-[#262626] text-xs font-medium text-brand hover:text-white hover:bg-zinc-900 transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>进入内容生成中心</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Keywords and Industry Rank Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List 1: 热门行业排行 */}
        <div className="p-5 rounded-xl bg-[#111] border border-[#1f1f1f] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5 Siegfried">
              <Globe className="w-4 h-4 text-emerald-400" />
              热门增长行业排行 (24h 追踪)
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">热度源自Xiaohongshu API</span>
          </div>

          <div className="space-y-2">
            {hotIndustries.map((ind, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#080808] border border-[#1f1f1f] hover:border-zinc-800 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 h-6 rounded-md bg-zinc-900 border border-[#1f1f1f] text-xs font-mono font-bold flex items-center justify-center text-zinc-400">
                    {ind.rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">{ind.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{ind.keyword}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-brand justify-end">
                    <Zap className="w-3 h-3" />
                    <span>{ind.heat}% 热度值</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded font-mono">
                    起号阻力极小
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List 2: 热门关键词排行 */}
        <div className="p-5 rounded-xl bg-[#111] border border-[#1f1f1f] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-brand" />
              热门风口关键词 (高推荐权重)
            </h3>
            <button
              id="go-to-radar-btn"
              onClick={() => onNavigate(AppView.RADAR)}
              className="text-xs text-brand hover:text-brand-hover font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>爆款雷达</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#1f1f1f]">
            {hotKeywords.map((kw, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-200">{kw.name}</span>
                    <span className="text-[9px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-[#1f1f1f]">
                      {kw.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1">
                    全网周浏览量: <span className="text-zinc-300 font-medium">{kw.volume}</span>
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[11px] font-mono text-brand font-semibold">{kw.level}竞争度</span>
                  <p className="text-[9px] text-zinc-500">点击率预估 11.4%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
