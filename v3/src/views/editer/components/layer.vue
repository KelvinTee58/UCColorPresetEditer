<template>
  <div ref="draggableContainer" class="draggableContainer">
    <main v-for="item in list" :key="item.value" class="border-b">
      <h3 class="draggable-item m-0 my-4  flex items-center justify-left relative whitespace-nowrap overflow-hidden text-ellipsis">
        <!-- <span class="my-handle mr-2">::</span> -->
        <Move class="h-[.75rem] w-[.75rem] my-handle mr-1" />
        <span>{{ item.label }}</span>
      </h3>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { Move } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";
import Sortable from "sortablejs";

interface Item {
  label: string;
  value: string; // 可能是会需要value值
  value: string; // 可能是会需要value值
}
interface Props {
  list: Array<Item>;
  options?: Sortable.Options;
}
const draggableContainer = ref<HTMLDivElement | null>(null);

const props = defineProps<Props>();

interface EmitsType {
  (e: "update:list", value: any[]): void;
  (e: "onChangeList", value: any[]): void;
}

const emit = defineEmits<EmitsType>();

const sortable = ref<Sortable | null>(null);

onMounted(() => {
  initDraggable();
});

const initDraggable = () => {
  if (!draggableContainer.value) {
    console.warn("容器不能为空");
    return;
  }
  sortable.value = Sortable.create(draggableContainer.value, {
    handle: ".my-handle",
    chosenClass: "chosen",
    dragClass: "drag",
    direction: "horizontal",
    forceFallback: true,
    animation: 300,
    onUpdate(e: any) {
      if (e.oldIndex !== undefined && e.newIndex !== undefined) {
        // 删除拖拽的元素
        const list = [...props.list];
        const item = list.splice(e.oldIndex, 1)[0];
        // 把删除的元素放到新的位置
        list.splice(e.newIndex, 0, item);
        emit("update:list", list);
        emit("onChangeList", list);
        console.log("list", list);
      }
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
