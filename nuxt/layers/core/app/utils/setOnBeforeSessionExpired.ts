// cant use await inside definePageMeta so must use separate util to set page meta if await required
export function setOnBeforeSessionExpired (cb: () => void | Promise<void>) {
  const route = useRoute()
  route.meta.onBeforeSessionExpired = async () => {
    try {
      const result = cb()

      if (result instanceof Promise) {
        await result
      }
    } catch (e) {
      logFetchError(e, 'Error during session expiration handling')
    }
  }
}
