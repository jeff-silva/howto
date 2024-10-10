import { Controller } from "../App.js";

export default class AppController extends Controller {
  static test(req, res) {
    res.json({ aaa: 123 });
  }
}
