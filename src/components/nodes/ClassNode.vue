<template>
  <NodeToolbar :is-visible="isToolbarVisible" :position="data.toolbarPosition">
    <div class="flex flex-col w-fit">
      <button class="bg-blue-500 text-white rounded py-2 px-4 block text-sm font-bold w-full" @click="addProperty">
        Add Property
      </button>
      <button class="bg-blue-500 text-white rounded py-2 px-4 block mt-1 text-sm font-bold w-full" @click="addMethod">
        Add Method
      </button>
      <button class="rounded py-2 px-4 block mt-1 text-sm font-bold w-full" @click="emits('removeNodeFromParentPackage', id)"
          :class="parentNode === '' ? 'disabled bg-gray-400 text-gray-200' : 'bg-blue-500 text-white'">
        Remove from Package
      </button>
    </div>
  </NodeToolbar>

  <div :class="{'border-sky-400 border-2 shadow-sm shadow-sky-400': selected, 'border-black border-2': !selected}"
       class="vue-flow__node-default w-fit">
    <div class="flex">
      <div class="my-auto rounded-full hover:bg-sky-400 px-1" @click="toggleExpanded">
        <font-awesome-icon v-show="!props.data.isExpanded" icon="fa-solid fa-angle-right"/>
        <font-awesome-icon v-show="props.data.isExpanded" icon="fa-solid fa-angle-down"/>
      </div>

      <!-- Regular class label -->
      <h2 class="normal-case grow break-all">
        {{ label }}
      </h2>

      <div class="my-auto rounded-full hover:bg-sky-400 px-1" @click="toggleToolbarVisibility">
        <font-awesome-icon v-show="!isToolbarVisible" icon="fa-plus fa-solid"/>
        <font-awesome-icon v-show="isToolbarVisible" icon="fa-solid fa-minus"/>
      </div>
    </div>

    <div v-show="props.data.isExpanded" class="divide-y-2 divide-black mt-2">
      <ul class="pb-2">
        <li v-for="property in data.classData.properties" class="my-1 px-1 shadow border border-gray-500 rounded normal-case flex">
          <pre class="flex mx-auto">{{ property.accessModifier }} {{
              property.type.isConst ? "const " : ""
            }}{{
              property.type.name }}<pre v-for="(pointer, pointerIdx) in property.type.pointerList" :key="pointer.id">{{pointerIdx !== 0 && property.type.pointerList[pointerIdx - 1].isConst === true ? " " : ""}}{{ pointer.isConst ? "*const" : "*"}}</pre> {{
              property.name
            }}<pre v-for="dimension in property.type.arrayDimensions" :key="dimension.id">[{{dimension.maxLength}}]</pre></pre>
        </li>
      </ul>
      <ul class="pt-2">
        <li v-for="method in data.classData.methods" class="my-1 px-1 shadow border border-gray-500 rounded normal-case flex">
          <pre class="flex mx-auto">{{
              method.accessModifier
            }} {{
              method.returnType.isConst ? "const " : ""
            }}{{
              method.returnType.name
            }}<pre v-for="(pointer, pointerIdx) in method.returnType.pointerList" :key="pointer.id">{{pointerIdx !== 0 && method.returnType.pointerList[pointerIdx - 1].isConst === true ? " " : ""}}{{ pointer.isConst ? "*const" : "*"}}</pre> {{
              method.name }}{{ method.parameters.length > 0 ? '(...)' : '()' }}</pre>
        </li>
      </ul>
    </div>

    <Handle :position="Position.Top" type="target" />
    <Handle :position="Position.Bottom" type="source"/>
    <Handle :position="Position.Right" :connectable="false"/>
    <Handle :position="Position.Left" :connectable="false"/>
  </div>
</template>

<script setup>
import {v4 as uuidv4} from "uuid";
import {Handle, Position} from "@vue-flow/core";
import {NodeToolbar} from "@vue-flow/node-toolbar";
import {ref} from "vue";

// Accepting props
const props = defineProps(["label", "id", "data", "selected", "parentNode"]);
const emits = defineEmits(["removeNodeFromParentPackage"]);

// Called when adding properties & methods using the node toolbar
function addProperty() {
  const newProperty = {
    id: uuidv4(),
    name: "newProperty",
    accessModifier: "private",
    type: {
      name: "char",
      isConst: false,
      pointerList: [],
      arrayDimensions: [],
    },
    generateSetter: false,
    generateGetter: false,
    isStatic: false,
  };
  props.data.classData.properties.push(newProperty);
  props.data.isExpanded = true;
}
function addMethod() {
  const newMethod = {
    id: uuidv4(),
    name: "newMethod",
    accessModifier: "private",
    returnType: {
      name: "char",
      isConst: false,
      pointerList: [],
      arrayDimensions: [],
    },
    parameters: [],
    isVirtual: false,
    isStatic: false,
    selectedParameterID: null,
  }
  props.data.classData.methods.push(newMethod);
  props.data.isExpanded = true;
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

<style scoped>
.vue-flow__node-default {
  min-width: 10rem;
}
</style>
