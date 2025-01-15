import type { HttpContext } from '@adonisjs/core/http'

export default class Base {
  public success(data = {}) {
    return { data }
  }

  public error(code: any, message: string, meta = {}) {
    return { code, message, meta }
  }

  async index(http: HttpContext): Promise<Record<string, any>> {
    return { type: 'index', params: http.params }
  }

  async store(http: HttpContext): Promise<Record<string, any>> {
    return { type: 'store', params: http.params }
  }

  async show(http: HttpContext): Promise<Record<string, any>> {
    return { type: 'show', params: http.params }
  }

  async update(http: HttpContext): Promise<Record<string, any>> {
    return { type: 'update', params: http.params }
  }

  async destroy(http: HttpContext): Promise<Record<string, any>> {
    return { type: 'destroy', params: http.params }
  }
}
