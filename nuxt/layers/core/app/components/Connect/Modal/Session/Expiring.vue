<script setup lang="ts">
const modalModel = defineModel({ type: Boolean, default: false })
const isSmallScreen = useMediaQuery('(max-width: 640px)')
const modalTimeout = useRuntimeConfig().public.sessionExpiredModalTimeout
const { t } = useI18n()

defineEmits<{
  afterLeave: [void]
}>()

const timeRemaining = ref(toValue((modalTimeout as number) / 1000))
setInterval(() => {
  const value = timeRemaining.value - 1
  timeRemaining.value = value < 0 ? 0 : value
}, 1000)

const ariaCountdownText = computed(() => {
  if (timeRemaining.value % 10 === 0) {
    return t('ConnectModalSessionExpiring.content', { count: timeRemaining.value })
  } else if (timeRemaining.value === 2) {
    return t('ConnectModalSessionExpiring.sessionExpired')
  } else {
    return ''
  }
})

function closeModal () {
  modalModel.value = false
}

// allow any keypress to close the modal
onMounted(() => {
  window.addEventListener('keydown', closeModal)
})
onUnmounted(() => {
  window.removeEventListener('keydown', closeModal)
})
</script>
<template>
  <UModal
    v-model="modalModel"
    overlay
    :ui="{ width: 'w-full sm:max-w-lg md:min-w-min' }"
    @after-leave="$emit('afterLeave')"
  >
    <UCard
      :ui="{
        divide: '',
        rounded: 'rounded',
        body: {
          base: '',
          background: '',
          padding: 'px-6 py-0 sm:px-10 sm:py-0'
        },
        header: {
          base: '',
          background: '',
          padding: 'px-6 py-6 sm:px-10 sm:py-10'
        },
        footer: {
          base: '',
          background: '',
          padding: 'px-6 py-6 sm:px-10 sm:py-10'
        }
      }"
    >
      <template #header>
        <span class="text-xl font-semibold text-bcGovColor-darkGray">{{ $t('ConnectModalSessionExpiring.title') }}</span>
      </template>

      <div>
        <ConnectI18nHelper
          translation-path="ConnectModalSessionExpiring.content"
          :count="timeRemaining"
        />

        <div role="alert">
          <span class="sr-only">{{ ariaCountdownText }}</span>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <UButton
            :block="isSmallScreen"
            :label="$t('ConnectModalSessionExpiring.continueBtn.main')"
            :aria-label="$t('ConnectModalSessionExpiring.continueBtn.aria')"
            size="bcGov"
            class="font-bold"
            @click="modalModel = false"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
