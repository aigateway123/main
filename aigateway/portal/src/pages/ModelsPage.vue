<script setup lang="ts">
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import ModelsSection from '@/components/ModelsSection.vue'
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
      <ModelsSection />
    </main>

    <FooterSection />
    <ContactFloat />
  </div>
</template>
