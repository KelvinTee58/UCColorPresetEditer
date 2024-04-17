<!--  -->
<template>
  <div class="relative pt-20 pb-40 overflow-x-hidden overflow-y-hidden">
    <div class="relative" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" :style="{ height: getTotalTop() }">
      <h1 class="h1_container absolute left-1/2 transform" v-for="index in h1Count" :key="index" :style="{ opacity: getOpacity(index), top: getTop(index) }">UC.camera</h1>
      <Button variant="outline" class="absolute left-1/2 top-1/2 nextButton transform" v-show="isHover" @click="nextClick"> {{ $t("views.index.index.next") }} </Button>
    </div>
  </div>
</template>

<script setup>
import { Button } from "@/components/ui/button";
import { ref } from "vue";
const h1Count = ref(8);
const isHover = ref(false);
function getOpacity(index) {
  // index从0到9，我们需要将其映射到1到0的透明度
  // 1 - (index / 9) 将0映射到1，将9映射到0，并且随着index增大，透明度逐渐减小
  // return 1 - index / 10;
  let Opacity = 1 - (0.9 / h1Count.value) * (index - 1);
  return isHover.value ? 0.1 : Opacity;
}
function getTop(index) {
  let topValue = 7 * (index - 1) + 2;
  return topValue + "rem";
}
function getTotalTop() {
  let topValue = 7 * (h1Count.value - 1) + 2;
  return topValue + "rem";
}

function handleMouseEnter() {
  isHover.value = true;
}
function handleMouseLeave() {
  isHover.value = false;
}

import { useRouter } from "vue-router";
const router = useRouter();
function nextClick() {
  router.push("/test");
}
</script>
<style lang="scss" scoped>
h1 {
  font-size: 15rem;
  line-height: 15rem;
  display: inline-block;
  // transform: translate(-50%, -50%);
}
.h1_container:hover {
  orphans: 0.1;
}
.nextButton {
  width: 10rem;
  line-height: 8rem;
  border-radius: 10rem;
  letter-spacing: 0.4rem;
  text-indent: 0.4rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bolder;
}
.transform {
  transform: translate(-50%, -50%);
}

//@import url(); 引入公共css类
</style>
