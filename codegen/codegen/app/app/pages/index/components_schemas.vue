<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-list>
          <template v-for="o in schema.items">
            <v-list-item>
              {{ o.name }}
              <template #append>
                <v-btn
                  text="Edit"
                  @click="schema.edit(o)"
                />
              </template>
            </v-list-item>
          </template>
        </v-list>
      </v-col>

      <v-col cols="9">
        <v-text-field v-model="schema.value.name" />
        <div>Properties</div>

        <template v-for="o in schemaProp.items">
          <v-text-field v-model="o.name" />
          <pre>{{ o }}</pre>
        </template>

        <!-- <pre>{{ schema }}</pre> -->
        <pre>{{ schemaProp }}</pre>

        <!-- <template v-for="o in schema.value.data.properties">
          <pre>{{ o }}</pre>
        </template>
        <pre>{{ edit.value }}</pre>
        <v-btn
          text="save"
          @click="schema.save()"
        /> -->
      </v-col>
    </v-row>

    <!-- <pre>{{ schemaProp }}</pre> -->
    <!-- <pre>{{ schema }}</pre> -->
  </div>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const $emit = defineEmits(["update:modelValue"]);

const model = reactive({
  value: $props.modelValue,
  emit() {
    $emit("update:modelValue", model.value);
  },
});

const useObjectEdit = (opts = {}) => {
  opts = {
    items: [],
    onEdit: (value) => value,
    onSave: (value) => value,
    ...opts,
  };

  const r = reactive({
    value: null,
    items: [],

    setItems(items) {
      if (items !== null && typeof items == "object" && !Array.isArray(items)) {
        r.items = Object.entries(items || {}).map(([name, data]) => ({
          name,
          data,
        }));
      }
      return r.items;
    },

    edit(value) {
      r.value = opts.onEdit(value);
    },

    save() {
      const data = Object.fromEntries(r.items.map((o) => [o.name, o.data]));
      return opts.onSave(data);
    },
  });

  r.setItems(opts.items);
  r.edit(r.items.at(0) || null);
  return r;
};

const schemaProp = useObjectEdit();

const schema = useObjectEdit({
  items: model.value.components.schemas,
  // onSave(value) {
  //   console.log(value);
  //   return value;
  // },
  onEdit(value) {
    schemaProp.setItems(value.data.properties);
    return value;
  },
});
</script>
