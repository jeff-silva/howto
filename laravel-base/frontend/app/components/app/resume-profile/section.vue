<template>
  <div class="d-flex flex-column ga-4">
    <v-card color="grey-lighten-3">
      <v-card-title>{{ $props.name }} ({{ items.value.length }})</v-card-title>
    </v-card>

    <template v-for="o in items.value">
      <v-card
        :title="items.titleField(o)"
        :style="{ opacity: o.meta.active ? 1 : 0.5 }"
        color="grey-lighten-3"
      >
        <v-card-text>
          <slot
            name="item"
            v-bind="scope({ item: o })"
          ></slot>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-form-actions
            :actions="[
              {
                text: o.meta.active ? 'Desativar' : 'Ativar',
                class: 'bg-warning',
                onClick() {
                  o.meta.active = !o.meta.active;
                },
              },
              {
                text: 'Deletar',
                class: 'bg-error',
                onClick() {
                  items.remove(o);
                },
              },
            ]"
          />
        </v-card-actions>
      </v-card>
    </template>

    <v-card color="grey-lighten-3">
      <v-card-actions class="justify-end">
        <v-form-actions
          :actions="[
            {
              text: 'Inserir',
              class: 'bg-primary',
              onClick() {
                items.add();
              },
            },
          ]"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: Array, default: () => [] },
  name: { type: String, default: "" },
  default: { type: Object, default: () => ({}) },
  titleField: { type: [String, Function], default: "name" },
});

const $emit = defineEmits(["update:modelValue"]);

const items = reactive({
  value: $props.modelValue,
  uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  add() {
    const item = { ...$props.default };
    item.meta = {};
    item.meta.uuid = items.uuid();
    item.meta.active = true;
    items.value.push(item);
    items.emit();
  },
  remove(item) {
    const index = items.value.indexOf(item);
    items.value.splice(index, 1);
    items.emit();
  },
  emit() {
    $emit("update:modelValue", items.value);
  },
  titleField(o) {
    if (!$props.titleField) return o.meta.uuid;
    if (typeof $props.titleField == "string" && o[$props.titleField]) {
      return o[$props.titleField];
    } else if (typeof $props.titleField == "function") {
      return $props.titleField(o);
    }
    return o.meta.uuid;
  },
});

const scope = (merge = {}) => {
  return { items, ...merge };
};

watch(
  () => $props.modelValue,
  (modelValue) => {
    items.value = modelValue;
  }
);
</script>
