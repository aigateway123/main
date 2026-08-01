import React, { useState } from 'react';
import { Calculator, ArrowRight, Zap, TrendingDown, DollarSign } from 'lucide-react';

export const CostCalculator: React.FC = () => {
  const [dailyTokens, setDailyTokens] = useState<number>(100); // 100 Million
  const [cacheHitRate, setCacheHitRate] = useState<number>(45); // 45%
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');

  // Pricing constants (per Million tokens in USD)
  const modelPrices: Record<string, { name: string; input: number; output: number }> = {
    'gpt-4o': { name: 'OpenAI GPT-4o', input: 2.5, output: 10.0 },
    'claude-3-5': { name: 'Claude 3.5 Sonnet', input: 3.0, output: 15.0 },
    'deepseek-v3': { name: 'DeepSeek V3', input: 0.2, output: 0.8 },
    'qwen-2-5': { name: '通义千问 Qwen-2.5', input: 0.3, output: 1.2 },
  };

  const currentModel = modelPrices[selectedModel];

  // Calculations
  const rawDailyCost = (dailyTokens * 0.7 * currentModel.input) + (dailyTokens * 0.3 * currentModel.output);
  const cacheSavedDaily = rawDailyCost * (cacheHitRate / 100) * 0.8; // Cache saves 80% on hit tokens
  const netDailyCost = rawDailyCost - cacheSavedDaily;

  const rawMonthlyCost = rawDailyCost * 30;
  const netMonthlyCost = netDailyCost * 30;
  const monthlySavings = rawMonthlyCost - netMonthlyCost;

  return (
    <section id="calculator" className="py-24 bg-white text-slate-900 border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            ROI & 成本计算器 · Cost Calculator
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            内置智能语义缓存，
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              最高节省 70% 支出
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            通过 Nova 智能缓存层与精细化 Batch 路由，在不降级模型响应精度的前提下，大幅降低 API 调用费用。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-7 p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-8 shadow-sm">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                1. 选择您的主力大模型
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.entries(modelPrices).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedModel(key)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      selectedModel === key
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div>{item.name}</div>
                    <div className={selectedModel === key ? 'text-blue-100' : 'text-slate-500 font-mono text-[10px]'}>
                      ${item.input}/M tokens
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Daily Tokens */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. 日均 Token 消耗量
                </label>
                <span className="text-sm font-extrabold text-blue-600 font-mono bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                  {dailyTokens} 百万 (M) Tokens / 天
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={dailyTokens}
                onChange={(e) => setDailyTokens(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>10 M Tokens/天</span>
                <span>500 M Tokens/天</span>
                <span>1,000 M Tokens/天</span>
              </div>
            </div>

            {/* Slider 2: Cache Hit Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. 预期语义缓存命中率
                </label>
                <span className="text-sm font-extrabold text-emerald-600 font-mono bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                  {cacheHitRate}% 命中率
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={cacheHitRate}
                onChange={(e) => setCacheHitRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>0% (无缓存)</span>
                <span>40% (典型客服/客服场景)</span>
                <span>80% (高重复检索场景)</span>
              </div>
            </div>

            {/* Tech Feature Badges */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>语义流式缓存 Zero-Latency</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-blue-600" />
                <span>自动 Token 压缩与 Prompt 规范化</span>
              </div>
            </div>
          </div>

          {/* Savings Calculation Card */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-white border border-blue-200 shadow-md flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-blue-200/80 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">月度支出对比预估</h3>
                  <p className="text-xs text-slate-500">Based on {currentModel.name}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600 p-1.5 rounded-xl bg-emerald-100" />
              </div>

              {/* Direct Provider Cost */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">官方原价月度费用:</span>
                  <span className="font-mono text-slate-500 line-through text-base font-bold">
                    ${Math.round(rawMonthlyCost).toLocaleString()} / 月
                  </span>
                </div>

                {/* Nova Optimized Cost */}
                <div className="flex justify-between items-center text-sm p-4 rounded-xl bg-white border border-emerald-200 shadow-sm">
                  <div>
                    <span className="block text-slate-900 font-bold">Nova 优选月度实付:</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">包含智能缓存 + 汇率优化</span>
                  </div>
                  <span className="font-mono text-2xl font-extrabold text-emerald-600">
                    ${Math.round(netMonthlyCost).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Monthly Savings Big Number */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center shadow-lg shadow-emerald-600/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-1">
                  每月预计为您节省资金
                </p>
                <p className="text-4xl font-extrabold font-mono tracking-tight">
                  ${Math.round(monthlySavings).toLocaleString()}
                </p>
                <p className="text-xs text-emerald-100 mt-2">
                  节省约 {Math.round((monthlySavings / rawMonthlyCost) * 100)}% 成本
                </p>
              </div>
            </div>

            <button className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm">
              <span>立即开通并应用缓存优化</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
