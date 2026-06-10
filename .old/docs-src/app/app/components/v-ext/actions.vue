<template>
  <div>
    <template v-if="actions.length <= $props.visible">
      <v-defaults-provider :defaults="defaults">
        <div class="d-flex me-2 ga-2">
          <template v-for="o in actions">
            <v-btn v-bind="o" />
          </template>
        </div>
      </v-defaults-provider>
    </template>

    <template v-if="actions.length > $props.visible">
      <v-menu location="start center">
        <template #activator="scope">
          <v-defaults-provider :defaults="defaults">
            <v-btn v-bind="{ ...actions[0], ...scope.props }" />
          </v-defaults-provider>
        </template>

        <v-defaults-provider :defaults="defaults">
          <div class="d-flex me-2 ga-2">
            <template v-for="(o, i) in actions">
              <v-btn
                v-if="i > 0"
                v-bind="o"
              />
            </template>
          </div>
        </v-defaults-provider>
      </v-menu>
    </template>
  </div>
</template>

<script setup>
const $props = defineProps({
  actions: { type: [Function, Array], default: () => [] },
  visible: { type: Number, default: 1 },
});

const actions = computed(() => {
  let items = $props.actions || [];

  if (typeof items == "function") {
    items = items();
  }

  items = items.filter((item) => {
    item.showIf = item.showIf || true;
    if (typeof item.showIf == "function") {
      item.showIf = item.showIf(item);
    }
    return item.showIf;
  });

  if (items.length > $props.visible) {
    items.unshift({
      icon: "mdi-dots-vertical",
    });
  }

  return items;
});

const defaults = {
  VBtn: { elevation: 0, size: "small" },
};
</script>
