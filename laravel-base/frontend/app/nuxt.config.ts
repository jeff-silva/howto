// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  ssr: false,
  modules: [
    ["@nuxt/icon", {}],
    ["@nuxt/scripts", {}],
    ["vuetify-nuxt-module", {}],
    ["@pinia/nuxt", {}],
  ],
});
