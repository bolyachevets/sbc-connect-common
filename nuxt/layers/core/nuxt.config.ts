// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  ssr: false, 

  devtools: { enabled: false },

  compatibilityDate: '2024-07-16',

  future: {
    compatibilityVersion: 4
  },

  nitro: {
    prerender: {
      ignore: [] // ignore tos/login pages by default
    }
  },

  css: [
    join(currentDir, './app/assets/css/core-main.css'),
    join(currentDir, './app/assets/css/core-layout.css')
  ],

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    // '@nuxt/test-utils/module'
  ],

  imports: {
    dirs: [
      'stores',
      'composables',
      'enums',
      'interfaces',
      'types',
      'utils'
    ]
  },

  ui: {
    icons: ['mdi']
  },

  alias: {
    BCGovFonts: join(currentDir, './public/fonts/BCSans'),
    BCGovLogoSmEn: join(currentDir, './public/BCGovLogo/gov_bc_logo_vert_en.png'),
    BCGovLogoSmFr: join(currentDir, './public/BCGovLogo/gov_bc_logo_vert_fr.png'),
    BCGovLogoLgEn: join(currentDir, './public/BCGovLogo/gov_bc_logo_horiz_en.png'),
    BCGovLogoLgFr: join(currentDir, './public/BCGovLogo/gov_bc_logo_horiz_fr.png')
  },

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  vite: {
    optimizeDeps: {
      include: ['keycloak-js']
    },
    server: {
      watch: {
        usePolling: true
      }
    }
  },

  runtimeConfig: {
    public: {
      // Keys within public, will be also exposed to the client-side
      keycloakAuthUrl: process.env.NUXT_KEYCLOAK_AUTH_URL,
      keycloakRealm: process.env.NUXT_KEYCLOAK_REALM,
      keycloakClientId: process.env.NUXT_KEYCLOAK_CLIENTID,
      authWebURL: process.env.NUXT_AUTH_WEB_URL,
      authApiURL: `${process.env.NUXT_AUTH_API_URL || ''}${process.env.NUXT_AUTH_API_VERSION || ''}`,
      ldClientId: process.env.NUXT_LD_CLIENT_ID || '',
      appName: process.env.npm_package_name || '',
      registryHomeURL: process.env.NUXT_REGISTRY_HOME_URL,
      version: `BRD UI v${process.env.npm_package_version || ''}`,
      environment: process.env.NUXT_ENVIRONMENT_HEADER || '',
      baseUrl: process.env.NUXT_BASE_URL,
      paymentPortalUrl: process.env.NUXT_PAYMENT_PORTAL_URL,
      payApiURL: `${process.env.NUXT_PAY_API_URL}${process.env.NUXT_PAY_API_VERSION}`,
      tokenRefreshInterval: process.env.NUXT_KEYCLOAK_REFRESH_INTERVAL || 30000, // default 30 seconds
      tokenMinValidity: process.env.NUXT_KEYCLOAK_MIN_TOKEN_VALIDITY || 120000, // default 2 mins
      sessionIdleTimeout: process.env.NUXT_CONNECT_SESSION_INACTIVITY_TIMEOUT || 1800000, // default 30 mins
      sessionExpiredModalTimeout: process.env.NUXT_CONNECT_SESSION_MODAL_TIMEOUT || 120000 // default 2 mins
    }
  },

  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en-CA',
        iso: 'en-CA',
        dir: 'ltr',
        file: 'en-CA.ts'
      },
      {
        name: 'Français',
        code: 'fr-CA',
        iso: 'fr-CA',
        dir: 'ltr',
        file: 'fr-CA.ts'
      }
    ],
    strategy: 'prefix',
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en-CA',
    detectBrowserLanguage: false,
    vueI18n: './i18n.config.ts'
  },

  piniaPluginPersistedstate: {
    storage: 'sessionStorage'
  }
})
