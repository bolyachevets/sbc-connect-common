// https://ui.nuxt.com/components/modal#control-programmatically
import {
  ConnectModalSessionExpiring
} from '#components'

export const useConnectModals = () => {
  const modal = useModal()

  function openSessionExpiringModal (cb: () => void) {
    modal.open(ConnectModalSessionExpiring, {
      onAfterLeave () {
        cb()
      }
    })
  }

  function close () {
    modal.close()
  }

  return {
    openSessionExpiringModal,
    close
  }
}
