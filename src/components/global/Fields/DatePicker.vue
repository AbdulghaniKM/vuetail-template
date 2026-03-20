<template>
  <div ref="containerRef" class="relative flex w-full flex-col gap-1.5">
    <!-- Label -->
    <label v-if="label" :for="inputId" class="text-text text-sm font-medium">{{ label }}</label>

    <!-- Trigger -->
    <div class="relative">
      <button
        :id="inputId"
        type="button"
        :disabled="readonly"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        class="flex w-full items-center gap-2 rounded-xl border bg-surface px-3.5 py-2.5 text-start text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        :class="[
          error ? 'border-error focus:border-error focus:ring-error/20' : 'border-border focus:border-primary',
          customClass,
        ]"
        @click="toggle"
      >
        <AppIcon name="icon-[heroicons-outline--calendar-days]" :size="1.125" class="text-text-secondary shrink-0" />
        <span class="flex-1 truncate" :class="displayValue ? 'text-text' : 'text-text-secondary'">
          {{ displayValue || placeholder }}
        </span>
        <button
          v-if="displayValue && !readonly"
          type="button"
          class="text-text-secondary hover:text-text shrink-0 transition-colors"
          aria-label="Clear date"
          @click.stop="clearValue"
        >
          <AppIcon name="icon-[heroicons-outline--x-mark]" :size="0.875" />
        </button>
      </button>
    </div>

    <!-- Dropdown -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-1"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-1"
      >
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="fixed z-[9998] w-[20rem] overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
          :style="dropdownStyle"
        >
          <!-- Header: month/year nav -->
          <div class="flex items-center justify-between border-b border-border px-4 py-3">
            <button type="button" class="flex size-8 items-center justify-center rounded-lg text-text-secondary hover:bg-muted hover:text-text transition-colors" aria-label="Previous month" @click="prevMonth">
              <AppIcon name="icon-[heroicons-outline--chevron-left]" :size="1.125" />
            </button>

            <div class="flex items-center gap-1">
              <!-- Month select -->
              <div class="relative">
                <select
                  :value="viewMonth.getMonth()"
                  class="appearance-none rounded-lg border border-border bg-surface py-1 pe-6 ps-2.5 text-sm font-semibold text-text cursor-pointer transition-all hover:bg-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  @change="setMonth(Number(($event.target as HTMLSelectElement).value))"
                >
                  <option v-for="(m, i) in monthNames" :key="i" :value="i">{{ m }}</option>
                </select>
                <AppIcon
                  name="icon-[heroicons-outline--chevron-down]"
                  :size="0.75"
                  class="text-text-secondary pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2"
                />
              </div>
              <!-- Year select -->
              <div class="relative">
                <select
                  :value="viewMonth.getFullYear()"
                  class="appearance-none rounded-lg border border-border bg-surface py-1 pe-6 ps-2.5 text-sm font-semibold text-text cursor-pointer transition-all hover:bg-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  @change="setYear(Number(($event.target as HTMLSelectElement).value))"
                >
                  <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
                </select>
                <AppIcon
                  name="icon-[heroicons-outline--chevron-down]"
                  :size="0.75"
                  class="text-text-secondary pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            <button type="button" class="flex size-8 items-center justify-center rounded-lg text-text-secondary hover:bg-muted hover:text-text transition-colors" aria-label="Next month" @click="nextMonth">
              <AppIcon name="icon-[heroicons-outline--chevron-right]" :size="1.125" />
            </button>
          </div>

          <!-- Weekday headers -->
          <div class="grid grid-cols-7 border-b border-border/50 px-3 py-2">
            <span v-for="(day, i) in weekdayLabels" :key="i" class="text-center text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              {{ day }}
            </span>
          </div>

          <!-- Calendar grid -->
          <div class="grid grid-cols-7 gap-px p-3">
            <button
              v-for="day in calendarDays"
              :key="day.date.getTime()"
              type="button"
              class="flex size-9 items-center justify-center rounded-lg text-sm transition-colors"
              :class="getDayClass(day)"
              :disabled="!isDaySelectable(day)"
              @click="selectDay(day)"
            >
              {{ day.date.getDate() }}
            </button>
          </div>

          <!-- Time picker section (datetime mode) -->
          <div v-if="mode === 'datetime'" class="border-t border-border px-3 py-2">
            <TimePickerClock
              :hours="localHours"
              :minutes="localMinutes"
              @update:hours="onHoursUpdate"
              @update:minutes="onMinutesUpdate"
            />
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between border-t border-border px-4 py-2.5">
            <button
              type="button"
              class="text-primary text-xs font-medium hover:underline"
              @click="goToToday"
            >
              Today
            </button>
            <AppButton
              v-if="mode === 'datetime'"
              variant="primary"
              label="Done"
              size="xs"
              @click="isOpen = false"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Error -->
    <span
      v-if="error"
      :id="`${inputId}-error`"
      class="text-error text-sm"
      role="alert"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { onClickOutside } from '@vueuse/core'
import AppIcon from '../AppIcon.vue'
import AppButton from '../AppButton.vue'
import TimePickerClock from './TimePickerClock.vue'
import { useKeyboard } from '../../../composables/useKeyboard'
import {
  toDisplayValue,
  buildModelValue,
  parseModelValue,
  getCalendarDays,
  getWeekdayLabels,
  addMonth,
  subMonth,
  type DatePickerMode,
} from '../../../utils/datepicker'

