export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) { // only run on client
    const { isAuthenticated, kcUser } = useKeycloak()
    if (isAuthenticated.value) {
      const accountStore = useConnectAccountStore()
      await accountStore.setAccountInfo()
      await accountStore.setUserName()
      await accountStore.checkAccountStatus()
      if (accountStore.currentAccount.id && kcUser.value.keycloakGuid) { // check for pending approvals
        await accountStore.getPendingApprovalCount(parseInt(accountStore.currentAccount.id), kcUser.value.keycloakGuid)
      }
    }
  }
})
