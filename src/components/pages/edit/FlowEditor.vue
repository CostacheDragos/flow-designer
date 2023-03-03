<template>
  <div ref="flowEditorContainerRef" class="flex flex-grow">
    <Sidebar/>
    <div class="flex-grow flex flex-col">
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
                   <label for="detail-edit-modal">
                     <li class="rounded hover:bg-gray-500 bg-gray-600 cursor-pointer px-3 py-1 mx-1 flex">
                       <font-awesome-icon icon="fa-solid fa-file-pen" color="white"/>
                       <p class="text-white normal-case ml-3 mr-auto">Details</p>
                     </li>
                   </label>
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
                   <li class="rounded hover:bg-gray-500 bg-gray-600 cursor-pointer px-3 py-1 mx-1 flex" @click="codeGenerationClicked">
                     <font-awesome-icon icon="fa-solid fa-code" class="my-auto" color="white" />
                     <p class="text-white normal-case ml-3 mr-auto">Code Gen.</p>
                   </li>
                 </ul>
               </div>
             </li>
             <!-- View dropdown menu -->
             <li>
               <div class="dropdown">
                 <button class="text-white rounded hover:bg-gray-500 px-2 normal-case">View</button>
                 <ul tabindex="0" class="dropdown-content rounded py-2 bg-gray-600 w-48 mt-2">
                   <li class="rounded hover:bg-gray-500 bg-gray-600 cursor-pointer px-3 py-1 mx-1 flex" @click="toggleCodeEditorVisibility">
                     <font-awesome-icon icon="fa-solid fa-file-code" class="my-auto" color="white"/>
                     <p class="text-white normal-case ml-3 mr-auto">Code editor</p>
                     <input type="checkbox" checked="checked" class="checkbox checkbox-sm ml-2 my-auto border-white bg-white" v-model="showCodeEditor"/>
                   </li>
                 </ul>
               </div>
             </li>
           </ul>
           <div class="ml-auto flex">
             <p class="text-white text-sm normal-case my-auto">Save status:</p>

             <!-- Icon for when the flow is up to date in the database -->
             <div v-show="flowStore.isSaved() && !showSaving" class="tooltip tooltip-bottom my-auto mx-2 h-fit normal-case" data-tip="Saved">
                <i class="bi bi-cloud-check-fill text-green-500 text-sm align-bottom"></i>
             </div>

            <!-- Icon for when the flow has not been uploaded -->
             <div v-show="flowStore.saveStatus === flowStore.possibleSaveStates.unsaved && !showSaving"
                  class="tooltip tooltip-bottom my-auto mx-2 h-fit normal-case" data-tip="Unsaved">
               <i class="bi bi-cloud-slash-fill text-rose-600 text-sm align-bottom"></i>
             </div>

             <!-- Icon for when the flow has unsaved changes -->
             <div v-show="flowStore.saveStatus === flowStore.possibleSaveStates.unsavedChanges && !showSaving"
                  class="tooltip tooltip-bottom my-auto mx-2 h-fit normal-case" data-tip="Unsaved changes">
               <i class="bi bi-cloud-arrow-up-fill text-sky-500 text-sm align-bottom"></i>
             </div>

             <!-- Icon for when the flow is being saved -->
             <div v-show="showSaving" class="tooltip tooltip-bottom my-auto mx-2 h-fit normal-case" data-tip="Saving">
               <font-awesome-icon class="animate-spin text-white align-bottom" icon="fa-solid fa-spinner" size="xs" />
             </div>

           </div>
         </nav>
         <VueFlow v-model="elements" @dragover="onDragOver" @drop="onDrop" @keyup.delete="onDeleteKeyup" class="flex-grow">
           <MiniMap id="minimap" class="border border-4 border-gray-900 rounded-lg" :mask-color="minimapMaskColor"/>
           <Background/>
           <template v-slot:node-class="props">
             <class-node :label="props.label" :data="props.data" :selected="props.selected" :id="props.id" />
           </template>
           <template v-slot:edge-inheritance="props">
             <inheritance-edge v-bind="props"/>
           </template>
         </VueFlow>
      </div>
      <CodeEditorWithTabs v-if="showCodeEditor" :generated-classes="generatedClasses" @close_editor="toggleCodeEditorVisibility"/>
    </div>
    <SelectionMenu/>
  </div>


  <!-- Modal will be on screen while the flow loads -->
  <input type="checkbox" id="loading-modal" class="modal-toggle" />
  <div class="modal" :class="!finishedLoading ? 'modal-open' : ''">
    <div class="modal-box relative w-48 bg-gray-500 text-white">
      <h3 class="text-lg font-bold normal-case">Loading...</h3>
      <font-awesome-icon class="animate-spin mt-3" icon="fa-solid fa-spinner" size="2x" />
    </div>
  </div>

  <!-- Modal will be on screen while the code is being generated -->
  <input type="checkbox" id="generating-modal" class="modal-toggle" />
  <div class="modal" :class="displayGeneratingModal ? 'modal-open' : ''">
    <div class="modal-box relative w-48 bg-gray-500 text-white">
      <h3 class="text-lg font-bold normal-case">Generating...</h3>
      <font-awesome-icon class="animate-spin mt-3" icon="fa-solid fa-spinner" size="2x" />
    </div>
  </div>

  <!--  This Modal will be displayed when the user tries to add an edge that will create an inheritance cycle -->
  <input type="checkbox" id="cycle-warning-modal" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box normal-case bg-gray-500 text-white">
      <h3 class="font-bold text-lg bg-rose-600 mx-auto rounded-lg w-fit p-3">Warning!</h3>
      <p class="py-4">The edge you are trying to add will create an inheritance cycle in you class hierarchy.</p>
      <div class="modal-action">
        <label for="cycle-warning-modal" class="btn">Close</label>
      </div>
    </div>
  </div>

  <!-- Modal will be displayed when the user wishes to edit the flow's details -->
  <input type="checkbox" id="detail-edit-modal" class="modal-toggle" />
  <div class="modal normal-case text-white">
    <div class="modal-box bg-gray-600">
      <h3 class="font-bold text-lg">Edit flow details</h3>
      <div class="h-full py-5">
        <label class="block text-left mb-1" for="flow-title-input">
          Title
        </label>
        <input type="text" id="flow-title-input" v-model="flowTitleInputModel"
               class="block bg-gray-500 rounded ml-1 px-2 w-full border border-gray-500 focus:text-gray-700 focus:bg-white"
               :class="displayTitleInputError ? 'outline outline-2 outline-rose-600 focus:border-rose-600' :
                                                'focus:border-blue-600 focus:outline-none'">

        <label class="block text-left mt-5 mb-1" for="flow-description-input">
          Description
        </label>
        <textarea id="flow-description-input" v-model="flowDescriptionInputModel"
                  class="block resize-none bg-gray-500 rounded ml-1 px-2 w-full h-32 border border-gray-500
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"/>
      </div>
      <div class="modal-action flex">
        <label for="detail-edit-modal" class="btn bg-green-500 flex-grow" @click="submitNewFlowDetails">Save</label>
        <label for="detail-edit-modal" class="btn bg-rose-500 flex-grow" @click="cancelFlowDetailsEdit">Cancel</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import {v4 as uuidv4} from "uuid";
