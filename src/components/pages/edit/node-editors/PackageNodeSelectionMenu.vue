<template>
  <!-- Name -->
  <details class="duration-300 text-white border-b-4 p-4 border-gray-900">
    <summary class="flex">
      <font-awesome-icon icon="fa-solid fa-pen-to-square" color="white" class="my-auto cursor-pointer mx-2"/>
      <div class="flex grow" @click.prevent>
        <h1 class="grow my-auto normal-case">
          {{ selectedNodeData.packageData.name }}
        </h1>
        <font-awesome-icon icon="fa-solid fa-trash" color="red" class="cursor-pointer my-auto mx-2" @click="removeNodes([`${getSelectedNodes[0].id}`])"/>
      </div>
    </summary>
    <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 border border-slate-600 hover:border-gray-500">
      <ul class="p-2 space-y-2">
        <!-- Package name editing -->
        <li class="flex">
          <label class="normal-case text-left">Name:</label>
          <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                 :value="selectedNodeData.packageData.name"
                 @keyup.enter="changePackageName($event.target)"
                 @focusout="onPackageNameInputLostFocus($event.target)"
          />
        </li>
      </ul>
    </div>
  </details>

  <!-- Child nodes controls -->
  <details class="bg-inherit duration-300 border-b-4 border-gray-900">
    <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Contents</summary>
    <div class="py-2 text-white normal-case">
      <ul>
        <li v-for="childNodeId in selectedNodeData.packageData.childrenIds" :key="childNodeId">
          <div @click.prevent class="flex grow">
            <p class="grow">{{ findNode(childNodeId).label }}</p>
            <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer mx-2"
                               @click="emits('removeNodeFromParentPackage', childNodeId)"/>
          </div>
        </li>
      </ul>
    </div>
  </details>
</template>

<script setup>
import {useVueFlow} from "@vue-flow/core";
import {useFlowStore} from "@/stores/flow.js";
import { checkNameValidity } from "@/Utility/Utility.js";
import {toRef} from "vue";


const { findNode, getSelectedNodes, removeNodes } = useVueFlow();
const flowStore = useFlowStore();

const emits = defineEmits(["removeNodeFromParentPackage"]);
const props = defineProps(["selectedNodeData"]);
const selectedNodeData =  toRef(props, "selectedNodeData");

// ****** General package functions ******
function changePackageName(inputElement) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    selectedNodeData.value.packageData.name = inputElement.value;
    getSelectedNodes.value[0].label = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    // Change the save state of the flow
    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onPackageNameInputLostFocus(inputElement) {
  // Save changes
  changePackageName(inputElement);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual property
  inputElement.value = selectedNodeData.value.packageData.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}
</script>
