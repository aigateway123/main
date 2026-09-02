import React, { useState } from 'react';
import { 
  TrendingUp, 
  Globe2, 
  MapPin, 
  BarChart3, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  FileText, 
  ArrowUpRight, 
  Percent, 
  Search,
  Filter,
  DollarSign
} from 'lucide-react';
import { mockMarketOpportunities } from '../data/mockData';
import { MarketOpportunity } from '../types';

export const MarketIntelligenceView: React.FC = () => {
  const [selectedRegionId, setSelectedRegionId] = useState('mkt-01');
  const [productQuery, setProductQuery] = useState('铝合金门窗');
  const [marketQuery, setMarketQuery] = useState('美国');

  const selectedRegion = mockMarketOpportunities.find(m => m.id === selectedRegionId) || mockMarketOpportunities[0];

  const productTrends = [
    { name: '断桥铝节能系统窗 (Thermal Break)', share: '38%', growth: '+12.4%', demand: '极高 (节能补贴催化)' },
    { name: '超窄边全景推拉门 (Slimline Panoramic)', share: '24%', growth: '+18.5%', demand: '高 (现代建筑极简风)' },
    { name: 'Low-E中空钢化玻璃门窗 (Double/Triple Low-E)', share: '21%', growth: '+9.2%', demand: '高 (加州Title 24标配)' },
    { name: '防飓风抗冲击门窗 (Impact-Resistant)', share: '12%', growth: '+15.1%', demand: '极高 (佛州沿海法律强制)' },
    { name: '商业建筑铝合金幕墙 (Commercial Curtain Wall)', share: '5%', growth: '+6.0%', demand: '稳定 (公建地产)' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Dynamic Query Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI 全球市场情报分析</h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              实时宏观与区域洞察
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            聚合北美、澳洲、欧洲及东南亚的进口关税、能效建筑法案、需求增长率与热销品类动向
          </p>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-md text-xs shadow-xs">
          <span className="text-slate-500 pl-2">分析品类:</span>
          <input
            type="text"
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            className="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-500"
          />
          <span className="text-slate-500">目标市场:</span>
          <input
            type="text"
            value={marketQuery}
            onChange={(e) => setMarketQuery(e.target.value)}
            className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-500"
          />
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>刷新分析</span>
          </button>
        </div>
      </div>

      {/* 2. Top Big Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-slate-500 text-xs font-medium">目标市场总体规模</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">$18.4 Billion</div>
          <span className="text-[10px] text-emerald-600 mt-1 font-semibold">↑ 年复合增长率 +7.8%</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-slate-500 text-xs font-medium">海外供应链进口依赖度</span>
          <div className="mt-2 text-2xl font-extrabold text-blue-600 font-mono">42.5%</div>
          <span className="text-[10px] text-slate-400 mt-1">本地产能缺口持续扩大</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-slate-500 text-xs font-medium">主要需求聚集区</span>
          <div className="mt-2 text-lg font-bold text-slate-800 truncate">加州 / 德州 / 佛州</div>
          <span className="text-[10px] text-slate-400 mt-1">占全美总需求量 64%</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-200 bg-blue-50/20 flex flex-col justify-between shadow-xs">
          <span className="text-blue-800 text-xs font-semibold">综合市场机会指数</span>
          <div className="mt-2 text-2xl font-black text-blue-600 font-mono">86 <span className="text-xs text-slate-400 font-normal">/ 100</span></div>
          <span className="text-[10px] text-emerald-700 mt-1 font-semibold">极高准入与扩张潜力</span>
        </div>
      </div>

      {/* 3. Regional Opportunities Grid & Detailed Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Regional Selector Cards (Left 5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>核心目标区域机会指数排行</span>
            </h3>
            <span className="text-[10px] text-slate-400">点击切换分析详情</span>
          </div>

          <div className="space-y-2.5">
            {mockMarketOpportunities.map((mkt) => {
              const isSelected = mkt.id === selectedRegionId;
              return (
                <div
                  key={mkt.id}
                  onClick={() => setSelectedRegionId(mkt.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                        {mkt.region}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        市场规模: {mkt.marketSize} · 增速 {mkt.growthRate}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-200">
                        指数 {mkt.opportunityIndex}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {mkt.mainDemandRegions.slice(0, 3).map((r, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Region Detailed Dossier (Right 7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] text-blue-600 font-semibold font-mono tracking-wider">SELECTED MARKET DOSSIER</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedRegion.region}</h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">机会指数</span>
              <span className="text-2xl font-black text-blue-600 font-mono">{selectedRegion.opportunityIndex} / 100</span>
            </div>
          </div>

          {/* Policy & Regulations */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>政策风向与准入规范 (Regulations & Standards)</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedRegion.policySummary}
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-amber-800 font-medium">
              <strong>准入壁垒提醒：</strong>{selectedRegion.entryBarrier}
            </div>
          </div>

          {/* Key Customer Types */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              主要买家渠道群体
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {selectedRegion.keyCustomerTypes.map((cust, i) => (
                <div key={i} className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>{cust}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Strategic Recommendation */}
          <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1 text-xs">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI 市场开拓落地建议:</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {selectedRegion.aiRecommendation}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Product Category Trends Breakdown */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>北美及国际市场铝合金门窗细分产品需求趋势</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              基于海关进口HS 7610大类与各州新房开工报批图纸统计
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {productTrends.map((trend, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 md:w-1/3">
                <div className="font-bold text-slate-800">{trend.name}</div>
                <div className="text-[11px] text-slate-500">市场份额占比: <strong className="text-slate-800">{trend.share}</strong></div>
              </div>

              <div className="md:w-1/4">
                <span className="text-slate-500 text-[11px] block">年需求增速</span>
                <span className="text-emerald-600 font-bold font-mono text-sm">{trend.growth}</span>
              </div>

              <div className="md:w-1/3">
                <span className="text-slate-500 text-[11px] block">驱动因素</span>
                <span className="text-blue-700 text-xs font-medium">{trend.demand}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
