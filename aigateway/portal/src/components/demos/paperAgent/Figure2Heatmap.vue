<script setup lang="ts">
import { ref } from 'vue'

const hoverCell = ref<{ r: number; c: number; val: number } | null>(null)

const stations = [
  '市中心商业区 (CBD)',
  '高新科技园区',
  '机场高速枢纽',
  '北城地铁总站',
  '南城商业中心',
  '东部郊区枢纽',
  '西部大型住宅区',
  '综合交通枢纽',
]

// 8x8 Attention correlation weights
const matrix = [
  [0.92, 0.74, 0.65, 0.42, 0.81, 0.35, 0.28, 0.68],
  [0.72, 0.95, 0.58, 0.38, 0.76, 0.41, 0.32, 0.61],
  [0.64, 0.59, 0.98, 0.31, 0.55, 0.22, 0.18, 0.79],
  [0.4, 0.39, 0.33, 0.89, 0.45, 0.67, 0.58, 0.48],
  [0.82, 0.78, 0.54, 0.44, 0.94, 0.38, 0.3, 0.73],
  [0.34, 0.42, 0.24, 0.65, 0.39, 0.88, 0.72, 0.41],
  [0.29, 0.31, 0.19, 0.59, 0.31, 0.71, 0.91, 0.35],
  [0.69, 0.62, 0.81, 0.49, 0.72, 0.43, 0.34, 0.96],
]

const getColor = (val: number) => {
  if (val > 0.85) return 'bg-cyan-400 text-slate-950 font-bold'
  if (val > 0.7) return 'bg-sky-500 text-slate-950 font-semibold'
  if (val > 0.55) return 'bg-blue-600 text-white'
  if (val > 0.4) return 'bg-indigo-800 text-slate-200'
  if (val > 0.25) return 'bg-slate-800 text-slate-300'
  return 'bg-slate-900 text-slate-500'
}
</script>

<template>
  <div class="bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-md text-slate-100">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-semibold rounded border border-blue-500/30">Figure 2</span>
        <span class="font-medium text-slate-200">空间交叉注意力权重相关性热力图 (充电站间负荷动态迁移)</span>
      </div>
      <span class="text-[11px] text-slate-400 hidden sm:inline font-mono">动态注意力权重 A_ij ∈ [0, 1]</span>
    </div>

    <!-- Heatmap Grid -->
    <div class="mt-4 overflow-x-auto">
      <div class="min-w-[500px]">
        <!-- Column labels -->
        <div class="grid grid-cols-9 gap-1 text-[10px] text-slate-400 font-medium mb-1">
          <div class="text-right pr-2">充电站</div>
          <div v-for="(s, idx) in stations" :key="idx" class="text-center truncate" :title="s">S{{ idx + 1 }}</div>
        </div>

        <!-- Rows -->
        <div v-for="(row, rIdx) in matrix" :key="rIdx" class="grid grid-cols-9 gap-1 mb-1 items-center">
          <div class="text-right pr-2 text-[10px] font-mono text-slate-300 truncate" :title="stations[rIdx]">
            S{{ rIdx + 1 }} ({{ stations[rIdx].slice(0, 3) }})
          </div>
          <div
            v-for="(val, cIdx) in row"
            :key="cIdx"
            @mouseenter="hoverCell = { r: rIdx, c: cIdx, val }"
            @mouseleave="hoverCell = null"
            :class="`h-7 rounded flex items-center justify-center text-[10px] font-mono cursor-pointer transition-transform hover:scale-105 hover:z-10 shadow-sm ${getColor(val)}`"
          >
            {{ val.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer & Active Hover readout -->
    <div class="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
      <div v-if="hoverCell" class="text-cyan-300 font-mono text-xs">
        空间耦合: <span class="font-bold text-white">{{ stations[hoverCell.r] }}</span> → <span class="font-bold text-white">{{ stations[hoverCell.c] }}</span> 关联度 = <span class="text-cyan-400 font-bold">{{ hoverCell.val.toFixed(3) }}</span>
      </div>
      <div v-else class="text-slate-400 text-[11px]">
        提示: 鼠标悬停热力图单元格可查看各充电站间动态电价引发的负荷迁移注意力权重
      </div>

      <!-- Color legend bar -->
      <div class="flex items-center gap-1 text-[10px] text-slate-400">
        <span>0.0</span>
        <div class="w-16 h-2 rounded bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-400" />
        <span>1.0</span>
      </div>
    </div>
  </div>
</template>
