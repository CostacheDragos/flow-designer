<template>
  <div class="bg-slate-600 border-l-4 border-gray-900 w-48 select-none">
    <h1 class="text-white">
      {{ selectedNodeData.label }}
    </h1>
  </div>
</template>

<script setup>
import {inject, ref, watch} from "vue";

import { useVueFlow } from "@vue-flow/core";

const { getSelectedNodes } = useVueFlow();


let selectedNodeData = ref({});
watch(getSelectedNodes, () => {
  if(getSelectedNodes.value.length === 1) {
    selectedNodeData.value.label = getSelectedNodes.value[0].label;
  } else {
    selectedNodeData.value = {};
  }
});

</script>