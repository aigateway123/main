import React, { useState } from 'react';
import { X, Key, Plus, Copy, Check, Eye, EyeOff, BarChart3, Settings, ShieldCheck, Zap, Database, Terminal } from 'lucide-react';

interface ConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsoleModal: React.FC<ConsoleModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'keys' | 'usage' | 'routing'>('keys');
  const [keysList, setKeysList] = useState([
    { id: 'key-1', name: '生产环境网关Key', key: 'nv-sk-98327498234729384234', created: '2026-07-10', status: 'Active' },
    { id: 'key-2', name: '测试环境Key', key: 'nv-sk-11209384029384029384', created: '2026-07-20', status: 'Active' },
  ]);

  const [newKeyName, setNewKeyName] = useState('');
  const [showCreatedKey, setShowCreatedKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const randomHex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKeyObj = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `nv-sk-${randomHex}`,
      created: '2026-07-27',
      status: 'Active',
    };

    setKeysList([newKeyObj, ...keysList]);
    setShowCreatedKey(newKeyObj.key);
    setNewKeyName('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <Terminal className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Nova AI 控制台 & API Key 管理</span>
                <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-mono">
                  Console v2.5
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                统一创建与轮换全局网关密钥，配置高可用切流与降级策略
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-slate-50/50 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'keys'
                ? 'border-blue-600 text-blue-600 bg-white font-bold shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API 密钥管理 (Keys)</span>
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'usage'
                ? 'border-blue-600 text-blue-600 bg-white font-bold shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Token 消耗与监控</span>
          </button>
          <button
            onClick={() => setActiveTab('routing')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'routing'
                ? 'border-blue-600 text-blue-600 bg-white font-bold shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>智能降级路由配置</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'keys' && (
            <div className="space-y-6">
              {/* Key creation box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase">
                  新建统一网关 API Key
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="输入 Key 名称 (例如: Production-API-Key)"
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    onClick={handleCreateKey}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>生成新密钥</span>
                  </button>
                </div>

                {showCreatedKey && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <p className="font-bold text-emerald-800">✅ 密钥创建成功！请妥善保存此 API Key：</p>
                    <div className="flex items-center justify-between font-mono bg-white p-2 rounded border border-emerald-200 text-emerald-900 font-semibold">
                      <span>{showCreatedKey}</span>
                      <button
                        onClick={() => handleCopy('created', showCreatedKey)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs"
                      >
                        {copiedId === 'created' ? '已复制' : '复制'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Keys Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">现有生效 API 密钥列表</h4>
                <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Key 名称</th>
                        <th className="p-3">API Key 签名</th>
                        <th className="p-3">创建日期</th>
                        <th className="p-3">状态</th>
                        <th className="p-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {keysList.map((k) => (
                        <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-slate-900">{k.name}</td>
                          <td className="p-3 font-mono text-slate-600">
                            {k.key.substring(0, 10)}...{k.key.substring(k.key.length - 4)}
                          </td>
                          <td className="p-3 text-slate-500">{k.created}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                              {k.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleCopy(k.id, k.key)}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                            >
                              {copiedId === k.id ? '已复制' : '复制密钥'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">本月已用 Token</span>
                  <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">12,480,000</p>
                  <span className="text-emerald-600 font-semibold">↑ 较上月增长 14%</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">本月预估支出</span>
                  <p className="text-2xl font-extrabold text-blue-600 font-mono mt-1">$ 38.40</p>
                  <span className="text-blue-600 font-semibold">缓存节省约为 $ 86.00</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">请求成功率</span>
                  <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">99.99%</p>
                  <span className="text-slate-500">自动切流 14 次失败响应</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">24 小时并发请求趋势监控 (实时)</h4>
                <p className="text-slate-500 max-w-md mx-auto">
                  控制台已连接 Prometheus 与 Grafana 面板，点击下方链接可在全屏视角查看分模型 QPS 与延迟百分位统计。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'routing' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">主/备模型自动降级策略 (Auto-Fallback)</h4>
                <p className="text-slate-600">
                  当主选择的模型 (如 OpenAI GPT-4o) 发生 5xx 报错或连续超时 3 秒时，Nova 网关将无缝将请求转发至备用模型，对客户端完全透明。
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800">首选模型 (Primary): GPT-4o</span>
                    <span className="text-emerald-600 font-semibold">健康状态正常</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800">次级备用 (Fallback 1): DeepSeek V3</span>
                    <span className="text-blue-600 font-semibold">准备就绪</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800">兜底模型 (Fallback 2): Qwen-2.5-72B</span>
                    <span className="text-blue-600 font-semibold">准备就绪</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex justify-between items-center px-6">
          <span>当前环境: 统一接入点 <code className="font-mono text-blue-600">api.novagateway.ai</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs"
          >
            关闭控制台
          </button>
        </div>
      </div>
    </div>
  );
};
