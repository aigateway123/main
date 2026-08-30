import React, { useState } from "react";
import { AppView, TopicIdea } from "../types";
import {
  Lightbulb,
  Search,
  Zap,
  Bookmark,
  Copy,
  PenTool,
  Cpu,
  ArrowRight,
  TrendingDown,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface TopicViewProps {
  onSelectTopicForGeneration: (title: string, industry: string) => void;
  onSaveToAssets: (title: string, content: string, category: string, type: "copy" | "topic" | "script" | "image" | "preset") => void;
}

export default function TopicView({ onSelectTopicForGeneration, onSaveToAssets }: TopicViewProps) {
  const [industry, setIndustry] = useState("美妆护肤");
  const [keyword, setKeyword] = useState("抗衰密集修护");
  const [targetAudience, setTargetAudience] = useState("25+熬夜打工党");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<TopicIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !keyword || !targetAudience) return;
    setLoading(true);
    setError(null);
    setCopiedIndex(null);

    try {
      const response = await fetch("/api/gemini/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, keyword, targetAudience }),
      });

      if (!response.ok) {
        throw new Error("选题生成失败，请稍后重试");
      }

      const data = await response.json();
      setTopics(data.topics || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "无法拉取选题大纲，请核实系统设置的 API 密钥及云连接状态。");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (topic: TopicIdea, idx: number) => {
    const textToCopy = `【爆款选题】: ${topic.title}\n【切入角度】: ${topic.angle}\n【黄金开头句】: ${topic.hook}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleFavorite = (topic: TopicIdea, idx: number) => {
    const isFav = !!favorites[idx];
    setFavorites(prev => ({ ...prev, [idx]: !isFav }));
    
    if (!isFav) {
      onSaveToAssets(
        topic.title,
        `【选题角度】: ${topic.angle}\n【黄金痛点开头】: ${topic.hook}\n【爆款指数】: ${topic.explosiveIndex}%\n【竞争难度】: ${topic.competitionRate}%`,
        industry,
        "topic"
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-pink-500" />
          AI 选题智造工厂
        </h2>
        <p className="text-xs text-zinc-400">
          基于全网热点算法大盘，为您的特定受众一键快速挖掘 100+ 起号级爆款选题切入点与钩子开头。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT PARAMS PARAMETERS BLOCK (1 col) */}
        <div className="lg:col-span-1 p-5 rounded-xl bg-[#0c0c0e] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs pb-3 border-b border-zinc-900">
            <span className="p-1 rounded bg-pink-500/10 text-pink-400">01</span>
            <h4>爆款参数设定 (Target Settings)</h4>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="topic-industry" className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                选择行业/大类
              </label>
              <input
                type="text"
                id="topic-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-zinc-200 focus:outline-none focus:ring-0 font-sans"
                placeholder="例如: 美妆护肤, 穿搭, 搞钱, 母婴..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="topic-keyword" className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                核心爆点关键词
              </label>
              <input
                type="text"
                id="topic-keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-zinc-200 focus:outline-none focus:ring-0 font-sans"
                placeholder="例如: 精简护肤, 早C晚A, 大码显瘦..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="topic-audience" className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                精准定位客群
              </label>
              <input
                type="text"
                id="topic-audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-zinc-200 focus:outline-none focus:ring-0 font-sans"
                placeholder="例如: 25岁熬夜打工白领, 考研党..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="topics-generate-btn"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-bold text-white shadow-lg shadow-pink-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              {loading ? "算法演练生成中..." : "开始批量生产选题"}
            </button>
          </form>
        </div>

        {/* RIGHT TOPIC RESULTS LIST (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="p-16 bg-[#0c0c0e] border border-zinc-800/80 rounded-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
              <p className="text-xs text-zinc-400 font-mono">
                正在深度扫描 [{industry}] 赛道下含有 [{keyword}] 契合 [{targetAudience}] 的流量池数据...
              </p>
            </div>
          )}

          {error && (
            <div className="p-5 rounded-lg bg-rose-950/20 border border-rose-900/40 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-rose-400">生成阻断</h4>
                <p className="text-xs text-rose-300/80 mt-1 font-mono">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && topics.length === 0 && (
            <div className="p-16 bg-[#0c0c0e] border border-zinc-900 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 mx-auto">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-300">尚未激活选题大纲</h4>
                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                  请在左侧侧边栏设置匹配您业务线的关键词及定位圈层，开始驱动爆款因子引擎算法。
                </p>
              </div>
            </div>
          )}

          {!loading && !error && topics.length > 0 && (
            <div className="space-y-4">
              {/* Stats notification banner */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>成功筛选到 5 组特等优质高转化选题切入点</span>
                </div>
                <span className="text-[10px] bg-emerald-900/50 px-2 py-0.5 rounded font-mono">
                  高推荐潜力
                </span>
              </div>

              {/* Topics stack */}
              <div className="space-y-3">
                {topics.map((topic, idx) => {
                  const isFav = !!favorites[idx];
                  return (
                    <div
                      key={idx}
                      id={`topic-item-${idx}`}
                      className="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-900 hover:border-zinc-800 transition-all space-y-4 group relative overflow-hidden"
                    >
                      {/* Top indices */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900/60">
                        <h3 className="text-xs font-bold text-zinc-100 group-hover:text-pink-400 transition-colors leading-relaxed">
                          {topic.title}
                        </h3>

                        {/* Floating visual indicators */}
                        <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
                          <span className="flex items-center gap-1 text-pink-400 font-semibold bg-pink-950/30 px-1.5 py-0.5 rounded border border-pink-900/25">
                            <Zap className="w-3 h-3 text-pink-500" />
                            爆款值: {topic.explosiveIndex}%
                          </span>
                          <span className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/25 px-1.5 py-0.5 rounded font-semibold">
                            竞争: {topic.competitionRate}%
                          </span>
                          <span className="bg-blue-950/30 text-blue-400 border border-blue-900/25 px-1.5 py-0.5 rounded font-semibold">
                            转化星级: {topic.conversionPotential}%
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-[11px] text-zinc-400 leading-normal">
                        <div className="md:col-span-6 space-y-1">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">切入核心痛点/叙事视角:</p>
                          <p className="bg-zinc-950/50 p-2.5 rounded border border-zinc-900 font-mono text-zinc-300">
                            {topic.angle}
                          </p>
                        </div>
                        <div className="md:col-span-6 space-y-1">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">黄金前3秒文案示范:</p>
                          <p className="bg-zinc-950/50 p-2.5 rounded border border-zinc-900 font-mono text-pink-300/95 italic">
                            “{topic.hook}”
                          </p>
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex justify-end items-center gap-2 pt-1 border-t border-zinc-900/40">
                        <button
                          id={`topic-fav-${idx}`}
                          onClick={() => toggleFavorite(topic, idx)}
                          className={`p-2 rounded hover:bg-zinc-800/60 border text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            isFav
                              ? "bg-zinc-900 border-pink-500/50 text-pink-400"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{isFav ? "已收藏" : "加入收藏"}</span>
                        </button>

                        <button
                          id={`topic-copy-${idx}`}
                          onClick={() => handleCopy(topic, idx)}
                          className="px-3 py-2 rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedIndex === idx ? "复制成功!" : "复制选题"}</span>
                        </button>

                        <button
                          id={`topic-gen-route-${idx}`}
                          onClick={() => onSelectTopicForGeneration(topic.title, industry)}
                          className="px-3.5 py-2 rounded bg-[#18181b] hover:bg-[#202025] text-zinc-100 border border-zinc-800 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <PenTool className="w-3.5 h-3.5 text-pink-500" />
                          <span>一键生成推文</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
