import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { uucBlock } from "@/data/structure/uuc";
// import { computed, ref, reactive } from "vue";

export const useCounterStore = defineStore(
  "editerTemp",
  () => {
    // const isTemporaryStorage = ref(true);
    const editerList: any = ref([]);
    const getTemporaryStorage = computed(() => editerList.value.length > 0);

    function pushList(value: any) {
      editerList.value.push(value);
    }
    function getList() {
      return editerList.value;
    }

    function setList(value: array<uucBlock>) {
      editerList.value = [...value];
      console.log("setList", value);
    }
    function resetList() {
      editerList.value = [];
    }

    // const count = ref(0);

    // function increment() {
    //   count.value++;
    // }

    return { getTemporaryStorage, editerList, resetList, pushList, setList, getList };
  },
  {
    // 添加配置开启 / 持久化存储
    persist: true,
  }
);
