<template>
  <div class="bg-slate-600 border-l-4 border-gray-900 w-56 select-none">
    <template v-if="selectedNodeData">
      <h1 class="text-white border-b-4 p-4 border-gray-900">
        {{ selectedNodeData.classData.name }}
      </h1>

      <!-- Properties controls -->
      <details class="bg-inherit duration-300 border-b-4 border-gray-900">
        <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Properties</summary>
        <div class="p-2">
          <ul>
            <li v-for="property in selectedNodeData.classData.properties">
              <p class="text-white"> {{ property }} </p>
            </li>
          </ul>
        </div>
      </details>

      <!-- Methods controls -->
      <details class="bg-inherit duration-300 border-b-4 border-gray-900">
        <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Methods</summary>
        <div class="p-2">
          <ul>
            <li v-for="method in selectedNodeData.classData.methods">
              <p class="text-white"> {{ method }} </p>
            </li>
          </ul>
        </div>
      </details>
    </template>

  </div>
</template>

<script setup>
import { ref, watch } from "vue";

import { useVueFlow } from "@vue-flow/core";

const { getSelectedNodes } = useVueFlow();


const selectedNodeData = ref();
watch(getSelectedNodes, () => {
  if(getSelectedNodes.value.length === 1) {
    selectedNodeData.value = getSelectedNodes.value[0].data;
  } else {
    selectedNodeData.value = undefined;
  }
});

</script>