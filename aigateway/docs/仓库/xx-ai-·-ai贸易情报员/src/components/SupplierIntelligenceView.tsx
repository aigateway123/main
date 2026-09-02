import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Star, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Phone, 
  Mail,
  Award,
  Filter,
  Layers,
  Zap
} from 'lucide-react';
import { mockSuppliers } from '../data/mockData';
import { SupplierItem } from '../types';

export const SupplierIntelligenceView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(mockSuppliers[0]);

  const filteredSuppliers = mockSuppliers.filter((s) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!s.name.toLowerCase().includes(term) && !s.mainProducts.some(p => p.toLowerCase().includes(term))) {
        return false;
      }
    }
    if (selectedCity !== 'All' && !s.location.includes(selectedCity)) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI 优质供应商寻源情报</h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              源头供应链深度画像
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            快速扫描中国铝型材及系统门窗产业带（佛山、临朐、湖州、无锡），多维评估资质与交期
          </p>
        </div>

        {/* Search & Location Filter */}
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索供应商或产品..."
              className="pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
          >
            <option value="All">全部产业集群</option>
            <option value="佛山">广东佛山 (高端系统门窗)</option>
            <option value="临朐">山东临朐 (大型型材基建)</option>
            <option value="湖州">浙江湖州 (出口欧标节能窗)</option>
            <option value="常州">江苏常州 (美式模块化门窗)</option>
          </select>
        </div>
      </div>

      {/* 2. Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500">已收录认证供应商</span>
            <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">328 家</div>
          </div>
          <Building2 className="w-8 h-8 text-slate-300" />
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-blue-800 font-semibold">外贸优质合规工厂</span>
            <div className="mt-1 text-2xl font-extrabold text-blue-600 font-mono">47 家</div>
          </div>
          <Award className="w-8 h-8 text-blue-200" />
        </div>

        <div className="p-4 rounded-xl bg-white border border-amber-200 bg-amber-50/20 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-amber-800 font-semibold">重点推荐直供源头</span>
            <div className="mt-1 text-2xl font-extrabold text-amber-600 font-mono">12 家</div>
          </div>
          <Sparkles className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      {/* 3. Main Split Content: Supplier List (Left) + Detail Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Suppliers List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-1">
            供应商匹配列表 (共 {filteredSuppliers.length} 家)
          </div>

          <div className="space-y-2.5">
            {filteredSuppliers.map((supplier) => {
              const isSelected = selectedSupplier?.id === supplier.id;
              return (
                <div
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {supplier.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-mono">
                          {supplier.supplierScore}分
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {supplier.province}
                        </span>
                        <span>·</span>
                        <span>{supplier.employeeScale}</span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                      MOQ: {supplier.moq}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {supplier.mainProducts.map((p, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Dossier for Selected Supplier */}
        {selectedSupplier && (
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-blue-600 font-mono font-semibold tracking-wider">SUPPLIER DOSSIER</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedSupplier.name}</h3>
                <p className="text-xs text-slate-500">{selectedSupplier.location} · 成立时间: {selectedSupplier.establishedYear}年</p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">综合评级</span>
                <span className="text-2xl font-extrabold text-blue-600 font-mono">{selectedSupplier.supplierScore} / 100</span>
              </div>
            </div>

            {/* Quick Spec Matrix */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px] mb-1">交期周期</span>
                <span className="text-emerald-700 font-bold font-mono">{selectedSupplier.leadTime}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px] mb-1">价格优势</span>
                <span className="text-blue-700 font-semibold">{selectedSupplier.priceAdvantage}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px] mb-1">最小起订量</span>
                <span className="text-slate-800 font-mono font-semibold">{selectedSupplier.moq}</span>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>出口合规与检测资质</span>
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedSupplier.certifications.map((cert, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    ✔ {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Portrait */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                工厂全景与外贸履约画像
              </h4>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                <p>{selectedSupplier.portrait}</p>
                <div className="pt-2 border-t border-slate-200 text-blue-700 text-[11px]">
                  <strong>OEM/ODM 定制能力：</strong>{selectedSupplier.oemOdm}
                </div>
              </div>
            </div>

            {/* Advantages */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                核心竞争优势 (Core Advantages)
              </h4>
              <div className="space-y-1.5">
                {selectedSupplier.advantages.map((adv, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
