import type { HttpContext } from '@adonisjs/core/http'

export default class Base {
  public success(data = {}) {
    return { data }
  }

  async index(http: HttpContext) {
    return ['index', http.params]
  }

  async store(http: HttpContext) {
    return ['store', http.params]
  }

  async show(http: HttpContext) {
    return ['show', http.params]
  }

  async update(http: HttpContext) {
    return ['update', http.params]
  }

  async destroy(http: HttpContext) {
    return ['destroy', http.params]
  }
}
