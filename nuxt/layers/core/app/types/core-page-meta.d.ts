declare module '#app' {
  interface PageMeta {
    breadcrumbs?: ConnectBreadcrumb[]
    hideBreadcrumbs?: boolean | undefined
    onAccountChange?: (newVal: Account, oldVal: Account) => boolean
  }
}

export {}