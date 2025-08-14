<template>
  <header class="p-8 bg-yellow-500">
    <div class="container mx-auto">
      <div class="flex text-yellow-100  flex-row justify-between items-center">
        <div class="flex text-xl flex-row gap-4 items-center">
          <Icon icon="heroicons-outline:template"/>
          <h1 class="font-bold ">
            Vue-Tail Template
          </h1>
        </div>
        <div class="bg-yellow-100 p-2  rounded-xl">
          <button class="flex flex-row items-center gap-2 justify-center ">
            <Icon icon="bitcoin-icons:verify-filled" class="text-yellow-600 text-2xl"/>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue';
</script>