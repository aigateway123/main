import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer, 
  Flame, 
  Gauge, 
  Activity, 
  Filter, 
  ArrowUpRight, 
  Info,
  Check
} from 'lucide-react';
import { AnomalySample } from '../types';
import { ANOMALY_SAMPLES } from '../data/mockData';

interface AnomalyDetectionProps {
  anomalies?: AnomalySample[];
  onTriageChange?: (sampleId: string, status: 'flagged' | 'excluded' | 'verified') => void;
}

export const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({
  anomalies = ANOMALY_SAMPLES,
  onTriageChange,
}) => {
  const [samples, setSamples] = useState<AnomalySample[]>(anomalies);
  const [activeFilter, setActiveFilter] = useState<'all' | '高' | '中'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (id: string, newStatus: 'excluded' | 'verified') => {
    setSamples((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    const target = samples.find((s) => s.id === id);
    const actionName = newStatus === 'excluded' ? '已标记剔除 (Exclude)' : '已标记保留复核 (Verified)';
    setToastMessage(`${target?.sampleIndex} ${actionName}`);
    setTimeout(() => setToastMessage(null), 2500);

    if (onTriageChange) {
      onTriageChange(id, newStatus);
    }
  };

  const filteredSamples = samples.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.riskLevel === activeFilter;
  });

  return (
    <section className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] border border-blue-500/60 text-white text-xs font-mono px-4 py-2.5 rounded-xl shadow-2xl shadow-blue-950/80 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Prominent Alert Statement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">
            异常检测 (Anomaly Alerts)
          </h3>
          <p className="text-xs sm:text-sm text-[#cbd5e1] mt-1 pl-3 font-medium">
            <span className="text-red-400 font-bold">AI发现 3 个值得关注的异常样本。</span>
            <span className="text-[#64748b] font-normal ml-2">（Isolation Forest 孤立森林与 3σ 置信界限双重校验）</span>
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-[#1e293b] self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/40'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            全部 (3)
          </button>
          <button
            onClick={() => setActiveFilter('高')}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              activeFilter === '高'
                ? 'bg-red-500/20 text-red-400 font-semibold border border-red-500/40'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            高风险 (2)
          </button>
          <button
            onClick={() => setActiveFilter('中')}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              activeFilter === '中'
                ? 'bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/40'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            中风险 (1)
          </button>
        </div>
      </div>

      {/* 3 Anomaly Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {filteredSamples.map((sample) => {
          const isHighRisk = sample.riskLevel === '高';
          const isExcluded = sample.status === 'excluded';
          const isVerified = sample.status === 'verified';

          return (
            <div
              key={sample.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                isExcluded
                  ? 'bg-black/20 border-[#1e293b] opacity-60'
                  : isHighRisk
                  ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                  : 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40'
              }`}
            >
              <div>
                {/* Card Top / ID & Risk Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-red-400">
                    <span>{sample.sampleIndex}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isHighRisk ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                      }`}
                    >
                      {isHighRisk ? 'HIGH RISK' : 'MEDIUM'}
                    </span>
                    <span className="text-[10px] text-[#64748b] font-mono">Score: {sample.score}</span>
                  </div>
                </div>

                {/* Main Metric Value & Deviation Detail */}
                <div className="bg-black/40 rounded-lg p-2.5 border border-[#1e293b] mb-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94a3b8]">{sample.abnormalFeature}:</span>
                    <span className="font-mono font-bold text-white">{sample.observedValue}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                    <span>预期正常基线:</span>
                    <span className="font-mono">{sample.expectedRange}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-red-400 font-mono">
                    <span>离群偏离度:</span>
                    <span>{sample.deviation}</span>
                  </div>
                </div>

                {/* AI Root Cause Diagnosis */}
                <div className="text-xs text-[#cbd5e1] space-y-1 mb-3">
                  <div className="flex items-start gap-1">
                    <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] text-[#94a3b8] leading-relaxed">
                      <strong className="text-white font-semibold">AI 归因诊断：</strong>
                      {sample.cause}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-400 pl-4">
                    💡 建议处理：{sample.suggestion}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 border-t border-[#1e293b] flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-[#64748b]">
                  {isExcluded ? '已隔离剔除' : isVerified ? '已确认保留' : '待处置'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAction(sample.id, 'excluded')}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      isExcluded
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-black/40 hover:bg-red-500/20 text-[#94a3b8] hover:text-red-300 border border-[#1e293b]'
                    }`}
                  >
                    {isExcluded ? '已剔除' : '一键剔除'}
                  </button>
                  <button
                    onClick={() => handleAction(sample.id, 'verified')}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      isVerified
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-black/40 hover:bg-emerald-500/20 text-[#94a3b8] hover:text-emerald-300 border border-[#1e293b]'
                    }`}
                  >
                    {isVerified ? '已保留' : '保留复核'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
