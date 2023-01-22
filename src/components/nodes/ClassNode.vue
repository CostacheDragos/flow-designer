<template>
  <NodeToolbar :is-visible="isToolbarVisible" :position="data.toolbarPosition">
    <div class="flex flex-col di">
      <button class="bg-blue-500 text-white rounded py-2 px-4 block" @click="addProperty">
        Add Property
      </button>
      <button class="bg-blue-500 text-white rounded py-2 px-4 block mt-1" @click="addMethod">
        Add Method
      </button>
    </div>
  </NodeToolbar>

  <div :class="{'border-sky-400 border-2': selected, 'border-black border-2': !selected}" class="vue-flow__node-default">
    <div class="flex">
      <div class="my-auto rounded-full hover:bg-sky-400 px-1" @click="toggleExpanded">
        <font-awesome-icon v-show="!isExpanded" icon="fa-solid fa-angle-right"/>
        <font-awesome-icon v-show="isExpanded" icon="fa-solid fa-angle-down"/>
      </div>
      <h2 class="grow">
        {{ label }}
      </h2>
      <div class="my-auto rounded-full hover:bg-sky-400 px-1" @click="toggleToolbarVisibility">
        <font-awesome-icon v-show="!isToolbarVisible" icon="fa-plus fa-solid"/>
        <font-awesome-icon v-show="isToolbarVisible" icon="fa-solid fa-minus"/>
      </div>
    </div>

    <div v-show="isExpanded" class="divide-y-2 mt-2">
      <ul>
        <li v-for="property in data.classData.properties">
          <p class="normal-case">{{ property }}</p>
        </li>
      </ul>
      <ul>
        <li v-for="method in data.classData.methods">
          <p class="normal-case">{{ method }}()</p>
        </li>
      </ul>
    </div>

    <Handle :position="Position.Top" type="target"/>
    <Handle :position="Position.Bottom" type="source"/>
  </div>
</template>

<script setup>
import {Handle, Position} from "@vue-flow/core";
import {NodeToolbar} from "@vue-flow/node-toolbar";
import {ref} from "vue";

// Accepting props
const props = defineProps(["label", "id", "data", "selected"]);


// Called when adding properties & methods using the node toolbar
function addProperty() {
  props.data.classData.properties.push("NewProperty");
}
function addMethod() {
  props.data.classData.methods.push("NewMethod");
}


// Expands and collapses the node content
const isExpanded = ref(false);
function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}


// Determines toolbar visibility
const isToolbarVisible = ref(false);
function toggleToolbarVisibility() {
  isToolbarVisible.value = !isToolbarVisible.value;
}


</script>
