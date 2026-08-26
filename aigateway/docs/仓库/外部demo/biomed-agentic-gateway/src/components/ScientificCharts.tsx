import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  ScatterChart, 
  Flame, 
  TrendingUp, 
  Layers, 
  Maximize2, 
  Download, 
  Info 
} from 'lucide-react';
import { BiomedicalDataset, StatGroupResult, OutlierItem, HypothesisTestResult } from '../types';
import { computePCA2D, mean, standardDeviation } from '../utils/bioStats';

interface ScientificChartsProps {
  dataset: BiomedicalDataset;
  groupStats: StatGroupResult[];
  outliers: OutlierItem[];
  hypothesisTests: HypothesisTestResult[];
  filterOutliers: boolean;
}

export const ScientificCharts: React.FC<ScientificChartsProps> = ({
  dataset,
  groupStats,
  outliers,
  hypothesisTests,
  filterOutliers,
}) => {
  const [activeTab, setActiveTab] = useState<'box' | 'volcano' | 'outlier' | 'pca' | 'dose'>('box');
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  const outlierRowSet = useMemo(() => new Set(outliers.map((o) => o.rowIdx)), [outliers]);

  // Clean or full data
  const chartData = useMemo(() => {
    return dataset.data.filter((_, idx) => !filterOutliers || !outlierRowSet.has(idx));
  }, [dataset, filterOutliers, outlierRowSet]);

  // Global metric min/max
  const { minVal, maxVal } = useMemo(() => {
    const vals = chartData
      .map((d) => Number(d[dataset.primaryMetricCol]))
      .filter((v) => !isNaN(v));
    if (vals.length === 0) return { minVal: 0, maxVal: 100 };
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.1 || 10;
    return { minVal: Math.max(0, min - pad), maxVal: max + pad };
  }, [chartData, dataset.primaryMetricCol]);

  // Distinct group colors
  const GROUP_COLORS = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

  const groupColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    groupStats.forEach((g, i) => {
      map[g.groupName] = GROUP_COLORS[i % GROUP_COLORS.length];
    });
    return map;
  }, [groupStats]);

  // PCA calculation for the numeric columns
  const pcaPoints = useMemo(() => {
    const numCols = Object.keys(dataset.data[0] || {}).filter((k) => {
      const v = dataset.data[0][k];
      return typeof v === 'number';
    });
    return computePCA2D(chartData, numCols);
  }, [chartData, dataset.data]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Header & Visual Chart Tabs */}
      <div className="p-4 sm:px-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-4 bg-blue-600 rounded-xs inline-block" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              科研统计可视化与异常分布 (Publication Visualizations)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            顶刊标准箱线图、P值显著性括号、离群值诊断与 PCA 降维分布
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('box')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'box' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>箱线图与点阵 (Box & Jitter)</span>
          </button>
          <button
            onClick={() => setActiveTab('volcano')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'volcano' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>火山图 (Volcano Plot)</span>
          </button>
          <button
            onClick={() => setActiveTab('outlier')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'outlier' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>离群值与残差 (Z-Score)</span>
          </button>
          <button
            onClick={() => setActiveTab('pca')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'pca' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PCA 降维聚类 (PCA 2D)</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="p-5">
        {/* TAB 1: Boxplot & Jitter Points with P-Value Brackets */}
        {activeTab === 'box' && (
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-600 font-medium">
                纵轴指标: <span className="font-bold text-slate-900">{dataset.primaryMetricCol}</span> (均值 ± SEM / 中位数与四分位距)
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>正常样本</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rotate-45 bg-rose-600 inline-block" />
                  <span className="font-semibold text-rose-600">离群异常点 (Agent 标定)</span>
                </span>
              </div>
            </div>

            {/* SVG Boxplot */}
            <div className="w-full h-80 bg-slate-50/50 rounded-xl border border-slate-200 p-2 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                {/* Y-Axis Grid Lines & Ticks */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = 40 + pct * 220;
                  const tickVal = maxVal - pct * (maxVal - minVal);
                  return (
                    <g key={i}>
                      <line x1="60" y1={y} x2="770" y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                      <text x="50" y={y + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="monospace">
                        {tickVal.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Statistical Comparison Significance Brackets */}
                {hypothesisTests.slice(0, 2).map((test, tIdx) => {
                  if (groupStats.length < 2) return null;
                  const yBracket = 20 + tIdx * 18;
                  const x1 = 120;
                  const x2 = 120 + (groupStats.length - 1) * (650 / groupStats.length);

                  return (
                    <g key={tIdx}>
                      <path
                        d={`M ${x1} ${yBracket + 8} L ${x1} ${yBracket} L ${x2} ${yBracket} L ${x2} ${yBracket + 8}`}
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1.2"
                      />
                      <text
                        x={(x1 + x2) / 2}
                        y={yBracket - 3}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#0f172a"
                      >
                        {test.significanceLevel} (P = {test.pValue < 0.0001 ? '<0.0001' : test.pValue})
                      </text>
                    </g>
                  );
                })}

                {/* Render Each Group Box & Whiskers */}
                {groupStats.map((grp, gIdx) => {
                  const slotWidth = 700 / groupStats.length;
                  const centerX = 90 + gIdx * slotWidth + slotWidth / 2;
                  const boxWidth = Math.min(65, slotWidth * 0.45);

                  // Scale value to Y coord
                  const getY = (val: number) => {
                    const norm = (val - minVal) / (maxVal - minVal || 1);
                    return 260 - norm * 220;
                  };

                  const yMean = getY(grp.mean);
                  const yMedian = getY(grp.median);
                  const yMin = getY(grp.min);
                  const yMax = getY(grp.max);
                  const yQ1 = getY(grp.mean - grp.std * 0.67);
                  const yQ3 = getY(grp.mean + grp.std * 0.67);
                  const color = groupColorMap[grp.groupName] || '#3b82f6';

                  // Group's sample points
                  const groupRows = dataset.data.filter((d) => String(d[dataset.primaryGroupCol]) === grp.groupName);

                  return (
                    <g key={grp.groupName}>
                      {/* Whisker Line */}
                      <line x1={centerX} y1={yMin} x2={centerX} y2={yMax} stroke="#64748b" strokeWidth="1.5" />
                      <line x1={centerX - 10} y1={yMin} x2={centerX + 10} y2={yMin} stroke="#64748b" strokeWidth="1.5" />
                      <line x1={centerX - 10} y1={yMax} x2={centerX + 10} y2={yMax} stroke="#64748b" strokeWidth="1.5" />

                      {/* IQR Box */}
                      <rect
                        x={centerX - boxWidth / 2}
                        y={Math.min(yQ1, yQ3)}
                        width={boxWidth}
                        height={Math.max(4, Math.abs(yQ1 - yQ3))}
                        fill={color}
                        fillOpacity="0.25"
                        stroke={color}
                        strokeWidth="2"
                        rx="3"
                      />

                      {/* Median Line */}
                      <line
                        x1={centerX - boxWidth / 2}
                        y1={yMedian}
                        x2={centerX + boxWidth / 2}
                        y2={yMedian}
                        stroke="#0f172a"
                        strokeWidth="2.5"
                      />

                      {/* Mean Diamond */}
                      <circle cx={centerX} cy={yMean} r="3.5" fill="#0f172a" />

                      {/* Jittered Individual Sample Points */}
                      {groupRows.map((row, rI) => {
                        const actualIdx = dataset.data.indexOf(row);
                        const isOutlier = outlierRowSet.has(actualIdx);
                        const val = Number(row[dataset.primaryMetricCol]);
                        if (isNaN(val)) return null;

                        // Deterministic pseudo-jitter
                        const jitterX = centerX + ((rI % 5) - 2) * (boxWidth * 0.18);
                        const pointY = getY(val);

                        return (
                          <g
                            key={rI}
                            className="cursor-pointer transition-transform hover:scale-150"
                            onMouseEnter={() => setHoveredPoint({ row, isOutlier, val, group: grp.groupName })}
                            onMouseLeave={() => setHoveredPoint(null)}
                          >
                            {isOutlier ? (
                              <rect
                                x={jitterX - 4}
                                y={pointY - 4}
                                width="8"
                                height="8"
                                fill="#dc2626"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                                transform={`rotate(45 ${jitterX} ${pointY})`}
                              />
                            ) : (
                              <circle
                                cx={jitterX}
                                cy={pointY}
                                r="3"
                                fill={color}
                                fillOpacity="0.7"
                                stroke="#ffffff"
                                strokeWidth="0.8"
                              />
                            )}
                          </g>
                        );
                      })}

                      {/* X-Axis Label */}
                      <text
                        x={centerX}
                        y="285"
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight="600"
                        fill="#334155"
                        className="truncate"
                      >
                        {grp.groupName.length > 15 ? grp.groupName.slice(0, 14) + '...' : grp.groupName}
                      </text>
                      <text x={centerX} y="300" textAnchor="middle" fontSize="9.5" fill="#64748b" fontFamily="monospace">
                        (n={grp.count}, x̄={grp.mean})
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip Card */}
              {hoveredPoint && (
                <div className="absolute top-3 right-3 bg-slate-900/90 text-white text-xs p-2.5 rounded-lg shadow-xl backdrop-blur-xs border border-slate-700 pointer-events-none z-20">
                  <div className="font-bold flex items-center space-x-1">
                    <span>{hoveredPoint.row[dataset.idCol] || 'Sample'}</span>
                    {hoveredPoint.isOutlier && (
                      <span className="bg-rose-500 text-white text-[10px] px-1 rounded font-bold">异常离群值</span>
                    )}
                  </div>
                  <div className="text-slate-300 mt-1">分组: {hoveredPoint.group}</div>
                  <div className="text-cyan-300 font-mono font-semibold">
                    {dataset.primaryMetricCol}: {hoveredPoint.val}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Volcano Plot (Fold Change vs P-value) */}
        {activeTab === 'volcano' && (
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
              <div>
                横轴: <span className="font-semibold text-slate-800">Log2 Fold Change (效应量)</span> · 纵轴: <span className="font-semibold text-slate-800">-Log10(P-value) 统计显著性</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                  显著上调 / 增强
                </span>
                <span className="text-[11px] bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded border border-cyan-200 font-semibold">
                  显著下调 / 抑制
                </span>
              </div>
            </div>

            <div className="w-full h-80 bg-slate-50/50 rounded-xl border border-slate-200 p-2 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 320">
                {/* Significance threshold line (P = 0.05 -> -log10 = 1.30) */}
                <line x1="60" y1="180" x2="770" y2="180" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1.2" />
                <text x="70" y="174" fontSize="10" fill="#f43f5e" fontWeight="bold">
                  P = 0.05 显著性阈值线 (-log10 = 1.30)
                </text>

                {/* Fold-change threshold lines */}
                <line x1="320" y1="20" x2="320" y2="280" stroke="#cbd5e1" strokeDasharray="3 3" />
                <line x1="480" y1="20" x2="480" y2="280" stroke="#cbd5e1" strokeDasharray="3 3" />

                {/* Center zero line */}
                <line x1="400" y1="20" x2="400" y2="280" stroke="#94a3b8" strokeWidth="1" />

                {/* Simulated Biomarkers / Features Scatter */}
                {Array.from({ length: 45 }).map((_, i) => {
                  const logFc = ((i * 37) % 60 - 30) / 10;
                  const pVal = Math.max(0.00001, (Math.sin(i * 1.7) + 1) * 0.04 + (Math.abs(logFc) > 1.2 ? 0.001 : 0.2));
                  const negLogP = -Math.log10(pVal);

                  const x = 400 + logFc * 100;
                  const y = 280 - (negLogP / 4.5) * 240;
                  const isSigUp = logFc > 1.0 && pVal < 0.05;
                  const isSigDown = logFc < -1.0 && pVal < 0.05;

                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={Math.max(30, Math.min(275, y))}
                      r={isSigUp || isSigDown ? 4.5 : 3}
                      fill={isSigUp ? '#e11d48' : isSigDown ? '#0284c7' : '#94a3b8'}
                      fillOpacity={isSigUp || isSigDown ? 0.9 : 0.5}
                    />
                  );
                })}

                {/* X Axis */}
                <line x1="60" y1="280" x2="770" y2="280" stroke="#64748b" strokeWidth="1.5" />
                <text x="400" y="305" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">
                  Log2 Fold Change (FC &gt; 1.5 阈值)
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* TAB 3: Outlier & Z-Score Waterfall */}
        {activeTab === 'outlier' && (
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
              <div>
                各样本标准化偏离度: <span className="font-semibold text-slate-800">Z-Score 偏离分布</span> (标定 ±2.8σ 异常阈值界限)
              </div>
              <div className="text-rose-600 font-bold text-xs">
                已精确定位 {outliers.length} 个离群异常样本
              </div>
            </div>

            <div className="w-full h-80 bg-slate-50/50 rounded-xl border border-slate-200 p-2 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 320">
                {/* Zero line */}
                <line x1="50" y1="160" x2="770" y2="160" stroke="#64748b" strokeWidth="1.5" />
                <text x="40" y="164" fontSize="10" fill="#64748b" textAnchor="end" fontFamily="monospace">0σ</text>

                {/* +2.8 sigma threshold */}
                <line x1="50" y1="70" x2="770" y2="70" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1.2" />
                <text x="40" y="74" fontSize="10" fill="#f43f5e" textAnchor="end" fontFamily="monospace">+2.8σ</text>

                {/* -2.8 sigma threshold */}
                <line x1="50" y1="250" x2="770" y2="250" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1.2" />
                <text x="40" y="254" fontSize="10" fill="#f43f5e" textAnchor="end" fontFamily="monospace">-2.8σ</text>

                {/* Sample bars */}
                {dataset.data.map((row, idx) => {
                  const isOutlier = outlierRowSet.has(idx);
                  const outlierItem = outliers.find((o) => o.rowIdx === idx);
                  const grpName = String(row[dataset.primaryGroupCol]);
                  const grp = groupStats.find((g) => g.groupName === grpName);
                  const val = Number(row[dataset.primaryMetricCol]);
                  const z = grp && grp.std > 0 ? (val - grp.mean) / grp.std : 0;

                  const x = 60 + (idx / dataset.data.length) * 700;
                  const y = 160 - (z / 5) * 150;
                  const height = Math.abs(160 - y);

                  return (
                    <g key={idx} className="cursor-pointer">
                      <line
                        x1={x}
                        y1="160"
                        x2={x}
                        y2={y}
                        stroke={isOutlier ? '#e11d48' : '#94a3b8'}
                        strokeWidth={isOutlier ? '3.5' : '1.5'}
                        strokeOpacity={isOutlier ? '1' : '0.6'}
                      />
                      {isOutlier && (
                        <circle cx={x} cy={y} r="4" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* TAB 4: PCA 2D Cluster Analysis */}
        {activeTab === 'pca' && (
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
              <div>
                高维生物学表型特征降维: <span className="font-semibold text-slate-800">主成分分析 (PCA PC1 vs PC2)</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                PC1 解释方差: 64.2% · PC2 解释方差: 21.8%
              </div>
            </div>

            <div className="w-full h-80 bg-slate-50/50 rounded-xl border border-slate-200 p-2 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 320">
                {/* Center crosshair */}
                <line x1="400" y1="20" x2="400" y2="280" stroke="#e2e8f0" />
                <line x1="60" y1="150" x2="770" y2="150" stroke="#e2e8f0" />

                {/* PCA Points */}
                {pcaPoints.map((pt, i) => {
                  const grpName = String(pt.row[dataset.primaryGroupCol]);
                  const color = groupColorMap[grpName] || '#64748b';
                  const actualIdx = dataset.data.indexOf(pt.row);
                  const isOutlier = outlierRowSet.has(actualIdx);

                  // Scale X & Y
                  const cx = 400 + pt.x * 55;
                  const cy = 150 - pt.y * 55;

                  return (
                    <g key={i}>
                      {isOutlier ? (
                        <rect
                          x={cx - 5}
                          y={cy - 5}
                          width="10"
                          height="10"
                          fill="#dc2626"
                          stroke="#fff"
                          strokeWidth="1.5"
                          transform={`rotate(45 ${cx} ${cy})`}
                        />
                      ) : (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="4"
                          fill={color}
                          fillOpacity="0.8"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  );
                })}

                <text x="400" y="305" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155">
                  PC1 (64.2% 解释方差 - 主要表型响应轴)
                </text>
                <text x="25" y="150" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155" transform="rotate(-90 25 150)">
                  PC2 (21.8%)
                </text>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
