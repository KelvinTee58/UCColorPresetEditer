import { defineStore } from "pinia";
import { ref } from "vue";
import { get } from "lodash";

import { uucBlock } from "@/data/structure/uuc";

export const useCounterStore = defineStore(
  "editerView",
  () => {
    //当前选中的module的id
    const activeModuleId = ref("");
    const activeModule = ref({});

    function setActiveModule(modules: uucBlock) {
      activeModule.value = modules;
      activeModuleId.value = modules.id;
    }

    function getActiveModuleProps(key: string) {
      console.log("activeModule", get(activeModule.value, key, ""));
      return get(activeModule.value, key, "");
    }

    return { activeModule, activeModuleId, setActiveModule, getActiveModuleProps };
  },
  {
    // 添加配置开启 / 持久化存储
    persist: false,
  }
);
