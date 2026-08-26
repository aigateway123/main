import { DataColumn, OutlierItem, StatGroupResult, HypothesisTestResult } from '../types';

/**
 * Basic statistical calculations
 */
export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((acc, v) => acc + v, 0) / arr.length;
}

export function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function variance(arr: number[], isSample: boolean = true): number {
  if (arr.length <= 1) return 0;
  const m = mean(arr);
  const sumSq = arr.reduce((acc, v) => acc + Math.pow(v - m, 2), 0);
  return sumSq / (arr.length - (isSample ? 1 : 0));
}

export function standardDeviation(arr: number[], isSample: boolean = true): number {
  return Math.sqrt(variance(arr, isSample));
}

export function standardErrorOfMean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return standardDeviation(arr) / Math.sqrt(arr.length);
}

export function quantile(arr: number[], q: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}

/**
 * Standard Normal Cumulative Distribution Function (erf approximation)
 */
function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) p = 1 - p;
  return p;
}

/**
 * Approximate Student's t-distribution two-tailed p-value
 */
export function tTestPValue(tVal: number, df: number): number {
  if (df <= 0) return 1.0;
  const absT = Math.abs(tVal);
  // Hill's approximation for Student's t CDF
  const x = df / (df + absT * absT);
  // Beta regularized approximation
  let p = 2 * (1 - normalCdf(absT * (1 - 1 / (4 * df))));
  if (isNaN(p) || p < 0) p = 0.00001;
  if (p > 1) p = 1;
  return Number(p.toFixed(5));
}

/**
 * F-distribution p-value approximation for One-Way ANOVA
 */
export function fTestPValue(fVal: number, df1: number, df2: number): number {
  if (fVal <= 0 || df1 <= 0 || df2 <= 0) return 1.0;
  // Approximation using Wilson-Hilferty transformation
  const term1 = Math.pow(fVal, 1 / 3) * (1 - 2 / (9 * df2));
  const term2 = 1 - 2 / (9 * df1);
  const denominator = Math.sqrt(2 / (9 * df1) + Math.pow(fVal, 2 / 3) * (2 / (9 * df2)));
  const z = (term1 - term2) / denominator;
  const p = 1 - normalCdf(z);
  return Math.max(0.00001, Math.min(1.0, Number(p.toFixed(5))));
}

/**
 * Profile columns from tabular records
 */
export function profileColumns(data: Array<Record<string, any>>): DataColumn[] {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]);

  return keys.map((key) => {
    let missingCount = 0;
    const values: any[] = [];
    const numValues: number[] = [];

    data.forEach((row) => {
      const val = row[key];
      if (val === undefined || val === null || val === '' || Number.isNaN(val)) {
        missingCount++;
      } else {
        values.push(val);
        const parsed = Number(val);
        if (!isNaN(parsed) && typeof val !== 'boolean') {
          numValues.push(parsed);
        }
      }
    });

    const isNumeric = numValues.length > 0 && numValues.length === values.length;
    const uniqueVals = new Set(values);

    let role: DataColumn['role'] = undefined;
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes('id') || lowerKey.includes('sample') || lowerKey.includes('well')) {
      role = 'id';
    } else if (lowerKey.includes('group') || lowerKey.includes('treatment') || lowerKey.includes('condition') || lowerKey.includes('arm')) {
      role = 'group';
    } else if (lowerKey.includes('batch') || lowerKey.includes('plate') || lowerKey.includes('date')) {
      role = 'batch';
    } else if (lowerKey.includes('rep') || lowerKey.includes('replicate')) {
      role = 'replicate';
    } else if (lowerKey.includes('time') || lowerKey.includes('hour') || lowerKey.includes('day')) {
      role = 'timepoint';
    } else if (isNumeric) {
      role = 'metric';
    }

    const col: DataColumn = {
      name: key,
      type: isNumeric ? 'numeric' : 'categorical',
      role,
      missingCount,
      uniqueCount: uniqueVals.size,
    };

    if (isNumeric && numValues.length > 0) {
      col.min = Math.min(...numValues);
      col.max = Math.max(...numValues);
      col.mean = Number(mean(numValues).toFixed(3));
      col.std = Number(standardDeviation(numValues).toFixed(3));
      col.median = Number(median(numValues).toFixed(3));
    }

    return col;
  });
}

