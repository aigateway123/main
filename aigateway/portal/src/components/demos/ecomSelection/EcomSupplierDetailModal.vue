<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 —— 供应商画像弹窗
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/modals/SupplierDetailModal.tsx
// props: supplier —— emits: close
// ============================================================================
import { Building2, CheckCircle2, Clock, Factory, MapPin, Phone, Sparkles, X } from 'lucide-vue-next'
import type { SupplierItem } from '@/data/ecomIntelData'

defineProps<{
  supplier: SupplierItem
}>()

const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-xs flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Factory class="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-white truncate">{{ supplier.name }}</h3>
              <p class="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span class="inline-flex items-center gap-1">
                  <MapPin class="w-3 h-3 text-indigo-400" />
                  <span>{{ supplier.province }}</span>
                </span>
                <span>·</span>
                <span class="inline-flex items-center gap-1">
                  <Building2 class="w-3 h-3 text-indigo-400" />
                  <span>{{ supplier.factorySize }}</span>
                </span>
                <span>·</span>
                <span class="inline-flex items-center gap-1">
                  <Clock class="w-3 h-3 text-indigo-400" />
                  <span>成立年份: {{ supplier.establishedYear }}</span>
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
            @click="emit('close')"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5 overflow-y-auto">
          <!-- Key Specs Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <div class="text-[10px] text-slate-400">参考单价</div>
              <div class="text-base font-mono font-bold text-emerald-400">
                ${{ supplier.unitPrice.toFixed(2) }}
                <span class="text-[10px] text-slate-400 ml-1">(¥{{ (supplier.unitPrice * 7.2).toFixed(1) }})</span>
              </div>
            </div>

            <div>
              <div class="text-[10px] text-slate-400">起订量 (MOQ)</div>
              <div class="text-base font-mono font-bold text-white">{{ supplier.moq.toLocaleString() }} 件</div>
            </div>

            <div>
              <div class="text-[10px] text-slate-400">打样及交付周期</div>
              <div class="text-xs font-bold text-slate-200 mt-1">{{ supplier.leadTime }}</div>
            </div>

            <div>
              <div class="text-[10px] text-slate-400">AI 产品匹配度</div>
              <div class="text-base font-mono font-bold text-cyan-400">{{ supplier.matchRate }}%</div>
            </div>
          </div>

          <!-- Factory Profile -->
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div class="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
              <Factory class="w-3.5 h-3.5 text-indigo-400" />
              <span>工厂档案 (产业带 / 产能 / 资质)</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-xs">
              <div>
                <div class="text-[10px] text-slate-400">所属产业带</div>
                <div class="text-slate-200 font-semibold mt-0.5">{{ supplier.province }}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400">建厂年份</div>
                <div class="text-slate-200 font-semibold mt-0.5 font-mono">{{ supplier.establishedYear }} 年</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400">工厂规模</div>
                <div class="text-slate-200 font-semibold mt-0.5">{{ supplier.factorySize }}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400">日产能</div>
                <div class="text-slate-200 font-semibold mt-0.5 font-mono">{{ supplier.dailyCapacity }}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400">OEM / ODM 定制</div>
                <div
                  class="mt-0.5 w-fit px-1.5 py-0.5 rounded font-semibold"
                  :class="
                    supplier.oemOdm
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  "
                >
                  {{ supplier.oemOdm ? '支持 OEM / ODM' : '暂不支持' }}
                </div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400">综合评分</div>
                <div class="text-amber-400 font-mono font-bold mt-0.5">★ {{ supplier.rating }} 分</div>
              </div>
            </div>
          </div>

          <!-- AI Match Reason -->
          <div class="bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 space-y-1.5">
            <div class="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-amber-400" />
              <span>AI 供应链画像深度推荐原因</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              {{ supplier.aiMatchReason }}
            </p>
          </div>

          <!-- Certifications -->
          <div v-if="supplier.certifications.length" class="space-y-2">
            <div class="font-bold text-slate-200">权威验厂认证与品质资质</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(c, i) in supplier.certifications"
                :key="i"
                class="px-2.5 py-1 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-400 font-mono font-semibold flex items-center gap-1"
              >
                <CheckCircle2 class="w-3 h-3" />
                {{ c }}
              </span>
            </div>
          </div>

          <!-- Factory Advantages -->
          <div v-if="supplier.advantages.length" class="space-y-2">
            <div class="font-bold text-slate-200">工厂制造优势与开模支持</div>
            <div class="space-y-1.5 text-slate-300">
              <div v-for="(adv, i) in supplier.advantages" :key="i" class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                <span>{{ adv }}</span>
              </div>
            </div>
          </div>

          <!-- Main Products -->
          <div v-if="supplier.mainProducts.length" class="space-y-2">
            <div class="font-bold text-slate-200">现有成熟外贸模具品类</div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(p, i) in supplier.mainProducts"
                :key="i"
                class="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
              >
                {{ p }}
              </span>
            </div>
          </div>

          <!-- Phone Contact -->
          <div v-if="supplier.phone" class="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200">
            <Phone class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span class="font-mono text-xs">{{ supplier.phone }}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div class="text-[11px] text-slate-400">
            支持 1688 / 阿里国际站直连验厂与开模对接
          </div>

          <button
            type="button"
            class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md cursor-pointer"
            @click="emit('close')"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
