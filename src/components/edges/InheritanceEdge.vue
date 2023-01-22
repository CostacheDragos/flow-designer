<template>
  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" :animated="selected"/>

  <EdgeLabelRenderer>
    <div :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }">
      <font-awesome-icon icon="fa-solid fa-circle-xmark" class="cursor-pointer" v-show="selected" @click="removeEdges([id])"/>
    </div>
  </EdgeLabelRenderer>
</template>

<script setup>
import { BaseEdge, EdgeLabelRenderer, useVueFlow, getSmoothStepPath } from "@vue-flow/core";
import { computed } from "vue";

// Define the props
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  selected: {
    type: Boolean,
    required: false,
  },
  data: {
    type: Object,
    required: false,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
});

// Import the remove edges function
const { removeEdges } = useVueFlow();

// Get the path for the edge
const path = computed(() => getSmoothStepPath({...props, borderRadius: 0}));
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>