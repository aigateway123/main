import React, { useState } from 'react';
import { ModelItem, ProviderItem } from '../../types';
import { Cpu, Plus, Edit, Trash2, X, Link, Layers } from 'lucide-react';

interface ModelViewProps {
  models: ModelItem[];
  providers: ProviderItem[];
  onAddModel: (m: Omit<ModelItem, 'id' | 'boundProviders'>) => void;
  onUpdateModel: (m: ModelItem) => void;
  onDeleteModel: (id: string) => void;
  onBindProvider: (
    modelId: string,
    binding: { providerName: string; weight: number }
  ) => void;
}

export const ModelView: React.FC<ModelViewProps> = ({
  models,
  providers,
  onAddModel,
  onUpdateModel,
  onDeleteModel,
  onBindProvider,
}) => {
  // Modal states
  const [showModelModal, setShowModelModal] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelItem | null>(null);

  const [showBindModal, setShowBindModal] = useState(false);
  const [bindTargetModel, setBindTargetModel] = useState<ModelItem | null>(
    null
  );

  // Model Form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Bind Provider Form
  const [selectedProviderName, setSelectedProviderName] = useState('');
  const [bindWeight, setBindWeight] = useState<number>(100);

  const handleOpenAddModel = () => {
    setEditingModel(null);
    setName('');
    setCode('');
    setStatus('active');
    setShowModelModal(true);
  };

  const handleOpenEditModel = (model: ModelItem) => {
    setEditingModel(model);
    setName(model.name);
    setCode(model.code);
    setStatus(model.status);
    setShowModelModal(true);
  };

  const handleModelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editingModel) {
      onUpdateModel({
        ...editingModel,
        name,
        code,
        status,
      });
    } else {
      onAddModel({
        name,
        code,
        status,
      });
    }
    setShowModelModal(false);
  };

  const handleOpenBindModal = (model: ModelItem) => {
    setBindTargetModel(model);
    setSelectedProviderName(providers[0]?.name || '');
    setBindWeight(100);
    setShowBindModal(true);
  };

  const handleBindSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bindTargetModel || !selectedProviderName) return;
    onBindProvider(bindTargetModel.id, {
      providerName: selectedProviderName,
      weight: bindWeight,
    });
    setShowBindModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-[#e2e8f0]">
        <div>
          <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#2563eb]" />
            模型配置与路由
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            定义标准 LLM 模型代码与后侧 Provider 节点的绑定转发策略
          </p>
        </div>
        <button
          onClick={handleOpenAddModel}
          className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          添加 Model
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 space-y-4">
        <div className="overflow-x-auto rounded border border-[#e2e8f0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-semibold h-10">
                <th className="px-4 py-2">模型名称</th>
                <th className="px-4 py-2">模型编码 (code)</th>
                <th className="px-4 py-2">状态</th>
                <th className="px-4 py-2">绑定的 Provider</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {models.map((item, index) => {
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
                    <td className="px-4 py-2">
                      <code className="bg-[#f1f5f9] text-[#2563eb] px-2 py-0.5 rounded font-mono text-[11px] font-semibold border border-[#e2e8f0]">
                        {item.code}
                      </code>
                    </td>
                    <td className="px-4 py-2">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.boundProviders && item.boundProviders.length > 0 ? (
                          <>
                            {item.boundProviders.map((p, pIdx) => (
                              <span
                                key={pIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60"
                              >
                                {p.providerName}
                                <span className="text-[10px] text-blue-500 font-mono">
                                  ({p.weight}%)
                                </span>
                              </span>
                            ))}
                            <button
                              onClick={() => handleOpenBindModal(item)}
                              title="追加绑定节点"
                              className="px-1.5 py-0.5 border border-dashed border-[#2563eb]/50 text-[#2563eb] rounded text-[10px] hover:bg-blue-50 transition-colors"
                            >
                              + 追加
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenBindModal(item)}
                            className="px-2.5 py-1 border border-dashed border-[#2563eb] text-[#2563eb] hover:bg-blue-50 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            + 绑定 Provider
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModel(item)}
                        className="px-2 py-1 text-[#2563eb] hover:bg-blue-50 border border-blue-200 rounded text-xs font-medium transition-colors cursor-pointer"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => onDeleteModel(item.id)}
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

      {/* Add / Edit Model Modal */}
      {showModelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-xl font-bold text-[#1e293b]">
                {editingModel ? '编辑模型' : '添加模型'}
              </h3>
              <button
                onClick={() => setShowModelModal(false)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModelSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  模型显示名称
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="如：GPT-4o Omni"
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  模型编码 (Code)
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="如：gpt-4o"
                  className="w-full h-9 px-3 text-xs font-mono bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  模型状态
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'active' | 'inactive')
                  }
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                >
                  <option value="active">Active (启用中)</option>
                  <option value="inactive">Inactive (下线归档)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowModelModal(false)}
                  className="h-9 px-4 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 font-medium text-xs rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors shadow-xs"
                >
                  保存模型
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bind Provider Modal */}
      {showBindModal && bindTargetModel && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="text-xl font-bold text-[#1e293b]">
                绑定 Provider 到 [{bindTargetModel.name}]
              </h3>
              <button
                onClick={() => setShowBindModal(false)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBindSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  选择 Provider 供应商节点
                </label>
                <select
                  value={selectedProviderName}
                  onChange={(e) => setSelectedProviderName(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.baseUrl})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  分流权重 (Weight %)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={bindWeight}
                  onChange={(e) => setBindWeight(parseInt(e.target.value) || 100)}
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowBindModal(false)}
                  className="h-9 px-4 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 font-medium text-xs rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors shadow-xs"
                >
                  确认绑定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
