<template>
  <div class="pages">
    <div class="vdrWrapper">
      <vdr
        :w="100"
        :h="100"
        v-on:dragging="onDrag"
        v-on:resizing="onResize"
        :parent="true"
      >
        <p>
          Hello! I'm a flexible component. You can drag me around and you can
          resize me.<br />
          X: {{ x }} / Y: {{ y }} - Width: {{ width }} / Height: {{ height }}
        </p>
      </vdr>
      <vdr
        :w="200"
        :h="200"
        :parent="true"
        :debug="false"
        :min-width="200"
        :min-height="200"
        :isConflictCheck="true"
        :snap="true"
        :snapTolerance="20"
      >
      </vdr>
    </div>
  </div>
</template>

<script>
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
export default {
  name: "EditerIndex",
  components: { vdr },
  data: function () {
    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    };
  },
  methods: {
    onResize: function (x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    onDrag: function (x, y) {
      this.x = x;
      this.y = y;
    },
  },
};
</script>
<style lang="scss" scoped>
.pages {
  .vdrWrapper {
    height: 500px;
    width: 500px;
    border: 1px solid #00ff00;
    position: relative;
  }
}
</style>
