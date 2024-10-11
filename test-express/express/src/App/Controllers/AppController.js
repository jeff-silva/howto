import { Controller } from "../../App.js";

export default class AppController extends Controller {
  test(req, res) {
    res.json({ aaa: 123 });
  }
}
