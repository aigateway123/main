import React, { useState, useRef } from 'react';
import { PaperData, ExperimentProject } from '../types';
import { Figure1Plot, Figure2Heatmap } from './ScientificFigures';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Layers, 
  Hash, 
  FileText, 
  ChevronRight, 
  Copy, 
  Check, 
  Edit3, 
  Eye, 
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';

interface PaperViewProps {
  paperData: PaperData;
  experiment: ExperimentProject;
  onStartReview: () => void;
  onOpenExport: () => void;
  serifMode: boolean;
  hasAppliedAblation: boolean;
  hasAppliedStats: boolean;
  hasAppliedUnits: boolean;
  hasAppliedReferences: boolean;
}

export const PaperView: React.FC<PaperViewProps> = ({
  paperData,
  experiment,
  onStartReview,
  onOpenExport,
  serifMode,
  hasAppliedAblation,
  hasAppliedStats,
  hasAppliedUnits,
  hasAppliedReferences,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-4-3');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const copyFullText = () => {
    const fullText = `${paperData.title}\n\nAbstract:\n${paperData.abstract}\n\n` +
      paperData.sections.map(s => {
        let text = `${s.number}. ${s.title}\n${s.content}`;
        if (s.subsections) {
          text += '\n' + s.subsections.map(sub => `${sub.number} ${sub.title}\n${sub.content}`).join('\n\n');
        }
        return text;
      }).join('\n\n');

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-16">
      {/* Top Paper Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">Paper Editor & Reader</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                {paperData.version}
              </span>
              {hasAppliedAblation && (
                <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                  + Ablation Study (Sec 4.4)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              IEEE / NeurIPS Standard Scientific Typesetting · 基于实验数据自动生成
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={copyFullText}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 flex items-center space-x-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制全文' : '复制全文'}</span>
          </button>

          {/* Prominent AI Review Button */}
          <button
            onClick={onStartReview}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 rounded-lg shadow-lg shadow-orange-500/25 flex items-center space-x-2 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search className="w-4 h-4" />
            <span>AI 审稿 (Review Paper)</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Contents TOC */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-bold text-slate-200">
            <span className="flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              <span>Contents (目录)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {paperData.sections.length} Sections
            </span>
          </div>

          <nav className="mt-3 space-y-1 text-xs">
            <button
              onClick={() => scrollToSection('sec-abstract')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition flex items-center justify-between"
            >
              <span>Abstract</span>
            </button>

            {paperData.sections.map((sec) => (
              <div key={sec.id} className="space-y-0.5">
                <button
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition font-medium flex items-center justify-between ${
                    activeSectionId === sec.id
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate">{sec.number}. {sec.title}</span>
                  {sec.id === 'sec-4' && (
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                      Core
                    </span>
                  )}
                </button>

                {/* Subsections if available */}
                {sec.subsections && (
                  <div className="pl-3.5 border-l border-slate-800 space-y-0.5 my-1">
                    {sec.subsections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => scrollToSection(sub.id)}
                        className={`w-full text-left px-2 py-1 rounded text-[11px] transition flex items-center justify-between ${
                          activeSectionId === sub.id
                            ? 'text-cyan-300 bg-cyan-950/40 font-semibold border-l-2 border-cyan-400'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="truncate">{sub.number} {sub.title}</span>
                        {sub.hasFigure && (
                          <span className="text-[9px] text-cyan-400 font-mono">Fig</span>
                        )}
                        {sub.hasTable && (
                          <span className="text-[9px] text-amber-400 font-mono">Tab</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => scrollToSection('sec-references')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition flex items-center justify-between"
            >
              <span>References</span>
              <span className="text-[10px] font-mono text-slate-500">[{paperData.references.length}]</span>
            </button>
          </nav>

          {/* Quick Stats Panel */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Word Count:</span>
              <span className="text-slate-200 font-bold">~3,480 words</span>
            </div>
            <div className="flex justify-between">
              <span>Figures / Tables:</span>
              <span className="text-slate-200 font-bold">{hasAppliedAblation ? '2 Figs / 3 Tabs' : '2 Figs / 2 Tabs'}</span>
            </div>
            <div className="flex justify-between">
              <span>Equations:</span>
              <span className="text-slate-200 font-bold">4 Math Blocks</span>
            </div>
          </div>
        </div>

        {/* Right Document Canvas: Academic Paper Body */}
        <div className="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl text-slate-200 relative">
          <div className={`max-w-4xl mx-auto space-y-8 ${serifMode ? 'font-serif' : 'font-sans'}`}>
            {/* Paper Header / Title */}
            <div className="text-center space-y-4 pb-6 border-b border-slate-800">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {paperData.title}
              </h1>

              {/* Authors & Affiliations */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-300">
                {paperData.authors.map((author, idx) => (
                  <div key={idx} className="text-center">
                    <div className="font-bold text-slate-100">{author.name}</div>
                    <div className="text-slate-400 text-[11px]">{author.institution}</div>
                    <div className="text-cyan-400 text-[10px] font-mono">{author.email}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abstract Box */}
            <div id="sec-abstract" className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 shadow-inner space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Abstract
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                {paperData.abstract}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-400">Keywords:</span>
                {paperData.keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] border border-slate-700">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Main Sections */}
            <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">
              {/* Section 1: Introduction */}
              <section id="sec-1" className="space-y-3 scroll-mt-24">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-1.5">
                  <span className="text-cyan-400 font-mono">1.</span>
                  <span>Introduction</span>
                </h2>
                <div className="whitespace-pre-line text-justify leading-relaxed">
                  {paperData.sections.find(s => s.id === 'sec-1')?.content}
                </div>
              </section>

              {/* Section 2: Related Work */}
              <section id="sec-2" className="space-y-3 scroll-mt-24">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-1.5">
                  <span className="text-cyan-400 font-mono">2.</span>
                  <span>Related Work</span>
                </h2>
                <div className="whitespace-pre-line text-justify leading-relaxed">
                  {paperData.sections.find(s => s.id === 'sec-2')?.content}
                </div>
              </section>

              {/* Section 3: Methodology */}
              <section id="sec-3" className="space-y-3 scroll-mt-24">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-1.5">
                  <span className="text-cyan-400 font-mono">3.</span>
                  <span>Methodology</span>
                </h2>
                <div className="whitespace-pre-line text-justify leading-relaxed">
                  {paperData.sections.find(s => s.id === 'sec-3')?.content}
                </div>
              </section>

              {/* Section 4: Experiments */}
              <section id="sec-4" className="space-y-6 scroll-mt-24">
                <div className="space-y-2 border-b border-slate-800 pb-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <span className="text-cyan-400 font-mono">4.</span>
                    <span>Experiments</span>
                  </h2>
                  <p className="text-slate-400 text-xs">
                    {paperData.sections.find(s => s.id === 'sec-4')?.content}
                  </p>
                </div>

                {/* 4.1 Dataset */}
                <div id="sec-4-1" className="space-y-3 scroll-mt-24">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center space-x-2">
                    <span className="text-cyan-400 font-mono">4.1</span>
                    <span>Dataset & Experimental Setup</span>
                  </h3>
                  <p className="text-justify leading-relaxed">
                    {paperData.sections.find(s => s.id === 'sec-4')?.subsections?.find(sub => sub.id === 'sec-4-1')?.content}
                  </p>

                  {/* Table 1 Embedded */}
                  <div className="my-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 shadow-md">
                    <div className="text-center font-semibold text-xs text-slate-200 mb-2 font-mono">
                      Table 1. Dataset Characteristics and Model Hyperparameter Configurations
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-y-2 border-slate-700">
                        <thead className="border-b border-slate-700 text-slate-300 font-mono text-[11px]">
                          <tr>
                            <th className="py-2 px-3">Parameter / Attribute</th>
                            <th className="py-2 px-3">Specification / Value</th>
                            <th className="py-2 px-3">Description & Physical Units</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                          {experiment.tables[0]?.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-800/40">
                              <td className="py-2 px-3 font-medium text-slate-200 font-sans">{row[0]}</td>
                              <td className="py-2 px-3 text-cyan-300">{row[1]}</td>
                              <td className="py-2 px-3 text-slate-400">{row[2]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 4.2 Baselines */}
                <div id="sec-4-2" className="space-y-3 scroll-mt-24">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center space-x-2">
                    <span className="text-cyan-400 font-mono">4.2</span>
                    <span>Baseline Models</span>
                  </h3>
                  <div className="whitespace-pre-line text-justify leading-relaxed">
                    {paperData.sections.find(s => s.id === 'sec-4')?.subsections?.find(sub => sub.id === 'sec-4-2')?.content}
                  </div>
                </div>

                {/* 4.3 Results & Comparative Analysis */}
                <div id="sec-4-3" className="space-y-4 scroll-mt-24 bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-cyan-300 flex items-center space-x-2">
                      <span className="text-cyan-400 font-mono">4.3</span>
                      <span>Results & Comparative Analysis (Core AI Generated)</span>
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 rounded border border-cyan-400/40">
                      Results Section
                    </span>
                  </div>

                  <div className="whitespace-pre-line text-justify leading-relaxed text-slate-200">
                    {paperData.sections.find(s => s.id === 'sec-4')?.subsections?.find(sub => sub.id === 'sec-4-3')?.content}
                  </div>

                  {/* Embedded Table 2 (Standard Booktabs Table) */}
                  <div className="my-4 bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg">
                    <div className="text-center font-bold text-xs text-slate-200 mb-2 font-mono">
                      Table 2. Quantitative Benchmark Performance on UrbanEV-ChargeBench
                      {hasAppliedStats && (
                        <span className="block text-[11px] text-cyan-400 font-normal mt-0.5">
                          (Mean ± Std over 5 random seed runs; ** denotes p &lt; 0.001 vs Ours via paired Student t-test)
                        </span>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-y-2 border-slate-600">
                        <thead className="border-b border-slate-700 text-slate-300 font-mono text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3">Model</th>
                            <th className="py-2.5 px-3">MAE {hasAppliedUnits ? '(kW)' : ''} ↓</th>
                            <th className="py-2.5 px-3">RMSE {hasAppliedUnits ? '(kW)' : ''} ↓</th>
                            <th className="py-2.5 px-3">MAPE {hasAppliedUnits ? '(%)' : ''} ↓</th>
                            <th className="py-2.5 px-3">Inference {hasAppliedUnits ? '(ms/batch)' : ''}</th>
                            {hasAppliedStats && <th className="py-2.5 px-3">p-value</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-mono">
                          {experiment.baselines.map((b, idx) => (
                            <tr
                              key={idx}
                              className={b.isOurs ? 'bg-cyan-950/40 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800/40'}
                            >
                              <td className="py-2 px-3 font-sans flex items-center space-x-1.5">
                                <span>{b.model}</span>
                                {b.isOurs && <span className="text-[9px] bg-cyan-500/20 px-1 rounded">PROPOSED</span>}
                              </td>
                              <td className="py-2 px-3">
                                {hasAppliedStats ? `${b.mae.toFixed(2)} ± 0.35` : b.mae.toFixed(2)}
                              </td>
                              <td className="py-2 px-3">
                                {hasAppliedStats ? `${b.rmse.toFixed(2)} ± 0.48` : b.rmse.toFixed(2)}
                              </td>
                              <td className="py-2 px-3">
                                {hasAppliedStats ? `${b.mape.toFixed(2)}% ± 0.12%` : `${b.mape.toFixed(2)}%`}
                              </td>
                              <td className="py-2 px-3">{b.inferenceTimeMs.toFixed(1)} ms</td>
                              {hasAppliedStats && (
                                <td className="py-2 px-3 text-cyan-400 font-bold">{b.pValVsOurs}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Embedded Figure 1 Plot in Results */}
                  <div className="my-6">
                    <Figure1Plot showConfidenceInterval={true} />
                    <p className="mt-2 text-center text-xs text-slate-400 italic">
                      Figure 1. 24-Hour Multi-Horizon EV Charging Load Curve: Comparison of ground-truth demand against predictions by the proposed ST-Transformer and baseline LSTM.
                    </p>
                  </div>

                  {/* Embedded Figure 2 Heatmap in Results */}
                  <div className="my-6">
                    <Figure2Heatmap />
                    <p className="mt-2 text-center text-xs text-slate-400 italic">
                      Figure 2. Learned Spatial-Temporal Cross-Attention Correlation Matrix across 8 metropolitan fast-charging clusters showing autonomous discovery of dynamic pricing load migration.
                    </p>
                  </div>
                </div>

                {/* 4.4 Ablation Study (Conditionally Added when Generated in Revision!) */}
                {hasAppliedAblation && (
                  <div id="sec-4-4" className="space-y-4 scroll-mt-24 bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-5 shadow-lg animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-bold text-emerald-300 flex items-center space-x-2">
                        <span className="text-emerald-400 font-mono">4.4</span>
                        <span>Ablation Study & Component Attribution (Generated via AI Agent)</span>
                      </h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/40 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ablation Study Active</span>
                      </span>
                    </div>

                    <p className="text-justify leading-relaxed text-slate-200">
                      To systematically verify the individual contributions of multi-modal features and architectural components, we conduct rigorous ablation experiments by isolating each key mechanism:
                      <br /><br />
                      <strong>1. w/o Weather Features:</strong> Removing ambient temperature, precipitation, and extreme weather flags increases MAE from 14.28 kW to 16.12 kW (+12.9% error increase), demonstrating that meteorological inputs are crucial for capturing seasonal HVAC cooling loads and rainy-day driving habits.
                      <br /><br />
                      <strong>2. w/o Dynamic Pricing (TOU):</strong> Eliminating real-time electricity tariff and surge pricing signal embeddings increases MAPE from 5.82% to 7.42% (+27.5% relative error surge), verifying that price sensitivity strongly dictates fast-charging session timing and station selection.
                      <br /><br />
                      <strong>3. w/o Spatial Cross-Attention:</strong> Replacing dynamic spatial cross-attention with a static Euclidean road-distance graph causes the most severe performance degradation (MAE = 18.05 kW, MAPE = 7.89%, a 35.6% deterioration). This proves that EV demand dynamically shifts between downtown and suburban corridors, which static graph topologies fail to accommodate.
                    </p>

                    {/* Table 3: Ablation Results */}
                    <div className="my-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="text-center font-bold text-xs text-slate-200 mb-2 font-mono">
                        Table 3. Ablation Study: Performance Comparison across Stripped Architectural Variants
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-y-2 border-slate-600">
                          <thead className="border-b border-slate-700 text-slate-300 font-mono text-[11px]">
                            <tr>
                              <th className="py-2 px-3">Ablation Variant</th>
                              <th className="py-2 px-3">Description & Modification</th>
                              <th className="py-2 px-3">MAE (kW) ↓</th>
                              <th className="py-2 px-3">RMSE (kW) ↓</th>
                              <th className="py-2 px-3">MAPE (%) ↓</th>
                              <th className="py-2 px-3">Performance Degradation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 font-mono">
                            <tr className="bg-emerald-950/30 text-emerald-300 font-bold">
                              <td className="py-2 px-3">1. Full ST-Trans (Proposed)</td>
                              <td className="py-2 px-3 font-sans text-slate-300">Complete Model (Weather + TOU + Spatial Attn)</td>
                              <td className="py-2 px-3">14.28</td>
                              <td className="py-2 px-3">22.65</td>
                              <td className="py-2 px-3">5.82%</td>
                              <td className="py-2 px-3 text-emerald-400">Baseline (Optimal)</td>
                            </tr>
                            <tr className="hover:bg-slate-800/40 text-slate-300">
                              <td className="py-2 px-3">2. w/o Weather Features</td>
                              <td className="py-2 px-3 font-sans text-slate-400">Removed ambient temp & rainfall inputs</td>
                              <td className="py-2 px-3">16.12</td>
                              <td className="py-2 px-3">25.40</td>
                              <td className="py-2 px-3">6.78%</td>
                              <td className="py-2 px-3 text-amber-400">+16.5% error increase</td>
                            </tr>
                            <tr className="hover:bg-slate-800/40 text-slate-300">
                              <td className="py-2 px-3">3. w/o Dynamic Pricing</td>
                              <td className="py-2 px-3 font-sans text-slate-400">Removed Time-of-Use tariff embeddings</td>
                              <td className="py-2 px-3">17.45</td>
                              <td className="py-2 px-3">27.18</td>
                              <td className="py-2 px-3">7.42%</td>
                              <td className="py-2 px-3 text-orange-400">+27.5% error increase</td>
                            </tr>
                            <tr className="hover:bg-slate-800/40 text-slate-300">
                              <td className="py-2 px-3">4. w/o Spatial Attention</td>
                              <td className="py-2 px-3 font-sans text-slate-400">Replaced dynamic attention with static graph</td>
                              <td className="py-2 px-3">18.05</td>
                              <td className="py-2 px-3">28.32</td>
                              <td className="py-2 px-3">7.89%</td>
                              <td className="py-2 px-3 text-red-400">+35.6% error increase</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Section 5: Discussion */}
              <section id="sec-5" className="space-y-3 scroll-mt-24">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-1.5">
                  <span className="text-cyan-400 font-mono">5.</span>
                  <span>Discussion</span>
                </h2>
                <div className="whitespace-pre-line text-justify leading-relaxed">
                  {paperData.sections.find(s => s.id === 'sec-5')?.content}
                </div>
              </section>

              {/* Section 6: Conclusion */}
              <section id="sec-6" className="space-y-3 scroll-mt-24">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-1.5">
                  <span className="text-cyan-400 font-mono">6.</span>
                  <span>Conclusion</span>
                </h2>
                <div className="whitespace-pre-line text-justify leading-relaxed">
                  {paperData.sections.find(s => s.id === 'sec-6')?.content}
                </div>
              </section>

              {/* References */}
              <section id="sec-references" className="space-y-3 scroll-mt-24 pt-4 border-t border-slate-800">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                  <span>References</span>
                </h2>
                <div className="space-y-2 text-xs text-slate-400 font-mono">
                  {paperData.references.map((ref) => (
                    <div key={ref.id} className="flex items-start space-x-2">
                      <span className="text-cyan-400 font-bold flex-shrink-0">[{ref.id}]</span>
                      <span className="text-slate-300 font-sans">{ref.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
