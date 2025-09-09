import { defineStore } from "pinia";

export default () => {
  const r = defineStore("useProject", () => {
    return reactive({
      data: null,

      dataSet(data) {
        r.data = data;
      },

      dataDefault() {
        const data = {
          name: "",
          version: "",
          description: "",
          validations: {
            required: {},
            alphanumeric: {},
            email: { dns: true },
            numeric_range: { min: null, max: null },
            exists: { entity: null, field: null },
          },
          modules: {},
          globals: {},
        };
        return data;
      },

      create() {
        r.dataSet(r.dataDefault());
      },

      open() {
        r.dataSet(JSON.parse(localStorage.getItem("useProject.data") || "{}"));
      },

      save() {
        localStorage.setItem("useProject.data", JSON.stringify(r.data));
      },

      jsonItems(attribute, def = {}) {
        const items = Object.entries(r.data[attribute] || {}).map(
          ([attr, data]) => {
            return { attr, data };
          }
        );

        const rr = reactive({
          items,
          add(item) {
            rr.items.push(item);
            rr.save();
          },
          remove(item) {
            const index = items.indexOf(item);
            rr.items.splice(index, 1);
            rr.save();
          },
          save() {
            r.data[attribute] = Object.fromEntries(
              items.map((item) => [item.attr, item.data])
            );
          },
        });

        return rr;
      },
    });
  })();
  return r;
};