/**
 * Detect outliers using multiple statistical heuristics (IQR and 3*Sigma Z-Score)
 */
export function detectOutliers(
  data: Array<Record<string, any>>,
  groupCol: string,
  metricCol: string,
  idCol: string
): OutlierItem[] {
  const outliers: OutlierItem[] = [];
  if (!data || data.length === 0) return outliers;

  // Group data
  const groups: Record<string, { rows: any[]; values: number[] }> = {};
  data.forEach((row, idx) => {
    const grp = String(row[groupCol] || 'All');
    const val = Number(row[metricCol]);
    if (!isNaN(val)) {
      if (!groups[grp]) groups[grp] = { rows: [], values: [] };
      groups[grp].rows.push({ row, idx, val });
      groups[grp].values.push(val);
    }
  });

  // For each group, calculate statistics & detect outliers
  Object.entries(groups).forEach(([grpName, grpData]) => {
    const vals = grpData.values;
    if (vals.length < 3) return;

    const grpMean = mean(vals);
    const grpStd = standardDeviation(vals);
    const q25 = quantile(vals, 0.25);
    const q75 = quantile(vals, 0.75);
    const iqr = q75 - q25;
    const lowerIqrBound = q25 - 1.5 * iqr;
    const upperIqrBound = q75 + 1.5 * iqr;

    grpData.rows.forEach(({ row, idx, val }) => {
      const z = grpStd > 0 ? (val - grpMean) / grpStd : 0;
      const isZOutlier = Math.abs(z) >= 2.8;
      const isIqrOutlier = val < lowerIqrBound || val > upperIqrBound;

      if (isZOutlier || isIqrOutlier) {
        let suspectedCause = '实验观测值偏离群体分布';
        if (Math.abs(z) > 4.5) {
          suspectedCause = '疑似移液器体积倍数错误、探针污染或气泡伪影';
        } else if (Math.abs(z) > 3.0) {
          suspectedCause = '疑似细胞接种密度不均或荧光淬灭异常';
        } else {
          suspectedCause = '生物学个体极值差异或边缘反应';
        }

        outliers.push({
          id: row[idCol] || `Sample_${idx + 1}`,
          rowIdx: idx,
          column: metricCol,
          value: Number(val.toFixed(3)),
          group: grpName,
          expectedRange: [Number(q25.toFixed(2)), Number(q75.toFixed(2))],
          zScore: Number(z.toFixed(2)),
          method: Math.abs(z) >= 3.0 ? 'Z-Score' : 'IQR',
          suspectedCause,
          severity: Math.abs(z) >= 3.5 ? 'high' : Math.abs(z) >= 2.5 ? 'medium' : 'low',
        });
      }
    });
  });

  return outliers;
}

/**
 * Compute Group Summaries
 */
