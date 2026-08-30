import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  FileCog, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Sparkles,
  ExternalLink,
  Code2,
  Search
} from 'lucide-react';
import { GeneratedCodeFile, ResearchPaper } from '../types';

interface CodeExplorerViewProps {
  currentPaper: ResearchPaper;
  activeFile: GeneratedCodeFile;
  onSelectFile: (file: GeneratedCodeFile) => void;
  onDownloadZip: () => void;
  highlightFormula?: string | null;
}

export const CodeExplorerView: React.FC<CodeExplorerViewProps> = ({
  currentPaper,
  activeFile,
  onSelectFile,
  onDownloadZip,
  highlightFormula
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const files = currentPaper.files;

  // Categorize files into folders
  const rootFiles = files.filter(f => f.folder === '/' || f.folder === '');
  const dataFiles = files.filter(f => f.folder === 'data');
  const modelFiles = files.filter(f => f.folder === 'models');
  const experimentFiles = files.filter(f => f.folder === 'experiments');
  const resultFiles = files.filter(f => f.folder === 'results');

  const filteredFiles = searchQuery.trim()
    ? files.filter(f => f.path.toLowerCase().includes(searchQuery.toLowerCase()) || f.purpose.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (filename: string, language: string) => {
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return <FileCog className="w-3.5 h-3.5 text-amber-400" />;
    if (filename.endsWith('.sh')) return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
    if (filename.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-blue-400" />;
    return <FileCode className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0B10] text-slate-300">
      
      {/* Code Toolbar */}
      <div className="bg-[#0E1018] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {getFileIcon(activeFile.filename, activeFile.language)}
            <span className="font-mono text-xs font-semibold text-white">{activeFile.path}</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden md:inline border-l border-white/10 pl-3">
            {activeFile.purpose}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {highlightFormula && (
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              定位公式: {highlightFormula}
            </span>
          )}

          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-colors"
            title="复制代码到剪贴板"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? '已复制' : '复制'}</span>
          </button>

          <button
            onClick={handleDownloadSingle}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-colors"
            title="下载当前文件"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">下载此文件</span>
          </button>

          <button
            onClick={onDownloadZip}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            title="下载完整工程代码包"
          >
            <Download className="w-3.5 h-3.5" />
            <span>打包项目 (ZIP)</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left File Explorer Tree & Right Code Editor View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left File Tree Sidebar */}
        <div className="w-60 bg-[#0D0F16] border-r border-white/5 flex flex-col shrink-0">
          
          {/* Search Box */}
          <div className="p-2 border-b border-white/5">
            <div className="relative">
              <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="搜索项目文件..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0B10] border border-white/10 rounded-md pl-7 pr-2 py-1 text-[11px] text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs font-mono">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2 py-1 flex items-center justify-between">
              <span>EXPLORER (8 FILES)</span>
            </div>

            {filteredFiles ? (
              <div className="space-y-0.5">
                {filteredFiles.map(file => (
                  <button
                    key={file.path}
                    onClick={() => onSelectFile(file)}
                    className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                      activeFile.path === file.path
                        ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {getFileIcon(file.filename, file.language)}
                    <span className="truncate">{file.path}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* / (Root files: config.yaml, train.py, evaluate.py, README.md) */}
                <div className="space-y-0.5">
                  {rootFiles.map(file => (
                    <button
                      key={file.path}
                      onClick={() => onSelectFile(file)}
                      className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                        activeFile.path === file.path
                          ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      {getFileIcon(file.filename, file.language)}
                      <span className="truncate">{file.filename}</span>
                    </button>
                  ))}
                </div>

                {/* /data/ Folder */}
                <div>
                  <div className="flex items-center space-x-1.5 px-1 py-0.5 text-slate-400 text-[11px]">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>data/</span>
                  </div>
                  <div className="pl-3 space-y-0.5 mt-0.5">
                    {dataFiles.map(file => (
                      <button
                        key={file.path}
                        onClick={() => onSelectFile(file)}
                        className={`w-full flex items-center space-x-2 px-2 py-1 rounded-md text-left transition-colors ${
                          activeFile.path === file.path
                            ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {getFileIcon(file.filename, file.language)}
                        <span className="truncate">{file.filename}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* /models/ Folder */}
                <div>
                  <div className="flex items-center space-x-1.5 px-1 py-0.5 text-slate-400 text-[11px]">
                    <FolderOpen className="w-3.5 h-3.5 text-cyan-400/80" />
                    <span>models/</span>
                  </div>
                  <div className="pl-3 space-y-0.5 mt-0.5">
                    {modelFiles.map(file => (
                      <button
                        key={file.path}
                        onClick={() => onSelectFile(file)}
                        className={`w-full flex items-center space-x-2 px-2 py-1 rounded-md text-left transition-colors ${
                          activeFile.path === file.path
                            ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {getFileIcon(file.filename, file.language)}
                        <span className="truncate">{file.filename}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* /experiments/ Folder */}
                <div>
                  <div className="flex items-center space-x-1.5 px-1 py-0.5 text-slate-400 text-[11px]">
                    <FolderOpen className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span>experiments/</span>
                  </div>
                  <div className="pl-3 space-y-0.5 mt-0.5">
                    {experimentFiles.map(file => (
                      <button
                        key={file.path}
                        onClick={() => onSelectFile(file)}
                        className={`w-full flex items-center space-x-2 px-2 py-1 rounded-md text-left transition-colors ${
                          activeFile.path === file.path
                            ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {getFileIcon(file.filename, file.language)}
                        <span className="truncate">{file.filename}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* /results/ Folder */}
                <div>
                  <div className="flex items-center space-x-1.5 px-1 py-0.5 text-slate-400 text-[11px]">
                    <FolderOpen className="w-3.5 h-3.5 text-indigo-400/80" />
                    <span>results/</span>
                  </div>
                  <div className="pl-3 space-y-0.5 mt-0.5">
                    {resultFiles.map(file => (
                      <button
                        key={file.path}
                        onClick={() => onSelectFile(file)}
                        className={`w-full flex items-center space-x-2 px-2 py-1 rounded-md text-left transition-colors ${
                          activeFile.path === file.path
                            ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {getFileIcon(file.filename, file.language)}
                        <span className="truncate">{file.filename}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Right Code Content with Line Numbers */}
        <div className="flex-1 overflow-y-auto bg-[#0A0B10] p-4 font-mono text-xs leading-relaxed">
          <div className="table w-full">
            {activeFile.content.split('\n').map((line, idx) => {
              const lineNum = idx + 1;
              const isComment = line.trim().startsWith('#') || line.trim().startsWith('//') || line.trim().startsWith('"""') || line.trim().startsWith('*');
              const isFormulaLine = line.includes('Eq (') || line.includes('Formula:') || line.includes('Equation');

              return (
                <div 
                  key={lineNum} 
                  className={`table-row hover:bg-white/[0.02] ${
                    isFormulaLine ? 'bg-cyan-950/30 text-cyan-200 border-l-2 border-cyan-400' : ''
                  }`}
                >
                  {/* Line Number */}
                  <span className="table-cell pr-4 text-right select-none text-slate-600 font-mono text-[11px] w-10">
                    {lineNum}
                  </span>
                  
                  {/* Code Line */}
                  <span className={`table-cell whitespace-pre ${
                    isFormulaLine 
                      ? 'text-cyan-300 font-semibold' 
                      : isComment 
                      ? 'text-slate-500 italic' 
                      : 'text-slate-200'
                  }`}>
                    {line}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
