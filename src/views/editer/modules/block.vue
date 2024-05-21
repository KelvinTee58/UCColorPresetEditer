<template>
  <div class="w-full h-full select-none moduleView" :style="{ background: blcok_bg, border: blcok_border }"></div>
  <!-- {{ blcok_border }} -->
  <!-- {{ module }} -->
</template>
<script setup lang="ts">
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
const draggerPath = computed({
  get: () => {
    return props.dragger ? "module" : "module.content";
  },
  set: () => {},
});

const blcok_border = computed({
  get: () => {
    let border = "none";
    let hasBorder = get(props, `${draggerPath.value}.border.width`, false);
    if (hasBorder) {
      let _bWidth = get(props, `${draggerPath.value}.border.width`, 0) + "px";
      let _bColor = get(props, `${draggerPath.value}.border.color`, "#000000");
      let _bStyle = get(props, `${draggerPath.value}.border.style`, "none");
      border = _bWidth + " " + _bColor + " " + _bStyle;
    }
    return border;
  },
  set: () => {},
});

const blcok_bg = computed({
  get: () => {
    // console.log("props.module", props.dragger, get(props, `${draggerPath.value}.background`, ""));
    return get(props, `${draggerPath.value}.background`, "");
  },
  set: () => {},
});
</script>

<style lang="scss" scoped></style>
