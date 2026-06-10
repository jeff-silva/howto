<template>
  <div>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer.show"
        :class="{ 'bg-surface-light': !theme?.current?.value?.dark }"
      >
        <slot
          name="drawer"
          v-bind="slotBind()"
        ></slot>
      </v-navigation-drawer>

      <v-app-bar :class="{ 'bg-surface-light': !theme?.current?.value?.dark }">
        <v-btn
          icon="solar:hamburger-menu-linear"
          class="d-lg-none"
          @click="drawer.toggle()"
        />
        <slot
          name="header"
          v-bind="slotBind()"
        ></slot>
      </v-app-bar>

      <v-main style="height: 100vh">
        <slot
          name="default"
          v-bind="slotBind()"
        ></slot>
      </v-main>
    </v-layout>
  </div>
</template>

<script setup>
import { useTheme } from "vuetify";
const theme = useTheme();

const props = defineProps({
  defaultsProvider: { type: Object, default: () => ({}) },
});

const route = useRoute();

const drawer = reactive({
  show: null,
  toggle() {
    drawer.show = !drawer.show;
  },
});

const slotBind = (merge = {}) => {
  return { title: route.meta.title || null, ...merge };
};
</script>
