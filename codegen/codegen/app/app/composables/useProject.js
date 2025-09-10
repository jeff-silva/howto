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
        return {
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
      },

      dataValidate() {
        const deepParse = (data, call, parentPath = "", parent = null) => {
          if (data !== null && typeof data === "object") {
            for (const key in data) {
              const value = data[key];
              const path = parentPath ? `${parentPath}.${key}` : key;
              data[key] = call(key, value, path, data);
              deepParse(value, call, path, data);
            }
          }
        };

        const pathMatch = (path, match) => {
          const esc = match
            .split(/\./g)
            .map((part) => {
              if (part === "*") return "([a-zA-Z0-9_]+)";
              return `(${part})`;
            })
            .join("\\.");

          const regex = new RegExp(`^${esc}$`);
          return regex.test(path);
        };

        console.clear();
        deepParse(r.data, (key, value, path, parent) => {
          if (key.match(/\./g)) {
            delete parent[key];
          }

          if (pathMatch(path, "module.*")) {
            value = {
              name: "",
              version: "0.0.1",
              description: "",
              entity: {},
              endpoint: {},
              ...value,
            };
          }

          if (pathMatch(path, "module.*.entity.*")) {
            value = {
              name: "",
              field: {},
              ...value,
            };
          }

          // if (pathMatch(path, "module.*.entity")) {
          //   value = {
          //     name: "",
          //     field: {},
          //     ...value,
          //   };
          // }

          return value;
        });
      },

      create() {
        r.dataSet(r.dataDefault());
        r.dataValidate();
        r.save();
      },

      open() {
        r.dataSet(JSON.parse(localStorage.getItem("useProject.data") || "{}"));
        r.dataValidate();
      },

      save() {
        localStorage.setItem("useProject.data", JSON.stringify(r.data));
        r.dataValidate();
      },

      get(attribute, def = {}) {
        return _.get(r.data, attribute, def);
      },

      getAsList(attribute, def = {}) {
        const raw = _.get(r.data, attribute, def);
        const items = Object.entries(raw).map(([attr, data]) => {
          return { attr, data };
        });

        const rr = reactive({
          attribute,
          raw,
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
            const data = Object.fromEntries(
              items
                .filter((item) => !!item.attr)
                .map((item) => [item.attr, item.data])
            );
            _.set(r.data, attribute, data);
            r.dataValidate();
            rr.raw = data;
          },
        });

        return rr;
      },
    });
  })();

  r.dataValidate();
  return r;
};
