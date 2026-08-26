import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  Loader2, 
  MessageSquare, 
  Lightbulb 
} from 'lucide-react';
import { BiomedicalDataset, StatGroupResult, OutlierItem, HypothesisTestResult } from '../types';

interface AgentChatConsoleProps {
  dataset: BiomedicalDataset;
  groupStats: StatGroupResult[];
  outliers: OutlierItem[];
  hypothesisTests: HypothesisTestResult[];
}

interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
  time: string;
}

export const AgentChatConsole: React.FC<AgentChatConsoleProps> = ({
  dataset,
  groupStats,
  outliers,
  hypothesisTests,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'agent',
      content: `您好，我是 BioMed Data Analysis Agent。我已完成对【${dataset.name}】的自动识别与离群值排查。\n您现在可以直接向我提问，例如：“比较不同实验组差异”、“如果剔除异常值对结果有何影响”、“撰写 Nature 级别的图表说明”等。`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQueries = [
    '分析不同实验组之间的差异，并找出异常数据。',
    '如果剔除异常离群样本，P 值与标准差有何变化？',
    '帮我撰写一段发表级别的 Figure Caption 图表说明',
    '是否存在显著的批次效应 (Batch Effect)？',
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          datasetMeta: {
            name: dataset.name,
            category: dataset.category,
            primaryGroupCol: dataset.primaryGroupCol,
            primaryMetricCol: dataset.primaryMetricCol,
            idCol: dataset.idCol,
          },
          groupStats,
          outliers,
          hypothesisTests,
        }),
      });

      const data = await res.json();
      const agentMsg: ChatMessage = {
        role: 'agent',
        content: data.answer || '分析完成。',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: `回答生成时遇到微小网络波动，建议重试。`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-4 bg-blue-600 rounded-xs inline-block" />
          <h3 className="text-sm font-bold text-slate-900">
            科研助理交互终端 (Scientific Agent Dialogue)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Context: {dataset.name.slice(0, 24)}...
        </span>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-blue-50/40 border-b border-blue-100/60 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-blue-900 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> 快捷科研提问:
        </span>
        {suggestedQueries.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-100 text-slate-700 hover:text-blue-900 border border-slate-200 text-xs shrink-0 transition cursor-pointer"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="p-4 max-h-80 overflow-y-auto space-y-3.5 bg-slate-50/30">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'agent' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs font-bold text-xs">
                B
              </div>
            )}
            <div
              className={`max-w-2xl rounded-xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              <div>{m.content}</div>
              <div className={`text-[10px] mt-1 text-right ${m.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {m.time}
              </div>
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 p-2.5 rounded-lg w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Agent 正在综合统计模型与生物学文献生成推断...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
        <input
          type="text"
          placeholder="向 Agent 发出进一步探索指令（如：对比特定两组、评估敏感度分析、生成英文汇报摘要...）"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>发送</span>
        </button>
      </div>
    </div>
  );
};
