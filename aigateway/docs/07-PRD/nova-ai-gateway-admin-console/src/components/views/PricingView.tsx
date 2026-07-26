import React, { useState } from 'react';
import { PricingItem } from '../../types';
import { DollarSign, Edit, X, Clock, AlertCircle } from 'lucide-react';

interface PricingViewProps {
  pricings: PricingItem[];
  onUpdatePricing: (p: PricingItem) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  pricings,
  onUpdatePricing,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);

  // Form states
  const [pricingType, setPricingType] = useState<'unified' | 'timebased'>(
    'unified'
  );
  const [inputPrice, setInputPrice] = useState<number>(0.018);
  const [outputPrice, setOutputPrice] = useState<number>(0.072);

  // Timebased form states
  const [peakStartTime, setPeakStartTime] = useState('09:00');
  const [peakEndTime, setPeakEndTime] = useState('21:00');
  const [peakInputPrice, setPeakInputPrice] = useState<number>(0.025);
  const [peakOutputPrice, setPeakOutputPrice] = useState<number>(0.095);
  const [offPeakInputPrice, setOffPeakInputPrice] = useState<number>(0.01);
  const [offPeakOutputPrice, setOffPeakOutputPrice] = useState<number>(0.04);

  const handleOpenEdit = (item: PricingItem) => {
    setEditingItem(item);
    setPricingType(item.pricingType);
    setInputPrice(item.inputPrice);
    setOutputPrice(item.outputPrice);

    setPeakStartTime(item.peakStartTime || '09:00');
    setPeakEndTime(item.peakEndTime || '21:00');
    setPeakInputPrice(item.peakInputPrice || item.inputPrice * 1.3);
    setPeakOutputPrice(item.peakOutputPrice || item.outputPrice * 1.3);
    setOffPeakInputPrice(item.offPeakInputPrice || item.inputPrice * 0.7);
    setOffPeakOutputPrice(item.offPeakOutputPrice || item.outputPrice * 0.7);

    setShowEditModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    onUpdatePricing({
      ...editingItem,
      pricingType,
      inputPrice,
      outputPrice,
      peakStartTime,
      peakEndTime,
      peakInputPrice,
      peakOutputPrice,
      offPeakInputPrice,
      offPeakOutputPrice,
    });

    setShowEditModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-[#e2e8f0]">
        <div>
          <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#2563eb]" />
            模型计费与定价规则
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            设定千 Token 吞吐单价，支持高峰期与低谷期分时段阶梯计费策略
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 space-y-4">
        <div className="overflow-x-auto rounded border border-[#e2e8f0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-semibold h-10">
                <th className="px-4 py-2">模型名称</th>
                <th className="px-4 py-2">模型代码</th>
                <th className="px-4 py-2">定价类型</th>
                <th className="px-4 py-2">Input 价格 (¥/1k)</th>
                <th className="px-4 py-2">Output 价格 (¥/1k)</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {pricings.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={item.id}
                    className={`h-12 transition-colors hover:bg-[#eff6ff]/60 ${
                      isEven ? 'bg-white' : 'bg-[#fafbfc]'
                    }`}
                  >
                    <td className="px-4 py-2 font-bold text-[#1e293b]">
                      {item.modelName}
                    </td>
                    <td className="px-4 py-2 font-mono text-[#64748b]">
                      <code>{item.modelCode}</code>
                    </td>
                    <td className="px-4 py-2">
                      {item.pricingType === 'unified' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                          统一定价
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/60">
                          分时段
                        </span>
                      )}
                    </td>

                    {/* Input Price Column */}
                    <td className="px-4 py-2 font-mono text-[#1e293b]">
                      {item.pricingType === 'unified' ? (
                        <span>¥{item.inputPrice.toFixed(4)} / 1k</span>
                      ) : (
                        <div className="text-[11px] leading-tight space-y-0.5">
                          <div className="text-[#1e293b]">
                            Peak: ¥{item.peakInputPrice?.toFixed(4)}
                          </div>
                          <div className="text-[#64748b]">
                            OffPeak: ¥{item.offPeakInputPrice?.toFixed(4)}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Output Price Column */}
                    <td className="px-4 py-2 font-mono text-[#1e293b]">
                      {item.pricingType === 'unified' ? (
                        <span>¥{item.outputPrice.toFixed(4)} / 1k</span>
                      ) : (
                        <div className="text-[11px] leading-tight space-y-0.5">
                          <div className="text-[#1e293b]">
                            Peak: ¥{item.peakOutputPrice?.toFixed(4)}
                          </div>
                          <div className="text-[#64748b]">
                            OffPeak: ¥{item.offPeakOutputPrice?.toFixed(4)}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Action Column: Gray edit button as specified */}
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 rounded text-xs font-medium transition-colors cursor-pointer"
                      >
                        编辑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header showing model name + code */}
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div>
                <h3 className="text-xl font-bold text-[#1e293b]">
                  编辑定价 - {editingItem.modelName}
                </h3>
                <p className="text-xs font-mono text-[#64748b] mt-0.5">
                  模型代码: {editingItem.modelCode}
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pricing Type Switcher */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b]">
                  定价类型切换
                </label>
                <select
                  value={pricingType}
                  onChange={(e) =>
                    setPricingType(e.target.value as 'unified' | 'timebased')
                  }
                  className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                >
                  <option value="unified">统一定价 (全天固定单价)</option>
                  <option value="timebased">分时段 (高峰与低谷动态调价)</option>
                </select>
              </div>

              {pricingType === 'unified' ? (
                /* Unified Pricing Fields */
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#f8f9fa] rounded border border-[#e2e8f0]">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1e293b]">
                      Input 单价 (¥ / 1k Tokens)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={inputPrice}
                      onChange={(e) => setInputPrice(parseFloat(e.target.value) || 0)}
                      className="w-full h-9 px-3 text-xs font-mono bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1e293b]">
                      Output 单价 (¥ / 1k Tokens)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={outputPrice}
                      onChange={(e) => setOutputPrice(parseFloat(e.target.value) || 0)}
                      className="w-full h-9 px-3 text-xs font-mono bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                      required
                    />
                  </div>
                </div>
              ) : (
                /* Timebased Pricing Fields */
                <div className="space-y-3 p-3 bg-[#f8f9fa] rounded border border-[#e2e8f0]">
                  {/* High Peak Start/End Time Side-by-Side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1e293b] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#2563eb]" /> 高峰开始时间
                      </label>
                      <input
                        type="time"
                        value={peakStartTime}
                        onChange={(e) => setPeakStartTime(e.target.value)}
                        className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1e293b] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#2563eb]" /> 高峰结束时间
                      </label>
                      <input
                        type="time"
                        value={peakEndTime}
                        onChange={(e) => setPeakEndTime(e.target.value)}
                        className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                        required
                      />
                    </div>
                  </div>

                  {/* 4 Price Inputs: Peak Input, Peak Output, OffPeak Input, OffPeak Output */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1e293b]">
                        Peak Input 价 (¥/1k)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={peakInputPrice}
                        onChange={(e) => setPeakInputPrice(parseFloat(e.target.value) || 0)}
                        className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-[#e2e8f0] rounded text-[#1e293b]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1e293b]">
                        Peak Output 价 (¥/1k)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={peakOutputPrice}
                        onChange={(e) => setPeakOutputPrice(parseFloat(e.target.value) || 0)}
                        className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-[#e2e8f0] rounded text-[#1e293b]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1e293b]">
                        OffPeak Input 价 (¥/1k)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={offPeakInputPrice}
                        onChange={(e) => setOffPeakInputPrice(parseFloat(e.target.value) || 0)}
                        className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-[#e2e8f0] rounded text-[#1e293b]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1e293b]">
                        OffPeak Output 价 (¥/1k)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={offPeakOutputPrice}
                        onChange={(e) => setOffPeakOutputPrice(parseFloat(e.target.value) || 0)}
                        className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-[#e2e8f0] rounded text-[#1e293b]"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="h-9 px-4 border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 font-medium text-xs rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors shadow-xs"
                >
                  保存费率配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
