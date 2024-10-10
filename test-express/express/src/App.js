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

  async init() {
    let tables = await this.databaseSchema();

    // Drop tables
    await Promise.all(
      tables.map(async (item) => {
        await this.sequelize.query(`drop table ${item.table.name}`);
      })
    );

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

    tables = await this.databaseSchema();

    setTimeout(() => {
      tables.map((item) => {
        console.log("");
        console.log(item.table.name);
        item.fields.map((field) => {
          console.log(`- ${field.name} ${field.type}`);
        });
        // console.log(item.fields.map((f) => f.name).join(" | "));
      });
    }, 1000);

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
  //
}

export class Controller {}
