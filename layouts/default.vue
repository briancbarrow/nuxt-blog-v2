<script setup lang="ts">
import Header from "~/components/Header.vue";
const year = new Date().getFullYear();
</script>

<template>
  <Header />
  <slot />
  <footer class="bg-gray-100 dark:bg-gray-800 text-center py-4">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      © {{ year }} Brian Barrow. All rights reserved.
    </p>
  </footer>
</template>
