import { Controller } from "../../App.js";
import AutoCar from "../Models/AutoCar.js";

export default class AutoCarController extends Controller {
  model() {
    return AutoCar;
  }

  routes(app) {
    app.crud("/api/v1/auto_car", this);
  }
}
