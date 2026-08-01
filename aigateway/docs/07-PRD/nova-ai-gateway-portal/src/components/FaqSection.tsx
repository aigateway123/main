import React, { useState } from 'react';
import { FAQ_DATA } from '../data/mockData';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50/80 border-b border-slate-200/80 relative overflow-hidden text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            常见问题解答 · FAQ
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            关于 Nova Gateway 的
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              核心疑问解答
            </span>
          </h2>
          <p className="text-slate-600 text-base">
            有其他关于安全防护、API 兼容性与并发限制的疑问？可以查看下方回答或联系在线客服。
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl bg-white border transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-blue-400 shadow-md ring-1 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base font-bold text-slate-900 flex items-center gap-3">
                    <span className="text-blue-600 font-mono text-xs font-semibold bg-blue-50 px-2 py-1 rounded">
                      Q
                    </span>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-slate-100 text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200">
                    <p className="pl-8 border-l-2 border-blue-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Footer */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm font-bold text-slate-900">未找到您想了解的问题？</p>
              <p className="text-xs text-slate-500">我们的技术专家团队随时准备为您解答部署架构与技术细节。</p>
            </div>
          </div>
          <a
            href="#footer"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            提交技术工单
          </a>
        </div>
      </div>
    </section>
  );
};
