import React from 'react';
import { Database, Columns, AlertTriangle, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DatasetMeta } from '../types';

interface DataOverviewCardsProps {
  dataset: DatasetMeta;
}

export const DataOverviewCards: React.FC<DataOverviewCardsProps> = ({ dataset }) => {
  const cards = [
    {
      id: 'rows',
      label: '数据量',
      value: dataset.rowCount.toLocaleString(),
      subtext: '总计观测样本 (N)',
      icon: Database,
      badge: '全量样本',
      valColor: 'text-white',
    },
    {
      id: 'cols',
      label: '字段',
      value: `${dataset.columnCount}`,
      subtext: '多维物理/化学特征',
      icon: Columns,
      badge: '42 维度对齐',
      valColor: 'text-blue-400',
    },
    {
      id: 'missing',
      label: '缺失值',
      value: '1.2%',
      subtext: 'MICE 算法链式插补',
      icon: ShieldCheck,
      badge: '已清洗修复',
      valColor: 'text-orange-400',
    },
    {
      id: 'anomalies',
      label: '异常样本',
      value: '23',
      subtext: '3 个重点关注锁定',
      icon: AlertTriangle,
      badge: 'Isolation Forest',
      valColor: 'text-red-400',
    },
    {
      id: 'groups',
      label: '实验组',
      value: '3',
      subtext: 'A (基线) / B (优化) / C (强化)',
      icon: Layers,
      badge: '平衡对照设计',
      valColor: 'text-emerald-400',
    },
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">
            数据概览 (Data Profile)
          </h3>
        </div>
        <div className="text-xs font-mono text-[#94a3b8] flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          数据质量指数: <span className="text-emerald-400 font-bold">98.8% (Grade A)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="relative overflow-hidden rounded-xl bg-[#0f172a] border border-[#1e293b] p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#64748b] font-semibold">{card.label}</span>
                <div className="w-6 h-6 rounded bg-black/40 border border-[#1e293b] flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-[#94a3b8]" />
                </div>
              </div>

              <div>
                <div className={`text-2xl font-mono font-bold ${card.valColor}`}>
                  {card.value}
                </div>
                <div className="text-[10px] text-[#64748b] mt-0.5">{card.subtext}</div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-between text-[10px]">
                <span className="font-mono text-[#94a3b8]">{card.badge}</span>
                <span className="text-blue-400">100%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
