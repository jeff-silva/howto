<template>
  <nuxt-layout name="main">
    <div>dashboard</div>
    <pre>{{ { search } }}</pre>
  </nuxt-layout>
</template>

<script setup>
const search = useAxios({
  method: "get",
  url: "/api/app_user",
});
</script>
