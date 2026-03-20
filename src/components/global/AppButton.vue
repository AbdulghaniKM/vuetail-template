<template>
  <AppTooltip v-if="tooltip" :content="tooltip" :placement="tooltipPlacement">
    <button
      :type="type"
      class="btn-base inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
      :class="[sizeClass, variantClass, gapClass, roundedClass, fullWidth && 'w-full']"
      :disabled="disabled || loading"
      :aria-busy="loading || undefined"
      v-bind="$attrs"
    >
      <AppSpinner v-if="loading" :size="spinnerSize" class="shrink-0" />
      <AppIcon v-else-if="icon" :name="icon" :size="iconSize" class="shrink-0" />
      <span v-if="!iconOnly && (label || $slots.default)" class="truncate">
        <slot>{{ loading && loadingLabel ? loadingLabel : label }}</slot>
      </span>
    </button>
  </AppTooltip>
  <button
    v-else
    :type="type"
    class="btn-base inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
    :class="[sizeClass, variantClass, gapClass, roundedClass, fullWidth && 'w-full']"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    v-bind="$attrs"
  >
    <AppSpinner v-if="loading" :size="spinnerSize" class="shrink-0" />
    <AppIcon v-else-if="icon" :name="icon" :size="iconSize" class="shrink-0" />
    <span v-if="!iconOnly && (label || $slots.default)" class="truncate">
      <slot>{{ loading && loadingLabel ? loadingLabel : label }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppTooltip from './AppTooltip.vue'
import AppIcon from './AppIcon.vue'
import AppSpinner from './AppSpinner.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'muted' | 'danger' | 'success' | 'surface' | 'outline'
    icon?: string
    label?: string
    tooltip?: string
    tooltipPlacement?: 'top' | 'bottom' | 'start' | 'end'
    iconOnly?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    disabled?: boolean
    loading?: boolean
    loadingLabel?: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'ghost',
    icon: '',
    label: '',
    tooltip: '',
    tooltipPlacement: 'top',
    iconOnly: false,
    size: 'sm',
    fullWidth: false,
    disabled: false,
    loading: false,
    loadingLabel: '',
    type: 'button',
  }
)

const sizeClass = computed(() => {
  if (props.iconOnly && !props.fullWidth) {
    return { xs: 'size-6 text-xs', sm: 'size-8 text-sm', md: 'size-10 text-sm', lg: 'size-12 text-base' }[props.size]
  }
  return { xs: 'h-7 px-2.5 text-xs', sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' }[props.size]
})

const gapClass = computed(() => {
  if (props.iconOnly) return 'gap-0'
  return { xs: 'gap-1', sm: 'gap-1.5', md: 'gap-2', lg: 'gap-2.5' }[props.size]
})

const roundedClass = computed(() => {
  if (props.iconOnly) return 'rounded-lg'
  return { xs: 'rounded-md', sm: 'rounded-lg', md: 'rounded-lg', lg: 'rounded-xl' }[props.size]
})

const variantClass = computed(() => ({
  primary: 'bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow-md',
  secondary: 'bg-secondary text-white shadow-sm hover:bg-secondary/90 hover:shadow-md',
  ghost: 'text-text-secondary hover:bg-muted hover:text-text',
  muted: 'bg-muted/50 text-text-secondary hover:bg-muted hover:text-text',
  danger: 'bg-error/10 text-error hover:bg-error/20',
  success: 'bg-success/10 text-success hover:bg-success/20',
  surface: 'bg-surface text-primary border border-border shadow-sm hover:bg-muted hover:shadow',
  outline: 'border border-border bg-transparent text-text hover:bg-muted',
})[props.variant])

const iconSize = computed(() => ({ xs: 0.75, sm: 1, md: 1.125, lg: 1.25 })[props.size])
const spinnerSize = computed(() => ({ xs: 'xs', sm: 'xs', md: 'sm', lg: 'sm' } as const)[props.size])
</script>

<style scoped>
.btn-base:not(:disabled):active {
  transform: scale(0.97);
}
</style>
