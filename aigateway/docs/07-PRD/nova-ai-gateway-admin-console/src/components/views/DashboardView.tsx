import React, { useState } from 'react';
import { RecentRequest } from '../../types';
import {
  Activity,
  Cpu,
  DollarSign,
  Clock,
  Key,
  Server,
  TrendingUp,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';

interface DashboardViewProps {
  recentRequests: RecentRequest[];
  onRefresh?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  recentRequests,
  onRefresh,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'requests' | 'tokens' | 'latency'>('requests');

  const statCards = [
    {
      title: '今日请求数',
      value: '128,450',
      change: '+14.2% vs 昨天',
      isPositive: true,
      icon: Activity,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: '今日Token数',
      value: '45.2 M',
      change: '+8.5% vs 昨天',
      isPositive: true,
      icon: Cpu,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: '今日成本(¥)',
      value: '¥328.50',
      change: '-3.1% 优化降本',
      isPositive: true,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: '平均延迟(ms)',
      value: '185 ms',
      change: '-12ms 路由提速',
      isPositive: true,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: '活跃API Key数',
      value: '42',
      change: '正常健康',
      isPositive: true,
      icon: Key,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      title: '活跃Provider数',
      value: '6',
      change: '100% 可用率',
      isPositive: true,
      icon: Server,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: '总请求数',
      value: '3,842,100',
      change: '累计吞吐量',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: '总成本(¥)',
      value: '¥12,450.80',
      change: '平台总归因',
      isPositive: true,
      icon: Layers,
      color: 'text-teal-600 bg-teal-50',
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
      {/* 4x2 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-[8px] border border-[#e2e8f0] p-4 flex flex-col justify-between hover:border-[#2563eb]/40 transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#64748b]">
                  {card.title}
                </span>
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${card.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1e293b] tracking-tight">
                  {card.value}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-[#64748b]">
                  {card.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-rose-600" />
                  )}
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashed Chart Placeholder Section: 「待接入图表」 */}
      <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2563eb]" />
            <span className="text-sm font-bold text-[#1e293b]">
              网关实时吞吐与延迟趋势
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveChartTab('requests')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeChartTab === 'requests'
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-[#f8f9fa] text-[#64748b] hover:bg-[#e2e8f0]'
              }`}
            >
              请求量 QPS
            </button>
            <button
              onClick={() => setActiveChartTab('tokens')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeChartTab === 'tokens'
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-[#f8f9fa] text-[#64748b] hover:bg-[#e2e8f0]'
              }`}
            >
              Token 消耗
            </button>
            <button
              onClick={() => setActiveChartTab('latency')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeChartTab === 'latency'
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-[#f8f9fa] text-[#64748b] hover:bg-[#e2e8f0]'
              }`}
            >
              响应延迟
            </button>
          </div>
        </div>

        {/* Dashed Border Box */}
        <div className="w-full h-56 border-2 border-dashed border-[#cbd5e1] rounded-lg bg-[#fafbfc] flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
          {/* Subtle background SVG graph lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 500 150">
            <path
              d="M0,100 Q100,20 200,80 T400,30 T500,90"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
            />
            <path
              d="M0,120 Q120,60 250,110 T450,50 T500,110"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
            />
          </svg>

          <div className="w-10 h-10 rounded-full bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#1e293b]">
              「待接入图表」
            </div>
            <p className="text-xs text-[#64748b] max-w-md mt-1">
              可接入 ECharts / Recharts 监控指标看板。展示 24 小时并发请求量 (QPS)、各 Provider 流量分布及 Token 消费趋势图。
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#e2e8f0] rounded text-xs font-medium text-[#2563eb]">
            <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
            数据流推送状态: WebSocket Ready (Port 3000)
          </div>
        </div>
      </div>

      {/* Recent Requests Table Section */}
      <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2563eb]" />
            <h3 className="text-sm font-bold text-[#1e293b]">最近请求记录</h3>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-2.5 py-1 text-xs text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8f9fa] border border-[#e2e8f0] rounded flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              刷新日志
            </button>
          )}
        </div>

        {/* Table standard: header #64748b 12px, row height 48px, hover light blue, alt row bg #fafbfc */}
        <div className="overflow-x-auto rounded border border-[#e2e8f0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-semibold h-10">
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Provider</th>
                <th className="px-4 py-2">Input Tokens</th>
                <th className="px-4 py-2">Output Tokens</th>
                <th className="px-4 py-2">延迟(ms)</th>
                <th className="px-4 py-2">成本(¥)</th>
                <th className="px-4 py-2">状态</th>
                <th className="px-4 py-2">时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {recentRequests.map((req, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={req.id}
                    className={`h-12 transition-colors hover:bg-[#eff6ff]/60 ${
                      isEven ? 'bg-white' : 'bg-[#fafbfc]'
                    }`}
                  >
                    <td className="px-4 py-2 font-mono font-medium text-[#1e293b]">
                      {req.model}
                    </td>
                    <td className="px-4 py-2 text-[#1e293b]">
                      {req.provider}
                    </td>
                    <td className="px-4 py-2 text-[#64748b]">
                      {req.inputTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-[#64748b]">
                      {req.outputTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 font-mono text-[#1e293b]">
                      {req.latencyMs} ms
                    </td>
                    <td className="px-4 py-2 font-mono font-medium text-[#1e293b]">
                      ¥{req.costYuan.toFixed(3)}
                    </td>
                    <td className="px-4 py-2">
                      {req.status === 'success' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
                          failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-[#64748b] text-[11px] font-mono">
                      {req.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
