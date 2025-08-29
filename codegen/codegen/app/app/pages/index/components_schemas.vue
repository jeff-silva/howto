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
                    @click="schema.edit(o)"
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
                    <v-text-field v-model="schema.value.name" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="x-entity"
                      v-model="schema.value.data['x-entity']"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      label="required"
                      v-model="schema.value.data['required']"
                      :items="Object.keys(schema.value.data.properties)"
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

          <!-- <dump
            v-model="schemaProp"
            style="height: 400px"
          /> -->
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

    itemAdd(item = {}) {
      r.items.push(item);
      r.save();
      r.edit(item);
    },

    itemRemove(item) {
      const index = r.items.indexOf(item);
      r.items.splice(index, 1);
      r.save();
    },

    edit(value) {
      r.value = opts.onEdit(value);
    },

    getObject() {
      return Object.fromEntries(r.items.map((o) => [o.name, o.data]));
    },
  });

  r.setItems(opts.items);
  r.edit(r.items.at(0) || null);

  watch(
    () => [r.value, r.items],
    (value) => {
      opts.onChange(value);
    },
    { deep: true }
  );
  return r;
};

const schemaProp = useObjectEdit({
  onChange(value) {
    schema.value.data.properties = schemaProp.getObject();
  },
});

const schema = useObjectEdit({
  items: model.value.components.schemas,
  onEdit(value) {
    schemaProp.setItems(value.data.properties);
    return value;
  },
  onChange(value) {
    console.log("schema");
  },
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
