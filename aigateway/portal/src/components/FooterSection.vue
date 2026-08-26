<script setup lang="ts">
import { Cpu, Github, Twitter, Mail, ShieldCheck, Heart } from 'lucide-vue-next'
</script>

<template>
  <footer id="footer" class="bg-white border-t border-slate-200 text-slate-600 pt-16 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-200">
        <!-- Brand Info -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/15">
              <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Cpu class="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <span class="text-xl font-extrabold text-slate-900">Nova AI Gateway</span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed max-w-sm">
            企业级 AI 模型统一接入代理与路由网关，兼容原生 OpenAI SDK。提供智能降级、语义缓存与百万级高并发实时转发能力。
          </p>

          <div class="flex items-center gap-3 pt-2">
            <a href="#" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors" aria-label="GitHub">
              <Github class="w-4 h-4" />
            </a>
            <a href="#" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors" aria-label="Twitter">
              <Twitter class="w-4 h-4" />
            </a>
            <a href="#" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors" aria-label="Email">
              <Mail class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Column 1: Products -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">核心产品</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="#features" class="hover:text-blue-600 transition-colors">智能大模型路由</a></li>
            <li><a href="#features" class="hover:text-blue-600 transition-colors">语义流式缓存引擎</a></li>
            <li><a href="#models" class="hover:text-blue-600 transition-colors">DeepSeek / GPT-4o 映射</a></li>
            <li><a href="#infrastructure" class="hover:text-blue-600 transition-colors">全球 Anycast 节点</a></li>
          </ul>
        </div>

        <!-- Column: Solutions -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">解决方案</h4>
          <ul class="space-y-2 text-xs">
            <li>
              <router-link to="/solutions" class="hover:text-blue-600 transition-colors">解决方案中心</router-link>
            </li>
            <li>
              <router-link to="/solutions/university-agent" class="hover:text-blue-600 transition-colors">高校科研 Agent 解决方案</router-link>
            </li>
          </ul>
        </div>

        <!-- Column 2: Resources -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">开发者文档</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="#" class="hover:text-blue-600 transition-colors">快速入门指南</a></li>
            <li><a href="#" class="hover:text-blue-600 transition-colors">OpenAI SDK 替换教程</a></li>
            <li><a href="#" class="hover:text-blue-600 transition-colors">REST API 接口规范</a></li>
            <li><a href="#" class="hover:text-blue-600 transition-colors">Python / Node.js 示例</a></li>
            <li><a href="#" class="hover:text-blue-600 transition-colors">网关健康状态面板</a></li>
          </ul>
        </div>

        <!-- Column 3: Trust & Compliance -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">安全与合规</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#" class="hover:text-blue-600 transition-colors">数据零留存 (Zero-Log)</a></li>
              <li><a href="#" class="hover:text-blue-600 transition-colors">服务条款 & 隐私协议</a></li>
            </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <span>© 2026 Nova AI Gateway Inc. 保留所有权利。</span>
          <span class="hidden sm:inline">|</span>
          <span class="flex items-center gap-1 text-slate-600">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
            全站 SSL 256 位加密
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span>Crafted with</span>
          <Heart class="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>for Global Developers</span>
        </div>
      </div>
    </div>
  </footer>
</template>
