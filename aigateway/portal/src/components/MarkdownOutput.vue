<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

/** 交付结果渲染器：解析 Markdown 子集（标题/表格/KPI/勾选/风险分级/列表/引用/代码）为专业成果包视觉 */

type RiskLevel = 'high' | 'mid' | 'low'

interface KpiItem {
  label: string
  value: string
}

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'kpi'; items: KpiItem[] }
  | { type: 'checkbox'; checked: boolean; text: string }
  | { type: 'risk'; level: RiskLevel; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'code'; lang: string; text: string }
  | { type: 'divider' }
  | { type: 'paragraph'; text: string }

const props = defineProps<{ content: string }>()

/** 行内加粗 */
const inlineHtml = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')

const splitRow = (r: string) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
const isSepRow = (r: string[]) => r.length > 0 && r.every((c) => /^:?-{2,}:?$/.test(c))

function parse(src: string): Block[] {
  const lines = src.split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const trimmed = lines[i].trim()

    // 代码块
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim()
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        buf.push(lines[i])
        i++
      }
      i++
      blocks.push({ type: 'code', lang, text: buf.join('\n') })
      continue
    }

    // 标题
    const h = trimmed.match(/^(#{1,3})\s+(.*)$/)
    if (h) {
      blocks.push({ type: 'heading', level: h[1].length, text: h[2] })
      i++
      continue
    }

    // KPI 指标卡
    const k = trimmed.match(/^>\s*kpi:\s*(.+)$/i)
    if (k) {
      const items = k[1]
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((seg) => {
          const idx = seg.indexOf(':')
          if (idx > 0) return { label: seg.slice(0, idx).trim(), value: seg.slice(idx + 1).trim() }
          return { label: '', value: seg }
        })
      blocks.push({ type: 'kpi', items })
      i++
      continue
    }

    // 表格
    if (trimmed.startsWith('|')) {
      const buf: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        buf.push(lines[i].trim())
        i++
      }
      const rows = buf.map(splitRow)
      let headers: string[] = []
      const body: string[][] = []
      if (rows.length > 0 && !isSepRow(rows[0])) {
        if (rows.length > 1 && isSepRow(rows[1])) {
          headers = rows[0]
          rows.slice(2).forEach((r) => body.push(r))
        } else {
          rows.forEach((r) => body.push(r))
        }
      } else if (rows.length > 1) {
        headers = rows[1]
        rows.slice(2).forEach((r) => body.push(r))
      }
      if (headers.length || body.length) blocks.push({ type: 'table', headers, rows: body })
      continue
    }

    // 勾选清单
    const cb = trimmed.match(/^-\s+\[([ xX])\]\s+(.*)$/)
    if (cb) {
      blocks.push({ type: 'checkbox', checked: cb[1] !== ' ', text: cb[2] })
      i++
      continue
    }

    // 风险分级
    const rk = trimmed.match(/^-\s+\[(高|中|低)(?:危|风险)?\]\s+(.*)$/)
    if (rk) {
      blocks.push({
        type: 'risk',
        level: rk[1] === '高' ? 'high' : rk[1] === '中' ? 'mid' : 'low',
        text: rk[2],
      })
      i++
      continue
    }

    // 普通列表
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'list', items })
      continue
    }

    // 引用
    if (trimmed.startsWith('>')) {
      blocks.push({ type: 'quote', text: trimmed.replace(/^>\s?/, '') })
      i++
      continue
    }

    // 分隔线
    if (/^-{3,}$/.test(trimmed)) {
      blocks.push({ type: 'divider' })
      i++
      continue
    }

    // 段落（收集连续普通行）
    if (trimmed) {
      const buf: string[] = [trimmed]
      i++
      while (i < lines.length) {
        const t = lines[i].trim()
        if (!t || /^(#{1,3}\s|```|\||>|[-*]\s|---+$)/.test(t)) break
        buf.push(t)
        i++
      }
      blocks.push({ type: 'paragraph', text: buf.join('<br/>') })
      continue
    }

    i++
  }
  return blocks
}

const blocks = computed(() => parse(props.content))

