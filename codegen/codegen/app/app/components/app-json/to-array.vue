<template>
  <div>
    <slot
      name="default"
      v-bind="scope({})"
    ></slot>
    <pre>{{ $props.modelValue }}</pre>
  </div>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const $emit = defineEmits(["update:modelValue"]);

const model = reactive({
  canInit: true,
  items: [],

  init() {
    model.items = Object.entries($props.modelValue).map(([_key, _value]) => {
      return { _key, _value };
    });
  },

  emit(config = {}) {
    config = {
      canInit: true,
      ...config,
    };
    model.canInit = config.canInit;
    const modelValue = Object.fromEntries(
      model.items
        .filter((item) => !!item._key)
        .map((item) => [item._key, item._value])
    );
    $emit("update:modelValue", modelValue);
  },

  uid(prefix = "") {
    return Math.random().toString(36).substr(2, 5) + Date.now().toString(36);
  },

  add(item = {}) {
    const _key = model.uid();
    item = { _key, _value: {}, ...item };
    model.items.push(item);
    model.emit();
    return { item };
  },

  remove(item) {
    const index = model.items.indexOf(item);
    model.items.splice(index, 1);
    model.emit();
    return { index, item };
  },
});

model.init();

const scope = (merge = {}) => {
  return { model, ...merge };
};

watch(
  () => $props.modelValue,
  () => {
    if (model.canInit) model.init();
  }
);

watch(
  () => model.items,
  () => {
    model.emit({ canInit: false });
  },
  { deep: true }
);
</script>
