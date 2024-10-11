import { Module } from "../App.js";
import AutoCarController from "./Controllers/AutoCarController.js";
import AutoCarUseController from "./Controllers/AutoCarUseController.js";
import AutoController from "./Controllers/AutoController.js";
import AutoDriverController from "./Controllers/AutoDriverController.js";
import AutoCar from "./Models/AutoCar.js";
import AutoCarUse from "./Models/AutoCarUse.js";
import AutoDriver from "./Models/AutoDriver.js";
import AutoTest from "./Tests/AutoTest.js";

export default class AutoModule extends Module {
  controllers() {
    return {
      AutoController,
      AutoCarController,
      AutoCarUseController,
      AutoDriverController,
    };
  }

  models() {
    return { AutoCar, AutoCarUse, AutoDriver };
  }

  tests() {
    return { AutoTest };
  }
}
