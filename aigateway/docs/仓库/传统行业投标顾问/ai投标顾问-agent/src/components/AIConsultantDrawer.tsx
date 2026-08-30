import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  FileSearch,
  RotateCcw
} from 'lucide-react';
import { TenderAnalysisResult } from '../types';

interface AIConsultantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tenderData: TenderAnalysisResult;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  time: string;
}

export const AIConsultantDrawer: React.FC<AIConsultantDrawerProps> = ({
  isOpen,
  onClose,
  tenderData
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content: `您好！我是您的专属「AI 投标顾问 Agent」。
我已通读并深度解析《${tenderData?.overview?.projectName || '当前项目'}》。

您可以向我咨询关于此项目的任何招投标疑难问题，例如：
1. 本项目最致命的废标条款有哪些？如何防范？
2. 我们的资质如何组合能拿到最高评分？
3. 招标文件有模糊表述，如何向招标代理发起正式澄清函？
4. 电子签章与保证金支付有哪些关键避坑要点？`,
      time: '刚刚'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // If tender changes, reset initial message
  useEffect(() => {
    if (!tenderData?.id) return;
    setMessages([
      {
        id: 'init-' + tenderData.id,
        role: 'model',
        content: `您好！已为您切换至《${tenderData?.overview?.projectName || '当前项目'}》。
预算：${tenderData?.overview?.budget || '详见标书'} | 评标办法：${tenderData?.overview?.evaluationMethod || '综合评分法'}
请问需要我为您分析哪一方面的投标策略或合规细节？`,
        time: '刚刚'
      }
    ]);
  }, [tenderData?.id]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          tenderContext: tenderData,
          chatHistory: messages.slice(-6)
        })
      });

      const data = await response.json();
      const aiReply: ChatMessage = {
        id: 'reply-' + Date.now(),
        role: 'model',
        content: data.reply || `针对您的提问「${textToSend}」，根据招标文件要求：建议仔细核查项目否决条款，并按照《政府采购法》及招标文件专用格式准备盖章与业绩证明材料。`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      const fallbackReply: ChatMessage = {
        id: 'reply-err-' + Date.now(),
        role: 'model',
        content: `针对您的问题：请重点对照招标文件第3章评标办法。注意所有的签字盖章必须在指定位置且法人章与公章清晰无误，投标保证金务必从企业基本户以对公转账支付。`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">AI 投标顾问实时对齐</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
              项目：{tenderData.overview.projectName}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="p-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        <button
          onClick={() => handleSendMessage('请列出本项目所有一票否决项（废标红线）')}
          className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          🚨 一票否决项
        </button>
        <button
          onClick={() => handleSendMessage('本项目技术方案怎样才能拿满分？')}
          className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          🎯 技术方案提分策略
        </button>
        <button
          onClick={() => handleSendMessage('如果遇到参数偏离或疑问，如何写澄清函？')}
          className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
        >
          ✉️ 答疑澄清函模板
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-100 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-[10px] mt-1.5 ${isUser ? 'text-blue-200' : 'text-slate-500'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950/90 border border-slate-800 text-slate-400 rounded-2xl p-3 text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>顾问 Agent 正在调取招标规则研判中...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="向 AI 投标顾问提问（如：保证金退还、同类业绩认定期）..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all shadow-md shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
