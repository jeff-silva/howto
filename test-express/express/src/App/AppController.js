import { Controller } from "../App.js";
import AppUser from "./Models/AppUser.js";

export default class AppController extends Controller {
  static test(req, res) {
    res.json({ aaa: 123 });
  }

  static async userCreate(req, res) {
    // res.json({ user: 123 });
    // res.json(JSON.parse(JSON.stringify(req.body)));
    const user = await AppUser.create(req.body);
    console.log(user.id);
    res.json(user);
  }
}
