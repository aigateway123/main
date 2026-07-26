import React, { useState } from 'react';
import { ApiKeyItem } from '../../types';
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  X,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

interface ApiKeyViewProps {
  apiKeys: ApiKeyItem[];
  onCreateKey: (keyData: { name: string; scope: string }) => {
    fullKey: string;
    newKey: ApiKeyItem;
  };
  onRevokeKey: (id: string) => void;
}

export const ApiKeyView: React.FC<ApiKeyViewProps> = ({
  apiKeys,
  onCreateKey,
  onRevokeKey,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdKeyInfo, setCreatedKeyInfo] = useState<{
    fullKey: string;
    prefix: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form states
  const [keyName, setKeyName] = useState('');
  const [scope, setScope] = useState('全部模型 (All Models)');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    const res = onCreateKey({ name: keyName, scope });
    setCreatedKeyInfo({ fullKey: res.fullKey, prefix: res.newKey.prefix });
    setShowCreateModal(false);
    setKeyName('');
  };

  const handleCopyKey = () => {
    if (!createdKeyInfo) return;
    navigator.clipboard.writeText(createdKeyInfo.fullKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
      {/* Top Header Row with Create Key Button */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-[#e2e8f0]">
        <div>
          <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
            <Key className="w-5 h-5 text-[#2563eb]" />
            API Key 密钥列表
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            用于客户端调用 Nova AI Gateway 的统一鉴权凭证
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          创建 Key
        </button>
      </div>

      {/* Blue Top Notification Bar when Key Created */}
      {createdKeyInfo && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#2563eb] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Key 创建成功！请立即复制保存
            </div>
            <p className="text-[11px] text-[#64748b]">
              出于安全考量，完整 Key 将仅展示一次。关闭提示后将无法再次完整查看。
            </p>
            <div className="mt-2 font-mono text-xs bg-white text-[#1e293b] px-3 py-2 rounded border border-blue-200 select-all font-semibold break-all">
              {createdKeyInfo.fullKey}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyKey}
              className="h-8 px-3 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  复制
                </>
              )}
            </button>
            <button
              onClick={() => setCreatedKeyInfo(null)}
              className="p-1.5 text-[#64748b] hover:text-[#1e293b] hover:bg-blue-100/50 rounded"
              title="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 space-y-4">
        <div className="overflow-x-auto rounded border border-[#e2e8f0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-semibold h-10">
                <th className="px-4 py-2">密钥前缀</th>
                <th className="px-4 py-2">密钥名称</th>
                <th className="px-4 py-2">权限范围</th>
                <th className="px-4 py-2">状态</th>
                <th className="px-4 py-2">创建时间</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {apiKeys.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={item.id}
                    className={`h-12 transition-colors hover:bg-[#eff6ff]/60 ${
                      isEven ? 'bg-white' : 'bg-[#fafbfc]'
                    }`}
                  >
                    <td className="px-4 py-2 font-mono font-bold text-[#1e293b]">
                      {item.prefix}...
                    </td>
                    <td className="px-4 py-2 font-medium text-[#1e293b]">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 text-[#64748b]">{item.scope}</td>
                    <td className="px-4 py-2">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          revoked
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-[#64748b] font-mono text-[11px]">
                      {item.createdAt}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {item.status === 'active' ? (
                        <button
                          onClick={() => onRevokeKey(item.id)}
                          className="px-2.5 py-1 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          撤销
                        </button>
                      ) : (
                        <span className="text-xs text-[#64748b]">已失效</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-xl font-bold text-[#1e293b]">创建 API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  密钥名称
                </label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="例如：生产服务器路由Key / 客户端A"
                  className="w-full h-9 px-3 text-sm bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  权限范围 (Scope)
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full h-9 px-3 text-sm bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                >
                  <option value="全部模型 (All Models)">全部模型 (All Models)</option>
                  <option value="GPT-4o, DeepSeek-V3">仅限高阶推理模型 (GPT-4o, DeepSeek-V3)</option>
                  <option value="基础开源模型 (Qwen, Llama)">仅限基础开源模型</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200/60 rounded text-xs text-[#2563eb] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#2563eb]" />
                <span>生成后将随机分配 256-bit 高强度 Token 字符串，自动继承当前租户防刷新鉴权。</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="h-9 px-4 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 font-medium text-xs rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors shadow-xs"
                >
                  确认生成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
