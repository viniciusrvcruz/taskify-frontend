<script setup>
import Menubar from '@/components/Menubar.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div class="h-screen">
    <Menubar />
    <div class="relative h-full p-0 bg-white sm:ml-64 dark:bg-gray-900">
      <RouterView />
      <Footer />
    </div>
  </div>
</template>

<style scoped></style>
