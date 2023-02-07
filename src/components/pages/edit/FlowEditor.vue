<template>
  <div ref="flowEditorContainerRef" class="flex flex-grow">
    <Sidebar/>
    <div class="flex-grow flex flex-col">
       <nav class="bg-slate-600 h-6 flex select-none">
         <ul class="ml-3 flex">
           <!-- Flow dropdown menu -->
           <li>
             <div class="dropdown">
               <button class="text-white rounded hover:bg-gray-500 px-2 normal-case">Flow</button>
               <ul tabindex="0" class="dropdown-content rounded py-2 bg-gray-600 w-40 mt-2">
                 <li class="rounded hover:bg-gray-500 bg-gray-600 cursor-pointer px-3 py-1 mx-1 flex" @click="downloadSaveFile">
                   <p class="text-white normal-case">Download</p>
                   <font-awesome-icon icon="fa-solid fa-download" class="ml-auto" color="white" />
                 </li>
                 <li class="rounded hover:bg-gray-500 bg-gray-600 cursor-pointer px-3 py-1 mx-1 flex" @click="$refs.fileInput.click()">
                   <input type="file" ref="fileInput" @change="uploadSavedFlow" class="hidden">
                   <p class="text-white normal-case">Upload</p>
                   <font-awesome-icon icon="fa-solid fa-upload" class="ml-auto" color="white" />
                 </li>
               </ul>
             </div>
           </li>
           <!-- Tools dropdown menu -->
           <li>
             <div class="dropdown">
               <button class="text-white rounded hover:bg-gray-500 px-2 normal-case">Tools</button>
               <ul tabindex="0" class="dropdown-content rounded py-2 bg-gray-600 w-40 mt-2">
                 <li class="rounded hover:bg-gray-500 bg-gray-600 cursor-pointer px-3 py-1 mx-1 flex" @click="downloadCodeGenerationData">
                   <p class="text-white normal-case">Code Gen.</p>
                   <font-awesome-icon icon="fa-solid fa-code" class="ml-auto my-auto" color="white" />
                 </li>
               </ul>
             </div>
           </li>
         </ul>
       </nav>
       <VueFlow v-model="elements" @dragover="onDragOver" @drop="onDrop" @keyup.delete="onDeleteKeyup" class="flex-grow">
         <Background/>
         <template v-slot:node-class="props">
           <class-node :label="props.label" :data="props.data" :selected="props.selected" :id="props.id" />
         </template>
         <template v-slot:edge-inheritance="props">
           <inheritance-edge v-bind="props"/>
         </template>
       </VueFlow>
     </div>
    <SelectionMenu/>
  </div>
</template>

<script setup>
import {v4 as uuidv4} from "uuid";
import {nextTick, ref, watch, onMounted} from "vue";

import {VueFlow, useVueFlow, MarkerType, Position} from "@vue-flow/core";
import {Background} from "@vue-flow/background";

import Sidebar from "@/components/pages/edit/Sidebar.vue";
import SelectionMenu from "@/components/pages/edit/SelectionMenu.vue"
import ClassNode from "@/components/nodes/ClassNode.vue";
import InheritanceEdge from "@/components/edges/InheritanceEdge.vue";

const { addNodes, addEdges, removeNodes, findNode, getSelectedNodes, vueFlowRef, project, onConnect, toObject,
        setNodes, setEdges, setTransform } = useVueFlow();

// Initial elements (for testing only)
const elements = ref([
  {
    id: uuidv4(),
    label: "Class1",
    type: "class",
    position: { x: 100, y: 100 },
    data: {
      toolbarPosition: Position.Right,
      isExpanded: false,
      classData: {
        name: "Class1",
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
    label: "Class2",
    type: "class",
    position: { x: 200, y: 200 },
    data: {
      toolbarPosition: Position.Right,
      isExpanded: false,
      classData: {
        name: "Class2",
        properties: [],
        methods: [],
      },
    },
  },
]);


// Called when 2 nodes are connected
onConnect((params) => {
  console.log(toObject());
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
      isExpanded: false,
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


// Download to device & upload from device
function downloadSaveFile() {
  const flowData = toObject();

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(flowData)));
  element.setAttribute('download', 'flow.save');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function uploadSavedFlow(event) {
  const file = event.target.files[0];
  event.target.value = null;
  const reader = new FileReader();

  // Called when the file reading ended
  reader.addEventListener('load', () => {
    const flowData = JSON.parse(reader.result.toString());

    setNodes(flowData.nodes);
    setEdges(flowData.edges);
    const [x = 0, y = 0] = flowData.position;
    setTransform({x, y, zoom: flowData.zoom || 0});
  });

  reader.readAsText(file);
}


// Download file with code generation specific data
// TODO Remove this when connecting to generation api
function downloadCodeGenerationData() {
  // Get the entire flow data
  const flowData = toObject();
console.log(flowData);
  // Create data object that contains only code generation specific data (data about the classes to be generated)
  const generationData = flowData.nodes.map(node => {
    return {
      id: node.id,
      classData: node.data.classData,
    }
  })

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(generationData)));
  element.setAttribute('download', 'codeGeneration.data');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


// Used to set the height of the whole editor to it's initial height
// so that the selection menu is scrollable individually
const flowEditorContainerRef = ref(null);
onMounted(() => {
  flowEditorContainerRef.value.style.maxHeight = `${flowEditorContainerRef.value.offsetHeight}px`;
});

</script>
