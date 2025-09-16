<template>
  <v-row
    ano-gutters
    class="app-field"
  >
    <v-col
      cols="12"
      :md="props.block ? 12 : 4"
      class="d-flex align-start mb-n2 mb-lg-0 pt-md-6"
    >
      <div class="">
        <slot name="label">
          {{ props.label }}
        </slot>
        <small class="d-block text-disabled">
          <slot name="hint">{{ props.hint }}</slot>
        </small>
      </div>
    </v-col>
    <v-col
      cols="12"
      :md="props.block ? 12 : 8"
      class="pa-2"
    >
      <v-defaults-provider
        :defaults="{
          global: { hideDetails: 'auto' },
        }"
      >
        <slot name="default"></slot>
      </v-defaults-provider>
    </v-col>
  </v-row>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  label: { type: String, default: null },
  hint: { type: String, default: null },
  block: { type: Boolean, default: false },
});
</script>
