<template>
  <div>
    <!--普通用法-->
    <Viewport>
      <template v-slot="scope">
        <img style="width: 100%" :style="{ transform: scope.transform }" src="/images/error-page/error-404.png" />
      </template>
    </Viewport>

    <!--SVG用法-->
    <Viewport tag="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="3200" height="1800" v-model:transform="transform">
      <g :transform="`translate(${transform.translateX},${transform.translateY}) scale(${transform.scale})`">
        <image width="3200" height="1800" href="/images/error-page/error-404.png" />
      </g>
    </Viewport>
  </div>
</template>
<script>
import { shallowRef } from "@vue/reactivity";
import Viewport from "./components/viewer.vue";

export default {
  setup() {
    const transform = shallowRef({});
    return {
      transform,
    };
  },
  components: { Viewport },
};
</script>
<style lang="scss" scoped>
.viewport {
  width: 90vw;
  height: 40vh;
  margin-left: 10vw;
  margin-top: 5vh;
  display: block;
}
</style>
