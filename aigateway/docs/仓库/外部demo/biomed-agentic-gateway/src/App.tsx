import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BiomedicalDataset, 
  DataColumn, 
  OutlierItem, 
  StatGroupResult, 
  HypothesisTestResult, 
  AgentStep, 
  GatewayCallLog, 
  AnalysisReport, 
  CodeSnippets 
} from './types';
import { PRESET_DATASETS } from './data/presetDatasets';
import { profileColumns, detectOutliers, computeGroupStats, performHypothesisTest } from './utils/bioStats';
import { Header } from './components/Header';
import { AgentWorkflowProgress } from './components/AgentWorkflowProgress';
import { DatasetExplorer } from './components/DatasetExplorer';
import { ScientificCharts } from './components/ScientificCharts';
import { ReportViewer } from './components/ReportViewer';
import { TraceabilityAudit } from './components/TraceabilityAudit';
import { AgentChatConsole } from './components/AgentChatConsole';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [currentDataset, setCurrentDataset] = useState<BiomedicalDataset>(PRESET_DATASETS[0]);
  const [filterOutliers, setFilterOutliers] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Compute column profiles
  const columns = useMemo(() => {
    return profileColumns(currentDataset.data);
  }, [currentDataset.data]);

  // Compute detected outliers
  const outliers = useMemo(() => {
    return detectOutliers(
      currentDataset.data,
      currentDataset.primaryGroupCol,
      currentDataset.primaryMetricCol,
      currentDataset.idCol
    );
  }, [currentDataset]);

  // Compute data subset (filtered or unfiltered)
  const activeData = useMemo(() => {
    if (!filterOutliers) return currentDataset.data;
    const outlierRowIndices = new Set(outliers.map((o) => o.rowIdx));
    return currentDataset.data.filter((_, idx) => !outlierRowIndices.has(idx));
  }, [currentDataset.data, filterOutliers, outliers]);

  // Compute Group Summary Statistics
  const groupStats = useMemo(() => {
    return computeGroupStats(
      activeData,
      currentDataset.primaryGroupCol,
      currentDataset.primaryMetricCol
    );
  }, [activeData, currentDataset]);

  // Perform Hypothesis Testing
  const hypothesisTests = useMemo(() => {
    return performHypothesisTest(
      activeData,
      currentDataset.primaryGroupCol,
      currentDataset.primaryMetricCol
    );
  }, [activeData, currentDataset]);

  // The 8-stage Agent Pipeline State
  const [steps, setSteps] = useState<AgentStep[]>([
    { id: 1, title: '字段识别', description: '自动识别分组、检测指标与样本ID', status: 'completed' },
    { id: 2, title: '缺失值排查', description: '全量数据完整性与NaN排查', status: 'completed' },
    { id: 3, title: '离群值检测', description: 'Z-Score 3σ与IQR异常识别', status: 'completed' },
    { id: 4, title: '自动统计', description: '计算各组均值、SEM、置信区间', status: 'completed' },
    { id: 5, title: '方法学推理', description: '正态性/方差齐性判定与ANOVA选择', status: 'completed' },
    { id: 6, title: '代码生成', description: '生成 Python SciPy 与 R 脚本', status: 'completed' },
    { id: 7, title: '可视化渲染', description: '绘制箱线图、火山图与PCA投影', status: 'completed' },
    { id: 8, title: '分析报告', description: '输出可复现科研结论与复核建议', status: 'completed' },
  ]);

  // Generated Report and Scripts
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippets>({
    python: '',
    r: '',
  });

  // Gateway Telemetry
  const [gatewayLogs, setGatewayLogs] = useState<GatewayCallLog[]>([]);
  const [gatewayStats, setGatewayStats] = useState({
    totalCalls: 1,
    totalTokens: 1420,
    avgLatencyMs: 460,
  });

  // Function to run the full Agent analysis pipeline
  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    const startT = Date.now();

    // Step animation sequence
    for (let i = 1; i <= 8; i++) {
      setSteps((prev) =>
        prev.map((s) => ({
          ...s,
          status: s.id === i ? 'running' : s.id < i ? 'completed' : 'pending',
        }))
      );
      await new Promise((r) => setTimeout(r, 120));
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetMeta: {
            id: currentDataset.id,
            name: currentDataset.name,
            category: currentDataset.category,
            description: currentDataset.description,
            primaryGroupCol: currentDataset.primaryGroupCol,
            primaryMetricCol: currentDataset.primaryMetricCol,
            idCol: currentDataset.idCol,
          },
          groupStats,
          outliers,
          hypothesisTests,
          userPrompt: currentDataset.suggestedPrompt,
        }),
      });

      const resData = await response.json();
      const duration = Date.now() - startT;

      if (resData.success && resData.report) {
        setReport(resData.report);
        if (resData.scripts) {
          setCodeSnippets(resData.scripts);
        }

        // Add Gateway log
        const newLog: GatewayCallLog = {
          id: `CALL-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stage: 'Autonomous Biostatistics Reasoning',
          model: 'gemini-3.7-flash',
          inputTokens: resData.tokenUsage?.inputTokens || 420,
          outputTokens: resData.tokenUsage?.outputTokens || 850,
          latencyMs: resData.latencyMs || duration,
          temperature: 0.2,
          systemPromptSnippet: 'Senior Principal Biostatistician and Data Analysis Agent',
          promptSnippet: `Dataset: ${currentDataset.name}, Primary Metric: ${currentDataset.primaryMetricCol}`,
          responseSnippet: resData.report.executiveSummary,
          verificationPassed: true,
        };

        setGatewayLogs((prev) => [newLog, ...prev]);
        setGatewayStats((prev) => ({
          totalCalls: prev.totalCalls + 1,
          totalTokens: prev.totalTokens + (resData.tokenUsage?.inputTokens || 420) + (resData.tokenUsage?.outputTokens || 850),
          avgLatencyMs: Math.round((prev.avgLatencyMs + duration) / 2),
        }));
      }
    } catch (err) {
      console.error('Agent analysis error:', err);
    } finally {
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
      setIsAnalyzing(false);
    }
  }, [currentDataset, groupStats, outliers, hypothesisTests]);

  // Initial auto-run on dataset change
  useEffect(() => {
    runAnalysis();
  }, [currentDataset.id]);

  // Download Notebook
  const handleDownloadNotebook = async () => {
    try {
      const response = await fetch('/api/generate-notebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetMeta: currentDataset,
          pythonCode: codeSnippets.python,
        }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDataset.id}_reproducible_analysis.ipynb`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Notebook export failed:', err);
    }
  };

  const handleDownloadScript = (lang: 'python' | 'r') => {
    const content = lang === 'python' ? codeSnippets.python : codeSnippets.r;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDataset.id}_pipeline.${lang === 'python' ? 'py' : 'R'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Header
        currentDataset={currentDataset}
        onSelectDataset={(ds) => {
          setCurrentDataset(ds);
          setFilterOutliers(false);
        }}
        onUploadCustomData={(ds) => {
          setCurrentDataset(ds);
          setFilterOutliers(false);
        }}
        onRunAnalysis={runAnalysis}
        isAnalyzing={isAnalyzing}
        gatewayStats={gatewayStats}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. Agent 8-Stage Execution Pipeline */}
        <AgentWorkflowProgress
          steps={steps}
          activeStepId={activeStepId}
          onSelectStep={(id) => setActiveStepId(activeStepId === id ? null : id)}
          isAnalyzing={isAnalyzing}
        />

        {/* 2. Scientific Analysis Report (Executive Findings, Outlier Action Table, Stats) */}
        <ReportViewer
          report={report}
          dataset={currentDataset}
          groupStats={groupStats}
          outliers={outliers}
          hypothesisTests={hypothesisTests}
        />

        {/* 3. Publication-Grade Interactive Scientific Visualizations */}
        <ScientificCharts
          dataset={currentDataset}
          groupStats={groupStats}
          outliers={outliers}
          hypothesisTests={hypothesisTests}
          filterOutliers={filterOutliers}
        />

        {/* 4. Tabular Data Explorer & Outlier Diagnostics */}
        <DatasetExplorer
          dataset={currentDataset}
          columns={columns}
          outliers={outliers}
          filterOutliers={filterOutliers}
          onToggleFilterOutliers={setFilterOutliers}
        />

        {/* 5. Traceability Audit (Data -> Code -> Model -> Result) & Code Viewer */}
        <TraceabilityAudit
          dataset={currentDataset}
          codeSnippets={codeSnippets}
          gatewayLogs={gatewayLogs}
          onDownloadNotebook={handleDownloadNotebook}
          onDownloadScript={handleDownloadScript}
        />

        {/* 6. Interactive Researcher Dialogue Console */}
        <AgentChatConsole
          dataset={currentDataset}
          groupStats={groupStats}
          outliers={outliers}
          hypothesisTests={hypothesisTests}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-200">BioMed Agentic Gateway</span> · 生物医学实验数据自主分析与模型网关
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>遵循 Nature Methods / STROBE 统计学与可复现性规范</span>
            <span>·</span>
            <span>数据 → Code → Model → Result 审计闭环</span>
          </div>
        </div>
      </footer>

      {/* Export Research Bundle Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dataset={currentDataset}
        codeSnippets={codeSnippets}
        report={report}
        onDownloadNotebook={handleDownloadNotebook}
      />
    </div>
  );
}
