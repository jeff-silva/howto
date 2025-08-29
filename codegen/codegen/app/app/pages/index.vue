<template>
  <v-ext-layout>
    <template #drawer>
      aaa
      <v-ext-nav :items="[{ title: 'Info', to: '/' }]" />
    </template>

    <template #default>
      <div class="pa-3">
        <nuxt-page v-model="openapi.data" />
        <!-- <lib-monaco
          :options="{ language: 'json' }"
          :model-value="JSON.stringify(openapi.data, null, 2)"
        /> -->
        <pre
          class="bg-blue-grey-darken-4 pa-2 rounded"
          style="font: 13px 'Courier New', Courier, monospace"
          >{{ openapi.data }}</pre
        >
      </div>
    </template>
  </v-ext-layout>
</template>

<script setup>
// GET
const openapi = await $fetch("/api/openapi");
console.log(openapi);

// // POST
// const respPost = await $fetch("/api/openapi", {
//   method: "POST",
//   body: { name: "João", age: 30 },
// });

// console.log(respPost);
</script>
