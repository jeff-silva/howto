<template>
  <div
    class="app-tabs app-tabs__horizontal"
    v-if="props.direction == 'horizontal'"
  >
    <v-tabs
      v-model="tabs.value"
      @update:modelValue="tabs.emit()"
      v-if="tabs.items.length > 1"
      show-arrows
      v-bind="$attrs"
    >
      <template v-for="o in tabs.items">
        <v-tab :value="o.id">{{ o.title }}</v-tab>
      </template>
    </v-tabs>

    <div>
      <slot
        name="top"
        v-bind="scope()"
      ></slot>
      <div class="d-flex">
        <div>
          <slot
            name="start"
            v-bind="scope()"
          ></slot>
        </div>
        <div class="flex-grow-1 overflow-auto">
          <template v-for="o in tabs.items">
            <div
              v-if="o.active"
              class="pa-4"
            >
              <slot
                :name="`tab:${o.id}`"
                v-bind="scope({ item: o })"
              >
                {{ `<template #tab:${o.id}="scope"></template>` }}
              </slot>
            </div>
          </template>
        </div>
        <div>
          <slot
            name="end"
            v-bind="scope()"
          ></slot>
        </div>
      </div>
      <slot
        name="bottom"
        v-bind="scope()"
      ></slot>
    </div>
  </div>

  <div
    class="app-tabs app-tabs__vertical"
    v-if="props.direction == 'vertical'"
  >
    <div class="d-flex ga-3">
      <div
        style="min-width: 200px"
        v-if="tabs.items.length > 1"
      >
        <v-tabs
          v-model="tabs.value"
          @update:modelValue="tabs.emit()"
          direction="vertical"
          show-arrows
          v-bind="$attrs"
        >
          <template v-for="o in tabs.items">
            <v-tab
              :value="o.id"
              :text="o.title || null"
              class="py-3"
            />
          </template>
        </v-tabs>
      </div>
      <div class="flex-grow-1">
        <slot
          name="top"
          v-bind="scope()"
        ></slot>
        <div class="flex-grow-1">
          <template v-for="o in tabs.items">
            <div v-if="o.active">
              <slot
                :name="`tab:${o.id}`"
                v-bind="scope({ item: o })"
              >
                {{ `<template #tab:${o.id}="scope"></template>` }}
              </slot>
            </div>
          </template>
        </div>
        <slot
          name="bottom"
          v-bind="scope()"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  tabs: { type: Object, default: () => ({}) },
  queryVar: { type: String, default: null },
  direction: { type: String, default: "horizontal" },
});

const emit = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();

const tabs = reactive({
  value: props.modelValue || Object.keys(props.tabs).at(0) || null,
  items: computed(() => {
    return Object.entries(props.tabs).map(([id, item]) => {
      item = typeof item == "string" ? { title: item } : item;
      item = { id, ...item };
      item.active = id == tabs.value;
      return item;
    });
  }),
  set(value) {
    tabs.value = value;
  },
  emit() {
    if (props.queryVar) {
      const query = { ...route.query, [props.queryVar]: tabs.value };
      router.push({ query });
    }
    emit("update:modelValue", scope({ tab: tabs.value }));
  },
});

const scope = (merge = {}) => {
  return { tabs, ...merge };
};

defineExpose(scope());
</script>

<style>
.app-tabs__vertical .v-tab {
  height: auto !important;
}
.app-tabs__vertical .v-tab .v-btn__content {
  white-space: initial !important;
}
</style>
