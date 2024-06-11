<template>
  <div class="editer_index">
    <div class="h-5/6 w-1/6 min-w-56 max-w-80 absolute my-5 left-5">
      <Tabs ref="scrollTab" :tabs="labelListLeft" :value="activeTabLeft">
        <template v-slot="{ activeTab }">
          <Accordion type="single" class="w-full" collapsible :default-value="defaultValue" v-show="activeTab == 'Object'">
            <AccordionItem class="border-border" v-for="aitem in accordionItems" :key="aitem.moduleKey" :value="aitem.moduleKey">
              <AccordionTriggerLeft class="select-none">
                {{ aitem.moduleName }}
              </AccordionTriggerLeft>
              <AccordionContent class="grid grid-cols-5 gap-x-1 gap-y-2 justify-center">
                <moduleList v-for="mitem in aitem.moduleList" :key="mitem.id" :value="mitem.id" :module="mitem"></moduleList>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </template>
      </Tabs>
    </div>
    <div class="h-5/6 w-1/6 min-w-64 max-w-80 absolute my-5 right-5">
      <Tabs ref="scrollTab" :tabs="labelListRight" :value="activeTabRight" :showArrow="true" :showUnderLine="true">
        <template #Style_icon>
          <Paintbrush class="h-[1.2rem] w-[1.2rem] pr-1"></Paintbrush>
        </template>
        <template v-slot="{ activeTab }">
          <ScrollArea class="w-full">
            <attrStyle v-show="activeTab == 'Style'"></attrStyle>
            <attrText v-show="activeTab == 'Text'"></attrText>
            <attrArrange v-show="activeTab == 'Arrange'"></attrArrange>
          </ScrollArea>
        </template>
      </Tabs>
    </div>
    <div class="draggerRegionWrapper h-full-container flex justify-center items-center z-20">
      <div
        class="draggerRegion"
        @mousedown.prevent.stop="clickDraggerRegion"
        @contextmenu.prevent.stop="onContextMenu"
        @wheel="handleWheel"
        :style="{ transform: `scale(${scale})`, width: `${draggerRegionSize.width}px`, height: `${draggerRegionSize.height}px` }"
        :ref="drop"
        id="drop"
      >
        <vdr
          :resizable="!get(item, 'uuConfig.lock', true)"
          :draggable="!get(item, 'uuConfig.lock', true)"
          :disableUserSelect="true"
          :lock-aspect-ratio="get(item, 'size.lockAspectRatio', true)"
          :parent="true"
          :w="get(item, 'size.width', 160)"
          :h="get(item, 'size.height', 160)"
          :x="get(item, 'axis.x', 0)"
          :y="get(item, 'axis.y', 0)"
          :z="get(item, 'level', 0)"
          :angle="get(item, 'angle', 0)"
          :grid="[10, 10]"
          v-for="item in editerList"
          :key="item.id"
          class-name="vdr no-border"
          class-name-active="active-border"
          @mousedown.prevent.stop="pickerModule(item)"
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
            (event:any) => {
              onObjectsContextMenu(event, item);
            }
          "
          :isRotateHandlerShow="!get(item, 'uuConfig.lock', true)"
          @rotated="
            (angle:number)=>{
              rotateModule(angle,item)
            }"
        >
          <moduleView :module="item" :dragger="true" :key="item.id"></moduleView>
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

import vdr from "vue-draggable-resizable-uuc/src/components/vue-draggable-resizable.vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTriggerLeft } from "@/components/ui/accordion";
import moduleList from "./components/moduleList.vue";
import moduleView from "./components/moduleView.vue";
import { attrArrange, attrStyle, attrText } from "./attribute";
import ContextMenu from "shufflemanvue3-context-menu";
import { useDrop } from "vue3-dnd";
import { Tabs } from "@/components/ui/AA_kz_scrollTabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paintbrush } from "lucide-vue-next";
import { Axis } from "@/data/structure/uuc_interface";

import "vue-draggable-resizable-uuc/dist/VueDraggableResizable.css";
import "shufflemanvue3-context-menu/lib/vue3-context-menu.css";
import "@/assets/context-menu.scss";

import { get } from "lodash";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { filters } from "@/lib/filters.ts";
const { t } = useI18n();
// const TabsPanelActive = ref("Text");
const { proxy } = getCurrentInstance() as any;
import { toRefs } from "@vueuse/core";

interface vdrLine {
  display: boolean;
  lineLength: string;
  origin: string;
  position: string;
}
const vdrVLine = ref<vdrLine[]>([]);
const vdrHLine = ref<vdrLine[]>([]);

const editerListStoreRefs = storeToRefs(proxy.$store.editerList.editerListStore());
const editerListStore = proxy.$store.editerList.editerListStore();
const editerViewStore = proxy.$store.editerView.editerViewStore();

const editerList = computed({
  get() {
    return editerListStoreRefs.editerList.value;
  },
  set(val) {
    // trigger when drag state changed if you use with `v-model:dataSource`

    proxy.$store.editerList.editerListStore().setList(val);
  },
});

const activeModuleId = computed({
  get() {
    return editerViewStore.getActiveModuleProps("id");
  },
  set() {},
});