import {nextTick, ref, watch, onMounted, onUnmounted, reactive} from "vue";

import {VueFlow, useVueFlow, MarkerType, Position} from "@vue-flow/core";
import {Background} from "@vue-flow/background";
import {MiniMap} from "@vue-flow/minimap";

import Sidebar from "@/components/pages/edit/Sidebar.vue";
import SelectionMenu from "@/components/pages/edit/SelectionMenu.vue"
import ClassNode from "@/components/nodes/ClassNode.vue";
import InheritanceEdge from "@/components/edges/InheritanceEdge.vue";
import CodeEditorWithTabs from "@/components/pages/edit/CodeEditorWithTabs.vue";

import {doc, getDoc, setDoc} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "@/includes/firebase.js";

import html2canvas from "html2canvas";

import { useFlowStore } from "@/stores/flow.js";
import {onBeforeRouteLeave} from "vue-router";

const { addNodes, addEdges, removeNodes, findNode, findEdge, getSelectedNodes, vueFlowRef, project, onConnect, toObject,
        setNodes, setEdges, setTransform, onNodesChange, onEdgesChange, onPaneReady } = useVueFlow();


// Initial elements (for testing only)
const elements = ref([]);

// Vue Flow Events
// Called when 2 nodes are connected
onConnect((params) => {

  // Check if adding this edge will create an inheritance cycle
  if(checkInheritanceCycle(params.source, params.target)) {
    console.log("Adding this edge will create a cycle!");

    // Display warning to user
    const modalToggle = document.getElementById("cycle-warning-modal");
    modalToggle.checked = true;

    return;
  }

  addEdges([
    {
      ...params,
      type: "inheritance",
      markerEnd: MarkerType.Arrow,
    },
  ]);

  // After adding the edge to the flow, add the corresponding data
  // to the target node (mark that the class inherits another class)
  const targetNode = findNode(params.target);
  targetNode.data.parentClassNodesIds.push(params.source);
});

// Called when there was a change regarding nodes
onNodesChange(() => {
  // If this event is triggered without the finishedLoading variable
  // being set to false, it means that the flow is not new and this is the first call
  // of this event, we need to set the finishedLoading to true
  if(!finishedLoading.value)
    finishedLoading.value = true;
  // If the isSaved value indicates that the flow is saved, change the value to false as this method
  // is called when the flow changes
  else
    flowStore.changesOccurred();
});

