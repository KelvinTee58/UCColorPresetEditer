<template>
  <div class="pb-2 flex justify-center">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>{{ module.name }}</CardTitle>
        <CardDescription v-if="module.description">{{ module.description }}</CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center">
        <div class="w-32 h-32 border rounded p-3">
          <moduleView v-bind="$props"></moduleView>
        </div>
      </CardContent>
      <CardFooter class="flex justify-start px-6 pb-6">
        <Button variant="outline" @click="AddDraggable"> ADD </Button>
      </CardFooter>
    </Card>
  </div>
</template>
<script setup>
import moduleView from "./moduleView.vue";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { defineProps, getCurrentInstance } from "vue";
import { Button } from "@/components/ui/button";
const { proxy } = getCurrentInstance();

const props = defineProps({
  module: {
    type: Object,
    required: true,
  },
});
function AddDraggable() {
  proxy.$store.editerList.useCounterStore().addModuleItem(props.module);
}
</script>

<style lang="scss" scoped></style>