const riskClass = (l: RiskLevel) =>
  l === 'high'
    ? 'bg-red-50 text-red-600 border border-red-200'
    : l === 'mid'
      ? 'bg-amber-50 text-amber-600 border border-amber-200'
      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'

const riskText = (l: RiskLevel) => (l === 'high' ? '高' : l === 'mid' ? '中' : '低')
</script>

<template>
  <div class="space-y-3">
    <template v-for="(b, i) in blocks" :key="i">
      <!-- 标题 -->
      <div v-if="b.type === 'heading'" class="flex items-center gap-2 pt-0.5" :class="b.level === 1 ? 'mt-1.5' : ''">
        <span
          v-if="b.level <= 2"
          class="w-1 h-4 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600 shrink-0"
        />
        <h3
          :class="
            b.level === 1
              ? 'text-[15px] font-extrabold text-slate-900'
              : b.level === 2
                ? 'text-sm font-extrabold text-slate-900'
                : 'text-xs font-bold text-slate-700'
          "
          v-html="inlineHtml(b.text)"
        />
      </div>

      <!-- KPI 指标卡 -->
      <div v-else-if="b.type === 'kpi'" class="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div
          v-for="(k, ki) in b.items"
          :key="ki"
          class="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-3 py-2.5 text-white shadow-sm"
        >
          <p class="text-[10px] text-blue-100/90 font-medium truncate">{{ k.label }}</p>
          <p class="text-[15px] font-extrabold leading-tight mt-0.5 break-words">{{ k.value }}</p>
        </div>
      </div>

      <!-- 表格 -->
      <div v-else-if="b.type === 'table'" class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="w-full text-left">
          <thead v-if="b.headers.length">
            <tr class="bg-slate-50">
              <th
                v-for="(h, hi) in b.headers"
                :key="hi"
                class="px-3 py-2 text-[11px] font-bold text-slate-600 whitespace-nowrap"
              >
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, ri) in b.rows" :key="ri" class="border-t border-slate-100 hover:bg-slate-50/60">
              <td v-for="(c, ci) in r" :key="ci" class="px-3 py-2 text-xs text-slate-700 align-top" v-html="inlineHtml(c)" />
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 勾选清单 -->
      <div v-else-if="b.type === 'checkbox'" class="flex items-start gap-2.5">
        <span
          class="mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0"
          :class="b.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'"
        >
          <Check v-if="b.checked" class="w-3 h-3" />
        </span>
        <span
          class="text-xs leading-relaxed"
          :class="b.checked ? 'text-slate-400 line-through' : 'text-slate-700'"
          v-html="inlineHtml(b.text)"
        />
      </div>

      <!-- 风险分级 -->
      <div v-else-if="b.type === 'risk'" class="flex items-start gap-2.5">
        <span class="mt-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0" :class="riskClass(b.level)">
          {{ riskText(b.level) }}
        </span>
        <span class="text-xs leading-relaxed text-slate-700" v-html="inlineHtml(b.text)" />
      </div>

      <!-- 普通列表 -->
      <ul v-else-if="b.type === 'list'" class="space-y-1.5">
        <li v-for="(it, li) in b.items" :key="li" class="flex items-start gap-2">
          <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shrink-0" />
          <span class="text-xs leading-relaxed text-slate-700" v-html="inlineHtml(it)" />
        </li>
      </ul>

      <!-- 引用 -->
      <div
        v-else-if="b.type === 'quote'"
        class="rounded-r-xl border-l-4 border-blue-200 bg-blue-50/60 px-3.5 py-2.5 text-xs text-slate-600 leading-relaxed"
        v-html="inlineHtml(b.text)"
      />

      <!-- 代码 -->
      <pre v-else-if="b.type === 'code'" class="rounded-xl bg-slate-900 text-slate-100 p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre">{{ b.text }}</pre>

      <!-- 分隔线 -->
      <div v-else-if="b.type === 'divider'" class="h-px bg-slate-100" />

      <!-- 段落 -->
      <p v-else class="text-xs leading-relaxed text-slate-700" v-html="inlineHtml(b.text)" />
    </template>
  </div>
</template>
