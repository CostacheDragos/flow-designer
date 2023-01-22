<template>
  <div class="bg-slate-600 border-l-4 border-gray-900 w-72 select-none">
    <template v-if="selectedNodeData">
      <div class="flex border-b-4 p-4 border-gray-900">
        <h1 class="text-white grow">
          {{ selectedNodeData.classData.name }}
        </h1>
        <div class="cursor-pointer" @click="removeNodes([`${getSelectedNodes[0].id}`])">
          <font-awesome-icon icon="fa-solid fa-trash" color="red"/>
        </div>
      </div>
      <!-- Properties controls -->
      <details class="bg-inherit duration-300 border-b-4 border-gray-900">
        <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Properties</summary>
        <div class="hover:bg-gray-400 py-2 border-b border-gray-900 cursor-pointer" @click="addProperty">
          <font-awesome-icon icon="fa-plus fa-solid" color="white" />
        </div>
        <div class="py-2">
          <ul>
            <li class="hover:bg-gray-400 px-2" v-for="(property, propertyIndex) in selectedNodeData.classData.properties">
              <div class="flex">
                <p class="text-white normal-case grow"> {{ property }} </p>
                <div class="my-auto cursor-pointer" @click="removeProperty(`${propertyIndex}`)">
                  <font-awesome-icon icon="fa-solid fa-xmark" color="red" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </details>

      <!-- Methods controls -->
      <details class="bg-inherit duration-300 border-b-4 border-gray-900">
        <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Methods</summary>
        <div class="hover:bg-gray-400 py-2 border-b border-gray-900 cursor-pointer" @click="addMethod">
          <font-awesome-icon icon="fa-plus fa-solid" color="white" />
        </div>
        <div class="py-2">
          <ul>
            <li class="hover:bg-gray-400 px-2" v-for="(method, methodIndex) in selectedNodeData.classData.methods">
              <div class="flex">
                <p class="text-white normal-case grow"> {{ method }}() </p>
                <div class="my-auto cursor-pointer" @click="removeMethod(`${methodIndex}`)">
                  <font-awesome-icon icon="fa-solid fa-xmark" color="red" />
                </div>
              </div>
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

const { getSelectedNodes, removeNodes } = useVueFlow();

// Listens for when the node selection changes and updates the selection menu accordingly
const selectedNodeData = ref();
watch(getSelectedNodes, () => {
  if(getSelectedNodes.value.length === 1) {
    selectedNodeData.value = getSelectedNodes.value[0].data;
  } else {
    selectedNodeData.value = undefined;
  }
});

// Called when the user wishes to add a new property/method from the selection menu
function addProperty() {
  selectedNodeData.value.classData.properties.push("NewPropFromMenu");
}
function addMethod() {
  selectedNodeData.value.classData.methods.push("NewPropFromMenu");
}


// Called when the user wishes to remove a property/method from the selection menu
function removeProperty(propertyIndex) {
  selectedNodeData.value.classData.properties.splice(propertyIndex, 1);
}
function removeMethod(methodIndex) {
  selectedNodeData.value.classData.methods.splice(methodIndex, 1);
}
</script>