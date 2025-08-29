<template>
  <div>
    <pre>{{ openapi }}</pre>
  </div>
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
