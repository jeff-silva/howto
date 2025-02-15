import env from '#start/env'

/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register the middleware with the server
| or the router.
|
*/

import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
])

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
})

import fs from 'node:fs'
import { exec } from 'node:child_process'

exec('npx prisma db push')

if (env.get('NODE_ENV') === 'development') {
  fs.watch('./prisma/schema.prisma', { encoding: 'buffer' }, (eventType, filename) => {
    console.log({ eventType, filename })
    exec('npx prisma db push', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`)
        if (stderr) console.error(`Stderr: ${stderr}`)
        return
      }
      console.log(stdout)
    })
  })
}
