<template>
  <div class="editer_index">
    <ResizablePanelGroup id="handle-demo-group-1" direction="horizontal" class="min-w-screen min-h-screen rounded-lg border -mt-16 pt-16">
      <ResizablePanel id="handle-demo-panel-0" :default-size="15">
        <Tabs :default-value="$t('views.editer.index.left_tab1')" class="h-full">
          <TabsList class="tabsList tabsList_bg p-0">
            <TabsTrigger :value="$t('views.editer.index.left_tab1')" class="w-24"> {{ $t("views.editer.index.left_tab1") }} </TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent :value="$t('views.editer.index.left_tab1')" class="h-full">
            <ScrollArea class="w-full rounded-md p-4 scrollAreaHeight">
              <layer :list="list"></layer>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle id="handle-demo-handle-0" disabled />
      <ResizablePanel id="handle-demo-panel-1" :default-size="60" :min-size="45">
        <div class="flex h-full items-center justify-center p-6">
          <div style="height: 500px; width: 500px; border: 1px solid red; position: relative">
            <vue-draggable-resizable :w="100" :h="100" :parent="true">
              <p>Hello! I'm a flexible component. You can drag me around and you can resize me.</p>
            </vue-draggable-resizable>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle id="handle-demo-handle-1" with-handle />
      <ResizablePanel id="handle-demo-panel-2" :default-size="30" :max-size="40" :min-size="20">
        <Tabs :default-value="$t('views.editer.index.right_tab1')" class="h-full">
          <TabsList class="tabsList tabsList_bg p-0">
            <TabsTrigger :value="$t('views.editer.index.right_tab1')" class="w-24"> {{ $t("views.editer.index.right_tab1") }} </TabsTrigger>
            <TabsTrigger :value="$t('views.editer.index.right_tab2')" class="w-24"> {{ $t("views.editer.index.right_tab2") }} </TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent :value="$t('views.editer.index.right_tab1')">
            <ScrollArea class="w-full rounded-md p-4 scrollAreaHeight">
              <!-- Make changes to your {{ $t("views.editer.index.right_tab1") }} here. -->
              <componentsList></componentsList>
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
<script setup>
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import componentsList from "./components/componentsList.vue";
import layer from "./components/layer.vue";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ref } from "vue";
const list = ref([
  { label: "早餐吃些什么呢早餐吃些什么呢早餐吃些什么呢", value: "value1" },
  { label: "午餐吃些什么呢", value: "value2" },
  { label: "晚餐吃些什么呢5", value: "value3" },
  { label: "夜宵吃些什么呢4", value: "value4" },
  { label: "夜宵吃些什么呢3", value: "value4" },
  { label: "夜宵吃些什么呢2", value: "value4" },
]);
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
