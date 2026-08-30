import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Play, 
  Table, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Sliders,
  FileCheck2
} from 'lucide-react';
import { DatasetMeta } from '../types';
import { PRESET_DATASETS } from '../data/mockData';

interface DataUploaderProps {
  currentDataset: DatasetMeta;
  onSelectDataset: (dataset: DatasetMeta) => void;
  analysisGoal: string;
  onGoalChange: (goal: string) => void;
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
}

export const DataUploader: React.FC<DataUploaderProps> = ({
  currentDataset,
  onSelectDataset,
  analysisGoal,
  onGoalChange,
  onStartAnalysis,
  isAnalyzing,
  hasAnalyzed,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showGoalTemplates, setShowGoalTemplates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goalPresets = [
    '比较实验组 A、B、C 的性能差异，寻找异常样本，并生成适合论文使用的分析图表。',
    '检验优化催化体系在多温度梯度下的动力学差异，定位异常副反应离群样本。',
    '执行组间单因素方差分析 (ANOVA) 与 Tukey HSD 检验，生成 Nature 格式图表与 Results 报告。',
    '筛选高通量筛选 (HTS) 异常样本点，量化实验组 C 协同增效机理与效应量 Cohen\'s d。',
  ];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const customMeta: DatasetMeta = {
        id: `custom-${Date.now()}`,
        fileName: file.name,
        fileType: file.name.endsWith('.csv') ? 'csv' : 'xlsx',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB` || '12.4 MB',
        rowCount: 186420,
        columnCount: 42,
        description: `用户自定义导入实验数据: ${file.name}`,
        uploadTime: new Date().toLocaleString(),
        columns: currentDataset.columns,
        previewRows: currentDataset.previewRows,
      };
      onSelectDataset(customMeta);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const customMeta: DatasetMeta = {
        id: `custom-${Date.now()}`,
        fileName: file.name,
        fileType: file.name.endsWith('.csv') ? 'csv' : 'xlsx',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB` || '15.6 MB',
        rowCount: 186420,
        columnCount: 42,
        description: `用户自定义导入实验数据: ${file.name}`,
        uploadTime: new Date().toLocaleString(),
        columns: currentDataset.columns,
        previewRows: currentDataset.previewRows,
      };
      onSelectDataset(customMeta);
    }
  };

  return (
    <section className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
      {/* Top Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> 数据输入与分析设定
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            实验数据导入与假设配置
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            支持 Excel (.xlsx, .xls) 与 CSV 格式，自动识别对照组设计、缺失值插补与异常检测
          </p>
        </div>

        {/* Dataset Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-[#1e293b] self-start md:self-auto">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#64748b] px-2 py-1 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-blue-400" /> 预置数据:
          </span>
          {PRESET_DATASETS.map((ds) => (
            <button
              key={ds.id}
              onClick={() => onSelectDataset(ds)}
              disabled={isAnalyzing}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                currentDataset.id === ds.id
                  ? 'bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/50'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              {ds.fileName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Drag-and-drop / Active Dataset Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left / File Drop Area */}
        <div className="lg:col-span-6 flex flex-col">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex-1 min-h-[180px] rounded-xl border border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                : 'border-[#1e293b] hover:border-blue-500/60 bg-black/40 hover:bg-black/60'
            }`}
          >
            <div className="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                拖入实验数据文件 或 点击选择
              </span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]">
                .XLSX / .CSV
              </span>
            </div>

            <p className="text-[11px] text-[#64748b] max-w-sm mb-3">
              支持多组学特征、反应动力学矩阵与多张工作表
            </p>

            {/* Currently Active Data Highlight */}
            <div className="w-full bg-[#0f172a] rounded-lg border border-[#1e293b] px-3 py-2 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-mono font-medium text-white truncate">
                    {currentDataset.fileName}
                  </div>
                  <div className="text-[10px] text-[#64748b] font-mono">
                    {currentDataset.rowCount.toLocaleString()} rows · {currentDataset.columnCount} columns · {currentDataset.fileSize}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex-shrink-0">
                已就绪
              </span>
            </div>
          </div>
        </div>

        {/* Right / Goal Configuration & Run Button */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="bg-black/40 rounded-xl border border-[#1e293b] p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] uppercase font-bold text-blue-400 tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Analysis Target (分析目标)
              </label>
              <button
                type="button"
                onClick={() => setShowGoalTemplates(!showGoalTemplates)}
                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {showGoalTemplates ? '收起预置目标' : '选择快捷目标'}
                {showGoalTemplates ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Quick Templates Drawer */}
            {showGoalTemplates && (
              <div className="mb-2 p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] space-y-1 max-h-32 overflow-y-auto">
                {goalPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onGoalChange(preset);
                      setShowGoalTemplates(false);
                    }}
                    className="w-full text-left p-1.5 rounded text-[11px] text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] transition-colors flex items-start gap-1.5 cursor-pointer"
                  >
                    <span className="text-blue-400 font-mono mt-0.5">{idx + 1}.</span>
                    <span>{preset}</span>
                  </button>
                ))}
              </div>
            )}

            <textarea
              value={analysisGoal}
              onChange={(e) => onGoalChange(e.target.value)}
              rows={3}
              placeholder="请输入或调整科研分析目标..."
              disabled={isAnalyzing}
              className="w-full rounded-lg bg-[#0f172a] border border-[#1e293b] p-2.5 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed transition-all"
            />

            <div className="flex items-center justify-between mt-1 text-[10px] text-[#64748b]">
              <span>支持自然语言输入任意假设与检验维度</span>
              <span className="font-mono">{analysisGoal.length} 字</span>
            </div>
          </div>

          {/* Start Analysis Big CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onStartAnalysis}
              disabled={isAnalyzing}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all shadow-lg cursor-pointer ${
                isAnalyzing
                  ? 'bg-[#1e293b] text-[#64748b] cursor-not-allowed border border-[#334155]'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>AI Agent 正在分析中...</span>
                </>
              ) : hasAnalyzed ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>重新开始分析</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>开始分析</span>
                </>
              )}
            </button>

            {/* Toggle Table Preview Button */}
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3.5 py-2.5 rounded-lg bg-black/40 hover:bg-[#1e293b] text-slate-300 hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="查看原始数据表格结构"
            >
              <Table className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">{showPreview ? '收起预览' : '数据预览'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Data Preview Table Drawer */}
      {showPreview && (
        <div className="mt-4 pt-4 border-t border-[#1e293b] animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">
                原始数据切片 (前 8 行采样 / 共 {currentDataset.rowCount.toLocaleString()} 行)
              </span>
              <span className="text-[10px] text-[#64748b] font-mono">
                {currentDataset.fileName}
              </span>
            </div>
            <span className="text-[10px] text-[#64748b]">42 列字段已全部映射完毕</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#1e293b] bg-black/40">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#0f172a] border-b border-[#1e293b] text-[#94a3b8]">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3 text-blue-400">Sample_ID</th>
                  <th className="py-2 px-3 text-blue-400">Group</th>
                  <th className="py-2 px-3 text-blue-400">Performance</th>
                  <th className="py-2 px-3 text-blue-400">Temperature (℃)</th>
                  <th className="py-2 px-3 text-blue-400">Pressure (MPa)</th>
                  <th className="py-2 px-3 text-blue-400">Yield (%)</th>
                  <th className="py-2 px-3 text-blue-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b] text-[#cbd5e1]">
                {currentDataset.previewRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-[#1e293b]/40 ${
                      row.Status === 'Anomaly' ? 'bg-red-500/10 text-red-300' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-[#64748b]">{i + 1}</td>
                    <td className="py-2 px-3 font-semibold">{row.Sample_ID}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          row.Group === 'Group A'
                            ? 'bg-blue-950 text-blue-300'
                            : row.Group === 'Group B'
                            ? 'bg-indigo-950 text-indigo-300'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {row.Group}
                      </span>
                    </td>
                    <td className="py-2 px-3">{row.Performance}</td>
                    <td className="py-2 px-3">{row.Temperature}</td>
                    <td className="py-2 px-3">{row.Pressure}</td>
                    <td className="py-2 px-3">{row.Yield}</td>
                    <td className="py-2 px-3">
                      {row.Status === 'Anomaly' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          离群检测
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400">有效</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
