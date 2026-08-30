import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  BookOpen,
  Share2,
  Calendar,
  Users,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ResearchReport, ReportSection } from '../types';

interface ResearchReportViewProps {
  report: ResearchReport;
  onExploreAction?: (actionType: 'experiment' | 'literature' | 'coding' | 'plan') => void;
}

export const ResearchReportView: React.FC<ResearchReportViewProps> = ({
  report,
  onExploreAction,
}) => {
  const [activeSectionNum, setActiveSectionNum] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    let md = `# ${report.title}\n\n${report.subtitle}\n\n**生成日期**: ${report.generatedDate}\n**报告作者**: ${report.authors.join(', ')}\n\n## 摘要\n${report.abstract}\n\n`;

    report.sections.forEach((s) => {
      md += `## ${s.number}. ${s.title} (${s.enTitle})\n\n> ${s.summary}\n\n${s.content}\n\n`;
      if (s.highlights) {
        md += `**核心要点**:\n` + s.highlights.map((h) => `- ${h}`).join('\n') + '\n\n';
      }
    });

    md += `## 参考文献 (References)\n\n`;
    report.references.forEach((r) => {
      md += `[${r.id}] ${r.authors}. "${r.title}". *${r.venue}*, ${r.year}.\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${report.title}\n\n${report.subtitle}\n\n**生成日期**: ${report.generatedDate}\n**报告作者**: ${report.authors.join(', ')}\n\n## 摘要\n${report.abstract}\n\n`;

    report.sections.forEach((s) => {
      md += `## ${s.number}. ${s.title} (${s.enTitle})\n\n> ${s.summary}\n\n${s.content}\n\n`;
      if (s.highlights) {
        md += `**核心要点**:\n` + s.highlights.map((h) => `- ${h}`).join('\n') + '\n\n';
      }
    });

    md += `## 参考文献 (References)\n\n`;
    report.references.forEach((r) => {
      md += `[${r.id}] ${r.authors}. "${r.title}". *${r.venue}*, ${r.year}.\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/[《》]/g, '')}_研究报告.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeSection =
    report.sections.find((s) => s.number === activeSectionNum) || report.sections[0];

  return (
    <section id="research-report-section" className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <FileText className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Autonomous Academic Paper
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              研究报告 (Research Report)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              由 4-Agent 协同闭环自动撰写的 9 大章节高规格科研机会分析白皮书
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? '已复制 Markdown' : '复制全文'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>导出 .MD 报告</span>
            </button>
          </div>
        </div>

        {/* Paper Document Container */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left: 9-Section Table of Contents */}
          <div className="lg:col-span-4 bg-slate-50/90 border-r border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Table of Contents (目录导航)
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                  报告 9 大核心板块
                </h4>
              </div>

              <nav className="space-y-1.5">
                {report.sections.map((sec) => {
                  const isActive = activeSectionNum === sec.number;
                  return (
                    <button
                      key={sec.number}
                      onClick={() => setActiveSectionNum(sec.number)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                          : 'text-slate-700 hover:bg-slate-200/70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                            isActive
                              ? 'bg-white text-indigo-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          0{sec.number}
                        </span>
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <ChevronRight
                        className={`h-3.5 w-3.5 ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Metadata Box */}
            <div className="mt-8 pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>生成日期: {report.generatedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>协同智能体: 4 Agents</span>
              </div>
            </div>
          </div>

          {/* Right: Academic Content Reader */}
          <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Paper Title Banner */}
              <div className="pb-6 border-b border-slate-100 mb-6">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {report.title}
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-1">{report.subtitle}</p>

                {/* Abstract Box */}
                <div className="mt-4 rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100/80 text-xs">
                  <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>【摘要】(Abstract)</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{report.abstract}</p>
                </div>
              </div>

              {/* Active Section Content */}
              {activeSection && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600">
                        SECTION 0{activeSection.number}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {activeSection.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {activeSection.enTitle}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                      {activeSection.number} / 9
                    </span>
                  </div>

                  {/* Summary Box */}
                  <div className="rounded-xl bg-slate-50 border-l-4 border-indigo-500 p-3 text-xs text-slate-700 italic">
                    {activeSection.summary}
                  </div>

                  {/* Body Text with Markdown formatting */}
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif space-y-2">
                    {activeSection.content}
                  </div>

                  {/* Section Highlights */}
                  {activeSection.highlights && activeSection.highlights.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-900 block mb-2">
                        本节核心结论与洞察 (Key Takeaways)：
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {activeSection.highlights.map((hl, hIdx) => (
                          <div
                            key={hIdx}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 font-sans"
                          >
                            • {hl}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Pagination Bottom */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={activeSectionNum <= 1}
                onClick={() => setActiveSectionNum((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                ← 上一章节
              </button>

              <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                {report.sections.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => setActiveSectionNum(s.number)}
                    className={`h-6 w-6 rounded text-xs font-bold cursor-pointer ${
                      s.number === activeSectionNum
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {s.number}
                  </button>
                ))}
              </div>

              <button
                disabled={activeSectionNum >= 9}
                onClick={() => setActiveSectionNum((prev) => Math.min(9, prev + 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                下一章节 →
              </button>
            </div>
          </div>
        </div>

        {/* References Section */}
        <div className="mt-8 rounded-3xl bg-slate-50 p-6 sm:p-8 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              参考文献 (References & Citations)
            </h4>
          </div>

          <div className="space-y-2 text-xs text-slate-600 font-mono">
            {report.references.map((ref) => (
              <div key={ref.id} className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">[{ref.id}]</span>
                <div className="flex-1">
                  <span className="font-semibold text-slate-800">{ref.authors}.</span>{' '}
                  <span className="italic">"{ref.title}".</span>{' '}
                  <span>{ref.venue}, {ref.year}.</span>
                  {ref.doi && (
                    <span className="text-indigo-500 ml-1 text-[11px]">
                      DOI: {ref.doi}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
