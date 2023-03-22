<template>
  <NodeResizer/>
  <div class="w-full h-full" :class="{'border-sky-400 border-2 shadow-md shadow-sky-300': selected, 'border-black border-2': !selected}">
    <img :src="data.href" class="w-full h-full"/>

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

