// import { inject } from '@adonisjs/core'

import Search from '#search/search'
import AppAddress from '#models/app_address'

// @inject()
export default class AppAddressSearch extends Search {
  constructor(protected model = AppAddress) {
    super(model)
  }
}
