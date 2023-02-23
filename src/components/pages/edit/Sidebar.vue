<template>
  <div class="bg-slate-600 w-60 min-w-fit max-w-2xl select-none" id="sidebar-menu-container">
    <details class="bg-inherit duration-300 border-b-4 border-gray-900">
      <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Nodes</summary>
      <p class="text-white normal-case text-xs">Drag & Drop to place nodes</p>
      <div class="p-2">
        <ul>
          <li>
            <div class="vue-flow__node-default mx-auto hover:cursor-pointer normal-case" :draggable="true" @dragstart="onDragStart($event, 'classNode')">
              Class
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
function onDragStart(event) {
  event.dataTransfer.effectAllowed = 'move';
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
