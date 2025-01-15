import type { HttpContext } from '@adonisjs/core/http'

import Base from './base.js'

export default class AppUserController extends Base {
  async index(http: HttpContext) {
    return {
      test: true,
      params: http.params,
    }
  }
}
