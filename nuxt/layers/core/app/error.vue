<script setup lang="ts">
import type { NuxtError } from '#app'

const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  error: { type: Object as () => NuxtError, default: undefined }
})

// TODO: update with other error codes?
const errorKey: string | number = props.error?.statusCode === 404 ? 404 : 'unknown'

// cant use definePageMeta in error.vue
useRoute().meta.hideBreadcrumbs = true

useHead({
  title: errorKey === 404 ? t('ConnectPage.error.404.title') : t('ConnectPage.error.unknown.title')
})

const manageError = async () => {
  clearError()
  await navigateTo(localePath('/'))
}

const errorObj = {
  name: props.error?.name || '',
  cause: props.error?.cause || '',
  message: props.error?.message || '',
  statusCode: props.error?.statusCode || '',
  statusMessage: props.error?.statusMessage || '',
  stack: props.error?.stack || '',
  data: props.error?.data || ''
}

onMounted(() => {
  console.error('Nuxt Application Error: ', errorObj)
})
</script>
<template>
  <NuxtLayout name="default">
    <div class="m-auto flex flex-col items-center gap-4">
      <h1>
        {{ $t(`ConnectPage.error.${errorKey}.h1`) }}
      </h1>
      <p>{{ $t(`ConnectPage.error.${errorKey}.content`) }}</p>
      <pre>{{ errorObj }}</pre>
      <UButton
        :label="$t('btn.goHome')"
        icon="i-mdi-home"
        size="bcGov"
        @click="manageError"
      />
    </div>
  </NuxtLayout>
</template>
