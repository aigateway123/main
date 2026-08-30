import React, { useState } from "react";
import { AppView, ConversionsPack } from "../types";
import {
  MessageSquareCode,
  Sliders,
  Cpu,
  Bookmark,
  Share2,
  Users,
  Send,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface ReplyAgentViewProps {
  onSaveToAssets: (title: string, content: string, category: string, type: "copy" | "topic" | "script" | "image" | "preset") => void;
}

export default function ReplyAgentView({ onSaveToAssets }: ReplyAgentViewProps) {
  const [product, setProduct] = useState("爆款自媒体起号实战训练营");
  const [price, setPrice] = useState("￥199");
  const [sellingPoints, setSellingPoints] = useState("3套傻瓜填空表, 大咖1对1诊断, 7天无理由退款保障");

  const [loading, setLoading] = useState(false);
  const [conversions, setConversions] = useState<ConversionsPack | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Objections Conversational Chat Simulator State
  const [selectedUserObjection, setSelectedUserObjection] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "ai"; message: string }>>([
    { sender: "user", message: "哈喽，看到你发那个大地图笔记了，感觉挺全面的。请问你们这个199的课小白能学会吗？" }
  ]);
  const [agentTyping, setAgentTyping] = useState(false);

  // Status logs
  const [copiedScenario, setCopiedScenario] = useState<number | null>(null);
  const [copiedDm, setCopiedDm] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerateConversions = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/gemini/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, price, sellingPoints }),
      });

      if (!response.ok) {
        throw new Error("成交话术生成失败，请稍后重试");
      }

      const data = await response.json();
      setConversions(data);

      // Seed the chat log with a relative reply
      setChatLog([
        { sender: "user", message: `哈喽，看到你发的内容了，请问你们的 【${product}】 还有优惠吗？感觉挺贵呀！` }
      ]);
      setSelectedUserObjection(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "请求服务器生成失败，请校验 API Key 。");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateObjectionReply = (objectionIdx: number, text: string) => {
    // Append user message
    const ObjectionText = [
      "请问这个有什么用啊？小白学完能直接起号成功吗？",
      "亲亲这个怎么卖的呀？能便宜点发一下购买链接吗？",
      "感觉太贵了，奶茶钱还能买点实打实的东西呢..."
    ][objectionIdx];

    const newChat = [...chatLog, { sender: "user" as const, message: ObjectionText }];
    setChatLog(newChat);
    setAgentTyping(true);

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        { sender: "ai" as const, message: text }
      ]);
      setAgentTyping(false);
    }, 1200);
  };

  const handleSaveAssetsPack = () => {
    if (!conversions) return;
    const bodyText = `
【产品】: ${product}
【客单价】: ${price}
【卖点】: ${sellingPoints}

--- 【社交评论区回复模板】 ---
${conversions.commentsReplies.map((r, i) => `场景${i+1}.${r.scenario}\n回复: ${r.reply}`).join("\n\n")}

--- 【后端私信漏斗营销闭环】 ---
${conversions.dmReplies.map((r, i) => `步骤${i+1}.${r.trigger}\n内容: ${r.reply}`).join("\n\n")}

--- 【高情商高转化成交闭环】 ---
${conversions.salesClosing.map((r, i) => `链路${i+1}.${r.step}\n成交术语: ${r.lines}`).join("\n\n")}
    `;
    onSaveToAssets(`【成交话术包】${product}`, bodyText, product, "copy");
    setSaved(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <MessageSquareCode className="w-5 h-5 text-pink-500" />
          全天候高转化成交 Agent
        </h2>
        <p className="text-xs text-zinc-400">
          通过多层拟人话术框架，打通小红书首层高粘度神级评论、私信跟进链路与最后一步高情商高转化锁客成交话术。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT FORM BLOCK (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0c0c0e] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs pb-3 border-b border-zinc-900">
            <Sliders className="w-4 h-4 text-pink-500" />
            <h4>产品转换核心要素</h4>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label htmlFor="reply-product" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">带货产品 / 服务名称</label>
              <input
                type="text"
                id="reply-product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-zinc-300 focus:outline-none focus:ring-0 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reply-price" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">产品单价 / 服务限额</label>
              <input
                type="text"
                id="reply-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-zinc-300 focus:outline-none focus:ring-0 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reply-usp" className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">核心交付品质 / 强悍背书卖点</label>
              <textarea
                id="reply-usp"
                rows={3}
                value={sellingPoints}
                onChange={(e) => setSellingPoints(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-pink-500 text-zinc-300 focus:outline-none focus:ring-0 font-sans"
              />
            </div>

            <button
              onClick={handleGenerateConversions}
              disabled={loading}
              id="reply-perform-btn"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-bold text-white shadow-lg shadow-pink-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4 animate-spin-slow" />
              {loading ? "引流模型计算排雷中..." : "批量生成全链路成交术"}
            </button>
          </div>
        </div>

        {/* RIGHT PLAYGROUND SPLIT PANEL (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main List and script box (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            {loading && (
              <div className="p-16 bg-[#0c0c0e] border border-zinc-800/80 rounded-xl flex flex-col items-center justify-center space-y-3">
                <div className="w-6 h-6 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  正在部署社交对话代理角色，围绕价格 [{price}] 打造一站式闭环引流回复包...
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded bg-rose-950/20 border border-rose-900/30 text-xs text-rose-300 font-mono">
                {error}
              </div>
            )}

            {!loading && !error && !conversions && (
              <div className="p-16 bg-[#0c0c0e] border border-zinc-900 rounded-xl text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 mx-auto">
                  <MessageSquareCode className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-300">成交策略部署就绪</h4>
                  <p className="text-[10px] text-zinc-500 max-w-sm mx-auto">
                    输入带货属性并点击【一键生成】，模型将智能打造针对不愿付费、零基础、怀疑成分等创作者的销售推论。
                  </p>
                </div>
              </div>
            )}

            {/* Script Display and layout */}
            {!loading && !error && conversions && (
              <div className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-900 space-y-6">
                {/* Headers */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    成交话术推荐表
                  </span>

                  <button
                    id="save-rely-pack-btn"
                    onClick={handleSaveAssetsPack}
                    disabled={saved}
                    className={`px-3 py-1.5 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                      saved
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                        : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {saved ? "话术包已归档" : "一键保存到资产库"}
                  </button>
                </div>

                {/* Section 1: Comment replies */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                    评论区热度神评截流术:
                  </h4>
                  <div className="space-y-2">
                    {conversions.commentsReplies.map((r, i) => (
                      <div key={i} className="p-3 rounded bg-zinc-950 border border-zinc-900 space-y-1">
                        <span className="text-[9px] text-pink-400 font-bold bg-[#18181b] px-1.5 py-0.5 rounded">
                          场景.{r.scenario}
                        </span>
                        <p className="text-[11px] text-zinc-300 italic font-mono leading-relaxed font-normal">
                          “{r.reply}”
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Dm replies */}
                <div className="space-y-2 pt-2 border-t border-zinc-900/40">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                    私信长链转化钩子链路:
                  </h4>
                  <div className="space-y-2">
                    {conversions.dmReplies.map((r, i) => (
                      <div key={i} className="p-3 rounded bg-zinc-950 border border-zinc-900 space-y-1">
                        <span className="text-[9px] text-indigo-400 font-bold bg-[#18181b] px-1.5 py-0.5 rounded">
                          步骤.{r.trigger}
                        </span>
                        <p className="text-[11px] text-zinc-300 font-mono leading-relaxed font-normal">
                          {r.reply}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Objection Chat Simulation Center (5 cols) */}
          <div className="md:col-span-5 p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col h-[520px] justify-between">
            <div className="space-y-3 flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-1 pb-2 border-b border-zinc-900">
                <Users className="w-4 h-4 text-pink-500" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">转化对话模拟舱</h4>
                  <p className="text-[9px] text-zinc-500 font-mono">CONVERSION PLAYGROUND</p>
                </div>
              </div>

              {/* Chat log displays */}
              <div className="flex-1 overflow-y-auto space-y-3 px-1 py-1 font-mono text-[11px]">
                {chatLog.map((chat, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${
                      chat.sender === "user" ? "self-start" : "self-end items-end ml-auto"
                    }`}
                  >
                    <span className="text-[9px] text-zinc-500 mb-0.5 font-mono">
                      {chat.sender === "user" ? "模拟真实创作者" : "爆款销售 Agent"}
                    </span>
                    <div
                      className={`p-2.5 rounded-lg border leading-relaxed ${
                        chat.sender === "user"
                          ? "bg-zinc-900 border-zinc-800 text-zinc-300 rounded-tl-none"
                          : "bg-pink-950/20 border-pink-900/30 text-pink-400 rounded-tr-none"
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                ))}

                {agentTyping && (
                  <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                    <span>AI 话术卡片回复加载中...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Objection buttons triggers */}
            <div className="pt-3 border-t border-zinc-900 space-y-2">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                选择下方抗拒话术，一键触发 AI 对练方案:
              </span>

              {conversions ? (
                <div className="space-y-1.5">
                  {conversions.salesClosing.map((close, i) => (
                    <button
                      key={i}
                      id={`simulate-objection-${i}`}
                      onClick={() => handleSimulateObjectionReply(i, close.lines)}
                      disabled={agentTyping}
                      className="w-full text-left p-2 rounded bg-zinc-900 hover:bg-[#121217] text-[10px] text-zinc-300 font-medium hover:text-pink-400 border border-zinc-800 hover:border-pink-900/30 transition-all font-mono line-clamp-1 cursor-pointer truncate"
                    >
                      <span className="text-pink-500 mr-1.5 font-bold">客户 objections.{close.step} :</span>
                      {["小白真的能学会吗？", "购买链接发来！", "有点超出预算了..."][i]}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-600 font-mono leading-tight py-2">
                  提示: 需首先生成成交话术，才能调配抗拒对练 Agent。
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
