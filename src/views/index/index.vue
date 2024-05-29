<!--  -->
<template>
  <div class="relative h-full-container w-screen overflow-x-hidden overflow-y-hidden">
    <div class="relative h-full">
      <!-- <h1 class="h1_container absolute left-1/2 transform" v-for="index in h1Count" :key="index" :style="{ opacity: getOpacity(index), top: getTop(index) }">UC.camera</h1> -->
      <div class="absolute transform left-1/2 top-1/2" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <h1 class="h1_size h1_container relative ts" v-for="index in h1Count" :key="index" :style="{ opacity: getOpacity(index) }">UC.camera</h1>
      </div>
      <Button variant="outline" class="absolute left-1/2 top-1/2 nextButton transform" v-show="isHover" @click="nextClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        {{ $t("views.index.index.next") }}
      </Button>
    </div>
  </div>
</template>

<script setup>
import { Button } from "@/components/ui/button";
import { ref, onMounted, onUnmounted } from "vue";
const h1Count = ref(8);
const isHover = ref(false);
function getOpacity(index) {
  // index从0到9，我们需要将其映射到1到0的透明度
  // 1 - (index / 9) 将0映射到1，将9映射到0，并且随着index增大，透明度逐渐减小
  // return 1 - index / 10;
  let Opacity = 1 - (0.9 / h1Count.value) * (index - 1);
  return isHover.value ? 0.1 : Opacity;
}
// function getTop(index) {
//   let topValue = 4 * (index - 1) + 2;
//   return topValue + "rem";
// }
// function getTotalTop() {
//   let topValue = 4 * (h1Count.value - 1) + 2;
//   return topValue + "rem";
// }

function handleMouseEnter() {
  isHover.value = true;
}
function handleMouseLeave() {
  isHover.value = false;
}

function updateMode() {
  let isMobile = window.innerWidth < 993;
  let isLandscape = window.matchMedia("(orientation: landscape)").matches;
  console.log("isMobile", isMobile, isLandscape, isMobile && !isLandscape);
  if (isMobile && !isLandscape) {
    h1Count.value = 16;
  } else {
    h1Count.value = 8;
  }
}

onMounted(() => {
  updateMode();
  window.addEventListener("resize", updateMode);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateMode);
});

import { useRouter } from "vue-router";
const router = useRouter();
function nextClick() {
  router.push("/editer");
}
</script>
<style lang="scss" scoped>
.ts {
  // transform: rotateX(74deg);
  // background-image: radial-gradient(circle at 50% 50%, rgb(0, 0, 0) 0%, rgb(255, 255, 255) 100%);
}
h1 {
  display: inline-block;
}
.h1_size {
  font-size: 10rem;
  line-height: 1rem;
}
/* Small (sm) */
@media (min-width: 640px) {
  /* ... */
  .h1_size {
    font-size: 8rem;
  }
}

/* Medium (md) */
@media (min-width: 768px) {
  /* ... */
  .h1_size {
    font-size: 6rem;
  }
}

/* Large (lg) */
@media (min-width: 1024px) {
  /* ... */
  .h1_size {
    font-size: 11rem;
  }
}

/* Extra Large (xl) */
@media (min-width: 1280px) {
  /* ... */
  .h1_size {
    font-size: 12rem;
  }
}

/* Extra Large (xl) */
@media (min-width: 1920px) {
  /* ... */
  .h1_size {
    font-size: 16rem;
  }
}

.h1_container:hover {
  orphans: 0.1;
}
.nextButton {
  width: 10rem;
  height: 10rem;
  line-height: 10rem;
  border-radius: 10rem;
  letter-spacing: 0.4rem;
  text-indent: 0.4rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bolder;
  margin-top: -1.7rem;
}
.transform {
  transform: translate(-50%, -50%);
}

//@import url(); 引入公共css类
</style>
