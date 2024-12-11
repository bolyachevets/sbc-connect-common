export function setBreadcrumbs (breadcrumbs: ConnectBreadcrumb[]) {
  const route = useRoute()
  route.meta.breadcrumbs = breadcrumbs
}
