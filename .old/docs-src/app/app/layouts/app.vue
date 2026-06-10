<template>
  <v-ext-layout>
    <template #drawer>
      <v-ext-nav
        :items="[
          { title: 'index', to: '/' },
          {
            title: 'tool',
            children: [
              { title: 'Index', to: '/tool' },
              { title: 'OFX', to: '/tool/ofx' },
              { title: 'Playback Rec', to: '/tool/playback-rec' },
            ],
          },
        ]"
      />
    </template>

    <div class="pa-3">
      <slot></slot>
    </div>
  </v-ext-layout>
</template>
