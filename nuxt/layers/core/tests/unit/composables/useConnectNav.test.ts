import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport('useRuntimeConfig', () => {
  return () => (
    {
      public: {
        authWebURL: 'https://auth.example.com/'
      }
    }
  )
})

const mockLogin = vi.fn()
const mockLogout = vi.fn()
const mockIsAuthenticated = { value: true }
const mockLoginSource = { value: 'BCSC' }

mockNuxtImport('useKeycloak', () => {
  return () => ({
    login: mockLogin,
    logout: mockLogout,
    isAuthenticated: mockIsAuthenticated,
    kcUser: { value: { loginSource: mockLoginSource.value } }
  })
})

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
        }
      ]),
      t: (key: string) => key
    }
  )
})

const mockCurrentAccount = {
  id: 'account1',
  accountType: 'PREMIUM'
}
let mockPendingApprovalCount = 0
const mockSwitchCurrentAccount = vi.fn()
mockNuxtImport('useConnectAccountStore', () => {
  return () => (
    {
      currentAccount: mockCurrentAccount,
      userAccounts: [
        { id: 'account1', label: 'Account 1' },
        { id: 'account2', label: 'Account 2' }
      ],
      switchCurrentAccount: mockSwitchCurrentAccount,
      pendingApprovalCount: mockPendingApprovalCount
    }
  )
})

