import type { HttpContext } from '@adonisjs/core/http'

import Controller from '#controllers/controller'
import { inject } from '@adonisjs/core'

import AppFile from '#models/app_file'
import AppFileSearch from '#search/app_file_search'

@inject()
export default class AppFileController extends Controller {
  constructor(protected model: AppFile) {
    super()
  }

  async index(http: HttpContext): Promise<Record<string, any>> {
    return await AppFileSearch.paginate(http.request.all())
  }
}
