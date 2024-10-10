import BaseController from './BaseController.js';

export default class AppController extends BaseController {
  static test(req, res) {
    res.json({ test: true });
  }
}
