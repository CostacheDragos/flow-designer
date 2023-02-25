<template>

  <div class="w-full h-2 bg-gray-900 cursor-row-resize flex-shrink-0" @mousedown="resizeStart"/>

  <div class="bg-gray-700 h-60 normal-case" id="code-editor-container">
    <div class="flex w-11/12 mx-auto pl-1">
      <button v-for="(classData, idx) in props.generatedClasses"
              class="bg-gray-500 px-3 mt-1 rounded-t text-gray-300 transition hover:text-black hover:bg-gray-200"
              :class="classData.isTabOpen ? 'bg-white text-black mx-1 shadow-lg shadow-white' : ''"
              @click="changeTab(idx)">
        {{ classData.className }}
      </button>
    </div>
    <CodeEditor v-for="classData in props.generatedClasses" v-show="classData.isTabOpen"
                v-model="classData.code" height="100%" width="91%" border_radius="0px"
                class="pb-6 mx-auto"
                :language_selector="true" :languages="[['csharp', 'C#']]"/>
  </div>

</template>

<script setup>
import hljs from "highlight.js";
import  CodeEditor  from 'simple-code-editor';


import {ref} from "vue";

const props = defineProps(["generatedClasses"])

const openTabIdx = ref(0);
function changeTab(newTabIdx) {
  props.generatedClasses[openTabIdx.value].isTabOpen = false;

  openTabIdx.value = newTabIdx;
  props.generatedClasses[newTabIdx].isTabOpen = true;
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

