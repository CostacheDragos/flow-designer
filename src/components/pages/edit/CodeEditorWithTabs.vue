<template>

  <div class="w-full h-2 bg-gray-900 cursor-row-resize flex-shrink-0" @mousedown="resizeStart"/>

  <div class="bg-rose-600 h-1/2 normal-case" id="code-editor-container">
    <CodeEditor v-model="code" width="100%" height="100%" border_radius="0px" :language_selector="true" :languages="[['csharp', 'C#']]"/>
  </div>

</template>

<script setup>
// import hljs from "highlight.js";
import  CodeEditor  from 'simple-code-editor';

import {ref} from "vue";


const code =  ref(`
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleCodeGenerator1.Models.Class
{
    public class ClassModel
    {
        public string Name { get; set; } = string.Empty;
        public List<PropertyModel> Properties { get; set; } = new();
        public List<MethodModel> Methods { get; set; } = new();
        public List<string>? InheritedClassesNames { get; set; }
    }
}
`);

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

