/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PRESET_PAPERS } from './data/presetPapers';
import { 
  ResearchPaper, 
  PipelineStage, 
  GeneratedCodeFile, 
  TrainingEpochLog, 
  ConsoleLogMessage, 
  ChatMessage 
} from './types';
import { Header } from './components/Header';
import { PipelineStepper } from './components/PipelineStepper';
import { ScientificSupervisorChat } from './components/ScientificSupervisorChat';
import { PaperExtractorView } from './components/PaperExtractorView';
import { ExperimentPlanView } from './components/ExperimentPlanView';
import { CodeExplorerView } from './components/CodeExplorerView';
import { ExperimentRunnerView } from './components/ExperimentRunnerView';
import { ResultComparisonView } from './components/ResultComparisonView';
import { PublicationChartsView } from './components/PublicationChartsView';
import { PaperUploadModal } from './components/PaperUploadModal';
import { exportProjectAsZip } from './utils/zipExporter';

// Utility for guaranteed unique IDs
let globalLogCounter = 0;
const createUniqueId = (prefix: string) => {
  globalLogCounter += 1;
  return `${prefix}-${Date.now()}-${globalLogCounter}-${Math.random().toString(36).substring(2, 7)}`;
};

export default function App() {
  const [allPapers, setAllPapers] = useState<ResearchPaper[]>(PRESET_PAPERS);
  const [currentPaper, setCurrentPaper] = useState<ResearchPaper>(PRESET_PAPERS[0]);
  const [activeStage, setActiveStage] = useState<PipelineStage>('extract');
  const [activeFile, setActiveFile] = useState<GeneratedCodeFile>(PRESET_PAPERS[0].files[0]);
  const [highlightFormula, setHighlightFormula] = useState<string | null>(null);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Experiment execution state
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const currentEpochRef = useRef(0);
  useEffect(() => {
    currentEpochRef.current = currentEpoch;
  }, [currentEpoch]);

  const [maxEpochs] = useState(50);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState<TrainingEpochLog[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogMessage[]>([
    {
      id: 'log-init-0',
      timestamp: '08:46:00',
      level: 'INFO',
      message: 'Paper2Code Agent initialized. Environment ready (PyTorch 2.2 + CUDA 12.1).'
    }
  ]);

  // Chat Supervisor Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      role: 'assistant',
      content: `您好！我是您的 **Paper2Code 科研实验代码复现智能体**。\n\n针对当前论文 **《${currentPaper.title}》**，我已经完成以下准备：\n1. ✅ **论文解析**：已提取 Section 4 实验方法、数据切分与核心数学公式（Eq 1-4）；\n2. 📋 **实验规划**：已设定 Table 2 多变量预测协议（H=96, 192, 336, 720）；\n3. 💻 **代码工程**：已自动生成完整 Python 项目（\`/data\`, \`/models\`, \`train.py\`, \`evaluate.py\`, \`config.yaml\` 等）；\n\n您可以点击右上角「**一键复现 Table 2**」或直接对我说：“**按照论文 Section 4 的实验设计，帮我复现 Table 2**”。`,
      timestamp: 'Just now',
      suggestedAction: {
        label: '一键复现 Table 2',
        type: 'run_experiment'
      }
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Switch Paper handler
  const handleSelectPaper = (paper: ResearchPaper) => {
    setCurrentPaper(paper);
    setActiveFile(paper.files[0]);
    setActiveStage('extract');
    setIsExecuting(false);
    setIsCompleted(false);
    setCurrentEpoch(0);
    currentEpochRef.current = 0;
    setTrainingLogs([]);
    setConsoleLogs([
      {
        id: createUniqueId('log-switch'),
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        message: `Switched active paper to [${paper.shortName}]. Ready for reproduction.`
      }
    ]);
  };

  // Navigate to Code with optional formula highlight
  const handleNavigateToCode = (targetPath: string, formulaName?: string) => {
    const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
    const found = currentPaper.files.find(f => f.path === cleanPath || f.filename === targetPath);
    if (found) {
      setActiveFile(found);
    } else {
      setActiveFile(currentPaper.files[2]); // models/model.py default
    }
    if (formulaName) {
      setHighlightFormula(formulaName);
    }
    setActiveStage('code');
  };

  // ZIP Download
  const handleDownloadZip = () => {
    exportProjectAsZip(currentPaper.title, currentPaper.files);
    // Add console log
    setConsoleLogs(prev => [
      ...prev,
      {
        id: createUniqueId('log-zip'),
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        message: `Project exported as ZIP (${currentPaper.files.length} files bundled).`
      }
    ]);
  };

  // Simulation step generation
  const generateEpochLog = (epoch: number): TrainingEpochLog => {
    const progress = epoch / maxEpochs;
    // Decaying loss curve simulating real convergence
    const train_loss = 0.52 * Math.exp(-progress * 2.8) + 0.148 + (Math.random() * 0.004 - 0.002);
    const val_loss = 0.55 * Math.exp(-progress * 2.6) + 0.151 + (Math.random() * 0.005 - 0.0025);
    const test_mse = 0.48 * Math.exp(-progress * 2.5) + 0.151 + (Math.random() * 0.003 - 0.0015);
    const test_mae = 0.42 * Math.exp(-progress * 2.2) + 0.199 + (Math.random() * 0.003 - 0.0015);
    const lr = 0.0005 * (0.5 * (1 + Math.cos((Math.PI * epoch) / maxEpochs)));

    return {
      epoch,
      train_loss,
      val_loss,
      test_mse,
      test_mae,
      learning_rate: lr,
      gpu_mem_mb: 1840 + Math.floor(Math.random() * 60),
      time_seconds: epoch * 1.8
    };
  };

  // Run experiment simulation loop
  const timerRef = useRef<any>(null);

  const startExperiment = () => {
    setActiveStage('execute');
    setIsExecuting(true);
    setIsCompleted(false);

    setConsoleLogs(prev => [
      ...prev,
      {
        id: createUniqueId('log-start'),
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        message: `Starting PyTorch training: dataset=Weather, seq_len=336, pred_len=96, batch_size=128...`
      }
    ]);
  };

  const pauseExperiment = () => {
    setIsExecuting(false);
  };

  const resetExperiment = () => {
    setIsExecuting(false);
    setIsCompleted(false);
    setCurrentEpoch(0);
    currentEpochRef.current = 0;
    setTrainingLogs([]);
  };

  const fastForwardExperiment = () => {
    setIsExecuting(false);
    setIsCompleted(true);
    setCurrentEpoch(50);
    currentEpochRef.current = 50;
    const fullLogs: TrainingEpochLog[] = [];
    for (let e = 1; e <= 50; e++) {
      fullLogs.push(generateEpochLog(e));
    }
    setTrainingLogs(fullLogs);
    setConsoleLogs(prev => [
      ...prev,
      {
        id: createUniqueId('log-ff-done'),
        timestamp: new Date().toLocaleTimeString(),
        level: 'METRIC',
        message: `[Fast-Forward Completed] 50/50 Epochs finished. Best Val MSE: 0.1512. Test MSE (H=96): 0.151.`
      },
      {
        id: createUniqueId('log-ff-ckpt'),
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        message: `Best model checkpoint saved to ./results/checkpoints/best_checkpoint.pth.`
      }
    ]);
  };

  // Interval execution effect
  useEffect(() => {
    if (isExecuting && !isCompleted) {
      timerRef.current = setInterval(() => {
        const nextEpoch = currentEpochRef.current + 1;
        if (nextEpoch > maxEpochs) {
          setIsExecuting(false);
          setIsCompleted(true);
          return;
        }

        const log = generateEpochLog(nextEpoch);
        currentEpochRef.current = nextEpoch;
        setCurrentEpoch(nextEpoch);
        setTrainingLogs(prevLogs => [...prevLogs, log]);

        if (nextEpoch % 5 === 0 || nextEpoch === 1 || nextEpoch === 50) {
          const formattedMsg = `Epoch [${nextEpoch < 10 ? '0' + nextEpoch : nextEpoch}/50] | Train Loss: ${log.train_loss.toFixed(4)} | Val Loss: ${log.val_loss.toFixed(4)} | Test MSE: ${log.test_mse.toFixed(4)} | LR: ${log.learning_rate.toFixed(6)}`;
          setConsoleLogs(prevConsole => [
            ...prevConsole,
            {
              id: createUniqueId(`log-ep-${nextEpoch}`),
              timestamp: new Date().toLocaleTimeString(),
              level: nextEpoch === 50 ? 'METRIC' : 'INFO',
              message: formattedMsg
            }
          ]);
        }

        if (nextEpoch >= maxEpochs) {
          clearInterval(timerRef.current);
          setIsExecuting(false);
          setIsCompleted(true);
          setConsoleLogs(prevConsole => [
            ...prevConsole,
            {
              id: createUniqueId('log-completed'),
              timestamp: new Date().toLocaleTimeString(),
              level: 'METRIC',
              message: `[✓] Training and Evaluation finished! All Table 2 horizons evaluated.`
            }
          ]);
        }
      }, 350);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExecuting, isCompleted, maxEpochs]);

  // One-click quick reproduction trigger
  const handleQuickReproduce = () => {
    startExperiment();
    fastForwardExperiment();
    setActiveStage('compare');
    
    // Add chat message
    setChatMessages(prev => [
      ...prev,
      {
        id: createUniqueId('chat-user-repro'),
        role: 'user',
        content: '按照论文 Section 4 的实验设计，帮我复现 Table 2。',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: createUniqueId('chat-agent-repro'),
        role: 'assistant',
        content: `已为您自动完成 **Table 2 实验复现闭环**：\n\n1. **数据与模型加载**：已在 \`models/model.py\` 与 \`data/dataset.py\` 完成 RevIN 归一化与 Patch Tokenization；\n2. **多步长训练与评测**：完成 Weather 数据集在 4 个预测步长（H=96, 192, 336, 720）下的拟合；\n3. **复现结果对齐**：\n   - H=96 MSE: **0.151**（原论文报告: 0.149，偏差仅 +1.3%）\n   - H=192 MSE: **0.196**（原论文报告: 0.194）\n   - H=336 MSE: **0.247**（原论文报告: 0.245）\n   - H=720 MSE: **0.318**（原论文报告: 0.314）\n\n已自动跳转至「**结果对比与归因**」面板，您可以查看详细差异归因分析！`,
        timestamp: new Date().toLocaleTimeString(),
        suggestedAction: {
          label: '查看差异成因与 LaTeX 表格',
          type: 'switch_tab',
          payload: 'compare'
        }
      }
    ]);
  };

  // Chat message send handler
  const handleSendMessage = async (userMsg: string) => {
    const newMsg: ChatMessage = {
      id: createUniqueId('chat-u'),
      role: 'user',
      content: userMsg,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, newMsg]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          paperContext: {
            title: currentPaper.title,
            targetSection: currentPaper.targetSection,
            targetGoal: currentPaper.targetGoal
          },
          currentConfig: currentPaper.experimentPlan.hyperparameters
        })
      });

      const data = await res.json();
      const replyContent = data.reply || '已收到您的科研指令，正在优化代码与实验配置。';

      setChatMessages(prev => [
        ...prev,
        {
          id: createUniqueId('chat-a'),
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);

      // If user asks to reproduce or compare, intelligently switch view
      if (userMsg.includes('复现 Table 2') || userMsg.includes('运行实验')) {
        handleQuickReproduce();
      } else if (userMsg.includes('差异') || userMsg.includes('对比')) {
        setActiveStage('compare');
      } else if (userMsg.includes('图表') || userMsg.includes('latex') || userMsg.includes('表格')) {
        setActiveStage('charts');
      } else if (userMsg.includes('代码') || userMsg.includes('公式')) {
        setActiveStage('code');
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          id: createUniqueId('chat-err'),
          role: 'assistant',
          content: `科研智能体回复失败: ${err.message || '网络连接异常'}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleApplySuggestedAction = (action: any) => {
    if (action.type === 'run_experiment') {
      handleQuickReproduce();
    } else if (action.type === 'switch_tab') {
      setActiveStage(action.payload || 'compare');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black">
      
      {/* Top Navbar */}
      <Header
        currentPaper={currentPaper}
        allPapers={allPapers}
        onSelectPaper={handleSelectPaper}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onQuickReproduce={handleQuickReproduce}
        onDownloadZip={handleDownloadZip}
        onRunExperiment={startExperiment}
        isExecuting={isExecuting}
      />

      {/* 6-Stage Scientific Pipeline Stepper */}
      <PipelineStepper
        activeStage={activeStage}
        onSelectStage={(stage) => setActiveStage(stage)}
        isExecuted={isCompleted || trainingLogs.length > 0}
      />

      {/* Main Dual-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Scientific Supervisor AI Panel (Fixed 340px) */}
        <div className="w-80 lg:w-96 shrink-0 hidden md:block h-[calc(100vh-112px)]">
          <ScientificSupervisorChat
            currentPaper={currentPaper}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            onApplySuggestedAction={handleApplySuggestedAction}
            isLoading={isChatLoading}
          />
        </div>

        {/* Right Side: Active Scientific Stage Workstation */}
        <div className="flex-1 overflow-y-auto bg-[#0A0B10] h-[calc(100vh-112px)]">
          {activeStage === 'extract' && (
            <PaperExtractorView
              currentPaper={currentPaper}
              onNavigateToCode={handleNavigateToCode}
              onProceedToPlan={() => setActiveStage('plan')}
            />
          )}

          {activeStage === 'plan' && (
            <ExperimentPlanView
              currentPaper={currentPaper}
              onProceedToCode={() => setActiveStage('code')}
              onRunExperiment={startExperiment}
            />
          )}

          {activeStage === 'code' && (
            <CodeExplorerView
              currentPaper={currentPaper}
              activeFile={activeFile}
              onSelectFile={(file) => {
                setActiveFile(file);
                setHighlightFormula(null);
              }}
              onDownloadZip={handleDownloadZip}
              highlightFormula={highlightFormula}
            />
          )}

          {activeStage === 'execute' && (
            <ExperimentRunnerView
              currentPaper={currentPaper}
              trainingLogs={trainingLogs}
              consoleLogs={consoleLogs}
              currentEpoch={currentEpoch}
              maxEpochs={maxEpochs}
              isRunning={isExecuting}
              isCompleted={isCompleted}
              onStart={startExperiment}
              onPause={pauseExperiment}
              onReset={resetExperiment}
              onFastForward={fastForwardExperiment}
              onProceedToCompare={() => setActiveStage('compare')}
            />
          )}

          {activeStage === 'compare' && (
            <ResultComparisonView
              currentPaper={currentPaper}
              onProceedToCharts={() => setActiveStage('charts')}
              onAskSupervisor={handleSendMessage}
            />
          )}

          {activeStage === 'charts' && (
            <PublicationChartsView
              currentPaper={currentPaper}
            />
          )}
        </div>

      </div>

      {/* Modal: Upload / Create Custom Paper Reproduction */}
      <PaperUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPaperCreated={(newPaper) => {
          setAllPapers(prev => [newPaper, ...prev]);
          handleSelectPaper(newPaper);
        }}
      />

    </div>
  );
}
