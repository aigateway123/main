import React from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Bot, 
  Building2, 
  UploadCloud, 
  Printer, 
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { TenderAnalysisResult, CompanyProfile } from '../types';

interface NavbarProps {
  currentTender: TenderAnalysisResult;
  allTenders: Record<string, TenderAnalysisResult>;
  onSelectTender: (id: string) => void;
  onOpenUploadModal: () => void;
  onOpenCompanyModal: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  activeCompany: CompanyProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTender,
  allTenders,
  onSelectTender,
  onOpenUploadModal,
  onOpenCompanyModal,
  onToggleChat,
  isChatOpen,
  activeCompany
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center text-white shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900">
                AI 投标作战指挥中心
              </span>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                Tender Copilot Pro
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              中小企业招投标全流程实战决策与控险平台
            </p>
          </div>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Tender Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium transition-all max-w-[200px] sm:max-w-[280px] shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate text-left font-semibold text-slate-900">
                {currentTender?.overview?.projectName || '当前项目'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    切换招投标示范案例
                  </div>
                  {(Object.values(allTenders) as TenderAnalysisResult[]).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTender(t.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                        t.id === currentTender?.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{t?.overview?.projectName || '示范项目'}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span className="text-emerald-600 font-semibold">{t?.overview?.budget || '预算待定'}</span>
                          <span>•</span>
                          <span>{t?.overview?.projectType || '综合采购'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenUploadModal();
                      }}
                      className="w-full py-2 px-3 text-xs font-bold text-center text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-blue-200"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      上传解析全新招标文件...
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
            title="上传新标书进行解析"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">导入标书</span>
          </button>

          {/* Company Profile Button */}
          <button
            onClick={onOpenCompanyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            title="查看或修改当前企业资质库"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline truncate max-w-[120px]">
              {activeCompany.companyName}
            </span>
          </button>

          {/* Print Report */}
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors hidden sm:flex shadow-2xs"
            title="打印或导出作战报告"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* AI Consultant Chat Toggle */}
          <button
            onClick={onToggleChat}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isChatOpen
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>AI 顾问问答</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
