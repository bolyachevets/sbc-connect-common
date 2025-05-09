export default defineAppConfig({
  connect: {
    core: {
      login: {
        redirectPath: '',
        // @ts-expect-error - I think this should be fine when extending the layer but will need to confirm
        idps: () => ['bcsc', 'bceid', 'idir']
      },
      header: {
        options: {
          localeSelect: false,
          unauthenticated: {
            whatsNew: false,
            loginMenu: true,
            createAccount: true
          },
          authenticated: {
            notifications: true,
            accountOptionsMenu: true
          }
        }
      }
    }
  }
})
