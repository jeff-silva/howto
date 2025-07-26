<template>
  <v-text-field
    v-model="money.formatted"
    v-mask="'money'"
    @input="money.emit()"
    v-bind="$attrs"
  />
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
});

const f = useFormat();

const money = reactive({
  value:
    (props.modelValue ? props.modelValue.toString() : "").replace(
      /[^0-9]/g,
      ""
    ) / 100,
  formatted: f.money(props.modelValue),
  emit() {
    money.value = money.formatted.replace(/[^0-9]/g, "") / 100;
    emit("update:modelValue", money.value);
  },
});

watch(
  () => props.modelValue,
  (modelValueNew) => {
    money.value =
      (modelValueNew ? modelValueNew.toString() : "").replace(/[^0-9]/g, "") /
      100;
    money.formatted = f.money(modelValueNew);
  }
);
</script>
