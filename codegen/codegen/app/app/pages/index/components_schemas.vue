<template>
  <div>
    <v-defaults-provider :defaults="{ global: { hideDetails: 'auto' } }">
      <v-row>
        <v-col cols="3">
          <v-list>
            <template v-for="o in schema.items">
              <v-list-item>
                {{ o.name }}
                <template #append>
                  <v-btn
                    text="Edit"
                    @click="schema.edit.set(o)"
                  />
                </template>
              </v-list-item>
            </template>

            <v-list-item>
              <template #append>
                <v-btn
                  text="Add"
                  @click="
                    schema.itemAdd({
                      name: '',
                      data: { type: 'object', properties: {} },
                    })
                  "
                />
              </template>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="9">
          <v-card title="schema">
            <v-card-text class="pa-0">
              <div class="pa-4">
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="schema.edit.value.name" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="x-entity"
                      v-model="schema.edit.value.data['x-entity']"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      label="required"
                      v-model="schema.edit.value.data['required']"
                      :items="Object.keys(schema.edit.value.data.properties)"
                      multiple
                    />
                  </v-col>
                </v-row>
              </div>

              <v-expansion-panels variant="accordion">
                <template v-for="o in schemaProp.items">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      {{ o.name }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-row>
                        <v-col cols="4">
                          <v-text-field
                            label="name"
                            v-model="o.name"
                          />
                        </v-col>

                        <v-col cols="8">
                          <v-text-field
                            label="description"
                            v-model="o.data.description"
                          />
                        </v-col>

                        <v-col cols="4">
                          <v-select
                            label="type"
                            v-model="o.data.type"
                            :items="['boolean', 'integer', 'string']"
                          />
                        </v-col>

                        <v-col
                          cols="4"
                          v-if="['integer'].includes(o.data.type)"
                        >
                          <v-autocomplete
                            label="relation_table_field"
                            v-model="o.data['x-relation']"
                            :items="relationList()"
                          />
                        </v-col>

                        <v-col cols="4">
                          <v-select
                            label="format"
                            v-model="o.data.format"
                            :items="[
                              'int32',
                              'int64',
                              'date',
                              'time',
                              'date-time',
                            ]"
                          />
                        </v-col>

                        <v-col cols="4">
                          <v-text-field
                            label="example"
                            v-model="o.data.example"
                          />
                        </v-col>

                        <v-col
                          cols="4"
                          v-if="['string'].includes(o.data.type)"
                        >
                          <v-combobox
                            label="enum"
                            v-model="o.data.enum"
                            :items="o.data.enum || []"
                            multiple
                          />
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </template>
              </v-expansion-panels>
            </v-card-text>
          </v-card>

          <dump
            v-model="schema.items"
            style="height: 400px"
          />
          <dump
            v-model="schemaProp"
            style="height: 400px"
          />
        </v-col>
      </v-row>
    </v-defaults-provider>
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
    onChange: () => null,
    onItemAdd: () => null,
    onItemRemove: () => null,
    ...opts,
  };

  const r = reactive({
    value: null,
    items: [],

    itemsSet(items) {
      if (items !== null && typeof items == "object" && !Array.isArray(items)) {
        r.items = Object.entries(items || {}).map(([name, data]) => ({
          name,
          data,
        }));
      }
      r.event.dispatch("itemsSet", { items });
      return r.items;
    },

    itemAdd(item = {}) {
      r.items.push(item);
      r.edit.set(item);
      r.event.dispatch("itemAdd", { item });
    },

    itemRemove(item) {
      const index = r.items.indexOf(item);
      r.items.splice(index, 1);
      r.event.dispatch("itemRemove", { index, item });
    },

    // edit(value) {
    //   r.value = opts.onEdit(value);
    // },

    edit: {
      value: null,
      set(value) {
        r.edit.value = value;
        r.event.dispatch("edit.set", { value });
      },
    },

    event: {
      items: [],
      on(names, call) {
        names = Array.isArray(names) ? names : [names];
        names.map((name) => {
          r.event.items.push({ name, call });
        });
      },
      dispatch(name, scope = {}) {
        r.event.items.map((ev) => {
          if (ev.name != name) return;
          scope = { event: name, ...scope };
          ev.call(scope);
          console.log(scope);
        });
      },
    },

    getObject() {
      return Object.fromEntries(r.items.map((o) => [o.name, o.data]));
    },
  });

  r.itemsSet(opts.items);
  r.edit.set(r.items.at(0) || null);

  watch(
    () => r.edit,
    ({ value }) => {
      r.event.dispatch("edit.change", { value });
    },
    { deep: true }
  );
  return r;
};

const schemaProp = useObjectEdit({
  onChange(value) {
    schema.edit.value.data.properties = schemaProp.getObject();
    console.log("schemaProp.onChange", schema.edit.value);
  },
});

schemaProp.event.on("edit.change", (data) => {
  console.log(data);
});

const schema = useObjectEdit({
  items: model.value.components.schemas,
});

schema.event.on(["edit.set", "edit.change"], (scope) => {
  const { value } = scope;
  schemaProp.itemsSet(value.data.properties);
});

const relationList = (except = []) => {
  const items = [];

  for (let table in model.value.components.schemas) {
    const schema = model.value.components.schemas[table];
    if (!schema["x-entity"]) continue;
    for (let attr in schema.properties) {
      const key = `${schema["x-entity"]}.${attr}`;
      if (except.includes(key)) continue;
      items.push(key);
    }
  }

  return items;
};
</script>