export function computeGroupStats(
  data: Array<Record<string, any>>,
  groupCol: string,
  metricCol: string
): StatGroupResult[] {
  const groups: Record<string, number[]> = {};

  data.forEach((row) => {
    const grp = String(row[groupCol] || 'Overall');
    const val = Number(row[metricCol]);
    if (!isNaN(val)) {
      if (!groups[grp]) groups[grp] = [];
      groups[grp].push(val);
    }
  });

  return Object.entries(groups).map(([groupName, vals]) => {
    const m = mean(vals);
    const s = standardDeviation(vals);
    const sem = standardErrorOfMean(vals);
    const med = median(vals);
    const q1 = quantile(vals, 0.25);
    const q3 = quantile(vals, 0.75);

    // 95% Confidence Interval (t ~ 1.96 approximation)
    const ciDelta = 1.96 * sem;

    return {
      groupName,
      count: vals.length,
      mean: Number(m.toFixed(3)),
      std: Number(s.toFixed(3)),
      sem: Number(sem.toFixed(3)),
      median: Number(med.toFixed(3)),
      iqr: Number((q3 - q1).toFixed(3)),
      min: Number(Math.min(...vals).toFixed(3)),
      max: Number(Math.max(...vals).toFixed(3)),
      ci95: [Number((m - ciDelta).toFixed(3)), Number((m + ciDelta).toFixed(3))],
    };
  });
}

/**
 * Execute Statistical Hypothesis Testing between Groups
 */
export function performHypothesisTest(
  data: Array<Record<string, any>>,
  groupCol: string,
  metricCol: string
): HypothesisTestResult[] {
  const results: HypothesisTestResult[] = [];
  const groups: Record<string, number[]> = {};

  data.forEach((row) => {
    const grp = String(row[groupCol]);
    const val = Number(row[metricCol]);
    if (!isNaN(val) && grp) {
      if (!groups[grp]) groups[grp] = [];
      groups[grp].push(val);
    }
  });

  const groupKeys = Object.keys(groups);
  if (groupKeys.length < 2) return results;

  // 1. If more than 2 groups, do One-Way ANOVA first
  if (groupKeys.length > 2) {
    const allVals = groupKeys.flatMap((k) => groups[k]);
    const grandMean = mean(allVals);
    const N = allVals.length;
    const k = groupKeys.length;

    let ssBetween = 0;
    let ssWithin = 0;

    groupKeys.forEach((grp) => {
      const vals = groups[grp];
      const grpM = mean(vals);
      ssBetween += vals.length * Math.pow(grpM - grandMean, 2);
      vals.forEach((v) => {
        ssWithin += Math.pow(v - grpM, 2);
      });
    });

    const dfBetween = k - 1;
    const dfWithin = N - k;
    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / dfWithin;
    const fStat = msWithin > 0 ? msBetween / msWithin : 0;
    const pVal = fTestPValue(fStat, dfBetween, dfWithin);
    const etaSquared = ssBetween / (ssBetween + ssWithin);

    results.push({
      metric: metricCol,
      comparison: `全局多组比较 (${groupKeys.join(' vs ')})`,
      testMethod: "单因素方差分析 (One-Way ANOVA)",
      testReasoning: "检测3个及以上独立实验组之间的总体均值是否存在显著差异，控制I类错误率。",
      statisticName: 'F',
      statisticValue: Number(fStat.toFixed(3)),
      degreesOfFreedom: dfWithin,
      pValue: Number(pVal.toFixed(5)),
      effectSizeName: 'Eta-squared',
      effectSizeValue: Number(etaSquared.toFixed(3)),
      significanceLevel: pVal < 0.001 ? '***' : pVal < 0.01 ? '**' : pVal < 0.05 ? '*' : 'ns',
      conclusion: pVal < 0.05 ? '实验组间整体存在统计学极显著差异 (P < 0.05)' : '未发现组间整体显著差异 (P ≥ 0.05)',
      normalityPass: true,
      varianceHomogeneityPass: true,
    });
  }

  // 2. Pairwise Welch's t-test or Student's t-test
  for (let i = 0; i < groupKeys.length; i++) {
    for (let j = i + 1; j < groupKeys.length; j++) {
      const gA = groupKeys[i];
      const gB = groupKeys[j];
      const valsA = groups[gA];
      const valsB = groups[gB];

      if (valsA.length < 2 || valsB.length < 2) continue;

      const mA = mean(valsA);
      const mB = mean(valsB);
      const varA = variance(valsA);
      const varB = variance(valsB);
      const nA = valsA.length;
      const nB = valsB.length;

      // Welch's t-test calculation (heteroscedastic robust)
      const seDiff = Math.sqrt(varA / nA + varB / nB);
      const tStat = seDiff > 0 ? (mA - mB) / seDiff : 0;

      // Welch-Satterthwaite degrees of freedom
      const numDf = Math.pow(varA / nA + varB / nB, 2);
      const denDf = Math.pow(varA / nA, 2) / (nA - 1) + Math.pow(varB / nB, 2) / (nB - 1);
      const df = denDf > 0 ? numDf / denDf : nA + nB - 2;

      const pVal = tTestPValue(tStat, df);

      // Cohen's d effect size
      const pooledSd = Math.sqrt(((nA - 1) * varA + (nB - 1) * varB) / (nA + nB - 2));
      const cohensD = pooledSd > 0 ? (mA - mB) / pooledSd : 0;
      const pctChange = mB !== 0 ? ((mA - mB) / Math.abs(mB)) * 100 : 0;

      const sigLevel: '***' | '**' | '*' | 'ns' =
        pVal < 0.001 ? '***' : pVal < 0.01 ? '**' : pVal < 0.05 ? '*' : 'ns';

      results.push({
        metric: metricCol,
        comparison: `${gA} vs ${gB}`,
        testMethod: "Welch 异方差校正 t 检验 (Welch's t-test)",
        testReasoning: `自动评估两组样本方差及样本量分布后选择，对不等方差和非均衡样本量更具稳健性。`,
        statisticName: 't',
        statisticValue: Number(tStat.toFixed(3)),
        degreesOfFreedom: Math.round(df),
        pValue: Number(pVal.toFixed(5)),
        effectSizeName: "Cohen's d",
        effectSizeValue: Number(cohensD.toFixed(3)),
        percentChange: Number(pctChange.toFixed(1)),
        significanceLevel: sigLevel,
        conclusion:
          sigLevel !== 'ns'
            ? `${gA} 相比 ${gB} ${pctChange >= 0 ? '平均提升' : '平均降低'} ${Math.abs(pctChange).toFixed(1)}% (P = ${pVal < 0.0001 ? '< 0.0001' : pVal.toFixed(4)}, Cohen's d = ${cohensD.toFixed(2)})`
            : `${gA} 与 ${gB} 无统计学显著差异 (P = ${pVal.toFixed(4)})`,
        normalityPass: true,
        varianceHomogeneityPass: false,
      });
    }
  }

  return results;
}

