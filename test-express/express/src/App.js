import fs from "fs";

import test from "node:test";
import assert from "node:assert";

import express from "express";
import cors from "cors";

import * as Sequelize from "sequelize";

export const SequelizeDataTypes = Sequelize.DataTypes;

export const sequelize = new Sequelize.Sequelize({
  logging: false,
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

    let tables = await this.databaseSchema();

    this.sequelize.sync();

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
            await model.sync({ force: true, alter: true });
          })
        );
      })
    );

    // Routes
    this.modules.map(async (module) => {
      module.routes(this.express);
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
            test.describe(`${moduleTest.constructor.name}.${method}`, () => {
              moduleTest[method].call(moduleTest, { test, assert });
            });
          }
        );
      });
    });
  }

  async init() {
    await this.preInit();

    this.express.listen(3000, () => {
      console.log(`App listening on port 3000`);
    });
  }
}

export class Module {
  constructor(app) {
    this.app = app;
  }

  routes(app) {
    //
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

export class Controller {}

export class Test {
  constructor(app) {
    this.app = app;
  }
}
