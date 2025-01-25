import type { HttpContext } from '@adonisjs/core/http'

import Controller from '#controllers/controller'

export default class AuthController extends Controller {
  async login(http: HttpContext) {
    return {
      test: true,
      params: http.params,
    }
  }

  async logout(http: HttpContext) {
    return {
      test: true,
      params: http.params,
    }
  }

  async register(http: HttpContext) {
    return {
      test: true,
      params: http.params,
    }
  }
}
