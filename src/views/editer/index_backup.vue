<template>
  <div class="editer_index">
    <ResizablePanelGroup id="handle-demo-group-1" direction="horizontal" class="min-w-screen min-h-screen rounded-lg border -mt-16 pt-16">
      <!-- <ResizablePanel id="handle-demo-panel-0" :default-size="15">
        <Tabs :default-value="$t('views.editer.index.left_tab1')" class="h-full">
          <TabsList class="tabsList tabsList_bg p-0">
            <TabsTrigger :value="$t('views.editer.index.left_tab1')" class="w-24">
              {{ $t("views.editer.index.left_tab1") }}
            </TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent :value="$t('views.editer.index.left_tab1')" class="h-full">
            <div class="w-full rounded-md px-4 scrollAreaHeight">
              <layer></layer>
            </div>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle id="handle-demo-handle-0" disabled /> -->

      <ResizablePanel id="handle-demo-panel-1" :default-size="55" :min-size="50" :max-size="60">
        <div class="draggerRegion" @wheel="handleWheel" :style="{ transform: `scale(${scale})` }">
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
            @contextmenu="onContextMenu"
          >
            <moduleView :module="item" :dragger="true"></moduleView>
          </vdr>
          <!--辅助线 start-->
          <span class="ref-line v-line" v-for="item in vdrVLine" v-show="item.display" :style="{ left: item.position, top: item.origin, height: item.lineLength }" />
          <span class="ref-line h-line" v-for="item in vdrHLine" v-show="item.display" :style="{ top: item.position, left: item.origin, width: item.lineLength }" />
          <!--辅助线END-->
          <!-- <vue-draggable-resizable
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
            @dragStop="
              (x:number, y:number) => {
                dragEndModule(x, y, item);
              }
            "
            @resizeStop="(x:number, y:number,w:number,h:number) => {
              onResizeStopModule(x, y,w,h,item);
              }"
            :active="item.id === activeModuleId"
          >
            <moduleView :module="item" :dragger="true"></moduleView>
          </vue-draggable-resizable> -->
        </div>
      </ResizablePanel>
      <!-- <ResizableHandle id="handle-demo-handle-1" with-handle />
      <ResizablePanel id="handle-demo-panel-2" :default-size="30" :max-size="35" :min-size="25">
        <Tabs :modelValue="currentTabItem" class="h-full">
          <TabsList class="tabsList tabsList_bg p-0">
            <TabsTrigger :value="$t('views.editer.index.right_tab1')" class="w-24" @click="switchToTab('views.editer.index.right_tab1')">
              {{ $t("views.editer.index.right_tab1") }}
            </TabsTrigger>
            <TabsTrigger :value="$t('views.editer.index.right_tab2')" class="w-24" @click="switchToTab('views.editer.index.right_tab2')">
              {{ $t("views.editer.index.right_tab2") }}
            </TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent :value="$t('views.editer.index.right_tab1')">
            <ScrollArea class="w-full rounded-md px-4 scrollAreaHeight">
              <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
                <AccordionItem v-for="aitem in accordionItems" :key="aitem.moduleKey" :value="aitem.moduleKey">
                  <AccordionTrigger>{{ aitem.moduleName }}</AccordionTrigger>
                  <AccordionContent>
                    <moduleList v-for="mitem in aitem.moduleList" :key="mitem.id" :value="mitem.id" :module="mitem"></moduleList>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </TabsContent>
          <TabsContent :value="$t('views.editer.index.right_tab2')">
            <ScrollArea class="w-full rounded-md p-4 scrollAreaHeight">
              <attributeView></attributeView>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </ResizablePanel> -->
    </ResizablePanelGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, computed, onMounted, onUnmounted } from "vue";

import vdr from "vue-draggable-resizable-gorkys/src/components/vue-draggable-resizable.vue";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import moduleList from "./components/moduleList.vue";
import layer from "./components/layer.vue";
// import layer from "./components/layerBySortable.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
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

function onContextMenu(e: any) {
  e.preventDefault();
  console.log("e", e);
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
    background-color: hsl(var(--background));
    // background: linear-gradient(-90deg, hsl(var(--border)) 1px, transparent 1px), linear-gradient(hsl(var(--border)) 1px, transparent 1px);
    // background-size: 10px 10px, 10px 10px;
    background-image: linear-gradient(hsl(var(--border)) 2px, transparent 0), linear-gradient(90deg, hsl(var(--border)) 2px, transparent 0), linear-gradient(hsl(var(--border)) 1px, transparent 0),
      linear-gradient(90deg, hsl(var(--border)) 1px, transparent 0);
    background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
    background-position: -2px -2px;
    outline: 2px solid hsl(var(--border));
    height: 100%;
    width: 100%;

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
