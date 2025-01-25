import type { HttpContext } from '@adonisjs/core/http'

import Controller from '#controllers/controller'
import { inject } from '@adonisjs/core'

import AppFile from '#models/app_file'

@inject()
export default class AppFileController extends Controller {
  constructor(protected model: AppFile) {
    super()
  }
}
