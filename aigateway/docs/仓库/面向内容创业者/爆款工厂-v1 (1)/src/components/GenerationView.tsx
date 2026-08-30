import React, { useState, useEffect } from "react";
import { AppView, GeneratedContent } from "../types";
import {
  PenTool,
  Cpu,
  ChevronRight,
  ChevronLeft,
  Copy,
  Sparkles,
  Save,
  MessageSquare,
  BookOpen,
  Image,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface GenerationViewProps {
  initialTitle: string;
  initialIndustry: string;
  onSaveToAssets: (title: string, content: string, category: string, type: "copy" | "topic" | "script" | "image" | "preset") => void;
}

export default function GenerationView({ initialTitle, initialIndustry, onSaveToAssets }: GenerationViewProps) {
  const [contentType, setContentType] = useState<"copy" | "script" | "cover" | "comments">("copy");
  const [industry, setIndustry] = useState(initialIndustry || "时尚美妆");
  const [product, setProduct] = useState(initialTitle || "爆汁玻尿酸口红，涂上极度显白提气色");
  const [style, setStyle] = useState("专业测评、闺蜜倾诉");
  const [length, setLength] = useState(400);
  const [channel, setChannel] = useState("小红书");

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Conversational refine input
  const [refineQuery, setRefineQuery] = useState("");
  const [refining, setRefining] = useState(false);

  // Toggle state of Right Reference drawer
  const [isReferenceOpen, setIsReferenceOpen] = useState(true);

  // Status logs
  const [copiedText, setCopiedText] = useState(false);
  const [copiedTitleIdx, setCopiedTitleIdx] = useState<number | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // Sync route values
  useEffect(() => {
    if (initialTitle) {
      setProduct(initialTitle);
    }
    if (initialIndustry) {
      setIndustry(initialIndustry);
    }
  }, [initialTitle, initialIndustry]);

  const handleCreateContent = async () => {
    setLoading(true);
    setError(null);
    setDraftSaved(false);

    try {
      const response = await fetch("/api/gemini/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry,
          product,
          style,
          length,
          channel,
          contentType
        }),
      });

      if (!response.ok) {
        throw new Error("文案生成失败，请重试");
      }

      const data = await response.json();
      setContent(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "请求服务器文案路由失败，请检查 API 秘钥及网络连通性。");
    } finally {
      setLoading(false);
    }
  };

  const handleRefineContent = async () => {
    if (!refineQuery.trim() || !content) return;
    setRefining(true);
    setError(null);

    try {
      const prompt = `
您是一位顶尖文案优化师。请根据用户优化指令: "${refineQuery}" 修改之前生成的文案。
之前生成的文案内容:
标题选项: ${content.titleOptions.join(" | ")}
正文: ${content.bodyText}
当前行业: ${industry}

请对内容进行修剪和加润。确保输出符合之前的数据规范 JSON schema（包含 titleOptions, bodyText, tags, coverText, suggestedImages 属性）。
`;
      
      const response = await fetch("/api/gemini/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry,
          product: prompt,
          style,
          length,
          channel,
          contentType: "refined"
        }),
      });

      if (!response.ok) {
        throw new Error("文案优化迭代失败");
      }

      const data = await response.json();
      setContent(data);
      setRefineQuery("");
    } catch (err: any) {
      console.error(err);
      setError("AI 迭代时发生错误: " + (err.message || "请稍后再试"));
    } finally {
      setRefining(false);
    }
  };

  const handleCopyBody = () => {
    if (!content) return;
    const shareText = `${content.titleOptions[0]}\n\n${content.bodyText}\n\n${content.tags.join(" ")}`;
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyTitle = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTitleIdx(idx);
    setTimeout(() => setCopiedTitleIdx(null), 2000);
  };

  const handleSaveDraft = () => {
    if (!content) return;
    onSaveToAssets(
      content.titleOptions[0] || product,
      content.bodyText,
      industry,
      contentType
    );
    setDraftSaved(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab select for generating modules */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <PenTool className="w-5 h-5 text-pink-500" />
            AI 内容生成控制台
          </h2>
          <p className="text-xs text-zinc-400">
            内置小红书高流量爆款文体微调模型，支持一键将选题延展为高转化图文、镜头脚本、高拉粉评论和优质封面文案。
          </p>
        </div>

        {/* Categories togglers */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-900 shrink-0">
          {[
            { id: "copy", label: "爆图文文案" },
            { id: "script", label: "视频脚本分镜" },
            { id: "cover", label: "封面文案设计" },
            { id: "comments", label: "高热回复话术" },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`content-tab-${tab.id}`}
              onClick={() => {
                setContentType(tab.id as any);
                setContent(null);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                contentType === tab.id
                  ? "bg-pink-500 text-white shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout (split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative">
        {/* LEFT PARAMS AREA (3 cols) */}
        <div className="lg:col-span-3 p-5 rounded-xl bg-[#0c0c0e] border border-zinc-800/80 space-y-5">
          <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs pb-3 border-b border-zinc-900">
            <Sliders className="w-4 h-4 text-pink-500" />
            <h4>文图多维微调参数</h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="gen-industry" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">首选赛道分类</label>
              <input
                type="text"
                id="gen-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-zinc-300 focus:outline-none focus:ring-0 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="gen-product" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">选题或核心诉求 (可精简填空)</label>
              <textarea
                id="gen-product"
                rows={3}
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-zinc-300 focus:outline-none focus:ring-0 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="gen-style" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">创作语言与笔触基调</label>
              <input
                type="text"
                id="gen-style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-zinc-300 focus:outline-none focus:ring-0 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="gen-length" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">预估文案总体字数 ({length} 字)</label>
              <input
                type="range"
                id="gen-length"
                min={100}
                max={1500}
                step={50}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-pink-500 bg-zinc-950 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              onClick={handleCreateContent}
              disabled={loading}
              id="gen-perform-btn"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-bold text-white shadow-lg shadow-pink-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              {loading ? "正在部署模型算力生成中..." : "一键部署生成内容"}
            </button>
          </div>
        </div>

        {/* MIDDLE RESULTS AREA CONTAINER (6 - 9 cols depending on reference state) */}
        <div className={`transition-all duration-300 ${isReferenceOpen ? "lg:col-span-6" : "lg:col-span-9"} space-y-4`}>
          {loading && (
            <div className="p-20 rounded-xl bg-[#0c0c0e] border border-zinc-800/80 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
              <p className="text-xs text-zinc-400 font-mono">
                AI 创写 Agent 正尝试提取 [{style}] 情感基调及 {length} 字规格进行整篇智能起大纲，建立吸引高互动的配画指示...
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

          {!loading && !error && !content && (
            <div className="p-20 rounded-xl bg-[#0c0c0e] border border-zinc-900 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 mx-auto">
                <PenTool className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-300 font-display">创作工位空置中</h4>
                <p className="text-[11px] text-zinc-500 font-sans max-w-sm mx-auto">
                  调整左侧特定题材与口吻大纲后，点击【一键部署生成内容】按钮，AI 将迅速回传符合高概率点击结构的内容包。
                </p>
              </div>
            </div>
          )}

          {/* Generated results details display */}
          {!loading && !error && content && (
            <div className="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-800/80 space-y-6">
              {/* Top toolbar */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-1.5 text-xs text-zinc-200 font-bold">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>AI 自动撰写成果推荐</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="gen-save-draft"
                    onClick={handleSaveDraft}
                    disabled={draftSaved}
                    className={`px-3 py-1.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      draftSaved
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                        : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {draftSaved ? "已保存作为草稿" : "保存草稿"}
                  </button>

                  <button
                    id="gen-copy-body"
                    onClick={handleCopyBody}
                    className="px-3 py-1.5 rounded bg-pink-500 hover:bg-pink-600 text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedText ? "正文已完整复制" : "复制全部(含标签)"}
                  </button>
                </div>
              </div>

              {/* Title Options Toggles */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  推荐高效吸睛标题选项:
                </span>
                <div className="space-y-1.5">
                  {content.titleOptions.map((title, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-800 flex items-center justify-between transition-all"
                    >
                      <span className="text-xs font-bold text-zinc-200 line-clamp-1">{title}</span>
                      <button
                        id={`copy-title-btn-${idx}`}
                        onClick={() => handleCopyTitle(title, idx)}
                        className="p-1 px-2.5 rounded bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 text-[10px] text-zinc-400 cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedTitleIdx === idx ? "已复制" : "复制"}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Body Text Box */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  正文推文文案 (支持 Markdown 与小红书双排版):
                </span>
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-90 w-full font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-text max-h-96 overflow-y-auto">
                  {content.bodyText}
                </div>
              </div>

              {/* Tags panel */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {content.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[10px] font-mono font-medium rounded bg-[#18181b] border border-zinc-800 text-pink-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Extra visual metadata details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
                <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900 space-y-1.5">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                    视觉封面 Overlay 文字排版建议:
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                    {content.coverText}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900 space-y-1.5">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                    AI 场景画面摄影指示:
                  </span>
                  <div className="space-y-1 list-decimal pl-2 text-xs text-zinc-400 font-mono">
                    {content.suggestedImages.map((img, idx) => (
                      <p key={idx} className="line-clamp-2">{idx + 1}. {img}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conversational bottom refine box */}
              <div className="pt-4 border-t border-zinc-900 space-y-2.5">
                <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400">
                  <RefreshCw className="w-3.5 h-3.5 text-pink-500" />
                  <span>对内容不满意？输入指令让 AI 局部迭代或改润</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    id="refine-query-input"
                    value={refineQuery}
                    onChange={(e) => setRefineQuery(e.target.value)}
                    placeholder="例如: '让语气更傲娇一点', '开头加上一个明显的痛点悬念', '缩短正文到300字'..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500 font-mono"
                  />
                  <button
                    onClick={handleRefineContent}
                    disabled={refining || !refineQuery.trim()}
                    id="refine-submit-btn"
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-pink-400 border border-zinc-800 hover:border-zinc-700 disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    <span>优化迭代</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT DRAWER COLLAPSIBLE REFERENCE BLOCK (3 cols, can toggle) */}
        <div
          className={`lg:col-span-3 transition-all duration-300 ${
            isReferenceOpen ? "opacity-100 block" : "hidden pointer-events-none"
          }`}
        >
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-90 w-full shrink-0 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-pink-500" />
                爆文对标参考馆
              </span>
              <button
                id="toggle-ref-drawer-close"
                onClick={() => setIsReferenceOpen(false)}
                className="p-1 rounded hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-[11px] text-zinc-400 leading-relaxed font-mono">
              <div className="p-3 bg-[#0c0c0e] rounded-lg border border-zinc-900 space-y-2">
                <span className="text-[10px] text-pink-400 font-bold bg-pink-950/20 px-2 py-0.5 rounded border border-pink-900/30">
                  行业爆文对标1
                </span>
                <h5 className="font-semibold text-zinc-200">纯干货讲解：新号3天破零的秘诀</h5>
                <p className="text-zinc-500 line-clamp-3">
                  ‘别在第一天就塞满广告，先通过连续两组的专业揭秘测评博取眼球，置顶评论留下福利免费包引流...’
                </p>
              </div>

              <div className="p-3 bg-[#0c0c0e] rounded-lg border border-zinc-900 space-y-2">
                <span className="text-[10px] text-pink-400 font-bold bg-pink-950/20 px-2 py-0.5 rounded border border-pink-900/30">
                  行业爆文对标2
                </span>
                <h5 className="font-semibold text-zinc-200">25+女孩拯救暗沉、黄皮自救指南</h5>
                <p className="text-zinc-500 line-clamp-3">
                  ‘每天面对电脑熬夜码字，早C晚A用了一堆脸还是蜡黄？那是因为你没有吃透精简修护的真正精髓...’
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Small floating button to reopen reference drawer when closed */}
        {!isReferenceOpen && (
          <button
            id="toggle-ref-drawer-open"
            onClick={() => setIsReferenceOpen(true)}
            className="absolute top-2 right-2 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer shadow-lg z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
