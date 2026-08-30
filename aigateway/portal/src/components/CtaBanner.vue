<script setup lang="ts">
import { ArrowRight, Store, Bot, Sparkles } from 'lucide-vue-next'
</script>

<template>
  <section class="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-8 sm:p-14 overflow-hidden shadow-2xl shadow-blue-600/20">
        <!-- Subtle decorative background circles -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div class="relative z-10 max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles class="w-3.5 h-3.5 text-yellow-300" />
            <span>从能力商城到 AI 员工，一条路径持续升级</span>
          </div>

          <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            准备好雇用您的第一位 <br />
            AI 员工了吗？
          </h2>

          <p class="text-blue-100 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
            先逛能力商城，用 Skill 验证效果；再升级为学习企业数据的专属 AI 员工，最后沉淀为行业解决方案。
          </p>

          <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <router-link
              to="/skills"
              class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-600 hover:bg-slate-50 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Store class="w-4 h-4 text-blue-600" />
              <span>逛逛能力商城</span>
              <ArrowRight class="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </router-link>

            <a
              href="/#ai-employee"
              class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-700/60 hover:bg-blue-700/80 border border-white/30 text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Bot class="w-4 h-4 text-white" />
              <span>定制你的 AI 员工</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
