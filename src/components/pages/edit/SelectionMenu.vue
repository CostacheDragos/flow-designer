<template>
  <div class="h-full w-1.5 bg-gray-900 cursor-col-resize flex-shrink-0" @mousedown="resizeStart"/>

  <div class="bg-slate-600 w-72 select-none overflow-y-auto overflow-x-hidden max-w-lg min-w-fit" id="selection-menu-container">
    <div v-if="!selectedNodeData" class="grid place-items-center h-full">
      <div>
        <font-awesome-icon icon="fa-solid fa-gears" color="white"  size="10x"/>
        <h2 class="text-white normal-case mt-2">Select a node to edit</h2>
      </div>
    </div>

    <!-- Information about the selected class node -->
    <template v-if="selectedNodeData">
      <!-- Name -->
      <details class="duration-300 text-white border-b-4 p-4 border-gray-900">
        <summary class="flex">
          <font-awesome-icon icon="fa-solid fa-pen-to-square" color="white" class="my-auto cursor-pointer mx-2"/>
          <div class="flex grow" @click.prevent>
            <h1 class="grow my-auto normal-case">
              {{ selectedNodeData.classData.name }}
            </h1>
            <font-awesome-icon icon="fa-solid fa-trash" color="red" class="cursor-pointer my-auto mx-2" @click="removeNodes([`${getSelectedNodes[0].id}`])"/>
          </div>
        </summary>
        <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 border border-slate-600 hover:border-gray-500">
          <ul class="p-2 space-y-2">
            <!-- Class name editing -->
            <li class="flex">
              <label class="normal-case text-left">Name:</label>
              <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                     :value="selectedNodeData.classData.name"
                     @keyup.enter="changeClassName($event.target)"
                     @focusout="onClassNameInputLostFocus($event.target)"
              />
            </li>
          </ul>
        </div>
      </details>

      <!-- Properties controls -->
      <details class="bg-inherit duration-300 border-b-4 border-gray-900">
        <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Properties</summary>
        <div class="hover:bg-gray-400 py-2 border-b border-gray-900 cursor-pointer" @click="addProperty">
          <font-awesome-icon icon="fa-plus fa-solid" color="white" />
        </div>
        <div class="py-2">
          <ul>
            <li v-for="(property, propertyIndex) in selectedNodeData.classData.properties" :key="property.id">
              <details class="duration-300 text-white" >
                <summary class="flex my-1">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" color="white" class="my-auto cursor-pointer mx-2"/>
                  <div @click.prevent class="flex grow">
                    <p class="grow text-white normal-case"> {{ property.name }} </p>
                    <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer mx-2"
                                       @click.prevent="removeProperty(`${propertyIndex}`)"/>
                  </div>
                </summary>
                <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 border border-slate-600 hover:border-gray-500">
                  <ul class="p-2 space-y-2">
                    <!-- Property name editing -->
                    <li class="flex">
                      <label class="normal-case text-left w-16">Name:</label>
                      <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             :value="property.name"
                             @keyup.enter="changePropertyName($event.target, property)"
                             @focusout="onPropertyNameInputLostFocus($event.target, property)"
                      />
                    </li>
                    <!-- Property access editing -->
                    <li class="flex">
                      <label class="normal-case text-left w-16">Access:</label>
                      <select class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             v-model="property.accessModifier" @change="propertyAccessChanged">
                        <option value="private">private</option>
                        <option value="public">public</option>
                      </select>
                    </li>
                    <!-- Property type editing -->
                    <li class="flex">
                      <label class="normal-case text-left w-16">Type:</label>
                      <input type="text" list="property-data-types"
                              class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             :value="property.type"
                             @keyup.enter="changePropertyType($event.target, property)"
                             @focusout="onPropertyTypeInputLostFocus($event.target, property)"
                      />
                      <datalist id="property-data-types">
                        <option v-for="dataType in generalDataTypes">
                          {{ dataType }}
                        </option>
                      </datalist>
                    </li>
                    <!-- Property setter & getter editing -->
                    <li class="flex">
                      <label class="normal-case text-left w-16">Setter:</label>
                      <input type="checkbox"
                             class="bg-gray-500 rounded ml-1 my-auto px-2 h-5 w-5
                                    border border-gray-500
                                    cursor-pointer
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                              v-model="property.generateSetter" @change="flowStore.changesOccurred()">

                      <label class="normal-case text-left w-16 ml-auto">Getter:</label>
                      <input type="checkbox"
                             class="bg-gray-500 rounded ml-1 my-auto px-2 h-5 w-5
                                    border border-gray-500
                                    cursor-pointer
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             v-model="property.generateGetter" @change="flowStore.changesOccurred()">
                    </li>
                  </ul>
                </div>
              </details>
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
            <li v-for="(method, methodIndex) in selectedNodeData.classData.methods" :key="method.id">
              <details class="duration-300 text-white">
                <summary class="flex my-1">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" color="white" class="my-auto cursor-pointer px-2"/>
                  <div @click.prevent class="flex grow">
                    <p class="grow text-white normal-case"> {{ method.name }} </p>
                    <font-awesome-icon icon="fa-solid fa-xmark" color="red" class="my-auto cursor-pointer px-2"
                                       @click.prevent="removeMethod(`${methodIndex}`)"/>
                  </div>
                </summary>
                <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 border border-slate-600 hover:border-gray-500">
                  <ul class="p-2 space-y-2">
                    <!-- Method name editing -->
                    <li class="flex">
                      <label class="normal-case w-16 text-left">Name:</label>
                      <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             :value="method.name"
                             @keyup.enter="changeMethodName($event.target, method)"
                             @focusout="onMethodNameInputLostFocus($event.target, method)"
                      />
                    </li>
                    <!-- Method access editing -->
                    <li class="flex">
                      <label class="normal-case text-left w-16">Access:</label>
                      <select class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                              v-model="method.accessModifier" @change="methodAccessChanged">
                        <option value="private">private</option>
                        <option value="public">public</option>
                      </select>
                    </li>
                    <!-- Method return type editing -->
                    <li class="flex">
                      <label class="normal-case w-16 text-left">Return:</label>
                      <input type="text" list="method-return-data-types"
                             class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             :value="method.returnType"
                             @keyup.enter="changeMethodReturnType($event.target, method)"
                             @focusout="onMethodReturnTypeInputLostFocus($event.target, method)"
                      />
                      <datalist id="method-return-data-types">
                        <option v-for="dataType in generalDataTypes">
                          {{ dataType }}
                        </option>
                        <option>void</option>
                      </datalist>
                    </li>
                    <!-- Method parameters editing -->
                    <li>
                      <div class="flex">
                        <label class="normal-case w-16 text-left">Param:</label>
                        <select class="bg-gray-500 focus:bg-white focus:text-black rounded ml-1 px-2 w-36 border border-gray-500"
                                v-model="method.selectedParameter" :disabled="method.parameters.length === 0">
                          <option v-for="parameter in method.parameters" :value="parameter">{{ parameter.type }} {{ parameter.name }}</option>
                        </select>
                        <div class="ml-1">
                          <font-awesome-icon icon="fa-plus fa-solid" color="white" size="xs" class="cursor-pointer" @click="addParameter(method)"/>
                        </div>
                      </div>

                      <div v-if="method.selectedParameter" class="ml-5 flex">
                        <ul class="p-2 space-y-2 list-disc grow">
                          <!-- Parameter name editing -->
                          <li class="flex">
                            <label class="normal-case text-left">Name:</label>
                            <input class="bg-gray-500 rounded ml-1 px-2 w-28
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                   :value="method.selectedParameter.name"
                                   @keyup.enter="changeMethodParameterName($event.target, method)"
                                   @focusout="onMethodParameterNameInputLostFocus($event.target, method)"
                            />
                          </li>
                          <!-- Parameter type editing -->
                          <li class="flex">
                            <label class="normal-case text-left">Type:</label>
                            <input type="text" list="parameter-data-types"
                                   class="bg-gray-500 rounded ml-1 px-2 w-28
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                   :value="method.selectedParameter.type"
                                   @keyup.enter="changeMethodParameterType($event.target, method)"
                                   @focusout="onMethodParameterTypeInputLostFocus($event.target, method)"
                            />
                            <datalist id="parameter-data-types">
                              <option v-for="dataType in generalDataTypes">
                                {{ dataType }}
                              </option>
                            </datalist>
                          </li>
                        </ul>
                        <font-awesome-icon icon="fa-solid fa-trash" color="red" class="cursor-pointer my-auto ml-2" @click="removeSelectedParameter(method)"/>
                      </div>
                    </li>
                  </ul>
                </div>
              </details>
            </li>
          </ul>
        </div>
      </details>
    </template>
  </div>
