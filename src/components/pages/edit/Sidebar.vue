<template>
  <div class="bg-slate-600 w-60 min-w-fit max-w-lg select-none" id="sidebar-menu-container">
    <p class="text-white normal-case text-xs border-b-2 border-gray-900 py-2">Drag & Drop to place</p>
    <details class="bg-inherit duration-300 border-b-4 border-gray-900">
      <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Nodes</summary>
      <div class="p-2">
        <ul>
          <li>
            <div class="vue-flow__node-default mx-auto hover:cursor-pointer normal-case my-2" :draggable="true" @dragstart="onDragStart($event, 'class')">
              Class
            </div>
            <div class="vue-flow__node-default mx-auto hover:cursor-pointer normal-case my-2 italic" :draggable="true" @dragstart="onDragStart($event, 'interface')"
            v-text="'<< Interface >>'"/>
            <div class="vue-flow__node-default mx-auto hover:cursor-pointer normal-case my-2 bg-cyan-700 font-bold" :draggable="true" @dragstart="onDragStart($event, 'package')">
              Package
            </div>
          </li>
        </ul>
      </div>
    </details>

    <details class="bg-inherit duration-300 border-b-4 border-gray-900">
      <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Shapes</summary>
      <div class="p-2">
        <ul>
          <li>
            <div class="vue-flow__node-default mx-auto hover:cursor-pointer normal-case my-2" :draggable="true" @dragstart="onDragStart($event, 'shape')">
              Shape
            </div>
            <div class="vue-flow__node-default mx-auto hover:cursor-pointer normal-case my-2" :draggable="true" @dragstart="onDragStart($event, 'image')">
              Image
            </div>
          </li>
        </ul>
      </div>
    </details>
  </div>

  <div class="h-full w-1.5 bg-gray-900 cursor-col-resize flex-shrink-0" @mousedown="resizeStart"/>

</template>

<script setup>

// Called when the node is being dragged
function onDragStart(event, nodeType) {
  event.dataTransfer.effectAllowed = 'move';

  // Set the node type in the drag event so the editor
  // can pick it up when the user drops the new node
  event.dataTransfer.setData("node-type", nodeType);
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
