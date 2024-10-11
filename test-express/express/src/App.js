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
        this.express.get(`${path}/:id`, controller.select);
      }

      if (!except.includes("search")) {
        this.express.get(`${path}`, controller.search);
      }

      if (!except.includes("create")) {
        this.express.post(`${path}`, controller.create);
      }

      if (!except.includes("update")) {
        this.express.put(`${path}/:id`, controller.update);
      }

      if (!except.includes("delete")) {
        this.express.delete(`${path}/:id`, controller.delete);
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

    // const configApp = (await import("../config/app.js")).default;
    // this.modules = configApp.modules.map((module) => new module(this));

    this.modules.map((module) => {
      Object.values(module.tests()).map((moduleTest) => {
        moduleTest = new moduleTest(this);
        Object.getOwnPropertyNames(Object.getPrototypeOf(moduleTest)).map(
          (method) => {
            if (!method.startsWith("test")) return;
            moduleTest[method].call(moduleTest, { test, assert });
            // test.describe(`${moduleTest.constructor.name}.${method}`, () => {
            //   moduleTest[method].call(moduleTest, { test, assert });
            // });
          }
        );
      });
    });
  }

  async init() {
    await this.preInit();

    this.express.listen(3000, () => {
      console.log(`App listening on port 3000`);
      console.log(``);

      this.express._router.stack.map((layer) => {
        if (layer.route && layer.route.path) {
          const prefix = Object.keys(layer.route.methods)
            .join(",")
            .padEnd(8, " ");
          console.log(`${prefix} ${layer.route.path}`);
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
    // const model = this.model();
    // const entity = await model.findByPk(req.params.id);
    // res.json({ entity });
    res.json({ test: true });
  }

  async search(req, res) {
    // const model = this.model();
    // const data = await model.findAll();
    // res.json({ data });
    res.json({ test: true });
  }

  async create(req, res) {
    // const model = this.model();
    console.log("this", this);
    res.json({ test: true });
    // const entity = await model.create(req.body);
    // res.json({ entity });
  }

  async update(req, res) {
    // const model = this.model();
    // const entity = await model.findByPk(req.params.id);
    // entity.set(req.body);
    // res.json({ entity });
    res.json({ test: true });
  }

  async delete(req, res) {
    // const model = this.model();
    // const entity = await model.findByPk(req.params.id);
    // entity.destroy();
    // res.json({ entity });
    res.json({ test: true });
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

    if (["PUT", "POST"].includes(options.method)) {
      fetchOptions.body = JSON.stringify(options.data);
      fetchOptions.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      };
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

  async crud(options = {}) {
    options = {
      create: (scope) => ({}),
      update: (scope) => ({}),
      delete: (scope) => ({}),
      ...options,
    };

    let scope = {};
    scope.create = await this.request(await options.create(scope));
    // scope.update = await this.request(await options.update(scope));
    // scope.delete = await this.request(await options.delete(scope));

    console.log(JSON.stringify(scope, null, 2));

    return {
      // create: !!scope.create.data.entity.id,
      // update: !!scope.update.data.entity.id,
      // delete: !!scope.delete.data.entity.id,
    };
  }
}
