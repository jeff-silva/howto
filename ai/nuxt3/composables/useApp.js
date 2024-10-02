import { useStorage } from "@vueuse/core";

export default () => {
  return reactive({
    access: useStorage("howto-googleai-access", {
      token: "",
    }),
  });
};
