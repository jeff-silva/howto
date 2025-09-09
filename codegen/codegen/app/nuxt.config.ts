// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  modules: [
    ["@nuxt/icon", {}],
    ["@nuxt/image", {}],
    ["@pinia/nuxt", {}],
    ["@nuxt/scripts", {}],
    ["vuetify-nuxt-module", {}],
  ],
});
