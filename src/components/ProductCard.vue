<template>
  <div class="flex h-96 w-64 flex-col items-center justify-center rounded-xl bg-sky-400 p-2">
    <div class="flex w-full place-content-center rounded-xl bg-sky-200 p-16">
      <Icon icon="ph:image-broken" class="text-2xl text-sky-800" />
    </div>
    <div class="flex h-full w-full flex-col justify-between gap-4 pt-4 text-sky-800">
      <div class="flex flex-col gap-1">
        <h1 class="font-bold">
          {{ product.name }}
        </h1>
        <p class="line-clamp-4 w-full text-ellipsis">
          {{ product.description }}
        </p>
      </div>
      <div class="flex flex-row items-center justify-between gap-4">
        <div class="w-fit rounded-xl bg-sky-50/50 p-1 px-2">
          <p>Price: {{ product.price }}$</p>
        </div>
        <div
          class="flex w-fit flex-row items-center gap-2 rounded-xl p-1 px-2 hover:cursor-pointer"
        >
          <p @click="redirectTo('/products/' + product.id)" class="text-sky-50 underline">
            See More
          </p>
          <Icon icon="ph:arrow-right" class="text-sky-50" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import { type Product } from '../types';
  import { useRedirect } from '../utils/index';

  const { redirectTo } = useRedirect();
  defineProps<{ product: Product }>();
</script>
