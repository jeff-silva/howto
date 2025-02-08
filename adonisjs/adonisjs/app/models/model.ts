import { BaseModel, column, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'

export default class Model extends BaseModel {
  public static namingStrategy = new SnakeCaseNamingStrategy()

  searchParams() {
    return {}
  }

  searchOptions(options, data) {
    return options
  }

  searchQuery(query, params = {}) {
    return query
  }

  searchOptionsDefault(data = []) {
    let options = {}
    return this.searchOptions(options, data)
  }

  searchParamsDefault(merge = {}) {
    return {
      search: null,
      page: 1,
      per_page: 1,
      order: 'id:desc',
      ...merge,
      ...this.searchParams(),
    }
  }

  async search(params = {}) {
    params = this.searchParamsDefault(params)
    const query = this.searchQuery(this.constructor.query(), params)
    return query
  }

  async searchPaginated(params = {}) {
    params = this.searchParamsDefault(params)
    const query = this.searchQuery(this.constructor.query(), params)
    const paginate = await query.paginate(1)
    const { meta: pagination, data } = paginate.serialize()
    const options = this.searchOptionsDefault(data)
    return { params, pagination, data, options }
  }
}
