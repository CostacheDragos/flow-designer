<template>
  <NodeResizer min-width="320" min-height="128"/>
  <div class="vue-flow__node-default package-node bg-opacity-60 h-full w-full" :class="data.isIntersecting ? 'bg-red-700' : 'bg-cyan-700'"
       @dragleave="onDragLeave"
       @dragover="onDragOver"
       @drop="onDragLeave">
    <h2 class="font-bold text-xl">{{ label }}</h2>
  </div>
</template>

<script setup>
import {Handle, Position} from "@vue-flow/core";
import {NodeResizer} from "@vue-flow/node-resizer";

// Accepting props
const props = defineProps(["label", "id", "data"]);

// Highlight the node when the user wants to add a new node by dragging and dropping,
// indicating that this node is a possible container
// Note: the node will be highlighted even if the user intends to add a node that cannot be the child of this package
// as that data is not available to check before the user actually drops the element
function onDragOver(event) {
  event.preventDefault();
  props.data.isIntersecting = true;
}
function onDragLeave(event) {
  event.preventDefault();
  props.data.isIntersecting = false;
}

</script>

<style scoped>
.package-node {
  min-width: 320px;
  min-height: 128px;
}
</style>