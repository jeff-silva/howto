<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="$props.modelValue"
    v-mask="'cpf'"
    @update:modelValue="$emit('update:modelValue', $event || '')"
  />
</template>

<script setup>
const $emit = defineEmits(["update:modelValue"]);

const $props = defineProps({
  modelValue: { type: [Number, String], default: null },
});
</script>
