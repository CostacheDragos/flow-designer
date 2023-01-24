<template>
  <div class="bg-slate-600 border-l-4 border-gray-900 w-80 select-none">
    <div v-if="!selectedNodeData" class="grid place-items-center h-full">
      <div>
        <font-awesome-icon icon="fa-solid fa-gears" color="white"  size="10x"/>
        <h2 class="text-white normal-case mt-2">Select a node to edit</h2>
      </div>
    </div>

    <!-- Information about the selected class node -->
    <template v-if="selectedNodeData">
      <!-- Name -->
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
            <li v-for="(property, propertyIndex) in selectedNodeData.classData.properties" :key="property.id">
              <details class="duration-300 text-white" >
                <summary class="flex hover:bg-gray-400 py-1">
                  <p class="grow text-white normal-case"> {{ property.name }} </p>
                  <div class="my-auto cursor-pointer px-2" @click.prevent="removeProperty(`${propertyIndex}`)">
                    <font-awesome-icon icon="fa-solid fa-xmark" color="red" />
                  </div>
                </summary>
                <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 hover:border hover:border-gray-500">
                  <ul class="p-2 space-y-2">
                    <!-- Property name editing -->
                    <li class="flex">
                      <label class="normal-case">Name:</label>
                      <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             :value="property.name"
                             @keyup.enter="changePropertyName($event.target, property)"
                             @focusout="onPropertyNameInputLostFocus($event.target, property)"
                      />
                    </li>
                    <!-- Property type editing -->
                    <li class="flex">
                      <label class="normal-case">Type:</label>
                      <input type="text" list="cars"
                              class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             :value="property.type"
                             @keyup.enter="changePropertyType($event.target, property)"
                             @focusout="onPropertyTypeInputLostFocus($event.target, property)"
                      />
                      <datalist id="cars">
                        <option v-for="dataType in generalDataTypes">
                          {{ dataType }}
                        </option>
                      </datalist>
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
              <details class="duration-300 text-white" >
                <summary class="flex hover:bg-gray-400 py-1">
                  <p class="grow text-white normal-case"> {{ method.name }} </p>
                  <div class="my-auto cursor-pointer px-2" @click.prevent="removeMethod(`${methodIndex}`)">
                    <font-awesome-icon icon="fa-solid fa-xmark" color="red" />
                  </div>
                </summary>
                <div class="mx-2 hover:shadow-lg hover:shadow-gray-500 hover:border hover:border-gray-500">
                  <ul class="p-2 space-y-2">
                    <!-- Method name editing -->
                    <li class="flex">
                      <label class="normal-case w-16">Name:</label>
                      <input class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             :value="method.name"
                             @keyup.enter="changeMethodName($event.target, method)"
                             @focusout="onMethodNameInputLostFocus($event.target, method)"
                      />
                    </li>
                    <!-- Method return type editing -->
                    <li class="flex">
                      <label class="normal-case w-16">Return:</label>
                      <input type="text" list="cars"
                             class="bg-gray-500 rounded ml-1 px-2 w-36
                                    border border-gray-500
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                             :value="method.returnType"
                             @keyup.enter="changeMethodReturnType($event.target, method)"
                             @focusout="onMethodReturnTypeInputLostFocus($event.target, method)"
                      />
                      <datalist id="cars">
                        <option v-for="dataType in generalDataTypes">
                          {{ dataType }}
                        </option>
                        <option>void</option>
                      </datalist>
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
import {ref, watch} from "vue";

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

const generalDataTypes = ["int", "long", "float", "double", "bool", "char", "string"];

// ****** Class properties functions ******
function addProperty() {
  const newProperty = {
    id: uuidv4(),
    name: "newProperty",
    type: "Object",
  };
  selectedNodeData.value.classData.properties.push(newProperty);
}
function removeProperty(propertyIndex) {
  selectedNodeData.value.classData.properties.splice(propertyIndex, 1);
}

// Called when the user presses enter in a property name input field signaling that he wishes to change
// the property name
// TODO IMPLEMENT MORE VALIDATIONS ON NAMES
function changePropertyName(inputElement, property) {
  if(inputElement.value.length) {
    property.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
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

// TODO IMPLEMENT MORE VALIDATIONS ON TYPES
function changePropertyType(inputElement, property) {
  if(inputElement.value.length) {
    property.type = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
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



// ****** Class methods functions ******
function addMethod() {
  const newMethod = {
    id: uuidv4(),
    name: "newMethod",
    returnType: "Object",
    parameters: [],
  }
  selectedNodeData.value.classData.methods.push(newMethod);
}
function removeMethod(methodIndex) {
  selectedNodeData.value.classData.methods.splice(methodIndex, 1);
}
function changeMethodName(inputElement, method) {
  if(inputElement.value.length) {
    method.name = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
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
function changeMethodReturnType(inputElement, method) {
  if(inputElement.value.length) {
    method.returnType = inputElement.value;

    // Remove the red border if there was any previous error
    inputElement.classList.remove("focus:border-red-600");
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

</script>