<template>
  <div class="draggableContainer layerContainer">
    <!-- <button @click="resetList">清空列表</button> -->
    <VirtualList ref="virtualRef" @drop="dropEnd" class="layerHeight" :dataSource="layerList" :dataKey="'level'" :handle="'.drag'" :animation="100" chosenClass="chooseItem" ghostClass="chooseItem">
      <template v-slot:item="{ record }">
        <ContextMenu @update:open="pickerModule(record)">
          <ContextMenuTrigger>
            <h3 @click="pickerModule(record)" class="draggable-item m-0 py-4 flex items-center justify-left relative whitespace-nowrap overflow-hidden text-ellipsis border-b itemColor select-none">
              <Move class="h-[.75rem] w-[.75rem] my-handle mr-1 drag" />
              <span class="drag" :class="{ itemActive: record.id == activeModuleId }">{{ record.label }}</span>
            </h3>
          </ContextMenuTrigger>
          <ContextMenuContent class="w-48">
            <ContextMenuItem @click="deleteItem(record)">
              <span>delete</span>
              <ContextMenuShortcut>{{ ctrlKey }}←</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <span>copy</span>
              <ContextMenuShortcut>{{ ctrlKey }}C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <span>paste</span>
              <ContextMenuShortcut>{{ ctrlKey }}V</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, computed, onMounted } from "vue";

const virtualRef = ref(null);

import { Move } from "lucide-vue-next";
import VirtualList from "vue-virtual-draglist";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";

import { storeToRefs } from "pinia";
import { get } from "lodash";
const { proxy } = getCurrentInstance() as any;

const ctrlKey = ref("⌘");

onMounted(() => {
  const userAgent: any = navigator.userAgent || navigator.vendor;

  if (/mac/i.test(userAgent)) {
    ctrlKey.value = "⌘ ";
  } else if (/win/i.test(userAgent)) {
    ctrlKey.value = "Ctrl+";
  }
});

const editerListStoreRefs = storeToRefs(proxy.$store.editerList.useCounterStore());
const editerListStore = proxy.$store.editerList.useCounterStore();
const editerViewStore = proxy.$store.editerView.useCounterStore();

// function resetList() {
//   proxy.$store.editerList.useCounterStore().resetList();
// }

const layerList = computed({
  get() {
    return editerListStoreRefs.editerList.value;
  },
  set(val) {
    console.log("layerList", layerList);
    // trigger when drag state changed if you use with `v-model:dataSource`
    let _list = resetLevel(val);
    proxy.$store.editerList.useCounterStore().setList(_list);
  },
});

const activeModuleId = computed({
  get() {
    const id = editerViewStore.getActiveModuleProps("id");
    if (virtualRef.value) {
      virtualRef.value.scrollToKey(id);
    }
    return id;
  },
  set() {},
});

//重排数据列表的level
function resetLevel(list = [], startIndex = 0, endIndex = 0) {
  let _list = [...list];
  let _sIndex = startIndex || 0;
  let _eIndex = endIndex || _list.length;

  for (let index = _sIndex; index < _eIndex; index++) {
    // const item = _list[index];
    _list[index].level = index;
  }
  console.log("resetLevel", _list);
  return _list;
}

// 选中激活的module
function pickerModule(value: any) {
  proxy.$store.editerView.useCounterStore().setActiveModule(value);
  // console.log("virtualRef", virtualRef.value);
  if (virtualRef.value) {
    virtualRef.value.scrollToKey(value.id);
  }
}

// 重新排列后的逻辑
function dropEnd(event: any) {
  console.log(event);
}

/**
 * 删除选中的项逻辑
 * @param value
 */
function deleteItem(value: any) {
  let id = get(value, "id", undefined);
  editerListStore.removeModuleItem(id, { type: "delete", description: "移除" });
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
