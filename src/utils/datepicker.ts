/**
 * Pure utilities for DatePicker component.
 * Handles conversion between model (ISO/date string) and display/input format.
 */

import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  isValid,
  parseISO,
} from 'date-fns'

export type DatePickerMode = 'date' | 'datetime'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Converts model value (ISO string or yyyy-MM-dd) to display string for trigger.
 * Datetime mode displays in 12-hour format (AM/PM) for the user; model stays as ISO.
 */
export function toDisplayValue(value: string, mode: DatePickerMode): string {
  if (!value?.trim()) return ''
  const d = new Date(value)
  if (!isValid(d)) return ''
  if (mode === 'date') return format(d, 'yyyy-MM-dd')
  const h24 = d.getHours()
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  return `${format(d, 'yyyy-MM-dd')} ${h12}:${pad(d.getMinutes())} ${ampm}`
}

/**
 * Converts model value to native input value (for hidden input fallback).
 */
export function toDateInputValue(value: string, mode: DatePickerMode): string {
  if (!value?.trim()) return ''
  const d = new Date(value)
  if (!isValid(d)) return ''
  if (mode === 'date') {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * Builds a date from date + optional time for model value.
 */
export function buildModelValue(
  date: Date,
  mode: DatePickerMode,
  hours?: number,
  minutes?: number
): string {
  const d = new Date(date)
  if (mode === 'datetime' && hours !== undefined && minutes !== undefined) {
    d.setHours(hours, minutes, 0, 0)
  } else if (mode === 'datetime') {
    d.setHours(d.getHours(), d.getMinutes(), 0, 0)
  } else {
    d.setHours(0, 0, 0, 0)
  }
  return mode === 'date' ? format(d, 'yyyy-MM-dd') : d.toISOString()
}

/**
 * Parses model value to Date.
 */
export function parseModelValue(value: string): Date | null {
  if (!value?.trim()) return null
  const d = typeof value === 'string' && value.length === 10 ? new Date(value + 'T00:00:00') : parseISO(value)
  return isValid(d) ? d : null
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

/**
 * Returns calendar grid days for the given month.
 * Week starts on Sunday (weekStartsOn: 0).
 */
export function getCalendarDays(month: Date, selectedDate: Date | null): CalendarDay[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start, end })
  return days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, month),
    isToday: isToday(date),
    isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
  }))
}

/**
 * Returns short weekday labels (Sun, Mon, ...).
 */
export function getWeekdayLabels(): string[] {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

export function addMonth(d: Date, amount: number): Date {
  return addMonths(d, amount)
}

export function subMonth(d: Date, amount: number): Date {
  return subMonths(d, amount)
}
