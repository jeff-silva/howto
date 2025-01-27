// import { inject } from '@adonisjs/core'

import Search from '#search/search'
import AppUser from '#models/app_user'

// @inject()
export default class AppUserSearch extends Search {
  // protected model = AppUser
  constructor(protected model = AppUser) {
    super(model)
  }

  async onQuery(query, params) {
    query.preload('app_user_group')
    return query
  }
}
