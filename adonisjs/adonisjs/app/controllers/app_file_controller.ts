import type { HttpContext } from '@adonisjs/core/http'

import Base from './base.js'
import { inject } from '@adonisjs/core'

import AppFile from '#models/app_file'

@inject()
export default class AppFileController extends Base {
  constructor(protected model: AppFile) {
    super()
  }
}
