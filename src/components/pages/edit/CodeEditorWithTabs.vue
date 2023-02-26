<template>

  <div class="w-full h-2 bg-gray-900 cursor-row-resize flex-shrink-0" @mousedown="resizeStart"/>
  <div class="bg-gray-700 h-60 normal-case" id="code-editor-container">
    <button class="float-right px-2 rounded-l bg-gray-800 transition hover:bg-gray-600" @click="emit('close_editor')">
      <font-awesome-icon icon="fa-solid fa-angle-down" color="white" size="sm"/>
    </button>

    <!-- TODO change the way you handle many tabs, don't wrap them because it causes resize problems -->
    <div class="flex flex-wrap w-10/12 mx-auto pl-1">
      <button v-for="(classData, idx) in props.generatedClasses" :key="classData.id"
              class="bg-gray-500 px-3 mt-1 rounded-t text-gray-300 transition hover:text-black hover:bg-gray-200"
              :class="classData.isTabOpen ? 'bg-white text-black mx-1 shadow-lg shadow-white' : ''"
              @click="changeTab(idx)">
        {{ classData.className }}
      </button>
      <button class="bg-gray-900 mx-1 mt-auto rounded-t px-2 h-fit w-fit hover:bg-gray-600 transition" @click="createNewTab">
        <font-awesome-icon icon="fa-plus fa-solid" color="white"/>
      </button>
    </div>
    <CodeEditor v-for="classData in props.generatedClasses" v-show="classData.isTabOpen" :key="classData.id"
                v-model="classData.code" height="100%" width="91%" border_radius="0px"
                class="pb-6 mx-auto"
                :language_selector="true" :languages="[['csharp', 'C#']]"/>
  </div>

</template>

<script setup>
import hljs from "highlight.js";
import  CodeEditor  from 'simple-code-editor';


import {computed, ref} from "vue";
import {v4 as uuidv4} from "uuid";

const props = defineProps(["generatedClasses"]);
const emit = defineEmits(["close_editor"]);

// If the user opens the code editor with no generated code
// open a new empty tab
if(props.generatedClasses.length === 0)
  createNewTab();

function changeTab(newTabIdx) {
  const openTabIdx = props.generatedClasses.findIndex(classData => classData.isTabOpen === true);
  if(openTabIdx !== -1)
    props.generatedClasses[openTabIdx].isTabOpen = false;

  props.generatedClasses[newTabIdx].isTabOpen = true;
}
function createNewTab() {
  props.generatedClasses.push({
    id: uuidv4(),
    className: "NewClass",
    code: "",
    isTabOpen: false,
  });

  changeTab(props.generatedClasses.length - 1);
}

// Resize bar functions
let isBeingResized = false;
function resizeStart(event) {
  event.preventDefault();

  isBeingResized = true;

  document.addEventListener("mouseup", resizeStop);
  document.addEventListener("mousemove", resizing);
  document.body.style.cursor = "row-resize";
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

  const codeEditorContainer = document.getElementById("code-editor-container");
  codeEditorContainer.style.height = `${window.innerHeight - event.clientY}px`;
}


</script>

