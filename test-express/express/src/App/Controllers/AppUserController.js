import { Controller } from "../../App.js";
import AppUser from "../Models/AppUser.js";

export default class AppUserController extends Controller {
  model() {
    return AppUser;
  }

  routes(app) {
    app.crud("/api/v1/user", AppUserController);
  }
}
