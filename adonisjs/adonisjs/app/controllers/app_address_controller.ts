import type { HttpContext } from '@adonisjs/core/http'

import Base from './base.js'
import { inject } from '@adonisjs/core'

import AppAddress from '#models/app_address'

@inject()
export default class AppAddressController extends Base {
  constructor(protected model: AppAddress) {
    super()
  }
}