// Called when edges are added, removed or selected
onEdgesChange((edgeEvents) => {

  // If the event type is remove, then we need to
  // update the data on the nodes that the edge was linking
  // for example class inheritance
  edgeEvents.forEach(edgeEvent => {
    if(edgeEvent.type === "remove") {
      const edge = findEdge(edgeEvent.id);

      if(edge.type === "inheritance") {
        const targetNode = findNode(edge.target);
        // Check that the target node was not deleted (node deletion also triggers
        // the deletion of all edges linked to it)
        if(targetNode) {
          const deletedParentIdx = targetNode.data.parentClassNodesIds.indexOf(edge.source);
          targetNode.data.parentClassNodesIds.splice(deletedParentIdx, 1);
        }
      }
    }
  })

  if(finishedLoading.value)
    flowStore.changesOccurred();
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
      parentClassNodesIds: [],
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
const flowStore = useFlowStore();
const finishedLoading = ref(false);

onPaneReady(async (vueFlowInstance) => {
  // Check if the opened flow is new or not
  if(flowStore.isSaved()) {
    // If it's not new, load the data from the database
    const flowContent = (await getDoc(doc(db, "flowsContent", flowStore.currentFlowMetadata.flowId))).data();

    // If the nodes list is empty, mark the flow as finished loading
    if(flowContent.nodes.length === 0) {
      finishedLoading.value = true;
      return;
    }

    // If the list is not empty, the loading will finish when the fist onNodesChange
    // is called
    setNodes(flowContent.nodes);
    setEdges(flowContent.edges);
    vueFlowInstance.fitView();
  } else {
    // If the flow is new, populate the metadata
    flowStore.setCurrentFlowMetadata({
      flowId: uuidv4(),
      userId: auth.currentUser.uid,
      imageURL: "",
      title: "",
      description: "",
    });

    finishedLoading.value = true;
  }

  flowTitleInputModel.value = flowStore.currentFlowMetadata.title;
  flowDescriptionInputModel.value = flowStore.currentFlowMetadata.description;
});

const showSaving = ref(false);
const minimapMaskColor = ref("rgb(240, 242, 243, 0.7)");
function saveFlow() {
  // Unfocus the dropdown in order to close it
  loseFocus();

  // Check that the flow has a title assigned, if not, ask the user to provide one
  if(flowStore.currentFlowMetadata.title === "") {
    // Display the details editing panel
    document.getElementById("detail-edit-modal").checked = true;
    return;
  }

  // Display loading icon
  showSaving.value = true;

  try {

    // Make the minimap mask invisible for a better view of the flow in the saved picture
    const tmp = minimapMaskColor.value;
    minimapMaskColor.value = "rgb(255, 255, 255, 0)";

    nextTick(async () => {
      // After the minimap has been redrawn, create a picture out of the minimap and assign the mask its initial color
      minimapMaskColor.value = tmp;

      // Create a reference to the storage location
      const fileRef = storageRef(storage, `${flowStore.currentFlowMetadata.flowId}.png`);
      const imageData = await createFlowImage();
      await uploadBytes(fileRef, imageData, {customMetadata: {userId: flowStore.currentFlowMetadata.userId}});
      flowStore.currentFlowMetadata.imageURL = await getDownloadURL(fileRef);

      // Add the contents of the flow to the database
      const flowData = toObject();
      // !!! Don't change the order, metadata has to be uploaded first !!!
      await setDoc(doc(db, "flowsMetadata", flowStore.currentFlowMetadata.flowId), flowStore.currentFlowMetadata);
      await setDoc(doc(db, "flowsContent", flowStore.currentFlowMetadata.flowId), flowData);

      flowStore.setSaveStatus(flowStore.possibleSaveStates.saved);
      showSaving.value = false;
    });

  } catch (e) {
    console.error("Error adding flow document: ", e);
  }
}


// Tracks the flow details from the modal
const flowTitleInputModel = ref("");
const flowDescriptionInputModel = ref("");
const displayTitleInputError = ref(false);
// If the user submits the new details update the store values
function submitNewFlowDetails(event) {

  // Remove white spaces from the ends of the input values
  flowTitleInputModel.value = flowTitleInputModel.value.trim();
  flowDescriptionInputModel.value = flowDescriptionInputModel.value.trim();

  // Check that the title is valid before saving to the database
  if(flowTitleInputModel.value === "") {
    // If the title is invalid, do not save and warn the user
    event.preventDefault();
    displayTitleInputError.value = true;
    return;
  }

  // Update the store data
  flowStore.setTitle(flowTitleInputModel.value);
  flowStore.setDescription(flowDescriptionInputModel.value);

  displayTitleInputError.value = false;
  saveFlow();
}
// If the user cancels, update the local values with the ones from the store
function cancelFlowDetailsEdit() {
  flowTitleInputModel.value = flowStore.currentFlowMetadata.title;
  flowDescriptionInputModel.value = flowStore.currentFlowMetadata.description;

  displayTitleInputError.value = false;
}

// Download to device & upload from device
function downloadSaveFile() {
  // Unfocus the dropdown in order to close it
  loseFocus();

  const flowData = toObject();

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(flowData)));
  element.setAttribute('download', 'flow.save');
  element.click();
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


// Tools dropdown functionalities

// Makes API call, providing flow data, the server will
// return the generated code
const generatedClasses = reactive([]);
const displayGeneratingModal = ref(false);
function codeGenerationClicked() {
  // Display loading modal
  displayGeneratingModal.value = true;

  // Close dropdown
  loseFocus();

  // Make request to API
  requestCodeGeneration().then(() => {
    // Close loading modal when request is finished
    displayGeneratingModal.value = false;
  });
}
async function requestCodeGeneration() {
  try {
    // Get the entire flow data
    const flowData = toObject();

    // Create data object that contains only code generation specific data (data about the classes to be generated)
    const generationData = flowData.nodes.map(node => {
      return {
        id: node.id,
        parentClassNodesIds: node.data.parentClassNodesIds,
        classData: node.data.classData,
      }
    });

    const responseText = await (await fetch("https://localhost:7024/api/CodeGenerator", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(generationData),
    })).text();


    // Create a list from the generated code
    // The API will return a dictionary in which
    // the key is the id of the class/node and the value is the generated code
    const formatedResponse = JSON.parse(responseText);
    generatedClasses.splice(0, generatedClasses.length);

    for(const classId in formatedResponse) {
      generatedClasses.push({
            id: classId,
            className: findNode(classId).data.classData.name,
            code: formatedResponse[classId],
            isTabOpen: false,
          }
      );
    }
    generatedClasses[0].isTabOpen = true;

    // If closed, open the code editor
    if(showCodeEditor.value === false)
      showCodeEditor.value = true;
  } catch (e) {
    console.log("Error while trying to reach API: ", e);
  }

}


