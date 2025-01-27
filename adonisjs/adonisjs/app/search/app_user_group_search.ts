// import { inject } from '@adonisjs/core'

import Search from '#search/search'
import AppUserGroup from '#models/app_user_group'

// @inject()
export default class AppUserGroupSearch extends Search {
  constructor(protected model = AppUserGroup) {
    super(model)
  }
}
