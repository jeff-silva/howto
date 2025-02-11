import type { HttpContext } from '@adonisjs/core/http'
import Controller from '#controllers/controller'
import { inject } from '@adonisjs/core'

import AppAddress from '#models/app_address'

@inject()
export default class AppAddressController extends Controller {
  constructor(protected model: AppAddress) {
    super()
  }

  async autocomplete(http: HttpContext) {
    const result = await this.model.autocomplete(http.request.all())
    return this.success({ result })
  }
}
