<script setup lang="ts">
import { Tabs, Tab } from "../AA_kz_tab";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/vue";
import { ScrollArea } from "../scroll-area";
import { type HTMLAttributes } from "vue";

interface LabelList {
  name: string;
  icon: string;
}

const props = defineProps<{
  class?: HTMLAttributes["class"];
  labelList?: Array<LabelList>;
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
../AA_kz_tab
