import { Controller } from "../../App.js";
import AutoCarUse from "../Models/AutoCarUse.js";
import AutoDriver from "../Models/AutoDriver.js";
import AutoCar from "../Models/AutoCar.js";

export default class AutoCarUseController extends Controller {
  model() {
    return AutoCarUse;
  }

  routes(app) {
    app.crud("/api/v1/auto_car_use", this);
  }

  searchInclude() {
    // return [{ model: AutoCar }];
    return [AutoDriver, AutoCar];
    // return "AutoCar";
    // return [];
  }
}
