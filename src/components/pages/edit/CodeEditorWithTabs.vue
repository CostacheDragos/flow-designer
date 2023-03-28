<template>

  <div class="w-full h-2 bg-gray-900 cursor-row-resize flex-shrink-0" @mousedown="resizeStart"/>
  <div class="bg-gray-700 h-60 normal-case" id="code-editor-container">
    <div class="flex float-right">
      <!-- Download files button -->
      <div class="mr-1 tooltip tooltip-bottom" data-tip="Download editor contents">
        <button class="px-2 bg-gray-800 rounded-b transition hover:bg-gray-600" @click="downloadFiles">
          <i class="bi bi-download text-white"></i>
        </button>
      </div>
      <!-- Close button -->
      <div class="ml-1 tooltip tooltip-bottom" data-tip="Close">
        <button class="px-2 bg-gray-800 rounded-b transition hover:bg-gray-600" @click="emit('close_editor')">
          <font-awesome-icon icon="fa-solid fa-angle-down" color="white" size="sm"/>
        </button>
      </div>
    </div>

    <!-- TODO change the way you handle many tabs, don't wrap them because it causes resize problems -->
    <div class="flex flex-wrap w-10/12 mx-auto pl-1 select-none">
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

    <!-- Assign a code editor to each class -->
    <div v-for="classData in props.generatedClasses" v-show="classData.isTabOpen" :key="classData.id" class="h-full">
      <CodeEditor v-model="classData.code" height="100%" width="91%"
                  class="pb-6 mx-auto"
                  :language_selector="false" :languages="[['cpp', 'C++']]"/>
    </div>

  </div>

</template>

<script setup>
import hljs from "highlight.js";
import  CodeEditor  from 'simple-code-editor';


import {v4 as uuidv4} from "uuid";
import JSZip from "jszip";

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


// Downloads an archive containing all the files open if the editor
function downloadFiles() {
  // Create a new instance of JSZip
  const zip = new JSZip();

  // Add the files open in the editor to the archive
  const fileNamesOcc = {};
  props.generatedClasses.forEach((classData) => {
    let extension = ".h";

    let fullFileName = `${classData.className}${extension}`;
    if(!(fullFileName in fileNamesOcc))
      fileNamesOcc[fullFileName] = 1;
    else {
      fileNamesOcc[fullFileName]++;
      fullFileName = `${classData.className} (${fileNamesOcc[fullFileName]})${extension}`;
    }

    zip.file(fullFileName, classData.code);
  });

  // generate the zip file asynchronously
  zip.generateAsync({type:"blob"})
      .then(function(content) {
        // create a download link for the zip file
        const downloadLink = document.createElement('a');
        downloadLink.download = 'generated.zip';
        downloadLink.href = URL.createObjectURL(content);
        downloadLink.click();
      });
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

<style scoped>
#code-editor-container {
  max-height: 95%;
}
</style>

