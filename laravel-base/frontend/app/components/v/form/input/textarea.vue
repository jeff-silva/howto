<template>
  <v-textarea
    v-bind="$attrs"
    :model-value="$props.modelValue"
    @update:modelValue="$emit('update:modelValue', $event || '')"
  />
</template>

<script setup>
const $emit = defineEmits(["update:modelValue"]);

const $props = defineProps({
  modelValue: { type: [Number, String], default: null },
});
</script>
