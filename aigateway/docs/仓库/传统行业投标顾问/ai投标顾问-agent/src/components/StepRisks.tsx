import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  FileWarning,
  Sparkles,
  Quote,
  Lightbulb,
  BellRing
} from 'lucide-react';
import { DisqualificationRiskItem } from '../types';
import { copyToClipboard } from '../lib/utils';

interface StepRisksProps {
  risks: DisqualificationRiskItem[];
  onNext: () => void;
  onPrev: () => void;
}

export const StepRisks: React.FC<StepRisksProps> = ({ risks, onNext, onPrev }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeRiskTab, setActiveRiskTab] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const highRisks = risks.filter(r => r.riskLevel === 'high');
  const mediumRisks = risks.filter(r => r.riskLevel === 'medium');
  const lowRisks = risks.filter(r => r.riskLevel === 'low');

  const handleCopy = (id: string, text: string) => {
    copyToClipboard(text).then(ok => {
      if (ok) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    });
  };

  const displayRisks = risks.filter(r => {
    if (activeRiskTab === 'all') return true;
    return r.riskLevel === activeRiskTab;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bento Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-red-50/70 border border-red-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  第三步：⚠️ 废标风险清单（一票否决项）
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-extrabold border border-red-200">
                  最高警戒
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                按风险等级严格分类。不满足高风险项将直接导致【无效投标/废标】。每项均含「原文要求 + 风险解释 + 建议动作」。
              </p>
            </div>
          </div>

          {/* Quick counts */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveRiskTab('high')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRiskTab === 'high'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              🔴 高风险 ({highRisks.length})
            </button>
            <button
              onClick={() => setActiveRiskTab('medium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeRiskTab === 'medium'
                  ? 'bg-amber-500 text-white font-extrabold shadow-sm'
                  : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              🟡 中风险 ({mediumRisks.length})
            </button>
            <button
              onClick={() => setActiveRiskTab('low')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeRiskTab === 'low'
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                  : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              🟢 低风险 ({lowRisks.length})
            </button>
            {activeRiskTab !== 'all' && (
              <button
                onClick={() => setActiveRiskTab('all')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200"
              >
                查看全部
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Risk Items Cards List */}
      <div className="space-y-4">
        {displayRisks.map((risk) => {
          const isHigh = risk.riskLevel === 'high';
          const isMedium = risk.riskLevel === 'medium';

          const formattedText = `【${risk.title}】\n原文要求：${risk.originalQuote}\n风险解释：${risk.riskExplanation}\n建议动作：${risk.suggestedAction}`;

          return (
            <div
              key={risk.id}
              className={`rounded-2xl border p-5 sm:p-6 transition-all relative shadow-sm ${
                isHigh
                  ? 'bg-white border-red-300 ring-1 ring-red-100'
                  : isMedium
                  ? 'bg-white border-amber-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 ${
                    isHigh
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : isMedium
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {isHigh ? '🔴 废标高风险' : isMedium ? '🟡 中度扣分风险' : '🟢 优化建议'}
                  </span>

                  <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                    {risk.category}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(risk.id, formattedText)}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                  title="复制该项风险条目供团队沟通"
                >
                  {copiedId === risk.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold">复制风险</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
                {risk.title}
              </h3>

              {/* 3-Section Breakdown (Mandatory prompt format: 原文要求 + 风险解释 + 建议动作) */}
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5 text-xs sm:text-sm">
                {/* 1. 原文要求 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-1">
                    <Quote className="w-3.5 h-3.5" />
                    <span>【招标文件原文要求】：</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-mono text-xs pl-2 border-l-2 border-blue-500">
                    {risk.originalQuote}
                  </p>
                </div>

                {/* 2. 风险解释 */}
                <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 mb-1">
                    <FileWarning className="w-3.5 h-3.5" />
                    <span>【潜在风险深度解释】：</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed pl-2 border-l-2 border-red-500 font-medium">
                    {risk.riskExplanation}
                  </p>
                </div>

                {/* 3. 建议动作 */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>【顾问建议动作 & 防御措施】：</span>
                  </div>
                  <p className="text-emerald-900 font-semibold leading-relaxed pl-2 border-l-2 border-emerald-600">
                    {risk.suggestedAction}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回：资格审查</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
        >
          <span>下一步：评标规则拆解</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

