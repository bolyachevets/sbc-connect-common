import { ConnectSlideoverWhatsNew } from '#components'

export const useConnectSlideover = () => {
  const slideover = useSlideover()

  function openWhatsNewSlideover () {
    slideover.open(ConnectSlideoverWhatsNew)
  }

  return {
    openWhatsNewSlideover
  }
}
