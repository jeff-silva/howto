import type { HttpContext } from '@adonisjs/core/http'

import Controller from '#controllers/controller'
import { inject } from '@adonisjs/core'

import AppAddress from '#models/app_address'
import AppUserSearch from '#search/app_address_search'

@inject()
export default class AppAddressController extends Controller {
  constructor(protected model: AppAddress) {
    super()
  }

  async index(http: HttpContext): Promise<Record<string, any>> {
    return await AppUserSearch.paginate(http.request.all())
  }
}
