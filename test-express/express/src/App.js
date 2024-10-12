import test from "node:test";
import assert from "node:assert";

import express from "express";
import cors from "cors";

import * as Sequelize from "sequelize";

export const SequelizeDataTypes = Sequelize.DataTypes;

export const sequelize = new Sequelize.Sequelize({
  logging: false,
  host: "localhost",
  dialect: "sqlite",
  storage: "database.sqlite",
});

// import configApp from "../config/app.js";

export class App {
  constructor(config = {}) {
    this.config = {
      sequelizeConfig: null,
      ...config,
    };
    this.express = express();
    this.express.use(cors());
    this.express.use(express.json());

    this.express.crud = (path, controller, except = []) => {
      path = path.replace(/\/$/, "");

      if (typeof controller == "function") {
        controller = new controller();
      }

      if (!except.includes("select")) {
        this.express.get(`${path}/:id`, (...args) => {
          return controller.select(...args);
        });
      }

      if (!except.includes("search")) {
        this.express.get(`${path}`, (...args) => {
          return controller.search(...args);
        });
      }

      if (!except.includes("create")) {
        this.express.post(`${path}`, (...args) => {
          return controller.create(...args);
        });
      }

      if (!except.includes("update")) {
        this.express.put(`${path}/:id`, (...args) => {
          return controller.update(...args);
        });
      }

      if (!except.includes("delete")) {
        this.express.delete(`${path}/:id`, (...args) => {
          return controller.delete(...args);
        });
      }
    };

    this.sequelize = sequelize;

    if (
      this.config.sequelizeConfig !== null &&
      typeof this.config.sequelizeConfig == "object"
    ) {
      this.sequelize = new Sequelize.Sequelize({
        logging: false,
        ...this.config.sequelizeConfig,
      });
    }
  }

  async databaseSchema() {
    const options = {
      type: Sequelize.QueryTypes.SELECT,
    };

    let tables = (
      await this.sequelize.query(`SELECT * FROM sqlite_master`, options)
    )
      .filter((table) => table.name != "sqlite_sequence")
      .map((table) => ({ table }));

    for (let i in tables) {
      const item = tables[i];
      item.fields = await this.sequelize.query(
        `PRAGMA table_info(${item.table.name});`,
        options
      );
    }

    return tables;
  }

  async preInit() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    const configApp = (await import("../config/app.js")).default;
    this.modules = configApp.modules.map((module) => new module(this));

    // let tables = await this.databaseSchema();

    // this.sequelize.sync();

    // // Drop tables
    // await Promise.all(
    //   tables.map(async (item) => {
    //     await this.sequelize.query(`drop table ${item.table.name}`);
    //   })
    // );

    // Make tables
    await Promise.all(
      this.modules.map(async (module) => {
        await Promise.all(
          Object.values(module.models()).map(async (model) => {
            // await model.sync({ force: true, alter: true });
            await model.sync();
          })
        );
      })
    );

    // Register controllers
    this.modules.map((module) => {
      Object.values(module.controllers()).map((controller) => {
        new controller().routes(this.express);
      });
    });

    // tables = await this.databaseSchema();
    // tables.map((item) => {
    //   console.log("");
    //   console.log(item.table.name);
    //   item.fields.map((field) => {
    //     console.log(`- ${field.name} ${field.type}`);
    //   });
    // });
    // console.log("");
  }

  async test() {
    await this.preInit();

    let callbacks = [];
    this.modules.map((module) => {
      Object.values(module.tests()).map((moduleTest) => {
        moduleTest = new moduleTest(this);
        Object.getOwnPropertyNames(Object.getPrototypeOf(moduleTest)).map(
          (method) => {
            if (!method.startsWith("test")) return;
            callbacks.push(async () => {
              return await moduleTest[method]({ test, assert });
            });
          }
        );
      });
    });

    await Promise.all(callbacks.map(async (call) => await call()));
  }

  async init() {
    await this.preInit();

    this.express.listen(3000, () => {
      console.log(`App listening on port 3000`);
      console.log(``);

      let index = 1;
      this.express._router.stack.map((layer) => {
        if (layer.route && layer.route.path) {
          const prefix =
            index.toString().padStart(2, "0") +
            " . " +
            Object.keys(layer.route.methods).join(",").padEnd(8, " ");
          console.log(`${prefix} ${layer.route.path}`);
          index++;
        }
      });
    });
  }
}

export class Module {
  constructor(app) {
    this.app = app;
  }

  controllers() {
    return {};
  }

  models() {
    return {};
  }

  tests() {
    return {};
  }
}

export class Model extends Sequelize.Model {
  //
}

export class Controller {
  constructor() {}

  model() {
    return null;
  }

  routes(app) {
    //
  }

  async select(req, res) {
    const model = this.model();
    const entity = await model.findByPk(req.params.id);
    res.json({ entity });
  }

  async search(req, res) {
    const page = parseInt(req.query.page || 1);
    const per_page = parseInt(req.query.per_page || 10);
    const model = this.model();
    const data = await model.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
    });
    const pages = Math.ceil(data.count / per_page);
    res.json({ page, per_page, pages, ...data });
  }

  async create(req, res) {
    const model = this.model();
    const entity = await model.create(req.body);
    res.json({ entity });
  }

  async update(req, res) {
    const model = this.model();
    const entity = await model.findByPk(req.params.id);
    entity.set(req.body);
    res.json({ entity });
  }

  async delete(req, res) {
    const model = this.model();
    const entity = await model.findByPk(req.params.id);
    entity.destroy();
    res.json({ entity });
  }
}

export class Test {
  constructor(app) {
    this.app = app;
  }

  async request(options = {}) {
    options = {
      url: "",
      method: "GET",
      params: {},
      data: {},
      headers: {},
      ...options,
    };

    options.method = options.method.toUpperCase();

    let fetchOptions = {
      method: options.method,
      headers: options.headers,
    };

    fetchOptions.headers["Accept"] = "application/json";
    fetchOptions.headers["Content-Type"] = "application/json";

    if (["PUT", "POST"].includes(options.method)) {
      fetchOptions.body = JSON.stringify(options.data);
    }

    let ret = {};

    try {
      const resp = await fetch(options.url, fetchOptions);
      ret.success = true;
      ret.status = resp.status;
      ret.data = await resp.json();
    } catch (err) {
      ret.success = false;
      ret.error = {
        code: err.code,
        message: err.message,
      };
    }

    return ret;
  }

  async requestTests(description, test, assert, requests = {}) {
    let scope = {};

    const call = async (fn, ...args) => {
      const r = fn(...args);
      if (r instanceof Promise) return await r;
      return r;
    };

    for (let attr in requests) {
      let request = await call(requests[attr], scope);
      scope[attr] = await this.request(request);
      scope[attr]["request"] = request;

      test(`${description} ${attr}`, async (t) => {
        assert.strictEqual(true, scope[attr]["success"]);
      });
    }

    // console.log(JSON.stringify(scope, null, 2));
    return scope;
  }
}
