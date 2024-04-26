<template>
  <div class="draggableContainer layerContainer">
    <!-- <button @click="resetList">清空列表</button> -->
    <VirtualList ref="virtualRef" class="layerHeight" :dataSource="layerList" :dataKey="'id'" :handle="'.drag'" :animation="100" chosenClass="chooseItem" ghostClass="chooseItem">
      <template v-slot:item="{ record, index, dataKey }">
        <h3 @click="pickerModule(record.id)" class="draggable-item m-0 py-4 flex items-center justify-left relative whitespace-nowrap overflow-hidden text-ellipsis border-b itemColor select-none">
          <Move class="h-[.75rem] w-[.75rem] my-handle mr-1 drag" />
          <span class="drag" :class="{ itemActive: record.id == activeModuleId }">{{ record.label }}</span>
        </h3>
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, getCurrentInstance, computed } from "vue";

const virtualRef = ref(null);

import { Move } from "lucide-vue-next";
import VirtualList from "vue-virtual-draglist";

import { storeToRefs } from "pinia";

const { proxy } = getCurrentInstance();

// console.log("proxy.$store", proxy.$store.editerList.useCounterStore());
// let editerList = proxy.$store.editerList.useCounterStore().getList();

interface Props {
  options?: Sortable.Options;
}

const props = defineProps<Props>();

const editerListStore = storeToRefs(proxy.$store.editerList.useCounterStore());
// let layerList = editerListStore.editerList.value;
// let { editerList } = storeToRefs(proxy.$store.editerList.useCounterStore());

const editerViewStore = storeToRefs(proxy.$store.editerView.useCounterStore());

function resetList() {
  proxy.$store.editerList.useCounterStore().resetList();
}

const layerList = computed({
  get() {
    console.log("layerList get");
    return editerListStore.editerList.value;
  },
  set(val) {
    // trigger when drag state changed if you use with `v-model:dataSource`
    let _list = resetLevel(val);
    console.log("set layerList", _list);
    proxy.$store.editerList.useCounterStore().setList(_list);
  },
});

const activeModuleId = computed({
  get() {
    console.log("virtualRef", virtualRef.value);
    if (virtualRef.value) virtualRef.value.scrollToKey(editerViewStore.activeModuleId.value);
    return editerViewStore.activeModuleId.value;
  },
});

//重排数据列表的level
function resetLevel(list = [], startIndex = 0, endIndex = 0) {
  let _list = [...list];
  let _sIndex = startIndex || 0;
  let _eIndex = endIndex || _list.length;

  console.log("resetLevel", _list, _sIndex, _eIndex);
  for (let index = _sIndex; index < _eIndex; index++) {
    // const item = _list[index];
    _list[index].level = index;
    console.log("level", _list[index].level);
  }
  return _list;
}

// 选中激活的module
function pickerModule(id: string) {
  proxy.$store.editerView.useCounterStore().setActiveModuleId(id);
  console.log("virtualRef", virtualRef.value);
  virtualRef.value.scrollToKey(id);
}
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
  .layerHeight {
    height: calc(100vh - 7rem - 15px);
    scrollbar-width: none; /* 对于 Firefox 隐藏滚动条 */
  }
  .layerHeight ::-webkit-scrollbar {
    display: none; /* 对于 Chrome, Safari 和 Opera 隐藏滚动条 */
  }

  // /* 针对于整个页面的滚动条 */
  // .layerHeight::-webkit-scrollbar {
  //   width: 3px; /* 对于水平滚动条的宽度 */
  //   height: 10px; /* 对于垂直滚动条的高度 */
  // }

  // /* 滚动条的滑块 */
  // .layerHeight::-webkit-scrollbar-thumb {
  //   background: hsl(var(--muted-foreground));
  // }

  // /* 滚动条的滑块hover效果 */
  // .layerHeight::-webkit-scrollbar-thumb:hover {
  //   background: hsl(var(--foreground)) !important;
  // }
}
</style>
<style lang="scss">
.layerContainer {
  .chooseItem {
    // color: hsl(var(--accent-foreground));
    // // background-color: hsl(var(--accent));
    color: hsl(var(--foreground)) !important;
    box-shadow: 0 0 5px hsl(var(--accent-foreground));
  }
  .itemColor {
    color: hsl(var(--muted-foreground));
  }
  .itemColor:active {
    color: hsl(var(--foreground)) !important;
    font-weight: bold;
  }
  .itemActive {
    color: hsl(var(--foreground)) !important;
    font-weight: bold;
  }
}
</style>
