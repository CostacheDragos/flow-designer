<template>
  <BaseEdge :id="id" :style="selected ? animatedStyle : basicStyle" :path="path[0]" :marker-end="markerEnd"/>
</template>

<script setup>
import {BaseEdge, EdgeLabelRenderer, useVueFlow, getSmoothStepPath, getBezierPath} from "@vue-flow/core";
import {computed, toRef} from "vue";

// Define the props
const props = defineProps(["id", "sourceX", "sourceY", "targetX", "targetY",
  "sourcePosition", "targetPosition", "selected", "data", "markerEnd", "style"]);

const animatedStyle = 'stroke-width: 1.5; stroke-dasharray: 5; animation: dashdraw 0.5s linear infinite';
const basicStyle = 'stroke-width: 1.5; stroke: black';

// Get the path for the edge
const path = computed(() => getBezierPath({...props}));
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>