import { Module } from "../App.js";
import AutoController from "./AutoController.js";
import AutoCar from "./Models/AutoCar.js";
import AutoCarUse from "./Models/AutoCarUse.js";
import AutoDriver from "./Models/AutoDriver.js";

export default class AutoModule extends Module {
  routes(app) {
    app.get("/api/v1/auto", AutoController.test);
  }

  models() {
    return { AutoCar, AutoCarUse, AutoDriver };
  }
}
