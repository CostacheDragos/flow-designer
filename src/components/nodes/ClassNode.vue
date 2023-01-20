<template>
  <div :class="{'border-sky-400 border-2': selected, 'border-black border-2': !selected}" class="vue-flow__node-default">
    <h2>
      {{ label }}
    </h2>
    <Handle :position="Position.Top" type="target"/>
    <Handle :position="Position.Bottom" type="source"/>
  </div>
</template>

<script setup>
import {Handle, Position} from "@vue-flow/core";


const props = defineProps(["label", "id", "data", "selected"]);
</script>
