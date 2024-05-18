<template>
  <div class="editer_index">
    <div class="moduleList"></div>
    <div class="draggerRegionWrapper h-full-container flex justify-center items-center">
      <div
        class="draggerRegion"
        @contextmenu.prevent.stop="onContextMenu"
        @wheel="handleWheel"
        :style="{ transform: `scale(${scale})`, width: `${draggerRegionSize.width}px`, height: `${draggerRegionSize.height}px` }"
      >
        <vdr
          :disableUserSelect="true"
          :lock-aspect-ratio="true"
          :parent="true"
          :w="computedProps(item.width, 160)"
          :h="computedProps(item.height, 160)"
          :x="computedProps(item.axis.x, 0)"
          :y="computedProps(item.axis.y, 0)"
          :z="computedProps(item.level, 0)"
          :grid="[10, 10]"
          v-for="item in editerList"
          :key="item.id"
          class-name="vdr no-border"
          class-name-active="active-border"
          @dblclick="handleDoubleClick"
          @activated="pickerModule(item)"
          @dragstop="
              (x:number, y:number) => {
                dragEndModule(x, y, item);
              }
            "
          @resizestop="(x:number, y:number,w:number,h:number) => {
              onResizeStopModule(x, y,w,h,item);
              }"
          :active="item.id === activeModuleId"
          :snap="true"
          :snap-tolerance="20"
          @refLineParams="getRefLineParams"
          @contextmenu.prevent.stop="onContextMenu2"
        >
          <moduleView :module="item" :dragger="true"></moduleView>
        </vdr>
        <!--辅助线 start-->
        <span class="ref-line v-line" v-for="item in vdrVLine" v-show="item.display" :style="{ left: item.position, top: item.origin, height: item.lineLength }" />
        <span class="ref-line h-line" v-for="item in vdrHLine" v-show="item.display" :style="{ top: item.position, left: item.origin, width: item.lineLength }" />
        <!--辅助线END-->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, computed, onMounted, onUnmounted } from "vue";

import vdr from "vue-draggable-resizable-gorkys/src/components/vue-draggable-resizable.vue";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import moduleList from "./components/moduleList.vue";
import layer from "./components/layer.vue";
import moduleView from "./components/moduleView.vue";
import attributeView from "./components/attributeView.vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// console.log(t("views.editer.index.right_tab1"));

// const { proxy } = getCurrentInstance();
const { proxy } = getCurrentInstance() as any;
import { get } from "lodash";

const editerListStoreRefs = storeToRefs(proxy.$store.editerList.useCounterStore());
const editerListStore = proxy.$store.editerList.useCounterStore();
const editerViewStore = proxy.$store.editerView.useCounterStore();
const editerList = computed({
  get() {
    return editerListStoreRefs.editerList.value;
  },
  set(val) {
    // trigger when drag state changed if you use with `v-model:dataSource`

    proxy.$store.editerList.useCounterStore().setList(val);
  },
});

const activeModuleId = computed({
  get() {
    return editerViewStore.getActiveModuleProps("id");
  },
  set() {},
});

const draggerRegionSize = ref({ width: 600, height: 600 });

// const activeModuleType = computed({
//   get() {
//     return editerViewStore.getActiveModuleProps("type");
//   },
//   set() {},
// });

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import testData from "@/data/test.json";
// const defaultValue = "IMAGE";
// const defaultValue = "BLOCK";
const defaultValue = "FONT";

const accordionItems = testData;
const currentTabItem = ref(t("views.editer.index.right_tab1"));

function switchToTab(key: string) {
  currentTabItem.value = t(key);
}

const computedProps = function (key: any, defaultValue: any) {
  return key ? key : defaultValue;
};

function handleDoubleClick() {
  switchToTab("views.editer.index.right_tab2");
}

// 选中激活的module
function pickerModule(value: any) {
  proxy.$store.editerView.useCounterStore().setActiveModule(value);
}

/**
 * 拖动模块结束后逻辑
 * @param x x坐标
 * @param y y坐标
 * @param item 修改项
 */
function dragEndModule(x: number, y: number, item: any) {
  let id = get(item, "id", undefined);
  if (id) {
    editerListStore.setModuleItem({ id, "axis.x": x, "axis.y": y }, { type: "move", description: "移动" });
  }
}
/**
 * 变换模块结束后逻辑
 * @param x x坐标
 * @param y y坐标
 * @param width 宽
 * @param height 高
 * @param item 修改项
 */
function onResizeStopModule(x: number, y: number, width: number, height: number, item: any) {
  let id = get(item, "id", undefined);
  if (id) {
    // editerListStore.setModuleItem(id, { "axis.x": x, "axis.y": y, width, height }, { type: "move", description: "变形" });
    editerListStore.setModuleItem({ id, "axis.x": x, "axis.y": y, width, height }, { type: "move", description: "变形" });
  }
}

