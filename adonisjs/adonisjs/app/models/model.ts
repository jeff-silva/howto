import { BaseModel, SnakeCaseNamingStrategy, ModelQueryBuilder } from '@adonisjs/lucid/orm'

export default class Model extends BaseModel {
  public static namingStrategy = new SnakeCaseNamingStrategy()

  searchParams() {
    return {}
  }

  // eslint-disable-line @typescript-eslint/no-unused-vars
  searchOptions(options: Record<string, any>, data: any[] = []) {
    return options
  }

  searchQuery(query: ModelQueryBuilder, params: Record<string, any> = {}) {
    return query
  }

  searchOptionsDefault(data: any[] = []) {
    let options = {}
    return this.searchOptions(options, data)
  }

  searchParamsDefault(merge: Record<string, any> = {}) {
    return {
      search: null,
      page: 1,
      per_page: 1,
      order: 'id:desc',
      ...merge,
      ...this.searchParams(),
    }
  }

  async search(params: Record<string, any> = {}) {
    params = this.searchParamsDefault(params)
    const query = this.searchQuery(this.constructor.query(), params)
    return query
  }

  async searchPaginated(params: Record<string, any> = {}) {
    params = this.searchParamsDefault(params)
    const query = this.searchQuery(this.constructor.query(), params)
    console.log(query)
    const paginate = await query.paginate(1)
    const { meta: pagination, data } = paginate.serialize()
    const options = this.searchOptionsDefault(data)
    return { params, pagination, data, options }
  }
}
