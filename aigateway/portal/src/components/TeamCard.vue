<script setup lang="ts">
import type { ExpertTeam } from '@/types'
import { skills } from '@/data/skills'
import { teamIconMap, teamCommonIcons } from '@/utils/teamIcons'
import { skillIconMap } from '@/utils/skillIcons'

defineProps<{
  team: ExpertTeam
}>()

/** 成员 Skill 信息（用于头像展示） */
const skillOf = (slug: string) => skills.find((s) => s.slug === slug)
</script>

<template>
  <router-link
    :to="`/teams/${team.slug}`"
    class="group relative flex flex-col p-4 rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-2 mb-3">
      <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 flex items-center justify-center text-white shadow-md shadow-blue-600/20 shrink-0">
        <component :is="teamIconMap[team.icon] || teamCommonIcons.Users" class="w-4 h-4" />
      </div>
      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
        {{ team.badge }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">{{ team.name }}</h3>
    <p class="text-[11px] font-semibold text-blue-600 mt-0.5">{{ team.tagline }}</p>

    <!-- Description -->
    <p class="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">{{ team.description }}</p>

    <!-- Members（头像组） -->
    <div class="flex items-center gap-1.5 mt-2.5">
      <div class="flex -space-x-1.5">
        <span
          v-for="m in team.members"
          :key="m.skillSlug"
          class="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 flex items-center justify-center text-white ring-2 ring-white"
          :title="m.role"
        >
          <component :is="skillIconMap[skillOf(m.skillSlug)?.icon || ''] || teamCommonIcons.Zap" class="w-3 h-3" />
        </span>
      </div>
      <span class="text-[10px] text-slate-400">{{ team.members.length }} 位专家协作</span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-end mt-3.5 pt-3 border-t border-slate-100">
      <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:gap-1.5 transition-all">
        协作流程
        <component :is="teamCommonIcons.ArrowRight" class="w-3 h-3" />
      </span>
    </div>
  </router-link>
</template>
