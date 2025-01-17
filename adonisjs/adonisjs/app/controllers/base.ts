import type { HttpContext } from '@adonisjs/core/http'
// import { BaseModel } from '@adonisjs/lucid/orm'

export default class Base {
  // private model: typeof BaseModel

  protected async storeValidate(data = {}) {
    return data
  }

  protected async updateValidate(data = {}) {
    return data
  }

  public success(data = {}) {
    return { success: true, ...data }
  }

  public error(code: any, message: string, data = {}) {
    return { code, message, data }
  }

  async index(http: HttpContext): Promise<Record<string, any>> {
    const data = await this.model.constructor.query().paginate(1, 20)
    return this.success({
      page: data.currentPage,
      pages: data.lastPage,
      total: data.total,
      data: data.rows,
    })
  }

  async store(http: HttpContext): Promise<Record<string, any>> {
    const data = await this.storeValidate(http.request.body())
    const entity = await this.model.merge(data).save()
    return { entity }
  }

  async show(http: HttpContext): Promise<Record<string, any>> {
    return { type: 'show', params: http.params }
  }

  async update(http: HttpContext): Promise<Record<string, any>> {
    const data = await this.updateValidate(http.request.all())
    return { type: 'update', params: http.params, data }
  }

  async destroy(http: HttpContext): Promise<Record<string, any>> {
    return { type: 'destroy', params: http.params }
  }
}
