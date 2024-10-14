import { Module } from "../App.js";
import AppUser from "./Models/AppUser.js";
import { AppUserTest } from "./Tests/AppUserTest.js";
import AppUserController from "./Controllers/AppUserController.js";

export default class AppModule extends Module {
  // routes(app) {
  //   app.crud("/api/v1/user", AppUserController);
  // }

  controllers() {
    return { AppUserController };
  }

  models() {
    return {
      // AppUser,
    };
  }

  tests() {
    return {
      // AppUserTest,
    };
  }
}