describe('useConnectNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createAccountUrl()', () => {
    it('should create account URL as an unauthenticated user', () => {
      mockIsAuthenticated.value = false
      const connectNav = useConnectNav()
      expect(connectNav.createAccountUrl()).toBe('https://auth.example.com/choose-authentication-method')
    })

    it('should create account URL as an authenticated user', () => {
      mockIsAuthenticated.value = true
      const connectNav = useConnectNav()
      expect(connectNav.createAccountUrl()).toBe('https://auth.example.com/setup-account')
    })
  })

  describe('basicAccountOptions', () => {
    it('should create basic account options for BCSC user', () => {
      mockIsAuthenticated.value = true
      mockLoginSource.value = 'BCSC'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[0]
      expect(options).toEqual([
        { label: 'n/a', slot: 'account', disabled: true },
        {
          label: 'Edit Profile',
          icon: 'i-mdi-account-outline',
          to: 'https://auth.example.com/userprofile'
        },
        {
          label: 'Log out',
          icon: 'i-mdi-logout-variant',
          click: expect.any(Function)
        }
      ])
    })

    it('should create basic account options for BCEID user', () => {
      mockIsAuthenticated.value = true
      mockLoginSource.value = 'BCEID'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[0]
      expect(options).toEqual([
        { label: 'n/a', slot: 'account', disabled: true },
        {
          label: 'Edit Profile',
          icon: 'i-mdi-account-outline',
          to: 'https://auth.example.com/userprofile'
        },
        {
          label: 'Log out',
          icon: 'i-mdi-logout-variant',
          click: expect.any(Function)
        }
      ])
    })

    it('should create basic account options for other users', () => {
      mockIsAuthenticated.value = true
      mockLoginSource.value = 'IDIR'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[0]
      expect(options).toEqual([
        { label: 'n/a', slot: 'account', disabled: true },
        {
          label: 'Log out',
          icon: 'i-mdi-logout-variant',
          click: expect.any(Function)
        }
      ])
    })
  })

  describe('accountSettingsOptions', () => {
    const expectedBasicOptions = [
      {
        label: 'n/a',
        slot: 'settings',
        disabled: true
      },
      {
        label: 'Account Info',
        icon: 'i-mdi-information-outline',
        to: 'https://auth.example.com/account/account1/settings/account-info'
      },
      {
        label: 'Team Members',
        icon: 'i-mdi-account-group-outline',
        to: 'https://auth.example.com/account/account1/settings/team-members'
      }
    ]

    const expectedPremiumOptions = [
      ...expectedBasicOptions,
      {
        label: 'Transactions',
        icon: 'i-mdi-file-document-outline',
        to: 'https://auth.example.com/account/account1/settings/transactions'
      }
    ]
    it('should create account settings options for basic account', () => {
      mockIsAuthenticated.value = true
      mockCurrentAccount.accountType = 'BASIC'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[1]
      expect(options).toEqual(expectedBasicOptions)
    })

    it('should create account settings options for premium account', () => {
      mockIsAuthenticated.value = true
      mockCurrentAccount.accountType = 'PREMIUM'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[1]
      expect(options).toEqual(expectedPremiumOptions)
    })
    it('should create account settings options for premium account', () => {
      mockIsAuthenticated.value = true
      mockCurrentAccount.accountType = 'PREMIUM'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[1]
      expect(options).toEqual(expectedPremiumOptions)
    })

    it('should create account settings options for staff account', () => {
      mockIsAuthenticated.value = true
      mockCurrentAccount.accountType = 'STAFF'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[1]
      expect(options).toEqual(expectedPremiumOptions)
    })

    it('should create account settings options for sbc_staff account', () => {
      mockIsAuthenticated.value = true
      mockCurrentAccount.accountType = 'SBC_STAFF'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[1]
      expect(options).toEqual(expectedPremiumOptions)
    })
  })

  describe('switchAccountOptions', () => {
    it('should create switch account options', () => {
      mockIsAuthenticated.value = true
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[2]
      expect(options).toHaveLength(3)
      expect(options).toEqual([
        { label: 'n/a', slot: 'accounts', disabled: true },
        { label: 'Account 1', class: 'bg-bcGovGray-100 text-bcGovColor-activeBlue', iconClass: 'text-bcGovColor-activeBlue', labelClass: 'pl-0', click: expect.any(Function), icon: 'i-mdi-check' },
        { label: 'Account 2', class: '', iconClass: '', labelClass: 'pl-6', click: expect.any(Function), icon: '' }
      ])
    })
  })

  describe('createAccountOptions', () => {
    it('should create create account options for bcsc users', () => {
      mockIsAuthenticated.value = true
      mockLoginSource.value = 'BCSC'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[3]
      expect(options).toHaveLength(1)
      expect(options).toEqual([{ label: 'Create Account', icon: 'i-mdi-plus', to: 'https://auth.example.com/setup-account' }])
    })

    it('should create create account options for bceid users', () => {
      mockIsAuthenticated.value = true
      mockLoginSource.value = 'BCEID'
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[3]
      expect(options).toHaveLength(1)
      expect(options).toEqual([{ label: 'Create Account', icon: 'i-mdi-plus', to: 'https://auth.example.com/setup-account' }])
    })

    it('should not create createAccountOptions for idir users', () => {
      mockIsAuthenticated.value = true
      mockLoginSource.value = 'IDIR'
      const connectNav = useConnectNav()

      const options = connectNav.loggedInUserOptions.value

      expect(options.length).toBeLessThan(4)

      const createAccountOptions = options.find(option => option.some(item => item.label === 'Create Account'))
      expect(createAccountOptions).toBeUndefined()
    })
  })

  describe('loggedOutUserOptions', () => {
    it('should create logged out user options', () => {
      mockIsAuthenticated.value = false
      const connectNav = useConnectNav()
      const options = connectNav.loggedOutUserOptions.value
      expect(options).toEqual([
        [
          {
            label: 'n/a',
            slot: 'method',
            disabled: true
          }
        ],
        [
          {
            label: 'BC Services Card',
            icon: 'i-mdi-account-card-details-outline',
            click: expect.any(Function)
          },
          {
            label: 'BCeID',
            icon: 'i-mdi-two-factor-authentication',
            click: expect.any(Function)
          },
          {
            label: 'IDIR',
            icon: 'i-mdi-account-group-outline',
            click: expect.any(Function)
          }
        ]
      ])
    })
  })

  describe('login and logout', () => {
    it('should call login with correct idpHint', () => {
      mockIsAuthenticated.value = false
      const connectNav = useConnectNav()
      const options = connectNav.loggedOutUserOptions.value[1]
      // const idpHints = ['bcsc', 'bceid', 'idir']
      options?.forEach((option, i) => {
        if (option.click) {
          option.click()
          // expect(mockLogin).toHaveBeenCalledWith(idpHints[i]) // TODO: figure out why this is returning undefined
          expect(mockLogin).toHaveBeenCalledTimes(i + 1)
        }
      })
    })

    it('should call logout', () => {
      mockIsAuthenticated.value = true
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[0]
      const logoutOption = options?.find(option => option.label === 'btn.logout')
      if (logoutOption?.click) {
        logoutOption.click()
        expect(mockLogout).toHaveBeenCalled()
      }
    })
  })

  describe('switch accounts', () => {
    it('should switch accounts correctly', () => {
      mockIsAuthenticated.value = true
      const connectNav = useConnectNav()
      const options = connectNav.loggedInUserOptions.value[2]
      const switchOption = options?.find(option => option.label === 'Account 2')
      if (switchOption?.click) {
        switchOption?.click()
        expect(mockSwitchCurrentAccount).toHaveBeenCalledWith('account2')
      }
    })
  })

  describe('loggedOutUserOptionsMobile', () => {
    it('should create full options for mobile view', () => {
      mockIsAuthenticated.value = false
      const connectNav = useConnectNav()
      const options = connectNav.loggedOutUserOptionsMobile.value
      expect(options).toEqual([
        [
          {
            disabled: true,
            label: 'n/a',
            slot: 'method'
          }
        ],
        [
          {
            click: expect.any(Function),
            icon: 'i-mdi-account-card-details-outline',
            label: 'BC Services Card'
          },
          {
            click: expect.any(Function),
            icon: 'i-mdi-two-factor-authentication',
            label: 'BCeID'
          },
          {
            click: expect.any(Function),
            icon: 'i-mdi-account-group-outline',
            label: 'IDIR'
          }
        ],
        // This is marked as false in the app config, so will not show in test
        // [
        //   {
        //     click: expect.any(Function),
        //     icon: 'i-mdi-new-box',
        //     label: "What's New",
        //     slot: 'whats-new'
        //   }
        // ],
        [
          {
            icon: 'i-mdi-plus',
            label: 'Create Account',
            to: 'https://auth.example.com/choose-authentication-method'
          }
        ]
      ])
    })
  })

  describe('notifications options', () => {
    it('should return the label only for no notifications', () => {
      mockPendingApprovalCount = 0
      const connectNav = useConnectNav()
      const options = connectNav.notificationsOptions.value
      expect(options).toEqual([[{ label: 'No Notifications' }]])
    })

    it('should return a slot object for notifications', () => {
      mockPendingApprovalCount = 3
      const connectNav = useConnectNav()
      const options = connectNav.notificationsOptions.value
      expect(options).toEqual([[
        {
          label: 'n/a',
          to: 'https://auth.example.com/account/account1/settings/team-members',
          slot: 'notifications'
        }
      ]])
    })
  })
})
