<template>
  <div class="d-flex justify-end ga-1">
    <v-defaults-provider
      :defaults="{
        VBtn: { rounded: 0, size: 35 },
      }"
    >
      <slot></slot>
    </v-defaults-provider>
  </div>
</template>