</template>

<script setup>
import {v4 as uuidv4} from "uuid";
import {onMounted, onUnmounted, ref, watch} from "vue";

import { useVueFlow } from "@vue-flow/core";

import { useFlowStore } from "@/stores/flow.js";


const { getSelectedNodes, removeNodes } = useVueFlow();

const flowStore = useFlowStore();

// Listens for when the node selection changes and updates the selection menu accordingly
const selectedNodeData = ref();
watch(getSelectedNodes, () => {
  if(getSelectedNodes.value.length === 1) {
    selectedNodeData.value = getSelectedNodes.value[0].data;
  } else {
    selectedNodeData.value = undefined;
  }
});

const generalDataTypes = ["int", "long", "float", "double", "bool", "char", "string"];


// ****** General class functions ******
function changeClassName(inputElement) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    selectedNodeData.value.classData.name = inputElement.value;
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
function onClassNameInputLostFocus(inputElement) {
  // Save changes
  changeClassName(inputElement);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual property
  inputElement.value = selectedNodeData.value.classData.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}


// ****** Class properties functions ******
function addProperty() {
  const newProperty = {
    id: uuidv4(),
    name: "newProperty",
    accessModifier: "private",
    type: "Object",
    generateSetter: false,
    generateGetter: false,
  };
  selectedNodeData.value.classData.properties.push(newProperty);
  flowStore.changesOccurred();
}
function removeProperty(propertyIndex) {
  selectedNodeData.value.classData.properties.splice(propertyIndex, 1);
  flowStore.changesOccurred();
}

