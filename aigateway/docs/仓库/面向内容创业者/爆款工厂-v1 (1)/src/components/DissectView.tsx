import React, { useState, useEffect } from "react";
import { AppView, DissectReport } from "../types";
import {
  Sparkles,
  Link,
  Clipboard,
  FileDown,
  Cpu,
  Bookmark,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  Award
} from "lucide-react";

interface DissectViewProps {
  initialUrl: string;
  onSaveToAssets: (title: string, content: string, category: string, type: "copy" | "topic" | "script" | "image" | "preset") => void;
}

export default function DissectView({ initialUrl, onSaveToAssets }: DissectViewProps) {
  const [url, setUrl] = useState(initialUrl || "");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DissectReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Sync initialUrl
  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      triggerDissection(initialUrl);
    }
  }, [initialUrl]);

  const triggerDissection = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/gemini/dissect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error("拆解服务响应失败，请重试");
      }

      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "服务发生网络错误，请在系统设置中核对 API Key 是否就绪。");
    } finally {
      setLoading(false);
    }
  };

  const handleDissectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDissection(url);
  };

  const loadSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    triggerDissection(sampleUrl);
  };

  const handleSaveAsset = () => {
    if (!report) return;
    const bodyStr = `
【原爆款标题】: ${report.title}
【原爆款内容】: ${report.content}

【大图标题拆解】: ${report.analysis.titleStructure}
【黄金前三秒拆解】: ${report.analysis.hookStructure}
【正文信息逻辑拆解】: ${report.analysis.bodyStructure}
【情感心智调配】: ${report.analysis.emotionTriggers}
【评论区诱钩布局】: ${report.analysis.commentTactics}
【全链路漏斗转化】: ${report.analysis.conversionDrivers}
    `;
    onSaveToAssets(report.title, bodyStr, "爆款拆解报告", "copy");
    setSaved(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title block */}
      <div>
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          全链条爆文结构拆解
        </h2>
        <p className="text-xs text-zinc-400">
          粘贴小红书笔记链接，AI 增长专家将立即拆解其标题、钩子、配画、情感驱动、评论诱引和高价值转化链路。
        </p>
      </div>

      {/* Input panel block */}
      <div className="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-800/80">
        <form onSubmit={handleDissectSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="w-4 h-4 text-zinc-500" />
              </span>
              <input
                type="text"
                id="dissect-url-input"
                placeholder="在此粘贴小红书笔记链接或关键词 (例如: https://www.xiaohongshu.com/discovery/item/...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 text-xs border border-zinc-800 text-zinc-200 focus:outline-none focus:border-pink-500 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              id="dissect-submit-btn"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-bold text-white shadow-lg shadow-pink-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4 animate-spin-slow" />
              {loading ? "正在深度拆解系统模型..." : "一键 AI 拆解"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
            <span>推荐推荐样例:</span>
            <button
              type="button"
              id="sample-btn-1"
              onClick={() => loadSample("https://xiaohongshu.com/discovery/item/p1_china_style")}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[10px] text-pink-400 cursor-pointer font-mono"
            >
              #新中式女装起号爆款
            </button>
            <button
              type="button"
              id="sample-btn-2"
              onClick={() => loadSample("https://xiaohongshu.com/discovery/item/p2_lazy_diet")}
              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[10px] text-pink-400 cursor-pointer font-mono"
            >
              #高效减脂代餐风口
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="p-12 rounded-xl bg-[#0c0c0e] border border-zinc-800/80 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
          <div className="text-center space-y-1.5">
            <h4 className="text-sm font-semibold text-zinc-300">正在调用爆款工厂 AI 拆解 Agent</h4>
            <p className="text-xs text-zinc-500 max-w-sm">
              后台正利用 Gemini API 读取模拟页面，深度结构化提取标题层级、黄金前3秒文案逻辑和评论福利链路，请稍候...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-5 rounded-lg bg-rose-950/20 border border-rose-900/40 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-rose-400">服务器或 API 配置错误</h4>
            <p className="text-xs text-rose-300/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {report && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left original post area (4 cols) */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-[#1f1f1f] flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-[#1f1f1f] flex items-center justify-center font-display text-brand font-bold text-xs uppercase">
                    RED
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">爆款分析样本原文</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">XIAOHONGSHU POST PREVIEW</p>
                  </div>
                </div>

                <div className="space-y-3 bg-[#111]/80 border border-[#1f1f1f] p-3.5 rounded-lg">
                  <h3 className="text-xs font-bold font-sans text-brand leading-snug">
                    {report.title}
                  </h3>
                  <div className="text-[11px] text-zinc-400 font-normal leading-relaxed whitespace-pre-wrap font-mono">
                    {report.content}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1f1f1f] text-[10px] text-zinc-500 flex justify-between font-mono">
                <span>监测字数: {report.content?.length} 字</span>
                <span className="text-emerald-500 font-semibold">高点击权重</span>
              </div>
            </div>
          </div>

          {/* Right AI report analysis report (7 cols) */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-4">
            <div className="p-5 rounded-xl bg-[#111] border border-[#1f1f1f] space-y-6">
              {/* Header toolbars */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1f1f1f]">
                <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-xs">
                  <Award className="w-4 h-4 text-brand" />
                  <h4>爆款心智剖析报告 (AI Deep Dissection)</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="save-asset-btn"
                    onClick={handleSaveAsset}
                    disabled={saved}
                    className={`px-3 py-1.5 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                      saved
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                        : "bg-zinc-900 hover:bg-zinc-800 border border-[#1f1f1f] text-zinc-300"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {saved ? "已存入内容资产库" : "存入资产库"}
                  </button>

                  <button
                    id="export-pdf-dissect"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-[#1f1f1f] text-[10px] font-semibold text-zinc-300 flex items-center gap-1 cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    导出 PDF 报告
                  </button>
                </div>
              </div>

              {/* Grid block of 6 structures */}
              <div className="space-y-4">
                {/* Structure 1 */}
                <div className="p-3 bg-zinc-950/60 border border-[#1f1f1f] rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                    <h5>1. 标题结构解析 (Title Structure)</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed pl-3 font-mono">
                    {report.analysis.titleStructure}
                  </p>
                </div>

                {/* Structure 2 */}
                <div className="p-3 bg-zinc-950/60 border border-[#1f1f1f] rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <h5>2. 黄金前3s开头布局 (Hook Structure)</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed pl-3 font-mono">
                    {report.analysis.hookStructure}
                  </p>
                </div>

                {/* Structure 3 */}
                <div className="p-3 bg-zinc-950/60 border border-[#1f1f1f] rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <h5>3. 正文逻辑层级 (Body Pattern)</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed pl-3 font-mono">
                    {report.analysis.bodyStructure}
                  </p>
                </div>

                {/* Structure 4 */}
                <div className="p-3 bg-zinc-950/60 border border-[#1f1f1f] rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <h5>4. 情绪与心智钩子 (Emotion Triggers)</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed pl-3 font-mono">
                    {report.analysis.emotionTriggers}
                  </p>
                </div>

                {/* Structure 5 */}
                <div className="p-3 bg-zinc-950/60 border border-[#1f1f1f] rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <h5>5. 评论区水军引导策略 (Comment Section Guide)</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed pl-3 font-mono">
                    {report.analysis.commentTactics}
                  </p>
                </div>

                {/* Structure 6 */}
                <div className="p-3 bg-zinc-950/60 border border-[#1f1f1f] rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <h5>6. 后置获客转化设计 (Conversion Drivers)</h5>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-normal leading-relaxed pl-3 font-mono">
                    {report.analysis.conversionDrivers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
