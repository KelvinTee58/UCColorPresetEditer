<!--  -->
<template>
  <h1>test{{$store.test.useCounterStore().count}}</h1>
  <h1>test{{ count }}test</h1>
  <button @click="increment">add</button>
  <button @click="$store.test.useCounterStore().increment">add2</button>
  <button @click="testApi">testapi</button>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
  <h1>test</h1>
</template>

<script setup>
import { getCurrentInstance,ref } from "vue";
import { storeToRefs } from "pinia";
const { proxy } = getCurrentInstance();
let store = proxy.$store.test.useCounterStore();
console.log("store", store);
let { count } = storeToRefs(store);
let {increment} = store
async function testApi(){
  let res = ref(null);
  // console.log("api", proxy.$api.test1);
  res = proxy.$api.test1.time();
}

console.log("count", count);
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
</style>
