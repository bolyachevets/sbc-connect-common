<script setup lang="ts">
import { handleAccountChangeAbort } from '../utils/handleAccountChangeAbort';
const localePath = useLocalePath()

setBreadcrumbs([
  { label: 'test 2nd page', to: useRuntimeConfig().public.registryHomeURL }
])

definePageMeta({
  onAccountChange: (newAccount, oldAccount) => handleAccountChangeAbort(newAccount, oldAccount)
})
</script>
<template>
  <div class="flex flex-col gap-8 border border-black px-2 py-8">
    <h1>
      Testing 2 page
    </h1>
    <UButton label="home page" :to="localePath('/')" />
  </div>
</template>
