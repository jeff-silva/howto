import { defineStore } from "pinia";

export default () => {
  const app = defineStore("useApp", () => {
    return reactive({
      ready: false,

      load: useAxios({
        method: "get",
        url: "/api/app/load",
        onSuccess() {
          app.user = app.load.response.user || null;
        },
      }),

      user: null,

      logout() {
        localStorage.removeItem("access_token");
        setTimeout(() => app.init(), 1000);
      },

      async init() {
        await app.load.submit();
        app.ready = true;
      },
    });
  })();

  return app;
};
