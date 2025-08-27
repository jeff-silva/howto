import { Icon } from "@iconify/vue";
import { h } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vuetify:before-create", ({ vuetifyOptions }) => {
    vuetifyOptions.icons = {
      defaultSet: "iconify",
      sets: {
        iconify: {
          component: (props) => {
            return h(Icon, { icon: props.icon, size: props.size || 24 });
          },
        },
      },
    };
  });

  nuxtApp.hook("vuetify:ready", () => {
    nuxtApp.vueApp.component("icon", Icon);
  });
});
