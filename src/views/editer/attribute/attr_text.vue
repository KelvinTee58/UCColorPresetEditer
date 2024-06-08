<template>
  <div class="attribute_style text-left">
    <div class="_style_label border-b border-border px-2 py-2">
      <label for="radix-11-form-item" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Label</label>
      <div class="my-2 flex justify-between items-center">
        <BlurInput placeholder="font label" v-model="font_label" />
        <!-- <label for="radix-11-form-item" class="pl-2 text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PX</label> -->
      </div>
    </div>
    <div class="_style_font border-b border-border px-2 py-2">
      <label for="radix-11-form-item" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Font</label>
      <div class="my-2 flex justify-between items-center gap-x-1">
        <!-- <Select v-bind="fill_type"> -->
        <Select v-model="font_family_name">
          <SelectTrigger>
            <SelectValue placeholder="Fill Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="item.name" v-for="item in defaultFontFamilyNameList">
                <div :style="{ 'font-family': item.name }">{{ item.name }}</div>
              </SelectItem>
            </SelectGroup>
            <SelectSeparator class="h-[0.1px] m-[5px]" v-show="addFontFamilyNameList.length > 0" />
            <SelectGroup>
              <SelectItem :value="item.name" v-for="item in addFontFamilyNameList" v-show="addFontFamilyNameList.length > 0">
                <div :style="{ 'font-family': item.name }">{{ item.name }}</div>
              </SelectItem>
            </SelectGroup>
            <SelectSeparator class="h-[0.1px] m-[5px]" />
            <SelectGroup>
              <SelectItem value="FontFamilyReset">Reset</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover :open="fontPopoverOpen" :modal="true">
          <PopoverTrigger as-child>
            <Button variant="outline" size="icon" @click="openFontPopover">
              <Wrench class="h-4 w-4"></Wrench>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-80" side="left">
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Custom</h4>
                <p class="text-sm text-muted-foreground">Customizable font family</p>
              </div>
              <div>
                <TagsInput v-model="addFontFamilyNameList">
                  <TagsInputItem v-for="item in addFontFamilyNameList" :key="item" :value="item">
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>
                  <TagsInputInput placeholder="Fruits..." />
                </TagsInput>
              </div>
              <div class="grid gap-2">
                <div class="grid grid-cols-3 items-center gap-4">
                  <Label for="maxWidth">Source <BadgeHelp v-show="font_family_source === 'GoogleFonts'" class="inline-block h-4 w-4" @click="goToGoogleFont" /></Label>
                  <Select v-model="font_family_source">
                    <SelectTrigger class="w-[185px] col-span-2 h-8">
                      <SelectValue placeholder="font Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem :value="key" v-for="(value, key) in fontSource">{{ value }}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div class="grid grid-cols-3 items-center gap-4">
                  <Label for="maxWidth">Name</Label>
                  <Input id="maxWidth" type="text" class="col-span-2 h-8" v-model="font_family_custom.name" />
                </div>
                <div class="grid grid-cols-3 items-center gap-4" v-show="font_family_source === 'WebsFonts'">
                  <Label for="height">URL</Label>
                  <Input id="height" type="text" class="col-span-2 h-8" v-model="font_family_custom.url" />
                </div>
              </div>
              <div class="flex justify-end">
                <Button variant="secondary" class="mr-2" @click="cancelFontPopover()">Cancel</Button>
                <Button @click="confirmFontPopover">Confirm</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
    <div class="_style_opacity"></div>
    <div class="_style_round"></div>
  </div>
</template>
<script setup lang="ts">
import { Wrench, BadgeHelp } from "lucide-vue-next";
// import { Input } from "@/components/ui/input";
import { BlurInput, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { TagsInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from "@/components/ui/tags-input";

import { ref, getCurrentInstance, computed, onMounted } from "vue";
import { get } from "lodash";
const { proxy } = getCurrentInstance() as any;

import { FontFamily } from "@/data/structure/uuc_interface";
import { storeToRefs } from "pinia";

import propsComputed from "./js/propsComputed.ts";

const editerViewStore = proxy.$store.editerView.editerViewStore();
const editerListStore = proxy.$store.editerList.editerListStore();
const uucDataStore = proxy.$store.uucData.uucDataStore();
const uucDataStoreRefs = storeToRefs(proxy.$store.uucData.uucDataStore());

const font_label = propsComputed("label", { returnType: "string", propsDefault: "Aa" });

function Reset() {
  uucDataStore.resetFontFamilyNameList();
}
function Custom() {}

const font_family_source = ref("System");
const fontPopoverOpen = ref(false);
const font_family_custom = ref<FontFamily>({
  name: "",
  url: "",
});
const fontSource = ref({ System: "System", GoogleFonts: "Google Fonts", WebsFonts: "Webs Fonts" });
function goToGoogleFont() {
  console.log("goToGoogleFont :>> ");
  window.open("https://fonts.google.com/");
}
function openFontPopover() {
  fontPopoverOpen.value = true;
}

function cancelFontPopover() {
  fontPopoverOpen.value = false;
}
function confirmFontPopover() {
  cancelFontPopover();
  let tempFont: FontFamily;
  if (font_family_source.value == "System") {
    // tempFont = { name: font_family_custom.name, url: "" };
    tempFont = { name: font_family_custom.value.name, url: "" };
  } else if (font_family_source.value == "GoogleFonts") {
    // <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://fonts.googleapis.com/css2?family=Tiny5:wght@400;500">
    let url = `https://fonts.googleapis.com/css2?family=${font_family_custom.value.name}`;
    tempFont = { name: font_family_custom.value.name, url };
  } else {
    tempFont = font_family_custom.value;
  }
  if (tempFont.name) uucDataStore.pushFontFamilyNameList(tempFont);
}

const defaultFontFamilyNameList = ref<FontFamily[]>([
  { name: "SimHei", url: "" },
  { name: "SimSun", url: "" },
  { name: "Helvetica", url: "" },
  { name: "Times New Roman", url: "" },
]);

const addFontFamilyNameList = computed(() => {
  return uucDataStoreRefs.fontFamilyNameList.value;
});

const fontFamilyNameOption = {
  returnType: "string",
  propsDefault: "SimHei",
  setFunction: (val: string) => {
    console.log("val :>> ", val);
    if (val == "FontFamilyReset") {
      Reset();
    } else if (val == "FontFamilyCustom") {
      Custom();
    } else {
      // console.log("addFontFamilyNameList", addFontFamilyNameList);
      let familyList = [...defaultFontFamilyNameList.value, ...addFontFamilyNameList.value];
      let familyItem = familyList.find((item) => item.name === val);

      let id = get(editerViewStore, "activeModule.id", "");
      console.log("familyItem", familyList, familyItem, id);
      if (id) {
        editerListStore.setModuleItem({ id, "font.family": familyItem }, { type: "style", description: "font.family.name-修改" });
      }
    }
  },
};
const font_family_name = propsComputed("font.family.name", fontFamilyNameOption);

onMounted(() => {
  uucDataStore.mountedFontLink();
});
</script>
