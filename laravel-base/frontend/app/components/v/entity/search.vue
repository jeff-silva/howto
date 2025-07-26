<template>
  <div>
    <v-data-table-server
      v-model:items-per-page="search.params.per_page"
      :headers="[...$props.headers, { key: 'actions', title: '', width: 0 }]"
      :items="search?.response?.data || []"
      :items-length="search.response?.pagination?.total || 1"
      :loading="search.busy"
      item-value="name"
    >
      <template #item.actions="ctx">
        <v-table-actions :actions="$props.actions(scope({ item: ctx.item }))" />
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
const $props = defineProps({
  entity: { type: String, default: "" },
  params: { type: Object, default: () => ({}) },
  headers: { type: Array, default: () => [] },
  actions: { type: Function, default: () => [] },
});

const search = useAxios({
  method: "get",
  url: `/api/${$props.entity}`,
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
});

const scope = (merge = {}) => {
  return { search, ...merge };
};

search.submit();
</script>
