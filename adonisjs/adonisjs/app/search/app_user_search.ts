import { inject } from '@adonisjs/core'

import Search from '#search/search'
import AppUser from '#models/app_user'
console.log('AppUser', AppUser)

@inject()
export default class AppUserSearch extends Search {
  constructor(protected model: AppUser) {
    console.log('aaa', model)
    super(model)
  }
}
