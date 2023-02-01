<template>
  <div class="flex flex-col h-screen overflow-clip">
    <nav class="flex flex-col text-center py-4 px-6 bg-gray-900 shadow items-baseline w-full">
      <div class="my-auto">
        <a href="#" class="text-2xl no-underline text-white hover:text-sky-400 normal-case">Home</a>
      </div>
    </nav>
    <FlowEditor ref="flowEditor" class="flex flex-grow max-h-initial"/>
  </div>
</template>


<script>
import FlowEditor from "@/components/FlowEditor.vue";
import {ref} from "vue";

export default {
  components: {
    FlowEditor,
  },
  mounted() {
    this.$refs.flowEditor.$el.style.maxHeight = `${this.$refs.flowEditor.$el.offsetHeight}px`;
  },
  setup() {
    const flowEditor = ref(null);

    return {
      flowEditor
    };
  }
};

</script>