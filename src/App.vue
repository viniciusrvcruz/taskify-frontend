<script setup>
import Menubar from '@/components/Menubar.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div class="h-screen">
    <Menubar />
    <div class="relative flex flex-col justify-between h-full p-0 overflow-auto bg-white sm:ml-64 dark:bg-gray-900">
      <button
        v-if="$route.path !== '/'"
        type="button"
        class="absolute top-3 left-5 flex justify-center items-center text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
        @click="$router.back()"
      >
        <i class="pi pi-arrow-left"></i>
      </button>
      <RouterView />
      <Footer />
    </div>
  </div>
</template>

<style scoped></style>
