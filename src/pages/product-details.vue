<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-col pt-6">
      <div class="mx-auto max-w-4xl">
        <!-- Product Header -->
        <div class="mb-12 text-center">
          <h1 class="mb-4 text-4xl font-bold text-sky-800">{{ currentProduct?.name }}</h1>
          <div class="mx-auto h-1 w-24 rounded-full bg-sky-400"></div>
        </div>

        <!-- Product Content -->
        <div class="rounded-2xl border border-sky-100 bg-white p-8 shadow-lg">
          <div class="grid gap-8 md:grid-cols-2">
            <!-- Product Image Placeholder -->
            <div class="flex items-center justify-center">
              <div
                class="flex aspect-square w-full max-w-md items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-sky-200"
              >
                <div class="flex flex-col items-center text-center">
                  <div class="mb-4 text-6xl">
                    <Icon icon="ph:image-broken" class="text-2xl text-sky-800" />
                  </div>
                  <p class="font-medium text-sky-600">Product Image</p>
                </div>
              </div>
            </div>

            <!-- Product Info -->
            <div class="flex flex-col justify-center space-y-6">
              <div class="rounded-xl bg-sky-50 p-6">
                <h3 class="mb-3 text-lg font-semibold text-sky-800">Description</h3>
                <p class="leading-relaxed text-sky-700">{{ currentProduct?.description }}</p>
              </div>

              <div class="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm opacity-90">Price</p>
                    <p class="text-3xl font-bold">${{ currentProduct?.price }}</p>
                  </div>
                  <div class="text-2xl">💰</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import { computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProducts } from '../stores/products';
  const productStore = useProducts();
  const currentProduct = computed(() => productStore.currentSingleProduct);
  const route = useRoute();
  const getCurrent = async (id: string) => {
    await productStore.getSingleProduct(id);
  };

  onMounted(() => {
    const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
    localStorage.setItem('currentProductID', id);
    const savedId = localStorage.getItem('currentProductID');
    getCurrent(savedId ?? id);
  });
</script>
