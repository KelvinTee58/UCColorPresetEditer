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
        <!-- <SelectPicker @update:modelValue="updateModelValue" :mode="" class="mb-2"></SelectPicker> -->
        <SelectPicker ref="selectPickerRef" :value="fill_color" @update:value="updateModelValue" :mode="fill_type" placeholder="Fill Color" class="mb-2"></SelectPicker>
      </div>
    </div>
    <div class="_style_line border-b border-border px-4 py-3"></div>
    <div class="_style_opacity border-b border-border px-4 py-3"></div>
    <div class="_style_round border-b border-border px-4 py-3"></div>
  </div>
</template>
<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { SelectPicker } from "@/components/ui/AA_kz_colorPicker";
// import { toast } from "@/components/ui/toast";
import { ref, computed, getCurrentInstance } from "vue";
import { get } from "lodash";
const { proxy } = getCurrentInstance() as any;

// let fillType = ref({ solid: "solid", dots: "dots" });
const fillTypeList = ref({ None: "none", Solid: "solid", Gradient: "gradient" });

const editerViewStore = proxy.$store.editerView.editerViewStore();
const editerListStore = proxy.$store.editerList.editerListStore();
const activeModule = computed({
  get() {
    console.log("editerViewStore :>> ", editerViewStore.activeModule);
    return editerViewStore.activeModule;
  },
  set(val: any) {
    // trigger when drag state changed if you use with `v-model:dataSource`
    // proxy.$store.editerList.editerListStore().setList(val);
    console.log("activeModule val", val);
  },
});

const selectPickerRef = ref();
const fill_type = computed({
  get: () => {
    let cfill = get(editerViewStore, "activeModule.fill.mode", "none");
    if (selectPickerRef.value) {
      selectPickerRef.value.closePopover();
    }
    return cfill;
  },
  set: (val) => {
    console.log("val", val);
    let id = get(editerViewStore, "activeModule.id", "");
    if (id) {
      editerListStore.setModuleItem({ id, "fill.mode": val }, { type: "style", description: "fill mode 修改" });
    }
  },
});

const fill_color = computed({
  get: () => {
    let cfill = get(editerViewStore, "activeModule.fill.color", "");
    return cfill;
  },
  set: (val) => {
    console.log("val", val);
  },
});
function updateModelValue(value: any) {
  console.log("updateModelValue :>> ", value);
  let id = get(editerViewStore, "activeModule.id", "");
  if (id) {
    editerListStore.setModuleItem({ id, "fill.color": value }, { type: "style", description: "fill color 修改" });
  }
}
</script>
@/components/ui/AA_kz_colorPicker
