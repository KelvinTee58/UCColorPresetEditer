<template>
  <div style="height: 500px; width: 500px; border: 1px solid red; position: relative">
    <vue-draggable-resizable :w="100" :h="100" :parent="true">
      <p>Hello! I'm a flexible component. You can drag me around and you can resize me.</p>
    </vue-draggable-resizable>
  </div>
</template>
<style>
@import "vue-draggable-resizable/style.css";
</style>
