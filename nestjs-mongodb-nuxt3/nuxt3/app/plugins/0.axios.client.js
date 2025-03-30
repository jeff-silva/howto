import axios from "axios";

export default defineNuxtPlugin(async (nuxtApp) => {
  const protocols = {
    "api://": {
      baseUrl: "http://localhost:8000",
      tokenField: "api_token",
    },
  };

  axios.interceptors.request.use((config) => {
    for (let prefix in protocols) {
      const protocol = protocols[prefix];
      if (config.url.startsWith(prefix)) {
        config.url = config.url.replace(prefix, `${protocol.baseUrl}/`);
      }
    }

    for (let prefix in protocols) {
      const protocol = protocols[prefix];
      if (config.url.startsWith(protocol.baseUrl)) {
        const token = localStorage.getItem(protocol.tokenField);
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  nuxtApp.provide("axios", axios);
});
