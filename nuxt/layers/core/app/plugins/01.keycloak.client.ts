import Keycloak from 'keycloak-js'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  // define new keycloak
  const keycloak = new Keycloak({
    url: config.public.keycloakAuthUrl,
    realm: config.public.keycloakRealm,
    clientId: config.public.keycloakClientId
  })

  try {
    // init keycloak instance
    await keycloak.init({
      onLoad: 'check-sso',
      responseMode: 'query',
      pkceMethod: 'S256'
    })
  } catch (error) {
    console.error('Failed to initialize Keycloak adapter: ', error)
  }

  return {
    provide: {
      // provide global keycloak instance
      keycloak
    }
  }
})
