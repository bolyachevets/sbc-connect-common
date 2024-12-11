<script setup lang="ts">
const slideover = useSlideover()
const { $sanitize } = useNuxtApp()
// const ldStore = useConnectLaunchdarklyStore()
// const whatsNew = ldStore.getStoredFlag('whats-new')

interface WhatsNewItem {
  app: string
  date: string
  description: string
  id:number
  priority: boolean
  read: boolean
  title: string
}

const res = await fetch('https://status-api-dev.apps.gold.devops.gov.bc.ca/api/v1/whatsnew')
const whatsnew = await res.json() as WhatsNewItem[]
// console.log(whatsnew)
</script>
<template>
  <USlideover
    :overlay="false"
  >
    <div class="overflow-y-auto">
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
      <div class="flex-1">
        <ol>
          <li
            v-for="item, i in whatsnew"
            :key="i"
            class="flex flex-col border-b border-bcGovGray-500 p-4 last:border-0"
          >
            <h3 class="text-lg">
              {{ item.title }}
            </h3>
            <span class="text-sm text-bcGovGray-700">{{ item.date }}</span>
            <!-- eslint-disable vue/no-v-html -->
            <p
              class="pt-3"
              v-html="$sanitize(item.description)"
            />
          </li>
        </ol>
      </div>
    </div>
  </USlideover>
</template>
