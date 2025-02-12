import { BaseSeeder } from '@adonisjs/lucid/seeders'

import AppUser from '#models/app_user'

export default class extends BaseSeeder {
  async run() {
    const appUser =
      (await AppUser.find(1)) ||
      new AppUser().fill({ id: 1, name: 'Admin', email: 'main@grr.la', password: 'main@grr.la' })
    // appUser.save()
    // console.log(appUser)
  }
}
