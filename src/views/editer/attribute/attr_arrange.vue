<template>
  <div class="attribute_style text-left">
    <div class="_style_fill border-b border-border px-4 py-3">
      <label for="radix-11-form-item" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Size</label>
      <div class="my-2 flex justify-between items-center">
        <label for="radix-11-form-item" class="w-32 pr-2 text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-20">Width</label>
        <!-- <Input type="number" placeholder="Border width" v-model="size_width" /> -->
        <BlurInput type="number" placeholder="Border width" v-model="size_width" />
        <label for="radix-11-form-item" class="pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PX</label>
      </div>
      <div class="my-2 flex justify-between items-center">
        <label for="radix-11-form-item" class="w-32 pr-2 text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-20">Height</label>
        <!-- <Input type="number" placeholder="Border width" v-model="size_height" /> -->
        <BlurInput type="number" placeholder="Border width" v-model="size_height" />
        <label for="radix-11-form-item" class="pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PX</label>
      </div>
      <div class="my-2 flex justify-between items-center">
        <label for="radix-11-form-item" class="w-32 pr-2 text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-20">LockAspectRatio</label>
        <!-- <Button variant="outline" size="icon" :class="{ 'opacity-30': size_lockAspectRatio }" @click="updateLockAspectRatioValue">
          <InspectionPanel :size="24" />
        </Button> -->
        <Checkbox :checked="size_lockAspectRatio" @click="updateLockAspectRatioValue" />
      </div>
    </div>
    <div class="_style_fill border-b border-border px-4 py-3"></div>
    <div class="_style_fill border-b border-border px-4 py-3"></div>
    <div class="_style_fill border-b border-border px-4 py-3"></div>
  </div>
</template>
<script setup lang="ts">
// import { InspectionPanel } from "lucide-vue-next";
// import { Input, BlurInput } from "@/components/ui/input";
import { BlurInput } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import propsComputed from "./js/propsComputed.ts";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;
import { get, cloneDeep } from "lodash";

const widthOption = {
  eturnType: "number",
  propsDefault: 100,
  setFunction: (val: number) => {
    const size = cloneDeep(get(editerViewStore, "activeModule.size", {}));
    const aspectRatio = size.width / size.height;
    size.width = val;
    if (size.lockAspectRatio) {
      size.height = parseFloat((val / aspectRatio).toFixed(2));
    }
    let id = get(editerViewStore, "activeModule.id", "");
    if (id) {
      editerListStore.setModuleItem({ id, "size.height": size.height, "size.width": size.width }, { type: "style", description: "size.width-修改" });
    }
  },
};

const handleBlur = (event: any) => {
  // 阻止失去焦点事件
  event.preventDefault();
};

const heightOption = {
  eturnType: "number",
  propsDefault: 100,
  setFunction: (val: number) => {
    const size = cloneDeep(get(editerViewStore, "activeModule.size", {}));
    const aspectRatio = size.width / size.height;
    size.height = val;
    if (size.lockAspectRatio) {
      size.width = parseFloat((val * aspectRatio).toFixed(2));
    }
    let id = get(editerViewStore, "activeModule.id", "");
    if (id) {
      editerListStore.setModuleItem({ id, "size.height": size.height, "size.width": size.width }, { type: "style", description: "size.height-修改" });
    }
  },
};

const size_width = propsComputed("size.width", widthOption);
const size_height = propsComputed("size.height", heightOption);
const size_lockAspectRatio = propsComputed("size.lockAspectRatio", { returnType: "string", propsDefault: true });

const editerViewStore = proxy.$store.editerView.editerViewStore();
const editerListStore = proxy.$store.editerList.editerListStore();

function updateLockAspectRatioValue() {
  let lar = !size_lockAspectRatio.value;
  console.log("updateLockAspectRatioValue :>> ", size_lockAspectRatio);
  let id = get(editerViewStore, "activeModule.id", "");
  if (id) {
    editerListStore.setModuleItem({ id, "size.lockAspectRatio": lar }, { type: "style", description: "size.lockAspectRatio-修改" });
  }
}
</script>
