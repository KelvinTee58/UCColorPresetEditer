<template>
  <uucBlockModule v-bind="$props" v-if="module.type == 'block'"></uucBlockModule>
  <uucImageModule v-bind="$props" v-if="module.type == 'image'"></uucImageModule>
  <uucFontModule v-bind="$props" v-if="module.type == 'font'"></uucFontModule>
</template>

<script setup>
import { uucBlockModule, uucImageModule, uucFontModule } from "../modules";
import { defineProps } from "vue";

const props = defineProps({
  module: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
