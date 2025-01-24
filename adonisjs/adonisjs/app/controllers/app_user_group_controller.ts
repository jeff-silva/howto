import type { HttpContext } from '@adonisjs/core/http'

import Base from './base.js'
import { inject } from '@adonisjs/core'

import AppUserGroup from '#models/app_user_group'

@inject()
export default class AppFileController extends Base {
  constructor(protected model: AppUserGroup) {
    super()
  }
}
