<template>
  <div>
    <v-form>
      <slot></slot>
    </v-form>
    <pre>{{ { $props, select } }}</pre>
  </div>
</template>

<script setup>
const $props = defineProps({
  entity: { type: String, default: "" },
  queryId: { type: String, default: "id" },
  params: { type: Object, default: () => ({}) },
  actions: { type: Function, default: () => [] },
});

const $route = useRoute();

const select = useAxios({
  method: "get",
  url: "",
  params: { ...$props.params },
  response: {
    params: {},
    pagination: {
      page: 1,
      total: 0,
      pages: 0,
    },
    data: [],
  },
  update() {
    const id = $route.query[$props.queryId] || null;
    console.log({ id });
    if (id) {
      select.url = `/api/${$props.entity}/${id}`;
      // setTimeout(() => select.submit(), 1000);
      select.submit();
    }
  },
});

const scope = (merge = {}) => {
  return { select, ...merge };
};

select.update();

watch(
  () => $route.query,
  () => {
    select.update();
  }
);
</script>
