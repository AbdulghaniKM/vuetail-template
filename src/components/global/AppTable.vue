<template>
  <div class="w-full">
    <!-- Toolbar: Search + extra actions -->
    <div v-if="searchable || $slots['toolbar-end']" class="mb-4 flex w-full min-w-0 items-center gap-2">
      <div v-if="searchable" class="relative min-w-0 flex-1 sm:max-w-md">
        <AppIcon
          name="icon-[heroicons-outline--magnifying-glass]"
          :size="1.25"
          class="text-text-secondary pointer-events-none absolute start-3 top-1/2 -translate-y-1/2"
        />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="border-border bg-surface text-text placeholder:text-text-secondary/70 w-full rounded-lg border py-2.5 pe-4 ps-10 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <slot name="toolbar-end" />
    </div>

    <!-- Table -->
    <div
      class="overflow-x-auto rounded-xl"
      :class="outlined ? 'border-border border bg-surface shadow-sm' : ''"
      style="-webkit-overflow-scrolling: touch"
    >
      <table class="w-full min-w-[48rem] border-collapse" style="table-layout: auto">
        <thead>
          <tr>
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              class="table-th border-b border-border px-3 py-2.5 text-start whitespace-nowrap text-xs font-bold sm:px-4 sm:py-3 sm:text-sm"
              :class="[column.class, column.key === 'actions' ? 'sticky-actions-th w-px whitespace-nowrap' : '']"
            >
              <button
                v-if="isColumnSortable(column)"
                type="button"
                class="hover:text-primary flex items-center gap-1.5 transition-colors"
                :class="sortKey === column.key ? 'text-primary' : ''"
                @click="handleSort(column.key)"
              >
                <span class="line-clamp-2">{{ column.label }}</span>
                <AppIcon
                  :name="
                    sortKey === column.key && sortOrder === 'desc'
                      ? 'icon-[heroicons-outline--chevron-down]'
                      : 'icon-[heroicons-outline--chevron-up]'
                  "
                  :size="1"
                  :class="sortKey === column.key ? 'opacity-100' : 'opacity-30'"
                />
              </button>
              <span v-else class="line-clamp-2">{{ column.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="visibleColumns.length" class="py-20 text-center">
              <div class="text-text-secondary flex flex-col items-center gap-3">
                <AppSpinner :size="2" class="text-primary" />
                <span class="text-sm">{{ loadingMessage }}</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="displayData.length === 0">
            <td :colspan="visibleColumns.length" class="py-20 text-center">
              <div class="text-text-secondary flex flex-col items-center gap-3">
                <span class="bg-muted flex size-12 items-center justify-center rounded-full">
                  <AppIcon name="icon-[heroicons-outline--inbox]" :size="1.5" class="opacity-60" />
                </span>
                <span class="text-sm">{{ emptyMessage }}</span>
              </div>
            </td>
          </tr>
          <tr
            v-for="(row, index) in displayData"
            v-else
            :key="getRowKey(row, index)"
            class="table-row-data border-b border-border/60 transition-colors hover:bg-muted/50 even:bg-muted/20"
          >
            <td
              v-for="column in visibleColumns"
              :key="column.key"
              class="text-text min-w-0 whitespace-nowrap px-3 py-2.5 text-xs sm:px-4 sm:py-3.5 sm:text-sm"
              :class="[column.class, column.key === 'actions' ? 'sticky-actions-td w-px whitespace-nowrap' : '']"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getValue(row, column.key)"
                :column="column"
              >
                <button
                  v-if="column.truncate && getValue(row, column.key)"
                  type="button"
                  class="text-text-secondary hover:text-primary block max-w-[14rem] truncate text-start text-xs transition-colors"
                  :title="String(getValue(row, column.key))"
                  @click="openTruncateModal(column.label, String(getValue(row, column.key)))"
                >
                  {{ display(getValue(row, column.key)) }}
                </button>
                <template v-else>
                  {{ display(getValue(row, column.key)) }}
                </template>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination & Controls -->
    <div
      v-if="showPagination || showColumnToggle"
      class="border-border text-text-secondary mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-surface px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
    >
      <div class="flex flex-wrap items-center gap-3">
        <span v-if="showPagination" class="text-sm">
          {{ paginationStart }}–{{ paginationEnd }} {{ ofLabel }} {{ paginationTotal }}
        </span>
        <div v-if="serverPaginated && pageSizeOptions.length > 0" ref="pageSizeRef" class="relative">
          <AppTooltip content="Rows per page" placement="top">
            <button
              type="button"
              class="border-border bg-surface text-text hover:bg-muted flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm transition-colors"
              @click="showPageSizeMenu = !showPageSizeMenu"
            >
              <span>{{ pageSize }}</span>
              <AppIcon name="icon-[heroicons-outline--chevron-down]" :size="0.875" class="text-text-secondary" />
            </button>
          </AppTooltip>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showPageSizeMenu"
              class="border-border bg-surface absolute bottom-full end-0 z-50 mb-1.5 min-w-[4rem] origin-bottom rounded-lg border p-1 shadow-lg"
            >
              <button
                v-for="n in pageSizeOptions"
                :key="n"
                type="button"
                class="flex w-full items-center justify-center rounded-md px-3 py-1.5 text-sm transition-colors"
                :class="n === pageSize ? 'bg-primary/15 text-primary font-medium' : 'text-text hover:bg-muted'"
                @click="selectPageSize(n)"
              >
                {{ n }}
              </button>
            </div>
          </Transition>
        </div>
        <!-- Column Toggle -->
        <div v-if="showColumnToggle" ref="columnToggleRef" class="relative">
          <AppTooltip content="Show / hide columns" placement="top">
            <button
              type="button"
              class="border-border bg-surface text-text hover:bg-muted flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm transition-colors"
              aria-haspopup="true"
              :aria-expanded="showColumnMenu"
              @click="showColumnMenu = !showColumnMenu"
            >
              <AppIcon name="icon-[heroicons-outline--adjustments-horizontal]" :size="1" />
              <span class="bg-primary/15 text-primary rounded-full px-1.5 text-xs font-semibold">
                {{ visibleToggleableCount }}/{{ toggleableColumns.length }}
              </span>
            </button>
          </AppTooltip>
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
              class="border-border bg-surface absolute start-0 bottom-full z-50 mb-1.5 min-w-[14rem] origin-bottom-right rounded-xl border p-1.5 shadow-xl shadow-black/10"
            >
              <div class="flex items-center justify-between px-2.5 pb-1.5 pt-1">
                <p class="text-text-secondary text-xs font-semibold tracking-wide">Show / hide columns</p>
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 scale-90"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-90"
                >
                  <span
                    v-if="columnSavedHint"
                    class="text-success bg-success/10 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.625rem] font-medium"
                  >
                    <AppIcon name="icon-[heroicons-outline--check]" :size="0.75" />
                    Saved
                  </span>
                </Transition>
              </div>
              <div class="border-border mb-1 border-t" />
              <button
                v-for="col in toggleableColumns"
                :key="col.key"
                type="button"
                class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors"
                :class="visibleColumnsSet.has(col.key) ? 'text-text hover:bg-muted/60' : 'text-text-secondary hover:bg-muted/40'"
                @click="toggleColumn(col.key)"
              >
                <span class="flex items-center gap-2">
                  <AppIcon
                    :name="visibleColumnsSet.has(col.key) ? 'icon-[heroicons-outline--eye]' : 'icon-[heroicons-outline--eye-slash]'"
                    :size="1.125"
                    :class="visibleColumnsSet.has(col.key) ? 'text-primary' : 'text-text-secondary/50'"
                  />
                  {{ col.label }}
                </span>
                <span
                  class="relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200"
                  :class="visibleColumnsSet.has(col.key) ? 'bg-primary' : 'bg-border'"
                >
                  <span
                    class="absolute size-3.5 rounded-full bg-white shadow-sm transition-all duration-200"
                    :class="visibleColumnsSet.has(col.key) ? 'start-[1.125rem]' : 'start-[0.1875rem]'"
                  />
                </span>
              </button>
              <div class="border-border mt-1 border-t" />
              <button
                type="button"
                class="text-text-secondary hover:bg-muted/60 hover:text-text mt-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors"
                @click="resetColumnVisibility"
              >
                <AppIcon name="icon-[heroicons-outline--arrow-path]" :size="1" />
                Restore defaults
              </button>
            </div>
          </Transition>
        </div>
      </div>
      <div v-if="showPagination" class="flex items-center gap-1">
        <AppButton
          icon="icon-[heroicons-outline--chevron-left]"
          tooltip="Previous page"
          variant="outline"
          size="sm"
          :disabled="!canGoPrev"
          class="disabled:opacity-40 disabled:cursor-not-allowed"
          @click="goToPrev"
        />
        <template v-if="!serverPaginated" v-for="page in visiblePages" :key="page">
          <button
            type="button"
            class="border-border min-w-8 h-8 rounded-lg border px-2 text-sm transition-colors"
            :class="
              page === currentPageRef
                ? 'bg-primary border-primary text-white'
                : 'bg-surface text-text hover:bg-muted'
            "
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </template>
        <span
          v-else
          class="text-text min-w-8 px-2 text-center text-sm font-medium"
        >
          {{ props.pageNumber }}
        </span>
        <AppButton
          icon="icon-[heroicons-outline--chevron-right]"
          tooltip="Next page"
          variant="outline"
          size="sm"
          :disabled="!canGoNext"
          class="disabled:opacity-40 disabled:cursor-not-allowed"
          @click="goToNext"
        />
      </div>
    </div>

    <!-- Truncate expand modal -->
    <AppModal
      :is-open="truncateModalOpen"
      :title="truncateModalTitle"
      max-width="sm"
      @close="truncateModalOpen = false"
    >
      <div class="p-4">
        <p dir="auto" class="whitespace-pre-wrap text-sm leading-relaxed text-text">{{ truncateModalContent }}</p>
      </div>
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
  /** Truncate cell text and show full content in a modal on click */
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
  /** Server-side pagination */
  serverPaginated?: boolean
  pageNumber?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
  /** Column visibility */
  showColumnToggle?: boolean
  columnsVisibilityKey?: string
  /** Page size options for server pagination */
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

// Truncate modal
const truncateModalOpen = ref(false)
const truncateModalTitle = ref('')
const truncateModalContent = ref('')

function openTruncateModal(title: string, content: string) {
  truncateModalTitle.value = title
  truncateModalContent.value = content
  truncateModalOpen.value = true
}

const STORAGE_PREFIX = 'app-table-columns-'

const searchQuery = ref('')
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPageRef = ref(1)
const showColumnMenu = ref(false)
const columnToggleRef = ref<HTMLElement | null>(null)
const showPageSizeMenu = ref(false)
const pageSizeRef = ref<HTMLElement | null>(null)

onClickOutside(columnToggleRef, () => { showColumnMenu.value = false })
onClickOutside(pageSizeRef, () => { showPageSizeMenu.value = false })

function loadColumnVisibility(): Record<string, boolean> {
  if (!props.columnsVisibilityKey) return {}
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + props.columnsVisibilityKey)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, boolean>
    return typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveColumnVisibility(visibility: Record<string, boolean>) {
  if (!props.columnsVisibilityKey) return
  try {
    localStorage.setItem(STORAGE_PREFIX + props.columnsVisibilityKey, JSON.stringify(visibility))
  } catch {
    /* ignore */
  }
}

const columnVisibility = ref<Record<string, boolean>>(loadColumnVisibility())
const columnSavedHint = ref(false)
let savedHintTimer: ReturnType<typeof setTimeout> | null = null

function showSavedHint() {
  columnSavedHint.value = true
  if (savedHintTimer) clearTimeout(savedHintTimer)
  savedHintTimer = setTimeout(() => { columnSavedHint.value = false }, 1500)
}

const toggleableColumns = computed(() =>
  props.columns.filter((c) => c.hideable !== false)
)

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

const visibleColumns = computed(() =>
  props.columns.filter((c) => visibleColumnsSet.value.has(c.key))
)

const visibleToggleableCount = computed(() =>
  toggleableColumns.value.filter((c) => visibleColumnsSet.value.has(c.key)).length
)

function toggleColumn(key: string) {
  const currentlyVisible = visibleColumnsSet.value.has(key)
  const visibleCount = visibleColumnsSet.value.size
  if (currentlyVisible && visibleCount <= 1) return
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

const isColumnSortable = (column: TableColumn): boolean => column.sortable === true

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

const clientTotalPages = computed(() =>
  props.paginated ? Math.ceil(filteredData.value.length / props.itemsPerPage) : 1
)

const clientStartIndex = computed(() =>
  props.paginated ? (currentPageRef.value - 1) * props.itemsPerPage : 0
)

const clientEndIndex = computed(() =>
  props.paginated
    ? Math.min(clientStartIndex.value + props.itemsPerPage, filteredData.value.length)
    : filteredData.value.length
)

const clientPaginatedData = computed(() =>
  props.paginated ? filteredData.value.slice(clientStartIndex.value, clientEndIndex.value) : filteredData.value
)

const displayData = computed(() =>
  props.serverPaginated ? props.data : clientPaginatedData.value
)

const showPagination = computed(() => {
  if (props.serverPaginated) return props.totalCount > 0
  return props.paginated && clientTotalPages.value > 1
})

const paginationStart = computed(() => {
  if (props.serverPaginated) {
    return props.totalCount === 0 ? 0 : (props.pageNumber - 1) * props.pageSize + 1
  }
  return props.totalCount === 0 ? 0 : clientStartIndex.value + 1
})

const paginationEnd = computed(() => {
  if (props.serverPaginated) {
    return Math.min(props.pageNumber * props.pageSize, props.totalCount)
  }
  return clientEndIndex.value
})

const paginationTotal = computed(() =>
  props.serverPaginated ? props.totalCount : filteredData.value.length
)

const canGoPrev = computed(() =>
  props.serverPaginated ? props.pageNumber > 1 : currentPageRef.value > 1
)

const canGoNext = computed(() =>
  props.serverPaginated ? props.pageNumber < props.totalPages : currentPageRef.value < clientTotalPages.value
)

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

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= clientTotalPages.value) {
    currentPageRef.value = page
  }
}

const goToPrev = () => {
  if (props.serverPaginated) {
    if (props.pageNumber > 1) emit('pageChange', { pageNumber: props.pageNumber - 1, pageSize: props.pageSize })
  } else {
    if (currentPageRef.value > 1) currentPageRef.value--
  }
}

function selectPageSize(size: number) {
  showPageSizeMenu.value = false
  emit('pageChange', { pageNumber: 1, pageSize: size })
}

const goToNext = () => {
  if (props.serverPaginated) {
    if (props.pageNumber < props.totalPages) emit('pageChange', { pageNumber: props.pageNumber + 1, pageSize: props.pageSize })
  } else {
    if (currentPageRef.value < clientTotalPages.value) currentPageRef.value++
  }
}

watch(() => props.data, () => { currentPageRef.value = 1 })
watch(searchQuery, () => { currentPageRef.value = 1 })

const emitSearch = useDebounceFn((q: string) => emit('search', q), 500)
watch(searchQuery, (q) => {
  if (props.serverPaginated) emitSearch(q ?? '')
})
</script>

<style scoped>
/* ── Header ── */
.table-th {
  background: linear-gradient(to bottom, var(--color-muted, #f3f4f6), color-mix(in srgb, var(--color-muted, #f3f4f6) 70%, var(--color-surface, #fff)));
  color: var(--color-text, #1f2937);
  text-transform: none;
  letter-spacing: 0.01em;
}

/* ── Row hover: lift above sticky header so tooltips are visible ── */
.table-row-data {
  position: relative;
  z-index: 0;
}

.table-row-data:hover {
  z-index: 12;
}

/* ── Sticky actions column ── */
.sticky-actions-th,
.sticky-actions-td {
  position: sticky;
  inset-inline-end: 0;
}

.sticky-actions-th {
  z-index: 11;
  background: linear-gradient(to bottom, var(--color-muted, #f3f4f6), color-mix(in srgb, var(--color-muted, #f3f4f6) 70%, var(--color-surface, #fff)));
  border-inline-start: 1px solid var(--color-border, #e5e7eb);
}

.sticky-actions-td {
  background: var(--color-surface, #fff);
  border-inline-start: 1px solid var(--color-border, #e5e7eb);
}

tr:nth-child(even) > .sticky-actions-td {
  background: color-mix(in srgb, var(--color-muted, #f3f4f6) 20%, var(--color-surface, #fff));
}

tr:hover > .sticky-actions-td {
  background: color-mix(in srgb, var(--color-muted, #f3f4f6) 50%, var(--color-surface, #fff));
}

/* Shadow edge for sticky column */
.sticky-actions-th::before,
.sticky-actions-td::before {
  content: '';
  position: absolute;
  top: 0;
  inset-inline-start: -1.5rem;
  bottom: 0;
  width: 1.5rem;
  pointer-events: none;
  background: linear-gradient(to right, transparent, rgb(0 0 0 / 0.06));
}
</style>
