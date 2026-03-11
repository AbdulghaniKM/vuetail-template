<template>
  <div ref="rootRef" class="flex w-full flex-col gap-1.5">
    <span v-if="label" class="text-sm font-medium text-text">
      {{ label }}
    </span>

    <div class="relative">
    <!-- Trigger -->
    <button
      :id="inputId"
      ref="triggerRef"
      type="button"
      :disabled="readonly"
      :aria-expanded="isOpen"
      :aria-haspopup="'listbox'"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${inputId}-error` : undefined"
      class="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-start text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
      :class="[customClass, { 'border-error focus:border-error focus:ring-error/20': error }]"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span :class="selectedLabel ? 'text-text' : 'text-text/50'" class="truncate">
        {{ selectedLabel || placeholder || 'Select...' }}
      </span>
      <AppIcon
        name="icon-[heroicons-outline--chevron-down]"
        :size="1.125"
        class="shrink-0 text-text-secondary transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
        :class="dropAbove ? 'bottom-full mb-1.5' : 'top-full mt-1.5'"
        :style="{ transformOrigin: dropAbove ? 'bottom' : 'top' }"
      >
        <!-- Search -->
        <div v-if="searchable" class="border-b border-border p-2">
          <div class="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5">
            <AppIcon name="icon-[heroicons-outline--magnifying-glass]" :size="0.875" class="shrink-0 text-text-secondary" />
            <input
              ref="searchRef"
              v-model="searchQuery"
              type="text"
              class="w-full bg-transparent text-sm text-text placeholder:text-text/40 focus:outline-none"
              placeholder="Search..."
              @keydown="onListKeydown"
            />
          </div>
        </div>

        <!-- Options list -->
        <ul
          ref="listRef"
          role="listbox"
          :aria-activedescendant="highlightedIndex >= 0 ? `${inputId}-opt-${highlightedIndex}` : undefined"
          class="max-h-52 overflow-y-auto overscroll-contain p-1 scrollbar-thin"
          @keydown="onListKeydown"
        >
          <li
            v-if="filteredItems.length === 0"
            class="px-3 py-2.5 text-center text-sm text-text-secondary"
          >
            No results found
          </li>
          <li
            v-for="(item, index) in filteredItems"
            :id="`${inputId}-opt-${index}`"
            :key="item.value"
            role="option"
            :aria-selected="isSelected(item)"
            class="flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors"
            :class="[
              isSelected(item)
                ? 'bg-primary/10 font-medium text-primary'
                : index === highlightedIndex
                  ? 'bg-muted text-text'
                  : 'text-text hover:bg-muted',
            ]"
            @click="selectItem(item)"
            @mouseenter="highlightedIndex = index"
          >
            <span class="truncate">{{ item.label }}</span>
            <AppIcon
              v-if="isSelected(item)"
              name="icon-[heroicons-outline--check]"
              :size="1"
              class="shrink-0 text-primary"
            />
          </li>
        </ul>
      </div>
    </Transition>
    </div>

    <span
      :id="`${inputId}-error`"
      class="block min-h-[1.25rem] text-sm text-error"
      :class="{ invisible: !error }"
      role="alert"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from '../AppIcon.vue'

export interface SelectItem {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number
  label?: string
  items: string[] | SelectItem[]
  placeholder?: string
  readonly?: boolean
  error?: string
  customClass?: string
  searchable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  readonly: false,
  searchable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = computed(() => `select-${Math.random().toString(36).slice(2, 11)}`)

const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const dropAbove = ref(false)

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

const normalizedItems = computed<SelectItem[]>(() =>
  props.items.map((item) =>
    typeof item === 'string' ? { label: item, value: item } : item
  )
)

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return normalizedItems.value
  return normalizedItems.value.filter((item) =>
    item.label.toLowerCase().includes(q)
  )
})

const selectedLabel = computed(() => {
  if (props.modelValue === '' || props.modelValue == null) return ''
  const found = normalizedItems.value.find((i) => String(i.value) === String(props.modelValue))
  return found?.label ?? ''
})

function isSelected(item: SelectItem) {
  return String(item.value) === String(props.modelValue)
}

function computeDropDirection() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  dropAbove.value = spaceBelow < 240 && rect.top > spaceBelow
}

function toggle() {
  if (props.readonly) return
  isOpen.value ? close() : open()
}

function open() {
  computeDropDirection()
  isOpen.value = true
  searchQuery.value = ''
  highlightedIndex.value = -1
  nextTick(() => {
    if (props.searchable && searchRef.value) {
      searchRef.value.focus()
    } else {
      listRef.value?.focus()
    }
  })
}

function close() {
  isOpen.value = false
  searchQuery.value = ''
  highlightedIndex.value = -1
  triggerRef.value?.focus()
}

function selectItem(item: SelectItem) {
  const original = normalizedItems.value.find((i) => String(i.value) === String(item.value))
  if (original) {
    emit('update:modelValue', original.value)
  }
  close()
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (!isOpen.value) open()
  }
}

function onListKeydown(e: KeyboardEvent) {
  const items = filteredItems.value
  if (!items.length) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = (highlightedIndex.value + 1) % items.length
      scrollToHighlighted()
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = highlightedIndex.value <= 0 ? items.length - 1 : highlightedIndex.value - 1
      scrollToHighlighted()
      break
    case 'Enter':
      e.preventDefault()
      if (highlightedIndex.value >= 0 && highlightedIndex.value < items.length) {
        selectItem(items[highlightedIndex.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      close()
      break
  }
}

function scrollToHighlighted() {
  nextTick(() => {
    const el = listRef.value?.querySelector(`#${inputId.value}-opt-${highlightedIndex.value}`) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  })
}

// Reset highlight when search changes
watch(searchQuery, () => {
  highlightedIndex.value = filteredItems.value.length > 0 ? 0 : -1
})

// Click outside
function onClickOutside(e: MouseEvent) {
  if (!isOpen.value) return
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    close()
  }
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('keydown', onEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onEscape)
})
</script>
