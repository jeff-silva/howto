import { Controller } from "../../App.js";

export default class AutoDriverController extends Controller {
  routes(app) {
    app.crud("/api/v1/auto_car_driver", AutoDriverController);
  }
}
