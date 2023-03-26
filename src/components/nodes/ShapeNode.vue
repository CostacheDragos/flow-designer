<template>
  <NodeResizer/>
  <div class="h-full w-full">
    <img :src="data.shapeSrc" class="w-full h-full"/>

<!--    <Handle :position="Position.Top"></Handle>-->
<!--    <Handle :position="Position.Bottom"></Handle>-->
<!--    <Handle :position="Position.Left"></Handle>-->
<!--    <Handle :position="Position.Right"></Handle>-->
  </div>
</template>

<script setup>
import {NodeResizer} from "@vue-flow/node-resizer";
import {Handle, Position} from "@vue-flow/core";

const props = defineProps(["label", "selected", "data"]);
</script>

