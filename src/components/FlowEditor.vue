<template>
  <div>
     <Sidebar class="horizontal-resize"/>
     <VueFlow v-model="elements" @dragover="onDragOver" @drop="onDrop" @keyup.delete="onDeleteKeyup">
       <Background/>
       <template v-slot:node-class="props">
         <class-node :label="props.label" :data="props.data" :selected="props.selected" :id="props.id" />
       </template>
       <template v-slot:edge-inheritance="props">
         <inheritance-edge v-bind="props"/>
       </template>
     </VueFlow>
    <SelectionMenu/>
  </div>
</template>

<script setup>
import {v4 as uuidv4} from "uuid";
import {nextTick, provide, reactive, ref, watch} from "vue";

import {VueFlow, useVueFlow, MarkerType, Position} from "@vue-flow/core";
import {Background} from "@vue-flow/background";

import Sidebar from "@/components/Sidebar.vue";
import SelectionMenu from "@/components/SelectionMenu.vue"
import ClassNode from "@/components/nodes/ClassNode.vue";
import InheritanceEdge from "@/components/edges/InheritanceEdge.vue";

const { addNodes, addEdges, removeNodes, findNode, getSelectedNodes, vueFlowRef, project, onConnect } = useVueFlow();

// Initial elements (for testing only)
const elements = ref([
  {
    id: uuidv4(),
    label: "Class 1",
    type: "class",
    position: { x: 100, y: 100 },
    data: {
      toolbarPosition: Position.Right,
      classData: {
        name: "Class 1",
        properties: [],
        methods: [{
          name: "defaultMethod",
          returnType: "void",
          parameters: [{name: "param1", type:"int"}],
          selectedParameter: undefined, // used for UI purposes only
        }],
      },
    },
  },
  {
    id: uuidv4(),
    label: "Class 2",
    type: "class",
    position: { x: 200, y: 200 },
    data: {
      toolbarPosition: Position.Right,
      classData: {
        name: "Class 2",
        properties: [],
        methods: [],
      },
    },
  },
]);


// Called when 2 nodes are connected
onConnect((params) => {
  addEdges([
    {
      ...params,
      type: "inheritance",
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

  const newNodeId = uuidv4();
  const newNode = {
    id: newNodeId,
    label: `Class`,
    type: "class",
    position,
    data: {
      toolbarPosition: Position.Right,
      classData: {
        name: "Class",
        properties: [],
        methods: [],
      },
    },
  }

  // Add the node to vue flow
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


// Deletes the selected nodes when the 'delete' key is pressed
function onDeleteKeyup() {
  removeNodes(getSelectedNodes.value);
}

</script>

<style scoped>
.horizontal-resize {
  resize: horizontal;
  overflow: auto;
}
</style>
