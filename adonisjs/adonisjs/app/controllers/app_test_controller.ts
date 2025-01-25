import type { HttpContext } from '@adonisjs/core/http'

import Controller from '#controllers/controller'

export default class AppTestController extends Controller {
  async index(http: HttpContext) {
    return {
      test: 123456,
      params: http.params,
    }
  }
}
