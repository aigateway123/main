import React, { useState } from 'react';
import { 
  History, 
  Star, 
  Settings, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { mockTaskHistory, mockLeads } from '../data/mockData';
import { CompanyLead } from '../types';

interface TaskCenterViewProps {
  onSelectLead: (lead: CompanyLead) => void;
  onRerunTask: (product: string, market: string) => void;
}

export const TaskCenterView: React.FC<TaskCenterViewProps> = ({
  onSelectLead,
  onRerunTask,
}) => {
  const [tab, setTab] = useState<'history' | 'starred' | 'settings'>('history');
  const starredLeads = mockLeads.filter(l => l.isStarred);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">任务与收藏中心</h2>
        <p className="text-xs text-slate-500 mt-1">
          管理历史采集任务、重点关注客户档案及 AI 采集规则配置
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setTab('history')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            tab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>历史采集任务 ({mockTaskHistory.length})</span>
        </button>

        <button
          onClick={() => setTab('starred')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            tab === 'starred'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>重点客户收藏夹 ({starredLeads.length})</span>
        </button>

        <button
          onClick={() => setTab('settings')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            tab === 'settings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>AI采集与评分偏好设置</span>
        </button>
      </div>

      {/* Tab 1: History */}
      {tab === 'history' && (
        <div className="space-y-2.5">
          {mockTaskHistory.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{task.product}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                    {task.market}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 已完成
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span>创建时间: {task.date}</span>
                  <span>·</span>
                  <span className="text-blue-600 font-medium">已筛选高潜企业: {task.qualifiedCount} 家</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRerunTask(task.product, task.market)}
                  className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                  <span>复用此任务配置</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Starred Leads */}
      {tab === 'starred' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {starredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all cursor-pointer space-y-2.5 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{lead.name}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">{lead.country} · {lead.city}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {lead.overallScore}分
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {lead.summary}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
                <span>查看企业详细画像</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Settings */}
      {tab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5 max-w-2xl">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI 智能评分权重配置</h3>
            <p className="text-xs text-slate-500">
              调整 5 维算分模型权重，定制属于您企业的客户筛选准则
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>产品匹配度权重</span>
                <span className="font-mono font-bold text-blue-600">30%</span>
              </div>
              <input type="range" min="10" max="50" defaultValue="30" className="w-full accent-blue-600 cursor-pointer" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>企业规模与财力权重</span>
                <span className="font-mono font-bold text-blue-600">20%</span>
              </div>
              <input type="range" min="10" max="50" defaultValue="20" className="w-full accent-blue-600 cursor-pointer" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>市场契合度权重</span>
                <span className="font-mono font-bold text-blue-600">20%</span>
              </div>
              <input type="range" min="10" max="50" defaultValue="20" className="w-full accent-blue-600 cursor-pointer" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>采购潜力与体量权重</span>
                <span className="font-mono font-bold text-blue-600">15%</span>
              </div>
              <input type="range" min="5" max="30" defaultValue="15" className="w-full accent-blue-600 cursor-pointer" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>合作意愿与换供可能性权重</span>
                <span className="font-mono font-bold text-blue-600">15%</span>
              </div>
              <input type="range" min="5" max="30" defaultValue="15" className="w-full accent-blue-600 cursor-pointer" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer">
              保存配置偏好
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
