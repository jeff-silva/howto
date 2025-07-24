<template>
  <nuxt-layout name="main">
    <v-form
      :disabled="register.busy"
      @submit.prevent="register.submit()"
    >
      <v-text-field
        v-model="register.data.name"
        label="Nome"
        :error-messages="register.fieldErrors('name')"
      />
      <v-text-field
        v-model="register.data.email"
        label="E-mail"
        :error-messages="register.fieldErrors('email')"
      />
      <v-text-field
        v-model="register.data.password"
        :error-messages="register.fieldErrors('password')"
        label="Senha"
      />
      <v-text-field
        v-model="register.data.password_confirmation"
        :error-messages="register.fieldErrors('password_confirmation')"
        label="Confirme a Senha"
      />

      <div class="d-flex justify-end ga-3">
        <v-btn
          text="register"
          color="primary"
          type="submit"
          :loading="register.busy"
        />
      </div>
    </v-form>
  </nuxt-layout>
</template>

<script setup>
const register = useAxios({
  method: "post",
  url: "/api/auth/register",
  onSuccess() {
    register.data = {};
  },
});
</script>
