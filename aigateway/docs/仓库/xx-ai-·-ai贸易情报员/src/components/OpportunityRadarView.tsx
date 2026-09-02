import React, { useState } from 'react';
import { 
  Radar, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Building2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Mail, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Radio
} from 'lucide-react';
import { mockOpportunities, mockLeads } from '../data/mockData';
import { CommercialOpportunity, CompanyLead } from '../types';

interface OpportunityRadarViewProps {
  onSelectLead: (lead: CompanyLead) => void;
  onGenerateEmail: (lead: CompanyLead) => void;
}

export const OpportunityRadarView: React.FC<OpportunityRadarViewProps> = ({
  onSelectLead,
  onGenerateEmail,
}) => {
  const [filterType, setFilterType] = useState('All');

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    if (filterType === 'All') return true;
    if (filterType === 'high' && opp.opportunityLevel >= 5) return true;
    if (filterType === 'urgent' && (opp.demandSummary.includes('急需') || opp.demandSummary.includes('紧急'))) return true;
    return true;
  });

  const handleAction = (opp: CommercialOpportunity) => {
    const matchedLead = mockLeads.find(l => l.name.toLowerCase().includes(opp.companyName.toLowerCase()) || opp.companyName.toLowerCase().includes(l.name.toLowerCase())) || mockLeads[0];
    onSelectLead(matchedLead);
  };

  const handleEmail = (opp: CommercialOpportunity) => {
    const matchedLead = mockLeads.find(l => l.name.toLowerCase().includes(opp.companyName.toLowerCase()) || opp.companyName.toLowerCase().includes(l.name.toLowerCase())) || mockLeads[0];
    onGenerateEmail(matchedLead);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI 实时商机雷达</h2>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              7x24h 实时全网雷达扫描中
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            实时捕获北美及全球买家发标、供应商断货转单、增资扩产与海关新增提单异动
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-md text-xs shadow-xs">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer text-xs ${filterType === 'All' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            全部商机 ({mockOpportunities.length})
          </button>
          <button
            onClick={() => setFilterType('high')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer text-xs ${filterType === 'high' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🔥 极高价值 ({mockOpportunities.filter(o => o.opportunityLevel >= 5).length})
          </button>
        </div>
      </div>

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">今日新捕获商机</span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">26 条</div>
          <span className="text-[10px] text-emerald-600 mt-1 block font-medium">较昨日 ↑ 4条</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-blue-800 font-semibold">高价值换供商机</span>
          <div className="mt-1 text-2xl font-extrabold text-blue-600 font-mono">8 条</div>
          <span className="text-[10px] text-slate-400 mt-1 block">本地交期严重延误</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">本周新增目标客户</span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">17 家</div>
          <span className="text-[10px] text-slate-400 mt-1 block">已完成官网语义提取</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-xs text-amber-800 font-semibold">明确工程采购需求</span>
          <div className="mt-1 text-2xl font-extrabold text-amber-600 font-mono">9 单</div>
          <span className="text-[10px] text-amber-800 mt-1 block font-medium">建议 24 小时内跟进</span>
        </div>
      </div>

      {/* 3. Opportunities Real-time Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-blue-600" />
            <span>实时商机捕获动态流 (Real-time Opportunities Stream)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">AUTO-REFRESH EVERY 60S</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-3.5 shadow-xs group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {opp.targetProduct}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${opp.opportunityLevel >= 5 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {opp.opportunityLevel >= 5 ? '🔥 极高价值' : '⭐ 高价值'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {opp.discoveredTime}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {opp.title}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-800 font-medium">{opp.companyName}</span>
                    <span>·</span>
                    <span>{opp.countryFlag} {opp.country}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {opp.demandSummary}
                </p>

                <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                  <span>预估采购体量：</span>
                  <span className="text-amber-800 font-mono font-bold">{opp.estimatedVolume}</span>
                </div>

                <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5 pt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>AI 建议动作：{opp.aiSuggestedAction}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleAction(opp)}
                  className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <span>查看企业画像</span>
                  <ArrowRight className="w-3 h-3 text-blue-600" />
                </button>

                <button
                  onClick={() => handleEmail(opp)}
                  className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <Mail className="w-3 h-3 text-blue-200" />
                  <span>生成针对性开发信</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
