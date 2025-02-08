import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import Model from '#models/model'

export default class AppUserGroup extends Model {
  public static table = 'app_user_group'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
