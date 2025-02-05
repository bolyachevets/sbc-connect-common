declare module '#app' {
  interface PageMeta {
    breadcrumbs?: ConnectBreadcrumb[]
    hideBreadcrumbs?: boolean | undefined
    onAccountChange?: (newVal: Account, oldVal: Account) => boolean
    sessionExpiredFn?: () => void | Promise<void> // replace default functionality
    onBeforeSessionExpired?: () => void | Promise<void> // do something right before the default session expiry is executed
  }
}

export {}