<template>
  <viewer class="editer_index h-full-container">
    <template v-slot="scope">
      <div class="zzcontainer content" :style="{ transform: scope.transform }">
        <img style="width: 300px" src="/images/error-page/error-404.png" />
      </div>
    </template>
  </viewer>
</template>
template

<script lang="ts" setup>
import viewer from "./components/viewer.vue";
</script>

<style lang="scss">
.editer_index {
  width: 100%; /* 视口宽度 */
  // height: 100vh; /* 视口高度 */
  overflow: hidden; /* 隐藏超出部分 */
  // transform-origin: center center;
  .zzcontainer {
    background-color: hsl(var(--background));
    background-image: linear-gradient(hsl(var(--border)) 2px, transparent 0), linear-gradient(90deg, hsl(var(--border)) 2px, transparent 0), linear-gradient(hsl(var(--border)) 1px, transparent 0),
      linear-gradient(90deg, hsl(var(--border)) 1px, transparent 0);
    background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
    background-position: -2px -2px;
    outline: 2px solid hsl(var(--border));
  }

  .content {
    width: 1805px; /* 大容器宽度 */
    height: 800px; /* 大容器高度 */
    transition: transform 0.3s ease;
    left: 1600px;
    top: 800px;
    // overflow: hidden; /* 隐藏超出部分 */
    // transform-origin: center center;
  }
}
</style>