// 复制粘贴撤销逻辑
const handleKeyEvent = (event: { ctrlKey: any; metaKey: any; key: any }) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case "c":
        console.log("复制 (Ctrl + C)");
        break;
      case "v":
        console.log("粘贴 (Ctrl + V)");
        break;
      case "z":
        console.log("撤销 (Ctrl + Z)");
        editerListStore.cancelRecord();
        break;
      // 可以添加更多按键的监听
      default:
        break;
    }
  }
};

interface vdrLine {
  display: boolean;
  lineLength: string;
  origin: string;
  position: string;
}
const vdrVLine = ref<vdrLine[]>([]);
const vdrHLine = ref<vdrLine[]>([]);

// 辅助线回调事件
function getRefLineParams(params: any) {
  const { vLine, hLine } = params;
  vdrVLine.value = vLine;
  vdrHLine.value = hLine;
}

// function onContextMenu(e: any) {
//   e.preventDefault();
//   console.log("e", e);
// }

// 滚动逻辑
// 待使用
const scale = ref(1);
function handleWheel(event: any) {
  // 检查是否按下了Ctrl键
  if (event.ctrlKey) {
    // 根据滚轮滚动的方向来缩小div
    if (event.deltaY < 0) {
      scale.value *= 0.95; // 缩小为当前比例的95%
    } else {
      scale.value /= 0.95; // 放大为当前比例的105%（约为1.05倍）
    }
  }
}

import "shufflemanvue3-context-menu/lib/vue3-context-menu.css";
import "@/assets/context-menu.scss";

import ContextMenu from "shufflemanvue3-context-menu";
import { useColorMode } from "@vueuse/core";
const mode = useColorMode();

function onContextMenu(e: MouseEvent) {
  //show our menu
  ContextMenu.showContextMenu({
    customClass: "w-[250px]",
    // theme: `mac ${mode.value}`,
    x: e.x,
    y: e.y,
    items: [
      {
        label: "A menu item",
        onClick: () => {
          alert("You click a menu item");
        },
      },
      {
        label: "A submenu",
        children: [{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }],
      },
    ],
  });
}

function onContextMenu2(e: MouseEvent) {
  //show our menu
  ContextMenu.showContextMenu({
    customClass: "w-[250px]",
    x: e.x,
    y: e.y,
    items: [
      {
        label: "A menu item22",
        onClick: () => {
          alert("You click a menu item22");
        },
        shortcut: "Ctrl + S",
      },
      {
        label: "A submenu",
        children: [{ label: "Item12" }, { label: "Item22" }, { label: "Item32" }],
      },
    ],
    // theme: `mac ${mode.value}`,
  });
}

onMounted(() => {
  document.addEventListener("keydown", handleKeyEvent);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyEvent);
});
</script>
<style>
/* @import "vue-draggable-resizable/style.css"; */
</style>
<style lang="scss">
.editer_index {
  .draggerRegionWrapper {
    position: relative;
    width: 100vw;
  }
  .tabsList {
    overflow: auto;
    cursor: pointer;
    button {
      box-shadow: none;
    }
  }
  .tabsList_bg {
    background: #00000000;
  }
  .scrollAreaHeight {
    height: calc(100vh - 6rem - 13px);
  }
  .no-border {
    border: 0px solid #00000000;
  }
  .draggerRegion {
    position: relative;
    margin: auto;
    background-color: hsl(var(--background));
    // background: linear-gradient(-90deg, hsl(var(--border)) 1px, transparent 1px), linear-gradient(hsl(var(--border)) 1px, transparent 1px);
    // background-size: 10px 10px, 10px 10px;
    background-image: linear-gradient(hsl(var(--border)) 2px, transparent 0), linear-gradient(90deg, hsl(var(--border)) 2px, transparent 0), linear-gradient(hsl(var(--border)) 1px, transparent 0),
      linear-gradient(90deg, hsl(var(--border)) 1px, transparent 0);
    background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
    background-position: -1px -1px;
    outline: 2px solid hsl(var(--border));

    // overflow: auto;
    transition: transform 0.1s ease-in-out;
  }
  .active-border {
    // box-shadow: 0 0 5px hsl(var(--accent-foreground));
    .moduleView {
      filter: drop-shadow(0px 0px 5px hsl(var(--accent-foreground)));
    }
    cursor: move;
    cursor: -webkit-grabbing;
  }
  // .ref-line {
  //   position: absolute;
  //   background-color: rgb(255, 0, 204);
  //   z-index: 9999;
  // }
  // .h-line {
  //   height: 1px;
  // }
  // .v-line {
  //   width: 1px;
  // }
}
</style>
