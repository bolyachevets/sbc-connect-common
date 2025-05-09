<script setup lang="ts">
import type { HeaderOptions } from '~/types/core-app-config'

const { isAuthenticated } = useKeycloak()

const config = useAppConfig().connect.core.header.options as HeaderOptions
</script>
<template>
  <ConnectHeaderWrapper>
    <div class="flex items-center justify-between">
      <ConnectHeaderLogoHomeLink />
      <ClientOnly>
        <div class="flex gap-1">
          <ConnectHeaderAuthenticatedOptions v-if="isAuthenticated" />
          <ConnectHeaderUnauthenticatedOptions v-else />
          <ConnectLocaleSelect v-if="config.localeSelect" />
        </div>
      </ClientOnly>
    </div>
  </ConnectHeaderWrapper>
</template>
