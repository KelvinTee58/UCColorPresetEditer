// Dropdown.vue
<template>
  <div class="dropdown">
    <ul>
      <li v-for="(tab, index) in tabs" :key="index">
        <a @click="handleClick(tab)">{{ tab.label }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

interface Props {
  tabs: any[];
}

const props = defineProps<Props>();

function handleClick(tab: any) {
  // emit 事件到父组件
  // emit("click", tab);
}
</script>
