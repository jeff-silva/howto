// import { inject } from '@adonisjs/core'

import Search from '#search/search'
import AppFile from '#models/app_file'

// @inject()
export default class AppFileSearch extends Search {
  constructor(protected model = AppFile) {
    super(model)
  }
}
