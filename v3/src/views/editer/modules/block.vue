<template>
  <div class="w-full h-full select-none" :style="{ background: blcok_bg }">{{ props.module }}</div>
  <!-- {{ module }} -->
</template>
<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  module: {
    type: Object,
    required: true,
  },
});
const blcok_bg = computed({
  get: () => {
    return props.module.background ? props.module.background : "";
  },
  set: () => {},
});
</script>

<style lang="scss" scoped></style>
