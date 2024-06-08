<template>
  <div class="w-8 h-8 m-auto cursor-move" role="Box" :ref="drag" :style="{ opacity }" :data-testid="`box-${props.module.id}`">
    <moduleView v-bind="$props"></moduleView>
  </div>
</template>
<script lang="ts" setup>
import moduleView from "./moduleView.vue";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentInstance } from "vue";
import { Button } from "@/components/ui/button";
const { proxy } = getCurrentInstance();

const props = defineProps({
  module: {
    type: Object,
    required: true,
  },
});
function AddDraggable() {
  proxy.$store.editerList.editerListStore().addModuleItem(props.module);
}
// interface DropResult {
//   name: string;
// }

import { useDrag } from "vue3-dnd";
import { computed, unref } from "vue";
import { toRefs } from "@vueuse/core";

const [collect, drag] = useDrag(() => ({
  type: "box",
  item: props.module,
  // end: (item, monitor) => {
  //   // const dropResult = monitor.getDropResult<DropResult>();
  //   // if (item && dropResult) {
  //   //   alert(`You dropped ${item.name} into ${dropResult.name}!`);
  //   // }
  //   console.log("item", item);
  // },
  options: {
    dropEffect: "copy",
  },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
    handlerId: monitor.getHandlerId(),
  }),
}));

const { isDragging } = toRefs(collect);

const opacity = computed(() => (unref(isDragging) ? 0.4 : 1));
</script>

<style lang="scss" scoped></style>
