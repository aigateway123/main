import React, { useState } from "react";
import { AppView, DiagnosticsResult } from "../types";
import {
  TrendingUp,
  Sliders,
  Cpu,
  Bookmark,
  Share2,
  Activity,
  Award,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Gauge,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface DiagnosticsViewProps {
  onSaveToAssets: (title: string, content: string, category: string, type: "copy" | "topic" | "script" | "image" | "preset") => void;
}

export default function DiagnosticsView({ onSaveToAssets }: DiagnosticsViewProps) {
  // Input Stats state
  const [views, setViews] = useState(62000);
  const [clicks, setClicks] = useState(2500);
  const [interactions, setInteractions] = useState(210);
  const [conversions, setConversions] = useState(15);
  const [notes, setNotes] = useState("这是一个关于小红书新起时尚穿搭类别的新账号。目前发了3篇图文笔记。感觉曝光量还可以，但是点击率和私信转化似乎特别卡顿，急需专业诊断建议！");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stats: { views, clicks, interactions, conversions },
          notes
        }),
      });

      if (!response.ok) {
        throw new Error("诊断服务暂时不可达，请在设置中校对 API 秘钥是否连接畅通");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "未知错误。请核对系统设置连接。");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = () => {
    if (!result) return;
    const bodyText = `
【账号诊断周期】: 2026-06-07 诊断大报告
【输入数据】: 曝光总量: ${views} | 展示点击数: ${clicks} | 用户互动量: ${interactions} | 后置成交: ${conversions}

--- 【算法率值换算】 ---
展示点击率 (CTR): ${result.metrics.ctr}% (正常应该在 8%-12% 之间)
内容互动率 (Engagement): ${result.metrics.engagementRate}% (正常在 8% 之间)
转化漏斗私信率: ${result.metrics.conversionRate}%

--- 【总评评估报告】 ---
${result.evaluation}

--- 【排阻致命缺陷】 ---
${result.issues.map((i, idx) => `致命阻碍${idx+1}. ${i}`).join("\n")}

--- 【优化改善实战策略】 ---
${result.suggestions.map((s, idx) => `调优指教${idx+1}. ${s}`).join("\n")}

--- 【十五天精细涨粉周密排程】 ---
${result.growthPlan.map((p, idx) => `阶段 ${p.phase} -> 实操方法: ${p.action}`).join("\n")}
    `;
    onSaveToAssets("【AI 账号体检总报告】时尚穿搭大组", bodyText, "行业诊断报告", "preset");
    setSaved(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pink-500" />
          全息数位数据诊断中心
        </h2>
        <p className="text-xs text-zinc-400">
          智能录入或一键导入 Xiaohongshu 创作者后台大盘参数。AI 将自动计算折损率、CTR 指标，诊断当前账号权重健康度，输出调优步骤。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PARAMS BLOCK (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0c0c0e] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs pb-3 border-b border-zinc-900">
            <Sliders className="w-4 h-4 text-pink-500" />
            <h4>录入创作者数据漏斗</h4>
          </div>

          <form onSubmit={handleDiagnose} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 flex flex-col justify-between">
                <label htmlFor="diag-views" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">曝光总量 (Views)</label>
                <input
                  type="number"
                  id="diag-views"
                  value={views}
                  onChange={(e) => setViews(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-between">
                <label htmlFor="diag-clicks" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">展示点击数 (Clicks)</label>
                <input
                  type="number"
                  id="diag-clicks"
                  value={clicks}
                  onChange={(e) => setClicks(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 flex flex-col justify-between">
                <label htmlFor="diag-ints" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">用户互动量 (Likes+Collects)</label>
                <input
                  type="number"
                  id="diag-ints"
                   value={interactions}
                  onChange={(e) => setInteractions(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-between">
                <label htmlFor="diag-convs" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">后置成交/求私信量</label>
                <input
                  type="number"
                  id="diag-convs"
                  value={conversions}
                  onChange={(e) => setConversions(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="diag-notes" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">矩阵运营备注或运营卡点</label>
              <textarea
                id="diag-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-normal"
                placeholder="在此描述目前遭遇的细化痛点..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="diagnose-submit-btn"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-bold text-white shadow-lg shadow-pink-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              {loading ? "体检诊断大盘算力调拨中..." : "启动 AI 数据全科体检"}
            </button>
          </form>
        </div>

        {/* RIGHT DISPLAY VIEW (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {loading && (
            <div className="p-20 bg-[#0c0c0e] border border-zinc-800/80 rounded-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
              <p className="text-xs text-zinc-400 font-mono">
                深度数据审计中：AI 诊断 Agent 正在换算 CTR% 与互动转置率，整合小红书最新大盘分界系数推荐模型...
              </p>
            </div>
          )}

          {error && (
            <div className="p-5 rounded-lg bg-rose-950/20 border border-rose-900/40 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-rose-400">诊断中断</h4>
                <p className="text-xs text-rose-300/80 mt-1 font-mono">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="p-20 bg-[#0c0c0e] border border-zinc-900 rounded-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 mx-auto">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-300 font-display">大盘分析舱待命</h4>
                <p className="text-[11px] text-zinc-500 font-sans max-w-sm mx-auto">
                  录入创作者数据并点击【启动 AI 诊断】，AI 专家将立即拆卸流量全链路卡脖阻碍，生成针对性改善方案。
                </p>
              </div>
            </div>
          )}

          {/* DIAGNOSED RESULTS PORTAL */}
          {!loading && !error && result && (
            <div className="space-y-5 animate-fade-in">
              {/* Metrics visual widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. CTR Rate metric gauge style */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">笔记展示点击率 (CTR)</span>
                    <span className="text-[9px] bg-pink-950/30 text-pink-400 px-1.5 py-0.5 rounded border border-pink-900/30 font-mono">
                      {result.metrics.ctr >= 8 ? "健康" : "偏低"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold font-display text-white tracking-tight">
                      {result.metrics.ctr}%
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">/行业均8%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${result.metrics.ctr >= 8 ? "bg-emerald-500" : "bg-pink-500"}`}
                      style={{ width: `${Math.min(result.metrics.ctr * 8, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* 2. Engagement click index metric */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">点击后互动率 (ENGAGE)</span>
                    <span className="text-[9px] bg-violet-950/30 text-violet-400 px-1.5 py-0.5 rounded border border-violet-900/30 font-mono">
                      {result.metrics.engagementRate >= 7 ? "极佳" : "常规"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold font-display text-white tracking-tight">
                      {result.metrics.engagementRate}%
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">/均值8%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${Math.min(result.metrics.engagementRate * 8, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* 3. Conversion action metric */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">私信获取率 (CONV)</span>
                    <span className="text-[9px] bg-blue-950/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-900/30 font-mono">
                      {result.metrics.conversionRate >= 1.5 ? "优良" : "干涸"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold font-display text-white tracking-tight">
                      {result.metrics.conversionRate}%
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">/均值2%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${Math.min(result.metrics.conversionRate * 12, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Comprehensive report review text sheet */}
              <div className="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-800/80 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                    <Award className="w-4 h-4 text-pink-500" />
                    <span>AI 数据审计分析总评</span>
                  </div>

                  <button
                    id="save-diag-report-btn"
                    onClick={handleSaveReport}
                    disabled={saved}
                    className={`px-3 py-1.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      saved
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                        : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {saved ? "体检报告已归档" : "一键保存到归档资产"}
                  </button>
                </div>

                <div className="text-xs text-zinc-300 leading-relaxed font-sans font-normal whitespace-pre-wrap">
                  {result.evaluation}
                </div>

                {/* Key Blockers / issues */}
                <div className="space-y-2 pt-3 border-t border-zinc-900/60">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-pink-500" />
                    致命算法降权/阻卡卡点:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {result.issues.map((issue, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-900 space-y-1">
                        <span className="text-[9px] font-mono text-pink-400 font-bold">排阻缺陷.{idx+1}</span>
                        <p className="text-[11px] text-zinc-300 leading-snug font-sans">{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Suggestions */}
                <div className="space-y-2 pt-3 border-t border-zinc-900/60">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    精修实操性改善策略:
                  </span>
                  <div className="space-y-2 pt-1 font-mono text-[11px]">
                    {result.suggestions.map((sug, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-zinc-950 border border-zinc-900 text-zinc-300">
                        <span className="text-[10px] font-bold text-emerald-400 mr-2">调优措施 {idx+1}:</span>
                        {sug}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 15 Days Actionable Roadmap */}
                <div className="space-y-2 pt-4 border-t border-zinc-900/60">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-blue-400" />
                    周密起号涨粉增长规划:
                  </span>
                  <div className="divide-y divide-zinc-900 font-mono text-[11px]">
                    {result.growthPlan.map((plan, idx) => (
                      <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                        <span className="text-zinc-200 font-extrabold shrink-0 sm:w-32 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[10px] text-center inline-block">
                          {plan.phase}
                        </span>
                        <span className="text-zinc-400 leading-relaxed">{plan.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
