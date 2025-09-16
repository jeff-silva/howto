import { defineStore } from "pinia";

export default () => {
  const app = defineStore("useOpenapi", () => {
    return reactive({
      async load() {
        const { data } = await useFetch("/api/openapi");
        app.value = data.value;
      },
      async save() {
        const result = await useFetch("/api/openapi", {
          method: "POST",
          body: { openapi: app.value },
        });
        console.log(result);
      },
      value: {},
    });
  })();

  return app;
};
