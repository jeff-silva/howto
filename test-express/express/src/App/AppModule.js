import { Module } from "../App.js";
import AppController from "./AppController.js";
import AppUser from "./Models/AppUser.js";
import { AppUserTest } from "./Tests/AppUserTest.js";

export default class AppModule extends Module {
  routes(app) {
    app.get("/api/v1/test", AppController.test);

    app.get("/api/v1/user", AppController.userSearch);
    app.post("/api/v1/user", AppController.userCreate);
    app.put("/api/v1/user/:id", AppController.userUpdate);
    app.get("/api/v1/user/:id", AppController.userFind);
    app.delete("/api/v1/user/:id", AppController.userDelete);
  }

  models() {
    return { AppUser };
  }

  tests() {
    return { AppUserTest };
  }
}
