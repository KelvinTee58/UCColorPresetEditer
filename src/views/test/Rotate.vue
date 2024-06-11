<template>
  <div style="width: 100%; height: 100vh" @mousemove="onRotate" @mouseup="onUp">
    <div ref="target" style="width: 300px; height: 100px; position: relative">
      <div style="width: 100%; height: 100%; background: #ff0000; color: white; font-size: 40px">测试旋转</div>
      <!-- 旋转按钮 -->
      <div class="u-rotate flex-center" @mousedown="onDown">
        <i class="iconfont icon-loading_flat"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "MoveRotate",
  setup() {
    //要旋转的目标
    const target = ref(null);

    //开始时的位置
    const centerX = ref(0);
    const centerY = ref(0);
    //当时是否在拖动鼠标
    let isDrag = false;

    //鼠标按下时
    const onDown = (e) => {
      console.log(target, e, e.x, e.y);
      centerX.value = 158;
      centerY.value = 110;
      isDrag = true;
    };

    //鼠标移动时
    const onRotate = (e) => {
      // console.log(e, e.x, e.y);
      if (isDrag == false) {
        return;
      }
      //旋转div
      let style = target.value.style;

      // 当前的鼠标坐标
      const x1 = e.clientX;
      const y1 = e.clientY;
      //三角函数
      let deg = getRotate(x1, y1);
      //console.log("deg:"+deg);
      style.transform = `rotate(${deg}deg)`;
    };

    // 获取旋转角度
    const getRotate = (pointX, pointY) => {
      if (pointX === centerX.value) {
        return pointY >= centerY.value ? 0 : 180;
      }
      if (pointY === centerY.value) {
        return pointX < centerX.value ? 90 : 270;
      }
      const x = pointX - centerX.value;
      const y = pointY - centerY.value;
      let angle = (Math.atan(Math.abs(x / y)) / Math.PI) * 180;
      // 默认从第三象限(x<0 && y>0)开始为正
      if (x < 0 && y < 0) {
        // 第二象限
        angle = 180 - angle;
      } else if (x > 0 && y < 0) {
        // 第一象限
        angle += 180;
      } else if (x > 0 && y > 0) {
        // 第四象限
        angle = 360 - angle;
      }
      let angleRange = 5;
      return [0, 90, 180, 270, 360, angle].find((deg) => Math.abs(angle - deg) < angleRange);
    };

    //鼠标松开时
    const onUp = () => {
      isDrag = false;
    };

    return {
      target,
      onRotate,
      onDown,
      onUp,
    };
  },
};
</script>

<style scoped>
.u-rotate {
  position: absolute;
  z-index: 2;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg' fill='%23757575'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle stroke='%23CCD1DA' fill='%23FFF' cx='12' cy='12' r='11.5'/%3E%3Cpath d='M16.242 12.012a4.25 4.25 0 00-5.944-4.158L9.696 6.48a5.75 5.75 0 018.048 5.532h1.263l-2.01 3.002-2.008-3.002h1.253zm-8.484-.004a4.25 4.25 0 005.943 3.638l.6 1.375a5.75 5.75 0 01-8.046-5.013H5.023L7.02 9.004l1.997 3.004h-1.26z' fill='%23000' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E");
  left: 50%;
  bottom: -34px;
  transform: translateX(-50%);
  cursor: grabbing;
}
</style>
