<template>
  <uucBlockModule v-bind="$props" v-if="moduleType == 'block'"></uucBlockModule>
  <uucImageModule v-bind="$props" v-if="moduleType == 'image'"></uucImageModule>
  <uucFontModule v-bind="$props" v-if="moduleType == 'font'"></uucFontModule>
</template>

<script setup>
import { uucBlockModule, uucImageModule, uucFontModule } from "../modules";
import { defineProps, computed } from "vue";
import { get } from "lodash";

const props = defineProps({
  module: {
    type: Object,
    required: true,
  },
  dragger: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const moduleType = computed({
  get: () => {
    let typeKey = props.dragger ? "module.type" : "module.content.type";
    return get(props, typeKey, "block");
  },
  set: () => {},
});
</script>

<style lang="scss" scoped></style>
