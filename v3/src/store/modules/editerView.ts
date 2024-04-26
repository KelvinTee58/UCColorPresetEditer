import { defineStore } from "pinia";
import { ref } from "vue";

export const useCounterStore = defineStore(
  "editerView",
  () => {
    //当前选中的module的id
    const activeModuleId = ref("");

    function setActiveModuleId(id: string) {
      activeModuleId.value = id;
    }

    return { activeModuleId, setActiveModuleId };
  },
  {
    // 添加配置开启 / 持久化存储
    persist: false,
  }
);
