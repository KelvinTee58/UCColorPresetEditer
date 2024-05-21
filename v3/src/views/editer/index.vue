<template>
  <div class="editer_index">
    <div class="h-5/6 w-1/6 min-w-56 max-w-80 absolute my-5 left-5">
      <Panel class="h-full w-full relative" :label="$t('views.editer.index.left_tab1')">
        <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
          <AccordionItem class="border-border" v-for="aitem in accordionItems" :key="aitem.moduleKey" :value="aitem.moduleKey">
            <AccordionTriggerLeft class="select-none">
              {{ aitem.moduleName }}
            </AccordionTriggerLeft>
            <AccordionContent class="grid grid-cols-5 gap-x-1 gap-y-2 justify-center">
              <moduleList v-for="mitem in aitem.moduleList" :key="mitem.id" :value="mitem.id" :module="mitem"></moduleList>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Panel>
    </div>
    <div class="h-5/6 w-1/6 min-w-56 max-w-80 absolute my-5 right-5">
      <tabsPanel class="h-full w-full relative" :labelList="labelList">
        <template #Style>
          <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
            <AccordionItem v-for="aitem in accordionItems" :key="aitem.moduleKey" :value="aitem.moduleKey">
              <AccordionTriggerLeft class="select-none">
                {{ aitem.moduleName }}
              </AccordionTriggerLeft>
              <AccordionContent class="grid grid-cols-5 gap-x-1 gap-y-2 justify-center">
                <moduleList v-for="mitem in aitem.moduleList" :key="mitem.id" :value="mitem.id" :module="mitem"></moduleList>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </template>
        <template #Style2>
          <Accordion type="single" class="w-full" collapsible :default-value="defaultValue" #Style2>
            <AccordionItem v-for="aitem in accordionItems" :key="aitem.moduleKey" :value="aitem.moduleKey">
              <AccordionTriggerLeft class="select-none">
                {{ aitem.moduleName }}
              </AccordionTriggerLeft>
              <AccordionContent class="grid grid-cols-5 gap-x-1 gap-y-2 justify-center">
                <moduleList v-for="mitem in aitem.moduleList" :key="mitem.id" :value="mitem.id" :module="mitem"></moduleList>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </template>
      </tabsPanel>
    </div>
    <div class="draggerRegionWrapper h-full-container flex justify-center items-center z-20">
      <div
        class="draggerRegion"
        @contextmenu.prevent.stop="onContextMenu"
        @wheel="handleWheel"
        :style="{ transform: `scale(${scale})`, width: `${draggerRegionSize.width}px`, height: `${draggerRegionSize.height}px` }"
        :ref="drop"
        id="drop"
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
          @contextmenu.prevent.stop="
            (event) => {
              onObjectsContextMenu(event, item);
            }
          "
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
import { ref, getCurrentInstance, computed, onMounted, onUnmounted, unref } from "vue";

import vdr from "vue-draggable-resizable-gorkys/src/components/vue-draggable-resizable.vue";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import { Panel, tabsPanel } from "@/components/ui/floatingSidePanel_kz";
import moduleList from "./components/moduleList.vue";
// import layer from "./components/layer.vue";
import moduleView from "./components/moduleView.vue";
// import attributeView from "./components/attributeView.vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { filters } from "@/lib/filters.ts";
// import { useToast } from "@/components/ui/toast/use-toast";

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
const labelList = ref([{ name: "Style", icon: "radix-icons:moon" }, { name: "Style2", icon: "radix-icons:dots-vertical" }, { name: "Style3" }, { name: "Style4" }]);

// const activeModuleType = computed({
//   get() {
//     return editerViewStore.getActiveModuleProps("type");
//   },
//   set() {},
// });

import { Accordion, AccordionContent, AccordionItem, AccordionTriggerLeft, AccordionTrigger } from "@/components/ui/accordion";
import testData from "@/data/test.json";
// const defaultValue = "IMAGE";
const defaultValue = "BLOCK";
// const defaultValue = "FONT";

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

function onObjectsContextMenu(e: MouseEvent, item: any) {
  //show our menu
  ContextMenu.showContextMenu({
    customClass: "w-[250px]",
    x: e.x,
    y: e.y,
    items: [
      {
        label: t("views.editer.index.object_context_menu.delete"),
        onClick: () => {
          // alert("You click a menu item22");
          let id = get(item, "id", undefined);
          editerListStore.removeModuleItem([id], { type: "delete", description: "移除" });
        },
        shortcut: filters.getUserAgentCtrlShortcutKey("←"),
      },
      // {
      //   label: "A submenu",
      //   children: [{ label: "Item12" }, { label: "Item22" }, { label: "Item32" }],
      // },
    ],
    // theme: `mac ${mode.value}`,
  });
}

import { useDrop } from "vue3-dnd";
import { toRefs } from "@vueuse/core";

const [collect, drop] = useDrop(() => ({
  accept: "box",
  drop: (item, monitor) => {
    let m_x = 0,
      m_y = 0,
      d_x = 0,
      d_y = 0;
    let drop_Rect = document.getElementById("drop").getBoundingClientRect();
    let monitor_offset = monitor.getSourceClientOffset();
    m_x = monitor_offset.x;
    m_y = monitor_offset.y;
    d_x = drop_Rect.x;
    d_y = drop_Rect.y;
    // 获取当前拖动dom 放置的位置
    let drop_x = parseInt(m_x - d_x);
    let drop_y = parseInt(m_y - d_y);
    console.log("drop getSourceClientOffset", item.content, drop_x, drop_y);
    if (item.id && item.content.type) {
      editerListStore.addModuleItem(item, { x: drop_x, y: drop_y });
    }

    // console.log("drop getInitialClientOffset", monitor.getInitialClientOffset());
    // console.log("drop getInitialSourceClientOffset", monitor.getInitialSourceClientOffset());
    // console.log("drop getDifferenceFromInitialOffset", monitor.getDifferenceFromInitialOffset());
    // console.log("drop getClientOffset", monitor.getClientOffset());
  },
  collect: (monitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
}));
const { canDrop, isOver } = toRefs(collect);
const isActive = computed(() => unref(canDrop) && unref(isOver));
// const backgroundColor = computed(() => (unref(isActive) ? "darkgreen" : unref(canDrop) ? "darkkhaki" : "#222"));
const activeColor = computed(() => (unref(isActive) ? "darkgreen" : unref(canDrop) ? "darkkhaki" : "#222"));

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
    overflow: hidden;
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
