import React, { useState, useEffect } from 'react';
import { ReviewReport, ReviewIssue } from '../types';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Flame, 
  ChevronDown, 
  ChevronUp,
  ShieldAlert,
  ThumbsUp,
  Lightbulb,
  Check,
  RefreshCw,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewerAgentViewProps {
  reviewReport: ReviewReport;
  isReviewing: boolean;
  onApplyAblation: () => void;
  onApplyStats: () => void;
  onApplyUnits: () => void;
  onApplyReferences: () => void;
  onApplyAllRevisions: () => void;
  onGoToPaper: () => void;
  hasAppliedAblation: boolean;
  hasAppliedStats: boolean;
  hasAppliedUnits: boolean;
  hasAppliedReferences: boolean;
}

export const ReviewerAgentView: React.FC<ReviewerAgentViewProps> = ({
  reviewReport,
  isReviewing,
  onApplyAblation,
  onApplyStats,
  onApplyUnits,
  onApplyReferences,
  onApplyAllRevisions,
  onGoToPaper,
  hasAppliedAblation,
  hasAppliedStats,
  hasAppliedUnits,
  hasAppliedReferences,
}) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string>('issue-ablation');
  const [reviewStepIndex, setReviewStepIndex] = useState<number>(0);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<number[]>([]);

  const reviewCheckpoints = [
    '方法完整性 (Methodology Completeness)',
    '实验充分性 (Experimental Rigor & Ablation)',
    '数据合理性 (Data Validity & Splits)',
    'Baseline完整性 (Baseline Coverage)',
    '统计显著性 (Statistical Significance & p-values)',
    '图表规范 (Figure & Table Standards)',
    '学术表达 (Academic Tone & Reference Standards)',
  ];

  useEffect(() => {
    if (isReviewing) {
      setReviewStepIndex(0);
      setCompletedCheckpoints([]);
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < reviewCheckpoints.length) {
          setCompletedCheckpoints(prev => [...prev, idx]);
          idx++;
          setReviewStepIndex(idx);
        } else {
          clearInterval(interval);
        }
      }, 350);
      return () => clearInterval(interval);
    }
  }, [isReviewing]);

  // Calculate score and status dynamically based on fixed items
  const allResolved = hasAppliedAblation && hasAppliedStats && hasAppliedUnits && hasAppliedReferences;
  const currentScore = allResolved ? 9.6 : hasAppliedAblation ? 8.4 : 5.2;
  const currentDecision = allResolved ? 'Accept (录用通过)' : hasAppliedAblation ? 'Minor Revision (小修录用)' : 'Major Revision (建议大修)';

  // Handle celebratory confetti if all resolved
  useEffect(() => {
    if (allResolved) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [allResolved]);

  // If reviewing animation is in progress
  if (isReviewing) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-slate-900 border border-slate-700/80 rounded-2xl p-8 shadow-2xl text-slate-100 animate-fadeIn text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
          <Search className="w-7 h-7 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Reviewer Agent</h2>
        <p className="text-xs text-amber-300 font-mono mb-6">
          正在以顶级学术审稿人标准审查论文结构、实验严密性与逻辑规范...
        </p>

        <div className="space-y-2 text-left max-w-md mx-auto">
          {reviewCheckpoints.map((cp, idx) => {
            const isDone = completedCheckpoints.includes(idx);
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-all ${
                  isDone
                    ? 'bg-slate-950/80 text-slate-200 border border-slate-800'
                    : 'text-slate-500 opacity-40'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {isDone ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  ) : (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  )}
                  <span className="font-medium">{cp}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isDone ? 'Checked' : 'Inspecting...'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Selected issue object
  const allIssues = [...reviewReport.majorIssues, ...reviewReport.minorIssues];
  const selectedIssue = allIssues.find(i => i.id === selectedIssueId) || reviewReport.majorIssues[0];

  const isIssueResolved = (issueId: string) => {
    if (issueId === 'issue-ablation') return hasAppliedAblation;
    if (issueId === 'issue-statistics') return hasAppliedStats;
    if (issueId === 'issue-fig-error') return hasAppliedStats;
    if (issueId === 'issue-table-units') return hasAppliedUnits;
    if (issueId === 'issue-references') return hasAppliedReferences;
    return false;
  };

  const handleExecuteIssueAction = (issueId: string) => {
    if (issueId === 'issue-ablation') {
      onApplyAblation();
      confetti({ particleCount: 50, spread: 60 });
    } else if (issueId === 'issue-statistics' || issueId === 'issue-fig-error') {
      onApplyStats();
    } else if (issueId === 'issue-table-units') {
      onApplyUnits();
    } else if (issueId === 'issue-references') {
      onApplyReferences();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Reviewer Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Reviewer Agent Peer Report · 同行审稿评审报告</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {reviewReport.confidence}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                审稿结论: <span className={allResolved ? 'text-emerald-400' : hasAppliedAblation ? 'text-cyan-400' : 'text-amber-400'}>{currentDecision}</span>
              </h1>
              <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl font-mono text-lg font-extrabold text-cyan-400">
                Score: {currentScore} / 10
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {reviewReport.summary}
            </p>
          </div>

          {/* Quick Resolution Actions */}
          <div className="flex flex-col gap-2.5 min-w-[220px]">
            {!allResolved ? (
              <button
                onClick={onApplyAllRevisions}
                className="w-full px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>一键执行所有修改建议</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center">
                <div className="text-xs font-bold text-emerald-300 flex items-center justify-center space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>论文已通过同行审稿！</span>
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-0.5">所有 Major/Minor 缺陷均已修复</div>
              </div>
            )}

            <button
              onClick={onGoToPaper}
              className="w-full px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center space-x-1.5 transition"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>返回论文正文查看改动</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Strengths checklist */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
            <ThumbsUp className="w-3.5 h-3.5 text-blue-400" />
            <span>审稿人认可的论文亮点 (Strengths & Contributions)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {reviewReport.strengths.map((str, idx) => (
              <div key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Reviewer Layout: Left Issue List + Right AI Suggestion & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Issues Classified by Major & Minor */}
        <div className="lg:col-span-6 space-y-5">
          {/* Major Issues Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-bold text-red-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Major Issues (关键重大缺陷)</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-red-500/20 text-red-300 rounded border border-red-500/30">
                {reviewReport.majorIssues.length} Items
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {reviewReport.majorIssues.map((issue) => {
                const resolved = isIssueResolved(issue.id);
                const isSelected = selectedIssueId === issue.id;

                return (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssueId(issue.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {resolved ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            ✓
                          </div>
                        ) : (
                          <span className="text-amber-400 font-bold flex-shrink-0">⚠</span>
                        )}
                        <span className={`text-xs font-bold ${resolved ? 'text-emerald-300 line-through' : 'text-slate-100'}`}>
                          {issue.title}
                        </span>
                      </div>

                      {resolved ? (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                          已修复
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-300 rounded border border-red-500/30">
                          待解决
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-[11px] text-slate-400 line-clamp-2">
                      {issue.critique}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Minor Issues Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Minor Issues (格式与细节规范)</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                {reviewReport.minorIssues.length} Items
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {reviewReport.minorIssues.map((issue) => {
                const resolved = isIssueResolved(issue.id);
                const isSelected = selectedIssueId === issue.id;

                return (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssueId(issue.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {resolved ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            ✓
                          </div>
                        ) : (
                          <span className="text-amber-400 font-bold flex-shrink-0">⚠</span>
                        )}
                        <span className={`text-xs font-semibold ${resolved ? 'text-emerald-300 line-through' : 'text-slate-200'}`}>
                          {issue.title}
                        </span>
                      </div>

                      {resolved && (
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 rounded">
                          已修复
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Modification Suggestions & Interactive Resolution Action */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white">AI 修改建议 (AI Revision Suggestions)</span>
            </div>
            <span className="text-[11px] text-cyan-400 font-mono">
              Target: {selectedIssue?.title?.split('(')[0]}
            </span>
          </div>

          {/* Selected Issue Reviewer Critique */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-red-300 uppercase tracking-wider font-mono">
              审稿人原始意见 (Reviewer Critique)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{selectedIssue?.critique}"
            </p>
          </div>

          {/* AI Suggestion Box (Detailed in prompt!) */}
          <div className="bg-blue-950/30 border border-blue-500/40 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI 专家智能改进方案</span>
            </div>
            <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-sans">
              {selectedIssue?.aiSuggestion}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>执行效果: {selectedIssue?.resolutionEffectDescription}</span>
            </div>
          </div>

          {/* Primary Action Button for this issue */}
          <div className="pt-2">
            {isIssueResolved(selectedIssue?.id) ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center flex items-center justify-center space-x-2 text-xs font-bold text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>该问题已通过 AI 自动完成修补并写入论文</span>
              </div>
            ) : (
              <button
                onClick={() => handleExecuteIssueAction(selectedIssue.id)}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                <span>{selectedIssue.actionTitle}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
