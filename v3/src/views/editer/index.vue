<template>
  <div class="editer_index">
    <ResizablePanelGroup id="handle-demo-group-1" direction="horizontal" class="min-w-screen min-h-screen rounded-lg border -mt-16 pt-16">
      <ResizablePanel id="handle-demo-panel-0" :default-size="15">
        <Tabs :default-value="$t('views.editer.index.left_tab1')" class="h-full">
          <TabsList class="tabsList tabsList_bg p-0">
            <TabsTrigger :value="$t('views.editer.index.left_tab1')" class="w-24">
              {{ $t("views.editer.index.left_tab1") }}
            </TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent :value="$t('views.editer.index.left_tab1')" class="h-full">
            <ScrollArea class="w-full rounded-md px-4 scrollAreaHeight">
              <layer></layer>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle id="handle-demo-handle-0" disabled />
      <ResizablePanel id="handle-demo-panel-1" :default-size="60" :min-size="45">
        <div
          :style="{
            position: 'relative',
            backgroundColor: '#808080',
            background: 'linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px)',
            backgroundSize: '20px 20px, 20px 20px',
            height: '100%',
            width: '100%',
          }"
        >
          <vue-draggable-resizable :lock-aspect-ratio="true" :parent="true" :w="400" :h="200" :grid="[20, 20]">
            <moduleView :module="item" v-for="(item, index) in editerList" :key="item.id"></moduleView>
            <!-- <p>Keep aspect ratio in component costrained on grid [ 20, 20 ].</p> -->
          </vue-draggable-resizable>
        </div>
      </ResizablePanel>
      <ResizableHandle id="handle-demo-handle-1" with-handle />
      <ResizablePanel id="handle-demo-panel-2" :default-size="30" :max-size="40" :min-size="30">
        <Tabs :default-value="$t('views.editer.index.right_tab1')" class="h-full">
          <TabsList class="tabsList tabsList_bg p-0">
            <TabsTrigger :value="$t('views.editer.index.right_tab1')" class="w-24">
              {{ $t("views.editer.index.right_tab1") }}
            </TabsTrigger>
            <TabsTrigger :value="$t('views.editer.index.right_tab2')" class="w-24">
              {{ $t("views.editer.index.right_tab2") }}
            </TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent :value="$t('views.editer.index.right_tab1')">
            <ScrollArea class="w-full rounded-md px-4 scrollAreaHeight">
              <!-- Make changes to your {{ $t("views.editer.index.right_tab1") }} here. -->
              <!-- <componentsList></componentsList> -->
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
            <ScrollArea class="w-full rounded-md p-4 scrollAreaHeight"> Make changes to your {{ $t("views.editer.index.right_tab2") }} here. </ScrollArea>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, reactive, getCurrentInstance, computed } from "vue";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import moduleList from "./components/moduleList.vue";
import layer from "./components/layer.vue";
// import layer from "./components/layerBySortable.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import { uucBlock, uucFont, uucImage } from "@/data/structure/uuc";

import moduleView from "./components/moduleView.vue";

const { proxy } = getCurrentInstance();
import { storeToRefs } from "pinia";
// console.log("proxy.$store2", proxy.$store.editerTemp.useCounterStore().editerList.length);
// console.log("proxy.$store2", proxy.$store.editerTemp.useCounterStore().editerList);
// let editerList = proxy.$store.editerTemp.useCounterStore().editerList || [];

const editerTempStore = storeToRefs(proxy.$store.editerTemp.useCounterStore());
const editerList = computed({
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

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import testData from "@/data/test.json";
const defaultValue = "BLOCK";

const accordionItems = testData;

// 更新内部level的逻辑
// function resetInnerLevel(event: any, list) {
//   let [startIndex, endIndex] = event.oldIndex <= event.newIndex ? [event.oldIndex, event.newIndex] : [event.newIndex, event.oldIndex];
//   for (let index = startIndex; index <= endIndex; index++) {
//     const item = list[index];
//     item.level = index;
//     // console.log("item", item, item.level);
//   }
//   return list;
// }

// // 拖动列表改变
// function layerchange(event) {
//   console.log("layerchange event", event);
//   // 删除拖拽的元素
//   let list = [...editerList.list];
//   const item = list.splice(event.oldIndex, 1)[0];
//   // 把删除的元素放到新的位置
//   list.splice(event.newIndex, 0, item);
//   list = resetInnerLevel(event, list);
//   // console.log(editerList.list);
//   editerList.list = list;
//   console.log("layerchange list", editerList.list);
// }
// function layerchange(list) {
//   editerList.list = list;
// }

interface axis {
  x: number;
  y: number;
}

interface fontStyle {
  size: number;
  color: string;
  family: string;
  familyName: string;
  style: string;

  // # style
  // normal	默认值，文本以正常字体显示
  // italic	文本以斜体显示
  // oblique	文本倾斜显示
  // inherit	从父元素继承字体样式

  weight: string;
  // # weight
  // normal	默认值，标准字体
  // bold	粗体字体
  // bolder	更粗的字体
  // lighter	更细的字体
}

// 默认初始到页面上的位置
const defaultAxis: axis = { x: 10, y: 10 };

// 添加到layer和添加到draggable中
const addModulesToDraggable = (value) => {
  console.log("Function called from Grandparent");
  let classContent = value.content;
  const labelName = classContent.label ? classContent.label : editerList.length + value.name;
  if (value.type == "block") {
    const item: uucBlock = new uucBlock({ ...classContent, level: editerList.length, axis: defaultAxis, label: labelName });
    // editerList.list.push(item);
    proxy.$store.editerTemp.useCounterStore().pushList(item);
  } else if (value.type == "image") {
    const item: uucImage = new uucImage({ ...classContent, level: editerList.length, axis: defaultAxis, label: labelName, src: "666" });
    // editerList.list.push(item);
    proxy.$store.editerTemp.useCounterStore().pushList(item);
  } else if (value.type == "font") {
    const defaultFont: fontStyle = {
      size: 10,
      color: "#000000",
      family: "",
      familyName: "黑体",
      style: "normal",
      weight: "normal",
    };
    const item: uucFont = new uucFont({ ...classContent, level: editerList.length, axis: defaultAxis, label: labelName, font: defaultFont });
    // editerList.list.push(item);
    proxy.$store.editerTemp.useCounterStore().pushList(item);
  }
  // console.log(editerList.list);
};

// 使用 provide 函数将函数注入到组件树中
provide("addModulesToDraggable", addModulesToDraggable);
</script>
<style>
@import "vue-draggable-resizable/style.css";
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
}
</style>
