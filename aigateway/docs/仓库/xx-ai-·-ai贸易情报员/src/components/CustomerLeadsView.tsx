import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Sparkles, 
  Star, 
  ExternalLink, 
  Mail, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  Globe, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  BookmarkCheck,
  Zap,
  Eye
} from 'lucide-react';
import { CompanyLead, LeadTier } from '../types';

interface CustomerLeadsViewProps {
  leads: CompanyLead[];
  onSelectLead: (lead: CompanyLead) => void;
  onGenerateEmail: (lead: CompanyLead) => void;
  onToggleStar: (leadId: string) => void;
  onOpenNewTask: () => void;
}

export const CustomerLeadsView: React.FC<CustomerLeadsViewProps> = ({
  leads,
  onSelectLead,
  onGenerateEmail,
  onToggleStar,
  onOpenNewTask,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [minMatch, setMinMatch] = useState(0);
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'match' | 'potential'>('score');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Filters logic
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchName = lead.name.toLowerCase().includes(term);
          const matchCity = lead.city.toLowerCase().includes(term);
          const matchCountry = lead.country.toLowerCase().includes(term);
          const matchSummary = lead.summary.toLowerCase().includes(term);
          if (!matchName && !matchCity && !matchCountry && !matchSummary) return false;
        }

        if (selectedCountry !== 'All' && lead.country !== selectedCountry) return false;
        if (selectedTier !== 'All' && lead.tier !== selectedTier) return false;
        if (onlyStarred && !lead.isStarred) return false;
        if (lead.productMatch < minMatch) return false;

        if (selectedType !== 'All') {
          if (!lead.companyType.includes(selectedType)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.overallScore - a.overallScore;
        if (sortBy === 'match') return b.productMatch - a.productMatch;
        return b.purchasePotential - a.purchasePotential;
      });
  }, [leads, searchTerm, selectedCountry, selectedType, selectedTier, minMatch, onlyStarred, sortBy]);

  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    }
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeadIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">全球潜在客户情报矩阵</h2>
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              共筛选出 {leads.length} 家目标企业
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            基于「铝合金门窗 · 北美及全球市场」多重公海海关、官网与行业协会交叉验证生成
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>导出客户明细 (Excel/CSV)</span>
          </button>

          <button
            onClick={onOpenNewTask}
            className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>重新定制采集</span>
          </button>
        </div>
      </div>

      {/* Export Toast Notification */}
      {showExportSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>已成功生成并导出「2026海外铝合金门窗高潜客户情报明细表.xlsx」，含海关提单与采购负责人联系方式。</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono font-bold">EXPORT COMPLETED</span>
        </div>
      )}

      {/* 2. Top 5 High Density Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-slate-500 text-xs font-medium">采集企业总库</span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">1,286</div>
          <span className="text-[10px] text-slate-400 mt-1">覆盖142个海关口岸</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-slate-500 text-xs font-medium">有效识别企业</span>
          <div className="mt-1 text-2xl font-extrabold text-blue-600 font-mono">823</div>
          <span className="text-[10px] text-slate-400 mt-1">官网与税号已核实</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <span className="text-slate-500 text-xs font-medium">匹配潜在客户</span>
          <div className="mt-1 text-2xl font-extrabold text-blue-700 font-mono">237</div>
          <span className="text-[10px] text-slate-400 mt-1">吻合目标品类与渠道</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between shadow-xs bg-gradient-to-b from-white to-emerald-50/30">
          <span className="text-emerald-700 text-xs font-semibold">A级高潜客户</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-600 font-mono">38</div>
          <span className="text-[10px] text-emerald-600/90 mt-1">具备明确进口与换供意向</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-amber-200 flex flex-col justify-between shadow-xs bg-gradient-to-b from-white to-amber-50/30 col-span-2 sm:col-span-1">
          <span className="text-amber-700 text-xs font-semibold">重点攻坚客户</span>
          <div className="mt-1 text-2xl font-extrabold text-amber-600 font-mono">12</div>
          <span className="text-[10px] text-amber-600/90 mt-1">建议由资深业务员直推</span>
        </div>
      </div>

      {/* 3. Multi-Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索企业名称、所在城市、主营产品或业务特征..."
              className="w-full pl-9 pr-4 py-2 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Select Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Country Selector */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer text-xs"
            >
              <option value="All">所有国家 (全部)</option>
              <option value="United States">🇺🇸 美国 (United States)</option>
              <option value="Canada">🇨🇦 加拿大 (Canada)</option>
              <option value="United Kingdom">🇬🇧 英国 (United Kingdom)</option>
              <option value="Germany">🇩🇪 德国 (Germany)</option>
              <option value="Australia">🇦🇺 澳大利亚 (Australia)</option>
              <option value="Singapore">🇸🇬 新加坡 (Singapore)</option>
            </select>

            {/* Customer Tier */}
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer text-xs"
            >
              <option value="All">所有等级</option>
              <option value="A">⭐ A级 · 高潜客户 (评分≥85)</option>
              <option value="B">⚡ B级 · 一般潜力 (评分75-84)</option>
              <option value="C">🌱 C级 · 观察客户</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer text-xs"
            >
              <option value="score">综合评分最高 (降序)</option>
              <option value="match">产品匹配度最高</option>
              <option value="potential">采购潜力最高</option>
            </select>

            {/* Star Filter */}
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={`px-3 py-2 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-medium ${
                onlyStarred
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyStarred ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
              <span>已收藏</span>
            </button>
          </div>
        </div>

        {/* Bottom Filter Tags */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-600">企业业态过滤:</span>
            {['All', '批发商', '经销商', '进口商', '工程'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  selectedType === type
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {type === 'All' ? '全部类型' : type}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            显示 <span className="font-bold text-slate-800">{filteredLeads.length}</span> / {leads.length} 家企业
          </div>
        </div>
      </div>

      {/* 4. Professional High Density Intelligence Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.length > 0 && selectedLeadIds.length === filteredLeads.length}
                    onChange={toggleSelectAll}
                    className="rounded accent-blue-600 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">企业名称与地区</th>
                <th className="p-3.5">企业类型 & 规模</th>
                <th className="p-3.5 text-center">产品匹配度</th>
                <th className="p-3.5 text-center">采购潜力</th>
                <th className="p-3.5 text-center">等级 / 综合评分</th>
                <th className="p-3.5">AI 推荐动作</th>
                <th className="p-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.id);
                return (
                  <tr
                    key={lead.id}
                    className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                      isSelected ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => onSelectLead(lead)}
                  >
                    {/* Checkbox & Star */}
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectLead(lead.id)}
                          className="rounded accent-blue-600 w-3.5 h-3.5 cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => onToggleStar(lead.id)}
                          className="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              lead.isStarred ? 'fill-amber-400 text-amber-400' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </td>

                    {/* Company Name & Location */}
                    <td className="p-3.5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-blue-700 shrink-0">
                          {lead.logoInitial}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                            <span>{lead.name}</span>
                            {lead.importData?.hasImportHistory && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                提单已核
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>
                              {lead.country === 'United States' ? '🇺������ 美国' : lead.country === 'Canada' ? '🇨🇦 加拿大' : lead.country === 'United Kingdom' ? '🇬🇧 英国' : lead.country === 'Australia' ? '🇦🇺 澳大利亚' : lead.country === 'Germany' ? '🇩🇪 德国' : '🇸🇬 新加坡'} · {lead.city}, {lead.region}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-slate-400 font-mono">成立{lead.establishedYear}年</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-md">
                            {lead.summary}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type & Scale */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                          {lead.companyType.split('/')[0].trim()}
                        </span>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                          <span>{lead.employeeScale}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-700 font-semibold">{lead.annualRevenue}</span>
                        </div>
                      </div>
                    </td>

                    {/* Product Match */}
                    <td className="p-3.5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="font-extrabold text-blue-600 text-sm font-mono">
                          {lead.productMatch}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${lead.productMatch}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Purchase Potential */}
                    <td className="p-3.5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="font-extrabold text-slate-800 text-sm font-mono">
                          {lead.purchasePotential}
                        </span>
                        <span className="text-[10px] text-slate-400">分/100</span>
                      </div>
                    </td>

                    {/* Tier & Score */}
                    <td className="p-3.5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono shadow-xs ${
                            lead.tier === 'A'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : lead.tier === 'B'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {lead.tier}级 · {lead.overallScore}分
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {lead.tier === 'A' ? 'A级高潜' : lead.tier === 'B' ? '一般潜力' : '观察库'}
                        </span>
                      </div>
                    </td>

                    {/* Recommended Action */}
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                          lead.recommendedAction === '立即开发'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : lead.recommendedAction === '重点跟进'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <Zap className="w-3 h-3 text-blue-600" />
                        <span>{lead.recommendedAction}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onGenerateEmail(lead)}
                          className="px-2.5 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="生成该客户定制AI开发信"
                        >
                          <Mail className="w-3 h-3 text-blue-600" />
                          <span>开发信</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectLead(lead)}
                          className="px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer border border-slate-200 shadow-xs"
                          title="查看完整企业画像及5维评分"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>画像</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLeads.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-800">未找到符合当前过滤条件的客户</div>
            <p className="text-xs text-slate-500">请尝试放宽筛选条件或重置搜索关键词</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('All');
                setSelectedType('All');
                setSelectedTier('All');
                setOnlyStarred(false);
              }}
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
            >
              重置所有筛选
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
