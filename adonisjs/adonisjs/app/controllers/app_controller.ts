import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

import Base from './base.js'

export default class AppController extends Base {
  async index(http: HttpContext) {
    const routerJSON = router.toJSON()
    const data = routerJSON.root.map((route) => {
      return {
        name: route.name,
        pattern: route.pattern,
        meta: route.meta,
        methods: route.methods,
      }
    })

    return this.success({ data })
  }
}
