import type { DropdownItem } from '#ui/types'

// handle navigation items and functionality
export function useConnectNav () {
  const rtc = useRuntimeConfig()
  const authWebUrl = rtc.public.authWebURL
  const appBaseUrl = rtc.public.baseUrl
  const loginConfig = useAppConfig().connect.core.login

  // const localePath = useLocalePath()
  const { t, locale } = useI18n()
  const { login, logout, isAuthenticated, kcUser } = useKeycloak()
  const accountStore = useConnectAccountStore()

  /** return the correct account creation link based on auth state */
  function createAccountUrl (): string {
    if (isAuthenticated.value) {
      return authWebUrl + 'setup-account'
    } else {
      return authWebUrl + 'choose-authentication-method'
    }
  }

  const basicAccountOptions = computed<DropdownItem[]>(() => {
    const options: DropdownItem[] = [
      {
        label: 'n/a',
        slot: 'account',
        disabled: true
      }
    ]
    if ([LoginSource.BCEID, LoginSource.BCSC].includes(kcUser?.value.loginSource)) {
      options.push({
        label: t('btn.editProfile'),
        icon: 'i-mdi-account-outline',
        to: authWebUrl + 'userprofile'
      })
    }
    options.push({
      label: t('btn.logout'),
      icon: 'i-mdi-logout-variant',
      click: () => logout() // localePath(config.public.appBaseUrl) ?
    })
    return options
  })

  const accountSettingsOptions = computed<DropdownItem[]>(() => {
    const options: DropdownItem[] = [
      {
        label: 'n/a',
        slot: 'settings',
        disabled: true
      },
      {
        label: t('btn.accountInfo'),
        icon: 'i-mdi-information-outline',
        to: authWebUrl + `account/${accountStore.currentAccount.id}/settings/account-info`
      },
      {
        label: t('btn.teamMembers'),
        icon: 'i-mdi-account-group-outline',
        to: authWebUrl + `account/${accountStore.currentAccount.id}/settings/team-members`
      }
    ]
    if ([AccountType.PREMIUM, AccountType.SBC_STAFF, AccountType.STAFF].includes(accountStore.currentAccount.accountType)) {
      options.push({
        label: t('btn.transactions'),
        icon: 'i-mdi-file-document-outline',
        to: authWebUrl + `account/${accountStore.currentAccount.id}/settings/transactions`
      })
    }
    return options
  })

  const switchAccountOptions = computed<DropdownItem[]>(() => {
    const options: DropdownItem[] = []

    if (accountStore.userAccounts.length > 1) {
      options.push({ label: 'n/a', slot: 'accounts', disabled: true })

      accountStore.userAccounts.forEach((account) => {
        const isActive = accountStore.currentAccount.id === account.id
        options.push({
          label: account.label,
          click: () => {
            if (!isActive && account.id) {
              accountStore.switchCurrentAccount(account.id)
            }
          },
          icon: isActive ? 'i-mdi-check' : '',
          class: isActive ? 'bg-bcGovGray-100 text-bcGovColor-activeBlue' : '',
          labelClass: isActive ? 'pl-0' : 'pl-6',
          iconClass: isActive ? 'text-bcGovColor-activeBlue' : ''
        })
      })
    }

    return options
  })

  const createAccountOptions = computed<DropdownItem[]>(() => {
    if ([LoginSource.BCROS, LoginSource.IDIR].includes(kcUser?.value.loginSource)) {
      return []
    }
    return [{ label: t('btn.createAccount'), icon: 'i-mdi-plus', to: createAccountUrl() }]
  })

  const loggedInUserOptions = computed<DropdownItem[][]>(() => {
    const options: DropdownItem[][] = [
      basicAccountOptions.value,
      accountSettingsOptions.value
    ]

    if (switchAccountOptions.value.length > 0) {
      options.push(switchAccountOptions.value)
    }

    if (createAccountOptions.value.length > 0) {
      options.push(createAccountOptions.value)
    }

    return options
  })

  const loginRedirectUrl = loginConfig.redirectPath
    ? appBaseUrl + locale.value + loginConfig.redirectPath
    : undefined

  const loginOptionsMap: Record<'bcsc' | 'bceid' | 'idir', { label: string; icon: string; click: () => Promise<void> }> = {
    bcsc: {
      label: t('label.bcsc'),
      icon: 'i-mdi-account-card-details-outline',
      click: () => login(IdpHint.BCSC, loginRedirectUrl)
    },
    bceid: {
      label: t('label.bceid'),
      icon: 'i-mdi-two-factor-authentication',
      click: () => login(IdpHint.BCEID, loginRedirectUrl)
    },
    idir: {
      label: t('label.idir'),
      icon: 'i-mdi-account-group-outline',
      click: () => login(IdpHint.IDIR, loginRedirectUrl)
    }
  }

  const loggedOutUserOptions = computed<DropdownItem[][]>(() => {
    const options: DropdownItem[][] = [
      [
        {
          label: 'n/a',
          slot: 'method',
          disabled: true
        }
      ]
    ]

    const idps = loginConfig.idps.map(key => loginOptionsMap[key])

    options.push(idps)

    return options
  })

  const loggedOutUserOptionsMobile = computed<DropdownItem[][]>(() => [
    ...loggedOutUserOptions.value,
    [{ label: t('btn.whatsNew'), slot: 'whats-new', icon: 'i-mdi-new-box', click: () => console.log('whats new clicked') }],
    [{ label: t('btn.createAccount'), icon: 'i-mdi-plus', to: createAccountUrl() }]
  ])

  const notificationsOptions = computed<DropdownItem[][]>(() => {
    const count = accountStore.pendingApprovalCount
    const options: DropdownItem[][] = []
    if (count > 0) {
      options.push([{
        label: 'n/a',
        to: authWebUrl + `account/${accountStore.currentAccount.id}/settings/team-members`,
        slot: 'notifications'
      }])
    } else {
      options.push([{ label: t('notifications.none') }])
    }
    return options
  })

  return {
    basicAccountOptions,
    accountSettingsOptions,
    switchAccountOptions,
    createAccountOptions,
    loggedInUserOptions,
    loggedOutUserOptions,
    loggedOutUserOptionsMobile,
    notificationsOptions,
    createAccountUrl
  }
}
