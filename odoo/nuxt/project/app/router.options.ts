import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  routes: (_routes) => {
    let hostname = ''
    if (import.meta.server) {
      const url = useRequestURL()
      hostname = url.hostname
    } else {
      hostname = window.location.hostname
    }

    // Identifica o subdomínio
    // ex: 'resumas.localhost' -> 'resumas'
    // 'localhost' -> '_main'
    // 'domain.com' -> '_main'
    // 'resumas.domain.com' -> 'resumas'
    const parts = hostname.toLowerCase().split(':')[0].split('.')
    let subdomain = '_main'

    if (parts.length > 1 && parts[parts.length - 1] === 'localhost' && parts[0] !== 'localhost') {
      subdomain = parts[0]
    } else if (parts.length > 2 && parts[0] !== 'www') {
      subdomain = parts[0]
    }

    const targetPrefix = '/' + subdomain

    // Filtra e reescreve as rotas para o subdomínio atual
    const filteredRoutes = _routes
      .filter((route) => route.path.startsWith(targetPrefix))
      .map((route) => {
        let newPath = route.path.slice(targetPrefix.length)
        if (!newPath) newPath = '/'
        return {
          ...route,
          path: newPath,
        }
      })

    return filteredRoutes
  },
}
