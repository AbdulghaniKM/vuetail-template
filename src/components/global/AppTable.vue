<template>
  <div class="w-full">
    <!-- ── Toolbar ────────────────────────────────────────────────── -->
    <div v-if="searchable || $slots['toolbar-end']" class="mb-3 flex w-full min-w-0 items-center gap-2">
      <div v-if="searchable" class="relative min-w-0 flex-1 sm:max-w-sm">
        <AppIcon
          name="icon-[heroicons-outline--magnifying-glass]"
          :size="1.125"
          class="text-text-secondary pointer-events-none absolute start-3 top-1/2 -translate-y-1/2"
        />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="border-border bg-surface text-text placeholder:text-text-secondary/60 w-full rounded-xl border py-2 pe-9 ps-9 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="text-text-secondary hover:text-text absolute end-2.5 top-1/2 -translate-y-1/2 transition-colors"
          aria-label="Clear search"
          @click="searchQuery = ''; searchInputRef?.focus()"
        >
          <AppIcon name="icon-[heroicons-outline--x-mark]" :size="1" />
        </button>
      </div>
      <div class="flex items-center gap-2">
        <slot name="toolbar-end" />
      </div>
    </div>

    <!-- ── Table wrapper ──────────────────────────────────────────── -->
    <div
      class="overflow-hidden rounded-2xl"
      :class="outlined ? 'border-border border bg-surface' : ''"
    >
      <div class="overflow-x-auto" style="-webkit-overflow-scrolling: touch">
        <table class="w-full min-w-[48rem] border-collapse" style="table-layout: auto">
          <!-- Header -->
          <thead>
            <tr class="bg-muted/60">
              <th
                v-for="column in visibleColumns"
                :key="column.key"
                class="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                :class="[
                  column.class,
                  column.key === 'actions' ? 'sticky-actions-th w-px' : '',
                  'text-text-secondary',
                ]"
              >
                <button
                  v-if="isColumnSortable(column)"
                  type="button"
                  class="group flex items-center gap-1 transition-colors"
                  :class="sortKey === column.key ? 'text-primary' : 'hover:text-text'"
                  @click="handleSort(column.key)"
                >
                  <span>{{ column.label }}</span>
                  <span
                    class="flex size-5 items-center justify-center rounded transition-all"
                    :class="sortKey === column.key ? 'bg-primary/10 opacity-100' : 'opacity-0 group-hover:opacity-50'"
                  >
                    <AppIcon
                      :name="sortKey === column.key && sortOrder === 'desc' ? 'icon-[heroicons-outline--bars-arrow-down]' : 'icon-[heroicons-outline--bars-arrow-up]'"
                      :size="0.875"
                    />
                  </span>
                </button>
                <span v-else>{{ column.label }}</span>
              </th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody>
            <!-- Skeleton loading -->
            <template v-if="loading">
              <tr v-for="i in skeletonRows" :key="`skeleton-${i}`" class="border-border/40 border-b">
                <td v-for="column in visibleColumns" :key="column.key" class="px-4 py-3.5">
                  <div class="bg-muted h-4 animate-pulse rounded-md" :class="column.key === 'actions' ? 'w-16' : 'w-full max-w-[10rem]'" />
                </td>
              </tr>
            </template>

            <!-- Empty state -->
            <tr v-else-if="displayData.length === 0">
              <td :colspan="visibleColumns.length" class="py-16 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="bg-muted flex size-14 items-center justify-center rounded-2xl">
                    <AppIcon name="icon-[heroicons-outline--inbox-stack]" :size="1.75" class="text-text-secondary/50" />
                  </div>
                  <div>
                    <p class="text-text mb-0.5 text-sm font-medium">{{ emptyMessage }}</p>
                    <p v-if="searchQuery" class="text-text-secondary text-xs">Try adjusting your search term</p>
                  </div>
                  <AppButton
                    v-if="searchQuery"
                    variant="ghost"
                    label="Clear search"
                    icon="icon-[heroicons-outline--arrow-path]"
                    size="sm"
                    @click="searchQuery = ''"
                  />
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-for="(row, index) in displayData"
              v-else
              :key="getRowKey(row, index)"
              class="table-row-data border-border/40 border-b transition-colors last:border-b-0 hover:bg-primary/[0.03]"
            >
              <td
                v-for="column in visibleColumns"
                :key="column.key"
                class="text-text min-w-0 whitespace-nowrap px-4 py-3 text-sm"
                :class="[column.class, column.key === 'actions' ? 'sticky-actions-td w-px' : '']"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="getValue(row, column.key)" :column="column">
                  <AppTooltip
                    v-if="column.truncate && getValue(row, column.key)"
                    :content="String(getValue(row, column.key))"
                    placement="top"
                    :dark="false"
                  >
                    <span class="text-text-secondary block max-w-[14rem] truncate text-start text-sm">
                      {{ display(getValue(row, column.key)) }}
                    </span>
                  </AppTooltip>
                  <template v-else>
                    {{ display(getValue(row, column.key)) }}
                  </template>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Bottom bar ─────────────────────────────────────────────── -->
    <div
      v-if="showPagination || showColumnToggle"
      class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <!-- Left: info + controls -->
      <div class="flex flex-wrap items-center gap-2">
        <span v-if="showPagination" class="text-text-secondary text-sm tabular-nums">
          {{ paginationStart }}&ndash;{{ paginationEnd }} {{ ofLabel }} {{ paginationTotal }}
        </span>

        <!-- Page size selector -->
        <div v-if="serverPaginated && pageSizeOptions.length > 0" ref="pageSizeRef" class="relative">
          <button
            type="button"
            class="border-border bg-surface text-text hover:bg-muted flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors"
            @click="showPageSizeMenu = !showPageSizeMenu"
          >
            {{ pageSize }} / page
            <AppIcon name="icon-[heroicons-outline--chevron-up-down]" :size="0.75" class="text-text-secondary" />
          </button>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div v-if="showPageSizeMenu" class="border-border bg-surface absolute bottom-full end-0 z-50 mb-1.5 min-w-[5rem] origin-bottom rounded-xl border p-1 shadow-lg">
              <button
                v-for="n in pageSizeOptions"
                :key="n"
                type="button"
                class="flex w-full items-center justify-center rounded-lg px-3 py-1.5 text-sm transition-colors"
                :class="n === pageSize ? 'bg-primary/10 text-primary font-medium' : 'text-text hover:bg-muted'"
                @click="selectPageSize(n)"
              >
                {{ n }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Column toggle -->
        <div v-if="showColumnToggle" ref="columnToggleRef" class="relative">
          <button
            type="button"
            class="border-border bg-surface text-text-secondary hover:text-text hover:bg-muted flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors"
            aria-haspopup="true"
            :aria-expanded="showColumnMenu"
            @click="showColumnMenu = !showColumnMenu"
          >
            <AppIcon name="icon-[heroicons-outline--view-columns]" :size="1" />
            <span class="text-text-secondary">{{ visibleToggleableCount }}/{{ toggleableColumns.length }}</span>
          </button>
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-1"
          >
            <div
              v-if="showColumnMenu"
              class="border-border bg-surface absolute start-0 bottom-full z-50 mb-1.5 min-w-[13rem] origin-bottom-left rounded-xl border p-1 shadow-xl shadow-black/8"
            >
              <div class="flex items-center justify-between px-3 py-2">
                <p class="text-text-secondary text-xs font-semibold">Columns</p>
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 scale-90"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-90"
                >
                  <span v-if="columnSavedHint" class="text-success bg-success/10 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                    <AppIcon name="icon-[heroicons-outline--check]" :size="0.625" />
                    Saved
                  </span>
                </Transition>
              </div>
              <div class="border-border border-t" />
              <div class="py-1">
                <button
                  v-for="col in toggleableColumns"
                  :key="col.key"
                  type="button"
                  class="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                  :class="visibleColumnsSet.has(col.key) ? 'text-text hover:bg-muted/60' : 'text-text-secondary/60 hover:bg-muted/40'"
                  @click="toggleColumn(col.key)"
                >
                  <span>{{ col.label }}</span>
                  <span
                    class="flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200"
                    :class="visibleColumnsSet.has(col.key) ? 'bg-primary' : 'bg-border'"
                  >
                    <span
                      class="size-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                      :class="visibleColumnsSet.has(col.key) ? 'translate-x-4' : 'translate-x-0'"
                    />
                  </span>
                </button>
              </div>
              <div class="border-border border-t" />
              <button
                type="button"
                class="text-text-secondary hover:bg-muted/60 hover:text-text mt-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors"
                @click="resetColumnVisibility"
              >
                <AppIcon name="icon-[heroicons-outline--arrow-path]" :size="0.875" />
                Reset defaults
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Right: pagination nav -->
      <div v-if="showPagination" class="flex items-center gap-1.5">
        <AppButton
          icon="icon-[heroicons-outline--chevron-left]"
          tooltip="Previous"
          variant="ghost"
          size="sm"
          icon-only
          :disabled="!canGoPrev"
          @click="goToPrev"
        />
        <template v-if="!serverPaginated">
          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            class="flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors"
            :class="
              page === currentPageRef
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-muted hover:text-text'
            "
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </template>
        <span v-else class="text-text px-2 text-sm font-medium tabular-nums">{{ props.pageNumber }}</span>
        <AppButton
          icon="icon-[heroicons-outline--chevron-right]"
          tooltip="Next"
          variant="ghost"
          size="sm"
          icon-only
          :disabled="!canGoNext"
          @click="goToNext"
        />
      </div>
    </div>

    <!-- ── Truncate expand modal (kept for backward compat) ───────── -->
    <AppModal :is-open="truncateModalOpen" :title="truncateModalTitle" max-width="sm" @close="truncateModalOpen = false">
      <p dir="auto" class="text-text whitespace-pre-wrap text-sm leading-relaxed">{{ truncateModalContent }}</p>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside, useDebounceFn } from '@vueuse/core'

