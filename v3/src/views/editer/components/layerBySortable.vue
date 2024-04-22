<template>
  <div ref="draggableContainer" class="draggableContainer">
    <main v-for="item in layerList" class="border-b">
      <h3 class="draggable-item m-0 my-4 flex items-center justify-left relative whitespace-nowrap overflow-hidden text-ellipsis">
        <!-- <span class="my-handle mr-2">::</span> -->
        <Move class="h-[.75rem] w-[.75rem] my-handle mr-1" />
        <span>true{{ item.label }}</span>
      </h3>
    </main>
  </div>
  <button @click="resetList">999</button>
  <main v-for="item in proxy.$store.editerTemp.useCounterStore().editerList" :key="item.value" class="border-b">
    <h3 class="draggable-item m-0 my-4 flex items-center justify-left relative whitespace-nowrap overflow-hidden text-ellipsis">
      <!-- <span class="my-handle mr-2">::</span> -->
      <Move class="h-[.75rem] w-[.75rem] my-handle mr-1" />
      <span>{{ item.label }}</span>
    </h3>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed, getCurrentInstance } from "vue";

import { Move } from "lucide-vue-next";
import Sortable from "sortablejs";
import { storeToRefs } from "pinia";

const { proxy } = getCurrentInstance();

// console.log("proxy.$store", proxy.$store.editerTemp.useCounterStore());
// let editerList = proxy.$store.editerTemp.useCounterStore().getList();

interface Props {
  options?: Sortable.Options;
}
const draggableContainer = ref<HTMLDivElement | null>(null);

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

const sortable = ref<Sortable | null>(null);

onMounted(() => {
  initDraggable();
});

function resetInnerLevel(event: any, value) {
  let list = [...value];
  let [startIndex, endIndex] = event.oldIndex <= event.newIndex ? [event.oldIndex, event.newIndex] : [event.newIndex, event.oldIndex];
  for (let index = startIndex; index <= endIndex; index++) {
    const item = list[index];
    item.level = index;
    // console.log("item", item, item.level);
  }
  // console.log("list", list);
  return list;
}

const initDraggable = () => {
  if (!draggableContainer.value) {
    console.warn("容器不能为空");
    return;
  }
  sortable.value = Sortable.create(draggableContainer.value, {
    sort: true,
    // handle: ".my-handle",
    chosenClass: "chosen",
    dragClass: "drag",
    direction: "horizontal",
    forceFallback: true,
    animation: 300,
    disabled: false,
    onEnd(evt: any) {
      if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
        // 删除拖拽的元素
        let list: Array<any> = layerList;
        const item = list.splice(evt.oldIndex, 1)[0];
        // 把删除的元素放到新的位置
        list.splice(evt.newIndex, 0, item);
        list = resetInnerLevel(evt, list);
        console.log("list", list);

        proxy.$store.editerTemp.useCounterStore().setList(list);
      }
    },
    onRemove: function (evt) {
      // same properties as onEnd
      console.log("onRemove", evt);
    },
    ...props.options,
  });
};

onUnmounted(() => {
  sortable.value?.destroy();
});
</script>

<style lang="scss" scoped>
.draggableContainer {
  .draggable-item {
    // border: 0 none;
    // transition: box-shadow 0.2s;
  }
  //.draggable-item:hover {
  //  background: #e9ecef;
  //}
  .my-handle {
    cursor: move;
    cursor: -webkit-grabbing;
  }
  .drag {
    // 正在拖拽中幽灵图的样式
    display: none;
    cursor: move;
    cursor: -webkit-grabbing;
  }
  .chosen {
    cursor: move;
    cursor: -webkit-grabbing;
  }
}
</style>
