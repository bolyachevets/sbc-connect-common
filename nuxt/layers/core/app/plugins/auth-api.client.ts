export default defineNuxtPlugin({
  name: 'core-auth-api-plugin',
  parallel: true,
  dependsOn: ['core-keycloak-plugin'],
  setup () {
    const authApiUrl = useRuntimeConfig().public.authApiURL
    const { $keycloak } = useNuxtApp()

    const api = $fetch.create({
      baseURL: authApiUrl,
      onRequest ({ options }) {
        const headers = options.headers ||= {}
        if (Array.isArray(headers)) {
          headers.push(['Authorization', `Bearer ${$keycloak.token}`])
        } else if (headers instanceof Headers) {
          headers.set('Authorization', `Bearer ${$keycloak.token}`)
        } else {
          headers.Authorization = `Bearer ${$keycloak.token}`
        }
      },
      async onResponseError ({ response }) {
        if (response.status === 401) {
          await navigateTo('/')
        }
      }
    })

    return {
      provide: {
        authApi: api
      }
    }
  }
})
