<template>
  <div class="bg-slate-900 w-60 max-w-lg select-none h-full overflow-y-auto border-t border-slate-700" id="sidebar-menu-container">
    <p class="text-white normal-case text-xs border-b-2 border-gray-900 py-2">Drag & Drop to place</p>


    <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
      <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                         icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.nodesSubmenu"
                         @click="submenusOpenStatus.nodesSubmenu = !submenusOpenStatus.nodesSubmenu"/>
      <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                         icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.nodesSubmenu"
                         @click="submenusOpenStatus.nodesSubmenu = !submenusOpenStatus.nodesSubmenu"/>
      <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Nodes</h1>
    </div>
    <div class="ml-8 mb-2 text-white normal-case" v-show="submenusOpenStatus.nodesSubmenu">
      <ul class="flex flex-wrap">
        <li>
          <div class="vue-flow__node-default hover:cursor-pointer normal-case my-2 mx-auto"
               :draggable="true" @dragstart="onDragStart($event, 'class')">
            Class
          </div>
        </li>
        <li>
          <div class="vue-flow__node-default hover:cursor-pointer normal-case my-2 mx-auto bg-cyan-700 font-bold"
               :draggable="true" @dragstart="onDragStart($event, 'package')">
            Package
          </div>
        </li>
      </ul>
    </div>


    <div class="ml-4 mr-4 flex text-white border-t border-slate-700">
      <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                         icon="fa-solid fa-angle-right" v-show="!submenusOpenStatus.shapesSubmenu"
                         @click="submenusOpenStatus.shapesSubmenu = !submenusOpenStatus.shapesSubmenu"/>
      <font-awesome-icon class="my-auto cursor-pointer text-slate-400 transition hover:text-white hover:bg-slate-700 rounded-lg p-2 w-5"
                         icon="fa-solid fa-angle-down" v-show="submenusOpenStatus.shapesSubmenu"
                         @click="submenusOpenStatus.shapesSubmenu = !submenusOpenStatus.shapesSubmenu"/>
      <h1 class="bg-inherit pl-2 py-3 text-lg normal-case">Shapes</h1>
    </div>
    <div class="ml-8 text-white normal-case" v-show="submenusOpenStatus.shapesSubmenu">
      <ul class="flex flex-wrap">
        <li v-for="shape in availableShapes">
          <div class="vue-flow__node-default mx-auto hover:cursor-pointer normal-case my-2 h-fit"
               :draggable="true"
               @dragstart="onDragStart($event, 'shape', {shapeSrc: `${shape.shapeSrc}`})">
            {{ shape.name }}
            <img :src="shape.shapeSrc" class="w-10 h-10 mx-auto"/>
          </div>
        </li>
        <li>
          <div class="vue-flow__node-default mx-auto hover:cursor-pointer normal-case my-2" :draggable="true" @dragstart="onDragStart($event, 'image')">
            Image
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div class="h-full w-1.5 bg-gray-700 cursor-col-resize flex-shrink-0 hover:bg-gray-600" @mousedown="resizeStart"/>

</template>

<script setup>
import {reactive} from "vue";

const submenusOpenStatus = reactive({
  nodesSubmenu: false,
  shapesSubmenu: false,
});

const availableShapes = [
  {
    name: "Circle",
    shapeSrc: "src/assets/shapes/circle.svg",
  },
  {
    name: "Database",
    shapeSrc: "src/assets/shapes/database.svg",
  },
  {
    name: "Diamond",
    shapeSrc: "src/assets/shapes/diamond.svg",
  },
  {
    name: "Rectangle",
    shapeSrc: "src/assets/shapes/rectangle.svg",
  },
  {
    name: "Triangle",
    shapeSrc: "src/assets/shapes/triangle.svg",
  },
];

// Called when the node is being dragged
function onDragStart(event, nodeType, additionalData = null) {
  event.dataTransfer.effectAllowed = 'move';

  // Set the node type in the drag event so the editor
  // can pick it up when the user drops the new node
  event.dataTransfer.setData("node-data", JSON.stringify({nodeType, additionalData}));
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

  const selectionMenuContainer = document.getElementById("sidebar-menu-container");
  selectionMenuContainer.style.width =  `${event.clientX}px`;
}
</script>
