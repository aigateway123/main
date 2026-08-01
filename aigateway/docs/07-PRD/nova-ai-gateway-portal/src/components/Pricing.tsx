import React from 'react';
import { PRICING_PLANS } from '../data/mockData';
import { Check, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface PricingProps {
  onOpenConsole: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenConsole }) => {
  return (
    <section id="pricing" className="py-24 bg-slate-50/80 border-b border-slate-200/80 relative overflow-hidden text-slate-900">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-500/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            透明计费方案 · Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            按量计费，无隐形开支，
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              注册即送 1,000,000 Tokens
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            灵活选型，随时退订。所有付费方案均包含全模型访问权限、自动Failover路由与实时监控日记。
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-3xl bg-white border flex flex-col justify-between transition-all duration-300 relative ${
                plan.isPopular
                  ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20 lg:-translate-y-2'
                  : 'border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md uppercase tracking-wider">
                  最受欢迎推荐
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.tagline}</p>
                </div>

                {/* Price tag */}
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {plan.monthlyPrice}
                    </span>
                    <span className="text-xs font-medium text-slate-500">/ 月</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-blue-600">
                    年付等效: {plan.annualPrice} / 月
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3.5 mb-8">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">包含功能特权:</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-slate-700 leading-snug">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenConsole}
                className={`w-full py-3.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise SLA Guarantee Banner */}
        <div className="mt-16 p-6 rounded-2xl bg-white border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-left">
            <ShieldCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">需要对公转账 / 开具增值税专用发票 / 私有化部署？</h4>
              <p className="text-xs text-slate-600">支持签订 SLA 法律保证协议、企业级专线与专属架构师 1v1 支持。</p>
            </div>
          </div>
          <button
            onClick={onOpenConsole}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold whitespace-nowrap shadow-sm"
          >
            联系企业顾问
          </button>
        </div>
      </div>
    </section>
  );
};
