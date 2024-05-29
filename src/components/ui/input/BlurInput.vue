<script setup lang="ts">
import { type HTMLAttributes, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

// 使用 VueUse 的 useVModel 钩子创建 modelValue 的双向绑定
const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

// 用来保存输入值的临时变量，初始化为 modelValue 的值，处理可能的 undefined 情况
let tempValue = ref<string | number>(modelValue.value ?? "");

// 监听 modelValue 的变化，并在变化时更新 tempValue
watch(
  () => modelValue.value,
  (newValue) => {
    tempValue.value = newValue ?? "";
  }
);

// 更新 modelValue 的值并触发事件
const updateValue = () => {
  emits("update:modelValue", tempValue.value);
};

// 在失去焦点时更新值
const handleBlur = () => {
  updateValue();
};

// 在按下回车键时更新值
const handleEnter = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    updateValue();
  }
};
</script>

<template>
  <input
    v-model="tempValue"
    @blur="handleBlur"
    @keyup.enter="handleEnter"
    :class="
      cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  />
</template>
