import { inject } from '@adonisjs/core'
// import { BaseModel } from '@adonisjs/lucid/orm'

@inject()
export default class SearchBase {
  // constructor(protected model: typeof BaseModel) {}
  // private model = null

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

  options() {
    return {}
  }

  query(query) {
    return query
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
    console.log(this.model)
    return { params }
    // return { params }
    // // const data = await entity.query().paginate(params.page, params.per_page)
    // // const pagination = {}
    // // const options = this.options()
    // // return { pagination, data, params, options }
  }
}
