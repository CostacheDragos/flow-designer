<template>
  <!-- Name -->
  <details class="duration-300 text-white p-4">
    <summary class="flex">
      <font-awesome-icon icon="fa-solid fa-pen-to-square"
                         class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"/>
      <div class="flex grow" @click.prevent>
        <h1 class="grow my-auto normal-case">
          {{ selectedNodeData.packageData.name }}
        </h1>
        <font-awesome-icon icon="fa-solid fa-trash"
                           class="my-auto cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                           @click="removeNodes([`${getSelectedNodes[0].id}`])"/>
      </div>
    </summary>
    <div class="mx-2">
      <ul class="p-2 space-y-2">
        <!-- Package name editing -->
        <li class="flex">
          <label class="normal-case text-left my-auto w-16">Name:</label>
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
  <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.childNodesSubmenu"
                       @click="submenusOpenStatus.childNodesSubmenu = !submenusOpenStatus.childNodesSubmenu"/>
    <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                       icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.childNodesSubmenu"
                       @click="submenusOpenStatus.childNodesSubmenu = !submenusOpenStatus.childNodesSubmenu"/>
    <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Content</h1>
  </div>
  <div class="ml-8 text-white normal-case" v-show="submenusOpenStatus.childNodesSubmenu">
    <div class="py-2 text-white normal-case">
      <ul class="list-disc ml-5">
        <li v-for="childNodeId in selectedNodeData.packageData.childrenIds" :key="childNodeId">
          <div @click.prevent class="flex">
            <p class="text-white normal-case my-auto mx-4">{{ findNode(childNodeId).label }}</p>
            <font-awesome-icon icon="fa-solid fa-xmark"
                               class="my-auto cursor-pointer text-red-600 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                               @click="emits('removeNodeFromParentPackage', childNodeId)"/>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {useVueFlow} from "@vue-flow/core";
import {useFlowStore} from "@/stores/flow.js";
import { checkNameValidity } from "@/Utility/Utility.js";
import {reactive, toRef} from "vue";


const { findNode, getSelectedNodes, removeNodes } = useVueFlow();
const flowStore = useFlowStore();

const emits = defineEmits(["removeNodeFromParentPackage"]);
const props = defineProps(["selectedNodeData"]);
const selectedNodeData =  toRef(props, "selectedNodeData");

const submenusOpenStatus = reactive({
  childNodesSubmenu: false,
});

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
