import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { AIProgressView } from './components/AIProgressView';
import { CustomerLeadsView } from './components/CustomerLeadsView';
import { MarketIntelligenceView } from './components/MarketIntelligenceView';
import { SupplierIntelligenceView } from './components/SupplierIntelligenceView';
import { CompetitorIntelligenceView } from './components/CompetitorIntelligenceView';
import { OpportunityRadarView } from './components/OpportunityRadarView';
import { TaskCenterView } from './components/TaskCenterView';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { EmailGeneratorModal } from './components/EmailGeneratorModal';
import { mockCustomerLeads, mockTaskHistory } from './data/mockData';
import { CompanyLead, TabType } from './types';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  HelpCircle, 
  Clock, 
  Building2, 
  Download,
  Check,
  Activity
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [leads, setLeads] = useState<CompanyLead[]>(mockCustomerLeads);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<CompanyLead | null>(null);
  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState<CompanyLead | null>(null);
  
  // Active task & scenario context
  const [currentProduct, setCurrentProduct] = useState('铝合金门窗');
  const [currentMarket, setCurrentMarket] = useState('美国、加拿大');
  const [showDemoTourBanner, setShowDemoTourBanner] = useState(true);
  const [showPitchGuide, setShowPitchGuide] = useState(false);
  const [exportToast, setExportToast] = useState(false);

  // Handlers
  const handleStartAICrawl = (formData: {
    product: string;
    market: string;
    targetClients: string;
    extraRequirements: string;
    advancedFilters: any;
  }) => {
    setCurrentProduct(formData.product);
    setCurrentMarket(formData.market);
    setCurrentTab('progress' as TabType);
  };

  const handleChangePreset = (presetValue: string) => {
    if (presetValue === 'aluminum_windows') {
      setCurrentProduct('铝合金门窗');
      setCurrentMarket('美国、加拿大');
    } else if (presetValue === 'solar_brackets') {
      setCurrentProduct('智能光伏支架与跟踪系统');
      setCurrentMarket('德国、西班牙、法国');
    } else if (presetValue === 'injection_molds') {
      setCurrentProduct('精密注塑模具与机械零部件');
      setCurrentMarket('越南、泰国、印尼');
    }
  };

  const handleToggleStar = (leadId: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, isStarred: !lead.isStarred };
      }
      return lead;
    }));

    if (selectedLeadForDetail?.id === leadId) {
      setSelectedLeadForDetail(prev => prev ? { ...prev, isStarred: !prev.isStarred } : null);
    }
  };

  const handleOpenEmailForLead = (lead: CompanyLead) => {
    setSelectedLeadForEmail(lead);
  };

  const handleOpenDetailForLead = (lead: CompanyLead) => {
    setSelectedLeadForDetail(lead);
  };

  const handleRerunTask = (product: string, market: string) => {
    setCurrentProduct(product);
    setCurrentMarket(market);
    setCurrentTab('progress' as TabType);
  };

  const handleExportAll = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeTab={currentTab}
        setActiveTab={(tab) => {
          if (tab === 'favorites') {
            setCurrentTab('customers');
          } else if (tab === 'history') {
            setCurrentTab('tasks');
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenNewTask={() => setCurrentTab('home')}
        onOpenPitchGuide={() => setShowPitchGuide(true)}
        favoriteCount={leads.filter(l => l.isStarred).length}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <Header
          onOpenNewTask={() => setCurrentTab('home')}
          onOpenPitchGuide={() => setShowPitchGuide(true)}
          currentProduct={currentProduct}
          onChangePreset={handleChangePreset}
          onExportAll={handleExportAll}
        />

        {/* 3-Minute Interactive Demo Tour Guide Bar */}
        {showDemoTourBanner && (
          <div className="bg-blue-50/70 border-b border-blue-200/80 px-6 py-2 flex items-center justify-between text-xs text-slate-700 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase shrink-0 shadow-xs">
                3分钟路演向导
              </span>
              <span className="font-medium text-slate-700 whitespace-nowrap">
                推荐演示流程：
                <button
                  onClick={() => setCurrentTab('home')}
                  className={`hover:underline cursor-pointer ml-1 ${currentTab === 'home' ? 'text-blue-700 font-bold' : 'text-slate-600'}`}
                >
                  ① 输入需求
                </button>
                <span className="text-slate-400 mx-1">→</span>
                <button
                  onClick={() => setCurrentTab('progress' as TabType)}
                  className={`hover:underline cursor-pointer ${currentTab === ('progress' as TabType) ? 'text-blue-700 font-bold' : 'text-slate-600'}`}
                >
                  ② AI智能采集清洗
                </button>
                <span className="text-slate-400 mx-1">→</span>
                <button
                  onClick={() => setCurrentTab('customers')}
                  className={`hover:underline cursor-pointer ${currentTab === 'customers' ? 'text-blue-700 font-bold' : 'text-slate-600'}`}
                >
                  ③ 客户情报矩阵
                </button>
                <span className="text-slate-400 mx-1">→</span>
                <button
                  onClick={() => handleOpenDetailForLead(leads[0])}
                  className="hover:underline text-blue-700 font-bold cursor-pointer"
                >
                  ④ 企业画像与五维评分
                </button>
                <span className="text-slate-400 mx-1">→</span>
                <button
                  onClick={() => handleOpenEmailForLead(leads[0])}
                  className="hover:underline text-emerald-700 font-bold cursor-pointer"
                >
                  ⑤ AI定制开发信
                </button>
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-2">
              <button
                onClick={() => setShowPitchGuide(true)}
                className="text-[11px] text-blue-700 hover:text-blue-800 underline font-semibold cursor-pointer"
              >
                查看路演话术
              </button>
              <button
                onClick={() => setShowDemoTourBanner(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                title="关闭向导条"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Scrollable View Router */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-[#F8FAFC]">
          {currentTab === 'home' && (
            <HomeView
              onStartAICrawl={handleStartAICrawl}
              onViewRecentTask={() => setCurrentTab('tasks')}
              onDirectViewResults={() => setCurrentTab('customers')}
              recentTasks={mockTaskHistory}
            />
          )}

          {currentTab === ('progress' as TabType) && (
            <AIProgressView
              product={currentProduct}
              market={currentMarket}
              onComplete={() => setCurrentTab('customers')}
            />
          )}

          {currentTab === 'customers' && (
            <CustomerLeadsView
              leads={leads}
              onSelectLead={handleOpenDetailForLead}
              onGenerateEmail={handleOpenEmailForLead}
              onToggleStar={handleToggleStar}
              onOpenNewTask={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'market' && (
            <MarketIntelligenceView />
          )}

          {currentTab === 'suppliers' && (
            <SupplierIntelligenceView />
          )}

          {currentTab === 'competitors' && (
            <CompetitorIntelligenceView />
          )}

          {currentTab === 'radar' && (
            <OpportunityRadarView
              onSelectLead={handleOpenDetailForLead}
              onGenerateEmail={handleOpenEmailForLead}
            />
          )}

          {currentTab === 'tasks' && (
            <TaskCenterView
              onSelectLead={handleOpenDetailForLead}
              onRerunTask={handleRerunTask}
            />
          )}

          {currentTab === 'settings' && (
            <div className="p-8 max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">系统与智能采集规则设置</h2>
                <p className="text-xs text-slate-500 mt-1">配置数据采集源接入权限、数据清洗阈值及模型偏好</p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-800">数据接入通道状态</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700">全球海关提单实时接口 (142口岸)</span>
                      <span className="text-emerald-600 font-bold font-mono">CONNECTED</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700">海外企业官网爬虫与语义分析集群</span>
                      <span className="text-emerald-600 font-bold font-mono">RUNNING</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700">海外展会名录库与行业目录</span>
                      <span className="text-emerald-600 font-bold font-mono">READY</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-700">Google 地图与本地黄页商业认证</span>
                      <span className="text-emerald-600 font-bold font-mono">SYNCED</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button 
                    onClick={() => setCurrentTab('home')}
                    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs cursor-pointer shadow-sm"
                  >
                    返回新建任务
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Task Status Overlay (High Density pattern) */}
      <div className="fixed bottom-4 right-8 glass-card border border-blue-200 rounded-full px-5 py-2.5 shadow-lg flex items-center gap-3.5 border-l-4 border-l-blue-600 z-40 hidden sm:flex">
        <div className="flex -space-x-1.5">
          <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white"></div>
          <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white"></div>
          <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white"></div>
        </div>
        <div className="text-xs font-medium text-slate-700">
          <span className="text-blue-700 font-bold">实时采集网络</span> · 全球已识别 <span className="font-mono font-bold text-slate-900">823/1,286</span> 家公司
        </div>
        <div className="h-3.5 w-[1px] bg-slate-200"></div>
        <button 
          onClick={() => setCurrentTab('progress' as TabType)}
          className="text-xs text-blue-600 font-bold hover:text-blue-800 cursor-pointer"
        >
          查看实时进程
        </button>
      </div>

      {/* 3. Detail Portrait Modal */}
      {selectedLeadForDetail && (
        <CustomerDetailModal
          lead={selectedLeadForDetail}
          onClose={() => setSelectedLeadForDetail(null)}
          onGenerateEmail={handleOpenEmailForLead}
          onToggleStar={handleToggleStar}
        />
      )}

      {/* 4. AI Email Generator Modal */}
      {selectedLeadForEmail && (
        <EmailGeneratorModal
          lead={selectedLeadForEmail}
          onClose={() => setSelectedLeadForEmail(null)}
        />
      )}

      {/* 5. 3-Minute Demo Pitch Guide Modal */}
      {showPitchGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">3分钟客户路演标准演示流程与话术向导</h3>
                  <p className="text-xs text-slate-500">帮助销售与业务团队向客户清晰传达「AI贸易情报员」的核心价值</p>
                </div>
              </div>
              <button
                onClick={() => setShowPitchGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-sm">第 1 分钟：输入业务需求 & AI自动化采集</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">00:00 - 01:00</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>演示动作：</strong> 在首页点击默认预设「铝合金门窗 · 北美市场」，点击「启动 AI 采集与情报分析」，展示 10 步实时全网清洗流。
                </p>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                  💬 <strong>话术要点：</strong> “传统业务员每天要在Google、海关数据、B2B平台翻找几百个网页。现在只需输入一句话，AI自动在全网142个口岸提单和海外官网完成抓取清洗，30秒完成业务员3天的工作量。”
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-sm">第 2 分钟：客户筛选、五维评分与深度画像</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">01:00 - 02:00</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>演示动作：</strong> 进入客户情报矩阵，点击第一家「ABC Building Supply」，展示五维评分雷达图、合作切入点、海关提单真实记录与关键决策人。
                </p>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                  💬 <strong>话术要点：</strong> “AI不仅能找名单，更能进行深度尽调。你看这里：自动识别出这家加州批发商现有本地供应商交期长达14周，而且有从中国进口铝合金的历史，商机分高达92分，这就是最精准的A级目标。”
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 text-sm">第 3 分钟：AI 一键生成高转化定制开发信</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">02:00 - 03:00</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>演示动作：</strong> 在画像弹窗点击「AI生成开发信」，切换「针对痛点型」与「专业合规型」模板，一键复制邮件并展示跟进下一步清单。
                </p>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                  💬 <strong>话术要点：</strong> “告别千篇一律的垃圾群发。AI直接把客户痛点（Title 24合规、4周现货交期）写进邮件，直击决策人邮箱，业务员只需一键发送，真正做到立刻跟进、快速成单！”
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPitchGuide(false)}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs cursor-pointer shadow-sm"
              >
                我知道了，开始演示
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Export Toast Notification */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <div>
            <div className="font-bold text-white">情报数据简报导出成功</div>
            <div className="text-[11px] text-emerald-200">已生成《2026铝合金门窗北美市场AI情报深度分析报告.xlsx》</div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
