import { Controller } from "../../App.js";

export default class AutoController extends Controller {
  static test(req, res) {
    res.json({ aaa: 123 });
  }
}
