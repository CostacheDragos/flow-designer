<template>

  <div class="w-fit h-fit" :class="{'border-sky-400 border-2 shadow-sm shadow-sky-400': selected, 'border-black border-2': !selected}">
    <img :src="data.href"/>
  </div>
</template>

<script setup>

const props = defineProps(["label", "selected", "data"]);
</script>

