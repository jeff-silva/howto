import { Module } from "../App.js";
import AppController from "./AppController.js";
import AppUser from "./Models/AppUser.js";

export default class AppModule extends Module {
  routes(app) {
    app.get("/api/v1/test", AppController.test);
  }

  models() {
    return { AppUser };
  }
}