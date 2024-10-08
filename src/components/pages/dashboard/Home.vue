<template>
  <div class="w-screen h-full overflow-y-auto">
    <div class="w-10/12 h-fit mx-auto my-3 flex flex-wrap">
      <div class="card w-96 h-96 bg-gray-300 shadow-xl m-3 normal-case select-none cursor-pointer transition hover:shadow-2xl hover:bg-gray-200 hover:scale-105"
      @click="createNewFlow">
        <div class="card-body">
          <div class="my-auto">
            <i class="bi bi-plus-circle-fill text-9xl"></i>
            <h1 class="mt-5 text-3xl">Create new</h1>
          </div>
        </div>
      </div>

      <!-- Saved flows cards -->
      <div v-for="(flow, flowIdx) in savedFlows" :key="flow.metadata.flowId" v-show="finishedLoading" class="relative w-96 h-96 m-3">
        <div v-if="flow.deleting" class="card bg-black bg-opacity-60 w-96 h-96 absolute z-10">
          <div class="mx-auto my-auto text-white">
            <h3 class="text-3xl font-bold normal-case mb-4">Deleting</h3>
            <font-awesome-icon class="animate-spin m-3" icon="fa-solid fa-spinner" size="5x" />
          </div>
        </div>
        <div class="card w-96 h-96 bg-gray-300 shadow-xl normal-case select-none transition hover:shadow-2xl hover:bg-gray-200 hover:scale-105 absolute">
          <figure class="mt-2">
            <img :src="flow.metadata.imageURL" alt="Minimap" class="rounded-lg h-full" />
          </figure>
          <div class="card-body">
            <h2 class="card-title mx-auto">{{ flow.metadata.title }}</h2>
            <p class="h-20 overflow-y-auto p-2">{{ flow.metadata.description }}</p>
            <div class="card-actions mt-2">
              <button class="btn btn-primary normal-case w-28" @click="openFlow(flow)">Open</button>
              <button class="btn bg-rose-600 border-none normal-case ml-auto w-28 hover:bg-rose-700" @click="deleteFlow(flow, flowIdx)">
                <font-awesome-icon icon="fa-solid fa-trash" class="mr-2"/>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, doc, query, where, getDocs, deleteDoc} from "firebase/firestore";
import { auth, db, storage } from "@/includes/firebase.js";
import { ref as storageRef, deleteObject } from "firebase/storage";

import router from "@/router/index.js";
import { useFlowStore } from "@/stores/flow.js";

import {onMounted, reactive, ref} from "vue";



// Called after the component has been loaded, fetches all the flows of the current user
const flowStore = useFlowStore();

const savedFlows = reactive([]);
const finishedLoading = ref(false);

onMounted(async () => {
  const q = query(collection(db, "flowsMetadata"), where("userId", "==", auth.currentUser.uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    savedFlows.push({
      metadata: doc.data(),
      deleting: false,
    });
  });

  finishedLoading.value = true
});

// Called when the open button is pressed on one of the cards
async function openFlow(flow) {
  // Set the values in the store to the loaded data
  flowStore.setCurrentFlowMetadata(flow.metadata);
  flowStore.setSaveStatus(flowStore.possibleSaveStates.saved);

  // Redirect to edit
  await router.push("/edit");
}

// Called when the user wants to create a new flow, the router will guide the user to
// the edit page
function createNewFlow() {
  // Indicate in the flow state that it is not new
  flowStore.setSaveStatus(flowStore.possibleSaveStates.unsaved);

  router.push("/edit");
}

// Called when the delete button is pressed on one of the cards
async function deleteFlow(flowToBeDeleted, flowToBeDeletedIdx) {
  flowToBeDeleted.deleting = true;

  try {
    // Delete the flow data
    await deleteDoc(doc(db, "flowsContent", flowToBeDeleted.metadata.flowId));

    // Delete the image of the minimap
    const imageRef = storageRef(storage, flowToBeDeleted.metadata.imageURL);
    await deleteObject(imageRef);

    // Delete the flow metadata
    await deleteDoc(doc(db, "flowsMetadata", flowToBeDeleted.metadata.flowId));


    // After all remote deletions are completed, remove the flow from the local list
    savedFlows.splice(flowToBeDeletedIdx, 1);

    console.log("Successfully deleted the flow with id: ", flowToBeDeleted.metadata.flowId);
  } catch (e) {
    console.log("Error while deleting flow: ", e);
  }
}
</script>