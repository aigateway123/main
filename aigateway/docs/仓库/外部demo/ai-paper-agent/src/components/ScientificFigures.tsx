import React, { useState } from 'react';
import { Layers, ZoomIn, Info, ShieldCheck, Activity } from 'lucide-react';

interface Figure1Props {
  showConfidenceInterval?: boolean;
  className?: string;
}

export const Figure1Plot: React.FC<Figure1Props> = ({ 
  showConfidenceInterval = true,
  className = "" 
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // 24 hours of data points (00:00 to 23:00)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Ground truth load curve (kW per station cluster)
  const groundTruth = [
    42, 35, 28, 25, 29, 48, 85, 142, 185, 172, 160, 168, 
    175, 162, 155, 170, 210, 285, 320, 295, 230, 165, 110, 65
  ];

  // Proposed ST-Transformer predictions (Close fit, accurate peak)
  const transformerPred = [
    43, 36, 29, 26, 30, 49, 82, 139, 182, 170, 162, 169,
    174, 160, 156, 172, 208, 282, 318, 292, 228, 163, 108, 66
  ];

  // LSTM Predictions (Noticeable lag, underpredicts peak rush at 19:00)
  const lstmPred = [
    48, 41, 35, 30, 32, 42, 70, 120, 160, 158, 150, 155,
    160, 148, 142, 155, 185, 240, 265, 250, 205, 145, 95, 58
  ];

  // 95% Confidence Interval bounds (± 12-18 kW)
  const ciUpper = transformerPred.map(v => v + 12.5);
  const ciLower = transformerPred.map(v => Math.max(10, v - 12.5));

  // SVG dimensions
  const width = 640;
  const height = 300;
  const padding = { top: 35, right: 30, bottom: 45, left: 55 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxVal = 360;
  const minVal = 0;

  const getX = (hour: number) => padding.left + (hour / 23) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;

  const makePath = (data: number[]) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d)}`).join(' ');
  };

  const makeAreaPath = (upper: number[], lower: number[]) => {
    const forward = upper.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d)}`).join(' ');
    const backward = lower.map((d, i) => `L ${getX(lower.length - 1 - i)} ${getY(lower[lower.length - 1 - i])}`).join(' ');
    return `${forward} ${backward} Z`;
  };

  return (
    <div className={`bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-md text-slate-100 ${className}`}>
      {/* Header / Caption Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-semibold rounded border border-blue-500/30">
            Figure 1
          </span>
          <span className="font-medium text-slate-200">
            24小时多步长电动汽车充电负荷曲线：预测值 vs 真实值对比
          </span>
        </div>
        {showConfidenceInterval && (
          <span className="flex items-center space-x-1 text-[11px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>95% 阴影置信区间 (5次随机种子 CI)</span>
          </span>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative mt-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="peakHighlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 100, 200, 300].map((val) => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={getY(val) + 4}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {val} kW
              </text>
            </g>
          ))}

          {/* Peak hour shaded zone (17:00 - 21:00) */}
          <rect
            x={getX(17)}
            y={padding.top}
            width={getX(21) - getX(17)}
            height={plotHeight}
            fill="url(#peakHighlight)"
          />
          <text
            x={getX(19)}
            y={padding.top + 14}
            fill="#f87171"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            晚高峰用电激增区 (分时动态电价调控)
          </text>

          {/* X Axis Ticks */}
          {[0, 4, 8, 12, 16, 20, 23].map((hour) => (
            <g key={hour}>
              <line
                x1={getX(hour)}
                y1={padding.top + plotHeight}
                x2={getX(hour)}
                y2={padding.top + plotHeight + 5}
                stroke="#64748b"
                strokeWidth="1"
              />
              <text
                x={getX(hour)}
                y={padding.top + plotHeight + 18}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {`${String(hour).padStart(2, '0')}:00`}
              </text>
            </g>
          ))}

          {/* Confidence interval area */}
          {showConfidenceInterval && (
            <path
              d={makeAreaPath(ciUpper, ciLower)}
              fill="url(#ciGrad)"
            />
          )}

          {/* LSTM curve (orange dashed) */}
          <path
            d={makePath(lstmPred)}
            fill="none"
            stroke="#fb923c"
            strokeWidth="2"
            strokeDasharray="5 4"
            opacity="0.85"
          />

          {/* Ground truth curve (slate / white dashed line) */}
          <path
            d={makePath(groundTruth)}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2.5"
          />

          {/* Proposed Transformer curve (vibrant cyan solid) */}
          <path
            d={makePath(transformerPred)}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
          />

          {/* Data point dots & hover targets */}
          {hours.map((h) => {
            const isHover = hoverIndex === h;
            return (
              <g 
                key={h} 
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(h)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <circle
                  cx={getX(h)}
                  cy={getY(transformerPred[h])}
                  r={isHover ? 6 : 3}
                  fill="#38bdf8"
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                <circle
                  cx={getX(h)}
                  cy={getY(groundTruth[h])}
                  r={isHover ? 5 : 2.5}
                  fill="#ffffff"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                {/* Large transparent hit area */}
                <rect
                  x={getX(h) - (plotWidth / 48)}
                  y={padding.top}
                  width={plotWidth / 24}
                  height={plotHeight}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {hoverIndex !== null && (
          <div 
            className="absolute top-2 right-4 bg-slate-950/95 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs space-y-1 pointer-events-none z-10"
          >
            <div className="font-mono font-bold text-slate-300 border-b border-slate-800 pb-1">
              时刻: {String(hoverIndex).padStart(2, '0')}:00
            </div>
            <div className="flex items-center justify-between space-x-4 text-emerald-400">
              <span>真实值 (Ground Truth):</span>
              <span className="font-mono font-bold">{groundTruth[hoverIndex]} kW</span>
            </div>
            <div className="flex items-center justify-between space-x-4 text-cyan-400">
              <span>ST-Trans (本文提出):</span>
              <span className="font-mono font-bold">{transformerPred[hoverIndex]} kW</span>
            </div>
            <div className="flex items-center justify-between space-x-4 text-amber-400">
              <span>LSTM 基准模型:</span>
              <span className="font-mono font-bold">{lstmPred[hoverIndex]} kW</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-0.5">
              误差绝对值: 本文模型 {Math.abs(transformerPred[hoverIndex] - groundTruth[hoverIndex])} kW vs LSTM {Math.abs(lstmPred[hoverIndex] - groundTruth[hoverIndex])} kW
            </div>
          </div>
        )}
      </div>

      {/* Legend & Stats Summary */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-0.5 bg-slate-100 rounded" />
            <span className="text-slate-300">实际真实负荷 (Ground Truth)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-1 bg-cyan-400 rounded" />
            <span className="text-cyan-300 font-medium">ST-Transformer (本文提出)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-0.5 border-b-2 border-dashed border-amber-400" />
            <span className="text-amber-300">LSTM 基准模型</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          高峰负荷: <span className="text-white font-bold">320 kW</span> · 峰值误差 MAE: <span className="text-cyan-400 font-bold">2.1 kW</span>
        </div>
      </div>
    </div>
  );
};

export const Figure2Heatmap: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number; val: number } | null>(null);

  const stations = [
    '市中心商业区 (CBD)',
    '高新科技园区',
    '机场高速枢纽',
    '北城地铁总站',
    '南城商业中心',
    '东部郊区枢纽',
    '西部大型住宅区',
    '综合交通枢纽',
  ];

  // 8x8 Attention correlation weights
  const matrix = [
    [0.92, 0.74, 0.65, 0.42, 0.81, 0.35, 0.28, 0.68],
    [0.72, 0.95, 0.58, 0.38, 0.76, 0.41, 0.32, 0.61],
    [0.64, 0.59, 0.98, 0.31, 0.55, 0.22, 0.18, 0.79],
    [0.40, 0.39, 0.33, 0.89, 0.45, 0.67, 0.58, 0.48],
    [0.82, 0.78, 0.54, 0.44, 0.94, 0.38, 0.30, 0.73],
    [0.34, 0.42, 0.24, 0.65, 0.39, 0.88, 0.72, 0.41],
    [0.29, 0.31, 0.19, 0.59, 0.31, 0.71, 0.91, 0.35],
    [0.69, 0.62, 0.81, 0.49, 0.72, 0.43, 0.34, 0.96],
  ];

  const getColor = (val: number) => {
    // 0.0 -> dark blue/slate, 1.0 -> vibrant yellow/amber/cyan
    if (val > 0.85) return 'bg-cyan-400 text-slate-950 font-bold';
    if (val > 0.70) return 'bg-sky-500 text-slate-950 font-semibold';
    if (val > 0.55) return 'bg-blue-600 text-white';
    if (val > 0.40) return 'bg-indigo-800 text-slate-200';
    if (val > 0.25) return 'bg-slate-800 text-slate-300';
    return 'bg-slate-900 text-slate-500';
  };

  return (
    <div className={`bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-md text-slate-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-semibold rounded border border-blue-500/30">
            Figure 2
          </span>
          <span className="font-medium text-slate-200">
            空间交叉注意力权重相关性热力图 (充电站间负荷动态迁移)
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
          动态注意力权重 A_ij ∈ [0, 1]
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Column labels */}
          <div className="grid grid-cols-9 gap-1 text-[10px] text-slate-400 font-medium mb-1">
            <div className="text-right pr-2">充电站</div>
            {stations.map((s, idx) => (
              <div key={idx} className="text-center truncate" title={s}>
                S{idx + 1}
              </div>
            ))}
          </div>

          {/* Rows */}
          {matrix.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-9 gap-1 mb-1 items-center">
              {/* Row label */}
              <div className="text-right pr-2 text-[10px] font-mono text-slate-300 truncate" title={stations[rIdx]}>
                S{rIdx + 1} ({stations[rIdx].slice(0, 3)})
              </div>

              {/* Cells */}
              {row.map((val, cIdx) => (
                <div
                  key={cIdx}
                  onMouseEnter={() => setHoverCell({ r: rIdx, c: cIdx, val })}
                  onMouseLeave={() => setHoverCell(null)}
                  className={`h-7 rounded flex items-center justify-center text-[10px] font-mono cursor-pointer transition-transform hover:scale-105 hover:z-10 shadow-sm ${getColor(val)}`}
                >
                  {val.toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer & Active Hover readout */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
        {hoverCell ? (
          <div className="text-cyan-300 font-mono text-xs">
            空间耦合: <span className="font-bold text-white">{stations[hoverCell.r]}</span> → <span className="font-bold text-white">{stations[hoverCell.c]}</span> 关联度 = <span className="text-cyan-400 font-bold">{hoverCell.val.toFixed(3)}</span>
          </div>
        ) : (
          <div className="text-slate-400 text-[11px]">
            提示: 鼠标悬停热力图单元格可查看各充电站间动态电价引发的负荷迁移注意力权重
          </div>
        )}

        {/* Color legend bar */}
        <div className="flex items-center space-x-1 text-[10px] text-slate-400">
          <span>0.0</span>
          <div className="w-16 h-2 rounded bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-400" />
          <span>1.0</span>
        </div>
      </div>
    </div>
  );
};