// Called when the user presses enter in a property name input field signaling that he wishes to change
// the property name
function changePropertyName(inputElement, property) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    property.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
// When the user leaves an input field we need to update the value
// to contain the name of the property (they may differ if the user tried to change to an invalid name
// or if the user simply clicked away without saving the changes)
function onPropertyNameInputLostFocus(inputElement, property) {
  // Save changes
  changePropertyName(inputElement, property);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual property
  inputElement.value = property.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}
function changePropertyType(inputElement, property) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    property.type = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onPropertyTypeInputLostFocus(inputElement, property) {
  changePropertyType(inputElement, property);

  inputElement.value = property.type;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

// When a new access modifier is selected for a property
function propertyAccessChanged() {
  flowStore.changesOccurred();
}

// ****** Class methods functions ******
function addMethod() {
  const newMethod = {
    id: uuidv4(),
    name: "newMethod",
    accessModifier: "private",
    returnType: "Object",
    parameters: [],
  }
  selectedNodeData.value.classData.methods.push(newMethod);
  flowStore.changesOccurred();
}
function removeMethod(methodIndex) {
  selectedNodeData.value.classData.methods.splice(methodIndex, 1);
  flowStore.changesOccurred();
}

// Method name editing
function changeMethodName(inputElement, method) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    method.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");

    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onMethodNameInputLostFocus(inputElement, method) {
  // Save changes
  changeMethodName(inputElement, method);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual method
  inputElement.value = method.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

// When a new access modifier is selected for a method
function methodAccessChanged() {
  flowStore.changesOccurred();
}

// Method return type editing
function changeMethodReturnType(inputElement, method) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    method.returnType = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onMethodReturnTypeInputLostFocus(inputElement, method) {
  changeMethodReturnType(inputElement, method);

  inputElement.value = method.returnType;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

// Method parameters editing
function addParameter(method) {
  const newParameter = {
    name: "newParameter",
    type: "Object",
  };
  method.parameters.push(newParameter);
  method.selectedParameter = newParameter;
  flowStore.changesOccurred();
}
function removeSelectedParameter(method) {
  const parameterIndex = method.parameters.indexOf(method.selectedParameter);
  if(parameterIndex !== -1) {
    method.parameters.splice(parameterIndex, 1);
    method.selectedParameter = undefined;
    flowStore.changesOccurred();
  }
}

// Method parameter name editing
function changeMethodParameterName(inputElement, method) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    method.selectedParameter.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onMethodParameterNameInputLostFocus(inputElement, method) {
  // Save changes
  changeMethodParameterName(inputElement, method);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual method
  inputElement.value = method.selectedParameter.name;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

// Method parameter type editing
function changeMethodParameterType(inputElement, method) {
  inputElement.value = inputElement.value.trim();
  if(checkNameValidity(inputElement.value)) {
    method.selectedParameter.type = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
    flowStore.changesOccurred();
  }
  else {
    // Color the border red to let the user know that the value is not valid
    inputElement.classList.add("focus:border-red-600");
  }
}
function onMethodParameterTypeInputLostFocus(inputElement, method) {
  // Save changes
  changeMethodParameterType(inputElement, method);

  // If the input at the time of focus lost is not valid, we need to
  // give the input value the value of the actual method
  inputElement.value = method.selectedParameter.type;

  // Remove the red border if there was any previous error
  inputElement.classList.remove("focus:border-red-600");
}

// Validation functions
// Checks the validity of the names given to
// classes, methods, parameters, properties etc
function checkNameValidity(name) {
  return /^[A-Za-z][A-Za-z0-9_]*$/.test(name);
}


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