<template>
  <div class="d-flex flex-wrap justify-end ga-3">
    <template v-for="o in actions()">
      <v-btn v-bind="o" />
      <!-- <v-btn v-bind="o" v-tooltip="o.icon ? { text: o.text, location: 'top center' } : { openOnHover: false }" /> -->
    </template>
  </div>
</template>

<script setup>
const $props = defineProps({
  actions: { type: [Function, Array], default: () => [] },
});

const actions = () => {
  let items = $props.actions || [];
  if (typeof items == "function") {
    items = items(scope());
  }
  return items.filter((item) => {
    item.showIf = item.showIf || true;
    if (typeof item.showIf == "function") {
      item.showIf = item.showIf(scope({ item }));
    }
    return item.showIf;
  });
};

const scope = (merge = {}) => {
  return { document, window, ...merge };
};
</script>