import AppSpinner from './AppSpinner.vue'
import AppButton from './AppButton.vue'
import AppIcon from './AppIcon.vue'
import AppTooltip from './AppTooltip.vue'
import AppModal from './AppModal.vue'
import { display } from '../../utils/display'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  hideable?: boolean
  defaultHidden?: boolean
  class?: string
  truncate?: boolean
}

interface Props {
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  outlined?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  paginated?: boolean
  itemsPerPage?: number
  emptyMessage?: string
  loadingMessage?: string
  ofLabel?: string
  rowKey?: string | ((row: any) => string | number)
  serverPaginated?: boolean
  pageNumber?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
  showColumnToggle?: boolean
  columnsVisibilityKey?: string
  pageSizeOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  outlined: true,
  searchable: false,
  searchPlaceholder: 'Search...',
  paginated: false,
  itemsPerPage: 10,
  emptyMessage: 'No data available',
  loadingMessage: 'Loading...',
  ofLabel: 'of',
  rowKey: 'id',
  serverPaginated: false,
  pageNumber: 1,
  pageSize: 15,
  totalCount: 0,
  totalPages: 1,
  showColumnToggle: false,
  columnsVisibilityKey: '',
  pageSizeOptions: () => [10, 15, 25, 50],
})

const emit = defineEmits<{
  pageChange: [payload: { pageNumber: number; pageSize: number }]
  search: [query: string]
}>()

