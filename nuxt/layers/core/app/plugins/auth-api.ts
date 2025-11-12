export default defineNuxtPlugin(() => {
  const authApiUrl = useRuntimeConfig().public.authApiURL
  const authApiKey = useRuntimeConfig().public.authApiKey
  const errorRedirectPath = useAppConfig().connect.core.plugin.authApi.errorRedirect[401]
  const { $keycloak } = useNuxtApp()
  const localePath = useLocalePath()

  const api = $fetch.create({
    baseURL: authApiUrl,
    onRequest ({ options }) {
      const headers = options.headers ||= {}

      const accountStore = useConnectAccountStore()
      const accountId = accountStore.currentAccount.id

      if (Array.isArray(headers)) {
        headers.push(['Authorization', `Bearer ${$keycloak.token}`])
        headers.push(['Account-Id', accountId])
        if (authApiKey) {
          headers.push(['X-Apikey', authApiKey])
        }
      } else if (headers instanceof Headers) {
        headers.set('Authorization', `Bearer ${$keycloak.token}`)
        headers.set('Account-Id', accountId)
        if (authApiKey) {
          headers.set('X-Apikey', authApiKey)
        }
      } else {
        headers.Authorization = `Bearer ${$keycloak.token}`
        headers['Account-Id'] = accountId
        if (authApiKey) {
          headers['X-Apikey'] = authApiKey
        }
      }
    },
    async onResponseError ({ response }) {
      if (response.status === 401) {
        await navigateTo(localePath(errorRedirectPath))
      }
    }
  })

  return {
    provide: {
      authApi: api
    }
  }
})
