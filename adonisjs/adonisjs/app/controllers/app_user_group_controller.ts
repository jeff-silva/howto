import type { HttpContext } from '@adonisjs/core/http'

import Controller from '#controllers/controller'
import { inject } from '@adonisjs/core'

import AppUserGroup from '#models/app_user_group'

@inject()
export default class AppFileController extends Controller {
  constructor(protected model: AppUserGroup) {
    super()
  }
}
