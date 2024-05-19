<script setup lang="ts">
import { ScrollArea } from "../scroll-area";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  label?: string | number;
}>();
</script>

<template>
  <div :class="cn('z-[40] rounded-lg border bg-card text-card-foreground shadow-sm', props.class)">
    <div v-show="label" class="whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium border-b">{{ label }}</div>
    <ScrollArea class="w-full rounded-md p-1" :style="{ height: 'calc(100% - 2.25rem)' }">
      <slot />
    </ScrollArea>
  </div>
</template>
