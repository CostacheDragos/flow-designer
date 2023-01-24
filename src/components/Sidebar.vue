<template>
  <div class="bg-slate-600 border-r-4 border-gray-900 w-56 select-none">
    <details class="bg-inherit duration-300 border-b-4 border-gray-900">
      <summary class="bg-inherit px-5 py-3 text-lg cursor-pointer text-white border-b border-gray-900">Nodes</summary>
      <p class="text-white normal-case text-xs">Drag & Drop to place nodes</p>
      <div class="p-2">
        <ul>
          <li>
            <div class="vue-flow__node-default mx-auto hover:cursor-pointer" :draggable="true" @dragstart="onDragStart($event, 'classNode')">
              Class
            </div>
          </li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script setup>

// Called when the node is being dragged
function onDragStart(event) {
  event.dataTransfer.effectAllowed = 'move';
}
</script>
