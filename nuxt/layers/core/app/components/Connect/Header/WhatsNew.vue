<script setup lang="ts">
const connectSlideover = useConnectSlideover()
</script>
<template>
  <!-- TODO hide/show chip if viewed whats new or not -->
  <UChip color="red" position="top-left" inset>
    <UButton
      variant="header"
      color="white"
      :label="$t('btn.whatsNew')"
      @click="connectSlideover.openWhatsNewSlideover()"
    />
  </UChip>
</template>
