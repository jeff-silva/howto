import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import Model from '#models/model'

export default class AppAddress extends Model {
  public static table = 'app_address'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare route: string | null

  @column()
  declare number: string | null

  @column()
  declare complement: string | null

  @column()
  declare zipcode: string | null

  @column()
  declare district: string | null

  @column()
  declare city: string | null

  @column()
  declare city_code: string | null

  @column()
  declare state: string | null

  @column()
  declare state_code: string | null

  @column()
  declare country: string | null

  @column()
  declare country_code: string | null

  @column()
  declare lat: number | null

  @column()
  declare lng: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
