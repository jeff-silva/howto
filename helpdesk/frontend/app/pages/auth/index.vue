<template>
  <nuxt-layout name="main">
    <v-form @submit.prevent="login.submit()">
      <v-text-field />
      <v-text-field />
      <v-text-field />

      <div class="d-flex justify-end ga-3">
        <v-btn
          text="Login"
          color="primary"
          type="submit"
          :loading="login.busy"
        />
      </div>
    </v-form>
    <pre>{{ login }}</pre>
  </nuxt-layout>
</template>

<script setup>
const login = useAxios({
  method: "post",
  url: "/api/auth/login",
});
</script>
