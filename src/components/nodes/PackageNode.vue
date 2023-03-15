<template>
  <NodeResizer min-width="320" min-height="128"/>
  <!-- !!!! DO NOT remove the id from this element, it is being used in the flowEditor component
    when a new node is being dropped. If the new element is being dropped on top of this package node, then that node's parent
    will be this package node -->
  <div class="vue-flow__node-default package-node bg-cyan-700 h-full w-full flex flex-col"
       :class="{'bg-opacity-30': !selected, 'bg-opacity-70 shadow-lg shadow-sky-400': selected}"
       @dragleave="onDragLeave"
       @dragover="onDragOver"
       @drop="onDragLeave">
    <h2 class="font-bold normal-case text-xl border-b border-black h-7">{{ label }}</h2>
    <div :id="id"
         class="flex-grow rounded-lg mt-2"
         :class="{'border border-dashed border-2 border-black': data.isIntersecting}"
         v-text="data.isIntersecting ? 'Drop here' : ''">
    </div>
  </div>
</template>

<script setup>
import {Handle, Position} from "@vue-flow/core";
import {NodeResizer} from "@vue-flow/node-resizer";

// Accepting props
const props = defineProps(["label", "id", "data", "selected"]);

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