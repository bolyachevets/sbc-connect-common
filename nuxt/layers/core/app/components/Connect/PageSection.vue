<script setup lang="ts">
// TODO: test all props and prop types are passed correctly
import type { Button, ButtonVariant } from '#ui/types'

interface HeaderAction extends Omit<Button, 'variant'> {
  click?: (...args: any[]) => void
  variant?: ButtonVariant | string // force variant type
}

defineProps<{
  heading?: {
    label?: string
    labelClass?: string
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    icon?: string
    iconClass?: string
    bgColor?: string
    padding?: string
  },
  actions?: HeaderAction[]
}>()
</script>
<template>
  <UCard
    as="section"
    class="w-full"
    :ui="{
      rounded: 'rounded',
      header: {
        base: 'rounded-t',
        background: heading?.bgColor ?? 'bg-bcGovColor-gray2',
        padding: heading?.padding ?? 'px-4 py-4 sm:px-4',
      },
      body: {
        padding: 'px-0 py-0 sm:p-0',
      },
    }"
  >
    <template v-if="heading?.label || $slots.header" #header>
      <slot name="header">
        <div class="flex items-center justify-between gap-2.5">
          <component :is="heading?.level || 'h2'">
            <div class="flex items-center gap-2.5">
              <UIcon
                v-if="heading?.icon"
                :name="heading.icon"
                :class="heading?.iconClass || 'size-6 shrink-0 text-bcGovColor-activeBlue'"
              />
              <span :class="heading?.labelClass || 'font-semibold text-bcGovColor-darkGray text-base'">{{ heading?.label }}</span>
            </div>
          </component>

          <div class="flex items-center gap-2.5">
            <UButton
              v-for="(action, i) in actions"
              :key="i"
              v-bind="{
                ...action,
                variant: action.variant as ButtonVariant // force cast of button type
              }"
              @click="action.click && action.click()"
            />
          </div>
        </div>
      </slot>
    </template>
    <slot />
  </UCard>
</template>
