<script setup lang="ts">
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})

// set lang and dir attributes on head
useHead({
  htmlAttrs: {
    lang: () => i18nHead.value.htmlAttrs!.lang,
    dir: () => i18nHead.value.htmlAttrs!.dir
  }
})
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <UModals />
    <USlideovers />
  </div>
</template>
