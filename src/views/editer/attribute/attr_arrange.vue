<template>
  <div class="attribute_size text-left">
    <div class="_style_lock border-b border-border px-4 py-3 flex justify-center items-center w-full h-full absolute lock-bg z-10" v-show="lock">
      <!-- <Button @click="clickUnlock" class="z-20 opacity-100"> {{ $t("views.editer.index.object_context_menu.lock") }} </Button> -->
      <Button variant="outline" @click="clickUnlock" class="z-20 opacity-100"> {{ $t("views.editer.index.object_context_menu.lock") }} </Button>
    </div>
    <div class="_style_fill border-b border-border px-4 py-3">
      <div class="flex justify-between items-center min-h-10">
        <label for="radix-11-form-item" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Size</label>
        <LockKeyhole class="w-3" v-show="lock" />
      </div>
      <div class="my-2 flex justify-between items-center">
        <label for="radix-11-form-item" class="w-32 pr-2 text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-20">Width</label>
        <BlurInput type="number" placeholder="Border width" v-model="size_width" :disabled="lock" />
        <label for="radix-11-form-item" class="pl-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PX</label>
      </div>
      <div class="my-2 flex justify-between items-center">
        <label for="radix-11-form-item" class="w-32 pr-2 text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-20">Height</label>
        <BlurInput type="number" placeholder="Border width" v-model="size_height" :disabled="lock" />
        <label for="radix-11-form-item" class="pl-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PX</label>
      </div>
      <div class="my-2 flex justify-between items-center min-h-10">
        <label for="radix-11-form-item" class="w-32 pr-2 text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-20">LockAspectRatio</label>
        <Checkbox :checked="size_lockAspectRatio" @click="updateLockAspectRatioValue" :disabled="lock" />
      </div>
    </div>
    <div class="_style_position border-b border-border px-4 py-3">
      <div class="flex justify-between items-center min-h-10">
        <label for="radix-11-form-item" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Position</label>
        <LockKeyhole class="w-4" v-show="lock" />
      </div>
      <div class="my-2 flex justify-between items-center">
        <label for="radix-11-form-item" class="w-32 pr-2 text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-20">X</label>
        <BlurInput type="number" placeholder="Border width" v-model="position_x" :disabled="lock" />
        <label for="radix-11-form-item" class="pl-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PX</label>
      </div>
      <div class="my-2 flex justify-between items-center">
        <label for="radix-11-form-item" class="w-32 pr-2 text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-20">Y</label>
        <BlurInput type="number" placeholder="Border width" v-model="position_y" :disabled="lock" />
        <label for="radix-11-form-item" class="pl-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PX</label>
      </div>
    </div>
    <div class="_style_angle border-b border-border px-4 py-3">
      <div class="flex justify-between items-center min-h-10">
        <label for="radix-11-form-item" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Angle</label>
        <LockKeyhole class="w-4" v-show="lock" />
      </div>
      <div class="my-2 flex justify-between items-center">
        <BlurInput type="number" placeholder="Border width" v-model="angle" :disabled="lock" />
        <label for="radix-11-form-item" class="pl-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">deg</label>
      </div>
    </div>
    <!-- <div class="_style_fill border-b border-border px-4 py-3"></div> -->
  </div>
</template>
<script setup lang="ts">
// import { InspectionPanel } from "lucide-vue-next";
// import { Input, BlurInput } from "@/components/ui/input";
import { BlurInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LockKeyhole } from "lucide-vue-next";

import propsComputed from "./js/propsComputed.ts";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;
import { get, cloneDeep } from "lodash";

const editerViewStore = proxy.$store.editerView.editerViewStore();
const editerListStore = proxy.$store.editerList.editerListStore();

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
function updateLockAspectRatioValue() {
  let lar = !size_lockAspectRatio.value;
  let id = get(editerViewStore, "activeModule.id", "");
  if (id) {
    editerListStore.setModuleItem({ id, "size.lockAspectRatio": lar }, { type: "style", description: "size.lockAspectRatio-修改" });
  }
}

const position_x = propsComputed("axis.x", { returnType: "number", propsDefault: 0 });
const position_y = propsComputed("axis.y", { returnType: "number", propsDefault: 0 });
const angle = propsComputed("angle", { returnType: "number", propsDefault: 0 });

const lock = propsComputed("uuConfig.lock", { returnType: "number", propsDefault: true });

function clickUnlock() {
  let id = get(editerViewStore, "activeModule.id", "undefined");
  let lock = get(editerViewStore, "activeModule.uuConfig.lock", false);
  if (id) {
    editerListStore.setModuleItem(
      {
        id,
        "uuConfig.lock": !lock,
      },
      { type: "config", description: "uuConfig.lock-修改" }
    );
  }
}
</script>
<
<style lang="scss" scoped>
.lock-bg {
  background-color: hsla(var(--background075));
}
</style>
