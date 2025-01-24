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

  protected async modelSave(data: Record<string, any>): Promise<Record<string, any>> {
    let entity = new this.model.constructor()
    if (data.id) {
      entity = await this.model.constructor.find(data.id)
    }
    await entity.fill(data).save()
    return entity
  }

  async store(http: HttpContext): Promise<Record<string, any>> {
    const data = http.request.body()
    await this.storeValidate(data)
    const entity = await this.modelSave(data)
    return { entity }
  }

  async show(http: HttpContext): Promise<Record<string, any>> {
    return { type: 'show', params: http.params }
  }

  async update(http: HttpContext): Promise<Record<string, any>> {
    const data = http.request.body()
    await this.storeValidate(data)
    const entity = await this.modelSave(data)
    return { entity }
  }

  async destroy(http: HttpContext): Promise<Record<string, any>> {
    const entity = await this.model.constructor.find(http.params.id)
    await entity.delete()
    return { entity, params: http.params }
  }
}
