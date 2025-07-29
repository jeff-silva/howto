import { h } from "vue";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["@/app.scss"],
  ssr: false,
  modules: [
    ["@nuxt/icon", {}],
    ["@nuxt/scripts", {}],
    ["@pinia/nuxt", {}],
    ["vuetify-nuxt-module", {}],
  ],
});
