import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import Model from '#models/model'

export default class AppConfig extends Model {
  public static table = 'app_config'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare value: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
