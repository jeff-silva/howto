<template>
  <v-app>
    <div class="d-flex h-100">
      <div
        class="d-none d-lg-block overflow-auto bg-grey-lighten-4 pa-2"
        style="min-width: 300px; height: 100vh"
      >
        <v-list
          bg-color="transparent"
          class="rounded"
        >
          <template v-for="o in navItems">
            <v-list-item v-bind="o" />
          </template>
        </v-list>
      </div>
      <div
        class="flex-grow-1 overflow-auto d-flex flex-column"
        style="height: 100vh"
      >
        <div class="bg-grey-lighten-4 pa-4 d-flex align-center ga-3">
          <v-btn
            class="d-lg-none"
            icon="solar:hamburger-menu-outline"
            variant="text"
            @click="drawer.toggle()"
            size="35"
          />
          <v-spacer />
          <div>User</div>
        </div>
        <div class="flex-grow-1 overflow-auto">
          <slot></slot>
        </div>
      </div>
    </div>

    <v-navigation-drawer
      v-model="drawer.visible"
      class="d-lg-none"
    >
      <v-list
        bg-color="transparent"
        class="rounded"
      >
        <template v-for="o in navItems">
          <v-list-item v-bind="o" />
        </template>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script setup>
const navItems = [
  { title: "Dashboard", to: "/" },
  { title: "Motoristas", to: "/auto_driver" },
  { title: "Veículos", to: "/auto_car" },
  { title: "Utilização de veículos", to: "/auto_car_use" },
];

const drawer = useDialog({ visible: false });
</script>
