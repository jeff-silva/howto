import { Module } from "../App.js";
import AutoCarController from "./Controllers/AutoCarController.js";
import AutoCarUseController from "./Controllers/AutoCarUseController.js";
import AutoController from "./Controllers/AutoController.js";
import AutoDriverController from "./Controllers/AutoDriverController.js";
import AutoCar from "./Models/AutoCar.js";
import AutoCarUse from "./Models/AutoCarUse.js";
import AutoDriver from "./Models/AutoDriver.js";

export default class AutoModule extends Module {
  // routes(app) {
  //   app.get("/api/v1/auto", AutoController.test);
  // }

  controllers() {
    return {
      AutoCarController,
      AutoCarUseController,
      AutoController,
      AutoDriverController,
    };
  }

  models() {
    return { AutoCar, AutoCarUse, AutoDriver };
  }
}
