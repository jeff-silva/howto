import { Module } from "../App.js";
import AppController from "./AppController.js";
import AppUser from "./Models/AppUser.js";
import { AppUserTest } from "./Tests/AppUserTest.js";

export default class AppModule extends Module {
  routes(app) {
    app.get("/api/v1/test", AppController.test);
    app.post("/api/v1/user", AppController.userCreate);
  }

  models() {
    return { AppUser };
  }

  tests() {
    return { AppUserTest };
  }
}
