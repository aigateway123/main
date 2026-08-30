import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Code, 
  Zap, 
  HelpCircle, 
  TableProperties,
  ArrowRight,
  Layers
} from 'lucide-react';
import { ChatMessage, ResearchPaper } from '../types';

interface ScientificSupervisorChatProps {
  currentPaper: ResearchPaper;
  chatMessages: ChatMessage[];
  onSendMessage: (msg: string) => Promise<void>;
  onApplySuggestedAction?: (action: any) => void;
  isLoading: boolean;
}

const QUICK_PROMPTS = [
  { label: '复现 Table 2', prompt: '按照论文 Section 4 的实验设计，帮我复现 Table 2。' },
  { label: '对比结果差异', prompt: '把实验结果和论文原结果进行对比，告诉我差异在哪里？' },
  { label: '解释公式 (2) 代码', prompt: '解释一下 models/model.py 里公式 (2) Patch Projection 的代码实现逻辑。' },
  { label: '设计消融实验', prompt: '帮我设计一个消融实验（Ablation Study），验证 Patching 与 RevIN 的贡献。' },
  { label: '生成 LaTeX 表格', prompt: '生成可以直接粘贴到 Overleaf 的 Table 2 论文对比表格代码。' }
];

export const ScientificSupervisorChat: React.FC<ScientificSupervisorChatProps> = ({
  currentPaper,
  chatMessages,
  onSendMessage,
  onApplySuggestedAction,
  isLoading
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    await onSendMessage(msg);
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (isLoading) return;
    await onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-[#0D0F16] border-r border-white/5">
      {/* Header */}
      <div className="p-3.5 border-b border-white/5 bg-[#0E1018] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">科研监督智能体 (AI Supervisor)</h3>
            <p className="text-[10px] text-slate-400">人类在环 (Human-in-the-loop) 实验交互</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
          在线
        </span>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2.5 border-b border-white/5 bg-[#0A0B10]/60">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1 flex items-center">
          <Sparkles className="w-3 h-3 text-cyan-400 mr-1" />
          快捷科研指令:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(qp.prompt)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#161923] hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-500/40 border border-white/10 text-slate-300 transition-all text-left"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {chatMessages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isSystem = msg.role === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="px-2.5 py-1 rounded-full bg-[#161923] text-[10px] text-slate-400 border border-white/5">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${isAssistant ? '' : 'flex-row-reverse space-x-reverse'}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isAssistant 
                    ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-sm' 
                    : 'bg-indigo-600 text-white shadow-sm'
                }`}
              >
                {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                  isAssistant
                    ? 'bg-[#161923] text-slate-200 border border-white/10 shadow-sm'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.content}
                </div>

                {msg.suggestedAction && onApplySuggestedAction && (
                  <div className="mt-2.5 pt-2 border-t border-white/10">
                    <button
                      onClick={() => onApplySuggestedAction(msg.suggestedAction)}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition-colors"
                    >
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="mt-1 text-[9px] opacity-40 text-right font-mono">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center text-xs shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#161923] border border-white/10 rounded-xl p-3 text-slate-300">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 ml-1">科研智能体正在解析并生成...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-[#0E1018]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入科研指令（如：复现 Section 4、调参、分析差异...）"
            disabled={isLoading}
            className="w-full bg-[#0A0B10] border border-white/10 rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-1.5 p-1.5 rounded-md text-white transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
