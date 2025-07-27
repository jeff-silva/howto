<template>
  <v-form
    @submit.prevent="save.submit()"
    :disabled="find.busy"
  >
    <slot v-bind="scope()"></slot>
  </v-form>
</template>

<script setup>
const $props = defineProps({
  entity: { type: String, default: "" },
  queryId: { type: String, default: "id" },
  params: { type: Object, default: () => ({}) },
  actions: { type: Function, default: () => [] },
});

const $emit = defineEmits(["init"]);

const $route = useRoute();
const $router = useRouter();

const data = reactive({
  fill(fill = {}) {
    for (const attr in fill) {
      if (typeof fill[attr] == "function") continue;
      data[attr] = fill[attr];
    }
  },
});

const find = useAxios({
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
    if (id) {
      find.url = `/api/${$props.entity}/${id}`;
      find.submit();
    }
  },
  onSuccess() {
    data.fill(find.response.entity);
    $emit("init", scope());
  },
});

const save = useAxios({
  method: "post",
  url: `/api/${$props.entity}`,
  onSubmit() {
    save.data = data;
    save.method = "post";
    save.url = `/api/${$props.entity}`;
    if (data.id) {
      save.method = "put";
      save.url = `/api/${$props.entity}/${data.id}`;
    }
  },
  onSuccess() {
    const query = { ...$route.query, id: save.response.entity.id };
    $router.push({ query });
    data.fill(save.response.entity);
  },
});

const scope = (merge = {}) => {
  return { data, find, save, ...merge };
};

find.update();
$emit("init", scope());

watch(
  () => $route.query,
  () => {
    find.update();
  }
);
</script>
