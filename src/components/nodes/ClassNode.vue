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

  <div :class="{'border-sky-400 border-2 shadow-md shadow-sky-400': selected, 'border-black border-2': !selected}"
       class="vue-flow__node-default w-fit">
    <div class="flex">
      <div class="my-auto rounded-full hover:bg-sky-400 px-1" @click="toggleExpanded">
        <font-awesome-icon v-show="!props.data.isExpanded" icon="fa-solid fa-angle-right"/>
        <font-awesome-icon v-show="props.data.isExpanded" icon="fa-solid fa-angle-down"/>
      </div>

      <!-- Regular class label -->
      <h2 class="normal-case grow break-all" v-if="!data.isInterface">
        {{ label }}
      </h2>
      <!-- Interface label -->
      <h2 class="normal-case grow break-all italic" v-if="data.isInterface" v-text="`<< ${ label } >>`"/>

      <div class="my-auto rounded-full hover:bg-sky-400 px-1" @click="toggleToolbarVisibility">
        <font-awesome-icon v-show="!isToolbarVisible" icon="fa-plus fa-solid"/>
        <font-awesome-icon v-show="isToolbarVisible" icon="fa-solid fa-minus"/>
      </div>
    </div>

    <div v-show="props.data.isExpanded" class="divide-y-2 divide-black mt-2">
      <ul class="pb-2">
        <li v-for="property in data.classData.properties" class="my-1 px-1 shadow border border-gray-500 rounded">
          <p class="normal-case">{{ property.accessModifier }} {{ property.type }} {{ property.name }}</p>
        </li>
      </ul>
      <ul class="pt-2">
        <li v-for="method in data.classData.methods" class="my-1 px-1 shadow border border-gray-500 rounded">
          <p class="normal-case">{{ method.accessModifier }} {{ method.returnType }} {{ method.name }}{{ method.parameters.length > 0 ? '(...)' : '()' }}</p>
        </li>
      </ul>
    </div>

    <Handle :position="Position.Top" type="target"/>
    <Handle :position="Position.Bottom" type="source"/>
  </div>
</template>

<script setup>
import {v4 as uuidv4} from "uuid";
import {Handle, Position} from "@vue-flow/core";
import {NodeToolbar} from "@vue-flow/node-toolbar";
import {ref} from "vue";

// Accepting props
const props = defineProps(["label", "id", "data", "selected"]);


// Called when adding properties & methods using the node toolbar
function addProperty() {
  const newProperty = {
    id: uuidv4(),
    name: "newProperty",
    accessModifier: "private",
    type: "Object",
    generateSetter: false,
    generateGetter: false,
  };
  props.data.classData.properties.push(newProperty);
}
function addMethod() {
  const newMethod = {
    id: uuidv4(),
    name: "newMethod",
    accessModifier: "private",
    returnType: "Object",
    parameters: [],
  }
  props.data.classData.methods.push(newMethod);
}


// Expands and collapses the node content
function toggleExpanded() {
  props.data.isExpanded = !props.data.isExpanded;
}


// Determines toolbar visibility
const isToolbarVisible = ref(false);
function toggleToolbarVisibility() {
  isToolbarVisible.value = !isToolbarVisible.value;
}


</script>
