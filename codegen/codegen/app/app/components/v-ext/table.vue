<template>
  <div>
    <v-data-table-server v-bind="bind">
      <template #item.actions="ctx">
        <v-ext-table-actions :actions="$props.actions(scope(ctx))" />
      </template>
      <template
        v-for="(slotFn, slotName) in $slots"
        #[slotName]="ctx"
      >
        <slot
          :name="slotName"
          v-bind="scope(ctx)"
        >
        </slot>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup>
const $props = defineProps({
  items: { type: Array, default: () => [] },
  headers: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  actions: { type: Function, default: () => [] },
});

const $emit = defineEmits(["update:modelValue"]);

const $slots = useSlots();

const bind = computed(() => {
  const headers = [...$props.headers, { key: "actions", title: "", width: 0 }];
  const itemsLength = $props.items.length;
  return { ...$props, headers, itemsLength };
});

const scope = (merge = {}) => {
  return { ...merge };
};
</script>
