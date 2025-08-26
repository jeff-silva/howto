<template>
  <v-app-layout>
    <template #drawer>
      <v-nav
        :items="[
          { title: 'index', to: '/' },
          {
            title: 'tool',
            children: [
              { title: 'Index', to: '/tool' },
              { title: 'OFX', to: '/tool/ofx' },
            ],
          },
          // { title: '/test', to: '/test' },
        ]"
      />
    </template>

    <div class="pa-3">
      <slot></slot>
    </div>
  </v-app-layout>
</template>