// test start
const draggerRegionSize = ref({ width: 600, height: 600 });
const activeTabLeft = ref("Object");
const activeTabRight = ref("Text");
const labelListLeft = ref([{ id: "Object", name: "Object" }]);
const labelListRight = ref([
  { id: "Style", name: "Style", icon: "radix-icons:transparency-grid" },
  { id: "Text", name: "Text", icon: "radix-icons:text" },
  { id: "Arrange", name: "Arrange", icon: "radix-icons:group" },
]);
import testData from "@/data/test.json";
// const defaultValue = "IMAGE";
const defaultValue = "BLOCK";
// const defaultValue = "FONT";

const accordionItems = testData;

//test end
function clickDraggerRegion(event: any) {
  console.log("clickDraggerRegion :>> ");
  labelListRight.value = [{ id: "Region", name: "Region", icon: "radix-icons:transparency-grid" }];
}

// 选中激活的module
function pickerModule(value: any) {
  labelListRight.value = [
    { id: "Style", name: "Style", icon: "radix-icons:transparency-grid" },
    { id: "Text", name: "Text", icon: "radix-icons:text" },
    { id: "Arrange", name: "Arrange", icon: "radix-icons:group" },
  ];
  proxy.$store.editerView.editerViewStore().setActiveModule(value);
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
    editerListStore.setModuleItem({ id, "axis.x": x, "axis.y": y, "size.width": width, "size.height": height }, { type: "move", description: "变形" });
  }
}

function rotateModule(angle: any, item: any) {
  let angleF = parseFloat(angle);
  let id = get(item, "id", undefined);
  if (id) {
    editerListStore.setModuleItem({ id, angle: angleF }, { type: "style", description: "angle-修改" });
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

// 辅助线回调事件
function getRefLineParams(params: any) {
  const { vLine, hLine } = params;
  vdrVLine.value = vLine;
  vdrHLine.value = hLine;
}

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
      {
        label: t("views.editer.index.object_context_menu.lock"),
        onClick: () => {
          // alert("You click a menu item22");
          let id = get(item, "id", undefined);
          let lock = get(item, "uuConfig.lock", false);
          if (id) {
            editerListStore.setModuleItem(
              {
                id,
                "uuConfig.lock": !lock,
              },
              { type: "config", description: "uuConfig.lock-修改" }
            );
          }

          // editerListStore.removeModuleItem([id], { type: "delete", description: "移除" });
        },
      },
      // {
      //   label: "A submenu",
      //   children: [{ label: "Item12" }, { label: "Item22" }, { label: "Item32" }],
      // },
    ],
    // theme: `mac ${mode.value}`,
  });
}

function getDropOffset(axis: Axis) {
  let { x, y } = axis;
  let d_x = 0,
    d_y = 0,
    drop_x = 0,
    drop_y = 0;

  let drop_Rect = document.getElementById("drop").getBoundingClientRect();
  if (drop_Rect) {
    d_x = drop_Rect.x;
    d_y = drop_Rect.y;

    drop_x = parseInt(x - d_x);
    drop_y = parseInt(y - d_y);
  }

  return { x: drop_x, y: drop_y };
}

const [collect, drop] = useDrop(() => ({
  accept: "box",
  drop: (item, monitor) => {
    let m_x = 0,
      m_y = 0;
    let monitor_offset = monitor.getSourceClientOffset();
    m_x = monitor_offset.x;
    m_y = monitor_offset.y;

    const { x: drop_x, y: drop_y } = getDropOffset({ x: m_x, y: m_y });
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
  .vdr {
    transform-origin: center center;
  }
  $borderWidth: 0.5px;
  .draggerRegion {
    position: relative;
    margin: auto;
    background-color: hsl(var(--background));
    background-image: linear-gradient(hsl(var(--border)) $borderWidth * 2, transparent 0), linear-gradient(90deg, hsl(var(--border)) $borderWidth * 2, transparent 0),
      linear-gradient(hsl(var(--border)) $borderWidth, transparent 0), linear-gradient(90deg, hsl(var(--border)) $borderWidth, transparent 0);
    background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
    background-position: -1 * $borderWidth -1 * $borderWidth;
    outline: 2px solid hsl(var(--border));
    // overflow: auto;
    transition: transform 0.1s ease-in-out;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .vadrdiv {
    animation: rotate 2s linear infinite;
  }
  // .draggerRegion {
  //   position: relative;
  //   margin: auto;
  //   background-color: hsl(var(--background));
  //   // background: linear-gradient(-90deg, hsl(var(--border)) 1px, transparent 1px), linear-gradient(hsl(var(--border)) 1px, transparent 1px);
  //   // background-size: 10px 10px, 10px 10px;
  //   background-image: linear-gradient(hsl(var(--border)) 2px, transparent 0), linear-gradient(90deg, hsl(var(--border)) 2px, transparent 0), linear-gradient(hsl(var(--border)) 1px, transparent 0),
  //     linear-gradient(90deg, hsl(var(--border)) 1px, transparent 0);
  //   background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
  //   background-position: -1px -1px;
  //   outline: 2px solid hsl(var(--border));
  //   // overflow: auto;
  //   transition: transform 0.1s ease-in-out;
  // }
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
