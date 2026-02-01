<template>
  <div class="w-full overflow-x-auto">
    <!-- Search/Filter -->
    <div v-if="searchable" class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Table -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-50">
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
              :class="column.class"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.label }}</span>
                <button
                  v-if="column.sortable"
                  @click="handleSort(column.key)"
                  class="flex flex-col text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Sort"
                >
                  <span
                    class="text-xs leading-none"
                    :class="{
                      'text-blue-600': sortKey === column.key && sortOrder === 'asc',
                      'text-gray-300': sortKey !== column.key || sortOrder !== 'asc',
                    }"
                  >
                    ▲
                  </span>
                  <span
                    class="text-xs leading-none -mt-0.5"
                    :class="{
                      'text-blue-600': sortKey === column.key && sortOrder === 'desc',
                      'text-gray-300': sortKey !== column.key || sortOrder !== 'desc',
                    }"
                  >
                    ▼
                  </span>
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500">
              <div class="flex flex-col items-center gap-2">
                <AppSpinner />
                <span>Loading...</span>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="filteredData.length === 0">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500">
              {{ emptyMessage }}
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-else
            v-for="(row, index) in paginatedData"
            :key="getRowKey(row, index)"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-sm text-gray-700"
              :class="column.class"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getValue(row, column.key)"
                :column="column"
              >
                {{ getValue(row, column.key) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="paginated && totalPages > 1" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} entries
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            :class="{
              'bg-blue-600 text-white border-blue-600': page === currentPage,
            }"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppSpinner from './AppSpinner.vue';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string;
}

interface Props {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  paginated?: boolean;
  itemsPerPage?: number;
  emptyMessage?: string;
  rowKey?: string | ((row: any) => string | number);
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchable: false,
  searchPlaceholder: 'Search...',
  paginated: false,
  itemsPerPage: 10,
  emptyMessage: 'No data available',
  rowKey: 'id',
});

const searchQuery = ref('');
const sortKey = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentPage = ref(1);

const getRowKey = (row: any, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row);
  }
  return row[props.rowKey] ?? index;
};

const getValue = (row: any, key: string): any => {
  const keys = key.split('.');
  let value = row;
  for (const k of keys) {
    value = value?.[k];
  }
  return value ?? '';
};

const filteredData = computed(() => {
  let result = [...props.data];

  // Apply search filter
  if (props.searchable && searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((row) => {
      return props.columns.some((column) => {
        const value = getValue(row, column.key);
        return String(value).toLowerCase().includes(query);
      });
    });
  }

  // Apply sorting
  if (sortKey.value) {
    result.sort((a, b) => {
      const aValue = getValue(a, sortKey.value!);
      const bValue = getValue(b, sortKey.value!);

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortOrder.value === 'asc' ? comparison : -comparison;
    });
  }

  return result;
});

const totalPages = computed(() => {
  return props.paginated ? Math.ceil(filteredData.value.length / props.itemsPerPage) : 1;
});

const startIndex = computed(() => {
  return props.paginated ? (currentPage.value - 1) * props.itemsPerPage : 0;
});

const endIndex = computed(() => {
  if (!props.paginated) return filteredData.value.length;
  return Math.min(startIndex.value + props.itemsPerPage, filteredData.value.length);
});

const paginatedData = computed(() => {
  if (!props.paginated) return filteredData.value;
  return filteredData.value.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

watch(
  () => props.data,
  () => {
    currentPage.value = 1;
  }
);

watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>
