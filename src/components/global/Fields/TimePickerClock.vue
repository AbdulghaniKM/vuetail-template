<template>
  <div class="flex items-center justify-center gap-0.5">
    <!-- Hour column -->
    <div class="flex flex-col items-center">
      <button type="button" class="flex size-6 items-center justify-center rounded text-text-secondary hover:bg-muted hover:text-text transition-colors" aria-label="Increase hour" @click="adjustHour(1)">
        <AppIcon name="icon-[heroicons-outline--chevron-up]" :size="0.75" />
      </button>
      <input
        :value="displayHour"
        type="text"
        inputmode="numeric"
        maxlength="2"
        aria-label="Hour"
        class="w-8 rounded-lg border border-border bg-background py-1 text-center text-sm font-semibold text-text tabular-nums transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
        @focus="($event.target as HTMLInputElement).select()"
        @blur="commitHours($event)"
        @keydown.enter="($event.target as HTMLInputElement).blur()"
        @keydown.up.prevent="adjustHour(1)"
        @keydown.down.prevent="adjustHour(-1)"
      />
      <button type="button" class="flex size-6 items-center justify-center rounded text-text-secondary hover:bg-muted hover:text-text transition-colors" aria-label="Decrease hour" @click="adjustHour(-1)">
        <AppIcon name="icon-[heroicons-outline--chevron-down]" :size="0.75" />
      </button>
    </div>

    <span class="text-text-secondary text-sm font-bold select-none">:</span>

    <!-- Minute column -->
    <div class="flex flex-col items-center">
      <button type="button" class="flex size-6 items-center justify-center rounded text-text-secondary hover:bg-muted hover:text-text transition-colors" aria-label="Increase minute" @click="adjustMinute(1)">
        <AppIcon name="icon-[heroicons-outline--chevron-up]" :size="0.75" />
      </button>
      <input
        :value="displayMinute"
        type="text"
        inputmode="numeric"
        maxlength="2"
        aria-label="Minute"
        class="w-8 rounded-lg border border-border bg-background py-1 text-center text-sm font-semibold text-text tabular-nums transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
        @focus="($event.target as HTMLInputElement).select()"
        @blur="commitMinutes($event)"
        @keydown.enter="($event.target as HTMLInputElement).blur()"
        @keydown.up.prevent="adjustMinute(1)"
        @keydown.down.prevent="adjustMinute(-1)"
      />
      <button type="button" class="flex size-6 items-center justify-center rounded text-text-secondary hover:bg-muted hover:text-text transition-colors" aria-label="Decrease minute" @click="adjustMinute(-1)">
        <AppIcon name="icon-[heroicons-outline--chevron-down]" :size="0.75" />
      </button>
    </div>

    <!-- AM/PM -->
    <div class="ml-1 flex flex-col gap-0.5">
      <button
        type="button"
        class="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide transition-colors"
        :class="!isPM ? 'bg-primary text-white' : 'bg-muted text-text-secondary hover:text-text'"
        @click="togglePeriod(false)"
      >AM</button>
      <button
        type="button"
        class="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide transition-colors"
        :class="isPM ? 'bg-primary text-white' : 'bg-muted text-text-secondary hover:text-text'"
        @click="togglePeriod(true)"
      >PM</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import AppIcon from '../AppIcon.vue'

const props = defineProps<{ hours: number; minutes: number }>()
const emit = defineEmits<{ 'update:hours': [value: number]; 'update:minutes': [value: number] }>()

const isPM = ref(props.hours >= 12)

function to12h(h24: number): number {
  if (h24 === 0) return 12
  if (h24 <= 12) return h24
  return h24 - 12
}

function to24h(h12: number, pm: boolean): number {
  if (h12 === 12) return pm ? 12 : 0
  return pm ? h12 + 12 : h12
}

const displayHour = computed(() => String(to12h(props.hours)))
const displayMinute = computed(() => String(props.minutes).padStart(2, '0'))

function adjustHour(delta: number) {
  const h12 = to12h(props.hours)
  let next = h12 + delta
  if (next > 12) next = 1
  if (next < 1) next = 12
  emit('update:hours', to24h(next, isPM.value))
}

function adjustMinute(delta: number) {
  let next = props.minutes + delta
  if (next >= 60) next -= 60
  if (next < 0) next += 60
  emit('update:minutes', next)
}

function commitHours(e: FocusEvent) {
  const val = parseInt((e.target as HTMLInputElement).value, 10)
  if (!Number.isNaN(val)) {
    emit('update:hours', to24h(Math.max(1, Math.min(12, val)), isPM.value))
  }
}

function commitMinutes(e: FocusEvent) {
  const val = parseInt((e.target as HTMLInputElement).value, 10)
  if (!Number.isNaN(val)) {
    emit('update:minutes', Math.max(0, Math.min(59, val)))
  }
}

function togglePeriod(pm: boolean) {
  isPM.value = pm
  emit('update:hours', to24h(to12h(props.hours), pm))
}

watch(() => props.hours, (h) => { isPM.value = h >= 12 })
</script>
