<script setup lang="ts">
const slideover = useSlideover()
const ldStore = useConnectLaunchdarklyStore()
const whatsNew = ldStore.getStoredFlag('whats-new')
</script>
<template>
  <USlideover :overlay="false">
    <header class="flex items-center justify-between bg-bcGovColor-navDivider p-4">
      <h2 class="text-bcGovColor-header">
        Whats New at BC Registries
      </h2>
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        square
        :padded="false"
        :ui="{
          icon: {
            size: {
              sm: 'h-7 w-7'
            }
          }
        }"
        @click="slideover.close()"
      />
    </header>
    <div class="flex-1 px-4 py-2">
      <ol
        v-for="item in whatsNew"
        :key=""
        class="flex flex-col"
      >
        <li>
          <h3 />
          <span />
        </li>
      </ol>
    </div>
  </USlideover>
</template>
