// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,

  runtimeConfig: {
    public: {
      SERVICE_APP_ENV: process.env.SERVICE_APP_ENV,
      SERVICE_APP_URL: process.env.SERVICE_APP_URL,
      SERVICE_SUPABASE_URL: process.env.SERVICE_SUPABASE_URL,
      SERVICE_SUPABASE_ANON_KEY: process.env.SERVICE_SUPABASE_ANON_KEY,
    },
  },

  modules: [
    ["@nuxt/icon", {}],
    ["@nuxt/scripts", {}],
    ["@nuxtjs/tailwindcss", {}],
  ],

  app: {
    head: {
      htmlAttrs: { "data-theme": "dark", class: "dark" },
      link: [
        {
          key: "daisyui",
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/daisyui@5",
        },
      ],
    },
  },
});
