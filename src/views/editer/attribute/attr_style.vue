<template>
  <div class="attribute_style text-left">
    <div class="_style_fill border-b border-border px-4 py-3">
      <label for="radix-11-form-item" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Fill</label>
      <div class="my-2">
        <!-- <Select v-bind="fill_type"> -->
        <Select v-model="fill_type">
          <SelectTrigger>
            <SelectValue placeholder="Fill Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="value" v-for="(value, key) in fillTypeList">{{ key }}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="my-2" v-show="fill_type != 'none'">
        <!-- <SelectPicker @update:modelValue="updateFillModelValue" :mode="" class="mb-2"></SelectPicker> -->
        <SelectPicker ref="fillColorRef" :value="fill_color" @update:value="updateFillModelValue" :mode="fill_type" placeholder="Fill Color" class="mb-2"></SelectPicker>
      </div>
    </div>
    <div class="_style_line border-b border-border px-4 py-3">
      <label for="radix-11-form-item" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Border</label>
      <div class="my-2 flex justify-between items-center">
        <Input type="number" placeholder="Border width" v-model="border_width" />
        <label for="radix-11-form-item" class="pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PX</label>
      </div>
      <div class="my-2">
        <!-- <Select v-bind="fill_type"> -->
        <Select v-model="border_style">
          <SelectTrigger>
            <SelectValue placeholder="Fill Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="value" v-for="(value, key) in borderTypeList">
                <div class="flex justify-between w-36 items-center">
                  <div>{{ key }}</div>
                  <div :class="`border-${value}`" class="border-t-2 w-16 border-black h-0"></div>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="my-2">
        <!-- <SelectPicker @update:modelValue="updateFillModelValue" :mode="" class="mb-2"></SelectPicker> -->
        <SelectPicker ref="borderColorRef" :value="border_color" @update:value="updateBorderModelValue" mode="solid" placeholder="Border Color" class="mb-2"></SelectPicker>
      </div>
    </div>
    <div class="_style_round border-b border-border px-4 py-3">
      <label for="radix-11-form-item" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Round</label>
      <div class="my-2 flex justify-between items-center">
        <Input type="number" placeholder="Border width" v-model="round_width" />
        <label for="radix-11-form-item" class="pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PX</label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectPicker } from "@/components/ui/AA_kz_colorPicker";
// import { toast } from "@/components/ui/toast";
import { ref, getCurrentInstance, computed } from "vue";
import { get } from "lodash";
const { proxy } = getCurrentInstance() as any;

import propsComputed from "./js/propsComputed.ts";

// let fillType = ref({ solid: "solid", dots: "dots" });

const editerViewStore = proxy.$store.editerView.editerViewStore();
const editerListStore = proxy.$store.editerList.editerListStore();
// const activeModule = propsComputed("fill.mode", { propsDefault: "none", setFunction: () => {} });
const activeModule = computed({
  get() {
    console.log("editerViewStore :>> ", editerViewStore.activeModule);
    return editerViewStore.activeModule;
  },
  set(val: any) {
    console.log("activeModule val", val);
  },
});

const fillTypeList = ref({ None: "none", Solid: "solid", Gradient: "gradient" });
const fill_type = propsComputed("fill.mode", { returnType: "any", propsDefault: "none" });

const fillColorRef = ref();
const fill_color = propsComputed("fill.color", { returnType: "string", propsDefault: "" });
function updateFillModelValue(value: any) {
  let id = get(editerViewStore, "activeModule.id", "");
  if (id) {
    editerListStore.setModuleItem({ id, "fill.color": value }, { type: "style", description: "fill.color 修改" });
  }
}

const border_width = propsComputed("border.width", { returnType: "number", propsDefault: 0 });
const borderTypeList = ref({ None: "none", Solid: "solid", Dotted: "dotted", Dashed: "dashed", Double: "double" });
const border_style = propsComputed("border.style", { returnType: "string", propsDefault: "none" });

const borderColorRef = ref();
const border_color = propsComputed("border.color", { returnType: "string", propsDefault: "" });
function updateBorderModelValue(value: any) {
  let id = get(editerViewStore, "activeModule.id", "");
  if (id) {
    editerListStore.setModuleItem({ id, "border.color": value }, { type: "style", description: "border.color 修改" });
  }
}

const round_width = propsComputed("round", { returnType: "number", propsDefault: 0 });
</script>
