<template>
  <div style="position: relative; font: 13px 'Courier New', Courier, monospace">
    <template v-if="type == 'null'">
      <div :class="codeClass">{{ type }}</div>
    </template>

    <template v-if="type == 'boolean'">
      <div :class="codeClass">{{ type }}: {{ $props.modelValue }}</div>
    </template>

    <template v-if="type == 'number'">
      <div :class="codeClass">{{ type }}: {{ $props.modelValue }}</div>
    </template>

    <template v-if="type == 'string'">
      <div :class="codeClass">{{ type }}: {{ $props.modelValue }}</div>
    </template>

    <template v-if="type == 'array'">
      <pre
        :class="codeClass"
        style="height: 100%; overflow: auto"
        >{{ type }} ({{ $props.modelValue.length }}): {{
          $props.modelValue
        }}</pre
      >
    </template>

    <template v-if="type == 'object'">
      <div
        :class="codeClass + ' d-flex ga-3'"
        style="height: 100%"
      >
        <div style="height: 100%; overflow: auto">
          <template v-for="(o, attr) in $props.modelValue">
            <div>{{ typeof $props.modelValue[attr] }}: {{ attr }}</div>
          </template>
        </div>
        <pre
          class="flex-grow-1"
          style="height: 100%; overflow: auto"
          >{{ type }}: {{ $props.modelValue }}</pre
        >
      </div>
    </template>

    <template v-if="type == 'function'">
      <pre :class="codeClass"
        >{{ type }}: {{ $props.modelValue.toString() }}</pre
      >
    </template>
  </div>
</template>

<script setup>
const $props = defineProps({
  modelValue: {
    type: [Boolean, Number, String, Array, Object, Function],
    default: null,
  },
});

const type = computed(() => {
  const value = $props.modelValue;
  let type = typeof value;

  if (type == "object") {
    if (value === null) type = "null";
    else if (Array.isArray(value)) type = "array";
    else if (typeof value == "object") return "object";
  }

  return type;
});

const codeClass = "bg-blue-grey-darken-4 pa-2 rounded d-flex ga-3";
</script>