// View dropdown functionalities
const showCodeEditor = ref(false);
function toggleCodeEditorVisibility() {
  showCodeEditor.value = !showCodeEditor.value;
}


// Used to set the max height of the whole editor based on window height
// and main nav height
const flowEditorContainerRef = ref(null);
const handleResize = () => {
  // The height of the editor should take up all the remaining height of the window
  const mainNavHeight = document.getElementById("main-nav").offsetHeight;
  flowEditorContainerRef.value.style.maxHeight = `${window.innerHeight - mainNavHeight}px`;
};
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);

  // For exit confirmation when there are unsaved changes
  window.addEventListener("beforeunload", beforeWindowUnload);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("beforeunload", beforeWindowUnload);
});


// Before leaving the page, check if the flow is saved
// and ask the user for confirmation if it is not
function confirmPageExit() {
  if(flowStore.isSaved())
    return true;

  return window.confirm('Do you really want to leave? you have unsaved changes!')
};

onBeforeRouteLeave((to, from, next) => {
  if (confirmPageExit())
    next();
  else
    next(false);
});

function beforeWindowUnload(event) {
  if(!confirmPageExit()) {
    event.preventDefault();
    event.returnValue = '';
  }
}

// Auxiliary
// Focuses on a temporary element, useful to unfocus any currently focused element
function loseFocus() {
  const tmp = document.createElement("input");
  document.body.appendChild(tmp);
  tmp.focus();
  document.body.removeChild(tmp);
}

// Convert dataURL to Blob
function dataURItoBlob(dataURL) {
  const binary = window.atob(dataURL.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: "image/png"});
}

// Create flow minimap image
async function createFlowImage() {
  // Get the canvas element
  const result = await html2canvas(document.querySelector("#minimap"));

  // Convert the canvas to an image file
  const dataURL = result.toDataURL();

  return dataURItoBlob(dataURL);
}

// Performs a BFS search in order to determine if the edge that the user intends to add
// will create an inheritance cycle
// The BFS will begin from the edge source node and go up its ancestors tree
// Returns true if a cycle was discovered and false otherwise
function checkInheritanceCycle(sourceNodeId, targetNodeId) {
  const nodeIdsQueue = [sourceNodeId];

  while (nodeIdsQueue.length) {
    // Get the first node id and pop it
    const currentNode = findNode(nodeIdsQueue.shift());

    // Check if the current node's parents contain the searched node id
    // if yes, there is a cycle
    if(currentNode.data.parentClassNodesIds.includes(targetNodeId))
      return true;

    // Add the current node's parents to the queue
    nodeIdsQueue.push(...currentNode.data.parentClassNodesIds);
  }

  return false;
}
</script>