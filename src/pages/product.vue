<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-col pt-12">
      <h1 class="pb-4 text-3xl font-bold text-sky-800">All Our High Quality Products:</h1>
      <div class="grid grid-cols-5 items-center justify-center gap-12">
        <ProductCard
          v-for="product in productStore.products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import ProductCard from '../components/ProductCard.vue';
  import { useProducts } from '../stores/products';
  const productStore = useProducts();
  const getAll = async () => {
    await productStore.getAllProducts();
  };

  onMounted(() => {
    getAll();
  });
</script>
