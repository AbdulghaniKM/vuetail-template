<template>
  <AppTooltip v-if="tooltip" :content="tooltip" :placement="tooltipPlacement">
    <button
      type="button"
      class="inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
      :class="[sizeClass, variantClass, gapClass, roundedClass, fullWidth && 'w-full']"
      :disabled="disabled"
      v-bind="$attrs"
    >
      <AppIcon v-if="icon" :name="icon" :size="iconSize" class="shrink-0" />
      <span v-if="!iconOnly && (label || $slots.default)" class="truncate">
        <slot>{{ label }}</slot>
      </span>
    </button>
  </AppTooltip>
  <button
    v-else
    type="button"
    class="inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
    :class="[sizeClass, variantClass, gapClass, roundedClass, fullWidth && 'w-full']"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <AppIcon v-if="icon" :name="icon" :size="iconSize" class="shrink-0" />
    <span v-if="!iconOnly && (label || $slots.default)" class="truncate">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppTooltip from './AppTooltip.vue'
import AppIcon from './AppIcon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'muted' | 'danger' | 'surface' | 'outline'
    icon?: string
    label?: string
    tooltip?: string
    tooltipPlacement?: 'top' | 'bottom' | 'start' | 'end'
    iconOnly?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    disabled?: boolean
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
  }
)

const sizeClass = computed(() => {
  if (props.iconOnly && !props.fullWidth) {
    const iconMap = {
      xs: 'size-6 text-xs',
      sm: 'size-8 text-sm',
      md: 'size-10 text-sm',
      lg: 'size-12 text-base',
    }
    return iconMap[props.size]
  }
  const textMap = {
    xs: 'h-7 px-2.5 text-xs',
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  }
  return textMap[props.size]
})

const gapClass = computed(() => {
  if (props.iconOnly) return 'gap-0'
  const map = { xs: 'gap-1', sm: 'gap-1.5', md: 'gap-2', lg: 'gap-2.5' }
  return map[props.size]
})

const roundedClass = computed(() => {
  if (props.iconOnly) return 'rounded-lg'
  const map = { xs: 'rounded-md', sm: 'rounded-lg', md: 'rounded-lg', lg: 'rounded-xl' }
  return map[props.size]
})

const variantClass = computed(() => {
  const map = {
    primary: 'bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow-md',
    ghost: 'text-text-secondary hover:bg-muted hover:text-text',
    muted: 'bg-muted/50 text-text-secondary hover:bg-muted hover:text-text',
    danger: 'bg-error/10 text-error hover:bg-error/20',
    surface: 'bg-surface text-primary border border-border shadow-sm hover:bg-muted hover:shadow',
    outline: 'border border-border bg-transparent text-text hover:bg-muted',
  }
  return map[props.variant]
})

const iconSize = computed(() => {
  const map = { xs: 0.75, sm: 1, md: 1.125, lg: 1.25 }
  return map[props.size]
})
</script>
