import { defineStore } from "pinia";
import { ref } from "vue";
import { uucBlock, uucImage, uucFont } from "@/data/structure/uuc";
import { v4 as uuidv4 } from "uuid";
import { forIn, get, has, set } from "lodash";

// import { set } from "@vueuse/core";
// import { computed, ref, reactive } from "vue";

interface editerRecords {
  r_id: string;
  id: string;
  recordObject: any;
  modifyObject: any;
  modifyType: any;
}

interface MyObject {
  [key: string]: unknown;
}

export const useCounterStore = defineStore(
  "editerList",
  () => {
    // 数据列表
    const editerList: any = ref([]);
    // 操作记录
    const editerListRecords = ref<editerRecords[]>([]);
    function pushList(value: any) {
      editerList.value.push(value);
    }
    function getList() {
      return editerList.value;
    }
    function setList(value: Array<uucBlock>) {
      editerList.value = [...value];
    }
    function resetList() {
      editerList.value = [];
    }

    /**
     * 添加编辑列表的一项
     * @param value
     */
    function addModuleItem(value: any) {
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
      let classContent = value.content;
      const level = editerList.value.length;
      let newItem: uucBlock | undefined = undefined;
      const labelName = classContent.label ? classContent.label : level + value.name;
      if (classContent.type == "block") {
        newItem = new uucBlock({
          ...classContent,
          level,
          axis: defaultAxis,
          label: labelName,
        });
      } else if (classContent.type == "image") {
        newItem = new uucImage({
          ...classContent,
          level,
          axis: defaultAxis,
          label: labelName,
          src: "666",
        });
      } else if (classContent.type == "font") {
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
        let el = JSON.parse(JSON.stringify(newItem));

        // 当前的操作逻辑是创建（create）逻辑
        pushRecord(el.id, {}, el, { type: "create", description: "创建" });
      }
      // console.log(editerList.list);
    }

    function removeModuleItem(id: string, modifyType: any) {
      let el = JSON.parse(JSON.stringify(editerList.value));
      let recordObject: MyObject = {};

      for (let index = 0; index < el.length; index++) {
        // 匹配到id对应的
        if (el[index].id === id) {
          recordObject = el[index];
          // 记录当前的操作逻辑是删除（delete）逻辑
          editerList.value.splice(index, 1);
          pushRecord(String(recordObject.id), recordObject, {}, modifyType);
        }
      }
    }

    /**
     * 根据指定的id和key，设置value
     * @param id 修改对应的信息的id
     * @param modifyObject 修改信息
     * @param modifyType 记录的详细内容
     */
    function setModuleItem(id: string, modifyObject: MyObject, modifyType: any) {
      let el = JSON.parse(JSON.stringify(editerList.value));
      let recordObject: MyObject = {};
      let newObject: MyObject = {};

      // 遍历编辑器列表逻辑
      for (let index = 0; index < el.length; index++) {
        // 匹配到id对应的
        if (el[index].id === id) {
          forIn(modifyObject, function (value, key) {
            // console.log(value, key, has(el[index], key), el[index]);
            let recordValue = get(el[index], key, value);
            if (has(el[index], key) && recordValue !== value) {
              recordObject[key] = recordValue;
              newObject[key] = value;
              set(editerList.value[index], key, value);
            }
          });
        }
      }
      if (Object.getOwnPropertyNames(recordObject).length) pushRecord(id, recordObject, newObject, modifyType);
    }

    /**
     * 根据指定的id和key，记录新数据和旧数据
     * @param id 指定的id
     * @param key 指定的key
     * @param new_value 新数据
     * @param old_value 旧数据
     * @param type 记录类型
     * @param typeDescription 记录的详细内容
     */
    function pushRecord(id: string, recordObject: MyObject, modifyObject: MyObject, modifyType: MyObject) {
      let record: editerRecords = {
        r_id: uuidv4(),
        id,
        recordObject,
        modifyObject,
        modifyType,
      };
      editerListRecords.value.push(record);
      console.log("editerListRecords :>> ", editerListRecords.value, editerList.value);
    }

    /**
     * 后退一个记录逻辑
     */
    function cancelRecord() {}

    return { editerList, resetList, setList, getList, addModuleItem, removeModuleItem, setModuleItem, cancelRecord };
  },
  {
    // 添加配置开启 / 持久化存储
    persist: true,
  }
);
