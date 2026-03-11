<template>
  <AppTooltip v-if="tooltip" :content="tooltip" :placement="tooltipPlacement">
    <button
      type="button"
      class="inline-flex p-1.5 cursor-pointer items-center justify-center rounded-lg transition-colors"
      :class="[sizeClass, variantClass, iconOnly ? 'gap-0' : 'gap-2', fullWidth && 'w-full']"
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
    class="inline-flex p-1.5 cursor-pointer items-center justify-center rounded-lg transition-colors"
    :class="[sizeClass, variantClass, iconOnly ? 'gap-0' : 'gap-2', fullWidth && 'w-full']"
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
  if (props.fullWidth || !props.iconOnly) return 'size-auto'
  const map = {
    xs: 'size-6',
    sm: 'size-8',
    md: 'size-9',
    lg: 'size-10',
  }
  return map[props.size]
})

const variantClass = computed(() => {
  const map = {
    primary: 'text-primary hover:bg-primary/10',
    ghost: 'text-text-secondary hover:bg-muted hover:text-text',
    muted: 'text-text-secondary hover:bg-muted/60 hover:text-text',
    danger: 'text-white/40 hover:bg-error/10 hover:text-error/90',
    surface: 'bg-muted text-primary shadow-sm hover:shadow',
    outline: 'border-border bg-surface text-text hover:bg-muted border',
  }
  return map[props.variant]
})

const iconSize = computed(() =>
  props.size === 'xs' ? 0.625 : props.size === 'sm' ? 1.125 : props.size === 'md' ? 1.25 : 1.5
)
</script>