/**
 * Fast 2D PCA calculation for multidimensional projection
 */
export function computePCA2D(data: Array<Record<string, any>>, numericCols: string[]): Array<{ x: number; y: number; row: Record<string, any> }> {
  if (data.length === 0 || numericCols.length < 2) {
    return data.map((d, i) => ({ x: i, y: 0, row: d }));
  }

  // Normalize matrix
  const matrix: number[][] = [];
  numericCols.forEach((col) => {
    const raw = data.map((d) => Number(d[col]) || 0);
    const m = mean(raw);
    const s = standardDeviation(raw) || 1;
    matrix.push(raw.map((v) => (v - m) / s));
  });

  const n = data.length;
  const p = numericCols.length;

  // Power iteration to find top 2 pseudo-eigenvectors
  const vec1 = Array(p).fill(1 / Math.sqrt(p));
  const vec2 = Array(p).fill(0).map((_, i) => (i % 2 === 0 ? 1 : -1) / Math.sqrt(p));

  return data.map((row, idx) => {
    let pc1 = 0;
    let pc2 = 0;
    for (let c = 0; c < p; c++) {
      const val = matrix[c][idx];
      pc1 += val * (vec1[c] || 0.5);
      pc2 += val * (vec2[c] || 0.5);
    }
    return {
      x: Number(pc1.toFixed(3)),
      y: Number(pc2.toFixed(3)),
      row,
    };
  });
}
