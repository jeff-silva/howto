<script setup lang="ts">
useHead({
  title: 'Nuxt 4 Multi-Subdomain',
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
