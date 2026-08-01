import React from 'react';
import { INFRA_DATA } from '../data/mockData';
import { Globe, Gauge, Database, Server, Zap } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Gauge,
  Database,
  Server,
};

export const Infrastructure: React.FC = () => {
  return (
    <section id="infrastructure" className="py-24 bg-slate-50/80 border-b border-slate-200/80 relative overflow-hidden text-slate-900">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            企业级高可用基础设施 · Infrastructure
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            全球 Anycast 分发架构，
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
              极致低延时体验
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            基于分布式多云节点与 Rust 高性能代理内核构建，保障您的业务在百万级高并发场景下依旧坚如磐石。
          </p>
        </div>

        {/* 4 Infrastructure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INFRA_DATA.map((card) => {
            const IconComponent = iconMap[card.iconName] || Globe;

            return (
              <div
                key={card.id}
                className="p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-slate-200/60 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Top Stats Banner */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 group-hover:bg-indigo-600 group-hover:text-white transition-all text-blue-600">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-slate-900 font-mono bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {card.stats}
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold">{card.statsLabel}</div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <span className="text-xs font-mono font-semibold text-indigo-600">{card.subtitle}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed my-4">
                    {card.description}
                  </p>
                </div>

                {/* Sub features */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  {card.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <Zap className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Network Map Visual Simulation */}
        <div className="mt-16 p-8 rounded-2xl bg-white border border-slate-200 text-center relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
          <h4 className="text-base font-bold text-slate-900 mb-2">全球网络节点分布 (32+ Edge Regions)</h4>
          <p className="text-xs text-slate-600 max-w-xl mx-auto mb-6">
            支持美西(硅谷/俄勒冈)、美东(弗吉尼亚)、欧洲(法兰克福/伦敦)、亚太(东京/新加坡/香港/悉尼)就近接入。
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-mono text-slate-700">
            {['US-West (Silicon Valley)', 'US-East (N. Virginia)', 'EU-Central (Frankfurt)', 'AP-East (Hong Kong)', 'AP-Northeast (Tokyo)', 'AP-Southeast (Singapore)', 'AU-East (Sydney)'].map((region, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {region}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
