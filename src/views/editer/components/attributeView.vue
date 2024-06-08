<template>
  <!-- <uucBlockAttribute v-bind="$props" :module="activeModule" v-if="activeModuleType == 'block'"></uucBlockAttribute> -->
  <uucBlockAttribute :module="activeModule" v-if="activeModuleType == 'block'"></uucBlockAttribute>
  <uucImageAttribute :module="activeModule" v-if="activeModuleType == 'image'"></uucImageAttribute>
  <uucFontAttribute :module="activeModule" v-if="activeModuleType == 'font'"></uucFontAttribute>
</template>

<script setup lang="ts">
import { uucBlockAttribute, uucImageAttribute, uucFontAttribute } from "../attribute";
// import {  getCurrentInstance, computed } from "vue";
import { getCurrentInstance, computed } from "vue";
// import { storeToRefs } from "pinia";
const { proxy } = getCurrentInstance() as any;

// const props = defineProps({
// type: {
//   type: String,
//   required: true,
// },
// });

// const editerViewStoreRefs = storeToRefs(proxy.$store.editerView.editerViewStore());
const editerViewStore = proxy.$store.editerView.editerListStore();
console.log("editerViewStore.activeModule", editerViewStore.activeModule);

const activeModuleType = computed({
  get() {
    return editerViewStore.getActiveModuleProps("type");
  },
  set() {},
});

const activeModule = computed({
  get() {
    console.log("activeModule", activeModule);
    return editerViewStore.activeModule;
  },
  set() {},
});
</script>

<style lang="scss" scoped></style>
