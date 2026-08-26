<script setup lang="ts">
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import ModelsSection from '@/components/ModelsSection.vue'
import SolutionEntryBanner from '@/components/SolutionEntryBanner.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'

const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <!-- Page header offset -->
    <div class="pt-20" />

    <main>
      <!-- 解决方案入口横幅 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <SolutionEntryBanner />
      </div>
      <ModelsSection />
    </main>

    <FooterSection />
    <ContactFloat />
  </div>
</template>
