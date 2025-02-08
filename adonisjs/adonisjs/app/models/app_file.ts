import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import Model from '#models/model'

export default class AppFile extends Model {
  public static table = 'app_file'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare mime: string | null

  @column()
  declare size: string | null

  @column()
  declare path: string | null

  @column()
  declare content: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
