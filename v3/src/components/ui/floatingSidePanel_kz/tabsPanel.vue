<script setup lang="ts">
import { Tabs, Tab } from "../tab_kz";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/vue";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MyObject {
  [key: string]: unknown;
}

const props = defineProps<{
  class?: HTMLAttributes["class"];
  labelList?: list<MyObject>;
}>();
</script>

<template>
  <div :class="cn('z-[40] rounded-lg border bg-card text-card-foreground shadow-sm border-border', props.class)">
    <Tabs class="h-full w-full">
      <Tab :value="labelItem.name" v-for="labelItem in labelList" class="select-none w-full mt-0" :style="{ height: 'calc(100% - 2.25rem)' }">
        <template #icon>
          <Icon :icon="labelItem.icon" v-if="labelItem.icon" class="h-[0.9em] w-[0.9rem] mr-1" />
        </template>
        <ScrollArea class="w-full p-1 h-full h-full">
          <slot :name="labelItem.name" />
        </ScrollArea>
      </Tab>
    </Tabs>
  </div>
</template>
