import React, { useState } from 'react';
import { RequestLogItem } from '../../types';
import { FileText, ChevronLeft, ChevronRight, Eye, X, Terminal, Server } from 'lucide-react';

interface RequestLogsViewProps {
  logs: RequestLogItem[];
}

export const RequestLogsView: React.FC<RequestLogsViewProps> = ({ logs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [selectedLog, setSelectedLog] = useState<RequestLogItem | null>(null);

  const totalPages = Math.ceil(logs.length / pageSize) || 1;
  const paginatedLogs = logs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-[#e2e8f0]">
        <div>
          <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2563eb]" />
            网关请求日志
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            网关秒级 API 吞吐转发日志、HTTP 状态码及端到端延迟分析
          </p>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 space-y-4">
        <div className="overflow-x-auto rounded border border-[#e2e8f0]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e2e8f0] text-[#64748b] font-semibold h-10">
                <th className="px-4 py-2">Model (Code)</th>
                <th className="px-4 py-2">Provider</th>
                <th className="px-4 py-2">Input Token</th>
                <th className="px-4 py-2">Output Token</th>
                <th className="px-4 py-2">延迟(ms)</th>
                <th className="px-4 py-2">成本(¥)</th>
                <th className="px-4 py-2">状态</th>
                <th className="px-4 py-2">时间</th>
                <th className="px-4 py-2 text-right">日志</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {paginatedLogs.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={item.id}
                    className={`h-12 transition-colors hover:bg-[#eff6ff]/60 ${
                      isEven ? 'bg-white' : 'bg-[#fafbfc]'
                    }`}
                  >
                    <td className="px-4 py-2">
                      <code className="bg-[#f1f5f9] text-[#2563eb] px-2 py-0.5 rounded font-mono text-[11px] font-semibold border border-[#e2e8f0]">
                        {item.modelCode}
                      </code>
                    </td>
                    <td className="px-4 py-2 font-medium text-[#1e293b]">
                      {item.providerName}
                    </td>
                    <td className="px-4 py-2 font-mono text-[#64748b]">
                      {item.inputTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 font-mono text-[#64748b]">
                      {item.outputTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 font-mono font-medium text-[#1e293b]">
                      {item.latencyMs} ms
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
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => setSelectedLog(item)}
                        className="px-2 py-1 text-[#2563eb] hover:bg-blue-50 border border-blue-200 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        详情
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination: 上一页/下一页 + 当前页/总页数 */}
        <div className="flex items-center justify-between text-xs text-[#64748b] pt-2">
          <div>
            当前第 <span className="font-semibold text-[#1e293b]">{currentPage}</span> 页 / 共{' '}
            <span className="font-semibold text-[#1e293b]">{totalPages}</span> 页 (共 {logs.length} 条记录)
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

      {/* Log Detail Drawer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#2563eb]" />
                <h3 className="text-xl font-bold text-[#1e293b]">
                  请求日志详情 [{selectedLog.id}]
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#f8f9fa] rounded border border-[#e2e8f0]">
                <div>
                  <span className="text-[#64748b]">模型 (Model): </span>
                  <span className="font-mono font-bold text-[#1e293b]">{selectedLog.modelCode}</span>
                </div>
                <div>
                  <span className="text-[#64748b]">供应商 (Provider): </span>
                  <span className="font-semibold text-[#1e293b]">{selectedLog.providerName}</span>
                </div>
                <div>
                  <span className="text-[#64748b]">Client IP: </span>
                  <span className="font-mono text-[#1e293b]">{selectedLog.clientIp || '192.168.1.100'}</span>
                </div>
                <div>
                  <span className="text-[#64748b]">耗时 Latency: </span>
                  <span className="font-mono font-bold text-[#1e293b]">{selectedLog.latencyMs} ms</span>
                </div>
              </div>

              {selectedLog.status === 'failed' && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded font-mono text-xs">
                  <div className="font-bold mb-1">异常报错信息 (Error):</div>
                  {selectedLog.errorMessage || 'HTTP 502 Bad Gateway / Provider Timeout'}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#1e293b]">HTTP Header Trace Dump:</label>
                <pre className="p-3 bg-[#1e293b] text-emerald-400 font-mono rounded text-[11px] overflow-x-auto">
{`{
  "x-nova-gateway-id": "${selectedLog.id}",
  "x-route-provider": "${selectedLog.providerName}",
  "x-model-target": "${selectedLog.modelCode}",
  "x-tokens-input": ${selectedLog.inputTokens},
  "x-tokens-output": ${selectedLog.outputTokens},
  "content-type": "application/json; charset=utf-8"
}`}
                </pre>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e2e8f0] flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="h-9 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-medium text-xs rounded-md transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
