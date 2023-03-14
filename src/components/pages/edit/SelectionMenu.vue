<template>
  <div class="h-full w-1.5 bg-gray-900 cursor-col-resize flex-shrink-0" @mousedown="resizeStart"/>

  <div class="bg-slate-600 w-72 select-none overflow-y-auto overflow-x-hidden max-w-lg min-w-fit" id="selection-menu-container">
    <!-- Information about the selected node. Different menus based on the type on node -->
    <ClassNodeSelectionMenu v-if="selectedClassNodeData" :selected-node-data="selectedClassNodeData"/>
    <PackageNodeSelectionMenu v-else-if="selectedPackageNodeData" :selected-node-data="selectedPackageNodeData"/>

    <!-- Placeholder if no node is selected -->
    <div v-else class="grid place-items-center h-full">
      <div>
        <font-awesome-icon icon="fa-solid fa-gears" color="white"  size="10x"/>
        <h2 class="text-white normal-case mt-2">Select a node to edit</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import { useVueFlow } from "@vue-flow/core";

import ClassNodeSelectionMenu from "@/components/pages/edit/ClassNodeSelectionMenu.vue";
import PackageNodeSelectionMenu from "@/components/pages/edit/PackageNodeSelectionMenu.vue";

const { getSelectedNodes } = useVueFlow();


// Listens for when the node selection changes and updates the selection menu accordingly
const selectedClassNodeData = ref();
const selectedPackageNodeData = ref();
watch(getSelectedNodes, () => {
  if(getSelectedNodes.value.length === 1)
    switch (getSelectedNodes.value[0].type) {
      case "class":
        selectedPackageNodeData.value = null;
        selectedClassNodeData.value = getSelectedNodes.value[0].data;
        break;
      case "package":
        selectedClassNodeData.value = null;
        selectedPackageNodeData.value = getSelectedNodes.value[0].data;
        break;
    }
  else {
    selectedClassNodeData.value = null;
    selectedPackageNodeData.value = null;
  }
});


// Resize bar functions
let isBeingResized = false;
function resizeStart(event) {
  event.preventDefault();

  isBeingResized = true;

  document.addEventListener("mouseup", resizeStop);
  document.addEventListener("mousemove", resizing);
  document.body.style.cursor = "col-resize";
}
function resizeStop(event) {
  event.preventDefault();

  if(!isBeingResized)
    return;

  isBeingResized = false;

  document.removeEventListener("mouseup", resizeStop);
  document.removeEventListener("mousemove", resizing);
  document.body.style.cursor = "";
}
function resizing(event) {
  event.preventDefault();

  if(!isBeingResized)
    return;

  const selectionMenuContainer = document.getElementById("selection-menu-container");
  selectionMenuContainer.style.width =  `${window.innerWidth - event.clientX}px`;
}
</script>