import type { HttpContext } from '@adonisjs/core/http'

import Base from './base.js'

export default class AuthController extends Base {
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
