import { defineStore } from "pinia";
import { ref } from "vue";
import { get } from "lodash";
import { MyObject } from "@/data/structure/uuc_interface";
import { editerListStore } from "./editerList.ts";

// import { uucBlock } from "@/data/structure/uuc";

export const editerViewStore = defineStore(
  "editerView",
  () => {
    //当前选中的module的id
    const activeModuleId = ref("");
    const activeModule = ref<MyObject>({});

    function setActiveModule(modules: MyObject) {
      activeModule.value = modules;
      activeModuleId.value = String(modules.id);
    }

    function getActiveModuleProps(key: string) {
      return get(activeModule.value, key, "");
    }

    function editerModule(module: MyObject = activeModule.value) {
      // console.log("editerListStore", editerListStore());
      // console.log("editerListStore", module);
      editerListStore().setModuleItem(module, { type: "edit", description: "修改" });
    }

    return { activeModule, activeModuleId, setActiveModule, getActiveModuleProps, editerModule };
  },
  {
    // 添加配置开启 / 持久化存储
    persist: false,
  }
);
