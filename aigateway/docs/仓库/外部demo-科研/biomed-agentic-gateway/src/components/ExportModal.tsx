import React from 'react';
import { 
  X, 
  Download, 
  FileCode, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  Terminal 
} from 'lucide-react';
import { BiomedicalDataset, CodeSnippets, AnalysisReport } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: BiomedicalDataset;
  codeSnippets: CodeSnippets;
  report: AnalysisReport | null;
  onDownloadNotebook: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  dataset,
  codeSnippets,
  report,
  onDownloadNotebook,
}) => {
  if (!isOpen) return null;

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (!dataset.data || dataset.data.length === 0) return;
    const headers = Object.keys(dataset.data[0]).join(',');
    const rows = dataset.data.map((r) => Object.values(r).join(',')).join('\n');
    downloadFile(`${headers}\n${rows}`, `${dataset.id}_data.csv`, 'text/csv;charset=utf-8;');
  };

  const exportMarkdownReport = () => {
    if (!report) return;
    const md = `# ${dataset.name} - 科研统计分析报告
**生成机构: BioMed Data Analysis Agent & Gateway**
**生成时间: ${new Date(report.generatedAt).toLocaleString()}**

---

## 1. 核心结论与执行摘要 (Executive Summary)
${report.executiveSummary}

- **对比分组**: ${report.primaryFinding.groupA} vs ${report.primaryFinding.groupB}
- **主检测指标**: ${report.primaryFinding.metric}
- **相对响应幅度**: ${report.primaryFinding.percentChange >= 0 ? '提升' : '降低'} ${Math.abs(report.primaryFinding.percentChange)}%
- **统计学显著性**: ${report.primaryFinding.pValueText} (${report.primaryFinding.significanceText})

---

## 2. 异常样本与实验溯源 (Outlier Isolation)
- **检出异常样本总数**: ${report.anomalySummary.totalDetected}
- **高风险样本数**: ${report.anomalySummary.highSeverityCount}
- **疑似实验室成因**:
${report.anomalySummary.suspectedReasons.map((r) => `  - ${r}`).join('\n')}
- **实验复核建议**: ${report.anomalySummary.actionableAdvice}

---

## 3. 生物学机制解读
${report.biologicalInterpretation}

---

## 4. 方法学与可复现性说明
${report.methodologyNotes}
`;
    downloadFile(md, `${dataset.id}_scientific_report.md`, 'text/markdown;charset=utf-8;');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              导出科研成果与可复现包 (Export Research Bundle)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              一键下载符合学术期刊发表要求的数据、脚本与报告
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-3">
          {/* Notebook */}
          <button
            onClick={() => {
              onDownloadNotebook();
              onClose();
            }}
            className="w-full p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-50 flex items-center justify-between text-left transition cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Jupyter Notebook (.ipynb)
                </span>
                <span className="text-[11px] text-slate-500">
                  包含数据加载、清洗、方差分析及 Seaborn 科研绘图
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-blue-600" />
          </button>

          {/* Python */}
          <button
            onClick={() => {
              downloadFile(codeSnippets.python, `${dataset.id}_analysis.py`, 'text/plain');
              onClose();
            }}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-left transition cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-slate-800 text-white shadow-xs">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Python 脚本 (.py)
                </span>
                <span className="text-[11px] text-slate-500">
                  基于 Pandas, SciPy, Statsmodels 的独立执行代码
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-600" />
          </button>

          {/* R Script */}
          <button
            onClick={() => {
              downloadFile(codeSnippets.r, `${dataset.id}_analysis.R`, 'text/plain');
              onClose();
            }}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-left transition cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-slate-700 text-white shadow-xs">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  R 语言脚本 (.R)
                </span>
                <span className="text-[11px] text-slate-500">
                  Tidyverse, rstatix, ggplot2 统计与制图
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-600" />
          </button>

          {/* Markdown Report */}
          <button
            onClick={() => {
              exportMarkdownReport();
              onClose();
            }}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-left transition cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  科研分析报告 (Markdown .md)
                </span>
                <span className="text-[11px] text-slate-500">
                  包含方法学描述、效应量、异常清单与复核建议
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-600" />
          </button>

          {/* Raw CSV */}
          <button
            onClick={() => {
              exportCsv();
              onClose();
            }}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-left transition cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-slate-600 text-white shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  原始实验数据 (.csv)
                </span>
                <span className="text-[11px] text-slate-500">
                  导出当前全部实验行数据与指标
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
