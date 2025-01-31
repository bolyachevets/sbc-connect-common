import Keycloak from 'keycloak-js'

export default defineNuxtPlugin(async () => {
  const rtc = useRuntimeConfig().public
  const kcConfig = useAppConfig().connect.core.keycloak

  // define new keycloak
  const keycloak = new Keycloak({
    url: rtc.keycloakAuthUrl,
    realm: rtc.keycloakRealm,
    clientId: rtc.keycloakClientId
  })

  const refreshIntervalTimeout = kcConfig.refreshIntervalTimeout
  const minValidity = kcConfig.minValidity
  const idleTimeout = kcConfig.idleTimeout

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

  const route = useRoute()
  const { idle } = useIdle(idleTimeout)

  function sessionExpiredFn () {
    if (route.meta.onSessionExpired) {
      route.meta.onSessionExpired()
    } else {
      keycloak.logout()
    }
  }

  function scheduleRefreshToken () {
    setTimeout(async () => {
      // do not refresh if user not authenticated or idle
      if (!keycloak.authenticated || idle.value) {
        console.info('User unauthenticated or inactive, stopping token refresh schedule.')
        return
      }

      if (keycloak.isTokenExpired(minValidity)) {
        console.info('Token set to expire soon. Refreshing token...')
        try {
          await keycloak.updateToken(minValidity)
          console.info('Token updated.')
        } catch (error) {
          console.error('Error updating token:', error)
          keycloak.logout() // log user out if token update fails
        }
      }
      // re-schedule only if the user remains active and authenticated
      if (keycloak.authenticated && !idle.value) {
        scheduleRefreshToken()
      }
    }, refreshIntervalTimeout)
  }

  // Watch for changes in authentication and idle state
  // When the user is authenticated and not idle, start the refresh schedule
  // Execute session expiry handling if user authenticated and inactive
  watch(
    [() => keycloak.authenticated, () => idle.value],
    ([isAuth, isIdle]) => {
      if (isAuth && !isIdle) {
        scheduleRefreshToken()
      } else if (isAuth && isIdle) {
        sessionExpiredFn()
      }
    },
    { immediate: true }
  )

  // default behaviour when keycloak session expires
  keycloak.onTokenExpired = async () => {
    if (idle.value) {
      sessionExpiredFn()
    } else {
      await keycloak.updateToken(minValidity).catch(() => {
        console.error('Failed to refresh token on expiration; logging out.')
        keycloak.logout() // refresh token failed or not available
      })
    }
  }

  return {
    provide: {
      // provide global keycloak instance
      keycloak
    }
  }
})
