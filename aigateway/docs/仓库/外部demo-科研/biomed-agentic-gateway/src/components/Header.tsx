import React, { useRef } from 'react';
import { 
  Dna, 
  UploadCloud, 
  Sparkles, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { BiomedicalDataset } from '../types';
import { PRESET_DATASETS } from '../data/presetDatasets';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface HeaderProps {
  currentDataset: BiomedicalDataset;
  onSelectDataset: (dataset: BiomedicalDataset) => void;
  onUploadCustomData: (dataset: BiomedicalDataset) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  gatewayStats: {
    totalCalls: number;
    totalTokens: number;
    avgLatencyMs: number;
  };
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDataset,
  onSelectDataset,
  onUploadCustomData,
  onRunAnalysis,
  isAnalyzing,
  gatewayStats,
  onOpenExport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv' || fileExt === 'tsv' || fileExt === 'txt') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            createCustomDataset(fileName, results.data as Array<Record<string, any>>);
          }
        },
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json(ws);
        if (data && data.length > 0) {
          createCustomDataset(fileName, data as Array<Record<string, any>>);
        }
      };
      reader.readAsBinaryString(file);
    } else if (fileExt === 'json') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target?.result as string);
          const dataArray = Array.isArray(parsed) ? parsed : parsed.data || [parsed];
          createCustomDataset(fileName, dataArray);
        } catch (err) {
          console.error('Failed to parse JSON file:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  const createCustomDataset = (fileName: string, data: Array<Record<string, any>>) => {
    const keys = Object.keys(data[0] || {});
    const groupCol = keys.find((k) => k.toLowerCase().includes('group') || k.toLowerCase().includes('treat')) || keys[1] || keys[0];
    const numCol = keys.find((k) => {
      const v = data[0][k];
      return typeof v === 'number';
    }) || keys[keys.length - 1];
    const idCol = keys.find((k) => k.toLowerCase().includes('id') || k.toLowerCase().includes('sample') || k.toLowerCase().includes('code')) || keys[0];

    const customDataset: BiomedicalDataset = {
      id: `custom-${Date.now()}`,
      name: `自定义实验数据: ${fileName}`,
      category: 'Drug Screening',
      description: `用户上传的科研实验数据 (${data.length} 行 x ${keys.length} 列)，系统已自动完成字段推断。`,
      sourceInfo: `本地文件解析: ${fileName} · 自动特征工程提取`,
      primaryGroupCol: groupCol,
      primaryMetricCol: numCol,
      idCol: idCol,
      data,
      suggestedPrompt: '分析不同实验组之间的指标差异，检查缺失与离群点，并生成可复现科研统计报告与代码。',
    };

    onUploadCustomData(customDataset);
  };

  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Lab Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-xs">
              B
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-semibold text-base sm:text-lg tracking-tight text-slate-900">
                  BioAnalysis <span className="text-blue-600">Agent</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-blue-600" /> 可复现科研
                </span>
              </div>
            </div>
          </div>

          {/* Dataset Selector Dropdown */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <select
                aria-label="选择生物医学实验数据集"
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-1.5 pr-8 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none cursor-pointer appearance-none transition-colors"
                value={currentDataset.id}
                onChange={(e) => {
                  const found = PRESET_DATASETS.find((d) => d.id === e.target.value);
                  if (found) onSelectDataset(found);
                }}
              >
                <optgroup label="预置生物医学典型实验案例">
                  {PRESET_DATASETS.map((d) => (
                    <option key={d.id} value={d.id}>
                      [{d.category}] {d.name.slice(0, 30)}...
                    </option>
                  ))}
                </optgroup>
                {currentDataset.id.startsWith('custom') && (
                  <optgroup label="当前自定义数据集">
                    <option value={currentDataset.id}>{currentDataset.name}</option>
                  </optgroup>
                )}
              </select>
              <Layers className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv,.tsv,.txt,.xlsx,.xls,.json"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-xs"
              title="上传 CSV / Excel / JSON 实验数据"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>上传数据</span>
            </button>
          </div>

          {/* Action Center: Gateway Monitor, Export & Run Agent */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* System Online / Gateway Telemetry Badge */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>SYSTEM ONLINE</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-600">{gatewayStats.avgLatencyMs}ms</span>
            </div>

            {/* Export Button */}
            <button
              onClick={onOpenExport}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition shadow-xs"
              title="导出 Python/R/Notebook/报告"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">导出报告</span>
            </button>

            {/* Run Agent Trigger Button */}
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-colors shadow-xs ${
                isAnalyzing
                  ? 'bg-blue-100 text-blue-700 cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? '分析中...' : '启动 Agent'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
