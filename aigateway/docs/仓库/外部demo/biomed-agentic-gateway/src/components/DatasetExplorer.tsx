import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowUpDown, 
  Eye, 
  EyeOff,
  Hash,
  Type as TypeIcon,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BiomedicalDataset, DataColumn, OutlierItem } from '../types';

interface DatasetExplorerProps {
  dataset: BiomedicalDataset;
  columns: DataColumn[];
  outliers: OutlierItem[];
  filterOutliers: boolean;
  onToggleFilterOutliers: (val: boolean) => void;
  onSelectOutlierRow?: (item: OutlierItem) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({
  dataset,
  columns,
  outliers,
  filterOutliers,
  onToggleFilterOutliers,
  onSelectOutlierRow,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [sortCol, setSortCol] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;

  const outlierRowIndices = useMemo(() => {
    return new Set(outliers.map((o) => o.rowIdx));
  }, [outliers]);

  // Unique groups
  const uniqueGroups = useMemo(() => {
    const grps = new Set<string>();
    dataset.data.forEach((row) => {
      if (row[dataset.primaryGroupCol]) {
        grps.add(String(row[dataset.primaryGroupCol]));
      }
    });
    return Array.from(grps);
  }, [dataset]);

  // Filtered & Sorted rows
  const filteredRows = useMemo(() => {
    return dataset.data.filter((row, idx) => {
      // Outlier toggle filter
      if (filterOutliers && outlierRowIndices.has(idx)) {
        return false;
      }
      // Group filter
      if (selectedGroup !== 'ALL' && String(row[dataset.primaryGroupCol]) !== selectedGroup) {
        return false;
      }
      // Search term
      if (searchTerm) {
        const str = Object.values(row).join(' ').toLowerCase();
        if (!str.includes(searchTerm.toLowerCase())) return false;
      }
      return true;
    }).sort((a, b) => {
      if (!sortCol) return 0;
      const vA = a[sortCol];
      const vB = b[sortCol];
      if (typeof vA === 'number' && typeof vB === 'number') {
        return sortAsc ? vA - vB : vB - vA;
      }
      return sortAsc ? String(vA).localeCompare(String(vB)) : String(vB).localeCompare(String(vA));
    });
  }, [dataset, filterOutliers, outlierRowIndices, selectedGroup, searchTerm, sortCol, sortAsc]);

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const handleSort = (colName: string) => {
    if (sortCol === colName) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colName);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Top Banner: Dataset Overview & Field Profiles */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                {dataset.category}
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {dataset.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-4xl">
              {dataset.description}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              来源与技术平台: {dataset.sourceInfo}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">样本总量</span>
              <span className="text-sm font-bold text-slate-800">{dataset.data.length} 条</span>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">特征维度</span>
              <span className="text-sm font-bold text-slate-800">{columns.length} 列</span>
            </div>
            <div className={`px-3 py-2 rounded-lg border shadow-2xs text-center ${
              outliers.length > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <span className="text-[10px] uppercase tracking-wider font-bold block">异常离群值</span>
              <span className="text-sm font-bold">{outliers.length} 个</span>
            </div>
          </div>
        </div>

        {/* Column Semantic Profile Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium text-[11px] shrink-0">字段自动推断:</span>
          {columns.map((col) => {
            const isGroup = col.name === dataset.primaryGroupCol;
            const isMetric = col.name === dataset.primaryMetricCol;
            const isId = col.name === dataset.idCol;

            return (
              <div
                key={col.name}
                className={`px-2.5 py-1 rounded-md border flex items-center space-x-1.5 shrink-0 transition-all ${
                  isMetric
                    ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                    : isGroup
                    ? 'bg-slate-100 border-slate-300 text-slate-800 font-semibold'
                    : isId
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
                title={`缺失: ${col.missingCount}, 唯一值: ${col.uniqueCount}${col.mean ? `, 均值: ${col.mean}` : ''}`}
              >
                {col.type === 'numeric' ? (
                  <Hash className="w-3 h-3 text-slate-400" />
                ) : (
                  <TypeIcon className="w-3 h-3 text-slate-400" />
                )}
                <span>{col.name}</span>
                {isMetric && <span className="bg-blue-200 text-blue-800 text-[10px] px-1 rounded font-bold">主指标</span>}
                {isGroup && <span className="bg-slate-200 text-slate-800 text-[10px] px-1 rounded font-bold">分组</span>}
                {isId && <span className="bg-slate-200 text-slate-700 text-[10px] px-1 rounded">ID</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Search, Group filter, Outlier Filter Toggle */}
      <div className="p-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 bg-white">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="搜索样本 ID、分组或数值..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Group Filter */}
          <div className="relative">
            <select
              aria-label="按实验组筛选数据"
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">全部分组 ({dataset.data.length})</option>
              {uniqueGroups.map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
            <Filter className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Outlier Exclusion Toggle */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              onToggleFilterOutliers(!filterOutliers);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
              filterOutliers
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="实时切换是否在统计与图表中剔除异常样本"
          >
            {filterOutliers ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>已剔除 {outliers.length} 个离群异常值 (查看清洗后统计)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>包含全部原始样本 (含 {outliers.length} 个离群点)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
              <th className="py-2.5 px-3 w-12 text-center text-slate-400 font-mono">#</th>
              {columns.map((col) => (
                <th
                  key={col.name}
                  onClick={() => handleSort(col.name)}
                  className="py-2.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.name}</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortCol === col.name ? 'text-cyan-600 font-bold' : 'text-slate-300'}`} />
                  </div>
                </th>
              ))}
              <th className="py-2.5 px-3 text-right">质检/异常标记</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRows.map((row, rIdx) => {
              const actualRowIdx = dataset.data.indexOf(row);
              const isOutlier = outlierRowIndices.has(actualRowIdx);
              const outlierDetail = outliers.find((o) => o.rowIdx === actualRowIdx);

              return (
                <tr
                  key={actualRowIdx}
                  className={`transition-colors ${
                    isOutlier
                      ? 'bg-amber-50/70 hover:bg-amber-100/70 font-medium'
                      : rIdx % 2 === 0
                      ? 'bg-white hover:bg-slate-50'
                      : 'bg-slate-50/40 hover:bg-slate-100/70'
                  }`}
                >
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">
                    {actualRowIdx + 1}
                  </td>
                  {columns.map((col) => {
                    const val = row[col.name];
                    const isMetric = col.name === dataset.primaryMetricCol;

                    return (
                      <td
                        key={col.name}
                        className={`py-2 px-3 ${
                          isMetric ? 'font-semibold text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {val !== undefined && val !== null ? String(val) : (
                          <span className="text-rose-500 font-mono italic">NaN</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-2 px-3 text-right">
                    {isOutlier && outlierDetail ? (
                      <button
                        onClick={() => onSelectOutlierRow && onSelectOutlierRow(outlierDetail)}
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 transition"
                        title={`Z-Score: ${outlierDetail.zScore} | 疑似原因: ${outlierDetail.suspectedCause}`}
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>异常点 ({outlierDetail.severity.toUpperCase()})</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>正常</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {paginatedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="py-8 text-center text-slate-400">
                  未检索到匹配的实验数据行
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 px-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <div>
          显示第 <span className="font-semibold text-slate-700">{(page - 1) * pageSize + 1}</span> 至{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(page * pageSize, filteredRows.length)}
          </span>{' '}
          条，共 <span className="font-semibold text-slate-700">{filteredRows.length}</span> 条样本
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
