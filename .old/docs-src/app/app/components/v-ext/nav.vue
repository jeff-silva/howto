<template>
  <div :class="`v-nav v-nav--${props.layout}`">
    <v-defaults-provider
      :defaults="{
        VBtn: { rounded: 0 },
      }"
    >
      <!-- Level 0 -->
      <template v-if="props.deep == 0">
        <!-- Horizontal -->
        <div
          class="d-flex ga-1"
          v-if="props.layout == 'horizontal'"
        >
          <template v-for="(_item, i) in nav.items">
            <v-menu v-bind="{ closeOnContentClick: false, ...props.menuBind }">
              <template #activator="bind">
                <v-btn
                  :text="_item.title"
                  class="text-capitalize"
                  v-bind="{
                    variant: props.variant,
                    ...bind.props,
                    ..._item.bind,
                  }"
                />
              </template>

              <v-ext-nav
                v-bind="{ ...props, layout: 'vertical', items: _item.children }"
              />
            </v-menu>
          </template>
        </div>

        <!-- Vertical -->
        <v-ext-nav
          v-else
          v-bind="{ ...props, items, deep: props.deep + 1 }"
          :style="`width:${props.width};`"
        />
      </template>

      <!-- Level 1+ -->
      <template v-else>
        <v-list
          class="bg-surface py-0"
          @update:opened="
            (ev) => {
              // emit('update:opened', ev);
            }
          "
          v-bind="{ variant: 'text', ...props.listBind }"
        >
          <template v-for="(_item, i) in nav.items">
            <template v-if="!isObject(_item)">
              <v-divider />
            </template>

            <template v-else-if="_item.children.length > 0">
              <v-list-group
                v-bind="{ variant: 'text' }"
                :value="_item.id"
              >
                <template #activator="bind">
                  <v-btn
                    :text="_item.title"
                    class="text-capitalize mb-1"
                    block
                    v-bind="{
                      variant: props.variant,
                      ...bind.props,
                      ..._item.bind,
                    }"
                    :style="{ paddingLeft: props.deep * 10 + 'px' }"
                  />
                </template>

                <v-ext-nav
                  v-bind="{
                    ...props,
                    items: _item.children,
                    deep: props.deep + 1,
                  }"
                />
              </v-list-group>
            </template>

            <template v-else>
              <v-btn
                :text="_item.title"
                class="text-capitalize mb-1"
                block
                v-bind="{ variant: props.variant, ..._item.bind }"
                :style="{ paddingLeft: props.deep * 10 + 'px' }"
              />
            </template>
          </template>
        </v-list>
      </template>
    </v-defaults-provider>
  </div>
</template>

<script setup>
import _ from "lodash";

const emit = defineEmits(["update:opened"]);

const props = defineProps({
  items: { type: Array, default: () => [] },
  deep: { type: Number, default: 0 },
  layout: { type: String, default: "vertical" },
  variant: { type: String, default: "text" },
  menuBind: { type: Object, default: () => ({}) },
  listBind: { type: Object, default: () => ({}) },
  width: { type: String, default: "100%" },
  opened: { type: Array, default: () => [] },
});

const isObject = (item) => {
  return _.isPlainObject(item);
};

const nav = reactive({
  opened: [],
  items: [],

  getItem(item) {
    if (!isObject(item)) return item;

    item = {
      id: null,
      title: "",
      to: null,
      icon: null,
      bind: {},
      showIf: () => true,
      children: [],
      ...item,
    };

    if (typeof item.showIf == "function") {
      const show = item.showIf();
      if (!show) return null;
    }

    if (item.children.length > 0) {
      item.bind.appendIcon = "material-symbols:keyboard-arrow-down-rounded";
    }

    if (item.to) item.bind.to = item.to;
    if (item.icon) item.bind.prependIcon = item.icon;
    item.id = item.id || item.bind.to || Math.round(Math.random() * 99999);
    return item;
  },

  getItems(items = []) {
    return items
      .map((item) => {
        return nav.getItem(item);
      })
      .filter((v) => !!v);
  },
});

nav.items = nav.getItems(props.items);
</script>

<style>
.v-nav--vertical .v-btn__content {
  flex-grow: 1;
  justify-content: start;
}
</style>
