import type { HttpContext } from '@adonisjs/core/http'

import Base from './base.js'
import { inject } from '@adonisjs/core'

import AppConfig from '#models/app_config'

@inject()
export default class AppFileController extends Base {
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
