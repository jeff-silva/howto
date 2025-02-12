import type { HttpContext } from '@adonisjs/core/http'
import Controller from '#controllers/controller'
import { inject } from '@adonisjs/core'

import AppFile from '#models/app_file'

@inject()
export default class AppFileController extends Controller {
  constructor(protected model: AppFile) {
    super()
  }

  async upload(http: HttpContext) {
    const file = http.request.file('file')
    const entity = await this.model.upload(file)
    return this.success({ entity })
  }
}
