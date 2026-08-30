import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  ArrowRight, 
  FileEdit, 
  CheckCircle2, 
  Award,
  BarChart,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { ReportSection } from '../types';
import { REPORT_SECTIONS } from '../data/mockData';

interface AnalysisReportProps {
  sections?: ReportSection[];
  onOpenPaperWriting: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({
  sections = REPORT_SECTIONS,
  onOpenPaperWriting,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const copyFullReport = () => {
    let reportText = `# 科研数据分析完整学术报告\n\n`;
    sections.forEach((sec) => {
      reportText += `## ${sec.number}、${sec.title}\n`;
      reportText += `**摘要**：${sec.summary}\n\n`;
      sec.content.forEach((p) => {
        reportText += `- ${p}\n`;
      });
      if (sec.keyMetrics) {
        reportText += `\n关键指标：` + sec.keyMetrics.map((m) => `${m.label}: ${m.value} (${m.note || ''})`).join(' | ') + `\n`;
      }
      reportText += `\n---\n\n`;
    });

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSectionIcon = (num: string) => {
    switch (num) {
      case '一': return Layers;
      case '二': return ShieldCheck;
      case '三': return BarChart;
      case '四': return Activity;
      case '五': return CheckCircle2;
      case '六': return Award;
      default: return FileText;
    }
  };

  return (
    <section className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
      {/* Header with Generate Results CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">
            学术级完整分析报告 (Research Analysis Report)
          </h3>
          <p className="text-xs text-[#94a3b8] mt-0.5 pl-3">
            涵盖数据概况、质量校验、实验组对比、异常分析、统计检验与科研结论六大维度
          </p>
        </div>

        {/* Action Controls & Big [生成 Results] CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={copyFullReport}
            className="px-3 py-2 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="复制完整 Markdown 报告文本"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">已复制全文</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制完整报告</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenPaperWriting}
            className="py-2 px-4 bg-white text-black font-bold text-xs rounded hover:bg-blue-50 transition-all uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-white/10 cursor-pointer"
          >
            <FileEdit className="w-3.5 h-3.5 text-black" />
            <span>生成 Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-[#1e293b] text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/40'
              : 'text-[#64748b] hover:text-white'
          }`}
        >
          全部 6 章节
        </button>
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveTab(sec.id)}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === sec.id
                ? 'bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/40'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            {sec.number}、{sec.title}
          </button>
        ))}
      </div>

      {/* Structured Sections List */}
      <div className="space-y-4 mt-5">
        {sections
          .filter((sec) => activeTab === 'all' || sec.id === activeTab)
          .map((section) => {
            const Icon = getSectionIcon(section.number);
            return (
              <div
                key={section.id}
                className="rounded-xl bg-black/40 border border-[#1e293b] p-4 sm:p-5 hover:border-slate-700 transition-all"
              >
                {/* Section Title & Number Badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#0f172a] border border-[#1e293b] flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{section.number}、{section.title}</span>
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Ready
                  </span>
                </div>

                {/* Summary Highlight Box */}
                <div className="bg-[#0f172a] rounded-lg p-2.5 border border-[#1e293b] text-xs text-[#cbd5e1] mb-3">
                  <span className="font-semibold text-blue-400">章节摘要：</span>
                  <span>{section.summary}</span>
                </div>

                {/* Key Metrics Grid if present */}
                {section.keyMetrics && section.keyMetrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {section.keyMetrics.map((metric, i) => (
                      <div
                        key={i}
                        className="bg-[#0f172a] rounded p-2 border border-[#1e293b]"
                      >
                        <div className="text-[10px] text-[#64748b]">{metric.label}</div>
                        <div className="text-xs font-mono font-bold text-white mt-0.5">
                          {metric.value}
                        </div>
                        {metric.note && (
                          <div className="text-[9px] text-blue-400">{metric.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Content Paragraphs */}
                <div className="space-y-1 text-xs text-[#94a3b8] leading-relaxed font-sans">
                  {section.content.map((paragraph, pIndex) => (
                    <div key={pIndex} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span>{paragraph}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom Floating Bar */}
      <div className="mt-6 pt-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#64748b]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>报告已按最新期刊规范整理完毕（支持一键导入论文 Results）</span>
        </div>
        <button
          onClick={onOpenPaperWriting}
          className="w-full sm:w-auto py-2.5 px-6 bg-white text-black font-bold text-xs rounded hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <span>生成 Results</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
