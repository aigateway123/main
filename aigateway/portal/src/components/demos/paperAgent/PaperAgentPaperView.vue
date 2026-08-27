<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check, Search, FileText, Hash } from 'lucide-vue-next'
import type { PaperData, ExperimentProject } from '@/data/paperAgentData'
import ScientificFigure1 from './ScientificFigures.vue'
import Figure2Heatmap from './Figure2Heatmap.vue'

const props = defineProps<{
  paperData: PaperData
  experiment: ExperimentProject
  serifMode: boolean
  hasAppliedAblation: boolean
  hasAppliedStats: boolean
  hasAppliedUnits: boolean
  hasAppliedReferences: boolean
}>()

const emit = defineEmits<{ (e: 'start-review'): void; (e: 'open-export'): void }>()

const activeSectionId = ref('sec-4-3')
const copied = ref(false)

const sec = (id: string) => props.paperData.sections.find((s) => s.id === id)
const sub = (secId: string, subId: string) => sec(secId)?.subsections?.find((s) => s.id === subId)

function scrollToSection(id: string) {
  activeSectionId.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function copyFullText() {
  const fullText =
    `${props.paperData.title}\n\nAbstract:\n${props.paperData.abstract}\n\n` +
    props.paperData.sections
      .map((s) => {
        let text = `${s.number}. ${s.title}\n${s.content}`
        if (s.subsections) text += '\n' + s.subsections.map((subSec) => `${subSec.number} ${subSec.title}\n${subSec.content}`).join('\n\n')
        return text
      })
      .join('\n\n')
  navigator.clipboard.writeText(fullText)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="space-y-4 pb-16">
    <!-- Top Paper Header Bar -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-blue-600/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
          <FileText class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-white">Paper Editor & Reader</span>
            <span class="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">{{ paperData.version }}</span>
            <span v-if="hasAppliedAblation" class="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">+ Ablation Study (Sec 4.4)</span>
          </div>
          <p class="text-xs text-slate-400">IEEE / NeurIPS Standard Scientific Typesetting · 基于实验数据自动生成</p>
        </div>
      </div>

      <!-- Action Controls -->
      <div class="flex items-center gap-2.5">
        <button
          @click="copyFullText"
          class="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
        >
          <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-400" />
          <Copy v-else class="w-3.5 h-3.5" />
          <span>{{ copied ? '已复制全文' : '复制全文' }}</span>
        </button>

        <button
          @click="emit('start-review')"
          class="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 rounded-lg shadow-lg shadow-orange-500/25 flex items-center gap-2 transition hover:-translate-y-0.5 active:translate-y-0"
        >
          <Search class="w-4 h-4" />
          <span>AI 审稿 (Review Paper)</span>
        </button>
      </div>
    </div>

    <!-- Main 2-Column Editor Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Sidebar: Contents TOC -->
      <div class="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg sticky top-40">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-bold text-slate-200">
          <span class="flex items-center gap-1.5">
            <Hash class="w-3.5 h-3.5 text-blue-400" />
            <span>Contents (目录)</span>
          </span>
          <span class="text-[10px] text-slate-400 font-mono">{{ paperData.sections.length }} Sections</span>
        </div>

        <nav class="mt-3 space-y-1 text-xs">
          <button @click="scrollToSection('sec-abstract')" class="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition flex items-center justify-between">
            <span>Abstract</span>
          </button>

          <div v-for="section in paperData.sections" :key="section.id" class="space-y-0.5">
            <button
              @click="scrollToSection(section.id)"
              :class="`w-full text-left px-2.5 py-1.5 rounded-lg transition font-medium flex items-center justify-between ${
                activeSectionId === section.id ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`"
            >
              <span class="truncate">{{ section.number }}. {{ section.title }}</span>
              <span v-if="section.id === 'sec-4'" class="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">Core</span>
            </button>

            <div v-if="section.subsections" class="pl-3.5 border-l border-slate-800 space-y-0.5 my-1">
              <button
                v-for="subSec in section.subsections"
                :key="subSec.id"
                @click="scrollToSection(subSec.id)"
                :class="`w-full text-left px-2 py-1 rounded text-[11px] transition flex items-center justify-between ${
                  activeSectionId === subSec.id ? 'text-cyan-300 bg-cyan-950/40 font-semibold border-l-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`"
              >
                <span class="truncate">{{ subSec.number }} {{ subSec.title }}</span>
                <span v-if="subSec.hasFigure" class="text-[9px] text-cyan-400 font-mono">Fig</span>
                <span v-if="subSec.hasTable" class="text-[9px] text-amber-400 font-mono">Tab</span>
              </button>
            </div>
          </div>

          <button @click="scrollToSection('sec-references')" class="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition flex items-center justify-between">
            <span>References</span>
            <span class="text-[10px] font-mono text-slate-500">[{{ paperData.references.length }}]</span>
          </button>
        </nav>

        <!-- Quick Stats Panel -->
        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5 font-mono">
          <div class="flex justify-between">
            <span>Word Count:</span>
            <span class="text-slate-200 font-bold">~3,480 words</span>
          </div>
          <div class="flex justify-between">
            <span>Figures / Tables:</span>
            <span class="text-slate-200 font-bold">{{ hasAppliedAblation ? '2 Figs / 3 Tabs' : '2 Figs / 2 Tabs' }}</span>
          </div>
          <div class="flex justify-between">
            <span>Equations:</span>
            <span class="text-slate-200 font-bold">4 Math Blocks</span>
          </div>
        </div>
      </div>

      <!-- Right Document Canvas: Academic Paper Body -->
      <div class="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl text-slate-200 relative">
        <div :class="`max-w-4xl mx-auto space-y-8 ${serifMode ? 'font-serif' : 'font-sans'}`">
          <!-- Paper Header / Title -->
          <div class="text-center space-y-4 pb-6 border-b border-slate-800">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">{{ paperData.title }}</h1>
            <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-300">
              <div v-for="(author, idx) in paperData.authors" :key="idx" class="text-center">
                <div class="font-bold text-slate-100">{{ author.name }}</div>
                <div class="text-slate-400 text-[11px]">{{ author.institution }}</div>
                <div class="text-cyan-400 text-[10px] font-mono">{{ author.email }}</div>
              </div>
            </div>
          </div>

          <!-- Abstract Box -->
          <div id="sec-abstract" class="bg-slate-950/70 border border-slate-800 rounded-xl p-5 shadow-inner space-y-2 scroll-mt-40">
            <div class="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">Abstract</div>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">{{ paperData.abstract }}</p>
            <div class="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span class="font-bold text-slate-400">Keywords:</span>
              <span v-for="(kw, i) in paperData.keywords" :key="i" class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] border border-slate-700">{{ kw }}</span>
            </div>
          </div>

          <!-- Main Sections -->
          <div class="space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">
            <!-- Section 1: Introduction -->
            <section id="sec-1" class="space-y-3 scroll-mt-40">
              <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span class="text-cyan-400 font-mono">1.</span>
                <span>Introduction</span>
              </h2>
              <div class="whitespace-pre-line text-justify leading-relaxed">{{ sec('sec-1')?.content }}</div>
            </section>

            <!-- Section 2: Related Work -->
            <section id="sec-2" class="space-y-3 scroll-mt-40">
              <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span class="text-cyan-400 font-mono">2.</span>
                <span>Related Work</span>
              </h2>
              <div class="whitespace-pre-line text-justify leading-relaxed">{{ sec('sec-2')?.content }}</div>
            </section>

            <!-- Section 3: Methodology -->
            <section id="sec-3" class="space-y-3 scroll-mt-40">
              <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span class="text-cyan-400 font-mono">3.</span>
                <span>Methodology</span>
              </h2>
              <div class="whitespace-pre-line text-justify leading-relaxed">{{ sec('sec-3')?.content }}</div>
            </section>

            <!-- Section 4: Experiments -->
            <section id="sec-4" class="space-y-6 scroll-mt-40">
              <div class="space-y-2 border-b border-slate-800 pb-2">
                <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span class="text-cyan-400 font-mono">4.</span>
                  <span>Experiments</span>
                </h2>
                <p class="text-slate-400 text-xs">{{ sec('sec-4')?.content }}</p>
              </div>

              <!-- 4.1 Dataset -->
              <div id="sec-4-1" class="space-y-3 scroll-mt-40">
                <h3 class="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  <span class="text-cyan-400 font-mono">4.1</span>
                  <span>Dataset & Experimental Setup</span>
                </h3>
                <p class="text-justify leading-relaxed">{{ sub('sec-4', 'sec-4-1')?.content }}</p>

                <!-- Table 1 Embedded -->
                <div class="my-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 shadow-md">
                  <div class="text-center font-semibold text-xs text-slate-200 mb-2 font-mono">Table 1. Dataset Characteristics and Model Hyperparameter Configurations</div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-y-2 border-slate-700">
                      <thead class="border-b border-slate-700 text-slate-300 font-mono text-[11px]">
                        <tr>
                          <th class="py-2 px-3">Parameter / Attribute</th>
                          <th class="py-2 px-3">Specification / Value</th>
                          <th class="py-2 px-3">Description & Physical Units</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-800 text-slate-300 font-mono">
                        <tr v-for="(row, rIdx) in experiment.tables[0]?.rows" :key="rIdx" class="hover:bg-slate-800/40">
                          <td class="py-2 px-3 font-medium text-slate-200 font-sans">{{ row[0] }}</td>
                          <td class="py-2 px-3 text-cyan-300">{{ row[1] }}</td>
                          <td class="py-2 px-3 text-slate-400">{{ row[2] }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- 4.2 Baselines -->
              <div id="sec-4-2" class="space-y-3 scroll-mt-40">
                <h3 class="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  <span class="text-cyan-400 font-mono">4.2</span>
                  <span>Baseline Models</span>
                </h3>
                <div class="whitespace-pre-line text-justify leading-relaxed">{{ sub('sec-4', 'sec-4-2')?.content }}</div>
              </div>

              <!-- 4.3 Results & Comparative Analysis -->
              <div id="sec-4-3" class="space-y-4 scroll-mt-40 bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 sm:p-5">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm sm:text-base font-bold text-cyan-300 flex items-center gap-2">
                    <span class="text-cyan-400 font-mono">4.3</span>
                    <span>Results & Comparative Analysis (Core AI Generated)</span>
                  </h3>
                  <span class="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 rounded border border-cyan-400/40">Results Section</span>
                </div>

                <div class="whitespace-pre-line text-justify leading-relaxed text-slate-200">{{ sub('sec-4', 'sec-4-3')?.content }}</div>

                <!-- Embedded Table 2 (Standard Booktabs Table) -->
                <div class="my-4 bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-lg">
                  <div class="text-center font-bold text-xs text-slate-200 mb-2 font-mono">
                    Table 2. Quantitative Benchmark Performance on UrbanEV-ChargeBench
                    <span v-if="hasAppliedStats" class="block text-[11px] text-cyan-400 font-normal mt-0.5">
                      (Mean ± Std over 5 random seed runs; ** denotes p &lt; 0.001 vs Ours via paired Student t-test)
                    </span>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-y-2 border-slate-600">
                      <thead class="border-b border-slate-700 text-slate-300 font-mono text-[11px]">
                        <tr>
                          <th class="py-2.5 px-3">Model</th>
                          <th class="py-2.5 px-3">MAE {{ hasAppliedUnits ? '(kW)' : '' }} ↓</th>
                          <th class="py-2.5 px-3">RMSE {{ hasAppliedUnits ? '(kW)' : '' }} ↓</th>
                          <th class="py-2.5 px-3">MAPE {{ hasAppliedUnits ? '(%)' : '' }} ↓</th>
                          <th class="py-2.5 px-3">Inference {{ hasAppliedUnits ? '(ms/batch)' : '' }}</th>
                          <th v-if="hasAppliedStats" class="py-2.5 px-3">p-value</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-800 font-mono">
                        <tr v-for="(b, idx) in experiment.baselines" :key="idx" :class="b.isOurs ? 'bg-cyan-950/40 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800/40'">
                          <td class="py-2 px-3 font-sans flex items-center gap-1.5">
                            <span>{{ b.model }}</span>
                            <span v-if="b.isOurs" class="text-[9px] bg-cyan-500/20 px-1 rounded">PROPOSED</span>
                          </td>
                          <td class="py-2 px-3">{{ hasAppliedStats ? `${b.mae.toFixed(2)} ± 0.35` : b.mae.toFixed(2) }}</td>
                          <td class="py-2 px-3">{{ hasAppliedStats ? `${b.rmse.toFixed(2)} ± 0.48` : b.rmse.toFixed(2) }}</td>
                          <td class="py-2 px-3">{{ hasAppliedStats ? `${b.mape.toFixed(2)}% ± 0.12%` : `${b.mape.toFixed(2)}%` }}</td>
                          <td class="py-2 px-3">{{ b.inferenceTimeMs.toFixed(1) }} ms</td>
                          <td v-if="hasAppliedStats" class="py-2 px-3 text-cyan-400 font-bold">{{ b.pValVsOurs }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Embedded Figure 1 Plot in Results -->
                <div class="my-6">
                  <ScientificFigure1 :show-confidence-interval="true" />
                  <p class="mt-2 text-center text-xs text-slate-400 italic">
                    Figure 1. 24-Hour Multi-Horizon EV Charging Load Curve: Comparison of ground-truth demand against predictions by the proposed ST-Transformer and baseline LSTM.
                  </p>
                </div>

                <!-- Embedded Figure 2 Heatmap in Results -->
                <div class="my-6">
                  <Figure2Heatmap />
                  <p class="mt-2 text-center text-xs text-slate-400 italic">
                    Figure 2. Learned Spatial-Temporal Cross-Attention Correlation Matrix across 8 metropolitan fast-charging clusters showing autonomous discovery of dynamic pricing load migration.
                  </p>
                </div>
              </div>

              <!-- 4.4 Ablation Study (Conditionally Added when Generated in Revision!) -->
              <div v-if="hasAppliedAblation" id="sec-4-4" class="space-y-4 scroll-mt-40 bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-5 shadow-lg">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
                    <span class="text-emerald-400 font-mono">4.4</span>
                    <span>Ablation Study & Component Attribution (Generated via AI Agent)</span>
                  </h3>
                  <span class="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/40 flex items-center gap-1">
                    <Check class="w-3 h-3" />
                    <span>Ablation Study Active</span>
                  </span>
                </div>

                <p class="text-justify leading-relaxed text-slate-200">
                  To systematically verify the individual contributions of multi-modal features and architectural components, we conduct rigorous ablation experiments by isolating each key mechanism:
                  <br /><br />
                  <strong>1. w/o Weather Features:</strong> Removing ambient temperature, precipitation, and extreme weather flags increases MAE from 14.28 kW to 16.12 kW (+12.9% error increase), demonstrating that meteorological inputs are crucial for capturing seasonal HVAC cooling loads and rainy-day driving habits.
                  <br /><br />
                  <strong>2. w/o Dynamic Pricing (TOU):</strong> Eliminating real-time electricity tariff and surge pricing signal embeddings increases MAPE from 5.82% to 7.42% (+27.5% relative error surge), verifying that price sensitivity strongly dictates fast-charging session timing and station selection.
                  <br /><br />
                  <strong>3. w/o Spatial Cross-Attention:</strong> Replacing dynamic spatial cross-attention with a static Euclidean road-distance graph causes the most severe performance degradation (MAE = 18.05 kW, MAPE = 7.89%, a 35.6% deterioration). This proves that EV demand dynamically shifts between downtown and suburban corridors, which static graph topologies fail to accommodate.
                </p>

                <!-- Table 3: Ablation Results -->
                <div class="my-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div class="text-center font-bold text-xs text-slate-200 mb-2 font-mono">Table 3. Ablation Study: Performance Comparison across Stripped Architectural Variants</div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs border-y-2 border-slate-600">
                      <thead class="border-b border-slate-700 text-slate-300 font-mono text-[11px]">
                        <tr>
                          <th class="py-2 px-3">Ablation Variant</th>
                          <th class="py-2 px-3">Description & Modification</th>
                          <th class="py-2 px-3">MAE (kW) ↓</th>
                          <th class="py-2 px-3">RMSE (kW) ↓</th>
                          <th class="py-2 px-3">MAPE (%) ↓</th>
                          <th class="py-2 px-3">Performance Degradation</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-800 font-mono">
                        <tr class="bg-emerald-950/30 text-emerald-300 font-bold">
                          <td class="py-2 px-3">1. Full ST-Trans (Proposed)</td>
                          <td class="py-2 px-3 font-sans text-slate-300">Complete Model (Weather + TOU + Spatial Attn)</td>
                          <td class="py-2 px-3">14.28</td>
                          <td class="py-2 px-3">22.65</td>
                          <td class="py-2 px-3">5.82%</td>
                          <td class="py-2 px-3 text-emerald-400">Baseline (Optimal)</td>
                        </tr>
                        <tr class="hover:bg-slate-800/40 text-slate-300">
                          <td class="py-2 px-3">2. w/o Weather Features</td>
                          <td class="py-2 px-3 font-sans text-slate-400">Removed ambient temp & rainfall inputs</td>
                          <td class="py-2 px-3">16.12</td>
                          <td class="py-2 px-3">25.40</td>
                          <td class="py-2 px-3">6.78%</td>
                          <td class="py-2 px-3 text-amber-400">+16.5% error increase</td>
                        </tr>
                        <tr class="hover:bg-slate-800/40 text-slate-300">
                          <td class="py-2 px-3">3. w/o Dynamic Pricing</td>
                          <td class="py-2 px-3 font-sans text-slate-400">Removed Time-of-Use tariff embeddings</td>
                          <td class="py-2 px-3">17.45</td>
                          <td class="py-2 px-3">27.18</td>
                          <td class="py-2 px-3">7.42%</td>
                          <td class="py-2 px-3 text-orange-400">+27.5% error increase</td>
                        </tr>
                        <tr class="hover:bg-slate-800/40 text-slate-300">
                          <td class="py-2 px-3">4. w/o Spatial Attention</td>
                          <td class="py-2 px-3 font-sans text-slate-400">Replaced dynamic attention with static graph</td>
                          <td class="py-2 px-3">18.05</td>
                          <td class="py-2 px-3">28.32</td>
                          <td class="py-2 px-3">7.89%</td>
                          <td class="py-2 px-3 text-red-400">+35.6% error increase</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 5: Discussion -->
            <section id="sec-5" class="space-y-3 scroll-mt-40">
              <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span class="text-cyan-400 font-mono">5.</span>
                <span>Discussion</span>
              </h2>
              <div class="whitespace-pre-line text-justify leading-relaxed">{{ sec('sec-5')?.content }}</div>
            </section>

            <!-- Section 6: Conclusion -->
            <section id="sec-6" class="space-y-3 scroll-mt-40">
              <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1.5">
                <span class="text-cyan-400 font-mono">6.</span>
                <span>Conclusion</span>
              </h2>
              <div class="whitespace-pre-line text-justify leading-relaxed">{{ sec('sec-6')?.content }}</div>
            </section>

            <!-- References -->
            <section id="sec-references" class="space-y-3 scroll-mt-40 pt-4 border-t border-slate-800">
              <h2 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>References</span>
              </h2>
              <div class="space-y-2 text-xs text-slate-400 font-mono">
                <div v-for="ref in paperData.references" :key="ref.id" class="flex items-start gap-2">
                  <span class="text-cyan-400 font-bold flex-shrink-0">[{{ ref.id }}]</span>
                  <span class="text-slate-300 font-sans">{{ ref.text }}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
