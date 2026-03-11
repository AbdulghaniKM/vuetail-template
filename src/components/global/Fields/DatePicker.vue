<template>
  <div class="datepicker relative flex flex-col gap-1.5 w-full">
    <span v-if="label" class="text-sm font-medium text-text">
      {{ label }}
    </span>
    <button
      :id="inputId"
      type="button"
      :disabled="readonly"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${inputId}-error` : undefined"
      class="datepicker__trigger flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-start text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
      :class="[customClass, { 'border-error focus:border-error focus:ring-error/20': error }]"
      @click="toggle"
    >
      <span :class="displayValue ? 'text-text' : 'text-text/50'">
        {{ displayValue || placeholder }}
      </span>
      <AppIcon
        name="icon-[heroicons-outline--calendar-days]"
        :size="1.25"
        class="text-text-secondary shrink-0"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="datepicker__overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
        @click.self="isOpen = false"
      >
        <div
          class="datepicker__dropdown max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-lg border border-border bg-surface p-4 shadow-xl"
        >
        <!-- Month navigation -->
        <div class="mb-4 flex items-center justify-between">
          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-lg text-text hover:bg-muted transition-colors"
            aria-label="Previous month"
            @click="prevMonth"
          >
            <AppIcon name="icon-[heroicons-outline--chevron-left]" :size="1.25" />
          </button>
          <span class="text-sm font-medium text-text">{{ monthLabel }}</span>
          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-lg text-text hover:bg-muted transition-colors"
            aria-label="Next month"
            @click="nextMonth"
          >
            <AppIcon name="icon-[heroicons-outline--chevron-right]" :size="1.25" />
          </button>
        </div>

        <!-- Weekday headers -->
        <div class="mb-2 grid grid-cols-7 gap-0.5">
          <span
            v-for="(day, i) in weekdayLabels"
            :key="i"
            class="text-center text-xs font-medium text-text-secondary"
          >
            {{ day }}
          </span>
        </div>

        <!-- Calendar grid -->
        <div class="grid grid-cols-7 gap-0.5">
          <button
            v-for="day in calendarDays"
            :key="`${day.date.getTime()}`"
            type="button"
            class="flex size-7 items-center justify-center rounded-md text-sm transition-colors"
            :class="[getDayClass(day), !isDaySelectable(day) && 'cursor-not-allowed opacity-50']"
            :disabled="!isDaySelectable(day)"
            @click="selectDay(day)"
          >
            {{ day.date.getDate() }}
          </button>
        </div>

        <!-- Time picker (datetime mode) -->
        <div v-if="mode === 'datetime'" class="mt-3 border-t border-border pt-3">
          <TimePickerClock
            :hours="localHours"
            :minutes="localMinutes"
            @update:hours="onHoursUpdate"
            @update:minutes="onMinutesUpdate"
          />
        </div>

        <!-- Done button -->
        <div class="mt-4 flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            @click="isOpen = false"
          >
            Done
          </button>
        </div>
        </div>
      </div>
    </Teleport>

    <span
      :id="`${inputId}-error`"
      class="datepicker__error block min-h-[1.25rem] text-sm text-error"
      :class="{ invisible: !error }"
      role="alert"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from '../AppIcon.vue'
import TimePickerClock from './TimePickerClock.vue'
import { format } from 'date-fns'
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

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const viewMonth = ref(new Date())
const localHours = ref(0)
const localMinutes = ref(0)

const inputId = computed(() => props.id ?? `datepicker-${Math.random().toString(36).slice(2, 11)}`)
const displayValue = computed(() => toDisplayValue(props.modelValue, props.mode))
const selectedDate = computed(() => parseModelValue(props.modelValue))
const weekdayLabels = getWeekdayLabels()

const monthLabel = computed(() => format(viewMonth.value, 'MMMM yyyy'))

const calendarDays = computed(() =>
  getCalendarDays(viewMonth.value, selectedDate.value)
)

function toggle() {
  if (props.readonly) return
  isOpen.value = !isOpen.value
  if (isOpen.value && selectedDate.value) {
    viewMonth.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1)
    localHours.value = selectedDate.value.getHours()
    localMinutes.value = selectedDate.value.getMinutes()
  } else if (isOpen.value) {
    viewMonth.value = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    localHours.value = new Date().getHours()
    localMinutes.value = new Date().getMinutes()
  }
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) isOpen.value = false
}

onMounted(() => window.addEventListener('keydown', onEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', onEscape))

function prevMonth() {
  viewMonth.value = subMonth(viewMonth.value, 1)
}

function nextMonth() {
  viewMonth.value = addMonth(viewMonth.value, 1)
}

function getDayClass(day: { isCurrentMonth: boolean; isToday: boolean; isSelected: boolean }) {
  if (day.isSelected) return 'bg-primary text-white hover:bg-primary/90'
  if (day.isToday) return 'bg-primary/10 text-primary font-medium hover:bg-primary/20'
  if (!day.isCurrentMonth) return 'text-text/40 cursor-default'
  return 'text-text hover:bg-muted'
}

function isDaySelectable(day: { date: Date }) {
  const d = day.date
  const dayStart = d.getTime()
  if (props.min) {
    const minD = parseModelValue(props.min)
    if (minD) {
      const minStart = new Date(minD.getFullYear(), minD.getMonth(), minD.getDate()).getTime()
      if (dayStart < minStart) return false
    }
  }
  if (props.max) {
    const maxD = parseModelValue(props.max)
    if (maxD) {
      const maxEnd = new Date(maxD.getFullYear(), maxD.getMonth(), maxD.getDate(), 23, 59, 59).getTime()
      if (dayStart > maxEnd) return false
    }
  }
  return true
}

function selectDay(day: { date: Date; isCurrentMonth: boolean }) {
  if (!isDaySelectable(day)) return
  const baseDate = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate())
  const value = buildModelValue(baseDate, props.mode, localHours.value, localMinutes.value)
  nextTick(() => {
    emit('update:modelValue', value)
    if (props.mode === 'date') {
      isOpen.value = false
    }
  })
}

function onHoursUpdate(h: number) {
  localHours.value = h
  applyTime()
}

function onMinutesUpdate(m: number) {
  localMinutes.value = m
  applyTime()
}

function applyTime() {
  const d = selectedDate.value ?? new Date()
  const baseDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const value = buildModelValue(baseDate, props.mode, localHours.value, localMinutes.value)
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (val: string) => {
    const d = parseModelValue(val)
    if (d) {
      localHours.value = d.getHours()
      localMinutes.value = d.getMinutes()
    }
  },
  { immediate: true }
)
</script>
