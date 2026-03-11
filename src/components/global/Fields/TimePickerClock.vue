<template>
  <div class="time-picker-clock flex flex-col items-center gap-2">
    <!-- Editable time inputs (12h format) -->
    <div class="flex items-center gap-1.5">
      <div class="flex flex-col gap-0.5">
        <label class="text-text-secondary text-[10px]">Hour</label>
        <input
          v-model="hoursInput"
          type="number"
          min="1"
          max="12"
          class="w-11 rounded border border-border bg-surface px-2 py-1.5 text-center text-xs text-text"
          @blur="commitHours"
          @keydown.enter="commitHours"
        />
      </div>
      <span class="text-text mt-5 text-base font-medium">:</span>
      <div class="flex flex-col gap-0.5">
        <label class="text-text-secondary text-[10px]">Minute</label>
        <input
          v-model="minutesInput"
          type="number"
          min="0"
          max="59"
          class="w-12 rounded border border-border bg-surface px-2 py-1.5 text-center text-xs text-text"
          @blur="commitMinutes"
          @keydown.enter="commitMinutes"
        />
      </div>
      <div class="flex flex-col gap-0.5">
        <label class="text-text-secondary text-[10px]">AM/PM</label>
        <div class="flex gap-0.5">
          <button
            type="button"
            class="flex-1 rounded border px-2 py-1.5 text-center text-xs font-medium transition-colors"
            :class="!isPM ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text hover:bg-muted'"
            @click="setAMPM(false)"
          >
            AM
          </button>
          <button
            type="button"
            class="flex-1 rounded border px-2 py-1.5 text-center text-xs font-medium transition-colors"
            :class="isPM ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text hover:bg-muted'"
            @click="setAMPM(true)"
          >
            PM
          </button>
        </div>
      </div>
    </div>

    <!-- Mode toggle for clock -->
    <div class="flex gap-1">
      <button
        type="button"
        class="rounded px-2 py-1 text-xs font-medium transition-colors"
        :class="mode === 'hour' ? 'bg-primary text-white' : 'bg-muted text-text-secondary hover:bg-muted/80'"
        @click="mode = 'hour'"
      >
        Hour
      </button>
      <button
        type="button"
        class="rounded px-2 py-1 text-xs font-medium transition-colors"
        :class="mode === 'minute' ? 'bg-primary text-white' : 'bg-muted text-text-secondary hover:bg-muted/80'"
        @click="mode = 'minute'"
      >
        Minute
      </button>
    </div>

    <!-- Analog clock -->
    <div
      ref="clockRef"
      class="relative flex size-32 max-w-full items-center justify-center rounded-full border-2 border-border bg-surface sm:size-36"
      @mousedown="onPointerDown"
      @touchstart.passive="onPointerDown"
    >
      <svg class="size-full" viewBox="0 0 100 100">
        <!-- Hour markers (12h) -->
        <g v-if="mode === 'hour'">
          <circle
            v-for="h in 12"
            :key="h"
            :cx="50 + 42 * Math.cos(angleForValue(h === 12 ? 0 : h, 12))"
            :cy="50 + 42 * Math.sin(angleForValue(h === 12 ? 0 : h, 12))"
            r="2"
            class="fill-border"
          />
          <text
            v-for="n in [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]"
            :key="`t${n}`"
            :x="50 + 30 * Math.cos(angleForValue(n === 12 ? 0 : n, 12))"
            :y="50 + 30 * Math.sin(angleForValue(n === 12 ? 0 : n, 12))"
            class="fill-current text-[7px] font-medium"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ n }}
          </text>
        </g>
        <!-- Minute markers (0, 15, 30, 45) -->
        <g v-else>
          <circle
            v-for="m in [0, 15, 30, 45]"
            :key="m"
            :cx="50 + 42 * Math.cos(angleForValue(m, 60))"
            :cy="50 + 42 * Math.sin(angleForValue(m, 60))"
            r="3"
            class="fill-border"
          />
          <text
            v-for="m in [0, 15, 30, 45]"
            :key="`tm${m}`"
            :x="50 + 30 * Math.cos(angleForValue(m, 60))"
            :y="50 + 30 * Math.sin(angleForValue(m, 60))"
            class="fill-current text-[8px] font-medium"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ String(m).padStart(2, '0') }}
          </text>
        </g>

        <!-- Hour hand (12h display) -->
        <line
          v-if="mode === 'hour'"
          x1="50"
          y1="50"
          :x2="50 + 24 * Math.cos(angleForValue(displayHour12 === 12 ? 0 : displayHour12, 12))"
          :y2="50 + 24 * Math.sin(angleForValue(displayHour12 === 12 ? 0 : displayHour12, 12))"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          class="text-primary"
        />
        <!-- Minute hand -->
        <line
          x1="50"
          y1="50"
          :x2="50 + 28 * Math.cos(angleForValue(props.minutes, 60))"
          :y2="50 + 28 * Math.sin(angleForValue(props.minutes, 60))"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          :class="mode === 'minute' ? 'text-primary' : 'text-text-secondary'"
        />
        <circle cx="50" cy="50" r="3" class="fill-primary" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  hours: number
  minutes: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:hours': [value: number]
  'update:minutes': [value: number]
}>()

