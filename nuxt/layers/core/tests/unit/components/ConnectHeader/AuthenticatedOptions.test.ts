import { describe, expect, it, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ConnectHeaderAuthenticatedOptions } from '#components'

mockNuxtImport('useConnectAccountStore', () => {
  return () => ({
    currentAccount: { id: '1', label: 'Test Account' }
  })
})

mockNuxtImport('useKeycloak', () => {
  return () => ({
    kcUser: {
      firstname: 'First',
      lastname: 'Last',
      fullName: 'Test User',
      name: 'First Last',
      username: 'Username',
      email: 'test@email.com',
      sub: '123456',
      loginSource: 'BCSC',
      realm_access: { roles: ['role1', 'role2'] },
      roles: ['public_user']
    }
  })
})

mockNuxtImport('useConnectNav', () => {
  return () => ({
    loggedInUserOptions: [[
      {
        label: 'n/a',
        slot: 'account',
        disabled: true
      },
      {
        label: 'btn.editProfile',
        icon: 'i-mdi-account-outline',
        to: '/userprofile'
      },
      {
        label: 'btn.logout',
        icon: 'i-mdi-logout-variant',
        click: vi.fn()
      }
    ]]
  })
})

describe('<ConnectHeaderAuthenticatedOptions />', () => {
  it('renders', async () => {
    const wrapper = await mountSuspended(ConnectHeaderAuthenticatedOptions)

    expect(wrapper).toBeDefined()
    expect(wrapper.html()).toContain('Account Options Menu')
    expect(wrapper.html()).toContain('Notifications')
  })

  it('displays the correct account label', async () => {
    const wrapper = await mountSuspended(ConnectHeaderAuthenticatedOptions)

    expect(wrapper.text()).toContain('Test User')
    expect(wrapper.text()).toContain('Test Account')
  })

  it('opens the account options dropdown', async () => {
    const wrapper = await mountSuspended(ConnectHeaderAuthenticatedOptions)

    const dropdownButton = wrapper.find('#account-options-button')
    await dropdownButton.trigger('click')

    const dropdownItems = wrapper.element.querySelectorAll('[id^="headlessui-menu-item"]')
    expect(dropdownItems).toHaveLength(4)
  })

  it('renders the correct slots', async () => {
    const wrapper = await mountSuspended(ConnectHeaderAuthenticatedOptions)

    const accountSlot = wrapper.findComponent({ name: 'ConnectHeaderAuthenticatedOptionsAccountLabel' })
    expect(accountSlot).toBeDefined()

    const settingsSlot = wrapper.find('template[slot="settings"]')
    expect(settingsSlot).toBeDefined()

    const accountsSlot = wrapper.find('template[slot="accounts"]')
    expect(accountsSlot).toBeDefined()
  })
})
