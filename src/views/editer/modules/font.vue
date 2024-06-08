<template>
  <div class="w-full h-full">
    <div class="w-full h-full select-none moduleView" :style="{ ...blcok_bg, border: blcok_border, 'border-radius': blcok_round }">{{ font_Label }}</div>
  </div>
  <!-- {{ module }} -->
</template>
<script setup lang="ts">
import { computed } from "vue";
import { get } from "lodash";
import { MyObject } from "@/data/structure/uuc_interface";

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
const font_Label = computed({
  get: () => {
    if (props.dragger) {
      return get(props, `${draggerPath.value}.label`, "Aa");
    } else {
      return "Aa";
    }
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

const blcok_round = computed({
  get: () => {
    if (props.dragger) {
      return get(props, `${draggerPath.value}.round`, 0) + "px";
    } else {
      return "0px";
    }
  },
  set: () => {},
});

const blcok_bg = computed({
  get: () => {
    let bg: MyObject = {};
    let cfill = get(props, `${draggerPath.value}.fill`, "");
    if (cfill.mode == "none") {
      bg["background"] = "";
    } else if (cfill.mode == "gradient") {
      bg["background-image"] = get(props, `${draggerPath.value}.fill.color`, "");
    } else {
      bg["background"] = get(props, `${draggerPath.value}.fill.color`, "");
    }
    // console.log("props.module", props.dragger, get(props, `${draggerPath.value}.background`, ""));
    return bg;
  },
  set: () => {},
});
</script>

<style lang="scss" scoped></style>
