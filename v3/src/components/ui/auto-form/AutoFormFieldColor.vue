<script setup lang="ts">
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { beautifyObjectName } from "./utils";
import AutoFormLabel from "./AutoFormLabel.vue";
import type { FieldProps } from "./interface";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { Vue3ColorPicker } from "@cyhnkckali/vue3-color-picker";
import "@cyhnkckali/vue3-color-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useColorMode } from "@vueuse/core";
const mode = useColorMode();

import { Palette } from "lucide-vue-next";
function getBackgroundColor(color: string) {
  if (color) {
    return color;
  } else {
    return "#00000000";
  }
}

defineProps<FieldProps>();

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <div>
            <Popover>
              <PopoverTrigger as-child :disabled="disabled">
                <Button variant="outline" :class="cn('w-full justify-between text-left font-normal', !slotProps.componentField.modelValue && 'text-muted-foreground')">
                  <div class="flex justify-end items-center">
                    <Palette class="mr-2 h-4 w-4" :size="16" />
                    {{ slotProps.componentField.modelValue ? slotProps.componentField.modelValue : "Pick a Color" }}
                  </div>
                  <div class="ml-2 h-4 w-4 border rounded-sm" :style="{ 'background-color': getBackgroundColor(slotProps.componentField.modelValue) }" :size="16"></div>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-2 colorPicker">
                <!-- <Calendar initial-focus v-bind="slotProps.componentField" /> -->
                <Vue3ColorPicker v-bind="slotProps.componentField" mode="solid" :theme="mode" />
              </PopoverContent>
            </Popover>
          </div>
        </slot>
      </FormControl>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
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
</style>