// ── Refs ────────────────────────────────────────────────────────────
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPageRef = ref(1)

// Column toggle
const showColumnMenu = ref(false)
const columnToggleRef = ref<HTMLElement | null>(null)

// Page size
const showPageSizeMenu = ref(false)
const pageSizeRef = ref<HTMLElement | null>(null)

// Truncate modal (kept for backward compat — truncate now uses tooltips)
const truncateModalOpen = ref(false)
const truncateModalTitle = ref('')
const truncateModalContent = ref('')

function openTruncateModal(title: string, content: string) {
  truncateModalTitle.value = title
  truncateModalContent.value = content
  truncateModalOpen.value = true
}

onClickOutside(columnToggleRef, () => { showColumnMenu.value = false })
onClickOutside(pageSizeRef, () => { showPageSizeMenu.value = false })

// ── Skeleton rows ───────────────────────────────────────────────────
const skeletonRows = computed(() => Math.min(props.itemsPerPage, 5))

// ── Column visibility ───────────────────────────────────────────────
const STORAGE_PREFIX = 'app-table-columns-'

function loadColumnVisibility(): Record<string, boolean> {
  if (!props.columnsVisibilityKey) return {}
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + props.columnsVisibilityKey)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const safe: Record<string, boolean> = Object.create(null)
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'boolean') safe[key] = value
    }
    return safe
  } catch {
    return {}
  }
}

