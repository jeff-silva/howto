import { defineStore } from "pinia";
import _ from "lodash";

export default () => {
  const r = defineStore("useApp", () => {
    return reactive({
      title: {
        value: "Codegen",
        set(value) {
          document.title = r.title.value = value;
        },
      },

      nav2: {
        items: [],
        set(items) {
          r.nav2.items = items;
        },
        add(item) {
          r.nav2.items.push(item);
        },
      },

      breadcrumb: {
        items: [],
        set(items) {
          r.breadcrumb.items = items;
        },
      },

      actions: {
        items: [],
        set(items) {
          r.actions.items = items;
        },
      },
    });
  })();

  return r;
};
