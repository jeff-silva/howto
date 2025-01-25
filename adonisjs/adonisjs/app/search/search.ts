// import { inject } from '@adonisjs/core'
// import { BaseModel } from '@adonisjs/lucid/orm'

// @inject()
export default class SearchBase {
  // constructor(protected model: typeof BaseModel) {}
  protected model = null

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

  async get(params = {}) {
    return { params }
  }

  async first(params = {}) {
    return { params }
  }

  async paginate(params = {}) {
    params = this.paramsDefault(params)
    console.log(this.model)
    return { params }
    // const data = await entity.query().paginate(params.page, params.per_page)
    // const pagination = {}
    // const options = this.options()
    // return { pagination, data, params, options }
  }
}
