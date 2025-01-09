/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UserController = () => import('#controllers/user_controller')
router.resource('user', UserController).apiOnly().only(['index']).use(middleware.auth())

const TestController = () => import('#controllers/test_controller')
router.resource('test', TestController).apiOnly()

router.get('/', async () => {
  return {
    test: true,
    routes: router,
  }
})
