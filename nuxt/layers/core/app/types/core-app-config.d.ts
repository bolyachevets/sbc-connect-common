export type LoginConfig = {
  redirectPath: string
  idps: Array<'bcsc' | 'bceid' | 'idir'>
}

export type HeaderOptions = {
  localeSelect: boolean,
  unauthenticated: {
    whatsNew: boolean,
    loginMenu: boolean,
    createAccount: boolean
  },
  authenticated: {
    notifications: boolean,
    accountOptionsMenu: boolean
  }
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    connect: {
      core: {
        login: LoginConfig,
        header: {
          options: HeaderOptions
        },
        plugin: {
          authApi: {
            errorRedirect: {
              401: string
            }
          },
          payApi: {
            errorRedirect: {
              401: string
            }
          }
        }
      }
    }
  }
}

export {}