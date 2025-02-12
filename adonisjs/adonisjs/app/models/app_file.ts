import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import Model from '#models/model'
import fs from 'fs/promises'

export default class AppFile extends Model {
  public static table = 'app_file'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare ext: string | null

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

  async upload(file: any) {
    const fileBuffer = await fs.readFile(file.tmpPath)
    const base64 = fileBuffer.toString('base64')
    const data: Record<string, any> = {
      name: null,
      ext: null,
      mime: null,
      size: null,
      path: null,
      content: null,
      // file,
    }
    data.name = file.clientName ?? null
    data.ext = data.name ? data.name.split('.').pop() : null
    data.mime = file.type && file.subtype ? `${file.type}/${file.subtype}` : null
    data.size = file.size
    data.content = data.mime && base64 ? `data:${data.mime};base64,${base64}` : null
    console.log({ file, base64 })
    return await this.fill(data).save()
  }
}
