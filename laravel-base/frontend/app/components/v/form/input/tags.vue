<template>
  <v-combobox
    v-model="model.value"
    multiple
  >
    <template #selection="{ item, index }">
      <v-chip
        :text="item.title"
        size="small"
        closable
        label
        @click:close="
          () => {
            ctx.item.highlights.splice(index, 1);
          }
        "
      />
    </template>
  </v-combobox>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: Array, default: () => [] },
});

const $emit = defineEmits(["update:modelValue"]);

const model = reactive({
  value: $props.modelValue,
  emit() {
    $emit("update:modelValue", model.value);
  },
});

watch(
  () => $props.modelValue,
  (modelValue) => {
    model.value = modelValue;
  }
);
</script>
