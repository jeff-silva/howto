<template>
  <div>
    <pre class="bg-indigo-darken-4">{{ schema }}</pre>
  </div>
</template>

<script setup>
// console.clear();
// console.log(schema);
</script>

<script>
import _ from "lodash";

const jsonMap = (obj, call) => {
  return Object.fromEntries(Object.entries(obj).map(call));
};

const helpers = {
  isObject(data) {
    return data !== null && typeof data === "object" && !Array.isArray(data);
  },
  forceObject(data, def = {}) {
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return def;
    }
    return data;
  },
};

export const schemaFormat = (schema) => {
  schema = {
    name: "",
    version: "",
    description: "",
    validations: {},
    modules: {},
    ...schema,
  };

  schema.modules = jsonMap(schema.modules, ([name, mod]) => {
    mod = {
      name: "",
      description: "",
      version: "",
      entities: {},
      ...mod,
    };

    mod.entities = jsonMap(mod.entities, ([name, entity]) => {
      entity = {
        description: "",
        fields: {},
        ...entity,
      };

      entity.fields = jsonMap(entity.fields, ([name, field]) => {
        field = {
          pk: false,
          type: "string",
          description: "",
          nullable: false,
          default: null,
          ...field,
        };

        field.relations = helpers.forceObject(field.relations, {});
        field.relations = jsonMap(field.relations, ([relName, relData]) => {
          relData = {
            type: "many-to-one",
            entity: "",
            field: "",
            ...relData,
          };
          return [relName, relData];
        });

        return [name, field];
      });

      return [name, entity];
    });

    return [name, mod];
  });

  return _.mergeWith({}, schema, (objValue, srcValue) => {
    if (_.isObject(srcValue)) {
      if (_.isObject(srcValue._extends)) {
        const _extends = srcValue._extends;
        delete srcValue._extends;
        for (const extName in _extends) {
          const extMerge = _.get(schema, extName, {});
          const extOpts = {
            except: [],
            only: [],
            ..._extends[extName],
          };
          for (const attrName in extMerge) {
            if (extOpts.only.length && !extOpts.only.includes(attrName)) {
              delete extMerge[attrName];
            }
            if (extOpts.except.includes(attrName)) {
              delete extMerge[attrName];
            }
          }
          _.merge(srcValue, extMerge);
        }
      }
    }
  });
};
export const schema = schemaFormat({
  version: "0.0.1",
  name: "App Name",
  validations: {
    required: {},
    alphanumeric: {},
    email: { dns: true },
    numeric_range: { min: null, max: null },
    exists: { entity: null, field: null },
  },
  modules: {
    app: {
      name: "Base module",
      version: "0.0.1",
      entities: {
        app_user: {
          description: "Users",
          fields: {
            id: {
              type: "integer",
              pk: true,
              description: "ID",
            },
            name: { type: "string" },
            email: {
              type: "string",
              validations: { email: { dns: true } },
            },
            password: {
              type: "string",
              validations: {
                alphanumeric: {},
                numeric_range: { min: 16 },
              },
            },
            group_id: {
              type: "integer",
              relations: {
                app_user_group: {
                  entity: "app_user_group",
                  field: "id",
                },
              },
            },
            created_at: {
              type: "datetime",
            },
            updated_at: {
              type: "datetime",
            },
            deleted_at: {
              type: "datetime",
            },
          },
        },
        app_user_group: {
          fields: {
            id: {},
            name: {},
            permissions: { type: "json", default: [] },
            created_at: {
              type: "datetime",
            },
            updated_at: {
              type: "datetime",
            },
            deleted_at: {
              type: "datetime",
            },
          },
        },
        app_file: {},
        app_place: {},
        app_config: {},
      },
      endpoints: {
        "auth.register": {
          url: "/api/v1/auth/register",
          method: "post",
          data: {
            _extends: {
              "modules.app.entities.app_user.fields": {
                except: [
                  "id",
                  "group_id",
                  "created_at",
                  "updated_at",
                  "deleted_at",
                ],
              },
            },
          },
        },
        "app_user.create": {
          url: "/api/v1/app_user",
          method: "post",
          data: {
            _extends: {
              "modules.app.entities.app_user.fields": {
                except: ["id", "created_at", "updated_at", "deleted_at"],
              },
            },
          },
        },
        "app_user.update": {
          url: "/api/v1/app_user/{id}",
          method: "put",
          data: {
            _extends: {
              "modules.app.entities.app_user.fields": {
                except: ["id", "created_at", "updated_at", "deleted_at"],
              },
            },
          },
        },
        "app_user.select": {
          url: "/api/v1/app_user/{id}",
          method: "get",
        },
        "app_user.search": {
          url: "/api/v1/app_user",
          method: "get",
        },
        "app_user.delete": {
          url: "/api/v1/app_user/{id}",
          method: "delete",
        },
        "app_user_group.create": {
          url: "/api/v1/app_user_group",
          method: "post",
        },
        "app_user_group.update": {
          url: "/api/v1/app_user_group/{id}",
          method: "put",
        },
        "app_user_group.select": {
          url: "/api/v1/app_user_group/{id}",
          method: "get",
        },
        "app_user_group.search": {
          url: "/api/v1/app_user_group",
          method: "get",
        },
        "app_user_group.delete": {
          url: "/api/v1/app_user_group/{id}",
          method: "delete",
        },
        "app_file.create": {
          url: "/api/v1/app_file",
          method: "post",
        },
        "app_file.delete": {
          url: "/api/v1/app_file/{id}",
          method: "delete",
        },
        "app_config.get": {
          url: "/api/v1/app_config",
          method: "get",
        },
        "app_config.set": {
          url: "/api/v1/app_config",
          method: "post",
          data: {},
        },
      },
    },
    shop: {
      name: "E-commerce module",
      version: "0.0.1",
      depends_on: ["app"],
      entities: {
        shop_category: {},
        shop_product: {},
        shop_product_category: {},
        shop_order: {},
        shop_order_item: {},
      },
      endpoints: {
        "shop_category.create": {
          url: "/api/v1/shop_category",
          method: "post",
        },
        "shop_category.update": {
          url: "/api/v1/shop_category/{id}",
          method: "put",
        },
        "shop_category.search": {
          url: "/api/v1/shop_category",
          method: "get",
        },
        "shop_category.select": {
          url: "/api/v1/shop_category/{id}",
          method: "get",
        },
        "shop_category.delete": {
          url: "/api/v1/shop_category/{id}",
          method: "delete",
        },
        "shop_product.create": {
          url: "/api/v1/shop_product",
          method: "post",
        },
        "shop_product.update": {
          url: "/api/v1/shop_product/{id}",
          method: "put",
        },
        "shop_product.search": {
          url: "/api/v1/shop_product",
          method: "get",
        },
        "shop_product.select": {
          url: "/api/v1/shop_product/{id}",
          method: "get",
        },
        "shop_product.delete": {
          url: "/api/v1/shop_product/{id}",
          method: "delete",
        },
        "shop_product_category.add": {
          url: "/api/v1/shop_product_category",
          method: "post",
          params: {
            product_id: {
              type: "integer",
              default: null,
              validations: { required: {} },
            },
            category_id: {
              type: "integer",
              default: null,
              validations: { required: {} },
            },
          },
        },
        "shop_product_category.delete": {
          url: "/api/v1/shop_product_category/{id}",
          method: "delete",
        },
      },
    },
  },
});
</script>
