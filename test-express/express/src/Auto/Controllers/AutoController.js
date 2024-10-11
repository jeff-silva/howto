import { Controller } from "../../App.js";

export default class AutoController extends Controller {
  routes(app) {
    app.get("/api/v1/auto/test", AutoController.test);
  }

  static test(req, res) {
    res.json({ aaa: 123 });
  }
}