function saveColumnVisibility(visibility: Record<string, boolean>) {
  if (!props.columnsVisibilityKey) return
  try {
    localStorage.setItem(STORAGE_PREFIX + props.columnsVisibilityKey, JSON.stringify(visibility))
  } catch { /* ignore */ }
}

const columnVisibility = ref<Record<string, boolean>>(loadColumnVisibility())
const columnSavedHint = ref(false)
let savedHintTimer: ReturnType<typeof setTimeout> | null = null

function showSavedHint() {
  columnSavedHint.value = true
  if (savedHintTimer) clearTimeout(savedHintTimer)
  savedHintTimer = setTimeout(() => { columnSavedHint.value = false }, 1500)
}

const toggleableColumns = computed(() => props.columns.filter((c) => c.hideable !== false))

const visibleColumnsSet = computed(() => {
  const saved = columnVisibility.value
  const set = new Set<string>()
  for (const col of props.columns) {
    if (col.hideable === false) {
      set.add(col.key)
    } else if (saved[col.key] !== undefined) {
      if (saved[col.key]) set.add(col.key)
    } else if (!col.defaultHidden) {
      set.add(col.key)
    }
  }
  return set
})

const visibleColumns = computed(() => props.columns.filter((c) => visibleColumnsSet.value.has(c.key)))

const visibleToggleableCount = computed(() =>
  toggleableColumns.value.filter((c) => visibleColumnsSet.value.has(c.key)).length
)

function toggleColumn(key: string) {
  const currentlyVisible = visibleColumnsSet.value.has(key)
  if (currentlyVisible && visibleColumnsSet.value.size <= 1) return
  const nextVisibility = { ...columnVisibility.value, [key]: !currentlyVisible }
  columnVisibility.value = nextVisibility
  saveColumnVisibility(nextVisibility)
  showSavedHint()
}

function resetColumnVisibility() {
  columnVisibility.value = {}
  if (props.columnsVisibilityKey) {
    try { localStorage.removeItem(STORAGE_PREFIX + props.columnsVisibilityKey) } catch { /* ignore */ }
  }
  showSavedHint()
}

// ── Sort ────────────────────────────────────────────────────────────
const isColumnSortable = (column: TableColumn): boolean => column.sortable === true

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// ── Row helpers ─────────────────────────────────────────────────────
const getRowKey = (row: any, index: number): string | number => {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  return row[props.rowKey] ?? index
}

const getValue = (row: any, key: string): any => {
  const keys = key.split('.')
  let value = row
  for (const k of keys) value = value?.[k]
  return value ?? ''
}

const parseSortValue = (val: any): string | number | Date => {
  if (val == null || val === '') return ''
  if (typeof val === 'number' && !Number.isNaN(val)) return val
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) return new Date(val).getTime()
  return String(val).toLowerCase()
}

// ── Data pipeline ───────────────────────────────────────────────────
const filteredData = computed(() => {
  let result = [...props.data]
  if (props.searchable && searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((row) =>
      props.columns.some((col) => String(getValue(row, col.key)).toLowerCase().includes(q))
    )
  }
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = parseSortValue(getValue(a, sortKey.value!))
      const bVal = parseSortValue(getValue(b, sortKey.value!))
      if (aVal === bVal) return 0
      const cmp = aVal < bVal ? -1 : 1
      return sortOrder.value === 'asc' ? cmp : -cmp
    })
  }
  return result
})

