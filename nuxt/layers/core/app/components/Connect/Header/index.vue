<script setup lang="ts">
import { headerOptionsSymbol } from '~/utils/connect-injection-keys'

const { isAuthenticated } = useKeycloak()
const headerOptions = useAppConfig().connect.core.header.options

// using provide to set up for easier prop-drilling in future
provide(headerOptionsSymbol, headerOptions)
</script>
<template>
  <ConnectHeaderWrapper>
    <div class="flex items-center justify-between">
      <ConnectHeaderLogoHomeLink />
      <ClientOnly>
        <div class="flex gap-1">
          <ConnectHeaderAuthenticatedOptions v-if="isAuthenticated" />
          <ConnectHeaderUnauthenticatedOptions v-else />
          <ConnectLocaleSelect v-if="headerOptions.localeSelect" />
        </div>
      </ClientOnly>
    </div>
  </ConnectHeaderWrapper>
</template>
