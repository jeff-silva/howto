import { defineStore } from "pinia";
import _ from "lodash";

export default () => {
  const r = defineStore("useProject", () => {
    return reactive({
      data: null,

      dataSet(data) {
        r.data = data;
      },

      dataDefault() {
        return {
          name: "",
          version: "",
          description: "",
          updated_at: "",
          global: {
            validation: {
              required: {},
              alphanumeric: {},
              email: { dns: true },
              numeric_range: { min: null, max: null },
              exists: { entity: null, field: null },
            },
          },
          module: {},
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

        deepParse(r.data, (key, value, path, parent) => {
          if (key.match(/\./g)) {
            delete parent[key];
          }

          if (pathMatch(path, "module.*")) {
            value = {
              name: "",
              version: "0.0.1",
              description: "",
              depends_on: [],
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

          if (pathMatch(path, "module.*.entity.*.field.*")) {
            value = {
              name: "",
              type: "string",
              nullable: false,
              default: null,
              relation: { entity: "", field: "" },
              ...value,
            };
          }

          return value;
        });
      },

      create() {
        r.dataSet(r.dataDefault());
        r.dataValidate();
        r.save();
      },

      fs: {
        handle: null,
      },

      async open() {
        if (!r.fs.handle) {
          const [handle] = await window.showOpenFilePicker({
            types: [
              {
                description: "Arquivos JSON",
                accept: { "application/json": [".json"] },
              },
            ],
          });

          r.fs.handle = handle;
        }

        const file = await r.fs.handle.getFile();
        try {
          r.data = JSON.parse((await file.text()) || "{}");
        } catch (err) {}

        r.dataValidate();
      },

      async save() {
        r.dataValidate();
        r.data.updated_at = new Date().toISOString();

        if (!r.fs.handle) {
          r.fs.handle = await window.showSaveFilePicker({
            suggestedName: "schema.json",
            types: [
              {
                description: "Arquivos JSON",
                accept: { "application/json": [".json"] },
              },
            ],
          });
        }

        const writable = await r.fs.handle.createWritable();
        await writable.write(JSON.stringify(r.data));
        // await writable.write(JSON.stringify(r.data, null, 2));
        await writable.close();
      },

      get(attribute, def = {}) {
        return _.get(r.data, attribute, def);
      },

      getAsList(attribute, def = {}) {
        const rr = reactive({
          attribute,
          raw: {},
          items: [],

          init() {
            rr.raw = _.get(r.data, attribute, def);
            rr.items = Object.entries(rr.raw).map(([attr, data]) => {
              return { attr, data };
            });
          },

          add(item) {
            rr.items.push({ attr: "", data: {}, ...item });
            rr.save();
          },

          remove(item) {
            const index = rr.items.indexOf(item);
            rr.items.splice(index, 1);
            rr.save();
          },

          save() {
            const data = Object.fromEntries(
              rr.items
                .filter((item) => !!item.attr)
                .map((item) => [item.attr, item.data])
            );

            _.set(r.data, attribute, data);
            r.dataValidate();
            rr.raw = data;
          },
        });

        rr.init();

        watch(
          () => r.data[attribute],
          () => {
            console.log("getAsList.init watch");
            rr.init();
          },
          { deep: true }
        );

        return rr;
      },

      fieldTypes() {
        return {
          string: "Texto",
          text: "Texto Longo",
          integer: "Número Inteiro",
          float: "Número Decimal",
          boolean: "Booleano",
          date: "Data",
          time: "Hora",
          datetime: "Data e Hora",
          json: "JSON",
          relation: "Relacionamento",
        };
      },

      moduleList() {
        return Object.entries(r.data.module).map(([slug, data]) => ({
          path: `module.${slug}`,
          slug,
          data,
        }));
      },

      entityList() {
        const items = [];
        this.moduleList().map((mod) => {
          for (const slug in mod.data.entity) {
            const path = `module.${mod.slug}.entity.${slug}`;
            const data = mod.data.entity[slug];
            items.push({ path, slug, data, module: mod });
          }
        });
        return items;
      },

      entityFieldList() {
        const items = [];
        this.entityList().map((entity) => {
          for (const slug in entity.data.field) {
            const path = `module.${entity.module.slug}.entity.${entity.slug}.field.${slug}`;
            const data = entity.data.field[slug];
            items.push({ path, slug, data, entity });
          }
        });
        return items;
      },
    });
  })();

  if (r.data === null) {
    r.data = r.dataDefault();
  }

  r.dataValidate();
  return r;
};
