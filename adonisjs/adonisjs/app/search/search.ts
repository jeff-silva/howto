// import { inject } from '@adonisjs/core'
import { BaseModel } from '@adonisjs/lucid/orm'

// @inject()
export default class Search {
  // protected model: null | typeof BaseModel = null
  constructor(protected model: null | typeof BaseModel = null) {}

  getModel() {
    // console.log('getModel', this.model.constructor)
    if (!this.model) throw new Error('Model does not exists')
    return this.model
    // return new this.model.constructor()
  }

  params() {
    return {}
  }

  paramsDefault(merge = {}) {
    return {
      ...this.params(),
      q: null,
      page: 1,
      per_page: 20,
      ...merge,
    }
  }

  onQuery(query, params) {
    return query
  }

  async query(params = {}) {
    const model = this.getModel()
    const query = await model.query()
    params = this.paramsDefault(params)
    return this.onQuery(query, params)
  }

  onOptions(ctx: Record<any, any>) {
    return ctx.options
  }

  options(ctx: Record<any, any>) {
    const options = { with: [] }
    return this.onOptions({ ...ctx, options })
  }

  static async get(params = {}) {
    return { params }
  }

  static async first(params = {}) {
    return { params }
  }

  static async paginate(params = {}) {
    const search = new this()
    params = search.paramsDefault(params)
    const query = search.model.query()
    const paginate = await query.paginate(params.page, params.per_page)
    const { meta: pagination, data } = paginate.serialize()
    const options = search.options({ query, params })
    return { params, pagination, data, options }
  }
}
