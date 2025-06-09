// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxt/ui"],
  ssr: false,
  nitro: {
    devProxy: {
      "/socket.io/": {
        target: "http://localhost:9000",
        ws: true,
      },
    },
  },
});
