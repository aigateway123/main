import React, { useState } from 'react';
import { BillingRecord } from '../../types';
import {
  BarChart3,
  Users,
  Activity,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface BillingViewProps {
  billingRecords: BillingRecord[];
}

export const BillingView: React.FC<BillingViewProps> = ({ billingRecords }) => {
  // Filter state
  const [searchEmail, setSearchEmail] = useState('');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-26');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>(
    'all'
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredRecords = billingRecords.filter((rec) => {
    const matchEmail =
      !searchEmail ||
      rec.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchStatus =
      statusFilter === 'all' || rec.status === statusFilter;
    return matchEmail && matchStatus;
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
      {/* Top Stat Row (5 stat cards as specified: 总用户数、活跃用户数、今日请求数、今日费用、总费用) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-[#e2e8f0] space-y-1">
          <div className="text-xs text-[#64748b] font-medium flex items-center justify-between">
            <span>总用户数</span>
            <Users className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-[#1e293b]">1,280</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#e2e8f0] space-y-1">
          <div className="text-xs text-[#64748b] font-medium flex items-center justify-between">
            <span>活跃用户数</span>
            <Users className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-[#1e293b]">342</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#e2e8f0] space-y-1">
          <div className="text-xs text-[#64748b] font-medium flex items-center justify-between">
            <span>今日请求数</span>
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-[#1e293b]">128,450</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#e2e8f0] space-y-1">
          <div className="text-xs text-[#64748b] font-medium flex items-center justify-between">
            <span>今日费用</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-[#1e293b]">¥328.50</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#e2e8f0] col-span-2 md:col-span-1 space-y-1">
          <div className="text-xs text-[#64748b] font-medium flex items-center justify-between">
            <span>总费用</span>
            <DollarSign className="w-3.5 h-3.5 text-[#2563eb]" />
          </div>
          <div className="text-xl font-bold text-[#1e293b]">¥12,450.80</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#1e293b]">用户 ID/邮箱:</label>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="输入邮箱关键字"
            className="h-8 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        {/* Date range inputs */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#1e293b]">日期范围:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-8 px-2 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b]"
          />
          <span className="text-xs text-[#64748b]">至</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-8 px-2 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b]"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#1e293b]">状态:</label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | 'success' | 'failed')
            }
            className="h-8 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b]"
          >
            <option value="all">全部状态</option>
            <option value="success">成功 (Success)</option>
            <option value="failed">失败 (Failed)</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={() => setCurrentPage(1)}
          className="h-8 px-4 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          搜索
        </button>
      </div>

      {/* Usage Table */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 space-y-4">
        <div className="overflow-x-auto rounded border border-[#e2e8f0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-semibold h-10">
                <th className="px-4 py-2">用户邮箱</th>
                <th className="px-4 py-2">使用模型</th>
                <th className="px-4 py-2">Input Tokens</th>
                <th className="px-4 py-2">Output Tokens</th>
                <th className="px-4 py-2">费用(¥)</th>
                <th className="px-4 py-2">状态</th>
                <th className="px-4 py-2">时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((item, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <tr
                      key={item.id}
                      className={`h-12 transition-colors hover:bg-[#eff6ff]/60 ${
                        isEven ? 'bg-white' : 'bg-[#fafbfc]'
                      }`}
                    >
                      <td className="px-4 py-2 font-medium text-[#1e293b]">
                        {item.email}
                      </td>
                      <td className="px-4 py-2">
                        <code className="bg-[#f1f5f9] text-[#2563eb] px-2 py-0.5 rounded font-mono text-[11px] font-semibold border border-[#e2e8f0]">
                          {item.modelCode}
                        </code>
                      </td>
                      <td className="px-4 py-2 font-mono text-[#64748b]">
                        {item.inputTokens.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 font-mono text-[#64748b]">
                        {item.outputTokens.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 font-mono font-bold text-[#1e293b]">
                        ¥{item.costYuan.toFixed(3)}
                      </td>
                      <td className="px-4 py-2">
                        {item.status === 'success' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            success
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
                            failed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-[#64748b] font-mono text-[11px]">
                        {item.timestamp}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-xs text-[#64748b]">
                    无匹配账单用量记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="flex items-center justify-between text-xs text-[#64748b] pt-2">
          <div>
            共 <span className="font-semibold text-[#1e293b]">{filteredRecords.length}</span> 条 / 第{' '}
            <span className="font-semibold text-[#1e293b]">{currentPage}</span> 页 (共 {totalPages} 页)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 border border-[#e2e8f0] bg-white hover:bg-slate-50 text-[#334155] rounded disabled:opacity-50 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              上一页
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 border border-[#e2e8f0] bg-white hover:bg-slate-50 text-[#334155] rounded disabled:opacity-50 flex items-center gap-1 cursor-pointer"
            >
              下一页
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
