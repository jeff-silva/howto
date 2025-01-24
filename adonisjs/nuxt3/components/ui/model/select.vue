<template>
  <v-autocomplete
    :model-value="props.modelValue"
    :items="modelList.response.data"
    item-value="id"
    item-title="name"
    v-bind="$attrs"
    @update:modelValue="
      (value) => {
        emit('update:modelValue', value);
      }
    "
  />
</template>

<script setup>
const props = defineProps({
  model: { type: String, default: null },
  modelValue: { type: [Number, String], default: null },
});

const emit = defineEmits(["update:modelValue"]);

const modelList = useAxios({
  method: "get",
  url: `api://${props.model}`,
  response: { data: [] },
});

modelList.submit();
</script>
