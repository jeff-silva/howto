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
  url: `/api/v1/${$props.entity}`,
  params: { ...$props.params },
});

search.submit();
</script>
