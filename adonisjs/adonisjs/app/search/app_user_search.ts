import { inject } from '@adonisjs/core'

import Search from '#search/search'
import AppUser from '#models/app_user'

@inject()
export default class AppUserSearch extends Search {
  constructor(protected model: AppUser) {
    super()
  }
}
