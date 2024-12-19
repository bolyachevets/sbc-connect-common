<script setup lang="ts">
import { useTestStore } from '~/stores/test-store';
import { manageAccountChange } from '../utils/manageAccountChange';

const connectNav = useConnectNav()
const localePath = useLocalePath()
const { isAuthenticated, login, logout } = useKeycloak()
const ldStore = useConnectLaunchdarklyStore()

const actions = [
  {
    label: 'test 1',
    variant: 'outline',
    click: () => console.log('clicked 1')
  },
  {
    label: 'test 2',
    to: 'https://ui.nuxt.com/components/button#props',
    external: true
  }
]

definePageMeta({
  onAccountChange: (newAccount, oldAccount) => manageAccountChange(newAccount, oldAccount)
})

setBreadcrumbs([
  { label: 'test', to: useRuntimeConfig().public.registryHomeURL, appendAccountId: true },
  { label: 'test 2', to: useRuntimeConfig().public.registryHomeURL },
  { label: 'test 3' }
])

onMounted(async () => {
  // const test = ldStore.getStoredFlag('allowable-business-passcode-types')
  // console.log('test: ', test)
  // const route = useRoute()
  // console.log(route)
  const toast = useToast()
  toast.add({ description: 'testing' })

  const { $payApi } = useNuxtApp()

  try {
    await $payApi(`/fees/STRR/STRATAREG`)
  } catch (e) {
    console.error('pay api error: ', e)
  }
  
})
</script>
<template>
  <div class="flex flex-col gap-8 border border-black px-2 py-8">
    <h1>
      Testing
    </h1>

    <UButton label="test 2 page" :to="localePath('/test-2')" />

    <ClientOnly>
      <UButton v-if="!isAuthenticated" label="Login" @click="login(IdpHint.BCSC)" />
      <UButton v-else-if="isAuthenticated" label="Logout" @click="logout()" />
      <div> {{ isAuthenticated }} </div>
    </ClientOnly>

    <ConnectPageSection
      :heading="{ label: 'Hello World', icon: 'i-mdi-account-multiple', bgColor: 'bg-red-200' }"
      :actions="actions"
    >
      some stuff
    </ConnectPageSection>

    <ConnectI18nHelper translation-path="test.i18nBold.italic" />

    Core test store {{ useTestStore().testData }}

    <UButton 
      label="test resetPiniaStores"
      @click="resetPiniaStores(['core-test-store'])"
    />

    <UButton 
      label="Payment Redirect"
      @click="connectNav.handlePaymentRedirect(123, '/')"
    />
    
    <UButton 
      label="External Redirect"
      @click="connectNav.handleExternalRedirect('https://www.bcregistry.gov.bc.ca/', undefined, '_blank')"
    />
  </div>
</template>
