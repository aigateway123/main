import React, { useState } from 'react';
import { Map, Layers, Network, Compass, Sparkles, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

interface ResearchMapProps {
  topic: string;
}

export const ResearchMap: React.FC<ResearchMapProps> = ({ topic }) => {
  const [activeTab, setActiveTab] = useState<'topology' | 'gap_matrix' | 'variable_flow'>('topology');

  // Topology node clusters
  const clusters = [
    {
      category: '时空关联建模 (Spatio-Temporal)',
      color: 'border-blue-300 bg-blue-50 text-blue-900',
      badge: 'bg-blue-600 text-white',
      nodes: [
        { name: 'ST-GCN', type: '成熟基准', status: 'high' },
        { name: 'Graph WaveNet', type: '主流架构', status: 'high' },
        { name: '自适应可学习拓扑', type: '前沿热点', status: 'frontier' },
        { name: '跨城市图元学习', type: '新兴空白', status: 'gap' },
      ],
    },
    {
      category: '多源协变量耦合 (Multi-Covariates)',
      color: 'border-amber-300 bg-amber-50 text-amber-900',
      badge: 'bg-amber-600 text-white',
      nodes: [
        { name: '历史负荷时序', type: '基础特征', status: 'high' },
        { name: 'ERA5 微气象网格', type: '关键物理量', status: 'frontier' },
        { name: '实时 LMP 分时电价', type: '因果博弈量', status: 'frontier' },
        { name: '极端天气降额方程', type: '物理先验空白', status: 'gap' },
      ],
    },
    {
      category: '决策与因果推断 (Causal & Decision)',
      color: 'border-emerald-300 bg-emerald-50 text-emerald-900',
      badge: 'bg-emerald-600 text-white',
      nodes: [
        { name: '单向时间回归', type: '传统方法', status: 'high' },
        { name: '多智能体博弈 (MARL)', type: '前沿探索', status: 'frontier' },
        { name: '工具变量因果解耦', type: '前沿热点', status: 'frontier' },
        { name: '反事实涌浪负荷抑制', type: '理论制高点', status: 'gap' },
      ],
    },
  ];

  return (
    <section id="research-map-section" className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      {/* Background Matrix Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Map className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Global Knowledge Landscape
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Research Map (科研全景图谱与空白识别)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              知识图谱演化路径 · 核心算法分支 · 关键空白 (Research Gap) 定位
            </p>
          </div>

          {/* Map Tabs */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('topology')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'topology'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              前沿知识演化图谱
            </button>
            <button
              onClick={() => setActiveTab('gap_matrix')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'gap_matrix'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              三维科研空白矩阵 (Gap Matrix)
            </button>
            <button
              onClick={() => setActiveTab('variable_flow')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'variable_flow'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              多源变量耦合流 (Variable Flow)
            </button>
          </div>
        </div>

        {/* Tab 1: Knowledge Clusters Topology */}
        {activeTab === 'topology' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clusters.map((cluster, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold font-mono text-indigo-400">
                      Cluster 0{idx + 1}
                    </span>
                    <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                      学术聚类
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-4">
                    {cluster.category}
                  </h3>

                  <div className="space-y-2.5">
                    {cluster.nodes.map((node, nIdx) => (
                      <div
                        key={nIdx}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          node.status === 'gap'
                            ? 'border-rose-500/40 bg-rose-950/20 text-rose-200 shadow-sm shadow-rose-900/20 ring-1 ring-rose-500/20'
                            : node.status === 'frontier'
                            ? 'border-indigo-500/40 bg-indigo-950/20 text-indigo-200'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              node.status === 'gap'
                                ? 'bg-rose-400 animate-pulse'
                                : node.status === 'frontier'
                                ? 'bg-indigo-400'
                                : 'bg-slate-500'
                            }`}
                          />
                          <span className="text-xs font-semibold">{node.name}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                            node.status === 'gap'
                              ? 'bg-rose-500/30 text-rose-300 font-bold'
                              : node.status === 'frontier'
                              ? 'bg-indigo-500/30 text-indigo-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {node.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>红色标记项为待突破创新空白</span>
                  <span className="text-indigo-400 font-mono">100% 覆盖</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Gap Matrix */}
        {activeTab === 'gap_matrix' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>GAP 01: 极端天气物理降额机制断裂</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  主流深度模型忽略了动力电池在 -15℃ 以下发生锂电极化阻抗剧增的 BMS
                  主动限功率行为，纯数据回归在极端寒潮发生时存在超过 35% 的虚高预测偏差。
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
                  ✓ 解决方案：引入 Arrhenius 电化学机理正则化算子
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>GAP 02: 电价价格弹性的反向因果盲区</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  分时电价在传统文献中被作为外生独立变量输入，导致模型无法预测当降价广播发布后车主集体涌入同一场站引发的“二次反弹峰值”。
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
                  ✓ 解决方案：基于工具变量的双层博弈因果解耦网络
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>GAP 03: 新建场站与中小城市冷启动迁移瓶颈</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  高精度 ST-GNN 严重依赖长达数月的密集历史时序，对于新建区域或三四线试点城市存在严重的跨城市域偏移 (Domain Shift)。
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
                  ✓ 解决方案：图对比元学习 + 空间拓扑原型对齐
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Variable Flow */}
        {activeTab === 'variable_flow' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
              <div className="w-full lg:w-1/4 rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center">
                <div className="font-bold text-indigo-400 mb-1">多源输入张量</div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>• 历史 15min 功率时序</div>
                  <div>• ERA5 气温/降雨/湿度</div>
                  <div>• 实时 LMP 分时电价</div>
                  <div>• 道路通达性拓扑图</div>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-slate-500 hidden lg:block" />

              <div className="w-full lg:w-2/4 rounded-2xl bg-indigo-950/40 p-4 border border-indigo-500/30 text-center">
                <div className="font-bold text-indigo-300 mb-1">
                  Nova Weather-Causal ST-GNN 核心解耦中枢
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-300">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    自适应时空图扩散
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    物理机理损失正则
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    因果电价弹性门控
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    时序双向自注意力
                  </div>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-slate-500 hidden lg:block" />

              <div className="w-full lg:w-1/4 rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center">
                <div className="font-bold text-emerald-400 mb-1">可解释学术产出</div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>• 未来 1~12h 点预测功率</div>
                  <div>• 95% 置信区间概率包络</div>
                  <div>• 极端长尾尖峰预警</div>
                  <div>• 价格敏感度弹性系数</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
