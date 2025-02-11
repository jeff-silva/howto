import { BaseModel, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'

export default class Model extends BaseModel {
  public static namingStrategy = new SnakeCaseNamingStrategy()

  searchParams() {
    return {}
  }

  searchOptions(options: Record<string, any>, data: any[] = []) {
    if (data === null) return options
    return options
  }

  searchQuery(query: any, params: Record<string, any> = {}) {
    if (params === null) return query
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

  async search(params: Record<string, any> = {}): Promise<any> {
    const model = this.constructor as typeof BaseModel
    params = this.searchParamsDefault(params)
    const query = this.searchQuery(model.query(), params)
    return query
  }

  async searchPaginated(params: Record<string, any> = {}) {
    const model = this.constructor as typeof BaseModel
    params = this.searchParamsDefault(params)
    const query = this.searchQuery(model.query(), params)
    const paginate = await query.paginate(1)
    const { meta: pagination, data } = paginate.serialize()
    const options = this.searchOptionsDefault(data)
    return { params, pagination, data, options }
  }
}
