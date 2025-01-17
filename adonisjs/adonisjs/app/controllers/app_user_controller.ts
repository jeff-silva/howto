import type { HttpContext } from '@adonisjs/core/http'

import Base from './base.js'
import { inject } from '@adonisjs/core'

import AppUser from '#models/app_user'
import { appUserSave } from '#validators/app_user_validator'

@inject()
export default class AppUserController extends Base {
  constructor(protected model: AppUser) {
    super()
  }

  protected async storeValidate(data = {}) {
    // console.log(data)
    return await appUserSave.validate(data)
  }

  protected async updateValidate(data = {}) {
    return await appUserSave.validate(data)
  }
}
