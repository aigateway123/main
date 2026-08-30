import React, { useState } from 'react';
import { 
  FolderTree, 
  Sparkles, 
  Award, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  Copy,
  Check,
  Download,
  FileEdit,
  Loader2,
  ChevronRight,
  Send
} from 'lucide-react';
import { TechnicalProposalChapter, ProjectOverview } from '../types';
import { copyToClipboard, downloadTextAsFile } from '../lib/utils';

interface StepProposalOutlineProps {
  outline: TechnicalProposalChapter[];
  overview: ProjectOverview;
  onNext: () => void;
  onPrev: () => void;
}

export const StepProposalOutline: React.FC<StepProposalOutlineProps> = ({
  outline,
  overview,
  onNext,
  onPrev
}) => {
  const [selectedChapter, setSelectedChapter] = useState<TechnicalProposalChapter>(outline[0] || {} as any);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<Record<string, string>>({});
  const [customInstructions, setCustomInstructions] = useState('');
  const [copiedDraft, setCopiedDraft] = useState(false);

  const handleGenerateSection = async (chapter: TechnicalProposalChapter) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-proposal-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: `${chapter.chapterNumber} ${chapter.title}`,
          chapterDescription: chapter.description,
          keyRequirements: chapter.keyRequirements,
          tenderOverview: overview,
          customRequirements: customInstructions
        })
      });

      const data = await response.json();
      if (data.content) {
        setGeneratedDrafts(prev => ({
          ...prev,
          [chapter.id]: data.content
        }));
      } else {
        // Fallback realistic template draft if key is offline
        const fallbackDraft = `## ${chapter.chapterNumber} ${chapter.title}

### 1.1 需求深刻理解与编制依据
针对「${overview.projectName}」的建设目标与招标文件规范，本章节全面响应评审标准。我司结合近年来在${overview.projectType}领域的标杆实践经验，围绕高可用、易扩展、严保密、重交付的核心原则展开全流程闭环规划。

### 1.2 方案核心设计与实质性技术响应
本部分严格对标招标文件技术评分要点（${chapter.correspondsToScoreItem || '核心技术评审'}，分值：${chapter.scoreWeight || '关键分值'}）：
${(chapter.keyRequirements || []).map((req, i) => `1.2.${i+1} 【实质性响应】${req}：我司严格按照国标及招标文件顶格要求，提供成熟完备的实施路径与检验指标。`).join('\n')}

### 1.3 专家评审亮点与保障措施
1. **风险隔离机制**：设置7×24小时驻场与二级专家梯队支撑；
2. **量化质控体系**：实施全生命周期数字化质检与文档归档；
3. **承诺无偏差交付**：所有技术参数100%响应并承诺按期履约。`;
        setGeneratedDrafts(prev => ({
          ...prev,
          [chapter.id]: fallbackDraft
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text).then(ok => {
      if (ok) {
        setCopiedDraft(true);
        setTimeout(() => setCopiedDraft(false), 2000);
      }
    });
  };

  const exportAllOutline = () => {
    let md = `# ${overview.projectName} - 投标文件技术方案大纲\n\n`;
    outline.forEach(ch => {
      md += `## ${ch.chapterNumber} ${ch.title} (对应评分项: ${ch.correspondsToScoreItem || '通用'}, 权重: ${ch.scoreWeight || '重点'})\n`;
      md += `${ch.description}\n\n`;
      md += `**核心响应点**:\n`;
      ch.keyRequirements.forEach(req => {
        md += `- ${req}\n`;
      });
      if (generatedDrafts[ch.id]) {
        md += `\n### 正文初稿参考:\n${generatedDrafts[ch.id]}\n`;
      }
      md += `\n---\n\n`;
    });
    downloadTextAsFile(`${overview.projectName}_技术方案框架.md`, md);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bento Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  第八步：技术方案框架目录（全自动映射评分细则）
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                每个章节均<span className="text-blue-700 font-bold">明确对应评标办法中的得分项与分值权重</span>，确保评审专家打分时「一目了然、靶向给分」。
              </p>
            </div>
          </div>

          <button
            onClick={exportAllOutline}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出全套方案大纲</span>
          </button>
        </div>
      </div>

      {/* Split View: Chapter Tree on Left, Detail & AI Drafter on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chapters list */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            方案框架目录（共 {outline.length} 章）
          </div>

          <div className="space-y-2.5">
            {outline.map((ch) => {
              const isSelected = selectedChapter.id === ch.id;
              const hasDraft = !!generatedDrafts[ch.id];

              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 shadow-2xs ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-100'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-blue-700">
                        {ch.chapterNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{ch.title}</h4>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {ch.description}
                    </p>

                    {/* Score Item Mapping Badge */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {ch.correspondsToScoreItem ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Award className="w-3 h-3 text-amber-600" />
                          映射评分项: {ch.correspondsToScoreItem}
                          {ch.scoreWeight && <span className="text-amber-700 font-extrabold">({ch.scoreWeight})</span>}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-semibold">
                          通用规范章节
                        </span>
                      )}

                      {hasDraft && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          已生成正文
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${
                    isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-400'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Chapter Detail & Live AI Draft Generator */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
          {/* Chapter header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {selectedChapter.chapterNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedChapter.title}</h3>
              </div>

              {selectedChapter.correspondsToScoreItem && (
                <div className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>分值权重: {selectedChapter.scoreWeight || '关键分值'}</span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {selectedChapter.description}
            </p>
          </div>

          {/* Key Requirements response list */}
          <div>
            <span className="text-xs font-bold text-slate-600 block mb-2">
              【必须实质性响应的技术要点清单】：
            </span>
            <div className="space-y-1.5">
              {selectedChapter.keyRequirements?.map((req, idx) => (
                <div key={idx} className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start gap-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI One-Click Draft Action */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>AI 专家主笔：一键撰写符合评审偏好的技术正文</span>
              </div>

              <button
                onClick={() => handleGenerateSection(selectedChapter)}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI 正在撰写中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>生成本章示范正文</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Draft Display */}
            {generatedDrafts[selectedChapter.id] ? (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 relative space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    AI 方案草稿（可直接复制或参考修改）
                  </span>

                  <button
                    onClick={() => handleCopy(generatedDrafts[selectedChapter.id])}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors"
                  >
                    {copiedDraft ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>复制全文</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto pr-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {generatedDrafts[selectedChapter.id]}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-50/70 border border-dashed border-slate-200 text-center text-xs text-slate-500 font-medium">
                点击上方「生成本章示范正文」，AI 将根据该章节对应的评分标准与技术参数自动撰写专业规范的方案正文。
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回：作战清单</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
        >
          <span>下一步：投标文件体检</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

