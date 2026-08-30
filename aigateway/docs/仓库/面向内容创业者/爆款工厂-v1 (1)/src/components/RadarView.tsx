import React, { useState } from "react";
import { AppView, RadarPost } from "../types";
import {
  Search,
  ThumbsUp,
  FolderHeart,
  MessageSquare,
  Sparkles,
  Calendar,
  X,
  ExternalLink,
  Zap,
  Tag,
  ArrowRight
} from "lucide-react";

interface RadarViewProps {
  onAnalyzeUrl: (url: string) => void;
  onNavigate: (view: AppView) => void;
}

export default function RadarView({ onAnalyzeUrl, onNavigate }: RadarViewProps) {
  const [activeTab, setActiveTab] = useState<"hot" | "viral" | "keywords" | "industries">("hot");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<RadarPost | null>(null);

  // Quick niches
  const quickNiches = ["全部", "减肥", "穿搭", "护肤", "母婴", "AI", "美食", "情感"];
  const [activeNiche, setActiveNiche] = useState("全部");

  // Mock list of Xiaohongshu posts
  const posts: RadarPost[] = [
    {
      id: "p1",
      title: "🔥 救命！这大码女装穿搭绝了！130斤穿出90斤既视感",
      cover: "👚 高饱和新中式显瘦长裙穿搭",
      likes: 18400,
      collects: 14500,
      comments: 680,
      date: "2026-06-06",
      category: "穿搭",
      url: "https://xiaohongshu.com/discovery/item/p1"
    },
    {
      id: "p2",
      title: "😱 别乱刷脂了！一个日本医生私藏的懒人空腹暴汗公式",
      cover: "🥑 极简低热卡燃脂配餐图示",
      likes: 24500,
      collects: 19800,
      comments: 1100,
      date: "2026-06-05",
      category: "减肥",
      url: "https://xiaohongshu.com/discovery/item/p2"
    },
    {
      id: "p3",
      title: "🧪 深度评测：20个热门抗初老面霜，到底谁在收智商税？",
      cover: "🧴 20款热门面霜酸碱及吸收度评测",
      likes: 9800,
      collects: 8400,
      comments: 420,
      date: "2026-06-06",
      category: "护肤",
      url: "https://xiaohongshu.com/discovery/item/p3"
    },
    {
      id: "p4",
      title: "👶 带娃神推！每天5分钟宝宝自主训练进食全步骤",
      cover: "🥣 辅食不锈钢餐盘精美摆盘",
      likes: 12500,
      collects: 11300,
      comments: 390,
      date: "2026-06-04",
      category: "母婴",
      url: "https://xiaohongshu.com/discovery/item/p4"
    },
    {
      id: "p5",
      title: "🤖 听劝！用上这3个免费AI网站，打工人准点摸鱼跑路",
      cover: "💻 效率软件与全屏自动化脚本截图",
      likes: 31200,
      collects: 28400,
      comments: 1840,
      date: "2026-06-06",
      category: "AI",
      url: "https://xiaohongshu.com/discovery/item/p5"
    },
    {
      id: "p6",
      title: "💄 新手3分钟出门妆！消肿眼影画法保姆级教学",
      cover: "👁️ 放大双眼细节眼影晕染图",
      likes: 8500,
      collects: 6900,
      comments: 290,
      date: "2026-06-07",
      category: "护肤",
      url: "https://xiaohongshu.com/discovery/item/p6"
    },
    {
      id: "p7",
      title: "🥗 空气炸锅10分钟搞定低卡照烧鸡腿，嫩到爆汁",
      cover: "🍗 淋满酱料热气腾腾的空气炸锅鸡腿",
      likes: 15400,
      collects: 12900,
      comments: 512,
      date: "2026-06-06",
      category: "美食",
      url: "https://xiaohongshu.com/discovery/item/p7"
    },
    {
      id: "p8",
      title: "💔 关系破冰：高情商沟通术，几句话让对方主动低头",
      cover: "💌 两性温情沟通与书纸速写信封",
      likes: 21900,
      collects: 17200,
      comments: 930,
      date: "2026-06-05",
      category: "情感",
      url: "https://xiaohongshu.com/discovery/item/p8"
    }
  ];

  // Filtering Logic
  const filteredPosts = posts.filter(post => {
    // Niche filter
    if (activeNiche !== "全部" && post.category !== activeNiche) {
      return false;
    }
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDeepDissect = (postUrl: string) => {
    setSelectedPost(null);
    onAnalyzeUrl(postUrl);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Time Filters Box */}
      <div className="p-6 rounded-2xl bg-[#111] border border-[#1f1f1f] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand" />
              爆款雷达 Trending Radar
            </h2>
            <p className="text-xs text-zinc-400">
              全网高流量节点智能探针，实时挖掘高点击、高互动的小红书爆文数据。
            </p>
          </div>

          {/* Timeframe Toggles */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-[#1f1f1f]">
            {(["24h", "7d", "30d"] as const).map((time) => (
              <button
                key={time}
                id={`timeframe-btn-${time}`}
                onClick={() => setSelectedTimeframe(time)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium tracking-wide transition-all ${
                  selectedTimeframe === time
                    ? "bg-brand text-black font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 cursor-pointer"
                }`}
              >
                {time === "24h" ? "24小时" : time === "7d" ? "7天" : "30天"}
              </button>
            ))}
          </div>
        </div>

        {/* Search input and Quick TABS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500" />
            </span>
            <input
              type="text"
              id="radar-search"
              placeholder="搜索爆文关键词，如: '减肥', '穿搭', '护肤', '母婴'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 text-xs border border-[#1f1f1f] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-brand transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {quickNiches.map((niche) => (
              <button
                key={niche}
                id={`niche-${niche}`}
                onClick={() => setActiveNiche(niche)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  activeNiche === niche
                    ? "bg-[#1a1a1a] text-brand border border-brand/30"
                    : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-[#1f1f1f]"
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tabs (Hot List, Keywords, Industries) */}
      <div className="flex items-center gap-1 border-b border-[#1f1f1f] pb-px">
        {[
          { id: "hot", label: "爆击热点榜" },
          { id: "viral", label: "起号爆文榜" },
          { id: "keywords", label: "风口关键词榜" },
          { id: "industries", label: "蓝海行业榜" },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`radar-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-brand text-brand"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            id={`post-card-${post.id}`}
            onClick={() => setSelectedPost(post)}
            className="flex flex-col bg-[#111] border border-[#1f1f1f] hover:border-zinc-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
          >
            {/* Cover Mock Placeholder */}
            <div className="h-44 bg-zinc-950 p-4 relative flex flex-col justify-between border-b border-[#1f1f1f]/40">
              <span className="self-start text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-400 border border-zinc-800/80">
                {post.category}
              </span>
              <div className="text-center p-2 rounded bg-zinc-950/80 border border-zinc-800/40">
                <p className="text-2xl">{post.cover.split(" ")[0]}</p>
                <p className="text-[10px] text-zinc-400 mt-1 truncate">{post.cover.split(" ").slice(1).join(" ")}</p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span className="text-zinc-500">双列流推荐位</span>
              </div>
            </div>

            {/* Post details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <h3 className="text-xs font-bold text-zinc-200 leading-relaxed group-hover:text-brand transition-colors line-clamp-2">
                {post.title}
              </h3>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-900/50">
                <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-brand" />
                    {(post.likes / 1000).toFixed(1)}k
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderHeart className="w-3 h-3 text-amber-500" />
                    {(post.collects / 1000).toFixed(1)}k
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-blue-500" />
                    {post.comments}
                  </span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-brand opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Post Modal Detail */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-[#000]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#111] rounded-xl border border-[#1f1f1f] p-6 space-y-6 shadow-2xl relative animate-zoom-in">
            <button
              id="close-modal-btn"
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-zinc-950 border border-[#1f1f1f] text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                爆款雷达监测 · 起号风口
              </span>
              <h3 className="text-lg font-bold text-white pt-1.5 leading-snug">
                {selectedPost.title}
              </h3>
            </div>

            {/* Cover and Core Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950 border border-[#1f1f1f] rounded-lg p-5 flex flex-col items-center justify-center text-center">
                <span className="text-3xl">{selectedPost.cover.split(" ")[0]}</span>
                <span className="text-xs text-zinc-400 font-medium mt-2">{selectedPost.cover.split(" ").slice(1).join(" ")}</span>
                <span className="text-[9px] text-zinc-500 mt-4 font-mono">ID: {selectedPost.id}</span>
              </div>

              {/* stats box */}
              <div className="space-y-3 bg-[#08080a] border border-[#1f1f1f] rounded-lg p-4 justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 font-mono font-medium uppercase tracking-wider">
                    Core Metrics 核心数据监测
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-zinc-950/60 border border-[#1f1f1f]">
                      <p className="text-[9px] text-zinc-500 font-medium font-sans">获赞量 (Likes)</p>
                      <p className="text-sm font-bold text-white font-display mt-0.5">
                        {selectedPost.likes.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-zinc-950/60 border border-[#1f1f1f]">
                      <p className="text-[9px] text-zinc-500 font-medium font-sans">收藏量 (Collects)</p>
                      <p className="text-sm font-bold text-white font-display mt-0.5">
                        {selectedPost.collects.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-950/80 p-2.5 rounded border border-[#1f1f1f] text-[11px] text-zinc-400 font-mono">
                  <div className="flex justify-between">
                    <span>算法推荐权重</span>
                    <span className="font-mono text-emerald-400">极优 98.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>转评收藏系数</span>
                    <span className="font-mono text-emerald-400">1.2x (超标)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="pt-4 border-t border-[#1f1f1f] flex flex-col sm:flex-row gap-3">
              <button
                id="modal-raw-btn"
                onClick={() => window.open(selectedPost.url, "_blank")}
                className="flex-1 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-[#1f1f1f] text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                访问小红书原文
              </button>

              <button
                id="modal-dissect-btn"
                onClick={() => handleDeepDissect(selectedPost.url)}
                className="flex-1 py-2.5 rounded-lg bg-brand hover:bg-brand-hover text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-brand/10 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                深度一键 AI 拆解
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
