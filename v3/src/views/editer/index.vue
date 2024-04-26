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
            <div class="w-full rounded-md px-4 scrollAreaHeight">
              <layer></layer>
            </div>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle id="handle-demo-handle-0" disabled />
      <ResizablePanel id="handle-demo-panel-1" :default-size="55" :min-size="50" :max-size="60">
        <div class="draggerRegion">
          <vue-draggable-resizable
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
            @click="pickerModule(item.id)"
            :active="item.id === activeModuleId"
          >
            <!-- {{ computedProps(item.level, 0) }} \\ {{ item.level }} -->
            <moduleView :module="item"></moduleView>
            <!-- <p>Keep aspect ratio in component costrained on grid [ 20, 20 ].</p> -->
          </vue-draggable-resizable>
        </div>
      </ResizablePanel>
      <ResizableHandle id="handle-demo-handle-1" with-handle />
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
            <ScrollArea class="w-full rounded-md p-4 scrollAreaHeight">
              Make changes to your
              {{ $t("views.editer.index.right_tab2") }}
              here.
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, computed } from "vue";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import moduleList from "./components/moduleList.vue";
import layer from "./components/layer.vue";
// import layer from "./components/layerBySortable.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import moduleView from "./components/moduleView.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
// console.log(t("views.editer.index.right_tab1"));

const { proxy } = getCurrentInstance();
import { storeToRefs } from "pinia";
// console.log("proxy.$store2", proxy.$store.editerList.useCounterStore().editerList.length);
// console.log("proxy.$store2", proxy.$store.editerList.useCounterStore().editerList);
// let editerList = proxy.$store.editerList.useCounterStore().editerList || [];

const editerListStore = storeToRefs(proxy.$store.editerList.useCounterStore());
const editerViewStore = storeToRefs(proxy.$store.editerView.useCounterStore());
const editerList = computed({
  get() {
    console.log("layerList index get");
    return editerListStore.editerList.value;
  },
  set(val) {
    // trigger when drag state changed if you use with `v-model:dataSource`

    proxy.$store.editerList.useCounterStore().setList(val);
  },
});

const activeModuleId = computed({
  get() {
    return editerViewStore.activeModuleId.value;
  },
});

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import testData from "@/data/test.json";
const defaultValue = "BLOCK";

const accordionItems = testData;
const currentTabItem = ref(t("views.editer.index.right_tab1"));

function switchToTab(key) {
  currentTabItem.value = t(key);
}

const computedProps = function (key, defaultValue) {
  return key ? key : defaultValue;
};

function handleDoubleClick() {
  switchToTab("views.editer.index.right_tab2");
}

// 选中激活的module
function pickerModule(id: string) {
  proxy.$store.editerView.useCounterStore().setActiveModuleId(id);
}
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
  .no-border {
    border: 0px solid #00000000;
  }
  .draggerRegion {
    position: relative;
    background-color: hsl(var(--background));
    background: linear-gradient(-90deg, hsl(var(--border)) 1px, transparent 1px), linear-gradient(hsl(var(--border)) 1px, transparent 1px);
    background-size: 10px 10px, 10px 10px;
    height: 100%;
    width: 100%;
  }
  .active-border {
    box-shadow: 0 0 5px hsl(var(--accent-foreground));
  }
}
</style>
