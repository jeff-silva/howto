import { Controller } from "../App.js";
import AppUser from "./Models/AppUser.js";

export default class AppController extends Controller {
  static test(req, res) {
    res.json({ aaa: 123 });
  }

  static async userCreate(req, res) {
    // res.json({ user: 123 });
    // res.json(JSON.parse(JSON.stringify(req.body)));
    res.json(await AppUser.create(req.body));
  }

  static async userSearch(req, res) {
    res.json({ test: true });
  }

  static async userFind(req, res) {
    res.json({ test: true });
  }

  static async userUpdate(req, res) {
    res.json({ test: true });
  }

  static async userDelete(req, res) {
    res.json({ test: true });
  }
}
