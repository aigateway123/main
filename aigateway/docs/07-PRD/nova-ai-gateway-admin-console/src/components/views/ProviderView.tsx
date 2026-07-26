import React, { useState } from 'react';
import { ProviderItem } from '../../types';
import { Server, Plus, Edit, Trash2, X, Check, Globe } from 'lucide-react';

interface ProviderViewProps {
  providers: ProviderItem[];
  onAddProvider: (p: Omit<ProviderItem, 'id'>) => void;
  onUpdateProvider: (p: ProviderItem) => void;
  onDeleteProvider: (id: string) => void;
}

export const ProviderView: React.FC<ProviderViewProps> = ({
  providers,
  onAddProvider,
  onUpdateProvider,
  onDeleteProvider,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProviderItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiPath, setApiPath] = useState('/chat/completions');
  const [apiKeyRef, setApiKeyRef] = useState('');
  const [priority, setPriority] = useState<number>(1);
  const [weight, setWeight] = useState<number>(100);
  const [enabled, setEnabled] = useState<boolean>(true);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setBaseUrl('https://api.openai.com/v1');
    setApiPath('/chat/completions');
    setApiKeyRef('env:OPENAI_API_KEY');
    setPriority(1);
    setWeight(100);
    setEnabled(true);
    setShowModal(true);
  };

  const handleOpenEdit = (item: ProviderItem) => {
    setEditingItem(item);
    setName(item.name);
    setBaseUrl(item.baseUrl);
    setApiPath(item.apiPath);
    setApiKeyRef(item.apiKeyRef);
    setPriority(item.priority);
    setWeight(item.weight);
    setEnabled(item.enabled);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !baseUrl.trim()) return;

    if (editingItem) {
      onUpdateProvider({
        ...editingItem,
        name,
        baseUrl,
        apiPath,
        apiKeyRef,
        priority,
        weight,
        enabled,
      });
    } else {
      onAddProvider({
        name,
        baseUrl,
        apiPath,
        apiKeyRef,
        priority,
        weight,
        enabled,
      });
    }
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
      {/* Top Header Row with Add Provider Button */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-[#e2e8f0]">
        <div>
          <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
            <Server className="w-5 h-5 text-[#2563eb]" />
            Provider 供应商管理
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            配置 OpenAI、DeepSeek、Azure 等后端 LLM 接口节点、优先级及分流权重
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          添加 Provider
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 space-y-4">
        <div className="overflow-x-auto rounded border border-[#e2e8f0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-semibold h-10">
                <th className="px-4 py-2">供应商名称</th>
                <th className="px-4 py-2">Base URL</th>
                <th className="px-4 py-2">API 路径</th>
                <th className="px-4 py-2">优先级</th>
                <th className="px-4 py-2">权重</th>
                <th className="px-4 py-2">状态</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {providers.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={item.id}
                    className={`h-12 transition-colors hover:bg-[#eff6ff]/60 ${
                      isEven ? 'bg-white' : 'bg-[#fafbfc]'
                    }`}
                  >
                    <td className="px-4 py-2 font-bold text-[#1e293b]">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 font-mono text-[#64748b] max-w-[200px] truncate" title={item.baseUrl}>
                      {item.baseUrl}
                    </td>
                    <td className="px-4 py-2 font-mono text-[#64748b]">
                      {item.apiPath}
                    </td>
                    <td className="px-4 py-2 font-mono font-semibold text-[#1e293b]">
                      {item.priority}
                    </td>
                    <td className="px-4 py-2 font-mono font-semibold text-[#1e293b]">
                      {item.weight}
                    </td>
                    <td className="px-4 py-2">
                      {item.enabled ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          启用
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          禁用
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-2 py-1 text-[#2563eb] hover:bg-blue-50 border border-blue-200 rounded text-xs font-medium transition-colors cursor-pointer"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => onDeleteProvider(item.id)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded text-xs font-medium transition-colors cursor-pointer"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-xl font-bold text-[#1e293b]">
                {editingItem ? '编辑 Provider' : '添加 Provider'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: 4 Inputs (2x2 grid or stacked 4 fields as specified: 名称, Base URL, API 路径, API Key 引用) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1e293b]">
                    供应商名称
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如：OpenAI Direct / DeepSeek Official"
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1e293b]">
                    Base URL
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://api.openai.com/v1"
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1e293b]">
                    API 路径
                  </label>
                  <input
                    type="text"
                    value={apiPath}
                    onChange={(e) => setApiPath(e.target.value)}
                    placeholder="/chat/completions"
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1e293b]">
                    API Key 引用
                  </label>
                  <input
                    type="text"
                    value={apiKeyRef}
                    onChange={(e) => setApiKeyRef(e.target.value)}
                    placeholder="env:OPENAI_API_KEY"
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>
              </div>

              {/* Row 2: 优先级 + 权重 (两个数字输入框并排) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1e293b]">
                    优先级 (数字越小越优先)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={priority}
                    onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1e293b]">
                    权重 (流量分发比例)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value) || 100)}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>
              </div>

              {/* Switch below */}
              <div className="pt-2 flex items-center justify-between border-t border-[#e2e8f0]">
                <div>
                  <div className="text-xs font-semibold text-[#1e293b]">
                    启用此 Provider 状态
                  </div>
                  <div className="text-[11px] text-[#64748b]">
                    禁用后网关将自动停止向该节点转发流量
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnabled(!enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    enabled ? 'bg-[#2563eb]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-9 px-4 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 font-medium text-xs rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors shadow-xs"
                >
                  保存 Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
