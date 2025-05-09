<script setup lang="ts">
import type { HeaderOptions } from '~/types/core-app-config'

const config = useAppConfig().connect.core.header.options as HeaderOptions
</script>
<template>
  <div
    id="connect-header-unauth-options"
    class="flex gap-1"
  >
    <!-- TODO: implement whats new -->
    <!-- whats new slideover -->
    <ConnectHeaderWhatsNew v-if="config?.unauthenticated.whatsNew" class="hidden lg:flex" />
    <!-- login options dropdown or main menu on small screens -->
    <ConnectHeaderLoginOptionsDropdown v-if="config?.unauthenticated.loginMenu" />
    <!-- create account button, hidden on small screens -->
    <ConnectHeaderCreateAccountBtn v-if="config?.unauthenticated.createAccount" class="hidden lg:flex" />
  </div>
</template>
