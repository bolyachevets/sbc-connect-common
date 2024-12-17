import { LDPlugin } from 'launchdarkly-vue-client-sdk'

export default defineNuxtPlugin({
  name: 'core-launchdarkly-plugin',
  parallel: true,
  setup (nuxtApp) {
    nuxtApp.vueApp.use(LDPlugin, { deferInitialization: true })
  }
})
