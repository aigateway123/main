import React, { useState } from 'react';
import { CODE_SAMPLES } from '../data/mockData';
import { Check, Copy, ArrowRight, Play, Code2 } from 'lucide-react';

interface HeroProps {
  onOpenConsole: () => void;
  onOpenPlayground: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsole, onOpenPlayground }) => {
  const [selectedLang, setSelectedLang] = useState('python');
  const [copied, setCopied] = useState(false);

  const currentSample = CODE_SAMPLES.find((s) => s.lang === selectedLang) || CODE_SAMPLES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white text-slate-900 flex flex-col justify-center border-b border-slate-100">
      {/* Background Gradients & Mesh Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Subtle Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 my-auto">
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-sm hover:border-blue-300 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Nova Gateway v2.5 发布</span>
            <span className="text-slate-300">|</span>
            <span>完全支持 DeepSeek R1 & GPT-4o 智能双路降级</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </div>
        </div>

        {/* Main Headline & Slogan */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            一个 API 调用 <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
              全品类顶级 AI 模型
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-700 font-semibold tracking-wide">
            统一接入 <span className="text-blue-600 font-bold">·</span> 智能路由 <span className="text-blue-600 font-bold">·</span> 成本优化
          </p>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            企业级 AI 统一网关，兼容 OpenAI SDK 接口规范。免改造集成 DeepSeek、GPT-4o、Claude 3.5、Qwen 等 50+ 顶级大模型，内置语义缓存与毫秒级故障自动切流。
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenConsole}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              <span>开始免费使用</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenPlayground}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-base transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600/20" />
              <span>在线试用 API 沙盒</span>
            </button>
          </div>
        </div>

        {/* Live Code Snippet Box (High Contrast Sleek Terminal) */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Window Bar Header */}
            <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  {currentSample.filename}
                </span>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {CODE_SAMPLES.map((sample) => (
                  <button
                    key={sample.lang}
                    onClick={() => setSelectedLang(sample.lang)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      selectedLang === sample.lang
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {sample.label.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Copy Code Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>复制代码</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content Box */}
            <div className="p-4 sm:p-6 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
              <pre className="text-slate-300">
                <code>
                  {currentSample.code.split('\n').map((line, i) => {
                    const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
                    return (
                      <div key={i} className="flex">
                        <span className="w-8 text-slate-600 select-none text-right pr-4 text-xs">
                          {i + 1}
                        </span>
                        <span className={isComment ? 'text-slate-500 italic' : ''}>
                          {line.includes('https://api.novagateway.ai/v1') ? (
                            <span>
                              {line.split('https://api.novagateway.ai/v1')[0]}
                              <span className="bg-blue-600/30 text-blue-300 font-bold px-1 rounded border border-blue-500/40">
                                "https://api.novagateway.ai/v1"
                              </span>
                              {line.split('https://api.novagateway.ai/v1')[1]}
                            </span>
                          ) : (
                            line
                          )}
                        </span>
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>

            {/* Footer Notice */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>全网 API 端点地址: <code className="text-blue-300 font-mono">https://api.novagateway.ai/v1</code></span>
              </div>
              <span className="text-slate-400">支持原生 OpenAI 客户端 / Python / JS / Go / LangChain</span>
            </div>
          </div>
        </div>

        {/* Realtime Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">
              5,000,000,000+
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">日均 API 安全转发请求数</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
              &lt; 5 ms
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">网关额外中间代理延时</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              99.99%
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">企业级服务可用性 SLA</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono">
              50+
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">全球主流模型开箱即用</p>
          </div>
        </div>
      </div>
    </section>
  );
};
