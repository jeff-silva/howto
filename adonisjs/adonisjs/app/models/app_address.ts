import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import Model from '#models/model'

import axios from 'axios'
import cache from '@adonisjs/cache/services/main'
import string from '@adonisjs/core/helpers/string'

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

  async autocomplete(params: Record<string, any> = {}) {
    params = {
      search: null,
      ...params,
    }

    // await cache.clear()
    const data = await cache.getOrSet({
      ttl: '1d',
      key: `app_address.autocomplete.` + JSON.stringify(params),
      factory: async () => {
        const u = new URL('https://nominatim.openstreetmap.org/search')
        u.searchParams.append('format', 'json')
        u.searchParams.append('addressdetails', '1')
        u.searchParams.append('limit', '20')
        if (params.search) u.searchParams.append('q', params.search)
        const url = u.toString()
        const { data } = await axios.get(url)
        return data
      },
    })

    return data.map((place) => {
      const addr = place.address
      const item = { name: null }
      const [country_code, state_code] = (addr['ISO3166-2-lvl4'] || '-').toLowerCase().split('-')

      item.route = addr.road || null
      item.number = addr.number || null
      item.complement = null
      item.zipcode = addr.postcode || null
      item.district = addr.neighbourhood || addr.suburb || null
      item.city = addr.city || null
      item.city_code = item.city
        ? addr['ISO3166-2-lvl4'].toLowerCase() + '-' + string.slug((addr.city || '').toLowerCase())
        : null
      item.state = addr.state || null
      item.state_code = state_code || null
      item.country = addr.country || null
      item.country_code = country_code || null
      item.lat = parseFloat(place.lat)
      item.lng = parseFloat(place.lon)

      item.name =
        [item.route, item.district, item.city, item.state, item.country]
          .filter((v) => !!v)
          .join(', ') || null

      return item
    })
  }
}
