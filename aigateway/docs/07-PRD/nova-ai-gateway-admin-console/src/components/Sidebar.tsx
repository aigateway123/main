import React from 'react';
import { PageId } from '../types';
import {
  LayoutDashboard,
  Key,
  Server,
  Cpu,
  DollarSign,
  BarChart3,
  FileText,
  Users,
  ShieldCheck,
  LogOut,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  onLogout: () => void;
}

interface NavGroup {
  groupName: string;
  items: {
    id: PageId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  onLogout,
}) => {
  const navGroups: NavGroup[] = [
    {
      groupName: '总览',
      items: [
        { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
      ],
    },
    {
      groupName: '管理',
      items: [
        { id: 'apikeys', label: 'API Key', icon: Key },
        { id: 'providers', label: 'Provider 管理', icon: Server },
        { id: 'models', label: '模型管理', icon: Cpu },
      ],
    },
    {
      groupName: '计费',
      items: [
        { id: 'pricing', label: '定价管理', icon: DollarSign },
        { id: 'billing', label: '账单报表', icon: BarChart3 },
        { id: 'logs', label: '请求日志', icon: FileText },
      ],
    },
    {
      groupName: '权限管理',
      items: [
        { id: 'students', label: '学生管理', icon: Users },
        { id: 'roles', label: '角色管理', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-[#e2e8f0] flex flex-col h-full justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 border-b border-[#e2e8f0] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-[#1e293b] text-base leading-snug tracking-tight">
              Nova AI Gateway
            </div>
            <div className="text-[11px] text-[#64748b] font-medium tracking-wide uppercase">
              Management Portal
            </div>
          </div>
        </div>

        {/* Navigation Item Groups */}
        <div className="py-4 px-2 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[11px] font-semibold text-[#64748b] tracking-wider uppercase mb-1.5">
                {group.groupName}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectPage(item.id)}
                    className={`w-full h-10 px-3 flex items-center gap-3 text-sm font-medium transition-all duration-150 rounded-md ${
                      isActive
                        ? 'text-[#2563eb] bg-blue-50 font-medium border-l-4 border-[#2563eb]'
                        : 'text-[#1e293b] hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#2563eb]' : 'text-[#64748b]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* User Profile & Logout Area at Bottom */}
      <div className="p-3 border-t border-[#e2e8f0] bg-white">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 text-[#2563eb] font-bold text-xs flex items-center justify-center border border-[#2563eb]/20 shrink-0">
              AD
            </div>
            <div className="truncate text-left">
              <div className="text-xs font-semibold text-[#1e293b] truncate">
                系统管理员
              </div>
              <div className="text-[11px] text-[#64748b] truncate">
                admin@nova.ai
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="退出登录"
            className="p-1.5 text-[#64748b] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
