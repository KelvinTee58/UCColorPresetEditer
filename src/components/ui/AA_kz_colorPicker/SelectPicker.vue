<script setup lang="ts">
import { type HTMLAttributes, ref, defineExpose } from "vue";
import { useVModel } from "@vueuse/core";

import { Vue3ColorPicker } from "@cyhnkckali/vue3-color-picker";
import "@cyhnkckali/vue3-color-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useColorMode } from "@vueuse/core";
const colorMode = useColorMode();

import { Palette } from "lucide-vue-next";

export type Mode = "gradient" | "solid";

interface Props {
  disabled?: boolean;
  value?: string;
  mode?: Mode; //solid or gradient default gradient
  placeholder?: string;

  showColorList?: boolean; //default true
  showEyeDrop?: boolean; //default true Supports Chrome and Edge only
  showAlpha?: boolean; //default true
  showInputMenu?: boolean; //default true
  showInputSet?: boolean; //default true
  class?: HTMLAttributes["class"];
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "gradient",
  showColorList: true, //default true
  showEyeDrop: true, //default true Supports Chrome and Edge only
  showAlpha: true, //default true
  showInputMenu: true, //default true
  showInputSet: true, //default true
  cancelButtonLabel: "Cancel",
  confirmButtonLabel: "Confirm",
  placeholder: "Pick a Color",
});

const emits = defineEmits<{
  (e: "update:value", payload: string): void;
  (e: "cancel"): void;
}>();

const modelValue = useVModel(props, "value", emits, {
  passive: true,
});

const pickerModelValue = ref("");

function openPopover() {
  pickerModelValue.value = props.value || "";
  switchPopver(true);
}
function closePopover() {
  if (popoverOpen) switchPopver(false);
}

function updateData(value: string) {
  modelValue.value = value;
  switchPopver(false);
}

function cancel() {
  closePopover();
  emits("cancel");
}

const popoverOpen = ref(false);
function switchPopver(isOpen: boolean) {
  popoverOpen.value = isOpen;
}

defineExpose({
  closePopover,
});
</script>

<template>
  <Popover :open="popoverOpen">
    <!-- <PopoverTrigger as-child :disabled="props.disabled"> -->
    <PopoverTrigger as-child>
      <Button variant="outline" @click="openPopover" :class="cn('w-full justify-between text-left font-normal', !modelValue && 'text-muted-foreground')">
        <div class="flex justify-end items-center">
          <Palette class="mr-2 h-4 w-4" :size="16" />
          <div class="text-ellipsis overflow-hidden whitespace-nowrap w-32 inline-block">{{ modelValue ? modelValue : props.placeholder }}</div>
        </div>
        <div class="ml-2 h-4 w-4 relative">
          <div class="t-0 l-0 h-4 w-4 border rounded-sm markBg absolute z-10" :size="16"></div>
          <div class="t-0 l-0 h-4 w-4 border rounded-sm absolute z-20" :size="16" :style="{ background: modelValue ? modelValue : '#00000000' }"></div>
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-2 colorPicker">
      <Vue3ColorPicker
        :showColorList="showColorList"
        :showEyeDrop="showEyeDrop"
        :showAlpha="showAlpha"
        :showInputMenu="showInputMenu"
        :showInputSet="showInputSet"
        v-model="pickerModelValue"
        :mode="props.mode"
        :theme="colorMode == 'auto' ? 'light' : colorMode"
        :class="cn('w-full rounded-md ', props.class)"
      />
      <div class="flex justify-end">
        <Button variant="secondary" class="mr-2" @click="cancel()">{{ props.cancelButtonLabel }}</Button>
        <Button @click="updateData(pickerModelValue)">{{ props.confirmButtonLabel }}</Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
<
<style lang="scss">
.colorPicker {
  .ck-cp-container {
    background-color: hsl(var(--popover));
    box-shadow: none;
  }
  .colour-area-mask {
    border: 1px solid hsl(var(--border));
  }
}
.markBg {
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.18) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.18) 75%, rgba(0, 0, 0, 0.18) 0px) 0px 0px / 14px 14px repeat padding-box border-box,
    linear-gradient(45deg, rgba(0, 0, 0, 0.18) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.18) 75%, rgba(0, 0, 0, 0.18) 0px) 7px 7px / 14px 14px repeat padding-box border-box, white;
}
</style>
