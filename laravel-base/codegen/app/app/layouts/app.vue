<template>
  <v-app-layout>
    <template #default>
      <slot></slot>
    </template>

    <template #drawer>
      <v-nav
        :items="[
          { title: 'Info', to: '/' },
          { title: 'Laravel', to: '/laravel' },
        ]"
      />
    </template>
  </v-app-layout>
</template>
