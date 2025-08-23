// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    public: {
      OPENROUTER_KEY: process.env.OPENROUTER_KEY,
    },
  },
});
