<template>
  <div>
    <pre>{{ { $props, search } }}</pre>
  </div>
</template>

<script setup>
const $props = defineProps({
  entity: { type: String, default: "" },
  params: { type: Object, default: () => ({}) },
});

const search = useAxios({
  method: "get",
  url: `/api/${$props.entity}`,
  params: { ...$props.params },
});

search.submit();
</script>
