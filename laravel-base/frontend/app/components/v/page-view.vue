<template>
  <div v-if="visible.value">
    <slot></slot>
  </div>
</template>

<script setup>
const $props = defineProps({
  query: { type: Object, default: () => ({}) },
});

const $route = useRoute();
console.clear();

const visible = reactive({
  value: true,
  update() {
    let isVisible = false;
    for (const attr in $props.query) {
      const value = $props.query[attr];
      const route = $route.query[attr];
      if (value === route) {
        isVisible = true;
        break;
      }
    }
    visible.value = isVisible;
  },
});

visible.update();

watch(
  () => $route.query,
  () => {
    visible.update();
  }
);
</script>
