import path from "path";
const __dirname = path.resolve(path.dirname(""));

import express from "express";
import cors from "cors";

import { glob } from "glob";

import * as Sequelize from "sequelize";

export const SequelizeDataTypes = Sequelize.DataTypes;

export const sequelize = new Sequelize.Sequelize({
  dialect: "sqlite",
  storage: "../database.sqlite",
});

export class App {
  constructor(modules = []) {
    this.express = express();
    this.express.use(cors());
    this.sequelize = sequelize;
    this.modules = modules.map((module) => new module(this));
  }

  async init() {
    this.modules.map((module) => {
      // Register models
      Object.values(module.models()).map(async (model) => {
        // await model.drop();
        model.sync();
      });

      // Register routes
      module.routes(this.express);
    });

    let schema = Object.fromEntries(
      await Promise.all(
        (
          await this.sequelize.query(`SELECT * FROM sqlite_master`, {
            type: Sequelize.QueryTypes.SELECT,
          })
        ).map(async (table) => {
          return [
            table.name,
            (
              await this.sequelize.query(`PRAGMA table_info(${table.name});`, {
                type: Sequelize.QueryTypes.SELECT,
              })
            )
              .map((field) => field.name)
              .join(" | "),
          ];
        })
      )
    );

    console.log(schema);

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
}

export class Model extends Sequelize.Model {
  // static schema() {
  //   return {};
  // }
  // constructor(...args) {
  //   super(...args);
  //   this.init(this.schema());
  //   console.log("aaa");
  // }
}

export class Controller {}
