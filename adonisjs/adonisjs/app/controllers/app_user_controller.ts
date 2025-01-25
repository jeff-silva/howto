import type { HttpContext } from '@adonisjs/core/http'

import Controller from '#controllers/controller'
import { inject } from '@adonisjs/core'

import AppUser from '#models/app_user'
import { appUserSave } from '#validators/app_user_validator'
import AppUserSearch from '#search/app_user_search'

@inject()
export default class AppUserController extends Controller {
  constructor(protected model: AppUser) {
    super()
  }

  protected async storeValidate(data = {}) {
    return await appUserSave.validate(data)
  }

  protected async updateValidate(data = {}) {
    return await appUserSave.validate(data)
  }

  async index(http: HttpContext): Promise<Record<string, any>> {
    return await new AppUserSearch().paginate(http.request.all())

    // const data = await this.model.constructor.query().paginate(1, 20)
    // return this.success({
    //   page: data.currentPage,
    //   pages: data.lastPage,
    //   total: data.total,
    //   data: data.rows,
    // })
  }
}