export type { DatePickerMode }

let idCounter = 0

interface Props {
  modelValue: string
  label?: string
  mode?: DatePickerMode
  placeholder?: string
  readonly?: boolean
  error?: string
  customClass?: string
  min?: string
  max?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'date',
  placeholder: 'Select date',
  readonly: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const isOpen = ref(false)
const viewMonth = ref(new Date())
const localHours = ref(0)
const localMinutes = ref(0)
const containerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

const inputId = computed(() => props.id ?? `datepicker-${++idCounter}`)
const displayValue = computed(() => toDisplayValue(props.modelValue, props.mode))
const selectedDate = computed(() => parseModelValue(props.modelValue))
const weekdayLabels = getWeekdayLabels()

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const yearRange = computed(() => {
  const current = new Date().getFullYear()
  const years: number[] = []
  for (let y = current - 100; y <= current + 20; y++) years.push(y)
  return years
})

const calendarDays = computed(() => getCalendarDays(viewMonth.value, selectedDate.value))

// ── Dropdown positioning ────────────────────────────────────────────
const dropdownStyle = ref<Record<string, string>>({})

function updatePosition() {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const dropdownHeight = 420

  if (spaceBelow >= dropdownHeight || spaceBelow > rect.top) {
    dropdownStyle.value = {
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
    }
  } else {
    dropdownStyle.value = {
      bottom: `${window.innerHeight - rect.top + 4}px`,
      left: `${rect.left}px`,
    }
  }
}

// ── Open / close ────────────────────────────────────────────────────
function toggle() {
  if (props.readonly) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    const d = selectedDate.value ?? new Date()
    viewMonth.value = new Date(d.getFullYear(), d.getMonth(), 1)
    localHours.value = d.getHours()
    localMinutes.value = d.getMinutes()
    nextTick(updatePosition)
  }
}

function clearValue() {
  emit('update:modelValue', '')
}

// Close on click outside
onClickOutside(dropdownRef, () => {
  if (isOpen.value) isOpen.value = false
}, { ignore: [containerRef] })

// Close on Escape
useKeyboard({ escape: () => { if (isOpen.value) isOpen.value = false } }, isOpen)

// Reposition on scroll/resize
function onReposition() {
  if (isOpen.value) updatePosition()
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', onReposition, true)
  window.addEventListener('resize', onReposition)
}

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onReposition, true)
    window.removeEventListener('resize', onReposition)
  }
})

// ── Month / year navigation ─────────────────────────────────────────
function prevMonth() { viewMonth.value = subMonth(viewMonth.value, 1) }
function nextMonth() { viewMonth.value = addMonth(viewMonth.value, 1) }

function setMonth(m: number) {
  viewMonth.value = new Date(viewMonth.value.getFullYear(), m, 1)
}

function setYear(y: number) {
  viewMonth.value = new Date(y, viewMonth.value.getMonth(), 1)
}

function goToToday() {
  const now = new Date()
  viewMonth.value = new Date(now.getFullYear(), now.getMonth(), 1)
  selectDay({ date: now, isCurrentMonth: true, isToday: true, isSelected: false })
}

// ── Day selection ───────────────────────────────────────────────────
function getDayClass(day: { isCurrentMonth: boolean; isToday: boolean; isSelected: boolean }) {
  if (day.isSelected) return 'bg-primary text-white font-medium hover:bg-primary/90'
  if (day.isToday) return 'bg-primary/10 text-primary font-medium hover:bg-primary/20'
  if (!day.isCurrentMonth) return 'text-text-secondary/40'
  return 'text-text hover:bg-muted'
}

function isDaySelectable(day: { date: Date; isCurrentMonth: boolean }) {
  if (!day.isCurrentMonth) return false
  const d = day.date.getTime()
  if (props.min) {
    const minD = parseModelValue(props.min)
    if (minD && d < new Date(minD.getFullYear(), minD.getMonth(), minD.getDate()).getTime()) return false
  }
  if (props.max) {
    const maxD = parseModelValue(props.max)
    if (maxD && d > new Date(maxD.getFullYear(), maxD.getMonth(), maxD.getDate(), 23, 59, 59).getTime()) return false
  }
  return true
}

function selectDay(day: { date: Date; isCurrentMonth: boolean }) {
  if (!isDaySelectable(day)) return
  const base = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate())
  const value = buildModelValue(base, props.mode, localHours.value, localMinutes.value)
  nextTick(() => {
    emit('update:modelValue', value)
    if (props.mode === 'date') isOpen.value = false
  })
}

// ── Time updates ────────────────────────────────────────────────────
function onHoursUpdate(h: number) { localHours.value = h; applyTime() }
function onMinutesUpdate(m: number) { localMinutes.value = m; applyTime() }

function applyTime() {
  const d = selectedDate.value ?? new Date()
  const base = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  emit('update:modelValue', buildModelValue(base, props.mode, localHours.value, localMinutes.value))
}

watch(
  () => props.modelValue,
  (val) => {
    const d = parseModelValue(val)
    if (d) {
      localHours.value = d.getHours()
      localMinutes.value = d.getMinutes()
    }
  },
  { immediate: true },
)
</script>
