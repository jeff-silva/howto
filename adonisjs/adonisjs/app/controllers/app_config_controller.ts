import type { HttpContext } from '@adonisjs/core/http'

import Controller from '#controllers/controller'
import { inject } from '@adonisjs/core'

import AppConfig from '#models/app_config'

@inject()
export default class AppFileController extends Controller {
  constructor(protected model: AppConfig) {
    super()
  }

  async saveAll(http: HttpContext) {
    return this.success({
      test: true,
    })
  }

  async listAll(http: HttpContext) {
    return this.success({
      test: true,
    })
  }
}
