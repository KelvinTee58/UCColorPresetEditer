<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  label?: string | number;
}>();
</script>

<template>
  <div :class="cn('whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium border-b', props.class)">
    <div v-show="label" class="">{{ label }}</div>
    <ScrollArea class="w-full rounded-md p-1" :style="{ height: 'calc(100% - 2.25rem)' }">
      <slot />
    </ScrollArea>
  </div>
</template>
