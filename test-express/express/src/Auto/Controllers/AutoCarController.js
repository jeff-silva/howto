import { Controller } from "../../App.js";

export default class AutoCarController extends Controller {
  routes(app) {
    app.crud("/api/v1/auto_car", AutoCarController);
  }
}
