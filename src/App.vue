<template>
  <div class="flex flex-col h-screen">
    <nav class="flex flex-col text-center py-4 px-6 bg-gray-900 shadow items-baseline w-full">
      <div class="my-auto">
        <a href="#" class="text-2xl no-underline text-white hover:text-sky-400 normal-case">Home</a>
      </div>
    </nav>
    <FlowEditor class="flex flex-grow"/>
  </div>
</template>


<script setup>
import FlowEditor from "@/components/FlowEditor.vue";
</script>