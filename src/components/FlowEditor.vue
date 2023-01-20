<template>
  <div>
     <Sidebar class="horizontal-resize"/>
     <VueFlow v-model="elements" @dragover="onDragOver" @drop="onDrop">
       <Background/>
       <template v-slot:node-class="props">
         <class-node v-bind="props" />
       </template>
     </VueFlow>
    <SelectionMenu/>
  </div>
</template>

<script setup>
import {v4 as uuidv4} from "uuid";
import {nextTick, provide, reactive, ref, watch} from "vue";

import {VueFlow, useVueFlow, MarkerType} from "@vue-flow/core";
import {Background} from "@vue-flow/background";

import Sidebar from "@/components/Sidebar.vue";
import SelectionMenu from "@/components/SelectionMenu.vue"
import ClassNode from "@/components/nodes/ClassNode.vue";

const { addNodes, addEdges, findNode, vueFlowRef, project, onConnect } = useVueFlow();

// Initial elements (for testing only)
const elements = ref([
  {
    id: uuidv4(),
    label: "Class 1",
    type: "class",
    position: { x: 100, y: 100 },
  },
  {
    id: uuidv4(),
    label: "Class 2",
    type: "class",
    position: { x: 200, y: 200 },
  },
]);


// Called when 2 nodes are connected
onConnect((params) => {
  addEdges([
    {
      ...params,
      type: "step",
      markerEnd: MarkerType.Arrow,
    },
  ]);
});


// For drag & drop from sidebar
function onDragOver(event) {
  event.preventDefault();

  event.dataTransfer.dropEffect = "move";
}
function onDrop(event) {
  // Create a new node on the position of the cursor
  const { left, top } = vueFlowRef.value.getBoundingClientRect()
  const position = project({
    x: event.clientX - left,
    y: event.clientY - top
  });

  const newNode = {
    id: uuidv4(),
    label: `Class`,
    type: "class",
    position,
  }

  addNodes([newNode]);

  // align node position after drop, so it's centered to the mouse
  nextTick(() => {
    const node = findNode(newNode.id)
    const stop = watch(
        () => node.dimensions,
        (dimensions) => {
          if (dimensions.width > 0 && dimensions.height > 0) {
            node.position = { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
            stop()
          }
        },
        { deep: true, flush: 'post' },
    )
  })
}

// We create a state which will enable us to easily transfer data between any child components
const sharedState = reactive({});
provide("editorSharedState", sharedState);

</script>

<style scoped>
.horizontal-resize {
  resize: horizontal;
  overflow: auto;
}
</style>
