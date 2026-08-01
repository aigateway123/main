import React, { useState } from 'react';
import { MODELS_DATA } from '../data/mockData';
import { X, Play, Copy, Check, Sparkles, RefreshCw, Layers, ShieldAlert, Cpu } from 'lucide-react';

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModelId?: string;
}

export const PlaygroundModal: React.FC<PlaygroundModalProps> = ({
  isOpen,
  onClose,
  defaultModelId = 'deepseek-r1',
}) => {
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const [promptInput, setPromptInput] = useState(
    '写一段 Python 脚本，使用 OpenAI 官方客户端连接 Nova AI 网关，发起多轮流式对话并计算延迟。'
  );
  const [temperature, setTemperature] = useState(0.7);
  const [isStreaming, setIsStreaming] = useState(true);
  const [useCache, setUseCache] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [latencyMetrics, setLatencyMetrics] = useState<{ ttft: number; totalTime: number; tokens: number; cacheHit: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentModel = MODELS_DATA.find((m) => m.id === selectedModelId) || MODELS_DATA[0];

  const handleRunSimulation = () => {
    setIsLoading(true);
    setResponseOutput(null);
    setLatencyMetrics(null);

    setTimeout(() => {
      setIsLoading(false);
      const isHit = useCache && Math.random() > 0.3;
      const calculatedTtft = isHit ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 80) + 120;
      const totalTokens = Math.floor(Math.random() * 200) + 150;

      setLatencyMetrics({
        ttft: calculatedTtft,
        totalTime: calculatedTtft + Math.floor(totalTokens * 1.8),
        tokens: totalTokens,
        cacheHit: isHit,
      });

      setResponseOutput(`Below is a Python demonstration using the Nova AI Gateway endpoint:

\`\`\`python
import os
from openai import OpenAI

# Simply configure Nova API Key & Base URL
client = OpenAI(
    api_key=os.environ.get("NOVA_API_KEY", "nv-sk-98327429384729384"),
    base_url="https://api.novagateway.ai/v1"
)

response = client.chat.completions.create(
    model="${selectedModelId}",
    messages=[
        {"role": "system", "content": "You are Nova AI Assistant."},
        {"role": "user", "content": "${promptInput.replace(/"/g, '\\"')}"}
    ],
    temperature=${temperature},
    stream=${isStreaming ? 'True' : 'False'}
)

if ${isStreaming ? 'True' : 'False'}:
    for chunk in response:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)
else:
    print(response.choices[0].message.content)
\`\`\`

✅ **Request Status**: 200 OK
⚡ **Gateway Overhead**: 1.2ms
🧠 **Semantic Cache**: ${isHit ? 'Hit (Saved 80% Cost)' : 'Miss (Forwarded to Provider)'}
`);
    }, 1200);
  };

  const handleCopyCode = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(responseOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Nova API 实时沙盒控制台</span>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-mono">
                  Live API Testing
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                测试跨模型请求响应速度、控制参数与语义缓存降级效果
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Config Panel */}
          <div className="lg:col-span-5 space-y-5">
            {/* Model Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                目标测试模型 (Model ID)
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
              >
                {MODELS_DATA.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider}) - {m.inputPrice}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                测试 Prompt 输入
              </label>
              <textarea
                rows={4}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-sans resize-none"
                placeholder="请输入用于测试大模型的提示词..."
              />
            </div>

            {/* Controls */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Temperature (随机性)</span>
                  <span className="font-mono text-blue-600">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-700">开启语义流式缓存 (Cache)</span>
                <input
                  type="checkbox"
                  checked={useCache}
                  onChange={(e) => setUseCache(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-700">开启 SSE 流式传输 (Stream)</span>
                <input
                  type="checkbox"
                  checked={isStreaming}
                  onChange={(e) => setIsStreaming(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>正在模拟网关路由并发响应...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>发起 API 沙盒模拟请求</span>
                </>
              )}
            </button>
          </div>

          {/* Right Output Terminal */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 p-4 text-slate-200 font-mono text-xs flex flex-col justify-between overflow-hidden shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  API Response Inspector
                </span>

                {responseOutput && (
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? '已复制' : '复制结果'}</span>
                  </button>
                )}
              </div>

              <div className="py-4 overflow-y-auto max-h-[260px] whitespace-pre-wrap leading-relaxed text-slate-300">
                {isLoading && (
                  <div className="flex items-center gap-2 text-blue-400 animate-pulse py-8 justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>通过 Anycast 优化路由转发中...</span>
                  </div>
                )}

                {!isLoading && !responseOutput && (
                  <div className="text-center text-slate-500 py-12">
                    <p>点击左下角按钮发起来自 API 网关的请求模拟</p>
                  </div>
                )}

                {responseOutput && responseOutput}
              </div>

              {/* Metrics bar */}
              {latencyMetrics && (
                <div className="pt-3 border-t border-slate-800 grid grid-cols-4 gap-2 text-[11px] text-center">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="block text-slate-400">TTFT 首字延迟</span>
                    <span className="font-bold text-emerald-400">{latencyMetrics.ttft} ms</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="block text-slate-400">总响应耗时</span>
                    <span className="font-bold text-blue-400">{latencyMetrics.totalTime} ms</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="block text-slate-400">生成 Tokens</span>
                    <span className="font-bold text-slate-200">{latencyMetrics.tokens}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="block text-slate-400">语义缓存命中</span>
                    <span className={`font-bold ${latencyMetrics.cacheHit ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {latencyMetrics.cacheHit ? 'HIT (缓存)' : 'MISS'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          * 沙盒使用真实 OpenAI SDK Protocol 模拟转发，生产环境只需更改 Base URL 与 API Key 即可全量切换。
        </div>
      </div>
    </div>
  );
};
