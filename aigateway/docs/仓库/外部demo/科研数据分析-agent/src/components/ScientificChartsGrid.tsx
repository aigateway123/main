import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  ErrorBar, 
  ZAxis, 
  ReferenceLine
} from 'recharts';
import { 
  Download, 
  FilePlus, 
  Check, 
  Layers
} from 'lucide-react';
import { 
  GROUP_STATS, 
  DISTRIBUTION_CHART_DATA, 
  TREND_CHART_DATA, 
  ANOMALY_SCATTER_DATA 
} from '../data/mockData';

interface ScientificChartsGridProps {
  onInsertToPaper?: (figureId: string, title: string, caption: string) => void;
}

export const ScientificChartsGrid: React.FC<ScientificChartsGridProps> = ({
  onInsertToPaper,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);
  const [paletteTheme, setPaletteTheme] = useState<'nature' | 'science' | 'cell'>('nature');

  const handleDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      const element = document.createElement('a');
      const fileContent = `Publication Grade Scientific Figure\nTitle: ${name}\nFormat: High-Res 600 DPI Vector SVG\nTheme: ${paletteTheme.toUpperCase()} Journal Standard\nTimestamp: ${new Date().toISOString()}\nStatistical Power: 1-beta > 0.999\nData points: 186,420 rows`;
      const file = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${id}_600dpi_figure.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloadingId(null);
    }, 600);
  };

  const handleInsert = (id: string, title: string, caption: string) => {
    setInsertedId(id);
    if (onInsertToPaper) {
      onInsertToPaper(id, title, caption);
    }
    setTimeout(() => setInsertedId(null), 2200);
  };

  // 1. Group Comparison Bar Data
  const barData = GROUP_STATS.map((item) => ({
    name: `Group ${item.group}`,
    score: item.score,
    error: [item.stdDev, item.stdDev],
    color: item.color,
  }));

  return (
    <section className="space-y-4">
      {/* Header & Aesthetic Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e293b]">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">
            自动生成科研图表 (Publication Charts)
          </h3>
          <p className="text-xs text-[#94a3b8] mt-0.5 pl-3">
            提供符合 Nature / Science 规范的高分辨率科研图表，支持一键插图与矢量导出
          </p>
        </div>

        {/* Theme Palette Toggle */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-[#1e293b] self-start sm:self-auto">
          <span className="text-[10px] uppercase tracking-wider text-[#64748b] px-2 font-semibold">配色风格:</span>
          {(['nature', 'science', 'cell'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setPaletteTheme(style)}
              className={`px-2 py-0.5 text-xs rounded font-mono uppercase transition-all cursor-pointer ${
                paletteTheme === style
                  ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40'
                  : 'text-[#64748b] hover:text-white'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 Grid of Scientific Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CHART 1: 实验组对比图 */}
        <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <span className="text-xs font-bold text-white font-mono">
                  Figure 1A. 实验组对比图
                </span>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  组间性能均值与误差棒 (Mean ± SD)
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ANOVA *** p&lt;0.001
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-60 w-full mt-3 bg-black/40 rounded-lg p-2 border border-[#1e293b]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#0f172a] border border-[#1e293b] p-2.5 rounded-lg text-xs font-mono text-white shadow-xl">
                            <div className="font-bold text-blue-400">{d.name}</div>
                            <div>均值: {d.score} ± {d.error[0]}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    <Cell fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.6)" />
                    <Cell fill="rgba(59, 130, 246, 0.6)" stroke="rgba(59, 130, 246, 0.8)" />
                    <Cell fill="#3b82f6" stroke="#60a5fa" />
                    <ErrorBar dataKey="error" width={6} strokeWidth={2} stroke="#94a3b8" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-[#94a3b8] mt-2 italic leading-relaxed">
              <strong className="text-white">Fig. 1A | 实验组性能对比.</strong> 组别 A、B、C 展现梯度提升，实验组 C 获得峰值得分 91.2 ± 3.1（显著优于 A 组 78.4 ± 4.8，p &lt; 0.001）。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-end gap-2">
            <button
              onClick={() => handleDownload('fig1a_comparison', 'Figure 1A 实验组对比图')}
              className="px-3 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {downloadingId === 'fig1a_comparison' ? (
                <span className="text-blue-400">导出中...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>下载图片</span>
                </>
              )}
            </button>
            <button
              onClick={() =>
                handleInsert(
                  'fig1a_comparison',
                  'Figure 1A. 实验组对比图',
                  '组别 A、B、C 性能均值与标准差对比柱状图 (p < 0.001)'
                )
              }
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {insertedId === 'fig1a_comparison' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>已插入论文</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>插入论文</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CHART 2: 指标分布图 */}
        <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <span className="text-xs font-bold text-white font-mono">
                  Figure 1B. 指标分布图
                </span>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  组间核密度估计 (KDE) 与频率分布谱线
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Gaussian KDE
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-60 w-full mt-3 bg-black/40 rounded-lg p-2 border border-[#1e293b]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DISTRIBUTION_CHART_DATA} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="score" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0f172a] border border-[#1e293b] p-2.5 rounded-lg text-xs font-mono text-white shadow-xl space-y-1">
                            <div className="text-[#64748b]">性能分值: {payload[0].payload.score}</div>
                            <div className="text-blue-400">Group A: {payload[0].payload.Group_A}</div>
                            <div className="text-indigo-400">Group B: {payload[0].payload.Group_B}</div>
                            <div className="text-emerald-400">Group C: {payload[0].payload.Group_C}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="Group_A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="Group_B" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                  <Area type="monotone" dataKey="Group_C" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-[#94a3b8] mt-2 italic leading-relaxed">
              <strong className="text-white">Fig. 1B | 性能指标核密度分布.</strong> 实验组 C 的概率密度峰值向右偏移，分布峰态明显尖锐，验证系统一致性大幅增强。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-end gap-2">
            <button
              onClick={() => handleDownload('fig1b_distribution', 'Figure 1B 指标分布图')}
              className="px-3 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {downloadingId === 'fig1b_distribution' ? (
                <span className="text-blue-400">导出中...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>下载图片</span>
                </>
              )}
            </button>
            <button
              onClick={() =>
                handleInsert(
                  'fig1b_distribution',
                  'Figure 1B. 指标分布图',
                  '实验组 A、B、C 性能得分的高斯核密度分布曲线图'
                )
              }
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {insertedId === 'fig1b_distribution' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>已插入论文</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>插入论文</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CHART 3: 趋势图 */}
        <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <span className="text-xs font-bold text-white font-mono">
                  Figure 1C. 动力学时序趋势图
                </span>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  反应时间动力学曲线 (Time-Course Kinetics 0h ~ 12h)
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                k_rate = 1.64x
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-60 w-full mt-3 bg-black/40 rounded-lg p-2 border border-[#1e293b]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_CHART_DATA} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0f172a] border border-[#1e293b] p-2.5 rounded-lg text-xs font-mono text-white shadow-xl space-y-1">
                            <div className="font-bold text-white">时间点: {payload[0].payload.time}</div>
                            <div className="text-blue-400">Group A: {payload[0].payload.Group_A}</div>
                            <div className="text-indigo-400">Group B: {payload[0].payload.Group_B}</div>
                            <div className="text-emerald-400 font-bold">Group C: {payload[0].payload.Group_C}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="Group_A" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="Group_B" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="Group_C" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Baseline" stroke="#475569" strokeDasharray="4 4" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-[#94a3b8] mt-2 italic leading-relaxed">
              <strong className="text-white">Fig. 1C | 反应动力学历程.</strong> 实验组 C 在反应前 4 小时即展现出极陡峭的活化斜率，最终稳态转化率较对照组提高 16.3%。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-end gap-2">
            <button
              onClick={() => handleDownload('fig1c_trend', 'Figure 1C 趋势图')}
              className="px-3 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {downloadingId === 'fig1c_trend' ? (
                <span className="text-blue-400">导出中...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>下载图片</span>
                </>
              )}
            </button>
            <button
              onClick={() =>
                handleInsert(
                  'fig1c_trend',
                  'Figure 1C. 趋势图',
                  '各实验组在 12 小时测试周期内的动力学演化历程曲线图'
                )
              }
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {insertedId === 'fig1c_trend' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>已插入论文</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>插入论文</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CHART 4: 异常值图 */}
        <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <span className="text-xs font-bold text-white font-mono">
                  Figure 1D. 异常值残差散点图
                </span>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  3-Sigma 边界与 Isolation Forest 离群点定位
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                3 重点异常标记
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-60 w-full mt-3 bg-black/40 rounded-lg p-2 border border-[#1e293b]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 15, right: 15, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    type="number"
                    dataKey="pressure"
                    name="Pressure (MPa)"
                    domain={[0, 9]}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    dataKey="yield"
                    name="Yield (%)"
                    domain={[20, 100]}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <ZAxis range={[50, 180]} />
                  <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="3 3" />
                  <ReferenceLine y={65} stroke="#ef4444" strokeDasharray="3 3" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#0f172a] border border-[#1e293b] p-2.5 rounded-lg text-xs font-mono text-white shadow-xl space-y-1">
                            <div className="font-bold text-red-400">{d.sample}</div>
                            <div>状态: <span className={d.status === 'Anomaly' ? 'text-red-400 font-bold' : 'text-emerald-400'}>{d.status}</span></div>
                            <div>压力: {d.pressure} MPa | 产率: {d.yield}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Samples" data={ANOMALY_SCATTER_DATA}>
                    {ANOMALY_SCATTER_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.status === 'Anomaly' ? '#ef4444' : '#3b82f6'}
                        stroke={entry.status === 'Anomaly' ? '#fca5a5' : '#60a5fa'}
                        strokeWidth={entry.status === 'Anomaly' ? 2 : 1}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-[#94a3b8] mt-2 italic leading-relaxed">
              <strong className="text-white">Fig. 1D | 孤立森林残差散点.</strong> 红色高亮样本偏离 3σ 置信椭圆域（如 #12842），判定为传感器硬件漂移。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-end gap-2">
            <button
              onClick={() => handleDownload('fig1d_anomaly', 'Figure 1D 异常值散点图')}
              className="px-3 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {downloadingId === 'fig1d_anomaly' ? (
                <span className="text-blue-400">导出中...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>下载图片</span>
                </>
              )}
            </button>
            <button
              onClick={() =>
                handleInsert(
                  'fig1d_anomaly',
                  'Figure 1D. 异常值残差散点图',
                  '全量样本的 3-Sigma 离群残差扫描与 Isolation Forest 散点图'
                )
              }
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {insertedId === 'fig1d_anomaly' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>已插入论文</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>插入论文</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
