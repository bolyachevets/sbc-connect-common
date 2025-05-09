import { describe, expect, it, vi, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const mockTokenParsed = {
  firstname: 'First',
  lastname: 'Last',
  fullName: 'First Last',
  name: 'First Last',
  username: 'Username',
  email: 'test@email.com',
  sub: '123456',
  loginSource: 'BCSC',
  realm_access: { roles: ['role1', 'role2'] },
  roles: ['public_user']
}
const mockUpdateToken = vi.fn(() => Promise.resolve(true))
const mockLogin = vi.fn()
const mockLogout = vi.fn()
const mockInit = vi.fn().mockResolvedValue(true)

mockNuxtImport('useNuxtApp', () => {
  return () => (
    {
      $keycloak: {
        login: mockLogin,
        logout: mockLogout,
        updateToken: mockUpdateToken,
        init: mockInit,
        authenticated: true,
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        idToken: 'mock-id-token',
        tokenParsed: mockTokenParsed
      },
      $i18n: {
        locale: {
          value: 'en-CA'
        }
      }
    }
  )
})

describe('useKeycloak', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('handles login', () => {
    const { $keycloak } = useNuxtApp()

    // call function
    const keycloak = useKeycloak()
    keycloak.login(IdpHint.BCSC)

    // assert
    expect($keycloak.login).toHaveBeenCalledOnce()
    expect($keycloak.login).toHaveBeenCalledWith({
      idpHint: 'bcsc',
      redirectUri: `${location.origin}/`
    })

    // call function with different redirect
    keycloak.login(IdpHint.IDIR, 'some-other-route')

    // assert
    expect($keycloak.login).toHaveBeenCalledTimes(2)
    expect($keycloak.login).toHaveBeenCalledWith({
      idpHint: 'idir',
      redirectUri: 'some-other-route'
    })
  })

  it('handles logout', () => {
    const { $keycloak } = useNuxtApp()

    // call function
    const keycloak = useKeycloak()
    keycloak.logout()

    // assert
    expect($keycloak.logout).toHaveBeenCalledOnce()
    expect($keycloak.logout).toHaveBeenCalledWith({
      redirectUri: `${location.origin}/`
    })

    // call function with different redirect
    keycloak.logout('some-other-route')

    // assert
    expect($keycloak.logout).toHaveBeenCalledTimes(2)
    expect($keycloak.logout).toHaveBeenCalledWith({
      redirectUri: 'some-other-route'
    })
  })

  it('returns the authenticated value', () => {
    const { isAuthenticated } = useKeycloak()

    // assert
    expect(isAuthenticated.value).toEqual(true)
  })

  it('returns a kcUser object', () => {
    const { kcUser } = useKeycloak()

    // assert
    expect(kcUser.value).toBeDefined()
    expect(kcUser.value).toEqual({
      firstName: mockTokenParsed.firstname,
      lastName: mockTokenParsed.lastname,
      fullName: mockTokenParsed.name,
      userName: mockTokenParsed.username,
      email: mockTokenParsed.email,
      keycloakGuid: mockTokenParsed.sub,
      loginSource: mockTokenParsed.loginSource,
      roles: mockTokenParsed.realm_access.roles
    })
  })

  describe('getToken', () => {
    it('getToken returns token when updateToken is successful', async () => {
      const { $keycloak } = useNuxtApp()

      const keycloak = useKeycloak()

      const token = await keycloak.getToken()
      expect($keycloak.updateToken).toHaveBeenCalledOnce()
      expect($keycloak.updateToken).toHaveBeenCalledWith(30)
      expect(token).toBe('mock-token')
    })

    it('getToken returns token with forceRefresh', async () => {
      const { $keycloak } = useNuxtApp()

      const keycloak = useKeycloak()

      const token = await keycloak.getToken(true)
      expect($keycloak.updateToken).toHaveBeenCalledOnce()
      expect($keycloak.updateToken).toHaveBeenCalledWith(-1)
      expect(token).toBe('mock-token')
    })

    it('getToken handles updateToken failure', async () => {
      const { $keycloak } = useNuxtApp()
      mockUpdateToken.mockImplementationOnce(() => Promise.reject(new Error('Error')))

      const keycloak = useKeycloak()

      const token = await keycloak.getToken()
      expect($keycloak.updateToken).toHaveBeenCalledOnce()
      expect($keycloak.updateToken).toHaveBeenCalledWith(30)
      expect(token).toBeUndefined()
    })
  })
})
