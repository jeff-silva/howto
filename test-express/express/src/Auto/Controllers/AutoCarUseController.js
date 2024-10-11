import { Controller } from "../../App.js";
import AutoCarUse from "../Models/AutoCarUse.js";

export default class AutoCarUseController extends Controller {
  model() {
    return AutoCarUse;
  }

  routes(app) {
    app.crud("/api/v1/auto_car_use", AutoCarUseController);
  }
}
