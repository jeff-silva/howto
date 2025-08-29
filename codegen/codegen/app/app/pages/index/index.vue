<template>
  <div>
    <v-text-field
      v-model="model.value.info.version"
      label="Version"
    />
    <v-text-field
      v-model="model.value.info.title"
      label="Application Name"
    />
    <v-textarea
      v-model="model.value.info.description"
      label="Description"
    />
    <v-text-field
      v-model="model.value.info.contact.email"
      label="Contact e-mail"
    />
  </div>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const $emit = defineEmits(["update:modelValue"]);

const model = reactive({
  value: $props.modelValue,
  emit() {
    $emit("update:modelValue", model.value);
  },
});

watch(
  () => model.value,
  () => {
    model.emit();
  },
  { deep: true }
);
</script>
