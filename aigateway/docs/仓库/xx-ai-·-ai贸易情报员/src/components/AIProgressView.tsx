import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Globe2, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Search,
  Building2,
  FileCheck2
} from 'lucide-react';

interface AIProgressViewProps {
  product: string;
  market: string;
  onComplete: () => void;
}

export const AIProgressView: React.FC<AIProgressViewProps> = ({
  product,
  market,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(8);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Dynamic ticking numbers
  const [stats, setStats] = useState({
    collected: 120,
    identified: 45,
    qualified: 12,
    highPotential: 2,
    keyLeads: 0,
  });

  const [logs, setLogs] = useState<string[]>([
    '▶ [0.1s] 初始化分布式全球数据采集节点...',
    '▶ [0.3s] 加载业务意图分析模型: 目标品类「' + product + '」, 目标市场「' + market + '」',
  ]);

  const steps = [
    { title: '已理解业务需求', detail: '已提取核心参数、规格偏好与潜在合作诉求', log: '✔ 语义槽位解析完成: 优先匹配具备进口业务与门窗产品线的采购商' },
    { title: '正在分析目标产品', detail: `${product} (断桥铝系统窗 / 极窄边框推拉门 / Low-E节能窗)`, log: '✔ 正在建立铝合金型材、中空节能玻璃及五金配件分类特征库' },
    { title: '正在分析目标市场', detail: `${market} (重点扫描加州、德州、佛州、安大略省及BC省)`, log: '✔ 正在匹配当地建筑节能标准（加州Title 24、佛州Miami-Dade NOA、加拿大Energy Star）' },
    { title: '正在识别目标客户类型', detail: '建材批发商 / 门窗专业经销商 / 建筑材料进口商 / 工程总包', log: '✔ 过滤掉C端个人零售与无关商贸公司，锁定B端核心采购渠道' },
    { title: '正在采集全球企业信息', detail: '多源并发检索：美国海关提单、ThomasNet、D&B、展会名录', log: '✔ 正在从142个口岸海关提单库调取HS 7610.10.00进出口记录...' },
    { title: '正在识别企业主营业务', detail: '深度解析企业官网产品目录、工程案例与服务半径', log: '✔ 官网AI语义抓取: 识别企业在售门窗品牌、材质结构与价格区间' },
    { title: '正在筛选潜在客户', detail: '多维度加权过滤：排除倒闭停运实体，锁定高活跃度企业', log: '✔ 交叉验证企业运营状态、社媒动态与最新工商合规记录' },
    { title: '正在分析企业采购可能性', detail: '测算海外供应链依赖度、现有供应商交期痛点与扩产需求', log: '✔ 识别到42家采购商近期面临北美本地供应商交期拉长痛点' },
    { title: '正在计算客户潜力评分', detail: '5维智能算分：产品匹配、企业规模、市场匹配、采购潜力、合作概率', log: '✔ 正在生成综合评分矩阵，已评出38家A级高潜客户' },
    { title: '正在生成客户情报及定制开发策略', detail: '正在生成企业画像、商机机会点与专属开发邮件策略', log: '✔ 正在输出首批237家企业完整情报档案与下一步行动建议' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          const nextIndex = prev + 1;
          setLogs((prevLogs) => [
            ...prevLogs.slice(-6),
            `▶ [${(nextIndex * 0.7).toFixed(1)}s] ${steps[nextIndex].log}`
          ]);
          return nextIndex;
        }
        return prev;
      });

      setProgressPercent((prev) => {
        if (prev >= 98) {
          clearInterval(timer);
          return 100;
        }
        const delta = Math.floor(Math.random() * 8) + 8;
        return Math.min(prev + delta, 98);
      });

      setStats((prev) => ({
        collected: Math.min(prev.collected + Math.floor(Math.random() * 120 + 80), 1286),
        identified: Math.min(prev.identified + Math.floor(Math.random() * 80 + 50), 823),
        qualified: Math.min(prev.qualified + Math.floor(Math.random() * 25 + 15), 237),
        highPotential: Math.min(prev.highPotential + Math.floor(Math.random() * 4 + 3), 38),
        keyLeads: Math.min(prev.keyLeads + Math.floor(Math.random() * 2 + 1), 12),
      }));
    }, 700 / speedMultiplier);

    return () => clearInterval(timer);
  }, [speedMultiplier]);

  useEffect(() => {
    if (progressPercent >= 98 && currentStepIndex >= steps.length - 1) {
      const finishTimeout = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(finishTimeout);
    }
  }, [progressPercent, currentStepIndex, onComplete]);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI 自动化商业情报采集与多源交叉清洗引擎</span>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          AI正在为你寻找全球潜在客户
        </h2>
        <p className="text-xs text-slate-500 max-w-2xl mx-auto">
          正在从全球公开海关提单、企业官网、行业展会及商业信用库中进行大规模语义解析与商机匹配
        </p>

        {/* Speed and Skip actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md p-1 text-xs shadow-xs">
            <span className="text-slate-500 px-2 text-[11px] font-medium">播放速度:</span>
            <button
              onClick={() => setSpeedMultiplier(1)}
              className={`px-2 py-0.5 rounded text-xs font-mono cursor-pointer ${speedMultiplier === 1 ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              1.0x
            </button>
            <button
              onClick={() => setSpeedMultiplier(2)}
              className={`px-2 py-0.5 rounded text-xs font-mono cursor-pointer ${speedMultiplier === 2 ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              2.0x (加速)
            </button>
          </div>

          <button
            onClick={onComplete}
            className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-blue-200" />
            <span>跳过等待 · 直接查看结果</span>
          </button>
        </div>
      </div>

      {/* 2. Dynamic Live Data Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>已采集企业</span>
            <Globe2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">
            {stats.collected.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">海量公开多源数据源</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>已识别企业</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-blue-600 font-mono">
            {stats.identified.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">完成官网语义解析</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>符合条件企业</span>
            <FilterIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-blue-700 font-mono">
            {stats.qualified.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">匹配目标产品线</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between shadow-xs bg-gradient-to-b from-white to-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>高潜客户 (A级)</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 font-mono">
            {stats.highPotential}
          </div>
          <div className="text-[10px] text-emerald-700 mt-1 font-medium">具备高合作意愿</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-amber-200 flex flex-col justify-between shadow-xs bg-gradient-to-b from-white to-amber-50/30 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
            <span>重点客户 (S级)</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 font-mono">
            {stats.keyLeads}
          </div>
          <div className="text-[10px] text-amber-700 mt-1 font-medium">推荐优先开发</div>
        </div>
      </div>

      {/* 3. Execution Pipeline & Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 10 Milestone Steps */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>实时执行工作流 (10项全自动分析节点)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-blue-600">
              {Math.min(Math.round(((currentStepIndex + 1) / steps.length) * 100), 100)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${Math.min(((currentStepIndex + 1) / steps.length) * 100, 100)}%` }}
            ></div>
          </div>

          {/* Step items */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {steps.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isPending = idx > currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all ${
                    isDone
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : isCurrent
                      ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isDone && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {isCurrent && (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      )}
                      {isPending && (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-semibold ${isCurrent ? 'text-blue-900' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-mono font-semibold">
                            PROCESSING
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Terminal Log Stream */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">AI 实时采集控制台</span>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE STREAM
              </span>
            </div>

            {/* Terminal Window */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2 h-[260px] overflow-y-auto">
              <div className="text-slate-500 text-[10px] pb-1 border-b border-slate-800 font-mono">
                XX-TRADE-INTELLIGENCE v4.8 [NODE: US-WEST-01 / SG-HUB]
              </div>
              {logs.map((log, i) => (
                <div key={i} className="text-emerald-400/90 leading-relaxed break-words">
                  {log}
                </div>
              ))}
              <div className="flex items-center gap-1 text-blue-400 animate-pulse">
                <span>❯</span>
                <span className="w-2 h-4 bg-blue-400 inline-block"></span>
              </div>
            </div>
          </div>

          {/* Bottom Card Summary */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              <span>预计完成：正在生成最终客户情报</span>
            </div>
            <button
              onClick={onComplete}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-xs cursor-pointer"
            >
              <span>查看结果</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
