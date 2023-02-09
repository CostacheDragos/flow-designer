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
                 <li class="rounded hover:bg-gray-500 bg-gray-600 cursor-pointer px-3 py-1 mx-1 flex" @click="saveFlow">
                   <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" color="white"/>
                   <p class="text-white normal-case ml-3 mr-auto">Save</p>
                 </li>
                 <li class="rounded hover:bg-gray-500 bg-gray-600 cursor-pointer px-3 py-1 mx-1 flex" @click="downloadSaveFile">
                   <font-awesome-icon icon="fa-solid fa-download" color="white" />
                   <p class="text-white normal-case ml-3 mr-auto">Download</p>
                 </li>
                 <li class="rounded hover:bg-gray-500 bg-gray-600 cursor-pointer px-3 py-1 mx-1 flex" @click="$refs.fileInput.click()">
                   <input type="file" ref="fileInput" @change="uploadSavedFlow" class="hidden">
                   <font-awesome-icon icon="fa-solid fa-upload" color="white" />
                   <p class="text-white normal-case ml-3 mr-auto">Upload</p>
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
                   <font-awesome-icon icon="fa-solid fa-code" class="my-auto" color="white" />
                   <p class="text-white normal-case ml-3 mr-auto">Code Gen.</p>
                 </li>
               </ul>
             </div>
           </li>
         </ul>
         <div class="ml-auto flex">
           <p class="text-white text-sm normal-case my-auto">Save status:</p>

           <!-- Icon for when the flow is up to date in the database -->
           <div v-show="flowId" class="dropdown dropdown-hover dropdown-bottom dropdown-end my-auto mx-2 h-fit">
              <i class="bi bi-cloud-check-fill text-green-500 text-sm align-bottom"></i>
              <p class="dropdown-content bg-gray-600 text-white text-sm normal-case p-1 rounded-lg">Saved</p>
           </div>

          <!-- Icon for when the flow has not been uploaded -->
           <div v-show="!flowId && !showSaving" class="dropdown dropdown-hover dropdown-bottom dropdown-end my-auto mx-2 h-fit">
             <i class="bi bi-cloud-slash-fill text-rose-600 text-sm align-bottom"></i>
             <p class="dropdown-content bg-gray-600 text-white text-sm normal-case p-1 rounded-lg">Unsaved</p>
           </div>

           <!-- Icon for when the flow is being saved -->
           <div v-show="showSaving" class="dropdown dropdown-hover dropdown-bottom dropdown-end my-auto mx-2 h-fit">
             <i class="bi bi-arrow-repeat text-white text-sm align-bottom"></i>
             <p class="dropdown-content bg-gray-600 text-white text-sm normal-case p-1 rounded-lg">Saving..</p>
           </div>

         </div>
       </nav>
       <VueFlow v-model="elements" @dragover="onDragOver" @drop="onDrop" @keyup.delete="onDeleteKeyup" class="flex-grow">
         <MiniMap id="minimap" class="border border-4 border-gray-900"/>
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
import {MiniMap} from "@vue-flow/minimap";

import Sidebar from "@/components/pages/edit/Sidebar.vue";
import SelectionMenu from "@/components/pages/edit/SelectionMenu.vue"
import ClassNode from "@/components/nodes/ClassNode.vue";
import InheritanceEdge from "@/components/edges/InheritanceEdge.vue";

import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/includes/firebase.js";

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



// Flow Dropdown menu functionalities

// DB save
const flowId = ref(null); // Changes if the flow has an existing save in the database
const showSaving = ref(false);
async function saveFlow() {
  // Unfocus the dropdown in order to close it
  loseFocus();
  showSaving.value = true;

  try {
    const flowData = toObject();
    const docRef = await addDoc(collection(db, "flows"), {
      userId: auth.currentUser.uid,
      flowData,
    });

    flowId.value = docRef.id;
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  showSaving.value = false;
}
// Download to device & upload from device
function downloadSaveFile() {
  // Unfocus the dropdown in order to close it
  loseFocus();

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


// Auxiliary
// Focuses on a temporary element, useful to unfocus any currently focused element
function loseFocus() {
  const tmp = document.createElement("input");
  document.body.appendChild(tmp);
  tmp.focus();
  document.body.removeChild(tmp);
}
</script>