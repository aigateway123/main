import React from 'react';
import { PageId } from '../types';
import {
  Bell,
  Search,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  login: { title: '系统登录', subtitle: 'Nova AI Gateway 管理系统鉴权登录' },
  dashboard: { title: '仪表盘', subtitle: '网关全局请求量、Token消耗、延迟及成本实时监控' },
  apikeys: { title: 'API Key 管理', subtitle: '客户端密钥生成、作用域隔离与安全撤销控制' },
  providers: { title: 'Provider 管理', subtitle: '大模型供应商节点、优先级调度与负载权重配置' },
  models: { title: '模型管理', subtitle: '统一模型标识命名与多 Provider 实例路由绑定' },
  pricing: { title: '定价管理', subtitle: '阶梯定价、统一定价与高峰期分时段策略配置' },
  billing: { title: '账单报表', subtitle: '按用户/模型维度的 Token 消费统计与多条件筛选' },
  logs: { title: '请求日志', subtitle: '秒级实时网关转发日志、延迟响应与异常报错排查' },
  students: { title: '学生管理', subtitle: '高校/机构学生账号额度授权与模型细粒度访问控制' },
  roles: { title: '角色管理', subtitle: '系统角色定义与基于 RBAC 的底层权限列表映射' },
};

export const Header: React.FC<HeaderProps> = ({ currentPage, onSelectPage }) => {
  const currentInfo = PAGE_TITLES[currentPage] || {
    title: 'Nova Gateway',
    subtitle: 'AI 网关统一管理后台',
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-[#e2e8f0] flex items-center justify-between shrink-0 z-10">
      {/* Title section */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#1e293b] leading-tight">
            {currentInfo.title}
          </h1>
          <p className="text-xs text-[#64748b] font-normal">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick Page Jump Selector for evaluation */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#f8f9fa] p-1 rounded-md border border-[#e2e8f0] text-xs">
          <span className="text-[#64748b] px-2 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" /> 页面快速切换:
          </span>
          <select
            value={currentPage}
            onChange={(e) => onSelectPage(e.target.value as PageId)}
            className="bg-white border border-[#e2e8f0] text-[#1e293b] font-medium rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
          >
            <option value="login">1. 登录页</option>
            <option value="dashboard">2. 仪表盘</option>
            <option value="apikeys">3. API Key 管理</option>
            <option value="providers">4. Provider 管理</option>
            <option value="models">5. 模型管理</option>
            <option value="pricing">6. 定价管理</option>
            <option value="billing">7. 账单报表</option>
            <option value="logs">8. 请求日志</option>
            <option value="students">9. 学生管理</option>
            <option value="roles">10. 角色管理</option>
          </select>
        </div>

        {/* System Status Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gateway: 正常运行</span>
        </div>

        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="搜索全局配置..."
            className="w-40 focus:w-56 transition-all h-8 pl-8 pr-3 text-xs bg-[#f8f9fa] border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2563eb]"
          />
        </div>

        {/* Notification Bell */}
        <button
          title="系统通知"
          className="p-1.5 text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8f9fa] rounded-md transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#2563eb] rounded-full" />
        </button>

        {/* Help */}
        <button
          title="使用文档"
          className="p-1.5 text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8f9fa] rounded-md transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
