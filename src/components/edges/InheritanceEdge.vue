<template>
  <BaseEdge :id="id" :style="selected ? animatedStyle : basicStyle" :path="path[0]" :marker-start="markerStart"/>

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
import {computed, toRef} from "vue";

// Define the props
const props = defineProps(["id", "sourceX", "sourceY", "targetX", "targetY",
                "sourcePosition", "targetPosition", "selected", "data", "markerStart", "style"]);

const animatedStyle = 'stroke-width: 2.5; stroke-dasharray: 5; animation: dashdraw 0.5s linear infinite';
const basicStyle = 'stroke-width: 2.5;';

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