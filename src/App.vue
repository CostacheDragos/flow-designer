<template>
  <div class="flex flex-col h-screen overflow-clip">
    <nav v-if="isLoggedIn" class="flex text-center py-4 px-6 bg-gray-900 shadow items-baseline w-full select-none" id="main-nav">
      <div class="my-auto">
        <router-link to="/home" class="text-2xl no-underline text-white hover:text-sky-400 normal-case">Home</router-link>
      </div>
      <div class="ml-auto">
        <a class="text-2xl no-underline text-white hover:text-sky-400 normal-case cursor-pointer" @click="logout">Logout</a>
      </div>
    </nav>
    <router-view></router-view>
  </div>

</template>


<script setup>
import { useUserStore } from "@/stores/user.js";
import { storeToRefs } from "pinia";

const {isLoggedIn} = storeToRefs(useUserStore());
const { logout } = useUserStore();


</script>