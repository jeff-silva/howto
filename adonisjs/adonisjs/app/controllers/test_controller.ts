import type { HttpContext } from '@adonisjs/core/http'

import Base from './base.js'

export default class TestController extends Base {
  async index(http: HttpContext) {
    return {
      test: 123456,
      params: http.params,
    }
  }
}
