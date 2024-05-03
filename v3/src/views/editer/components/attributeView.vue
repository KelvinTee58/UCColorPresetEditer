<template>
  <uucBlockAttribute v-bind="$props" v-if="type == 'block'"></uucBlockAttribute>
  <uucImageAttribute v-bind="$props" v-if="type == 'image'"></uucImageAttribute>
  <uucFontAttribute v-bind="$props" v-if="type == 'font'"></uucFontAttribute>
</template>

<script setup>
import { uucBlockAttribute, uucImageAttribute, uucFontAttribute } from "../attribute";
import { defineProps } from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
