<template>
  <nuxt-layout name="main">
    <v-form
      :disabled="login.busy"
      @submit.prevent="login.submit()"
    >
      <v-text-field
        v-model="login.data.email"
        label="E-mail"
      />
      <v-text-field
        v-model="login.data.password"
        label="Senha"
        type="password"
      />

      <div class="d-flex justify-end ga-3">
        <v-btn
          text="Login"
          color="primary"
          type="submit"
          :loading="login.busy"
        />
      </div>
    </v-form>
    <v-btn
      text="AppUser Search"
      :loading="appUserSearch.busy"
      @click="appUserSearch.submit()"
    />
    <pre>{{ appUserSearch }}</pre>
  </nuxt-layout>
</template>

<script setup>
const login = useAxios({
  method: "post",
  url: "/api/auth/login",
  onSuccess() {
    localStorage.setItem("access_token", login.response.token.plainTextToken);
  },
});

const appUserSearch = useAxios({
  method: "get",
  url: "/api/app_user",
});

appUserSearch.submit();
</script>
