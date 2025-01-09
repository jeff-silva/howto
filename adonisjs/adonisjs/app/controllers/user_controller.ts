// import type { HttpContext } from '@adonisjs/core/http'

import Base from './base.js'

export default class UserController extends Base {
  public index() {
    return this.success({
      test: true,
    })
  }
}
