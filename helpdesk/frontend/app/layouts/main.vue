<template>
  <div class="d-flex">
    <div
      class="d-none d-md-block h-screen bg-grey-lighten-4"
      style="min-width: 300px; max-width: 300px"
    >
      <v-list bg-color="transparent">
        <v-list-item to="/">Dashboard</v-list-item>
        <v-list-item to="/auth">Auth / Login</v-list-item>
        <v-list-item to="/auth/register">Auth / Register</v-list-item>
        <v-list-item to="/auth/password">Auth / Password</v-list-item>
      </v-list>
    </div>
    <div class="flex-grow-1 overflow-auto pa-3">
      <slot></slot>
    </div>
  </div>
</template>
