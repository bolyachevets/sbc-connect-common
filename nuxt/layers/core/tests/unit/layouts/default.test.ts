import { describe, expect, it, vi } from 'vitest'
import { renderSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import defaultLayout from '~/layouts/default.vue'

const setLocaleMock = vi.fn()
mockNuxtImport('useI18n', () => {
  return () => (
    {
      locale: 'en-CA',
      locales: ref([
        {
          name: 'English',
          code: 'en-CA',
          iso: 'en-CA',
          dir: 'ltr',
          file: 'en-CA.ts'
        },
        {
          name: 'French',
          code: 'fr-CA',
          iso: 'fr-CA',
          dir: 'ltr',
          file: 'fr-CA.ts'
        }
      ]),
      t: (key: string) => key,
      setLocale: setLocaleMock
    }
  )
})

mockNuxtImport('useRoute', () => {
  return () => (
    {
      meta: undefined
    }
  )
})

// mockNuxtImport('useNuxtApp', () => {
//   return () => (
//     {
//       $route: {
//         meta: undefined
//       }
//     }
//   )
// })

describe.skip('Default Layout', () => {
  it('mounts', async () => {
    const wrapper = await renderSuspended(defaultLayout)

    const header = wrapper.getByTestId('connect-header-wrapper')
    const footer = wrapper.getByTestId('connect-main-footer')
    const slot = wrapper.getByTestId('connect-default-layout-slot')

    expect(wrapper).toBeTruthy()
    expect(header).toBeDefined()
    expect(footer).toBeDefined()
    expect(slot).toBeDefined()
    expect(slot.outerHTML).toEqual('<main class="mx-auto w-full max-w-bcGovLg grow" data-testid="connect-default-layout-slot"></main>')
  })
})
