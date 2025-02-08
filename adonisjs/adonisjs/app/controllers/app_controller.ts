import router from '@adonisjs/core/services/router'
import Controller from '#controllers/controller'

export default class AppController extends Controller {
  async index() {
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
