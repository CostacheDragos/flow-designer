import { defineStore } from "pinia";
import {reactive, ref} from "vue";

export const useFlowStore = defineStore("flow", () => {
    const defaultValues = {
      currentFlowMetadata: {
          flowId: "",
          userId: "",
          imageURL: "",
      },
      isSaved: false,
    };


    const currentFlowMetadata = reactive({});
    const isSaved = ref(defaultValues.isSaved);

    function setCurrentFlowMetadata(newData) {
        Object.assign(currentFlowMetadata, newData);
    }

    function setIsSaved(value) {
        isSaved.value = value;
    }

    function resetState() {
        Object.assign(currentFlowMetadata, defaultValues.currentFlowMetadata);
        isSaved.value = defaultValues.isSaved;
    }

    return {currentFlowMetadata, isSaved, setCurrentFlowMetadata, setIsSaved, resetState};
})