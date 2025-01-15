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

const AppUserController = () => import('#controllers/app_user_controller')
router.resource('app_user', AppUserController).apiOnly().only(['index']).use('*', middleware.auth())

const AppTestController = () => import('#controllers/app_test_controller')
router.resource('app_test', AppTestController).apiOnly()

router.get('/', async () => {
  return {
    test: true,
    routes: router,
  }
})
