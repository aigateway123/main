<script setup lang="ts">
import { ref } from 'vue'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import FeatureSection from '@/components/FeatureSection.vue'
import SolutionsSection from '@/components/SolutionsSection.vue'
// import InfrastructureSection from '@/components/InfrastructureSection.vue'
import PricingSection from '@/components/PricingSection.vue'
import CtaBanner from '@/components/CtaBanner.vue'
import FaqSection from '@/components/FaqSection.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'

const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <main>
      <HeroSection :admin-url="adminUrl" @open-console="handleOpenConsole" />
      <FeatureSection />
      <SolutionsSection />
      <!-- <InfrastructureSection /> -->
      <PricingSection :admin-url="adminUrl" @open-console="handleOpenConsole" />
      <CtaBanner :admin-url="adminUrl" @open-console="handleOpenConsole" />
      <FaqSection />
    </main>

    <FooterSection />

    <ContactFloat />
  </div>
</template>
