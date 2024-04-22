<template>
  <div class="draggableContainer">
    <button @click="resetList">999</button>
    <VirtualList v-model:dataSource="layerList" :dataKey="'id'" :handle="'#drag'" :animation="300" chosen-class="chooseItem" style="height: 100%" itemTag="h3" itemClass="draggable-item m-0 py-4 flex items-center justify-left relative whitespace-nowrap overflow-hidden text-ellipsis border-b chosen">
      <template v-slot:item="{ record, index, dataKey }">
        <!-- <h3 class="draggable-item m-0 my-4 flex items-center justify-left relative whitespace-nowrap overflow-hidden text-ellipsis"> -->
        <Move class="h-[.75rem] w-[.75rem] my-handle mr-1 drag" id="drag" />
        <span>{{ record.label }}</span>
        <!-- </h3> -->
      </template>
    </VirtualList>
    <!-- <main v-for="item in proxy.$store.editerTemp.useCounterStore().editerList" :key="item.value" class="border-b">
    <h3 class="draggable-item m-0 my-4 flex items-center justify-left relative whitespace-nowrap overflow-hidden text-ellipsis">
      <Move class="h-[.75rem] w-[.75rem] my-handle mr-1" />
      <span>{{ item.label }}</span>
    </h3>
  </main> -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, getCurrentInstance, computed } from "vue";

import { Move } from "lucide-vue-next";
import VirtualList from "vue-virtual-draglist";

import { storeToRefs } from "pinia";

const { proxy } = getCurrentInstance();

// console.log("proxy.$store", proxy.$store.editerTemp.useCounterStore());
// let editerList = proxy.$store.editerTemp.useCounterStore().getList();

interface Props {
  options?: Sortable.Options;
}

const props = defineProps<Props>();

const editerTempStore = storeToRefs(proxy.$store.editerTemp.useCounterStore());
// let layerList = editerTempStore.editerList.value;
// let { editerList } = storeToRefs(proxy.$store.editerTemp.useCounterStore());
function resetList() {
  proxy.$store.editerTemp.useCounterStore().resetList();
}

const layerList = computed({
  get() {
    console.log("layerList get");
    return editerTempStore.editerList.value;
  },
  set(val) {
    // trigger when drag state changed if you use with `v-model:dataSource`
    console.log("set layerList", val);
    proxy.$store.editerTemp.useCounterStore().setList(val);
  },
});
</script>

<style lang="scss" scoped>
.draggableContainer {
  .my-handle {
    cursor: move;
    cursor: -webkit-grabbing;
  }
  .drag {
    // 正在拖拽中幽灵图的样式
    // display: none;
    cursor: move;
    cursor: -webkit-grabbing;
  }
  .chooseItem {
    // color: hsl(var(--accent-foreground));
    // // background-color: hsl(var(--accent));
    // background-color: hsl(var(--accent));
    box-shadow: 0px 0px 10px 0px #1984ff !important;
  }
}
</style>
