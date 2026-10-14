<template>
  <ui-input v-bind="$attrs">
    <template #default="ctx">
      <input type="text" v-model="scope.value" @input="scope.emit()" />
    </template>
  </ui-input>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
});

const emit = defineEmits([
  'update:modelValue',
])

const scope = reactive({
  value: props.modelValue,
  emit() {
    emit('update:modelValue', scope.value);
  },
});
</script>