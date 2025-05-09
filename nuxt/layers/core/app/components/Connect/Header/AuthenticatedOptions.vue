<script setup lang="ts">
import type { HeaderOptions } from '~/types/core-app-config'

const config = useAppConfig().connect.core.header.options as HeaderOptions
</script>
<template>
  <div
    id="connect-header-auth-options"
    class="flex gap-1"
  >
    <!-- notifications dropdown -->
    <ConnectHeaderNotifications v-if="config?.authenticated.notifications" />
    <!-- account options dropdown -->
    <ConnectHeaderAccountOptionsDropdown v-if="config?.authenticated.accountOptionsMenu" />
  </div>
</template>
