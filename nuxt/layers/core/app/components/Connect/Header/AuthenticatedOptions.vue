<script setup lang="ts">
import type { HeaderOptions } from '~/types/core-app-config'
import { headerOptionsSymbol } from '~/utils/connect-injection-keys'

const config = inject<HeaderOptions>(headerOptionsSymbol)
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