const clientTotalPages = computed(() => props.paginated ? Math.ceil(filteredData.value.length / props.itemsPerPage) : 1)
const clientStartIndex = computed(() => props.paginated ? (currentPageRef.value - 1) * props.itemsPerPage : 0)
const clientEndIndex = computed(() => props.paginated ? Math.min(clientStartIndex.value + props.itemsPerPage, filteredData.value.length) : filteredData.value.length)
const clientPaginatedData = computed(() => props.paginated ? filteredData.value.slice(clientStartIndex.value, clientEndIndex.value) : filteredData.value)
const displayData = computed(() => props.serverPaginated ? props.data : clientPaginatedData.value)

// ── Pagination ──────────────────────────────────────────────────────
const showPagination = computed(() => {
  if (props.serverPaginated) return props.totalCount > 0
  return props.paginated && clientTotalPages.value > 1
})

const paginationStart = computed(() => {
  if (props.serverPaginated) return props.totalCount === 0 ? 0 : (props.pageNumber - 1) * props.pageSize + 1
  return props.totalCount === 0 ? 0 : clientStartIndex.value + 1
})

const paginationEnd = computed(() => {
  if (props.serverPaginated) return Math.min(props.pageNumber * props.pageSize, props.totalCount)
  return clientEndIndex.value
})

const paginationTotal = computed(() => props.serverPaginated ? props.totalCount : filteredData.value.length)

const canGoPrev = computed(() => props.serverPaginated ? props.pageNumber > 1 : currentPageRef.value > 1)
const canGoNext = computed(() => props.serverPaginated ? props.pageNumber < props.totalPages : currentPageRef.value < clientTotalPages.value)

const visiblePages = computed(() => {
  const pages: number[] = []
  const max = 5
  const total = clientTotalPages.value
  let start = Math.max(1, currentPageRef.value - Math.floor(max / 2))
  let end = Math.min(total, start + max - 1)
  if (end - start < max - 1) start = Math.max(1, end - max + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= clientTotalPages.value) currentPageRef.value = page
}

const goToPrev = () => {
  if (props.serverPaginated) {
    if (props.pageNumber > 1) emit('pageChange', { pageNumber: props.pageNumber - 1, pageSize: props.pageSize })
  } else {
    if (currentPageRef.value > 1) currentPageRef.value--
  }
}

const goToNext = () => {
  if (props.serverPaginated) {
    if (props.pageNumber < props.totalPages) emit('pageChange', { pageNumber: props.pageNumber + 1, pageSize: props.pageSize })
  } else {
    if (currentPageRef.value < clientTotalPages.value) currentPageRef.value++
  }
}

function selectPageSize(size: number) {
  showPageSizeMenu.value = false
  emit('pageChange', { pageNumber: 1, pageSize: size })
}

// ── Watchers ────────────────────────────────────────────────────────
watch(() => props.data, () => { currentPageRef.value = 1 })
watch(searchQuery, () => { currentPageRef.value = 1 })

const emitSearch = useDebounceFn((q: string) => emit('search', q), 500)
watch(searchQuery, (q) => {
  if (props.serverPaginated) emitSearch(q ?? '')
})
</script>

<style scoped>
/* Sticky actions column */
.sticky-actions-th,
.sticky-actions-td {
  position: sticky;
  inset-inline-end: 0;
}

.sticky-actions-th {
  z-index: 11;
  background: color-mix(in srgb, var(--color-muted, #f3f4f6) 60%, transparent);
}

.sticky-actions-td {
  z-index: 10;
  background: var(--color-surface, #fff);
}

tr:hover > .sticky-actions-td {
  background: color-mix(in srgb, var(--color-primary, #3b82f6) 3%, var(--color-surface, #fff));
}

/* Fade-in edge for sticky column */
.sticky-actions-th::before,
.sticky-actions-td::before {
  content: '';
  position: absolute;
  top: 0;
  inset-inline-start: -1rem;
  bottom: 0;
  width: 1rem;
  pointer-events: none;
  background: linear-gradient(to right, transparent, rgb(0 0 0 / 0.04));
}

/* Row data hover lift for tooltips */
.table-row-data {
  position: relative;
  z-index: 0;
}

.table-row-data:hover {
  z-index: 12;
}
</style>
