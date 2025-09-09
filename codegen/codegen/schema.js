export default {
  version: "0.0.1",
  name: "App Name",
  global: {
    validations: {
      required: {},
      alphanumeric: {},
      email: { dns: true },
      numeric_range: { min: null, max: null },
      exists: { entity: null, field: null },
    },
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
              validations: [{ rule: "email", dns: true }],
            },
            password: {
              type: "string",
              validations: [
                { rule: "alphanumeric" },
                { rule: "numeric_range", min: 16 },
              ],
            },
            group_id: {
              type: "integer",
              relation: { entity: "app_user_group", field: "id" },
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
          data_extends: {
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
        "app_user.create": {
          url: "/api/v1/app_user",
          method: "post",
          data_extends: {
            "modules.app.entities.app_user.fields": {
              except: ["id", "created_at", "updated_at", "deleted_at"],
            },
          },
        },
        "app_user.update": {
          url: "/api/v1/app_user/{id}",
          method: "put",
          data_extends: {
            "modules.app.entities.app_user.fields": {
              except: ["id", "created_at", "updated_at", "deleted_at"],
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
              validations: [{ rule: "required" }],
            },
            category_id: {
              type: "integer",
              default: null,
              validations: [{ rule: "required" }],
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
};
