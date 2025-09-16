<template>
  <v-text-field
    :append-inner-icon="hidden.value ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append-inner="hidden.toggle()"
    v-bind="$attrs"
    :class="{ 'v-password': true, 'v-password__hidden': hidden.value }"
  />
</template>

<script setup>
const $props = defineProps({
  hidden: { type: Boolean, default: true },
});

const hidden = reactive({
  value: $props.hidden,
  toggle(value = null) {
    if (value === null) value = !this.value;
    hidden.value = value;
  },
});
</script>

<style>
.v-password__hidden input {
  -webkit-text-security: disc;
  text-security: disc;
  letter-spacing: 4px;
}
</style>
