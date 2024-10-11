import { Controller } from "../../App.js";

export default class AutoCarUseController extends Controller {
  routes(app) {
    app.crud("/api/v1/auto_car_use", AutoCarUseController);
  }
}
