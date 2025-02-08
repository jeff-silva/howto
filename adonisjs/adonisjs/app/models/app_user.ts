import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { column, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import Model from '#models/model'
import AppUserGroup from '#models/app_user_group'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class AppUser extends compose(Model, AuthFinder) {
  public static table = 'app_user'
  static accessTokens = DbAccessTokensProvider.forModel(AppUser)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare group_id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  @hasOne(() => AppUserGroup, { localKey: 'group_id', foreignKey: 'id' })
  declare app_user_group: HasOne<typeof AppUserGroup>
}
