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

// Basic app routes
const AppController = () => import('#controllers/app_controller')
router.get('/app/index', [AppController, 'index']).as('app.index')

// Authentication routes
const AuthController = () => import('#controllers/auth_controller')
router.post('/auth/register', [AuthController, 'register']).as('auth.register')
router.post('/auth/login', [AuthController, 'login']).as('auth.login')
router.post('/auth/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())

// AppUser crud
const AppUserController = () => import('#controllers/app_user_controller')
// router.resource('app_user', AppUserController).apiOnly().only(['index']).use('*', middleware.auth())
router.resource('app_user', AppUserController).apiOnly()

// AppTestCrud
const AppTestController = () => import('#controllers/app_test_controller')
router.resource('app_test', AppTestController).apiOnly()
