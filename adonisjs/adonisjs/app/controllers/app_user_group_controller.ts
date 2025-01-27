import type { HttpContext } from '@adonisjs/core/http'

import Controller from '#controllers/controller'
import { inject } from '@adonisjs/core'

import AppUserGroup from '#models/app_user_group'
import AppUserGroupSearch from '#search/app_user_group_search'

@inject()
export default class AppFileController extends Controller {
  constructor(protected model: AppUserGroup) {
    super()
  }

  async index(http: HttpContext): Promise<Record<string, any>> {
    return await AppUserGroupSearch.paginate(http.request.all())
  }
}
