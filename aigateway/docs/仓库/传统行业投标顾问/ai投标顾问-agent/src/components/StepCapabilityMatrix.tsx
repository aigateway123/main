import React from 'react';
import { 
  GitCompare, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  ExternalLink,
  Edit3,
  Award
} from 'lucide-react';
import { CompanyCapabilityMatrixItem, CompanyProfile } from '../types';

interface StepCapabilityMatrixProps {
  matrix: CompanyCapabilityMatrixItem[];
  activeCompany: CompanyProfile;
  onOpenCompanyModal: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepCapabilityMatrix: React.FC<StepCapabilityMatrixProps> = ({
  matrix,
  activeCompany,
  onOpenCompanyModal,
  onNext,
  onPrev
}) => {
  const avgMatch = Math.round(
    matrix.reduce((sum, item) => sum + item.matchScore, 0) / (matrix.length || 1)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Company Profile Bento Header Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  第六步：招标要求 × 企业能力匹配矩阵
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                当前比对企业画像：<span className="text-indigo-700 font-bold">{activeCompany.companyName}</span> ({activeCompany.industry})
              </p>
            </div>
          </div>

          {/* Edit Profile / Match Rate */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">综合能力匹配度</div>
              <div className="text-lg font-extrabold text-blue-700 font-mono">
                {avgMatch}%
              </div>
            </div>

            <button
              onClick={onOpenCompanyModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-2xs transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>切换/编辑企业资质库</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Matching Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-4 w-[24%]">招标文件具体要求</th>
                <th className="py-3.5 px-4 w-[28%]">企业现有能力 & 资料</th>
                <th className="py-3.5 px-4 w-[12%] text-center">匹配度</th>
                <th className="py-3.5 px-4 w-[16%]">主要缺口（Gap）</th>
                <th className="py-3.5 px-4 w-[20%]">顾问应对建议</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {matrix.map((item) => {
                const isFull = item.matchScore >= 95;
                const isPartial = item.matchScore >= 60 && item.matchScore < 95;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Requirement */}
                    <td className="py-4 px-4 align-top">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.requirement}
                      </p>
                    </td>

                    {/* Company Capability */}
                    <td className="py-4 px-4 align-top">
                      <div className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium">
                        {item.companyCapability}
                      </div>
                    </td>

                    {/* Match Score */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono ${
                          isFull
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isPartial
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {item.matchScore}%
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {isFull ? '完全匹配' : isPartial ? '部分匹配' : '存在缺口'}
                        </span>
                      </div>
                    </td>

                    {/* Gap */}
                    <td className="py-4 px-4 align-top">
                      <p className={`text-xs ${
                        item.gap.includes('无') ? 'text-slate-400' : 'text-amber-800 font-semibold'
                      }`}>
                        {item.gap}
                      </p>
                    </td>

                    {/* Suggestion */}
                    <td className="py-4 px-4 align-top">
                      <p className="text-xs text-emerald-900 font-medium bg-emerald-50/60 p-2 rounded-lg border border-emerald-200">
                        {item.suggestion}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回：提分策略</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
        >
          <span>下一步：生成作战清单</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

