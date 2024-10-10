import { App } from "./src/App.js";
const app = new App({
  sequelizeConfig: {
    dialect: "sqlite",
    storage: "../database_test.sqlite",
  },
});
app.test();
