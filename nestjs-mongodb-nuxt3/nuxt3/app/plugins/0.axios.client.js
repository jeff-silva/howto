import axios from "axios";

export default defineNuxtPlugin(async (nuxtApp) => {
  const protocols = {
    "api://": "http://localhost:8000",
  };

  axios.interceptors.request.use((config) => {
    for (let prefix in protocols) {
      if (config.url.startsWith(prefix)) {
        config.url = config.url.replace(prefix, `${protocols[prefix]}/`);
      }
    }

    return config;
  });

  nuxtApp.provide("axios", axios);
});
