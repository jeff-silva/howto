<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-form-input-date
        v-model="model.date"
        @update:model-value="model.emit()"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
      class="ps-2"
    >
      <v-form-input-time
        v-model="model.time"
        @update:model-value="model.emit()"
      />
    </v-col>
  </v-row>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: String, default: null },
});

const $emit = defineEmits(["update:modelValue"]);

const model = reactive({
  date: null,
  time: null,
  init() {
    const [date, time] = ($props.modelValue || "").split(/\s|T/g);
    model.date = date || null;
    model.time = time || null;
  },
  emit() {
    if (!model.date) return;
    const time = model.time || "00:00:00";
    $emit("update:modelValue", `${model.date} ${time}`);
  },
});

model.init();
</script>
