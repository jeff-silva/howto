import fs from "fs/promises";

import test from "node:test";
import assert from "node:assert";

import express from "express";
import cors from "cors";

import * as Sequelize from "sequelize";

export const Sequelizee = Sequelize;
export const SequelizeDataTypes = Sequelize.DataTypes;

export const sequelize = new Sequelize.Sequelize({
  logging: false,
  host: "localhost",
  dialect: "sqlite",
  storage: "database.sqlite",
  transactionType: "IMMEDIATE",
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

    this.express.use((req, res, next) => {
      res.set(
        "Cache-Control",
        "no-cache, no-store, must-revalidate, max-age=0"
      );
      res.set("Pragma", "no-cache");
      res.set("Expires", 0);
      next();
    });

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
        transactionType: "IMMEDIATE",
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

    // Make tables
    await Promise.all(
      this.modules.map(async (module) => {
        await Promise.all(
          Object.values(module.models()).map(async (model) => {
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
  }

  async install() {
    // await fs.unlink(this.sequelize.options.storage);

    const { total } = (
      await this.sequelize.query(
        `SELECT count(*) as total FROM sqlite_master WHERE type = 'table'`,
        { type: Sequelize.QueryTypes.SELECT }
      )
    ).at(0);

    if (total > 1) return;

    let promises = [];

    // // Drop tables
    // tables.map((item) => {
    //   promises.push(async () => {
    //     try {
    //       const sql = `drop table ${item.table.name}`;
    //       console.log({ sql });
    //       return await this.sequelize.query(sql);
    //     } catch (err) {}
    //   });
    // });

    // Create tables
    promises.push(async () => {
      await this.sequelize.sync({ force: true, alter: true });
      return `create tables`;
    });

    // // Create tables
    // this.modules.map((module) => {
    //   Object.values(module.models()).map((model) => {
    //     promises.push(async () => {
    //       // await sequelize.query("PRAGMA foreign_keys = true;");
    //       // return await model.sync({ force: true, alter: true });
    //       await model.sync();
    //       // await sequelize.query("PRAGMA foreign_keys = false;");
    //       return `table sync: ${model.name}`;
    //     });
    //   });
    // });

    promises.push(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(`wait`);
        }, 2000);
      });
    });

    // Seed tables
    this.modules.map((module) => {
      Object.values(module.models()).map((model) => {
        promises.push(async () => {
          await new model().onSeed();
          return `table seed: ${model.name}`;
        });
      });
    });

    const results = await Promise.all(
      promises.map(async (promise) => {
        return await promise();
      })
    );
    console.log(results);
    // let tables = await this.databaseSchema();
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

    await Promise.all(
      callbacks.map(async (call) => {
        return await call();
      })
    );
  }

  async init() {
    await this.preInit();
    await this.install();

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
  async onSeed() {}
}

export class Controller {
  constructor() {}

  model() {
    return null;
  }

  routes(app) {
    //
  }

  success(req, res, data = {}) {
    res.json({ success: true, ...data });
  }

  error(req, res, err) {
    let data = { error: err.message };
    if (err.constructor.name == "ValidationError") {
      data.errors = {};
      err.errors.map((e) => {
        if (typeof data.errors[e.path] == "undefined") {
          data.errors[e.path] = [];
        }
        data.errors[e.path].push(e.message);
      });
    }
    res.status(500).json({ success: false, status: 500, ...data });
  }

  async select(req, res) {
    const model = this.model();
    const entity = await model.findByPk(req.params.id);
    this.success(req, res, { entity });
  }

  searchInclude() {
    return [];
  }

  async search(req, res) {
    const page = parseInt(req.query.page || 1);
    const per_page = parseInt(req.query.per_page || 10);
    const model = this.model();

    const data = await model.findAndCountAll({
      include: this.searchInclude(),
      offset: (page - 1) * per_page,
      limit: per_page,
    });
    const pages = Math.ceil(data.count / per_page);
    this.success(req, res, { page, per_page, pages, ...data });

    // this.success(
    //   req,
    //   res,
    //   await model.findAll({
    //     include: this.searchInclude(),
    //   })
    // );
  }

  async create(req, res) {
    try {
      const model = this.model();
      let entity = await model.build(req.body);
      await entity.validate();
      entity = await entity.save();
      this.success(req, res, { entity });
    } catch (err) {
      this.error(req, res, err);
    }
  }

  async update(req, res) {
    try {
      const model = this.model();
      const entity = await model.findByPk(req.params.id);
      entity.set(req.body);
      const errors = await entity.validate();
      await entity.save();
      this.success(req, res, { entity });
    } catch (err) {
      this.error(req, res, err);
    }
  }

  async delete(req, res) {
    const model = this.model();
    const entity = await model.findByPk(req.params.id);
    if (entity) {
      entity.destroy();
      this.success(req, res, { entity });
      return;
    }
    this.success(req, res, {});
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
