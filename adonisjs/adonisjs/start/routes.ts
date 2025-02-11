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

// app_user
const AppUserController = () => import('#controllers/app_user_controller')
// router.resource('app_user', AppUserController).apiOnly().only(['index']).use('*', middleware.auth())
router.resource('app_user', AppUserController).apiOnly()

// app_user_group
const AppUserGroupController = () => import('#controllers/app_user_group_controller')
router.resource('app_user_group', AppUserGroupController).apiOnly()

// app_file
const AppFileController = () => import('#controllers/app_file_controller')
router.resource('app_file', AppFileController).apiOnly()

// app_address
const AppAddressController = () => import('#controllers/app_address_controller')
router.resource('app_address', AppAddressController).apiOnly()

// app_config
const AppConfigController = () => import('#controllers/app_config_controller')
router.post('/app_config/saveAll', [AppConfigController, 'saveAll']).as('app_config.save')
router.post('/app_config/listAll', [AppConfigController, 'listAll']).as('app_config.llist')
