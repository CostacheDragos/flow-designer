<template>
  <div class="flex flex-col h-screen overflow-clip">
    <nav v-if="isLoggedIn" class="flex flex-col text-center py-4 px-6 bg-gray-900 shadow items-baseline w-full">
      <div class="my-auto">
        <a href="#" class="text-2xl no-underline text-white hover:text-sky-400 normal-case">Home</a>
      </div>
    </nav>
    <router-view></router-view>
  </div>

</template>


<script setup>
import {ref, provide} from "vue";

const isLoggedIn = ref(false);

provide("isLoggedIn", isLoggedIn);

</script>