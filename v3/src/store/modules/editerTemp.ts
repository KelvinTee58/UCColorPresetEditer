import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { uucBlock, uucImage, uucFont } from "@/data/structure/uuc";
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

    interface axis {
      x: number;
      y: number;
    }

    interface fontStyle {
      size: number;
      color: string;
      family: string;
      familyName: string;
      style: string;

      // # style
      // normal	默认值，文本以正常字体显示
      // italic	文本以斜体显示
      // oblique	文本倾斜显示
      // inherit	从父元素继承字体样式

      weight: string;
      // # weight
      // normal	默认值，标准字体
      // bold	粗体字体
      // bolder	更粗的字体
      // lighter	更细的字体
    }

    // 默认初始到页面上的位置
    const defaultAxis: axis = { x: 10, y: 10 };

    // 添加到layer和添加到draggable中
    function addEditerModulesList(value: any) {
      console.log("Function called from Grandparent", editerList);
      let classContent = value.content;
      const level = editerList.value.length;
      let newItem: uucBlock | undefined = undefined;
      const labelName = classContent.label ? classContent.label : level + value.name;
      if (value.type == "block") {
        newItem = new uucBlock({
          ...classContent,
          level,
          axis: defaultAxis,
          label: labelName,
        });
      } else if (value.type == "image") {
        newItem = new uucImage({
          ...classContent,
          level,
          axis: defaultAxis,
          label: labelName,
          src: "666",
        });
      } else if (value.type == "font") {
        const defaultFont: fontStyle = {
          size: 10,
          color: "#000000",
          family: "",
          familyName: "黑体",
          style: "normal",
          weight: "normal",
        };
        newItem = new uucFont({
          ...classContent,
          level,
          axis: defaultAxis,
          label: labelName,
          font: defaultFont,
        });
      }
      if (newItem && newItem.type) {
        pushList(newItem);
      }
      // console.log(editerList.list);
    }

    return { getTemporaryStorage, editerList, resetList, setList, getList, addEditerModulesList };
  },
  {
    // 添加配置开启 / 持久化存储
    persist: true,
  }
);
