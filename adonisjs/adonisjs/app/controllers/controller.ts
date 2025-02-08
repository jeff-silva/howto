import type { HttpContext } from '@adonisjs/core/http'

export default class Base {
  protected model?: any

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
    return await this.model.searchPaginated(http.request.all())
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
