// import { inject } from '@adonisjs/core'

import Search from '#search/search'
import AppConfig from '#models/app_config'

// @inject()
export default class AppConfigSearch extends Search {
  constructor(protected model = AppConfig) {
    super(model)
  }
}
