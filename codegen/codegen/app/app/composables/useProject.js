import { defineStore } from "pinia";
import _ from "lodash";

export default () => {
  const r = defineStore("useProject", () => {
    return reactive({
      data: JSON.parse(localStorage.getItem("useProject.data") || "{}"),

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
          module: {},
          globals: {},
        };
        return data;
      },

      dataValidate() {
        const deepParse = (data, call, parentPath = "") => {
          if (data !== null && typeof data === "object") {
            for (const key in data) {
              const value = data[key];
              const path = parentPath ? `${parentPath}.${key}` : key;
              data[key] = call(key, value, path);
              deepParse(value, call, path);
            }
          }
        };

        console.clear();
        deepParse(r.data, (key, value, path) => {
          if (path == "module.app") {
            value = {
              name: "",
              version: "0.0.1",
              description: "",
              entity: {},
              route: {},
              ...value,
            };
            console.log({ path, value });
          }

          return value;
        });
      },

      create() {
        r.dataSet(r.dataDefault());
        r.dataValidate();
      },

      open() {
        r.dataSet(JSON.parse(localStorage.getItem("useProject.data") || "{}"));
        r.dataValidate();
      },

      save() {
        localStorage.setItem("useProject.data", JSON.stringify(r.data));
        r.dataValidate();
      },

      jsonItems(attribute, def = {}) {
        const items = Object.entries(_.get(r.data, attribute, def)).map(
          ([attr, data]) => {
            return { attr, data };
          }
        );

        const rr = reactive({
          attribute,
          items,
          add(item) {
            rr.items.push({ attr: "", data: {}, ...item });
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

  r.dataValidate();
  return r;
};
