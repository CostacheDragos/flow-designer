import { defineStore } from "pinia";
import {reactive, ref} from "vue";

export const useFlowStore = defineStore("flow", () => {
    const possibleSaveStates = {
        unsaved: "unsaved",
        unsavedChanges: "unsaved_changes",
        saved: "saved",
    };

    const defaultValues = {
      currentFlowMetadata: {
          flowId: "",
          userId: "",
          imageURL: "",
          title: "",
          description: "",
      },
      saveStatus: possibleSaveStates.unsaved,
    };


    const currentFlowMetadata = reactive({
        flowId: "",
        userId: "",
        imageURL: "",
        title: "",
        description: "",
    });
    const saveStatus = ref(defaultValues.saveStatus);

    function setCurrentFlowMetadata(newData) {
        Object.assign(currentFlowMetadata, newData);
    }

    // Sets the save status to provided value (value should always be from 'possibleSaveStates'
    function setSaveStatus(value) {
        saveStatus.value = value;
    }
    // Verify if the save stated is set to 'saved'
    function isSaved() {
        return saveStatus.value === possibleSaveStates.saved;
    }


    function setTitle(newTitle) {
        currentFlowMetadata.title = newTitle;
    }
    function setDescription(newDescription) {
        currentFlowMetadata.description = newDescription;
    }

    // Call whenever changes occur in the flow,
    // handles the change of the save state
    function changesOccurred() {
        // If changes occur in an unsaved flow, don't do anything
        if(saveStatus.value === possibleSaveStates.unsaved)
             return;

        // Otherwise, mark the save status as unsaved changes
        saveStatus.value = possibleSaveStates.unsavedChanges;
    }


    // Reset the state to default values
    function resetState() {
        Object.assign(currentFlowMetadata, defaultValues.currentFlowMetadata);
        saveStatus.value = defaultValues.saveStatus;
    }

    return {currentFlowMetadata, saveStatus, possibleSaveStates, setCurrentFlowMetadata, setSaveStatus, resetState, isSaved,
        setTitle, setDescription, changesOccurred};
})