const clockRef = ref<HTMLElement | null>(null)
const mode = ref<'hour' | 'minute'>('minute')
const isPM = ref(props.hours >= 12)
const displayHour12 = ref(to12h(props.hours))
const hoursInput = ref(String(displayHour12.value))
const minutesInput = ref(String(props.minutes).padStart(2, '0'))

function to12h(h24: number): number {
  if (h24 === 0) return 12
  if (h24 <= 12) return h24
  return h24 - 12
}

function to24h(h12: number, pm: boolean): number {
  if (h12 === 12) return pm ? 12 : 0
  return pm ? h12 + 12 : h12
}

function setAMPM(pm: boolean) {
  isPM.value = pm
  const h12 = parseInt(hoursInput.value, 10)
  const val = Number.isNaN(h12) ? displayHour12.value : Math.max(1, Math.min(12, h12))
  emit('update:hours', to24h(val, pm))
}

watch(
  () => [props.hours, props.minutes],
  () => {
    isPM.value = props.hours >= 12
    displayHour12.value = to12h(props.hours)
    hoursInput.value = String(displayHour12.value)
    minutesInput.value = String(props.minutes).padStart(2, '0')
  }
)

/**
 * Convert value (0..max) to angle in radians.
 * 0 at top (12 o'clock), clockwise.
 */
function angleForValue(value: number, max: number): number {
  const deg = (value / max) * 360 - 90
  return (deg * Math.PI) / 180
}

/**
 * Get angle in degrees (0-360) from click position.
 * 0 = top, 90 = right, 180 = bottom, 270 = left.
 */
function getAngleFromPoint(cx: number, cy: number, x: number, y: number): number {
  const dx = x - cx
  const dy = y - cy
  let angle = (Math.atan2(dx, -dy) * 180) / Math.PI
  if (angle < 0) angle += 360
  return angle
}

function angleToHour12(angleDeg: number): number {
  const raw = Math.round((angleDeg / 360) * 12) % 12
  return raw <= 0 ? 12 : raw
}

function angleToMinute(angleDeg: number): number {
  const raw = Math.round((angleDeg / 360) * 60) % 60
  const clamped = raw < 0 ? raw + 60 : raw
  const snap = [0, 15, 30, 45].reduce((a, b) =>
    Math.abs(clamped - a) < Math.abs(clamped - b) ? a : b
  )
  return snap
}

function commitHours() {
  const val = parseInt(hoursInput.value, 10)
  if (!Number.isNaN(val)) {
    const clamped = Math.max(1, Math.min(12, val))
    hoursInput.value = String(clamped)
    displayHour12.value = clamped
    emit('update:hours', to24h(clamped, isPM.value))
  } else {
    hoursInput.value = String(displayHour12.value)
  }
}

function commitMinutes() {
  const val = parseInt(minutesInput.value, 10)
  if (!Number.isNaN(val)) {
    const clamped = Math.max(0, Math.min(59, val))
    minutesInput.value = String(clamped).padStart(2, '0')
    emit('update:minutes', clamped)
  } else {
    minutesInput.value = String(props.minutes).padStart(2, '0')
  }
}

function onPointerDown(e: MouseEvent | TouchEvent) {
  const rect = clockRef.value?.getBoundingClientRect()
  if (!rect) return

  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  const getCoords = (ev: MouseEvent | TouchEvent) => {
    if (ev instanceof MouseEvent) return { x: ev.clientX, y: ev.clientY }
    return { x: ev.touches[0].clientX, y: ev.touches[0].clientY }
  }

  const update = (ev: MouseEvent | TouchEvent) => {
    const { x, y } = getCoords(ev)
    const angle = getAngleFromPoint(cx, cy, x, y)

    if (mode.value === 'hour') {
      const h12 = angleToHour12(angle)
      displayHour12.value = h12
      hoursInput.value = String(h12)
      emit('update:hours', to24h(h12, isPM.value))
    } else {
      const m = angleToMinute(angle)
      emit('update:minutes', m)
      minutesInput.value = String(m).padStart(2, '0')
    }
  }

  update(e)

  const onMove = (ev: MouseEvent | TouchEvent) => {
    ev.preventDefault()
    update(ev)
  }

  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
  document.addEventListener('touchmove', onMove, { passive: false })
  document.addEventListener('touchend', onUp)
}
</script>
